/**
 * @jsx React.DOM
 */

var React = require('react');
var Reflux = require('reflux');
var Tree = require('./tree');
var TreeStore = require('./tree-store');
var TreeDragAndDrop = require('./tree-drag-and-drop');
var TreeView = require('./tree');
var TreeViewChildren = TreeView.Children;
// console.log(111)
// console.log(TreeViewChildren);

var TreeApp = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function () {
    return {
      dragging: null, // set to initial drag object
      cursor: TreeStore.get().cursor
    };
  },
  propTypes: {
    tree: React.PropTypes.object.isRequired
  },
  refreshTree: function (data) {
    console.log('refreshTree');
    this.setState({cursor: data.cursor});
  },
  componentDidMount: function () {
    this.listenTo(TreeStore, this.refreshTree);
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
    return (<div id="tree-top" className='tree-top tree-draggable unselectable' unselectable="on">
      <TreeViewChildren cursor={children} top={true}/>
    </div>);
  }
});

module.exports = TreeApp;

//      <TreeViewChildren cursor={children} />
