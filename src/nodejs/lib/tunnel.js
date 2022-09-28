import { connectTCPTunnel } from './websocket_tcp_tunnel.js';
import { connectUDPTunnel } from './websocket_udp_tunnel.js';

export async function connectTunnel(options, getWebsocket) {
  switch (options.protocol) {
  case 'tcp':
    return await connectTCPTunnel(options, getWebsocket);
  case 'udp':
    return await connectUDPTunnel(options, getWebsocket);
  default:
    throw new Error(`Unsupported protocol ${options.protocol}.`);
  }
}
