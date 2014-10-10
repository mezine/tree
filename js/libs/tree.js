/**
 * @jsx React.DOM
 */

 var React = require('react');
 var ReactTransitionGroup = require('react/addons').addons.TransitionGroup;

 var TreeView = React.createClass({
  propTypes: {
    collapsed: React.PropTypes.bool,
    defaultCollapsed: React.PropTypes.bool,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {collapsed: this.props.defaultCollapsed};
  },

  handleClick: function(a, b, c) {
    this.setState({collapsed: !this.state.collapsed});
    this.props.onClick && this.props.onClick(a, b, c);
  },

  onClickLabel: function (e) {
    // alert(this.props.label);
  },

  render: function() {
    var collapsed = this.props.collapsed != null ?
      this.props.collapsed :
      this.state.collapsed;

    var arrowClassName = 'tree-view-arrow';
    if (collapsed) {
      arrowClassName += ' tree-view-arrow-collapsed';
    }

    var char;
    if (this.props.childs && this.props.childs.length > 0) {
      char = "V";
    }
    var arrow =
      <div className={arrowClassName} onClick={this.handleClick}>{char}</div>;

    var treeViewChildren = null;
    if (this.props.childs && !this.state.collapsed) {
      treeViewChildren = <TreeViewChildren childs={this.props.childs} />;
    }

    return (
      <div className="tree-view">
        {this.transferPropsTo(arrow)}
        <div className="tree-label" onClick={this.onClickLabel}>{this.props.label}</div>
        <ReactTransitionGroup>
          {treeViewChildren}
        </ReactTransitionGroup>
      </div>
    );
  }
});

var TreeViewChildren = React.createClass({
  componentWillEnter: function (done) {
    var $this = $(this.getDOMNode());
    $this.css('display', 'none');
    $this.slideDown(100, done);
  },
  componentWillLeave: function (done) {
    var $this = $(this.getDOMNode());
    $this.slideUp(100, done);
  },
  render: function () {
    if (!this.props.childs) { return null; }
    var childNodes = this.props.childs.map(function (child) {
      return <TreeView key={child.name} label={child.label} name={child.name} childs={child.children}>{child.label}</TreeView>;
    });
    return <div className='tree-view-children'>{childNodes}</div>;
  }
});

module.exports = TreeView;

var JQuerySlide = React.createClass({
    componentWillEnter: function(callback){
      console.log(1);
        var $el = $(this.getDOMNode());
        $el.slideDown(function(){
            callback();
        });
    },
    componentWillLeave: function(callback){
        console.log(2);
        var $el = $(this.getDOMNode());
        $el.slideUp(function(){
            callback();
        });
    },
    render: function(){
      return this.transferPropsTo(this.props.component({style: {display: 'none'}}));
    }
});