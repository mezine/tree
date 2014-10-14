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
    // label: React.PropTypes.string.isRequired,
    // name: React.PropTypes.string.isRequired,
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
    this.props.onClick && this.props.onClick(a, b, c);
  },

  onStartDrag: function (e) {
    // console.log(this.props.cursor._keyPath)
    Actions.dragTreeNode(this.props.cursor);
  },

  onMouseMoveLabel: function (e) {

  },

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

    var collapsed = this.props.collapsed != null ?
      this.props.collapsed :
      this.state.collapsed;

    var arrowClassName = 'tree-view-arrow';
    if (collapsed) {
      arrowClassName += ' tree-view-arrow-collapsed';
    }

    var hasChildren = children && children.length;
    var char;
    if (hasChildren) {
      char = "V";
    }
    var arrow =
      <div className={arrowClassName} onClick={this.handleClick}>{char}</div>;

    var dropZoneBottom;
    var treeViewChildren = null;

    if (hasChildren && !this.state.collapsed) {
      treeViewChildren = <TreeViewChildren cursor={children} />;
      dropZoneBottom = <div className="tree-drop-zone-bottom"><div className="tree-drop-zone-bottom-line"></div></div>
    }

    var dropTopLine;
    if (this.state.drag == 'top') {
      dropTopLine = <div className="tree-drop"><div className="tree-drop-line"></div></div>;
    }

    var treeViewClass = 'tree-view';
        
    return (
      <div className={treeViewClass} data-key-path={cursor._keyPath} data-has-children={hasChildren} data-collapsed={this.state.collapsed}>
        {this.transferPropsTo(arrow)}
        <div className="tree-label" onMouseDown={this.onStartDrag} onMouseMove={this.onMouseMoveLabel} onMouseEnter={this.onMouseEnterLabel} onMouseLeave={this.onMouseLeaveLabel} ref="label">
          <i className="tree-icon fa fa-file-text-o"></i> {label}
        </div>
        <ReactTransitionGroup>
          {treeViewChildren}
        </ReactTransitionGroup>
      </div>
    );
  }
});

var TreeViewChildren = require('./tree-view-children')(TreeView);
TreeView.Children = TreeViewChildren;

module.exports = TreeView;