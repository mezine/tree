/**
 * @jsx React.DOM
 */

var Actions = require('./tree-actions');
var _ = require('lodash');
var Cursor = require('./tree-cursor');
var Highlight = require('./tree-highlight');
var Data = require('./tree-drag-and-drop-data');

class TreeSpacer {

  constructor($treeSpacer) {
    this.$treeSpacer = $treeSpacer;
  }

}

class TreeNode {

  constructor($treeView) {
    this.$treeView = $treeView;
  }

  // returns the div that contains the children (not the Array of children)
  children() {
    return this.$treeView.find('.tree-view-children');
  }

  // returns true if there are any children
  hasChildren() {
    return this.children().length > 0;
  }

  firstChild() {
    var $treeView = $(this.children().find('.tree-view')[0]);
    return new TreeNode($treeView);
  }

  height() {
    return this.$treeView.find('.tree-label').height();
  }

  keyPath() {
    if (!this._keyPath) {
      var s = this.$treeView.attr('data-key-path');
      this._keyPath = JSON.parse(s);
    }
    return this._keyPath;
  }

  isDragSource() {
    // console.log(Data.sourceTreeNode.keyPath(), this.keyPath());
    return _.isEqual(Data.sourceTreeNode.keyPath(), this.keyPath());
  }

  dropPosition(y) {
    // if (this.isDragSource()) {
    //   return null;
    // }
    // TODO: Make exceptions for ignoring dragging into same position or
    // dragging into children
    var height = this.height();
    if (y < Math.round(height / 3)) {
      // var prev = this.prev();
      // if (prev && prev.isDragSource()) {
      //   return null;
      // } else {
        return "top";
      // }
    } else if (y < Math.round(height * 2 / 3)) {
      if (this.isDragSource()) {
        return null;
      }
      return "in";
    } else {
      // var next = this.next();
      // console.log('next', next);
      // console.log('next.isDragSource()', next.isDragSource());
      // if (next && next.isDragSource()) {
      //   return null;
      // } else {
        return "bottom";
      // }
    }
  }

  // highlight the source dragged item
  $getLabel() {
    return this.$treeView.find('.tree-label');
  }

  // highlight the source dragged item
  $getGroup() {
    return $(this.$treeView.find('.tree-view-group')[0]);
  }


  dragHighlight() {
    this.$getGroup().addClass('tree-highlight');
    // this.$treeView.find('.tree-label').css('outline', '1px dashed silver');
  }

  dragUnhighlight() {
    this.$getGroup().removeClass('tree-highlight');
    // this.$treeView.find('.tree-label').css('outline', 'none'); 
  }

  // highlight the drop positions

  highlightTop() {
    Highlight.top(this.$getGroup());
    Data.setLastDrop(this.keyPath(), 'before');
  }

  highlightBottom() {
    Highlight.bottom(this.$getGroup());
    Data.setLastDrop(this.keyPath(), 'after');
  }

  highlightSquareBottom() {
    var $treeView = this.$getGroup();
    var offset = $treeView.offset();
    var treeViewOffset = $treeView.offset();
    Cursor.horizontal.css({
      display: 'block',
      left: Math.round(offset.left),
      top: Math.round(offset.top) + $treeView.height() + 1,
      width: Math.round($treeView.width())
    });
    Cursor.vertical.css({
      display: 'block',
      left: Math.round(treeViewOffset.left),
      top: Math.round(treeViewOffset.top) + 16,
      height: Math.round($treeView.height() - 16)
    });
    Cursor.plus.hide();
    Data.setLastDrop(this.keyPath(), 'after');
  }

  highlightIn() {
    var $treeIcon = this.$treeView.find('.tree-icon');
    var treeIconOffset = $treeIcon.offset();
    Cursor.plus.css({
      display: 'block',
      left: Math.round(treeIconOffset.left) - 2,
      top: treeIconOffset.top - 1
    });
    Cursor.vertical.hide();
    Cursor.horizontal.hide();
    Data.setLastDrop(this.keyPath(), 'in');
  }

  prev() {
    var $prevTreeView = this.$treeView.prev('.tree-view');
    if ($prevTreeView.length) {
      var prevTreeNode = new TreeNode($prevTreeView);
      return prevTreeNode;
    } else {
      return null;      
    }
  }

  next() {
    var $nextTreeView = this.$treeView.next('.tree-view');    
    if ($nextTreeView.length) {
      return new TreeNode($nextTreeView);
    } else {
      return null;
    }
  }

}

