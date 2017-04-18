'use strict';

const noop = () => {};

module.exports = Object.freeze(Emitter);


function Emitter() {
  return Object.freeze({
    on: noop,
    once: noop,
    off: noop
  });
}
