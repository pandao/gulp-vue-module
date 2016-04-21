<template>
    #include "./tpl/test.html"
</template>

<script>
    var a   = require("a");
    var Vue = require("vue");

    module.exports = Vue.component("xxx", {,
        template : '__template__',
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
</script>