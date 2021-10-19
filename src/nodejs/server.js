import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Backend } from './lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const defaultHtdocs = join(dirname(__filename), "../../htdocs");

const argv = yargs(hideBin(process.argv))
  .options({
    port: {
      description: 'The HTTP port to use (default is 8080).',
      alias: 'p',
      type: 'number',
    },
    htdocs: {
      description: 'The HTTP htdocs directory (default is ./htdocs).',
      type: 'number',
    },
    bind: {
      description: 'The IP to listen to (default is 0.0.0.0).',
      type: 'number',
    },
    'manual-devices': {
      description: 'Enables the ability for clients to add or remove devices.',
      type: 'boolean',
      default: true,
    },
    mdns: {
      description: 'Enables automatic device discovery using MDNS.',
      type: 'boolean',
      default: true,
    },
  })
  .help()
  .alias('help', 'h')
  .argv;

const capabilities = {
  manual_devices: !!argv['manual-devices'],
  license: false,
  mdns: !!argv.mdns,
};

const httpOptions = {
  port: argv.port || 8080,
  htdocs: argv.htdocs || defaultHtdocs,
  host: argv.bind,
  capabilities,
};

const backend = new Backend({
  http: httpOptions,
  mdns: {
    enabled: !!argv.mdns,
  },
});

console.log('Starting with options', httpOptions);

function parseDestination(str)
{
  const tmp = str.split(':');

  let protocol;
  let port;
  let host;

  switch (tmp.length) {
  case 2:
    host = tmp[0];
    port = parseInt(tmp[1]);
    protocol = 'tcp';
    break;
  case 3:
    protocol = tmp[0];
    host = tmp[1];
    port = parseInt(tmp[2]);
    break;
  default:
    throw new TypeError('Failed to parse destination: ' + str);
  }

  if (isNaN(port) || port < 0 || port > 0xffff)
    throw new TypeError('Invalid port in destination: ' + str);

  return {
    protocol,
    port,
    host,
    name: host + '_' + port,
    source: 'static',
  };
}

argv._.forEach((arg) => {
  const destination = parseDestination(arg);

  console.log('Using static destination: %o', destination);
  backend.addDestination(destination);
});

backend.start().then(
  (info) => {
    console.log('HTTP Server running on port %d and host %o.', info.http.port, info.http.address);
  },
  (err) => {
    console.error('Failed to start HTTP server.', err);
    process.exit(1);
  }
);
