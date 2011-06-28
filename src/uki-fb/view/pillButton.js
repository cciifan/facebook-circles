/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./pillButton/pillButton.css");


var fun  = require("../../uki-core/function"),
    dom  = require("../../uki-core/dom"),
    view = require("../../uki-core/view"),

    Base = require("../../uki-core/view/base").Base;


var PillButton = fun.newClass(Base, {
    typeName: 'fb.PillButton',

    _createDom: function() {
        this._dom = dom.createElement(
            'a',
            { href: '#', className: 'pillButton' });
    },

    label: function(value) {
        if (value === undefined) {
            return this.dom().innerHTML;
        }
        this.dom().innerHTML = dom.escapeHTML(value);
        return this;
    },

    selected: view.newToggleClassProp('pillButton_selected')
});


exports.PillButton = PillButton;
