import { getBackendValue } from '../../AWML/src/index.pure.js';

export async function handleNavState(location, state) {
  const [ device, path ] = location.split(':');
  const value = getBackendValue('storage:navstate');
  const navstate = await value.wait();
  if (!navstate[device]) {
    navstate[device] = [];
  }
  let current = navstate[device];
  if (!state && current.includes(path)) {
    current = current.filter((v) => v !== path);
  }
  else if (state && !current.includes(path)) {
    current.push(path);
  }
  navstate[device] = current;
  value.set(navstate);
}

export async function getNavState(location) {
  const [ device, path ] = location.split(':');
  const value = getBackendValue('storage:navstate');
  const navstate = await value.wait();
  if (!navstate[device])
    return false;
  return navstate[device].includes(path);
}
