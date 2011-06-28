/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./tokenizer/tokenizer.css");
requireCss("./tokenizer/inline_tokenizer.css");

var fun   = require("../../uki-core/function"),
    utils = require("../../uki-core/utils"),
    evt   = require("../../uki-core/event"),
    dom   = require("../../uki-core/dom"),
    build = require("../../uki-core/builder").build,

    Container = require("../../uki-core/view/container").Container,

    Binding   = require("../binding").Binding,
    Typeahead = require("./typeahead").Typeahead,
    Token     = require("./tokenizer/token").Token;


/**
* @class Tokenizer
* @version draft
*/
var Tokenizer = fun.newClass(Container, {}),
    proto = Tokenizer.prototype;

proto.typeName = 'Tokenizer';

fun.addProps(proto, ['freeform', 'maxTokens', 'value2info', 'info2value']);

fun.delegateProp(proto, [
    'data', 'disabled', 'selectedText',
    'queryThrottle', 'renderer', 'autoSelect',
    'selectedResult', 'selectedIndex', 'id',
    'focus', 'blur', 'hasFocus'
], '_typeahead');

fun.addProp(proto, 'placeholder', function(v) {
    this._placeholder = v;
    this._updatePlaceholder();
});

fun.addProp(proto, 'inline', function(v) {
    this._inline = v;
    this.toggleClass('uiInlineTokenizer', v);
    if (v) {
        this.dom().insertBefore(this._tokenArea, this.dom().firstChild);
    } else {
        this.dom().appendChild(this._tokenArea);
    }
});

fun.addProp(proto, 'binding', function(val) {
    if (this._binding) {
        this._binding.destruct();
    }
    this._binding = val && new Binding(
        utils.extend({
            view: this,
            model: val.model,
            viewEvent: 'blur change'
        }, val));
});

proto.value = function(v) {
    if (v === undefined) {
        return utils.pluck(this.childViews(), 'info').map(this.info2value());
    }
    var views = [];
    (v || []).forEach(function(id) {
        var info = this.value2info()(id);
        if (info) {
            views.push({ view: 'tokenizer.Token', info: info });
        }
    }, this);
    this.childViews(views);
    return this;
};

proto.domForEvent = function(name) {
    if (' blur focus copy paste keydown keyup keypress'.indexOf(name) > -1) {
        return this._typeahead.domForEvent(name);
    }
    return this.dom();
};


/* Protected */
proto._inline = false;
proto._maxTokens = false;
proto._freeform = false;

proto._value2info = function(v) {
    return { id: v, text: v };
};

proto._info2value = function(i) {
    return i.id;
};

proto._createDom = function() {
    this._tokenArea = dom.createElement('div', { className: "tokenarea" });

    this._typeahead = build({
        view: Typeahead, setValueOnSelect: false,
        resetOnSelect: true, parent: this })[0];

    this._dom = dom.createElement(
        'div',
        { className: 'clearfix uiTokenizer uiTokenizerEmpty' },
        [this._typeahead.dom(), this._tokenArea]);

    this._initEvents();
};

proto._initEvents = function() {
    this._typeahead.on('select', fun.bind(this._select, this));
    evt.on(this._tokenArea, 'click', fun.bind(this._areaClick, this));

    this.on('blur', this._blur, this);
    this.on('keydown', this._keydown, this);
    this.on('paste', this._paste, this);
    this.on('click', this.focus);
};

proto._blur = function(e) {
  if (this._typeahead.selecting()) { return; }
  if (this.freeform()) {
    this._commitFreeform();
  } else {
    this._typeahead.reset();
  }
};

proto._select = function() {
    var selected = this.selectedResult();
    if (selected && 'id' in selected) {
        this._updateInput();
        build({ view: Token, info: selected }).appendTo(this);
        this.trigger({type: 'change'});
    }
};

proto._areaClick = function(e) {
    var view = e.targetView();
    if (view && view.parent() == this && view.isClickOnRemove(e)) {
        this.removeChild(view);
        this.trigger({type: 'change'});
        this._updateInput();
    }
};

proto._keydown = function(e) {
    var code = e.which;
    if (this.freeform() && (code == 188 /*,*/ || code == 13 /*return*/)) {
        if (this.selectedResult()) {
            this._typeahead.select();
        } else {
            if (this.freeform()) {
              this._commitFreeform();
            }
        }
        e.stopPropagation();
        e.preventDefault();
    }

    if (this.inline() && code == 8 /* backspace */ &&
        !this._typeahead.value()) {
        if (this.lastChild()) {
            this.removeChild(this.lastChild());
        }
        this.trigger({type: 'change'});
    }

    this._updateInput();
};

proto._paste = function(e) {
    if (this.freeform()) {
      fun.deferOnce(this._commitFreeform, this);
    }
    this._updateInput();
};


proto._commitFreeform = function() {
  if (this._checkFreeform()) {
    var val = this._typeahead.value().trim();
    var regexp = this.freeform().split;
    if (!regexp) { regexp = /\s*[,;]\s*/; }
    var tokens = val.split(regexp);
    tokens.forEach(function(token) {
      if (!token) { return; }
      build({ view: Token, info: {id: token, text: token} }).appendTo(this);
    }, this);
    this._typeahead.reset();
    this.trigger({ type: 'change' });
    return true;
  }
};

proto._checkFreeform = function() {
  var val = this._typeahead.value().trim();
  return val && (!this.freeform().test || this.freeform().test(val));
};

proto._hasMaxTokens = function() {
    return this.maxTokens() && this.maxTokens() <= this.childViews().length;
};

proto.appendChild = function(child) {
    if (this._hasMaxTokens()) { return this; }
    if (this.data().exclusions().indexOf(child.value()) !== -1) {
        return this;
    }
    Container.prototype.appendChild.call(this, child);
    fun.deferOnce(fun.bindOnce(this._updateTokenarea, this));
    return this;
};

proto._appendChildToDom = function(child) {
    this._tokenArea.appendChild(child.dom());
};

proto.removeChild = function(child) {
    Container.prototype.removeChild.call(this, child);
    fun.deferOnce(fun.bindOnce(this._updateTokenarea, this));
    return this;
};

proto.childViews = function(v) {
    if (v !== undefined) {
        Container.prototype.childViews.call(this, []);
        // force exclusions clean
        this.data().exclusions([]);
    }
    return Container.prototype.childViews.call(this, v);
};

proto._updatePlaceholder = function() {
    this._typeahead.placeholder(
        !this.inline() || this.childViews().length === 0 ?
            this._placeholder : '');
};

proto._updateInput = function(redraw) {
    var ta = this._typeahead,
        l = this.childViews().length;
    fun.defer(function() {
        ta.size(ta.value().length || (l === 0 ? 10 : 1));
    }, 20);
};

proto._updateTokenarea = function() {
    this._typeahead
        .visible(!this._hasMaxTokens())
        .disabled(this._hasMaxTokens());
    dom.toggleClass(
        this._tokenArea,
        'hidden_elem',
        this.childViews().length === 0);
    this.toggleClass(
        'uiTokenizerEmpty',
        this.childViews().length === 0);
    this.data()
        .exclusions(
            utils.unique(utils.pluck(this.childViews(), 'value')));
    this._updatePlaceholder();
    this._updateInput();
};


exports.Tokenizer = Tokenizer;
