import yargs from 'yargs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Backend } from '../nodejs-lib/src/index.js';

const __filename = fileURLToPath(import.meta.url);
const defaultHtdocs = join(dirname(__filename), "../../htdocs");

const argv = yargs(process.argv.slice(2))
  .command('server.js', 'Starts the aes70-browser as a standalone HTTP server.', {
    port: {
      description: 'The HTTP port to use (default is 8080).',
      alias: 'p',
      type: 'number',
    },
    htdocs: {
      description: 'The HTTP htdocs directory (default is ./htdocs).',
      type: 'number',
    },
  })
  .help()
  .alias('help', 'h')
  .argv;

const httpOptions = {
  port: argv.port || 8080,
  htdocs: argv.htdocs || defaultHtdocs,
};

const backend = new Backend({
  http: httpOptions
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
  () => {
    console.log('Running on port %d.', httpOptions.port);
  },
  (err) => {
    console.error('Failed to start HTTP server.', err);
    process.exit(1);
  }
);
