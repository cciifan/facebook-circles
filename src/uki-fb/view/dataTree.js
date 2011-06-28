/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./dataTree/dataTree.css");

var fun   = require("../../uki-core/function");
var utils = require("../../uki-core/utils");
var view  = require("../../uki-core/view");

var Base = require("./dataList").DataList;
var Pack = require("./dataTree/pack").Pack;
var SelectionController =
  require("./dataTree/selectionController").SelectionController;
var Binding = require("./dataTree/binding").Binding;


var DataTree = view.newClass('DataTree', Base, {

  childrenKey: fun.newProp('childrenKey'),
  _childrenKey: 'children',

  indentBy: fun.newProp('indentBy'),
  _indentBy: 20,

  _template: requireText('dataTree/pack.html'),


  _setup: function(initArgs) {
    initArgs.packView = 'packView' in initArgs ? initArgs.packView : Pack;

    initArgs.selectionController = 'selectionController' in initArgs ?
      initArgs.selectionController : new SelectionController();

    Base.prototype._setup.call(this, initArgs);
  },

  treeData: fun.newProp('treeData', function(data) {
    this._treeData = data;
    this.data(data.map(function(row) {
      return this._wrapRow(row);
    }, this));
  }),

  selectedRow: function() {
    var row = Base.prototype.selectedRow.call(this);
    return row && row.data;
  },

  selectedRows: function() {
    var rows = Base.prototype.selectedRows.call(this);
    return utils.pluck(rows, 'data');
  },

  open: function(index) {
    var data = this.data();
    var item = data[index];

    if (item && !item.opened && item.children) {
      item.opened = true;

      var indent = item.indent + 1;
      var children = item.children;
      var insertion = [index + 1, 0];

      children.forEach(function(child) {
        insertion.push(this._wrapRow(child, indent));
      }, this);

      Array.prototype.splice.apply(data, insertion);

      this.data(data)
        .layoutIfVisible()
        .selectedIndexes([index])
        .lastClickIndex(index)
        .triggerSelection();
    }
  },

  close: function(index) {
    var data = this.data();
    var item = data[index];

    if (item && item.opened) {
      item.opened = false;
      var children = item.children;

      data.splice(index + 1, children.length);

      this.data(data)
        .layoutIfVisible()
        .selectedIndexes([index])
        .lastClickIndex(index)
        .triggerSelection();
    }
  },

  redrawRow: function(item) {
    var packs = this.childViews();
    for (var i = 0; i < packs.length; i++) {
      var pack = packs[i];
      var index = pack.rowIndex({data: item});
      if (index > -1) {
        var globalIndex = pack.from + index;
        pack.updateRow(index, this.isSelected(globalIndex), globalIndex);
        break;
      }
    }
  },

  _createPack: function() {
    var pack = new this._packView();
    return pack
      .template(this.template())
      .formatter(this.formatter())
      .indentBy(this.indentBy())
      .key(this.key());
  },

  _createBinding: function(options) {
    options = utils.extend(this.bindingOptions(), options);
    options.view = this;
    return new Binding(options);
  },

  _initScrollableParent: function() {
    this.scrollableParent(this.parent().parent());
  },

  _wrapRow: function(row, indent) {
    var children = utils.prop(row, this.childrenKey());
    indent = indent || 0;

    return {
      opened: false,
      data: row,
      children: children && children.length && children || null,
      indent: indent
    };
  }

});


exports.DataTree = DataTree;
