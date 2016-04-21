//@moduleName app
//@moduleDeps a,b, vue/all
define("app", ["vue/all", "component/list"], function(require, exports, module) {
    require.loadCSS({content : "/*fdsafsdf*/.app {background:red;color:#fff;padding:10px;}.app span {font-size: 18px;}"});

    // indent 4
    var Vue           = require("vue/all");
    var listComponent = require('component/list');
    module.exports = Vue.extend({
        data : function() {
            return {
                a : 23456
            }
        },
        methods : {
            click : function() {
                console.log("click()");
            }
        },
        components: {
            'list-component' : listComponent
        },
        template : '<!-- Comment xxxx --><div class="app" @click="click" style="color:red;"><p>{{a}}&#39;ABC&#39;</p><list-component :msg="message"></list-component></div>'
    });
});