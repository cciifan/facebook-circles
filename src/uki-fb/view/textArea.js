/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./textArea/textArea.css");


var fun   = require("../../uki-core/function"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),

    TextInput = require("./textInput").TextInput;


/**
* @class TextInput
* @author voloko
* @version alpha
*/
var TextArea = fun.newClass(TextInput, {}),
    proto = TextArea.prototype;

proto.typeName = 'fb.TextArea';

proto._createDom = function() {
    this._dom = dom.createElement(
        'textarea',
        { type: 'text', className: 'textInput textArea' });
};

fun.delegateProp(proto, ['cols', 'rows', 'value', 'name'], '_dom');

proto.noresize = view.newToggleClassProp('uiTextareaNoResize');


exports.TextArea = TextArea;
