/**
 * @jsx React.DOM
 */

 var React = require('react');
 var ReactTransitionGroup = require('react/addons').addons.TransitionGroup;
 var Actions = require('./tree-actions');

 var TreeView = React.createClass({
  
  propTypes: {
    collapsed: React.PropTypes.bool,
    defaultCollapsed: React.PropTypes.bool,
    cursor: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      collapsed: this.props.defaultCollapsed,
      drag: null
    };
  },

  handleClick: function(a, b, c) {
    this.setState({collapsed: !this.state.collapsed});
    // this.props.onClick && this.props.onClick(a, b, c);
  },

  // onStartDrag: function (e) {
  //   // console.log(this.props.cursor._keyPath)
  //   Actions.dragTreeNode(this.props.cursor);
  // },

  // onMouseEnterLabel: function (e) {
  //   this.setState({drag: 'top'});
  //   // console.log(e);
  // },

  // onMouseLeaveLabel: function (e) {
  //   this.setState({drag: null});
  // },

  render: function() {

    var cursor = this.props.cursor;
    var name = cursor.get('name');
    var label = cursor.get('label');
    var children = cursor.cursor('children');

    // ARROW STUFF
    // console.log(children);
    // console.log(name, children.length);
    // if (name == 'lists') {
    //   console.log(name, children.toJS());
    // }
    var hasChildren = children && children.length;
    var arrow;
    var collapsed = false; // is in an actual collapsed mode (i.e it has children too)
    if (hasChildren) {
      var arrowClassName = 'tree-view-arrow';
      if (this.state.collapsed) {
        arrowClassName += ' tree-view-arrow-collapsed';
        collapsed = true;
      }
      arrow = <div className={arrowClassName} onClick={this.handleClick}>V</div>;
    } else {
      arrow = <div className="tree-view-arrow tree-view-arrow-none">&nbsp;</div>;
    }

    // CHILDREN
    var treeViewChildren = null;
    if (hasChildren && !this.state.collapsed) {
      treeViewChildren = <TreeViewChildren cursor={children} />;
    }

    // console.log(cursor._keyPath, collapsed);
    var jsonKeyPath = JSON.stringify(cursor._keyPath);

    return (
      <div className="tree-view" data-key-path={jsonKeyPath} data-has-children={hasChildren ? 't' : 'f'} data-collapsed={collapsed ? 't' : 'f'}>
        {arrow}
        <div className="tree-view-group">
          <div className="tree-label" ref="label">
            <i className="tree-icon fa fa-file-text-o"></i> {label}
          </div>
          <ReactTransitionGroup>
            {treeViewChildren}
          </ReactTransitionGroup>
        </div>
      </div>
    );
  }
});

var TreeViewChildren = require('./tree-view-children')(TreeView);
TreeView.Children = TreeViewChildren;

module.exports = TreeView;