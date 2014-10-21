var Reflux = require('reflux');

var Actions = Reflux.createActions([
  'refreshTree',
  'moveTreeNode' // source keyPath, destination keyPath
]);

module.exports = Actions;