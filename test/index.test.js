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

  describe('Listen for a event', function () {
    it('should return a disposable object', function () {
      const emitter = Emitter();
      const listener = emitter.on('users/:action=(insert|update)/:id', () => {});

      expect(listener.dispose).to.be.a('function');
    });

    it('Emit event must run the listener', function (done) {
      const emitter = Emitter();

      emitter.on('users/:action=(insert|update)/:id', ({ action, id }, data) => {
        expect(action).to.equal('insert');
        expect(id).to.equal('1');
        expect(data).to.deep.equal({ id: 1, name: 'Joe', age: 33 });
        done();
      });

      emitter.emit('users/insert/1', { id: 1, name: 'Joe', age: 33 });
    });
  });
});
