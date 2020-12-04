import yargs from 'yargs';
import { start } from './lib/http.js';

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

const destinations = new Map();

start(httpOptions, destinations).then(
  () => {
    console.log('Running on port %d.', httpOptions.port);
  },
  (err) => {
    console.error('Failed to start HTTP server.', err);
    process.exit(1);
  }
);
