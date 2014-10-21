var Data = {
  sourceTreeNode: null, // source of drag as a TreeNode object
  lastKeyPath: null,
  lastRelativePos: null,
  setLastDrop: function (keyPath, relativePos) {
    Data.lastKeyPath = keyPath || null;
    Data.lastRelativePos = relativePos || null;
  }
};

module.exports = Data;