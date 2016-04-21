<template>
    <div class="list">
        {{a}}'dfsadf'
        <aaa :msg="a"></aaa>
    </div>
</template>

<script>
    var a   = require("a");
    var Vue = require("vue");

    module.exports = Vue.component("xxx", {
        data : function() {
            return {
                a : 23456
            }
        },
        template : '__template__',
        props : ["msg"],
        components: {
            aaa : a
        }
    });
</script>

<style href="./css/test.css"></style>