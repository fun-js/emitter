'use strict';

const RouteParser = require('@funjs/route-parser');

const noop = () => {};

module.exports = Object.freeze(Emitter);


function Emitter() {
  let listeners = [];

  return Object.freeze({
    on: noop,
    once: noop,
    off: noop
  });

  function addListener(event, fn) {
    listeners.push({ event: RouteParser(event), fn });
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
    listeners.forEach(({ router, fn }) => {
      if (router.match(event) !== false) {
        fn(...result.concat(args));
      }
    });
  }
}
