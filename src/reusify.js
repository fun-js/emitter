'use strict';

module.exports = reusify;

function reusify(Constructor) {
  let head = Constructor();
  let tail = head;

  function get() {
    const current = head;

    if (current.next) {
      head = current.next;
    } else {
      head = Constructor();
      tail = head;
    }

    current.next = undefined;

    return current;
  }

  function release(obj) {
    tail.next = obj;
    tail = obj;
  }

  return {
    get,
    release
  };
}
