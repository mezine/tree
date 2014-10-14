/**
 * @jsx React.DOM
 */

var React = require('react');
var Tree = require('./tree');
var TreeStore = require('./tree-store');
var TreeDragAndDrop = require('./tree-drag-and-drop');
var TreeView = require('./tree');
var TreeViewChildren = TreeView.Children;
// console.log(111)
// console.log(TreeViewChildren);

var TreeApp = React.createClass({
  getInitialState: function () {
    return {
      dragging: null, // set to initial drag object
      cursor: TreeStore.get().tree.cursor()
    };
  },
  propTypes: {
    tree: React.PropTypes.object.isRequired
  },
  render: function () {
    var cursor = this.state.cursor;
    var children = cursor.cursor('children');
    var childNodes = [];
    children.forEach(function (child) {
      var name = child.get('name');
      childNodes.push(<Tree key={name} cursor={child} />);
    });

    // var children = <TreeViewChildren cursor={children} />;
    // <TreeViewChildren cursor={children} />
    return (<div id="tree-top" className='tree-top unselectable' unselectable="on">
      <TreeViewChildren cursor={children} top={true}/>
    </div>);
  }
});

module.exports = TreeApp;

//      <TreeViewChildren cursor={children} />
