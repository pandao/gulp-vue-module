define(function(require, exports, module) {
    var Vue = require("vue");
    exports.a = Vue.extend({
        data : function() {
            return {
                name : "Vue.js"
            }
        },
        template : '<div class="app">{{name}}</div>'
    });
    exports.b = Vue.extend({
        template : '<div class="app">{{name}}</div>'
    });
    exports.b = Vue.extend({
        template : '<div class="app">{{name}}</div>'
    });
    exports.d = Vue.extend({
        template : '<div class="app">{{name}}</div>'
    });
});