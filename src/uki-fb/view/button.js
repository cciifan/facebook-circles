/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./button/button.css");


var fun   = require("../../uki-core/function"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),
    utils = require("../../uki-core/utils"),

    Base = require("../../uki-core/view/base").Base,
    Focusable = require("./focusable").Focusable;

/**
* @class Button
* @author voloko
* @version alpha
*/
var Button = fun.newClass(Base, Focusable, {
    typeName: 'fb.Button',

    _createDom: function() {
        this._input = dom.createElement(
            'input',
            { type: 'button', className: 'uiButtonInput' });

        this._dom = dom.createElement(
            'label',
            { className: 'uiButton uiButtonNoText' },
            [this._input]);
    },

    focusableDom: function(type) {
        return this._input;
    },

    domForEvent: function() {
        return this._input;
    },

    label: function(v) {
        if (v === undefined) { return this._input.value; }
        this._input.value = v;
        this.toggleClass('uiButtonNoText', !v);
        return this;
    },

    disabled: function(state) {
        if (state === undefined) { return this._input.disabled; }
        this._input.disabled = state;
        this.toggleClass('uiButtonDisabled', state);
        return this;
    },

    use: view.newClassMapProp({
       special: 'uiButtonSpecial',
       confirm: 'uiButtonConfirm'
    }),

    large: view.newToggleClassProp('uiButtonLarge'),
    suppressed: view.newToggleClassProp('uiButtonSuppressed'),
    depressed: view.newToggleClassProp('uiButtonDepressed')
});

fun.addProp(Button.prototype, 'icon', function(v) {
    dom.removeElement(this._iconDom);
    this._icon = v;
    if (v) {
        this._iconDom = dom.createElement('img', { className: 'img', src: v });
        this._dom.insertBefore(this._iconDom, this._input);
    }
});



exports.Button = Button;
