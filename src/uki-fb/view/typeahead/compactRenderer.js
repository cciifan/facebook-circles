/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/
requireCss("./compactRenderer/compactRenderer.css");

var dom = require("../../../uki-core/dom");

/**
 * TypeaheadRenderers provide a function that will take in a blob of data, and
 * return a rendered piece of markup.  Renderers can either return a string of
 * html, or an array of html pieces, though the latter is preferred. Results
 * will be concatenated and joined to form the final output.
 *
 * These functions MUST escape markup to prevent XSS.
 */
/**
 * CompactTypeaheadRenderer
 */
function compactRenderer(data, index) {
    var text = data.markup || dom.escapeHTML(data.text),
        subtext = dom.escapeHTML(data.subtext),
        category = dom.escapeHTML(data.category),
        photo = data.photo,
        className = '',
        html_pic = [];

    if (photo) {
        if (photo instanceof Array) {
            html_pic = [
              '<span class="splitpics clearfix">',
                '<span class="splitpic leftpic">',
                  '<img src="', photo[0], '" alt="" />',
                '</span>',
                '<span class="splitpic">',
                  '<img src="', photo[1], '" alt="" />',
                '</span>',
              '</span>'
            ];
        } else {
            html_pic =  ['<img src="', photo, '" alt="" />'];
        }
    }

    if (data.type) {
        className = ' class="' + data.type + '"';
    }

    return [
      '<li', className, '>',
        html_pic.join(''),
        (text ? '<span class="text">' + text + '</span>' : ''),
        '<div class="details"><span class="detailsContents">',
          (category ? category : ''),
          (subtext && category ? ' &middot ': ''),
          (subtext ? subtext : ''),
        '</span></div>',
      '</li>'
    ];
};

compactRenderer.className = 'compact';


exports.compactRenderer = compactRenderer;
