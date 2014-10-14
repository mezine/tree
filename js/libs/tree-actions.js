var Reflux = require('reflux');

var Actions = Reflux.createActions([
  'refreshTree',
  'dragTreeNode',
  'dropTreeNode'
]);

module.exports = Actions;