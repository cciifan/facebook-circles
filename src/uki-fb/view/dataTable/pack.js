/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/


var fun   = require("../../../uki-core/function");
var utils = require("../../../uki-core/utils");
var dom   = require("../../../uki-core/dom");

var Base = require("../dataList/pack").Pack;


var Pack = fun.newClass(Base, {

  tbody: function() {
    return this._tbody ||
      (this._tbody = this._dom.getElementsByTagName('tbody')[0]);
  },

  updateRow: function(index, isSelected, globalIndex) {
    var tmp = dom.createElement('div', {
      html: this._toHTML(this.data().slice(index, index + 1), globalIndex)
    });
    var item = this._rowAt(index);
    var replaceWith = tmp.getElementsByTagName('tbody')[0].childNodes[0];
    item.parentNode.replaceChild(replaceWith, item);
    this.setSelected(index, isSelected);
  },

  resizeColumn: function(childIndex, width) {
    var tr = this._rowAt(0);
    var td = tr && tr.childNodes[childIndex];
    if (td) { td.style.width = width + 'px'; }
  },

  setSelected: function(position, state) {
    var row = this._rowAt(position);
    if (row) { dom.toggleClass(row, 'uki-dataTable-row_selected', state); }
  },

  _createDom: function(initArgs) {
    this._dom = dom.createElement('div', {
      className: 'uki-dataList-pack'
    });
  },

  _rowAt: function(pos) {
    return this.tbody() && this.tbody().childNodes[pos];
  },

  _formatRow: function(row, index, globalIndex) {
    var i = index + globalIndex;
    return {
      columns: this._formatColumns(row, i, !index),
      row: row,
      index: i,
      even: i & 1
    };
  },

  _formatColumns: function(row, pos, first) {
    var cols = [];
    this.parent().columns().forEach(function(col, i) {
      if (!col.visible) { return; }
      var val = col.key ? utils.prop(row, col.key) : row[i];
      cols[i] = {
        value: col.formatter(val || '', row, pos),
        className: 'uki-dataTable-col-' + i +
          (col.className ? ' ' + col.className : ''),
        style: first && ('width: ' + col.width + 'px')
      };
    });
    return cols;
  }

});



exports.Pack = Pack;
