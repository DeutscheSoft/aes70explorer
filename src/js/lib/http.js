import { Server } from '@hapi/hapi';
import HapiPluginInert from '@hapi/inert';
import { connectTCPTunnel } from './websocket_tcp_tunnel.js';
import path from 'path';
import WS from 'ws';

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
export async function start(config, destinations) {
  const server = new Server({ port: config.port });

  await server.register({ plugin: HapiPluginInert });

  const prefix = "/_control/";

  // FIXME
  const token = "random_secret";

  const wss = new WS.Server({
    clientTracking: false,
    noServer: true,
  });

  server.listener.on('upgrade', async (request, socket, head) => {
    try {
      let destination;
      const url = request.url;

      if (url.startsWith(prefix))
      {
        const destinationName = url.substr(prefix.length);

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

  server.route({
    method: 'GET',
    path: '/_api/destinations',
    handler: (request, h) => {
      return Array.from(destinations.values());
    },
  });

  server.route({
    method: 'GET',
    path: '/_api/token',
    handler: (request, h) => {
      return token;
    },
  });

  server.route({
      method: 'GET',
      path: '/{path*}',
      handler: {
          directory: {
              path: config.htdocs,
          }
      }
  });

  await server.start();
}