var TreeDragAndDrop = {
  start: function (dragSource) {
    $node = $('#tree-top');
    $node.on('mousedown', '.tree-label', This.startDrag);
  },
  startDrag: function (jqEvent) {
    var $label = $(jqEvent.currentTarget);
    var $treeView = $label.parents('.tree-view').first();
    Data.sourceTreeNode = new TreeNode($treeView);
    Data.sourceTreeNode.dragHighlight();
    This.mount();
  },
  mount: function () {
    Cursor.trySetup();
    var $node = $('#tree-top');
    $node.addClass('tree-droppable');
    var a = $node.on('mousemove', '.tree-label', This.onMouseMoveLabel);
    console.log(a);
    $node.on('mousemove', '.tree-view-spacer', This.onMouseMoveSpacer);
    $node.on('mouseleave', This.onMouseLeave);
    $(document.body).on('mouseup', This.onMouseUp);
  },
  unmount: function () {
    var $node = $('#tree-top');
    $node.removeClass('tree-droppable');
    $node.off('mousemove', '.tree-label', This.onMouseMoveLabel);
    $node.off('mousemove', '.tree-view-spacer', This.onMouseMoveSpacer);
    $node.off('mouseleave', This.onMouseLeave);
    Cursor.hide();
    Data.sourceTreeNode.dragUnhighlight();
  },
  onMouseUp: function () {
    Actions.moveTreeNode(Data.sourceTreeNode.keyPath(), Data.lastKeyPath, Data.lastRelativePos);
    This.unmount();
  },
  onMouseLeave: function () {
    Cursor.hide();
  },
  onMouseMoveSpacer: function (jqEvent) {
    var $spacer = $(jqEvent.currentTarget);
    var $treeView = $spacer.parents('.tree-view').first();
    var treeNode = new TreeNode($treeView);
    treeNode.highlightSquareBottom();
  },
  onMouseMoveLabel: function (jqEvent) {
    var y = jqEvent.offsetY;
    var $label = $(jqEvent.currentTarget);
    var $treeView = $label.parents('.tree-view').first();
    // console.log($treeView);
    var treeNode = new TreeNode($treeView);
    var dropPosition = treeNode.dropPosition(jqEvent.offsetY);

    // DROP INTO
    if (dropPosition === 'in') {
      treeNode.highlightIn();
    } else if (dropPosition == 'top') {
    // TOP OF NODE
      // console.log('top');
      var prevTreeNode = treeNode.prev();
      
      if (prevTreeNode && prevTreeNode.hasChildren()) {
        prevTreeNode.highlightSquareBottom();
        // This.highlightSquareViewBottom(prevTreeNode.$treeView);
      } else {
        treeNode.highlightTop();
      }
    // BOTTOM...
    } else if (dropPosition == 'bottom') {
      
      // TOP OF FIRST CHILD
      if (treeNode.hasChildren()) {
        treeNode.firstChild().highlightTop();
      } else {
      // IF NO CHILDREN
        var nextTreeNode = treeNode.next();
        // IF THERE IS A NEXT NODE, HIGHLIGHT IT
        if (nextTreeNode) {
          nextTreeNode.highlightTop();
        } else {
          // IF NOT FOUND THEN TOP OF SPACER
          var $spacerIndent = $treeView
            .parent('.tree-view-children')
            .next('.tree-view-spacer')
            .find('.tree-view-spacer-indent');
          if ($spacerIndent.length > 0) {
            Highlight.top($spacerIndent);
            Data.setLastDrop(treeNode.keyPath(), 'after');
          } else {
            treeNode.highlightBottom();
          }
        }
      }
    } else {
      Cursor.hide();
    }
  }
};

This = TreeDragAndDrop;

module.exports = TreeDragAndDrop;

/*

OPEN
top -> TOP
in -> IGNORE IF CHILDREN OPEN / OPEN IF CHILDREN CLOSED ON WAIT
bottom -> TOP OF FIRST CHILD

  top -> TOP
  in -> + IF NO CHILDREN
  bottom -> NEXT TOP

  top -> TOP
  in -> + IF NO CHILDREN
  bottom -> TOP OF SPACER-INDENT

  spacer -> BOTTOM OF SPACER-OUTDENT WITH VERTICAL LINE

CLOSED
top -> TOP
in -> ...
bottom -> NEXT TOP

  ...

top -> TOP
in -> ...
bottom -> ...

TOP
SPACER-TOP (which is indented)
SPACER-BOTTOM

NOTES:
* Every children grouop has a spacer bottom
* There is no bottom for a node. Always use the top of the spacer.
* Generally speaking, we always highlight the top and the bottom highlight
  is always the edge case. Done for consistency.

*/