import { warn} from "./../aux-widgets/src/utils/log.js";
import { getBackendValue } from "./../AWML/src/index.pure.js";

const valueTimers = new Map();

export function registerValueTimer (URI, list, time) {
  if (!valueTimers.has(time)) {
    valueTimers.set(time, {
      list: new Map(),
      interval: runValueTimer(time),
    });
  }
  const storage = valueTimers.get(time).list;
  if (storage.has(URI)) {
    warn("valueTimer for path %s already exists.", URI);
    return;
  }
  storage.set(URI, {
    list: list,
    i: 0,
  });
}

export function unregisterValueTimer (URI, time) {
  if (!valueTimers.has(time)) {
    warn("No timers for this timeout (%i) defined.", time);
    return;
  }
  const timers = valueTimers.get(time);
  if (!timers.list.has(URI)) {
    warn("No timers for %s defined.", URI);
    return;
  }
  timers.list.delete(URI);
  if (!timers.list.size) {
    clearInterval(timers.interval);
    valueTimers.delete(time);
  }
}

function runValueTimer (time) {
  return setInterval(() => {
    const timers = valueTimers.get(time).list;
    for (let [uri, data] of timers) {
      getBackendValue(uri).set(data.list[data.i]);
      data.i = ++data.i % data.list.length;
    }
  }, time);
}
