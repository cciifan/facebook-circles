/**
* Copyright (c) 2010 Vladimir Kolesnikov, ukijs
*
* This file was automatically generated from uki source by Facebook.
* @providesModule uki-view-base
* @option preserve-header
*/

var view  = require("../view"),
    utils = require("../utils"),
    fun   = require("../function"),
    env   = require("../env"),
    dom   = require("../dom"),
    evt   = require("../event"),

    Binding = require("../binding").Binding;


var POS_RULES = [
        'top', 'right', 'left', 'bottom', 'width', 'height',
        'marginLeft', 'marginTop', 'marginBottom', 'marginRight'
    ],
    POS_MAP = {
        t: 'top', r: 'right',
        l: 'left', b: 'bottom',
        w: 'width', h: 'height',
        ml: 'marginLeft', mr: 'marginRight',
        mt: 'marginTop', mb: 'marginBottom'
    };

function styleToString(style) {
    if (typeof style === 'string') return style;
    var result = [];
    utils.forEach(style, function(value, key) {
        result.push(utils.dasherize(key) + ':' + value);
    });
    return result.join(';');
}

var Base = view.newClass('Base', {

    /**
    * @constructor
    */
    init: function(initArgs) {
        initArgs = initArgs || {};
        this._setup(initArgs);
        this._createDom(initArgs);
        this.dom()[env.expando] = this.dom()[env.expando] || env.guid++;
        view.register(this);
    },

    destruct: function() {
        view.unregisterId(this);
        view.unregister(this);
        this.removeListener();
        this.bindings([]);
        this.destructed = true;
    },

    _setup: fun.FS,

    /**
    * Being called within construction
    * @protected
    */
    _createDom: function(initArgs) {
        this._dom = dom.createElement(initArgs.tagName || 'div');
    },

    /**
     * Called when view becomes visible for the first time.
     *
     * At this point you can access offsetWidth, offsetHeight and do mesurments
     *
     * @protected
     */
    _initLayout: fun.FS,

    /**
    * Being called when you need to update view's layout. Usualy
    * when parent gets resized, however will be also called when view gains
    * visibility. Gurantied to be called only when view is visible and has
    * dimensions (in document and not hidden)
    *
    * @protected
    */
    _layout: fun.FS,

    /**
     * Start layout process manualy
     *
     * @public
     */
    layout: function() {
        if (this.visible()) {
            if (!this._layoutBefore) {
                this._layoutBefore = true;
                this._initLayout();
            }
            this._layout();
        }
        return this;
    },

    layoutIfVisible: function() {
        if (this.dom() && this.dom().offsetWidth) { this.layout(); }
        return this;
    },

    /**
    * Get views container dom node.
    * @returns {Element} dom
    */
    dom: function() {
        return this._dom;
    },

    /**
    * Accessor for view visibility.
    *
    * @param {boolean=} state
    * @returns {boolean|view.Base} current visibility state of self
    */
    visible: fun.newProp('visible', function(state) {
        var origState = this.visible();
        this._visible = state;
        this.dom().style.display = state ? '' : 'none';
        // if we change from invis to vis, and we have dom, and we're attached
        // redraw
        if (state && !origState) {
            this.layoutIfVisible();
        }
        return this;
    }),

    _visible: true,

    /* -------------------------- Common DOM accessors ----------------------*/

    html: fun.newDelegateProp('dom', 'innerHTML'),

    text: function(v) {
        return this.html(v && dom.escapeHTML(v));
    },


    /**
    * Used for fast (on hash lookup) view searches: build('#view_id');
    *
    * @param {string=} id New id value
    * @returns {string|view.Base} current id or self
    */
    id: function(id) {
        if (id === undefined) { return this.dom().id; }
        if (this.dom().id) { view.unregisterId(this); }
        this.dom().id = id;
        view.registerId(this);
        return this;
    },


    /**
    * Accessor for dom().className
    * @param {string=} className
    *
    * @returns {string|view.Base} className or self
    */
    className: fun.newDelegateProp('dom', 'className'),

    addClass: function(className) {
        dom.addClass(this.dom(), className);
        return this;
    },

    hasClass: function(className) {
        return dom.hasClass(this.dom(), className);
    },

    removeClass: function(className) {
        dom.removeClass(this.dom(), className);
        return this;
    },

    toggleClass: function(className, condition) {
        dom.toggleClass(this.dom(), className, condition);
        return this;
    },

    scrollTop: fun.newDelegateProp('dom', 'scrollTop'),

    scrollLeft: fun.newDelegateProp('dom', 'scrollLeft'),

    scroll: function(dx, dy) {
        dx && this.scrollLeft(this.scrollLeft() + dx);
        dy && this.scrollTop(this.scrollTop() + dy);
    },

    title: fun.newDelegateProp('dom', 'title'),

    /**
    * Experimental
    */
    style: function(value) {
        if (value === undefined) {
            return this.dom().style;
        }
        this.dom().style.cssText = styleToString(value);
        return this;
    },

    addStyle: function(value) {
        this.dom().style.cssText += ';' + styleToString(value);
        return this;
    },

    textSelectable: fun.newProp('textSelectable', function(state) {
        this._textSelectable = state;
        if (!state) { initTextSelectable(); }
        this.toggleClass('uki-textSelectable_off', !state);
        this[state ? 'removeListener' : 'addListener']
            ('selectstart', evt.preventDefaultHandler);
    }),

    /* ------------------------------ Events --------------------------------*/

    domForEvent: function(type) {
        return this.dom();
    },

    /**
     * @param {String} name Event name, or space separated names
     * @param {function()} callback
     */
    addListener: function(names, callback) {
        if (typeof names === 'object') {
            utils.forEach(names, function(callback, name) {
                this.addListener(name, callback);
            }, this);
        } else {
            var wrapper = typeof callback === 'string' ?
                Base.controllerCallback(callback) :
                fun.bindOnce(callback, this);

            this._eventNames || (this._eventNames = {});
            utils.forEach(names.split(' '), function(name) {
                this._eventNames[name] = true;
                evt.addListener(this.domForEvent(name), name, wrapper);
            }, this);
        }
        return this;
    },

    /**
     * @param {String} name Event name, or space separated names,
     *                      or null to remove from all types
     * @param {function()} callback or null to remove all callbacks
     */
    removeListener: function(names, callback) {
        var wrapper = callback && fun.bindOnce(callback, this);
        names || (names = utils.keys(this._eventNames || {}).join(' '));
        utils.forEach(names.split(' '), function(name) {
            evt.removeListener(this.domForEvent(name), name, wrapper);
        }, this);
        return this;
    },

    trigger: function(e) {
        var node = this.domForEvent(e.type);
        var wrapped = evt.createEvent(e, { _targetView: this });
        return evt.trigger(node, e);
    },


    /* ---------------------------- Container API ---------------------------*/

    /**
    * Accessor attribute for parent view. When parent is set view appends
    * its #dom to parents #dom
    *
    * @param {?view.Base=} parent
    * @returns {view.Base} parent or self
    */
    parent: function(parent) {
        if (parent === undefined) {
            return this._parent;
        }

        this._parent = parent;
        return this;
    },

    /**
    * Reader for previous view
    * @returns {view.Base}
    */
    prevView: function() {
        if (!this.parent()) { return null; }
        return this.parent().childViews()[this._viewIndex - 1] || null;
    },

    /**
    * Reader for next view
    * @returns {view.Base}
    */
    nextView: function() {
        if (!this.parent()) { return null; }
        return this.parent().childViews()[this._viewIndex + 1] || null;
    },

    childViews: function() {
        return [];
    },

    /* ---------------------------- Positioning -----------------------------*/

    /**
    * Shortcut to set absolute positioning props
    * @param {string|object} p Position string in the form of
    *                          'l:10px t:10px r:30% h:200px'
    */
    pos: function(pos) {
        if (pos === undefined) {
            return this._styleToPos(this.dom().style);
        }
        pos = this._expandPos(pos);
        this.addStyle(pos);
        return this;
    },

    _styleToPos: function(style) {
        var res = {};
        utils.forEach(POS_RULES, function(rule) {
            if (style[rule]) {
                res[rule] = style[rule];
            }
        });
        return res;
    },

    _expandPos: function(pos) {
        if (typeof pos === 'string') {
            var p = pos;
            pos = {};
            utils.forEach(p.split(/\s+/), function(rule) {
                var parts = rule.split(':');
                pos[parts[0]] = parts[1];
            });
        }
        utils.forEach(POS_MAP, function(longRule, shortRule) {
            if (pos[shortRule]) pos[longRule] = pos[shortRule];
        });
        pos.position = 'absolute';
        return pos;
    },

    clientRect: function(ignoreScroll) {
        return dom.clientRect(this.dom(), ignoreScroll);
    },

    /* -------------------------------- Binding -----------------------------*/

    bindingOptions: fun.newProp('bindingOptions'),

    bindings: fun.newProp('bindings', function(val) {
        val = val || [];
        utils.invoke(this.bindings() || [], 'destruct');
        this._bindings = utils.map(val, this._createBinding, this);
    }),

    _createBinding: function(options) {
        options = utils.extend(this.bindingOptions(), options);
        options.view = this;
        return new Binding(options);
    },

    binding: function(val) {
        if (val === 'undefined') {
            return this.bindings()[0];
        }
        return this.bindings(val && [val]);
    }

});

function initTextSelectable() {
    initTextSelectable = fun.FT;
    dom.createStylesheet(requireText('base/textSelectable.txt'));
}

Base.prototype.on = Base.prototype.addListener;

exports.Base = Base;
