/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/

var fun = require("../../../uki-core/function");

var Base = require("../../../uki-core/binding").Binding;


var Binding = fun.newClass(Base, {

  modelEvent: 'change.item',

  init: function(options) {
    Base.prototype.init.call(this, options);
    if (this.sync !== false && this.model && this.view) {
      this.view.treeData(this.model);
    }
  },

  updateModel: function(e) {},

  updateView: function(e) {
    if (e && this.view.shouldRedrawOnPropChange(e.name)) {
      // force single rewrite during a script execution
      this._modelsToRedraw = this._modelsToRedraw || [];
      this._modelsToRedraw.push(e.model);
      fun.deferOnce(this._redrawModels, this);
    }
  },

  _redrawModels: function() {
    this._modelsToRedraw.forEach(function(model) {
      this.view.redrawRow(model);
    }, this);
    this._modelsToRedraw = [];
  }

});


exports.Binding = Binding;
