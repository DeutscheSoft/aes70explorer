import yargs from 'yargs';
import startHTTP from './lib/http.js';
import startDiscovery from './lib/discovery.js';

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

console.log('argv', argv);

const httpOptions = {
  port: argv.port || 8080,
  htdocs: argv.htdocs || './htdocs',
};

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
    source: 'manual',
  };
}

const destinations = new Map();

function addDestination(destination) {
  let name = destination.name;

  if (destinations.has(name))
    throw new Error('Destination already exists.');

  destinations.set(name, destination);

  return () => {
    if (name === null) return;
    destinations.delete(name);
    name = null;
  };
}

argv._.forEach((arg) => {
  const destination = parseDestination(arg);

  console.log('Using manual destination: %o', destination);
  addDestination(destination);
});

startDiscovery(addDestination);

startHTTP(httpOptions, destinations).then(
  () => {
    console.log('Running on port %d.', httpOptions.port);
  },
  (err) => {
    console.error('Failed to start HTTP server.', err);
    process.exit(1);
  }
);
