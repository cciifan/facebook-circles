/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/

var fun   = require("../../../uki-core/function");
var utils = require("../../../uki-core/utils");
var view  = require("../../../uki-core/view");

var Base = require("../dataList/pack").Pack;

var Pack = view.newClass('dataTree.Pack', Base, {
  indentBy: fun.newProp('indentBy'),

  _rowId: function(row) {
    return utils.prop(row.data, 'id');
  },

  _formatRow: function(row, index, globalIndex) {
    index = index + globalIndex;

    var value = this._formatter(
      this.key() ? utils.prop(row.data, this.key()) : row.data,
      row.data,
      index);

    var indent = row.indent * this.indentBy();

    return {
      value: value,
      hasChildren: !!row.children,
      style: indent ? ' style="margin-left:' + indent + 'px"' : '',
      className: row.opened ? ' uki-dataTree-row_opened' : '',
      row: row.data,
      index: index,
      even: index & 1
    };
  }
});

exports.Pack = Pack;
