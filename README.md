# gulp-vue-module

Gulp plugin for [Vue.js](https://github.com/vuejs/vue) `*.vue` component file complie to AMD / CMD / CommonJS module.

Now, You can use [Require.js](https://github.com/requirejs/requirejs) / [Sea.js](https://github.com/seajs/seajs) ... etc. Front-end Module loader load Vue Component, not use [Webpack](http://webpack.github.io/) and [vue-loader](https://github.com/vuejs/vue-loader).

### Usage

```shell
$ npm install gulp-vue-module --save-dev
```

`Gulpfile.js` :

```javascript
var fs        = require('fs');
var path      = require('path');
var gulp      = require('gulp');
var rename    = require('gulp-rename');
var VueModule = require('gulp-vue-module');

gulp.task('vue', function() {
    return gulp.src('./vue/**/*.vue')
                .pipe(VueModule({
                    debug : true
                }))
                .pipe(rename({extname : ".js"}))
                .pipe(gulp.dest("./dist"));
});

gulp.task('default', ['vue']);
```

`app.vue` :

> tag order : `<style>` > `<template>` > `<script>`, `<tempate>` tag must be at `<script>` tag before.

```html
<style lang="scss">
$color:red;

.card {
    backround: $color;
    
    > .head {
        color: $color;
        background: yellow;
    }
}
</style>

<template>
    <div class="app" @click="click">
        <p>{{a}}</p>
        <list-component :msg="message"></list-component>
    </div>
</template>

<script>
    var Vue           = require("vue");
    var listComponent = require('component/list');

    module.exports = Vue.extend({
        data : function() {
            return {
                id      : 23456,
                message : 'Message'
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
```

> `<template>` tag unsupport set lang attribute, support set `include="/path/to/xxx.xxx"` attribute.
> 
> `<script>` tag unsupport set lang attribute, so you can't use ES6 syntax;
> 
> `<style>` tag support set `lang="css|scss|sass"` attribute, and support set `href="/path/to/xxx.(css|scss|sass)"` attribute link CSS file.
> 
> You can use `<header-comment>` tag insert the header comments

Output :

```javascript
define(function(require, exports, module){
    // require.loadCSS() need you implement this function
    require.loadCSS({content : ".card{backround:red}.card>.head{color:red;background:yellow}"});

    var Vue           = require("vue/all");
    var listComponent = require('component/list');

    module.exports = Vue.extend({
        data : function() {
            return {
                id      : 23456,
                message : 'Message'
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
        template : '<div class="app" @click="click"><p>{{a}}</p><list-component :msg="message"></list-component></div>'
    };
});
```

`require.loadCSS()` implement example :

```javascript
require.loadCSS = function(config) {
    var head = document.getElementsByTagName("head")[0];

    if (config.content) {
        var style  = document.createElement('style');
        style.type = 'text/css';
        
        if (style.styleSheet) { // for IE
            style.styleSheet.cssText = config.content;
        } else {
            style.innerHTML = config.content;
        }

        head.appendChild(style);
        callback();
    }
    else if (config.url) {
        var link  = document.createElement('link');

        link.href = config.url;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    }
};
```

### Options

```javascript
{
    debug              : false,            // Debug mode
    transSingle        : true,             // Trans single quote to '&#39;'
    amd                : false,            // AMD style, Define module name and deps
    define             : true,             // Using define() wrapper the module, false for Node.js (CommonJS style)
    defineName         : false,            // Define the module name
    indent             : '    ',           // Indent whitespace
    headerComment      : true,             // Using <header-comment> Insert the header comments
    templateReplaceTag : '__template__', // vue component template replace tag
    loadCSSMethod      : 'require.loadCSS' // define the load css method for require
}
```

### Changes

[Change logs](https://github.com/pandao/gulp-vue-module/blob/master/CHANGE.md)

### License

The [MIT](https://github.com/pandao/gulp-vue-module/blob/master/LICENSE) license.

Copyright (C) 2016 Pandao