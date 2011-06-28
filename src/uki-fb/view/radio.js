/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./radio/radio.css");


var fun   = require("../../uki-core/function"),
    utils = require("../../uki-core/utils"),
    dom   = require("../../uki-core/dom"),

    Base = require("../../uki-core/view/base").Base,

    Binding = require("../binding").Binding;


var Radio = fun.newClass(Base, {
    typeName: 'Radio',

    _createDom: function(initArgs) {
        this._input = dom.createElement('input',
            { className: 'radio-input', type: 'radio', name: initArgs.name });
        this._label = dom.createElement('span',
            { className: 'radio-label' });
        this._dom = dom.createElement(initArgs.tagName || 'label',
            { className: 'radio' }, [this._input, this._label]);
    },

    domForEvent: function(type) {
        return this._input;
    }
});

fun.addProp(Radio.prototype, 'binding', function(val) {
    if (this._binding) {
        this._binding.destruct();
    }
    this._binding = val &&
        new Binding(utils.extend({
            view: this,
            model: val.model,
            viewEvent: 'click',
            viewProp: 'checked',
            commitChangesViewEvent: 'click'
        }, val));
});

fun.delegateProp(Radio.prototype,
    ['name', 'checked', 'disabled', 'value'], '_input');
fun.delegateProp(Radio.prototype,
    'html', '_label', 'innerHTML');

Radio.prototype.label = Radio.prototype.text;


exports.Radio = Radio;
