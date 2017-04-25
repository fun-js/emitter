/* eslint-disable */

var max = 1000000
var parallel = require('fastparallel')()
var funParallel = require('../src/parallel')()
var parallelNoResults = require('fastparallel')({ results: false })
var funParallelNoResults = require('../src/parallel')(false)
var bench = require('fastbench')
var async = require('async')
var neo = require('neo-async')
var insync = require('insync')
var items = require('items')
var parallelize = require('parallelize')

function benchFastParallel (done) {
  parallel(null, [somethingP, somethingP, somethingP], 42, done)
}

function benchFunParallel (done) {
  funParallel([somethingPFun, somethingPFun, somethingPFun], [42], done);
}

function benchFastParallelNoResults (done) {
  parallelNoResults(null, [somethingP, somethingP, somethingP], 42, done)
}

function benchFunParallelNoResults (done) {
  funParallelNoResults([somethingPFun, somethingPFun, somethingPFun], [42], done)
}

function benchFastParallelEach (done) {
  parallelNoResults(null, somethingP, [1, 2, 3], done)
}

function benchFunParallelEach (done) {
  funParallelNoResults([somethingPFun], [1, 2, 3], done)
}

function benchFastParallelEachResults (done) {
  parallel(null, somethingP, [1, 2, 3], done)
}

function benchFunParallelEachResults (done) {
  funParallel([somethingPFun], [1, 2, 3], done)
}


function benchAsyncParallel (done) {
  async.parallel([somethingA, somethingA, somethingA], done)
}

function benchInsyncParallel (done) {
  insync.parallel([somethingA, somethingA, somethingA], done)
}

function benchNeoParallel (done) {
  neo.parallel([somethingA, somethingA, somethingA], done)
}

function benchItemsParallel (done) {
  items.parallel.execute([somethingA, somethingA, somethingA], done)
}

function benchParallelize (done) {
  var next = parallelize(done)

  somethingA(next())
  somethingA(next())
  somethingA(next())
}

function benchAsyncEach (done) {
  async.each([1, 2, 3], somethingP, done)
}

function benchNeoEach (done) {
  neo.each([1, 2, 3], somethingP, done)
}

function benchAsyncMap (done) {
  async.map([1, 2, 3], somethingP, done)
}

function benchNeoMap (done) {
  neo.map([1, 2, 3], somethingP, done)
}

function benchInsyncEach (done) {
  insync.each([1, 2, 3], somethingP, done)
}

function benchInsyncMap (done) {
  insync.map([1, 2, 3], somethingP, done)
}

var nextDone
var nextCount

function benchSetImmediate (done) {
  nextCount = 3
  nextDone = done
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
}

function somethingImmediate () {
  nextCount--
  if (nextCount === 0) {
    nextDone()
  }
}

function somethingP (arg, cb) {
  setImmediate(cb)
}

function somethingPFun (cb) {
  setImmediate(cb)
}

function somethingA (cb) {
  setImmediate(cb)
}

var run = bench([
  benchSetImmediate,
  benchAsyncParallel,
  benchAsyncEach,
  benchAsyncMap,
  benchNeoParallel,
  benchNeoEach,
  benchNeoMap,
  benchInsyncParallel,
  benchInsyncEach,
  benchInsyncMap,
  benchItemsParallel,
  benchParallelize,
  benchFastParallel,
  benchFunParallel,
  benchFastParallelNoResults,
  benchFunParallelNoResults,
  benchFastParallelEachResults,
  benchFunParallelEachResults,
  benchFastParallelEach,
  benchFunParallelEach
], max)

run(run)

// benchFunParallel(function (...args) {
//   console.log(args);
//   console.log('done');
// });
