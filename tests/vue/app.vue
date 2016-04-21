<header-comment>
//@moduleName app
//@moduleDeps a,b, vue/all
</header-comment>

<template>
    <!-- Comment xxxx -->
    <div class="app" @click="click" style='color:red;'>
        <p>{{a}}'ABC'</p>
        <list-component :msg="message"></list-component>
    </div>
</template>

<script module-name="app" module-deps="vue/all,component/list">
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
        template : '__template__'
    });

    

</script>

<style lang="css">
    /*fdsafsdf*/
    .app {background:red;color:#fff;padding:10px;}
    .app span {font-size: 18px;}
</style>