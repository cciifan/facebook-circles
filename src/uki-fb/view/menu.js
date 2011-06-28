/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./menu/menu.css");


var fun   = require("../../uki-core/function"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),
    find  = require("../../uki-core/selector").find,
    build = require("../../uki-core/builder").build,

    Base      = require("../../uki-core/view/base").Base,
    Container = require("../../uki-core/view/container").Container,

    Text      = require("./text").Text,
    Focusable = require("./focusable").Focusable;

/**
* @class Menu
* @author voloko
* @version draft
*/
var Menu = fun.newClass(Container, Focusable, {
    typeName: 'fb.Menu',

    // do not notify children of resize
    layout: fun.FS,

    _createDom: function() {
        this._dom = dom.createElement(
            'ul',
            { className: 'uiMenu', role: 'menu' });
        this.addListener('mouseover', this._mouseover);
        this.addListener('click', this._click);
        this.addListener(
            require("./selectable").Selectable.keyPressEvent(),
            this._keypress);
    },

    _keypress: function(e) {
        if (e.which == 38 || e.keyCode == 38) { // UP
            var focused = this.focused();
            this.focused(focused - 1);
            e.preventDefault();
        } else if (e.which == 40 || e.keyCode == 40) { // DOWN
            this.focused(this.focused() + 1);
            e.preventDefault();
        }
    },

    activeItems: function() {
        return (this._activeItems = this._activeItems ||
            find('[menuItem][disabled!=true]', this));
    },

    focused: function(pos) {
        if (pos === undefined) {
            for (var i = 0, items = this.activeItems();
                i < items.length; i++) {

                if (items[i].hasFocus()) { return i; }
            }
            return -1;
        }
        var item = this.activeItems()[pos];
        if (item) { item.focus(); }
        return this;
    },

    _childrenChanged: function() {
        this._activeItems = null;
    },

    _click: function(e) {
        var item = e.targetView();
        if (item && item.menuItem && !item.disabled()) {
            this.trigger({ type: 'select', targetView: this, item: item });
        }
    },

    _mouseover: function(e) {
        var item = e.targetView();
        if (item && item.menuItem && !item.disabled()) {
            item.focus();
        }
    }
});


/**
* @class MenuItemGroup
* @author voloko
* @version draft
*/
var MenuItemGroup = fun.newClass(Container, {
    typeName: 'fb.MenuItemGroup',

    _createDom: function() {
        this._dom = dom.createElement(
            'li',
            { className: 'uiMenuItemGroup' });
        this._title = build({ view: Text, addClass: 'groupTitle' })[0];
        this._ul = dom.createElement(
            'ul',
            { className: 'uiMenuItemGroupItems' });

        this.dom().appendChild(this._title.dom());
        this.dom().appendChild(this._ul);
    },

    _removeChildFromDom: function(child) {
        this._ul.removeChild(child.dom());
    },

    _appendChildToDom: function(child) {
        this._ul.appendChild(child.dom());
    },

    _insertBeforeInDom: function(child, beforeChild) {
        this._ul.insertBefore(child.dom(), beforeChild.dom());
    }
});
fun.delegateProp(MenuItemGroup.prototype, 'title', '_title', 'text');


/**
* @class MenuItem
* @author voloko
* @version draft
*/
var MenuItem = fun.newClass(Base, Focusable, {
    typeName: 'fb.MenuItem',

    // Menu uses this to differentiate Items from others
    menuItem: true,

    _createDom: function() {
        this._label = dom.createElement('span', { className: 'itemLabel' });
        this._a = this._createA();
        this._a.appendChild(this._label);

        this._dom = dom.createElement(
            'li',
            { className: 'uiMenuItem' },
            [this._a]);
    },

    _createA: function(disabled) {
        return dom.createElement(
            disabled ? 'span' : 'a',
            {
                className: 'itemAnchor' + (disabled ? ' disabledAnchor' : ''),
                href: '#',
                role: 'menuitem',
                rel: 'ignore',
                tabIndex: disabled ? undefined : -1
            }
        );
    },

    focusableDom: function() {
        return this._a;
    },

    text: function(v) {
        return this.html(v && dom.escapeHTML(v));
    },

    disabled: function(v) {
        if (v === undefined) {
            return this.hasClass('disabled');
        }
        if (v !== this.disabled()) {
            this._dom.removeChild(this._a);
            this._a = this._createA(v);
            this._dom.appendChild(this._a);
            this._a.appendChild(this._label);
            this.toggleClass('disabled', v);
        }
        return this;
    }

});
fun.delegateProp(MenuItem.prototype, 'html', '_label', 'innerHTML');


/**
* @class MenuRadioItem
* @author voloko
* @version early draft
*/
var MenuRadioItem = fun.newClass(MenuItem, {
    typeName: 'fb.MenuRadioItem',

    _createDom: function() {
        MenuItem.prototype._createDom.call(this);
        this.addClass('uiMenuItemRadio');
        this.dom().setAttribute('aria-role', 'menuitemradio');
    },

    checked: function(c) {
        if (c === undefined) {
            return this.hasClass('checked');
        }
        this.dom().setAttribute('aria-checked', c ? 'true' : 'false');
        this.toggleClass('checked', c);
        return this;
    }
});


/**
* @class MenuCheckboxItem
* @author voloko
* @version early draft
*/
var MenuCheckboxItem = fun.newClass(MenuItem, {
    typeName: 'fb.MenuCheckboxItem',

    _createDom: function() {
        MenuItem.prototype._createDom.call(this);
        this.addClass('uiMenuItemCheckbox');
        this.dom().setAttribute('aria-role', 'menuitemcheckbox');
    },

    checked: function(c) {
        if (c === undefined) {
            return this.hasClass('checked');
        }
        this.dom().setAttribute('aria-checked', c ? 'true' : 'false');
        this.toggleClass('checked', c);
        return this;
    }
});


/**
* @class MenuSeparator
* @author voloko
* @version draft
*/
var MenuSeparator = fun.newClass(Base, {
    typeName: 'fb.MenuSeparator',

    _createDom: function() {
        this._dom = dom.createElement('li', { className: 'uiMenuSeparator' });
    }
});


exports.Menu             = Menu;
exports.MenuItem         = MenuItem;
exports.MenuItemGroup    = MenuItemGroup;
exports.MenuRadioItem    = MenuRadioItem;
exports.MenuCheckboxItem = MenuCheckboxItem;
exports.MenuSeparator    = MenuSeparator;
