requireCss('./app.css');
requireCss('./friendList.css');

var utils = require('./uki-core/utils');
var Builder = require('./uki-core/builder').Builder;
var find = require('./uki-core/selector').find;
var Mustache = require('uki-core/mustache').Mustache;

var builder = new Builder([
  utils.extend({},
    require('./uki-core/view/container'),
    require('./uki-fb/view/dataGrid')
  )
]);

var template = requireText('person.html');

function formatter(object) {
  return Mustache.to_html(template, object);
}

builder.build({
  view: 'Container',
  pos: 't:10px l:10px r:10px b:180px',
  addClass: 'friendList',
  childViews: [{
    view: 'DataGrid',
    pos: 't:0px r:0px l:0px',
    formatter: formatter
  }]
}).attach();

require('./uki-core/dom').createStylesheet(__requiredCss);

window.startApp = function() {
  FB.api('/me/friends?fields=id,name,picture', function(result) {
    find('DataGrid').data(result.data);
  });
};