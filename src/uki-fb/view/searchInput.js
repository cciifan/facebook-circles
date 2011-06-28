/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./searchInput/searchInput.css");


var fun  = require("../../uki-core/function"),
    dom  = require("../../uki-core/dom"),
    evt  = require("../../uki-core/event"),
    view = require("../../uki-core/view"),

    Focusable = require("./focusable").Focusable,
    Base      = require("../../uki-core/view/base").Base;


var SearchInput = fun.newClass(Base, Focusable, {
    typeName: 'SearchInput',

    _createDom: function() {
        this._input = dom.createElement(
            'input',
            { type: 'text', className: 'searchInput-input' });

        this._button = dom.createElement(
            'input',
            { type: 'button', className: 'searchInput-button' });

        this._dom = dom.createElement(
            'div',
            { className: 'searchInput' }, [this._input, this._button]);

        evt.addListener(
            this._button,
            'click',
            fun.bind(this._buttonClick, this));
    },

    _buttonClick: function() {
        this.trigger({type: 'search'});
    },

    flex: view.newToggleClassProp('searchInput_flex'),
    buttonless: view.newToggleClassProp('searchInput_buttonless')
});

fun.delegateProp(SearchInput.prototype,
    ['value', 'placeholder', 'size', 'disabled'], '_input');


exports.SearchInput = SearchInput;
