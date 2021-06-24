import startHTTP from './http.js';
import startDiscovery from './discovery.js';

const httpDefaultOptions = {
  port: 8080,
};

export class Backend {
  get httpOptions() {
    return Object.assign(httpDefaultOptions , this.config.http);
  }

  constructor(config) {
    this.config = config;
    this.destinations = new Map();
  }

  async start() {
    startDiscovery((destination) => this.addDestination(destination));
    await startHTTP(this.httpOptions, this.destinations);
  }

  addDestination(destination) {
    const destinations = this.destinations;

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
}
