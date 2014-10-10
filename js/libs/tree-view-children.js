/**
 * @jsx React.DOM
 */

var React = require('react');
var SlideTransition = require('./slide-transition');

module.exports = function (TreeView) {

  var TreeViewChildren = React.createClass({
    mixins: [SlideTransition],
    render: function () {
      var childNodes = this.props.childs.map(function (child) {
        return <TreeView key={child.name} label={child.label} name={child.name} childs={child.children}>{child.label}</TreeView>;
      });
      return (
        <div className='tree-view-children'>
          {childNodes}
        </div>
      );
    }
  });

  return TreeViewChildren;
};
