/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./form/form.css");


var fun   = require("../../uki-core/function"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),
    utils = require("../../uki-core/utils"),

    Container = require("../../uki-core/view/container").Container;

/**
* @class Form
* @author voloko
* @version alpha
*/
var Form = view.newClass('fb.Form', Container, {

    _createDom: function() {
        var hiddenInput = dom.createElement('input', {
            type: 'hidden',
            name: 'fb_dtsg',
            value: global.Env && global.Env.fb_dtsg
        });

        this._dom = dom.createElement(
            'form',
            { className: 'uki-fb-form' },
            [hiddenInput]);
    },

    appendData: function(data) {
        utils.forEach(data, function(value, name) {
            this.dom().appendChild(dom.createElement('input', {
                type: 'hidden',
                name: name,
                value: value
            }));
        }, this);
    }

});

fun.delegateProp(
    Form.prototype,
    ['name', 'target', 'action', 'method', 'enctype'],
    'dom');
fun.delegateCall(Form.prototype, ['submit'], 'dom');

exports.Form = Form;
