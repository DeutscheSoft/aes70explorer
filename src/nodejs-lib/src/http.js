import { createServer } from 'http';
import { lookup } from 'mime-types';
import { connectTCPTunnel } from './websocket_tcp_tunnel.js';
import { extname, join, dirname } from 'path';
import WS from 'ws';
import fs from 'fs';
const { readFile, stat } = fs.promises;

const controlPrefix = "/_control/";

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
export default async function start(config, destinations) {
  // FIXME
  const token = "random_secret";
  const htdocs = config.htdocs;

  const server = createServer(async (req, res) => {
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

    switch (path) {
    case '/_api/token':
        return txt(token);
    case '/_api/destinations':
        return json(Array.from(destinations.values()));
    }

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

    return respond('', 404);
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

        destination = destinations.get(destinationName);
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

  console.log('serving files from %o %o', process.cwd, config.htdocs);

  return new Promise((resolve) => {
    server.listen(config.port, () => {
      resolve();
    });
  });
}
