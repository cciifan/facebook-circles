/**
* Copyright 2004-present Facebook. All Rights Reserved.
*
*/

if (__DEV__) {
    var utils = require("../uki-core/utils");

    var all = {};

    utils.forEach([
        require("../uki-core/view/base"),
        require("../uki-core/view/container"),

        require("./view/selectable"),
        require("./view/focusable"),

        require("./view/button"),
        require("./view/checkbox"),
        require("./view/dataGrid"),
        require("./view/dataList"),
        { dataList: utils.extend(
            {},
            require("./view/dataList/editor"),
            require("./view/dataList/selectEditor"))
        },
        require("./view/dataTable"),
        require("./view/dataTree"),
        require("./view/dialog"),
        require("./view/fileInput"),
        require("./view/HTMLLayout"),
        require("./view/image"),
        require("./view/list"),
        require("./view/menu"),
        require("./view/pillButton"),
        require("./view/pillList"),
        require("./view/progressBar"),
        require("./view/radio"),
        require("./view/searchInput"),
        require("./view/select"),
        require("./view/selector"),
        require("./view/sideNav"),
        require("./view/splitPane"),
        require("./view/text"),
        require("./view/textArea"),
        require("./view/textInput"),
        require("./view/tokenizer"),
        { tokenizer: require("./view/tokenizer/token") },
        require("./view/typeahead")
    ], function(mod) {
        utils.extend(all, mod);
    });

    module.exports = all;
}
