/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./view/uiTypeaheadView.css");

var fun   = require("../../../uki-core/function"),
    dom   = require("../../../uki-core/dom"),
    utils = require("../../../uki-core/utils"),

    basicRenderer =
        require("./basicRenderer").basicRenderer,
    Base = require("../../../uki-core/view/base").Base;

/**
* @version draft
* @original author tomocchino
*/
var View = fun.newClass(Base, {

    selectedRow: function() {
        return this._items[this.selectedIndex()];
    },

    selectedResult: function() {
        return this._results[this.selectedIndex()];
    },

    reset: function(clear_view_only) {
        if (!clear_view_only) {
            this._disableAutoSelect = false;
        }
        this._items = [];
        this._results = [];
        this._dom.innerHTML = '';
        this.selectedIndex(-1);
    },

    select: function(clicked) {
        if (this.selectedRow()) {
            this.trigger({
                type: 'select',
                clicked: !!clicked
            });
        }
    },

    isEmpty: function() {
        return !this._results.length;
    },

    render: function(results) {
        if (!results.length) {
            this.reset(/*clear_view_only=*/true);
            return;
        }

        var next = this._defaultIndex(results);

        if (this.selectedIndex() > 0) {
            // something other than the first position is selected
            // so try to keep that
            // specific result selected if possible
            var cur_item = this._results[this.selectedIndex()];
            for (var ii = 0, rl = results.length; ii < rl; ++ii) {
                if (cur_item.id == results[ii].id) {
                    next = ii; break;
                }
            }
        }

        this._results = results;
        this._dom.innerHTML = this._buildMarkup(results);
        this._items = utils.toArray(this._dom.getElementsByTagName('li'));

        this.selectedIndex(next, false);
    },


    /* Protected */

    _renderer: basicRenderer,

    _autoSelect: false,

    _selecting: false,

    _createDom: function(initArgs) {
        this._dom = dom.createElement('div', { className: 'uiTypeaheadView' });
        this.on('mousedown', this._mousedown);
        this.on('mouseup', this._mouseup);
        this.on('mouseover', this._mouseover);
        this.reset();
    },

    _mousedown: function(e) {
        this._selecting = true;
    },

    _mouseup: function(e) {
        this._selecting = false;
        this.select(true);
        e.preventDefault();
    },

    _mouseover: function(e) {
        if (this.visible()) {
            var target = e.target;
            while (target && target.tagName != 'LI') {
                target = target.parentNode;
            }
            this.selectedIndex( this._items.indexOf(target) );
        }
    },

    _buildMarkup: function(results) {
        var renderer, markup = [];
        markup.push('<ul class="' + this.renderer().className + '">');
        results.forEach(function(data, index) {
            markup = markup.concat(this.renderer()(data, index));
        }, this);
        markup.push('</ul>');
        return markup.join('');
    },

    _defaultIndex: function(results) {
        var autoSelect = (this.autoSelect() && !this._disableAutoSelect);
        return this.selectedIndex() < 0 && !autoSelect ? -1 : 0;
    }
});

fun.addProp(View.prototype, ['renderer', 'autoSelect', 'selecting']);

fun.addProp(View.prototype, 'selectedIndex', function(index, trigger) {
    if (this.selectedRow()) {
        dom.removeClass(this.selectedRow(), 'selected');
    }

    if (index > this._items.length - 1) { index = -1; }
    if (index < -1) { index = this._items.length - 1; }
    this._selectedIndex = index;
    this._disableAutoSelect = index == -1;

    if (this.selectedRow()) {
        dom.addClass(this.selectedRow(), 'selected');
    }
    if (trigger !== false) {
        this.trigger({type: 'highlight'});
    }
});


exports.View = View;
