/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./textInput/textInput.css");


var fun   = require("../../uki-core/function"),
    utils = require("../../uki-core/utils"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),

    Base      = require("../../uki-core/view/base").Base,
    Focusable = require("./focusable").Focusable;


/**
* @class TextInput
* @author voloko
* @version alpha
*/
var TextInput = fun.newClass(Base, Focusable, {}),
    proto = TextInput.prototype;

proto.typeName = 'fb.TextInput';
fun.delegateProp(
    proto,
    ['value', 'select', 'placeholder', 'size', 'maxlen', 'disabled', 'name'],
    '_dom');

proto.value = function(v) {
  if (v === undefined) {
    return this.hasClass('DOMControl_placeholder') ? '' : this._dom.value;
  }
  this._dom.value = v;
  return this;
};

fun.addProp(proto, 'binding', function(val) {
    if (this._binding) {
        this._binding.destruct();
    }
    var Binding = require("../binding").Binding;
    this._binding = val && new Binding(
        utils.extend({
            view: this,
            model: val.model,
            viewEvent: 'blur change'
        }, val));
});

proto._createDom = function() {
    this._dom = dom.createElement(
        'input',
        { type: 'text', className: 'textInput' });
    this.on('focus', fun.bindOnce(this._focus, this));
};

proto._focus = function() {
  this.removeClass('DOMControl_placeholder');
};


exports.TextInput = TextInput;
