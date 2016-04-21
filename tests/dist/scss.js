define(function(require, exports, module) {
    require.loadCSS({content : ".card{backround:red}.card>.head{color:red;background:yellow}"});

    module.exports = {
        template : '<div class="card"><header class="head">Header</header></div>'
    };
});