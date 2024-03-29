
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

export function makeValueMinMaxBinding(src, recv, send, debug) {
  if (!src.startsWith('/'))
    src = '/' + src;
  const vrecv = recv ? a => recv(a[0]) : a => a[0];
  const mrecv = recv ? recv : a => a;
  const fsend = send ? send : v => v;
  return [
      {
        src: src,
        name: 'value',
        writeonly: true,
        transformSend: fsend,
        debug: debug,
      },
      {
        src: src + '/Min',
        name: 'min',
        transformReceive: mrecv,
        debug: debug,
        ignoreInteraction: true,
      },
      {
        src: src + '/Max',
        name: 'max',
        transformReceive: mrecv,
        debug: debug,
        ignoreInteraction: true,
      },
      {
        src: [ src, src + '/Min', src + '/Max' ],
        name: 'value',
        readonly: true,
        transformReceive: vrecv,
        debug: debug,
      },
  ];
}

export function makeImplementedBindings(arr) {
  const R = [];
  for (let i = 0, m = arr.length; i < m; ++i) {
    const E = arr[i];
    R.push({name: 'implements' + E, src: '/' + E + '/Implemented', readonly: true, sync: true});
  }
  return R;
}

export function limitValueDigits(limit, add = '') {
  return function (value) {
    value = parseFloat(value);
    let digits = parseInt(Math.abs(value)).toString().length;
    let si = '';
    let I = 0;
    let L = limit;
    if (value < 0)
      L -= 1;
    if (digits > L) {
      L -= 1;
      I = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
      si = ['', 'k','M','G','T','P'][I];
      if (I)
        value /= I * 1000;
      digits -= I * 3;
    }
    return value.toFixed(Math.max(0, L - digits)) + si + add;
  }
}
