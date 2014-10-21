/**
 * @jsx React.DOM
 */

var Reflux = require('reflux');
var Immutable = require('immutable');
var _ = require('lodash');
var Actions = require('./tree-actions');
var RawTreeData = require('./tree-drag-and-drop-raw-data');

var Data = {
  cursor: Immutable.fromJS(RawTreeData).cursor()
};

var TreeStore = Reflux.createStore({
  init: function () {
    this.listenTo(Actions.refreshTree, this.refresh);
    this.listenTo(Actions.moveTreeNode, this.move);
  },
  get: function () {
    return Data;
  },
  rootData: function () {
    return Data.cursor._rootData;
  },
  refresh: function () {
    throw "TreeStore.refresh not implemented yet";
  },
  move: function (sourceKeyPath, destKeyPath, relativePos) {
    switch (relativePos) {
      case 'before' :
        TreeStore.moveAt(sourceKeyPath, destKeyPath);
        break;
      case 'after' :
        var nextDestKeyPath = destKeyPath.slice(0);
        nextDestKeyPath[nextDestKeyPath.length-1] = nextDestKeyPath[nextDestKeyPath.length-1] + 1;
        TreeStore.moveAt(sourceKeyPath, nextDestKeyPath);
        break;
      case 'in' :
        TreeStore.moveIn(sourceKeyPath, destKeyPath);
        break;
    }
  },
  moveAt: function (sourceKeyPath, destKeyPath) {
    var rootData = This.rootData();
    var sourceData = rootData.getIn(sourceKeyPath);
    var newRootData = This.updateWithOrderedSourceRemoval(rootData, sourceKeyPath, destKeyPath, function (rootData) {
      return This.insertAt(rootData, destKeyPath, sourceData);
    });

    Data.cursor = newRootData.cursor();
    this.trigger(Data);
  },
  moveIn: function (sourceKeyPath, destKeyPath) {
    var rootData = This.rootData();
    var sourceData = rootData.getIn(sourceKeyPath);
    var newRootData = This.updateWithOrderedSourceRemoval(rootData, sourceKeyPath, destKeyPath, function (rootData) {
      var newRootData = rootData.updateIn(destKeyPath, function (map) {
        var originalVector = map.get('children');
        var newVector = This.makeVectorFromArrays(originalVector, [sourceData]);
        return map.set('children', newVector);
      });
      return newRootData;
    });

    Data.cursor = newRootData.cursor();
    this.trigger(Data);
  },
  updateWithOrderedSourceRemoval: function (rootData, sourceKeyPath, destKeyPath, fn) {
    var newRootData = rootData;
    if (sourceKeyPath < destKeyPath) {
      newRootData = fn(newRootData);
      newRootData = This.remove(newRootData, sourceKeyPath);
    } else {
      newRootData = This.remove(newRootData, sourceKeyPath);
      newRootData = fn(newRootData);
    }
    return newRootData;
  },
  remove: function (data, keyPath) {
    var parentKeyPath = keyPath.slice(0, -2);
    var vectorKeyPath = keyPath.slice(0, -1);
    var indexPos = keyPath.slice(-1)[0];
    var vector = data.getIn(vectorKeyPath);
    var beforeValues = vector.slice(0, indexPos);
    var afterValues = vector.slice(indexPos+1);
    var newVector = this.makeVectorFromArrays(beforeValues, afterValues);
    return data.updateIn(parentKeyPath, function (map) {
      return map.set('children', newVector);
    });
  },
  makeVectorFromArrays: function () {
    var args = _.toArray(arguments);
    var array = [];
    args.forEach(function (arg) {
      if (arg) {
        arg.forEach(function (value) {
          array.push(value);
        });
      }
    });
    return Immutable.Vector.from(array);
  },
  insertAt: function (data, keyPath, sourceData) {
    var parentKeyPath = keyPath.slice(0);
    var indexPos = parentKeyPath.pop();
    var childrenKeyPath = parentKeyPath.pop();
    var vectorKeyPath = parentKeyPath.concat(childrenKeyPath);
    var originalVector = data.getIn(vectorKeyPath);
    var beforeSlices = originalVector.slice(0, indexPos);
    var afterSlices = originalVector.slice(indexPos);
    var newVectorValues = [];
    beforeSlices.forEach(function (value) {
      newVectorValues.push(value);
    });
    newVectorValues.push(sourceData);
    afterSlices.forEach(function (value) {
      newVectorValues.push(value);
    });

    var newVector = Immutable.Vector.from(newVectorValues);
    var newData = data.updateIn(parentKeyPath, function (map) {
      return map.set('children', newVector);
    });
    return newData;
  }
});

var This = TreeStore;

module.exports = TreeStore;