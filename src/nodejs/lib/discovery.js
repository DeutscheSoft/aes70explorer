import { Browser, tcp } from 'dnssd';
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

export default function start(addDestination) {
  const browser = new Browser(tcp('oca'));
  const registered = new Map();

  browser.on('error', (err) => {
    console.error('Error on dnssd browser: %o', err);
  });

  browser
    .on('serviceUp', (service) => {
      if (service.type.protocol !== 'tcp') return;
      console.log('Service %o', service);
      registered.set(service.fullname, addDestination(createDestination(service)));
    })
    .on('serviceDown', (service) => {
      if (service.type.protocol !== 'tcp') return;
      const fullname = service.fullname;

      const sub = registered.get(fullname);

      if (sub) {
        registered.delete(fullname);
        sub();
      }
    })
    .start();
};
