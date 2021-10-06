import { createServer } from 'http';
import { lookup } from 'mime-types';
import { connectTCPTunnel } from './websocket_tcp_tunnel.js';
import { extname, join } from 'path';
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
        console.log(chunks);
        resolve(JSON.parse(result));
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
}

/**
 * Start the web server.
 *
 * @param {object} config
 * @param {number} config.port
 *      HTTP Port to use.
 * @param {Map<string:object>} destinations
 *      Map containing TCP forwarding destinations. WebSocket connections to
 *      the path `/_control/<NAME>` will attempt to forward to the destination
 *      with the name `<NAME>`.
 */
export default async function start(config, destinationsAdapter) {
  // FIXME
  const token = "random_secret";
  const htdocs = config.htdocs;

  const addedDestinations = new Map();

  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost/');
    let path = decodeURI(url.pathname);

    if (path === '') {
      path = '/';
    }

    if (path.endsWith('/')) {
      path += 'index.html';
    }

    switch (path) {
      case '/_control_token':
        return txt(websocketToken);
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
  });

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
        const destinationName = url.substr(controlPrefix.length);

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

  return new Promise((resolve) => {
    server.listen(config.port, () => {
      resolve();
    });
  });
}
