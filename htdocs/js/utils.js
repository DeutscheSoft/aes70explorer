
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

export function classIDToString (str) {
  return str.split('').map(v=>v.charCodeAt(0)).join('.');
}


export function formatFrequency (v) {
  if (v < 10)
    return v.toFixed(3);
  if (v < 100)
    return v.toFixed(2);
  if (v < 1000)
    return v.toFixed(1);
  if (v < 10000)
    return (v / 1000).toFixed(3) + 'k';
  return (v / 1000).toFixed(2) + 'k';
}

export function makeValueMinMaxBinding(src, recv, send) {
  if (!src.startsWith('/'))
    src = '/' + src;
  const frecv = recv ? a => recv(a[0]) : a => a[0];
  const fsend = send ? send : v => v;
  return [
      {
        src: [ src, src + '/Min', src + '/Max' ],
        name: 'value',
        readonly: true,
        transformReceive: frecv,
      },
      {
        src: src,
        name: 'value',
        writeonly: true,
        transformSend: fsend,
      },
      {
        src: src + '/Min',
        name: 'min',
      },
      {
        src: src + '/Max',
        name: 'max',
      },
  ];
}
