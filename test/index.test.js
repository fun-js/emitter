'use strict';

const expect = require('chai').expect;

const Emitter = require('../src');

/* eslint prefer-arrow-callback: 0, func-names: 0, no-unused-expressions: 0 */
describe('Event Emitter', function () {
  describe('Create a Emitter', function () {
    it('should create a emitter', function () {
      const emitter = Emitter();

      expect(emitter.on).to.be.a('function');
      expect(emitter.once).to.be.a('function');
      expect(emitter.off).to.be.a('function');
    });
  });
});
