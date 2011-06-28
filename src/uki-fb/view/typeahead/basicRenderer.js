/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./basicRenderer/basicRenderer.css");

var dom = require("../../../uki-core/dom");


/**
 * TypeaheadRenderers provide a function that will take in a blob of data, and
 * return a rendered piece of markup.  Renderers can either return a string of
 * html, or an array of html pieces, though the latter is preferred. Results
 * will be concatenated and joined to form the final output.
 *
 * These functions MUST escape markup to prevent XSS.
 */
function basicRenderer(data, index) {
    var text = data.markup || dom.escapeHTML(data.text),
    subtext = data.subtext,
    icon = data.icon,
    className = '';

    if (data.type) {
        className = ' class="' + data.type + '"';
    }

    return [
        '<li', className, '>',
            (icon ? '<img src="'  + icon + '" alt=""/>' : ''),
            (text ? '<span class="text">' + text + '</span>' : ''),
            (subtext ? '<span class="subtext">' + subtext + '</span>' : ''),
        '</li>'
    ];
};

basicRenderer.className = 'basic';


exports.basicRenderer = basicRenderer;
