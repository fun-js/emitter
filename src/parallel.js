'use strict';

const reusify = require('./reusify');

const noop = () => {};

module.exports = parallel;

function parallel(results = true, released = noop) {
  const queue = reusify(ResultsHolder);
  const queueSingleCaller = reusify(SingleCaller);
  const goArray = results ? goResultsArray : goNoResultsArray;

  return Object.freeze((toCall = [], args, done = noop) => {
    const holder = queue.get();

    if (toCall.length === 0) {
      done();
      released(holder);
      return;
    }

    holder.callback = done;
    holder._release = release;

    goArray(toCall, args, holder);

    if (holder.count === 0) {
      holder.release();
    }
  });

  function release(holder) {
    queue.release(holder);
    released(holder);
  }

  function singleCallerRelease(holder) {
    queueSingleCaller.release(holder);
  }

  function goResultsArray(funcs, args, holder) {
    const funcsLen = funcs.length;
    const release = holder.release;

    holder.count = funcsLen;
    holder.results = new Array(funcsLen);

    funcs.forEach((fn, i) => {
      const singleCaller = queueSingleCaller.get();

      singleCaller._release = singleCallerRelease;
      singleCaller.parent = holder;
      singleCaller.pos = i;

      fn(release, ...args);
    });
  }

  function goNoResultsArray(funcs, args, holder) {
    const funcsLen = funcs.length;
    const release = holder.release;

    holder.count = funcsLen;

    funcs.forEach(fn => fn(release, ...args));
  }
}


function ResultsHolder() {
  let count = 0;
  const holder = {
    release,
    _release: noop,
    count: -1,
    callback: noop,
    results: undefined,
    err: undefined,
    next: undefined
  };

  return holder;

  function release(err, pos, result) {
    if (holder.err === undefined) {
      holder.err = err;
    }

    if (pos >= 0) {
      holder.results[pos] = result;
    }

    count += 1;

    if (count === holder.count || holder.count === 0) {
      holder.callback.call(undefined, holder.err, holder.results);
    }

    holder.callback = noop;
    holder.results = undefined;
    holder.err = undefined;
    holder._release();
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
