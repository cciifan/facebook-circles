/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/


var utils = require("../../uki-core/utils"),
    fun   = require("../../uki-core/function"),
    dom   = require("../../uki-core/dom"),
    build = require("../../uki-core/builder").build,

    Container = require("../../uki-core/view/container").Container,
    Mustache  = require("../../uki-core/mustache").Mustache;


/**
* @class HTMLLayout
* Power to the users!
*
* Quick and dirty solution for views you don't know how to implement.
* Write your messy html in a template and then fill it with views and text.
* HTMLLayout will automatically insert views in the positions specified
* in template.
*
* @example
*   build({
*       view: 'HTMLLayout',
*       template: '<dl><dt>{{label}}</dt><dd>{{{input}}}</dd></dl>',
*       content: {
*           label: 'My Label',
*           input: { view: 'TextInput', placeholder: 'woo hoo! html!' }
*       }
*   })
*
* @author voloko
* @version draft
*/
var HTMLLayout = fun.newClass(Container, {}),
    proto = HTMLLayout.prototype;


var PLACEHOLDER_CLASSNAME = '__layout__placeholder';

proto.typeName = 'fb.HTMLLayout';

fun.addProp(proto, 'template');
proto._template = '';

fun.addProp(proto, 'content', function(c) {
    this._content = c;

    this._buildViews(this._content);
    this._render();
});
proto._content = {};

proto.childViews = function() {
    return this._childViews;
};
proto._childViews = [];

proto._createDom = function() {
    this._dom = dom.createElement('div', { className: 'HTMLLayout' });
};

proto._buildViews = function(views) {
    // build view declaration
    utils.forEach(views, function(v, key) {
        if (typeof v === 'object') {
            if (v.typeName) { //view
            } else if (v.view) { // declaration
                views[key] = build(v)[0];
            } else {
                this._buildViews(v);
            }
        }
    }, this);
};

proto._contentToPlaceholders = function(views, prefix) {
    var result = utils.isArray(views) ? [] : {};
    prefix = prefix ? prefix + '.' : '';
    utils.forEach(views, function(v, key) {
        if (typeof v === 'object') {
            if (v.typeName) {
                result[key] = '<div class="' + PLACEHOLDER_CLASSNAME +
                    '" data-path="' + dom.escapeHTML(prefix + key) +
                    '"></div>';
                result[key + '__view'] = v;
            } else {
                result[key] = this._contentToPlaceholders(v, prefix + key);
            }
        } else {
            result[key] = v;
        }
    }, this);
    return result;
};

proto._render = function() {
    this._childViews = [];

    var data = this._contentToPlaceholders(this.content());
    this.dom().innerHTML = Mustache.to_html(this.template(), data);
    var count = 0;
    utils.toArray(this.dom().getElementsByClassName(PLACEHOLDER_CLASSNAME))
        .forEach(function(el) {

        var key   = el.getAttribute('data-path'),
            child = utils.path2obj(key, this.content());

        child._viewIndex = count++;
        child.parent(this);
        el.parentNode.replaceChild(child.dom(), el);
        this._childViews.push(child);
    }, this);
};

proto.destruct = function() {
    this.clear(true);
    Container.prototype.destruct.call(this);
};

proto.clear = function(skipDestruct) {
    this.childViews().forEach(function(child) {
        dom.removeElement(child.dom());
        if (!skipDestruct) {
            child.destruct();
        }
    }, this);
};


exports.HTMLLayout = HTMLLayout;
