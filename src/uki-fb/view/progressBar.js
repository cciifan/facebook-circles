/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./progressBar/progressBar.css");


var fun   = require("../../uki-core/function"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),

    Base = require("../../uki-core/view/base").Base;

var ProgressBar = fun.newClass(Base, {
    typeName: 'fb.ProgressBar',

    _createDom: function() {
        this._fill = dom.createElement(
            'div', {className: 'uiProgressBar-fill'});
        this._dom = dom.createElement('div',
            { className: 'uiProgressBar uiProgressBar_large' },
            [this._fill]);
    },

    size: view.newClassMapProp({
       large: 'uiProgressBar_large',
       small: 'uiProgressBar_small'
    }),

    _min: 0,
    _max: 100,
    _value: 0,

    _redraw: function() {
        var v = Math.max(this.min(), Math.min(this.max(), this.value()));
        dom.toggleClass(
            this._fill,
            'uiProgressBar-fill_empty',
            v == this.min());
        dom.toggleClass(
            this._fill,
            'uiProgressBar-fill_full',
            v == this.max());
        this._fill.style.width = v / (this.max() - this.min()) * 100 + '%';
    }
});

fun.addProp(ProgressBar.prototype, 'max', function(v) {
    this._max = v;
    this._redraw();
});

fun.addProp(ProgressBar.prototype, 'min', function(v) {
    this._min = v;
    this._redraw();
});

fun.addProp(ProgressBar.prototype, 'value', function(v) {
    this._value = v;
    this._redraw();
});


exports.ProgressBar = ProgressBar;
