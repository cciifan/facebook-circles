/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/

var fun   = require("../../../uki-core/function");
var utils = require("../../../uki-core/utils");
var dom   = require("../../../uki-core/dom");

var Base =
  require("../dataList/selectionController").SelectionController;


var SelectionController = fun.newClass(Base, {
  _onkeyrepeat: function(e) {
    if (!this._view.hasFocus()) { return; }

    if (e.which == 37 || e.keyCode == 37) { // LEFT
      var data = this._view.data();
      var lastClickIndex = this._view.lastClickIndex();
      var item = data[lastClickIndex];

      if (item.opened) {
        this._view.close(lastClickIndex);
      } else {
        var indent = item.indent - 1;

        for (var i = lastClickIndex - 1; i > -1; i--) {
          if (data[i].indent == indent) {
            this._view.selectedIndex(i)
              .lastClickIndex(i)
              .scrollToIndex(i);
            break;
          }
        }
        }
    } else if (e.which == 39 || e.keyCode == 39) { // RIGHT
      this._view.open(this._view.lastClickIndex());
    } else {
      Base.prototype._onkeyrepeat.call(this, e);
    }
  },

  _onmousedown: function(e) {
    if (dom.hasClass(e.target, 'uki-dataTree-toggle')) {
      var index = this._eventToIndex(e);
      var item = this._view.data()[index];
      var tree = this._view;

      fun.defer(function() {
        item.opened ? tree.close(index) : tree.open(index);
      });

      return this;
    }
    return Base.prototype._onmousedown.call(this, e);
  }
});


exports.SelectionController = SelectionController;
