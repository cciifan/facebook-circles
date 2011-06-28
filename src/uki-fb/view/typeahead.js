/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./typeahead/uiTypeahead.css");

var fun   = require("../../uki-core/function"),
    utils = require("../../uki-core/utils"),
    dom   = require("../../uki-core/dom"),
    view  = require("../../uki-core/view"),
    build = require("../../uki-core/builder").build,

    Base      = require("../../uki-core/view/base").Base,
    Container = require("../../uki-core/view/container").Container,

    Selectable    = require("./selectable").Selectable;
    TextInput     = require("./textInput").TextInput;
    TypeaheadView = require("./typeahead/view").View;
    Focusable     = require("./focusable").Focusable;


var Typeahead = fun.newClass(Container, Focusable, {}),
    proto = Typeahead.prototype;

proto.typeName = 'fb.Typeahead';

fun.addProps(proto, ['selectedText', 'resetOnSelect',
    'keepFocused', 'setValueOnSelect', 'queryThrottle']);

fun.delegateProp(proto, ['renderer', 'autoSelect', 'selecting',
    'selectedIndex', 'selectedResult'], '_view');

fun.delegateProp(proto, ['placeholder', 'id', 'focus',
    'blur', 'hasFocus', 'size'], '_input');

proto.selectedResult = function(value) {
    if (value === undefined) {
        if (!this._selectedResult) {
            return this._view.selectedResult();
        }
        return this._selectedResult;
    }
    this._selectedResult = value;
    return this;
};

fun.addProp(proto, 'data', function(v) {
    if (this._data) {
        this._data.removeListener('respond', this._respondListener);
        this._data.removeListener('activity', this._activityListener);
    }
    this._data = v;
    this._data.addListener(
        'respond',
        this._respondListener = this._respondListener ||
            fun.bind(this._respond, this)
    );
    this._data.addListener(
        'activity',
        this._activityListener = this._activityListener ||
            fun.bind(this._activity, this)
    );
});

fun.addProp(proto, 'disabled', function(state) {
    this._disabled = state;
    this._input.disabled(state);
    this.toggleClass('uiTypeaheadDisabled', state);
});

proto.reset = function() {
    this._unselect();
    this.value('');
    this._view.reset();
    this.selectedResult('');
};

proto.value = function(v) {
    if (v === undefined) {
        return this._input.value();
    }
    this._input.value(v);
    if (this.setValueOnSelect()) {
        dom.addClass(this._wrap, 'selected');
        this.selectedText(v);
    }
    return this;
};

proto.select = function() {
    var result = this._view.selectedResult();
    this.resetOnSelect() ? this.reset() : this._view.reset();
    this.keepFocused() ? this._input.focus() : this._input.blur();
    this.selectedResult(result);

    if (result && this.setValueOnSelect()) {
        this.value(result.text);
        this.selectedText(this.value());
        dom.addClass(this._wrap, 'selected');
    }
};


/* Protected */
proto._keepFocused = true;

proto._resetOnSelect = false;

proto._setValueOnSelect = false;

proto._queryThrottle = 250;

proto._lastValue = null;

proto._time = 0;

proto._createDom = function(initArgs) {
    this._dom = dom.createElement('div', {
        className: 'uiTypeahead',
        html: '<div class="wrap"></div>'
    });

    this._wrap = this._dom.firstChild;

    this._createInput();
    this._createView();

    this.selectedText('');

    this._initEvents();
};

proto._createView = function() {
    this._view = build({ view: TypeaheadView }).appendTo(this)[0];
};

proto._createInput = function() {
    this._input = build({ view: TextInput }).appendTo(this)[0];
    this._wrap.appendChild(this._input.dom());
};

proto.domForEvent = function(name) {
    if (' blur focus copy paste keydown keyup keypress'.indexOf(name) > -1) {
        return this._input.dom();
    }
    return this.dom();
};

proto._initEvents = function() {
    this._view.addListener('highligh', fun.bind(function(e) {
        this.trigger(e);
        this._input.focus();
    }, this));
    this._view.addListener('select', fun.bind(function(e) {
        this.select();
        this.trigger(e);
    }, this));

    this.on('blur', this._blur);
    this.on('focus', this._focus);
    this.on(Selectable.keyPressEvent(), this._keypress);
    this.on('keydown', this._keydown);
};

proto._focus = function() {
    this._checkValue();

    this._view.visible(true);
    dom.addClass(this._wrap, 'uiTypeaheadFocused');
};

proto._blur = function(e) {
    if (this.selecting()) {
        fun.defer(fun.bind(function() { this.selecting(false); }, this));
    } else {
        this._view.visible(false);
        dom.removeClass(this._wrap, 'uiTypeaheadFocused');
    }
};

proto._keypress = function() {
    if (!this.value()) {
        this._view.reset();
    }
    this._checkValue();
};

proto._keydown = function(e) {
    if (!this._view.visible() || this._view.isEmpty()) {
        fun.defer(fun.bind(this._checkValue, this));
        return;
    }

    switch (e.which) {
        case 9: // tab
            this._view.select();
            return;
        case 13: // return
            this._view.select();
            break;
        case 38: // up
            this._view.selectedIndex(this._view.selectedIndex() - 1);
            break;
        case 40: // down
            this._view.selectedIndex(this._view.selectedIndex() + 1);
            break;
        case 27: // esc
            this._view.reset();
            break;
        default:
            fun.defer(fun.bind(this._checkValue, this));
            return;
    }

    e.preventDefault();
};

proto._respond = function(e) {
    if (e.value == this.value()) {
        this._view.render(e.results);
    }
};

proto._activity = function(e) {
    this._fetching = this.data().activeQueries();
    if (!this._fetching) {
        this._nextQuery && this._performQuery();
    }
};

proto._unselect = function() {
    if (this.setValueOnSelect()) {
        this.selectedText('');
        dom.removeClass(this._wrap, 'selected');
    }
};

proto._checkValue = function() {
    var value = this.value();
    if (value === this._lastValue) {
        return;
    }
    this._lastValue = value;

    if (this.selectedText() && this.selectedText() != value) {
        this._unselect();
    }

    var time = (+new Date()),
        diff = time - this._time;

    this._time = time;
    this._nextQuery = value;
    this._performQuery(diff);
};

proto._performQuery = function(time_waited) {
    if (!this._data) { return; }
    // don't perform a query if we're in a selected state
    if (this.selectedText()) { return; }

    // don't hammer the DataSource, only ask for both async and local results
    // if we're idle, or the user has waited some amount of time since his/her
    // last keystroke
    time_waited = time_waited || 0;

    var value = this._nextQuery;
    if (!value) {
        this._nextQuery = null;
        this._respond({ value: value, results: [] });
    } else {
        if (this._fetching && time_waited < this.queryThrottle()) {
            // retrieve results that are already in cache
            this._data.query(this._nextQuery, true);
        } else {
            this._data.query(this._nextQuery);
            this._nextQuery = null;
        }
    }
};


exports.Typeahead = Typeahead;
