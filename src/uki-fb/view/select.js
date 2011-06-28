/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./select/select.css");


var fun   = require("../../uki-core/function"),
    utils = require("../../uki-core/utils"),
    dom   = require("../../uki-core/dom"),

    BaseBinding = require("../binding").Binding,
    Focusable   = require("./focusable").Focusable,
    Base        = require("../../uki-core/view/base").Base;


var Select = fun.newClass(Base, Focusable, {
    typeName: 'fb.Select',

    _createDom: function() {
        this._dom = dom.createElement(
            'select',
            { className: 'select', tabIndex: 1 });
    }
});

function appendOptions(root, options) {
    var node;
    options.forEach(function(option) {
        if (option.options) {
            node = dom.createElement('optgroup', {
                label: option.html ? option.html :
                    dom.escapeHTML(option.text)
            });
            appendOptions(node, option.options);
        } else {
            node = dom.createElement('option', {
                html: option.html ? option.html :
                    dom.escapeHTML(option.text),
                value: option.value,
                selected: option.selected
            });
        }
        root.appendChild(node);
    });
}

fun.addProp(Select.prototype, 'options', function(val) {
    this._options = val;
    this._dom.innerHTML = '';
    appendOptions(this._dom, val);
    return this;
});

fun.addProp(Select.prototype, 'binding', function(val) {
    if (this._binding) {
        this._binding.destruct();
    }
    this._binding = val && new Binding(utils.extend({
        view: this,
        model: val.model,
        viewEvent: 'blur change'
    }, val));
});

fun.delegateProp(Select.prototype,
    ['name', 'disabled', 'value', 'selectedIndex'], '_dom');


var Binding = fun.newClass(BaseBinding, {
    updateView: function(e) {
        this._lockUpdate(function() {
            this.viewValue(this.modelValue());
            // if there's no options with the given value,
            // select the first available
            if (this.viewValue() != this.modelValue()) {
                this.view.selectedIndex(0);
                if (this.selectDefault) {
                    this.updateModel();
                }
            }
        });
    }
});


exports.select = {
    Binding: Binding
};
exports.Select = Select;
