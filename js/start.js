/**
 * @jsx React.DOM
 */

var React = require('react');
var TreeData = require('./example/tree-data');
// var Tree = require('./libs/tree');
var TreeApp = require('./libs/tree-app');
var TreeDragAndDrop = require('./libs/tree-drag-and-drop');
var treeNode = document.getElementById('tree');

React.renderComponent(<TreeApp tree={TreeData}></TreeApp>, document.getElementById('tree'));

TreeDragAndDrop.start();
