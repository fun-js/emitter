'use strict';

const RouteParser = require('@funjs/route-parser');


module.exports = Object.freeze(Emitter);


function Emitter() {
  let listeners = [];

  return Object.freeze({
    on: addListener,
    addListener,
    once,
    off: removeListener,
    removeListener,
    offAll: removeAllListeners,
    removeAllListeners,
    emit
  });

  function addListener(event, fn) {
    const evtRoute = RouteParser(event);

    listeners.push({ event, evtRoute, fn });

    return Object.freeze({
      dispose: () => removeListener(event, fn)
    });
  }

  function once(event, fn) {
    const onceFn = (...args) => {
      fn(...args);
      removeListener(event, onceFn);
    };

    addListener(event, onceFn);
  }

  function removeListener(event, fn) {
    listeners = listeners.filter(ltr => ltr.event !== event || !fn || ltr.fn !== fn);
  }

  function removeAllListeners() {
    listeners = [];
  }

  function emit(event, ...args) {
    listeners.forEach(({ evtRoute, fn }) => {
      const evtRouteObj = evtRoute.match(event);

      if (evtRouteObj !== false) {
        fn(evtRouteObj, ...args);
      }
    });
  }
}
