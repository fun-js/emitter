/* eslint-disable */

'use strict';

const reusify = require('./reusify');

const noop = () => {};

function parallel(released = noop, results = true) {
  const queue = reusify(ResultsHolder);
  const queueSingleCaller = reusify(SingleCaller);

  return Object.freeze((toCall = [], args, done = noop) => {
    const holder = queue.get();

    if (toCall.length === 0) {
      done();
      released(holder);
      return;
    }

    holder._callback = done;
    holder._release = release;

    goResultsArray(toCall, args, holder);

    if (holder._count === 0) {
      holder.release();
    }
  });

  function release(holder) {
    queue.release(holder);
    released(holder);
  }
}


function ResultsHolder() {
  const holder = {
    release,
    count: -1,
    callback: noop,
    results: undefined,
    err: undefined,
    next: undefined
  };

  function release(err, pos, result) {
    holder.err = holder.err || err;

    if (pos >= 0) {
      holder.results[pos] = result;
    }


  }

  this._count = -1
  this._callback = noop
  this._results = null
  this._err = null
  this._callThat = null
  this._release = nop
  this.next = null

  var that = this
  var i = 0
  this.release = function (err, pos, result) {
    that._err = that._err || err
    if (pos >= 0) {
      that._results[pos] = result
    }
    var cb = that._callback
    if (++i === that._count || that._count === 0) {
      if (that._callThat) {
        cb.call(that._callThat, that._err, that._results)
      } else {
        cb(that._err, that._results)
      }
      that._callback = nop
      that._results = null
      that._err = null
      that._callThat = null
      i = 0
      that._release(that)
    }
  }
}


function goResultsArray (funcs, args, holder) {
  var sc = null
  var tc = nop

  holder._count = funcs.length;

  holder._results = new Array(holder._count)
  for (var i = 0; i < funcs.length; i++) {
    sc = queueSingleCaller.get()
    sc._release = singleCallerRelease
    sc.parent = holder
    sc.pos = i
    tc = funcs[i]
    if (that) {
      if (tc.length === 1) tc.call(that, sc.release)
      else tc.call(that, arg, sc.release)
    } else {
      if (tc.length === 1) tc(sc.release)
      else tc(arg, sc.release)
    }
  }
}


function SingleCaller() {
  const caller = {
    release,
    pos: -1,
    parent: undefined,
    next: undefined,
  };

  function release(err, result) {
    caller.parent.release(err, caller.pos, result);
    caller.pos = -1;
    caller.parent = undefined;
  }

  return caller;
}
