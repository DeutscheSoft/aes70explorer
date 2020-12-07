
export function callUnsubscribe(fun) {
  try {
    fun();
  } catch (err) {
    console.error(err);
  }
}

export function isEqual(a, b) {
  // This is not exact, but will work most of the time since
  // we compare arrays of objects which should not change.
  return JSON.stringify(a) === JSON.stringify(b);
}

export function delay(n) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

export function forEachAsync(dv, callback, makeKey) {
  let active = true;
  const itemSubscriptions = new Map();
  let lastItems = new Map();

  if (!makeKey) makeKey = function(item) { return item; };

  let sub = dv.subscribe((data) => {
    const tmp = new Map();

    data.forEach((device) => {
      tmp.set(makeKey(device), device);
    });

    lastItems.forEach((lastItem, key) => {
      if (tmp.has(key) && isEqual(lastItem, tmp.get(key))) return;
      const sub = itemSubscriptions.get(key);
      callUnsubscribe(sub);
      itemSubscriptions.delete(key);
    });

    tmp.forEach((item, key) => {
      if (lastItems.has(key) && isEqual(item, lastItems.get(key))) return;
      itemSubscriptions.set(key, callback(item));
    });

    lastItems = tmp;
  });

  return () => {
    if (!active) return;
    active = false;
    callUnsubscribe(sub);
  };
}
