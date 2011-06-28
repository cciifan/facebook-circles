/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./sideNav/sideNav.css");


var fun   = require("../../uki-core/function"),
    utils = require("../../uki-core/utils"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),
    find  = require("../../uki-core/selector").find,

    Mustache = require("../../uki-core/mustache").Mustache,

    Base      = require("../../uki-core/view/base").Base,
    Container = require("../../uki-core/view/container").Container;


/**
* @class SideNav
* @author voloko
* @version draft
*/
var SideNav = fun.newClass(Container, {

    typeName: 'fb.SideNav',

    _createDom: function() {
        this._dom = dom.createElement('ul', { className: 'uiSideNav' });
        this.on('click', this._click);
    },

    selected: function(number) {
        if (number === undefined) {
            return find('> [selected]', this)[0]._viewIndex;
        }
        find('> [selected]', this).prop('selected', false);
        this.childViews()[number].selected(true);
        return this;
    },

    _click: function(e) {
        var child = e.targetView();
        if (child && child != this) {
            this.selected(child._viewIndex);
            this.trigger({ type: 'selected', target: this, button: child });
        }
    }
});



/**
* @class SideNavItem
* @author voloko
* @version draft
*/
var SideNavItem = fun.newClass(Base, {

    typeName: 'fb.SideNavItem',

    _template: requireText('sideNav/sideNavItem.html'),

   _createDom: function() {
       this._dom = dom.createElement('li', { className: 'uiSideNavItem' });
   },

   _redraw: function() {
       this._dom.innerHTML = Mustache.to_html(this._template, {
           icon: this.icon(),
           label: this.label(),
           count: this.count()
       });
   },

   selected: view.newToggleClassProp('selectedItem')
});

var proto = SideNavItem.prototype;
fun.addProp(proto, 'count', function(v) {
    this._count = v;
    this._redraw();
});

fun.addProp(proto, 'label', function(v) {
    this._label = v;
    this._redraw();
});

fun.addProp(proto, 'icon', function(v) {
    this._icon = v;
    this._redraw();
});

fun.addProps(proto, 'template');


exports.SideNav = SideNav;
exports.SideNavItem = SideNavItem;
