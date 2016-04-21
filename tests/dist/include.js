define(function(require, exports, module) {
    var a   = require("a");
    var Vue = require("vue");
    module.exports = Vue.component("xxx", {,
        template : '#include "./tpl/test.html"',
        data : function() {
            return {
                a : 23456
            }
        },
        props : ["msg"],
        components: {
            aaa : a
        }
    });
});