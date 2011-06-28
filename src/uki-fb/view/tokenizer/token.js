/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./token.css");

var fun   = require("../../../uki-core/function"),
    dom   = require("../../../uki-core/dom"),

    Base = require("../../../uki-core/view/base").Base;


/**
* @class Token
* @author voloko
* @version draft
*/
var Token = fun.newClass(Base, {
    info: function(v) {
        if (v === undefined) {
            return { text: this.label(), id: this.value() };
        }
        this.value(v.id);
        return this.labelText(v.text);
    },

    labelText: function(v) {
        return this.label(v && dom.escapeHTML(v));
    },

    isClickOnRemove: function(e) {
        return dom.hasClass(e.target, 'remove');
    },

    _createDom: function() {
        this._remove = dom.createElement('a', {
          href: '#',
          title: 'Remove',
          className: 'remove uiCloseButton uiCloseButtonSmall',
          html: ', '
        });

        this._label = dom.createElement('span');

        this._dom = dom.createElement('span', {
          className: 'removable uiToken'
        }, [this._label, this._remove]);
    }
});

fun.addProp(Token.prototype, 'value');

fun.delegateProp(Token.prototype, 'label', '_label', 'innerHTML');


exports.Token = Token;
