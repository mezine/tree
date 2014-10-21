var Data = require('./tree-drag-and-drop-data');

var Cursor = {
  trySetup: function () {
    if (!Cursor.isSetup) {
      Cursor.setup();      
    }
  },
  setup: function () {
    Cursor.horizontal = $('<div class="tree-horizontal-cursor unselectable"></div>');
    Cursor.vertical = $('<div class="tree-vertical-cursor unselectable"></div>');
    Cursor.plus = $('<div class="tree-plus-cursor unselectable">+</div>');
    $(document.body)
      .append(Cursor.horizontal)
      .append(Cursor.vertical)
      .append(Cursor.plus);
    Cursor.isSetup = true;
  },
  hide: function () {
    Cursor.horizontal.hide();
    Cursor.vertical.hide();
    Cursor.plus.hide();
    Data.setLastDrop();
  }
};

module.exports = Cursor;