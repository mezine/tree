/**
 * @jsx React.DOM
 */

var React = require('react');
var SlideTransition = require('./slide-transition');

module.exports = function (Tree) {

  var TreeViewChildren = React.createClass({
    mixins: [SlideTransition],
    propTypes: {
      cursor: React.PropTypes.object,
      top: React.PropTypes.bool
    },
    render: function () {
      var children = this.props.cursor;
      var childNodes = [];
      children.forEach(function (child) {
        var name = child.get('name');
        childNodes.push(<Tree key={name} cursor={child} />);
      });
      var spacer;
      if (!this.props.top) {
        spacer = <div className='tree-view-spacer'>
          <div className='tree-view-spacer-indent'></div>
        </div>;
      }
      return <div>
          <div className='tree-view-children'>
            {childNodes}
          </div>
          {spacer}
        </div>;
    }
  });

  return TreeViewChildren;
};
