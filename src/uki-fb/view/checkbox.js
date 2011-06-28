/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./checkbox/checkbox.css");


var fun = require("../../uki-core/function"),
    dom = require("../../uki-core/dom"),

    Radio = require("./radio").Radio;

/**
* @class Checkbox
* @author voloko
* @version alpha
*/
var Checkbox = fun.newClass(Radio, {
    typeName: 'fb.Checkbox',

    _createDom: function(initArgs) {
        this._input = dom.createElement(
            'input',
            {
                className: 'checkbox-input',
                type: 'checkbox',
                name: initArgs.name
            });

        this._label = dom.createElement(
            'span',
            { className: 'checkbox-label' });

        this._dom = dom.createElement(
            initArgs.tagName || 'label',
            { className: 'checkbox' },
            [this._input, this._label]);
    }
});

exports.Checkbox = Checkbox;
