/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./dialog/dialog.css");

var env   = require("../../uki-core/env");
var evt   = require("../../uki-core/event");
var fun   = require("../../uki-core/function");
var dom   = require("../../uki-core/dom");
var utils = require("../../uki-core/utils");
var view  = require("../../uki-core/view");

var Attaching = require("../../uki-core/attaching").Attaching;
var Text      = require("./text").Text;
var Container = require("../../uki-core/view/container").Container;

/**
* @class List
* @author voloko
* @version alpha
*/
var Dialog = fun.newClass(Container, {
    typeName: 'fb.Dialog',

    visible: function(state) {
        if (state === undefined) {
            return this._dom.style.display != 'none';
        }

        var prevState = this.visible();
        this._wrapper.style.display =
            this._dom.style.display = state ? '' : 'none';

        this.modal(this.modal());

        if (state && !this.parent()) {
            env.doc.body.appendChild(this._wrapper);
            env.doc.body.appendChild(this._overlay);
            Attaching.attach(this._wrapper, this);
        }
        if (state) { this.layout(); }
        if (state) {
            evt.addListener(
                env.doc,
                'keyup',
                fun.bindOnce(this._keyup, this));
        } else {
            evt.removeListener(
                env.doc,
                'keyup',
                fun.bindOnce(this._keyup, this));
        }

        if (state != prevState) {
            this.trigger({ type: state ? 'show' : 'hide' });
        }

        return this;
    },

    _keyup: function(e) {
        if (this.closeOnEsc() && e.which === 27) {
            this.visible(false);
        }
    },

    wide: view.newToggleClassProp('dialog_wide'),

    destruct: function() {
        Container.prototype.destruct.call(this);
        dom.removeElement(this._wrapper);
        dom.removeElement(this._overlay);
    },

    _createDom: function() {
        this._wrapper = dom.createElement(
            'div',
            { className: 'dialog-wrapper', style: 'display: none'});
        this._overlay = dom.createElement(
            'div',
            { className: 'dialog-overlay', style: 'display: none'});
        this._dom = dom.createElement('div', {
            className: 'dialog',
            style: 'display: none',
            html: '<div class="dialog-bg"></div>'
        });
    }
});

var proto = Dialog.prototype;
fun.addProp(proto, 'closeOnEsc');
proto._closeOnEsc = false;

fun.addProp(proto, 'modal', function(v) {
    this._modal = v;
    this._overlay.style.display = this.visible() && v ? '' : 'none';
});
proto._modal = false;




var DialogHeader = fun.newClass(Text, {
    typeName: 'fb.DialogHeader',

    _createDom: function(initArgs) {
        Text.prototype._createDom.call(this, initArgs);
        this.size('large');
        this.addClass('dialogHeader');
    }
});

var DialogBody = fun.newClass(Container, {
    typeName: 'fb.DialogBody',

    _createDom: function(initArgs) {
        Container.prototype._createDom.call(this, initArgs);
        this.addClass('dialogBody');
    }
});

var DialogContent = fun.newClass(Container, {
    typeName: 'fb.DialogContent',

    _createDom: function(initArgs) {
        Container.prototype._createDom.call(this, initArgs);
        this.addClass('dialogContent');
    }
});

var DialogFooter = fun.newClass(Container, {
    typeName: 'fb.DialogFooter',

    _createDom: function(initArgs) {
        Container.prototype._createDom.call(this, initArgs);
        this.addClass('dialogFooter');
    }
});

exports.Dialog        = Dialog;
exports.DialogHeader  = DialogHeader;
exports.DialogBody    = DialogBody;
exports.DialogContent = DialogContent;
exports.DialogFooter  = DialogFooter;
