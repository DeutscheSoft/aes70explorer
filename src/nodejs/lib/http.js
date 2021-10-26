import { createServer } from 'http';
import { lookup } from 'mime-types';
import { connectTCPTunnel } from './websocket_tcp_tunnel.js';
import { extname, join } from 'path';
import { randomFillSync } from 'crypto';
import WS from 'ws';
import fs from 'fs';
const { readFile, stat } = fs.promises;

const controlPrefix = '/_control/';
const destinationsPath = '/_api/destinations';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    const firstChunk = req.read();

    if (firstChunk !== null)
      chunks.push(firstChunk);

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const result = chunks.join('');
        resolve(JSON.parse(result));
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
}

function generateRandomToken() {
  const buffer = Buffer.alloc(16);
  randomFillSync(buffer);
  return buffer.toString('hex');
}

function handleError(cb) {
  return (req, res) => {
    try {
      return cb(req, res);
    } catch (err) {
      res.writeHead(503, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error', 'utf-8');
      console.error('HTTP error: %o', err);
    }
  };
}

/**
 * Start the web server.
 *
 * @param {object} config
 * @param {number} config.port
 *      HTTP Port to use.
 * @param {string} config.host
 *      HTTP host or IP to bind to.
 * @param {object} config.capabilities
 *      Capability object.
 * @param {Map<string:object>} destinations
 *      Map containing TCP forwarding destinations. WebSocket connections to
 *      the path `/_control/<NAME>` will attempt to forward to the destination
 *      with the name `<NAME>`.
 */
export default async function start(config, destinationsAdapter) {
  let token = generateRandomToken();
  const htdocs = config.htdocs;
  const capabilities = config.capabilities || {};

  const addedDestinations = new Map();

  setInterval(() => {
    token = generateRandomToken();
  }, 20 * 1000);

  const server = createServer(handleError((req, res) => {
    const url = new URL(req.url, 'http://localhost/');
    let path = decodeURI(url.pathname);

    if (path === '') {
      path = '/';
    }

    if (path.endsWith('/')) {
      path += 'index.html';
    }

    const headers = {
      'Cache-Control': 'no-store',
    };

    const respond = (data, code, headers) => {
      if (!code) code = 200;
      res.writeHead(code, headers);
      res.end(data, 'binary');
    };

    const txt = (data, code) => {
      respond(
        data,
        code,
        Object.assign(headers, { 'Content-Type': 'text/plain' })
      );
    };

    const json = (data, code) => {
      respond(
        JSON.stringify(data),
        code,
        Object.assign(headers, { 'Content-Type': 'application/json' })
      );
    };

    const notFound = () => {
      return txt('Not found.', 404);
    };

    const serveFiles = async (path, req, res) => {
      const fname = join(htdocs, path);

      if (!fname.startsWith(htdocs)) {
        return txt('', 404);
      }

      try {
        const data = await readFile(fname, { encoding: 'binary' });
        return respond(
          data,
          200,
          Object.assign(headers, { 'Content-Type': lookup(extname(fname)) })
        );
      } catch (err) {}

      try {
        const stats = await stat(fname);

        if (stats.isDirectory()) {
          return respond(
            '',
            302,
            Object.assign(headers, { Location: path + '/' })
          );
        }
      } catch (err) {}

      console.log('HTTP 404 - %o not found in %o.', path, htdocs);

      return notFound();
    };

    switch (req.method) {
    case 'GET':
      switch (path) {
      case '/_api/capabilities':
          return json(capabilities);
      case '/_api/token':
          return txt(token);
      case '/_api/destinations':
          return json(destinationsAdapter.getDestinations());
      }
      break;
    case 'PUT':
      {
        const invalid = () => {
          return json({ ok: false, error: 'Invalid request.' });
        };

        if (path.startsWith(destinationsPath)) {
          if (!capabilities.manual_devices)
            return invalid();

          const name = path.substr(destinationsPath.length + 1);

          readJsonBody(req).then((destination) => {
            if (typeof destination !== 'object')
              return invalid();

            destination.name = name;
            destination.source = 'manual';

            if (destinationsAdapter.hasDestination(name)) {
              return json({ ok: false, error: "Destination does already exist." });
            }

            const unsubscribe = destinationsAdapter.addDestination(destination);

            addedDestinations.set(name, unsubscribe);

            return json({ ok: true });
          }).catch((err) => {
            return json({ ok: false, error: err.toString() });
          });
          return;
        }
      }
      return txt('Not found.', 404);
    case 'DELETE':
      {
        if (path.startsWith(destinationsPath)) {
          if (!capabilities.manual_devices)
            return invalid();
          const name = path.substr(destinationsPath.length + 1);
          const unsubscribe = addedDestinations.get(name);

          if (!unsubscribe)
            return notFound();

          addedDestinations.delete(name);
          unsubscribe();

          return json({ ok: true });
        }
      }
      return notFound();
    default:
      return notFound();
    }

    serveFiles(path, req, res).catch((err) => {
      txt('Internal server error.', err);
      console.error(err);
    });
  }));

  const wss = new WS.Server({
    clientTracking: false,
    noServer: true,
  });

  server.on('upgrade', async (request, socket, head) => {
    try {
      let destination;
      const url = request.url;

      if (url.startsWith(controlPrefix))
      {
        const tmp = url.substr(controlPrefix.length).split('?');

        if (tmp.length !== 2 || tmp[1] !== token)
          throw new Error('Bad token.');

        const destinationName = tmp[0];

        destination = destinationsAdapter.getDestination(destinationName);
      }

      if (!destination)
        throw new Error('Unknown destination: ' + url);

      const connectOptions = {
        host: destination.host,
        port: destination.port,
      };

      console.log('Connecting to %o', connectOptions);
      await connectTCPTunnel(connectOptions, () => {
        return new Promise((resolve) => {
          wss.handleUpgrade(request, socket, head, resolve);
        });
      });
    } catch (err) {
      console.warn('Setting up tcp tunnel failed: %o', err);
      socket.destroy();
      return;
    }
  });

  server.on('error', (err) => {
    console.error('HTTP server error: %o', err);
  });

  wss.on('error', (err) => {
    console.error('WS server error: %o', err);
  });

  const listen = (port) => {
    const options = { port };

    if (config.host) {
      options.host = config.host;
    }

    return new Promise((resolve, reject) => {
      const onError = (err) => reject(err);
      server.on('error', onError);
      server.listen(options, () => {
        server.off('error', onError);
        resolve(server.address());
      });
    });
  };

  let startP = listen(config.port);

  if (config.portFallback) {
    startP = startP.catch((err) => {
      return listen(0);
    });
  }

  return startP;
}
