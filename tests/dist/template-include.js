define(function(require, exports, module) {
    module.exports = {
        template : '<div class="component" @click="click"><p>&#39;NAME&#39;: {{name}}</p><test-component :msg="message"></test-component></div>'
    };
});