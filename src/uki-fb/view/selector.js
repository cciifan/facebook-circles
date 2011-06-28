/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./selector/selector.css");


var fun   = require("../../uki-core/function"),
    utils = require("../../uki-core/utils"),
    evt   = require("../../uki-core/event"),
    env   = require("../../uki-core/env"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),
    build = require("../../uki-core/builder").build,

    Base = require("../../uki-core/view/base").Base,

    Selectable = require("./selectable").Selectable,
    Focusable  = require("./focusable").Focusable,
    Menu       = require("./menu").Menu;
    Button     = require("./button").Button;

/**
* @class Selector
* @author voloko
* @version early draft
*/
var Selector = fun.newClass(Base, Focusable, {}),
    proto = Selector.prototype;

var TOGGLE_CLASS = 'openToggler';

proto.typeName = 'fb.Selector';

var wrapperHTML =
    '<div class="wrap"><div class="uiSelectorMenuWrapper"></div></div>';

proto._createDom = function() {
    this._dom = dom.createElement('div', {
        className: 'uiSelector uiSelectorLeft uiSelectorTop uiSelectorNormal',
        html: wrapperHTML
    });
    this._wrap = this._dom.firstChild;
    this._menuWrapper = this._wrap.firstChild;
    this._button = build({
        view: Button,
        addClass: 'uiSelectorButton',
        parent: this
    })[0];
    this._menu = build({
        view: Menu,
        addClass: 'uiSelectorMenu',
        parent: this
    })[0];
    this._wrap.appendChild(this._button.dom());
    this._menuWrapper.appendChild(this._menu.dom());

    this._button.addListener('click', fun.bind(this._click, this));
};

fun.delegateCall(proto, ['appendChild', 'removeChild', 'insertBefore',
    'childViews', 'lastChild', 'firstChild'], '_menu');
fun.delegateProp(proto, ['large', 'disabled', 'suppressed', 'depressed',
    'disabled', 'icon', 'label'], '_button');

proto.alignh = view.newClassMapProp({
    left: 'uiSelectorLeft',
    right: 'uiSelectorRight'
});

proto.alignv = view.newClassMapProp({
    top: 'uiSelectorTop',
    bottom: 'uiSelectorBottomUp'
});

proto.opened = function(v) {
    if (v === undefined) {
        return dom.hasClass(this._wrap, TOGGLE_CLASS);
    }
    var current = dom.hasClass(this._wrap, TOGGLE_CLASS);
    v = !!v;
    if (current != v) {
      this._toggleListeners(v);
      dom.toggleClass(this._wrap, TOGGLE_CLASS, v);
    }
    return this;
};

proto._toggleListeners = function(state) {
  var method = state ? 'addListener' : 'removeListener';
  evt[method](env.docElem, 'click', fun.bindOnce(this._docClick, this));
  evt[method](
      env.docElem,
      Selectable.keyPressEvent(),
      fun.bindOnce(this._keypress, this));
};

proto._click = function(e) {
    this.opened(!this.opened());
};

proto._keypress = function(e) {
    var v = e.targetView();
    if (!v || !view.contains(this._menu, v)) {
        this._menu._keypress(e);
    }
};

proto._docClick = function(e) {
    var v = e.targetView();
    if (v && view.contains(this, v)) {
        // do nothing
    } else {
        this.opened(false);
    }
};


exports.Selector = Selector;
