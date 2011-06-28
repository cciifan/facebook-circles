/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/

var fun = require("../../uki-core/function"),
    dom = require("../../uki-core/dom"),

    Base      = require("../../uki-core/view/base").Base,
    Focusable = require("./focusable").Focusable;

/**
* @class FileInput
* @author voloko
* @version alpha
*/
var FileInput = fun.newClass(Base, Focusable, {
    typeName: 'fb.FileInput',

    _createDom: function() {
        this._dom = dom.createElement('input',
            { type: 'file', className: 'fileInput' });
    }
});

fun.delegateProp(FileInput.prototype,
    ['value', 'select', 'disabled', 'name',
    'files', 'accept', 'multiple'], '_dom');


exports.FileInput = FileInput;
