<template>
    <div class="app">{{name}}</div>
</template>

<script>
    var Vue = require("vue");

    exports.a = Vue.extend({
        data : function() {
            return {
                name : "Vue.js"
            }
        },
        template : '__template__'
    });

    exports.b = Vue.extend({
        template : '__template__'
    });

    exports.b = Vue.extend({
        template : '__template__'
    });

    exports.d = Vue.extend({
        template : '__template__'
    });
</script>