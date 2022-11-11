import { Browser, ServiceType } from 'dnssd';
import { isIPv4 } from 'net';

function findIPv4Address(service) {
  const ips = service.addresses.filter((addr) => isIPv4(addr));

  if (ips.length)
    return ips[0];

  return null;
}

function createDestination(service) {
  return {
    protocol: service.type.protocol,
    port: service.port,
    host: findIPv4Address(service),
    name: service.fullname,
    source: 'dnssd',
  };
}

class CountingMap {
  constructor() {
    this._counters = new Map();
    this._sub = new Map();
  }

  set(key, factory) {
    const { _counters, _sub } = this;

    if (_counters.has(key)) {
      _counters.set(key, _counters.get(key) + 1);
    } else {
      _counters.set(key, 1);
      _sub.set(key, factory());
    }
  }

  delete(key) {
    const { _counters, _sub } = this;

    if (!_counters.has(key))
      return;

    const count = _counters.get(key);

    if (count >= 1) {
      const sub = _sub.get(key);

      _counters.delete(key);
      sub();
    } else {
      _counters.set(key, count - 1);
    }
  }

}

export default function start(addDestination) {
  const tcpBrowser = new Browser(ServiceType.tcp('oca'));
  const udpBrowser = new Browser(ServiceType.udp('oca'));
  const registered = new CountingMap();

  const onError = (err) => {
    console.error('Error on dnssd browser: %o', err);
  };

  const onServiceUp = (service) => {
    if (service.type.protocol !== 'tcp') return;
    console.log('Service %o', service);
    registered.set(service.fullname, () => addDestination(createDestination(service)));
  };

  const onServiceDown = (service) => {
    if (service.type.protocol !== 'tcp' &&
        service.type.protocol !== 'udp') return;
    const fullname = service.fullname;

    registered.delete(fullname);
  };

  tcpBrowser.on('error', onError);
  udpBrowser.on('error', onError);

  tcpBrowser
    .on('serviceUp', onServiceUp)
    .on('serviceDown', onServiceDown)
    .start();
  udpBrowser
    .on('serviceUp', onServiceUp)
    .on('serviceDown', onServiceDown)
    .start();
};
