/**
 * @jsx React.DOM
 */

var Actions = require('./tree-actions');

var Data = {
  dragSource: null,
  lastDropElement: null
};

class TreeNode {
  constructor($treeView) {
    this.$treeView = $treeView;
  }

  children() {
    return this.$treeView.find('.tree-view-children');
  }

  hasChildren() {
    return this.children().length > 0;
  }

  firstChild() {
    return this.children().find('.tree-view');
  }

  prev() {
    var $prevTreeView = this.$treeView.prev('.tree-view');
    var prevTreeNode = new TreeNode($prevTreeView);
    return prevTreeNode;
  }

}

function hasChildren($treeView) {
  var children = $treeView.find('.tree-view-children');
  return children.length > 0;
}

var $horizontalCursor, $verticalCursor, $plusCursor;

var Position = {
  keys: null, // array of keys
  relativeLocation: null // 'before', 'after' or 'child'
};

function setPosition(keys, relativeLocation) {

}

var TreeDragAndDrop = {
  start: function (dragSource) {
    Data.dragSource = dragSource;
    This.mount();
  },
  setup: function () {
    if (!$horizontalCursor) {
      $horizontalCursor = $('<div class="tree-horizontal-cursor"></div>');
      $verticalCursor = $('<div class="tree-vertical-cursor"></div>');
      $plusCursor = $('<div class="tree-plus-cursor">+</div>');
      $(document.body).append($horizontalCursor).append($plusCursor).append($verticalCursor);
    }
  },
  mount: function () {
    this.setup();
    var $node = $('#tree-top');
    $node.on('mousemove', '.tree-label', This.onMouseMoveLabel);
    $node.on('mousemove', '.tree-view-spacer', This.onMouseMoveSpacer);
    $node.on('mouseleave', This.onMouseLeave);
    // $(document.body).on('mouseup', This.unmount);
  },
  unmount: function () {
    var $node = $('#tree-top');
    $node.off('mousemove', '.tree-label', This.onMouseMoveLabel);
    $node.off('mousemove', '.tree-view-spacer', This.onMouseMoveSpacer);
    $node.off('mouseleave', This.onMouseLeave);
    This.hideCursors();
  },
  onMouseLeave: function () {
    This.hideCursors();
  },
  hideCursors: function () {
    This.hidePlusCursor();
    This.hideVerticalCursor();
    This.hideHorizontalCursor();
  },
  onMouseMoveSpacer: function (jqEvent) {
    var $spacer = $(jqEvent.currentTarget);
    var $treeView = $spacer.parents('.tree-view');
    This.highlightSquareViewBottom($treeView);
  },
  onMouseMoveLabel: function (jqEvent) {
    var $label = $(jqEvent.currentTarget);
    var labelOffset = $label.offset();
    var labelWidth = $label.width();
    var labelHeight = $label.height();
    var y = jqEvent.offsetY;

    var $treeView = $label.parent('.tree-view');
    var treeNode = new TreeNode($treeView);
    // console.log(treeNode.relativeLocation(jqEvent.offsetY));

    var dropPosition;
    var dropMiddleMode = 'ignore'; // ignore, openPage, createSubPage
    var topY, bottomY;
    if (dropMiddleMode == 'ignore') {
      topY = Math.round(labelHeight / 2);
      if (y <= topY) {
        dropPosition = 'top';
      } else {
        dropPosition = 'bottom';
      }
    } else {
      topY = Math.round(labelHeight / 4);
      bottomY = Math.round(topY*3);

      if (y <= topY) {
        dropPosition = 'top';
      } else if (y < bottomY) {
        dropPosition = 'in';
      } else {
        dropPosition = 'bottom';
      }
    }


    var cursorLeft, cursorTop, cursorWidth;

    // TOP OF NODE
    if (dropPosition == 'top') {
      var prevTreeNode = treeNode.prev();
      
      if (prevTreeNode.hasChildren()) {
        This.highlightSquareViewBottom(prevTreeNode.$treeView);
      } else {
        This.highlightViewTop(treeNode.$treeView);
      }
    // BOTTOM...
    } else if (dropPosition == 'bottom') {
      
      // TOP OF FIRST CHILD
      if (treeNode.hasChildren()) {
        This.highlightViewTop(treeNode.firstChild());
      } else {
        // IF NOT FOUND THEN TOP OF NEXT SIBLING
        var $nextTreeView = $treeView.next('.tree-view');
        if ($nextTreeView.length > 0) {
          This.highlightViewTop($nextTreeView);
        } else {
          // IF NOT FOUND THEN TOP OF SPACER
          var $spacerIndent = $treeView
            .parent('.tree-view-children')
            .next('.tree-view-spacer')
            .find('.tree-view-spacer-indent');
          if ($spacerIndent.length > 0) {
            This.highlightViewTop($spacerIndent);
          } else {
            This.highlightBottom($treeView)
          }
        }
      }
    } else {
      This.unhighlight();
    }
  },
  highlightViewTop: function ($treeView) {
    var offset = $treeView.offset();
    $horizontalCursor.css({
      display: 'block',
      left: Math.round(offset.left),
      top: Math.round(offset.top),
      width: Math.round($treeView.width())
    });
    This.hideVerticalCursor();
    This.hidePlusCursor();
  },
  // special case where we want to highlight the bottom of the last top
  // level $treeView. Normally, we'd highlight the top of the next, but
  // in the case of the last, we can't do it.
  highlightBottom: function ($treeView) {
    var offset = $treeView.offset();
    $horizontalCursor.css({
      display: 'block',
      left: Math.round(offset.left),
      top: Math.round(offset.top + $treeView.height()),
      width: Math.round($treeView.width())
    });
    This.hideVerticalCursor();
    This.hidePlusCursor();
  },
  // highlight the squared off bottom of an open $treeView
  highlightSquareViewBottom: function ($treeView) {
    var offset = $treeView.offset();
    var treeViewOffset = $treeView.offset();
    $horizontalCursor.css({
      display: 'block',
      left: Math.round(offset.left),
      top: Math.round(offset.top) + $treeView.height() + 1,
      width: Math.round($treeView.width())
    });
    $verticalCursor.css({
      display: 'block',
      left: Math.round(treeViewOffset.left),
      top: Math.round(treeViewOffset.top) + 16,
      height: Math.round($treeView.height() - 16)
    });
    This.hidePlusCursor();
  },
  hidePlusCursor: function () {
    $plusCursor.css({
      display: 'none'
    });
  },
  hideVerticalCursor: function () {
    $verticalCursor.css({
      display: 'none'
    });
  },
  hideHorizontalCursor: function () {
    $horizontalCursor.css({
      display: 'none'
    });
  },
  unhighlight: function () {
    $horizontalCursor.css({display: 'none'});
    $plusCursor.css({display: 'none'});
  }
};

This = TreeDragAndDrop;

// Actions.dragTreeNode.listen(TreeDragAndDrop.start);

// TreeDragAndDrop.start();

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