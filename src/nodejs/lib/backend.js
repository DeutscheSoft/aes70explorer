import startHTTP from './http.js';
import startDiscovery from './discovery.js';

const httpDefaultOptions = {
  port: 8080,
};

function isValidDestinationPort(port) {
  return Number.isInteger(port) && port > 0 && port <= 0xffff;
}

function isValidDestinationSource(source) {
  switch (source) {
  case 'manual':
  case 'static':
  case 'dnssd':
    return true;
  }
}

function isValidDestination(dst) {
  return typeof dst === 'object' &&
    typeof dst.name === 'string' &&
    dst.name.length > 0 &&
    isValidDestinationPort(dst.port) &&
    typeof dst.host === 'string' && dst.host.length > 0 &&
    dst.protocol === 'tcp' &&
    isValidDestinationSource(dst.source);
}

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
    await startHTTP(this.httpOptions, this);
  }

  addDestination(destination) {
    if (!isValidDestination(destination)) {
      throw new TypeError('Invalid destination.');
    }

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

  getDestinations() {
    return Array.from(this.destinations.values());
  }

  hasDestination(name) {
    return this.destinations.has(name);
  }

  getDestination(name) {
    return this.destinations.get(name);
  }
}
