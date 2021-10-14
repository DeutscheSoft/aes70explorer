import startHTTP from './http.js';
import startDiscovery from './discovery.js';

const httpDefaultOptions = {
  port: 8080,
};

const mdnsDefaultOptions = {
  enabled: true,
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
    return Object.assign({}, httpDefaultOptions , this.config.http);
  }

  get mdnsOptions() {
    return Object.assign({}, mdnsDefaultOptions, this.config.mdns || {});
  }

  constructor(config) {
    this.config = config;
    this.destinations = new Map();
  }

  async start() {
    const mdnsOptions = this.mdnsOptions;

    if (mdnsOptions.enabled)
    {
      console.log('Starting mdns discovery.');
      startDiscovery((destination) => this.addDestination(destination));
    }

    const http = await startHTTP(this.httpOptions, this);

    return {
      http
    };
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
