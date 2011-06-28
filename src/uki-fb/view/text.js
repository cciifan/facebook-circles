/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./text/text.css");


var fun  = require("../../uki-core/function"),
    dom  = require("../../uki-core/dom"),
    view = require("../../uki-core/view"),

    Container = require("../../uki-core/view/container").Container;


/**
* @class Text
* @author voloko
* @version draft
*/
var Text = fun.newClass(Container, {}),
    proto = Text.prototype;

proto.typeName = 'fb.Text';

proto._createDom = function() {
    this._content = dom.createElement('span', { className: 'text-content' });
    this._dom = dom.createElement(
        'div',
        { className: 'text text_size-normal' },
        [this._content]);
};

fun.delegateProp(proto, 'html', '_content', 'innerHTML');

proto.size = view.newClassMapProp({
    'normal': 'text_size-normal',
    'huge': 'text_size-large',
    'large': 'text_size-medium'
});

proto.text = function(v) {
    return this.html(v && dom.escapeHTML(v));
};


exports.Text = Text;
