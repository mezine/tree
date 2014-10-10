/**
 * @jsx React.DOM
 */

var React = require('react');
var Tree = require('./tree');

var TreeApp = React.createClass({
  propTypes: {
    tree: React.PropTypes.object.isRequired
  },
  render: function () {
    var childNodes = this.props.tree.children.map(function (child) {
      return <Tree key={child.name} label={child.label} name={child.name} childs={child.children}></Tree>;
    });
    return (<div>
      {childNodes}
    </div>)
  }
});

module.exports = TreeApp;