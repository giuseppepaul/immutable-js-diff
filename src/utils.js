'use strict';

var Immutable = require('immutable');

var isMap = function(obj){ return Immutable.Map.isMap(obj); };
var isIndexed = function(obj) { return Immutable.Iterable.isIndexed(obj); };
var isRecord = function(obj) { return Immutable.Record.isRecord(obj); };

var op = function(operation, path, value){
  if(operation === 'remove') { return { op: operation, path: path }; }

  return { op: operation, path: path, value: value };
};

module.exports = {
  isRecord: isRecord,
  isMap: isMap,
  isIndexed: isIndexed,
  op: op
};