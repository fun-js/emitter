'use strict';

const RouteParser = require('@funjs/route-parser');

const noop = () => {};

module.exports = Object.freeze(Emitter);


function Emitter() {
  return Object.freeze({
    on: noop,
    once: noop,
    off: noop
  });
}
