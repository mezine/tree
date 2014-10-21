var Cursor = require('./tree-cursor');

var Highlight = {
  top: function ($treeView) {
    var offset = $treeView.offset();
    Cursor.horizontal.css({
      display: 'block',
      left: Math.round(offset.left),
      top: Math.round(offset.top),
      width: Math.round($treeView.width())
    });
    Cursor.vertical.hide();
    Cursor.plus.hide();
  },
  // special case where we want to highlight the bottom of the last top
  // level $treeView. Normally, we'd highlight the top of the next, but
  // in the case of the last, we can't do it.
  bottom: function ($treeView) {
    var offset = $treeView.offset();
    Cursor.horizontal.css({
      display: 'block',
      left: Math.round(offset.left),
      top: Math.round(offset.top + $treeView.height()),
      width: Math.round($treeView.width())
    });
    Cursor.vertical.hide();
    Cursor.plus.hide();
  }
};

module.exports = Highlight;