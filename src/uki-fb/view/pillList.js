/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/


var fun   = require("../../uki-core/function"),
    find  = require("../../uki-core/selector").find,

    List = require("./list").List;


var PillList = fun.newClass(List, {
    typeName: 'fb.PillList',

    _createDom: function() {
        List.prototype._createDom.call(this);
        this.horizontal(true)
            .border('none')
            .spacing('small');
        this.addListener('click', this._click);
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


exports.PillList = PillList;
