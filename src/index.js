'use strict';

const RouteParser = require('@funjs/route-parser');

module.exports = Object.freeze(Emitter);

function Emitter(options = {}) {
  let listeners = [];

  return Object.freeze({
    on: addListener,
    addListener,
    once,
    off: removeListener,
    removeListener,
    offAll: removeAllListeners,
    removeAllListeners,
    eventsNames,
    emit,
    listeners: event => listeners.filter(listener => event === listener.event)
  });

  function addListener(event, fn) {
    const evtRoute = RouteParser(event, options);

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
    listeners = listeners.filter(ltr => ltr.event !== event || ltr.fn !== fn);
  }

  function removeAllListeners() {
    listeners = [];
  }

  function eventsNames(filter = l => l) {
    return listeners.filter(filter);
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
