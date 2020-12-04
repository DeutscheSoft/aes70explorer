import { Server } from '@hapi/hapi';
import HapiPluginInert from '@hapi/inert';
import HapiPluginWebSocket from 'hapi-plugin-websocket'; 
import { connectTCPTunnel } from './websocket_tcp_tunnel.js';
import path from 'path';

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

  await server.register({ plugin: HapiPluginWebSocket });

  const prefix = "/control/";

  // FIXME
  const token = "random_secret";

  /*
  server.route({
    method: "POST",
    path: prefix + "{id}",
    config: {
      response: { emptyStatusCode: 204 },
      plugins: {
        websocket: {
          only: true,
          create: (wss) => {
          },
          connect: async (ev) => {
            const url = ev.req.url;

            if (!url.startsWith(prefix))
            {
              console.error('Unknown control endpoint %o', url);
              ws.close();
            }

            const index = parseInt(url.substr(prefix.length));
            const ws = ev.ws;
            try
            {
              const backend = await get_remote(index);
              backend.addEventListener('close', () => {
                  ws.close();
              });
              websockets.set(ws, new WebSocketServerBackend(ws, backend));
              ws.on('error', (err) => {
                  console.error('Error on WebsocketConnection');
                  console.error(err);
                  try { this.close(); } catch (err) {}
              });
            }
            catch (err)
            {
              console.error('Setting up websocket backend failed: %o', err);
              ws.close();
            }
          },
          disconnect: (wss, ws) => {
            websockets.delete(ws);
          }
        }
      }
    },
    handler: (request, reply) => {
      return "";
    },
  });
  */

  server.route({
    method: 'GET',
    path: '/_api/destinations',
    handler: (request, h) => {
      return JSON.stringify(destinations);
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
