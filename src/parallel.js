'use strict';

module.exports = paralell;

function paralell(funcs, done, arg) {
  let count = 0;


  const funcsLen = funcs.length;
  const maxPos = funcsLen - 1;
  const results = new Array(funcsLen);

  while (count < funcsLen) {
    funcs[count](holdResult(count), arg);
    count += 1;
  }

  function holdResult(pos) {
    return (err, result) => {
      if (err) {
        return done(err);
      }

      results[pos] = result;
      if (pos === maxPos) {
        done(undefined, results);
      }
    };
  }
}
