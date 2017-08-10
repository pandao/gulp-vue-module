var fs          = require('fs');
var path        = require("path");
var parse5      = require('parse5');
var gutil       = require('gulp-util');
var through     = require("through2");
var sass        = require("node-sass");
var PLUGIN_NAME = 'gulp-vue-module';
var LOG_PREFIX  = '[' + PLUGIN_NAME + '] ';

function getAttribute (node, name) {
    if (node.attrs) {
        var i = node.attrs.length, attr;

        while (i--) {
            attr = node.attrs[i];
            if (attr.name === name) {
                return attr.value;
            }
        }
    }
}

module.exports = function(options) {
    var defaults = {
        debug              : false,               // Debug mode
        amd                : false,               // AMD style, Define module name and deps
        define             : true,                // Using define() wrapper the module, false for Node.js (CommonJS style)
        defineName         : false,               // Define the module name
        indent             : '    ',              // Indent whitespace
        headerComment      : true,                // Using <header-comment> Insert the header comments
        templateReplaceTag : '__template__', // vue component template replace tag
        loadCSSMethod      : 'require.loadCSS',    // define the load css method for require
        externalRequire      : false            // don't pass require as a parameter
    };

    var settings = Object.assign({}, defaults, options),
        debug    = settings.debug,
        indent   = settings.indent,
        templateReplaceTag = settings.templateReplaceTag;
    
     return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Cannot use streamed files'));
            return callback();
        }

        if (file.isBuffer()) {
            if (debug) {
                console.log(LOG_PREFIX, "target =>", file.path);
            }
            
            var content  = file.contents.toString(encoding),
                fragment = parse5.parseFragment(content, {
                    locationInfo: true
                });
            
            var tags     = {}, 
                contents = {
                    script   : [],
                    style    : [],
                    template : []
                },
                moduleName      = '',
                moduleDeps      = '',
                headerComment   = '',
                includeFileName,
                scriptEmpty     = false,
                componentTags   = ['template', 'style', 'script'];
            
            fragment.childNodes.forEach(function (node) {
                var type = node.tagName;
                var lang = getAttribute(node, 'lang');
                var href = getAttribute(node, 'href');
                var src  = getAttribute(node, 'src');
                
                if (type === "header-comment") {
                    headerComment = parse5.serialize(node);
                }
                
                if (componentTags.indexOf(type) >= 0) {
                    tags[type] = true;
                    
                    if (type === "style") {
                        var style = parse5.serialize(node);
                        
                        if (!lang || lang === "css") {
                            style.split("\n").forEach(function(line){
                                if (line) contents.style.push(line.trim());
                            });
                            
                            style = contents.style.join("");
                            
                            if (style != "") {
                                contents.style = '{content : "' + style + '"}';
                            }

                            if (href && href !== "") {
                                contents.style = '{url : "' + href + '"}';
                            }
                        }
                        else if (lang && (lang === "sass" || lang === "scss")) {
                            contents.style = [];

                            style.split("\n").forEach(function(line){
                                if (line) contents.style.push(line);
                            });
                            
                            var result,
                                sassRenderOptions = {
                                    outputStyle    : "compressed",
                                    indentedSyntax : (lang === "sass") ? true : false,
                                };

                            if (href) {
                                sassRenderOptions.file = href;
                            } else {
                                sassRenderOptions.data = contents.style.join("\n");
                            }

                            result = sass.renderSync(sassRenderOptions);
                            result = result.css.toString().replace("\n", "");

                            if (result !== "") {
                                contents.style = '{content : "' + result + '"}';
                            }
                        }
                    }
                    
                    if (type === "template") {
                        includeFileName = getAttribute(node, 'include');
                        
                        if (includeFileName) {
                            var tpl = fs.readFileSync(includeFileName, 'utf-8');
                            
                            if (!tpl) {
                                console.error(LOG_PREFIX, "read template file error =>", includeFileName);
                            }
                        } else {
                            var treeAdapter = parse5.treeAdapters.default,
                                docFragment = treeAdapter.createDocumentFragment();

                            treeAdapter.appendChild(docFragment, node);

                            var tpl = parse5.serialize(docFragment);
                            tpl = tpl.replace('<template>', '').replace('</template>', '');
                        }
                            
                        tpl.split("\n").forEach(function(line){
                            if (line) contents.template.push(line.trim());
                        });

                        contents.template = contents.template.join("").toString().replace(/'/g, "&#39;");
                    }
                    
                    if (type === "script") {
                        moduleName  = getAttribute(node, 'module-name');
                        moduleDeps  = getAttribute(node, 'module-deps');

                        var script = parse5.serialize(node);
                        
                        if (script.split("\n").length <= 2) {
                            scriptEmpty = true;
                            script      = indent + "module.exports = {\n" + indent + indent + "template : '" + templateReplaceTag + "'\n" + indent + "};\n";
                        }
                        
                        script.split("\n").forEach(function(line){
                            if (line.trim() != "") {
                                line = line.replace(new RegExp(templateReplaceTag, "gi"), contents.template);
                                contents.script.push(line);
                            }
                        });
                    }
                }
            });
            
            if (settings.headerComment) {
                headerComment = headerComment.replace("\n", '');
            } else {
                headerComment = '';
            }
            
            var script        = contents.script.join("\n"), 
                deps          = '', 
                loadCSS       = '', 
                defineName    = '',
                moduleContent = '';
            
            if (typeof contents.style === "string" && contents.style != "") {
                loadCSS = indent + settings.loadCSSMethod + '('+contents.style+');\n\n';
            }
            
            if (settings.defineName && moduleName) {
                defineName = '"' + moduleName + '", ';
            }
            
            if (settings.amd && moduleDeps) {
                deps = [];

                moduleDeps.split(/\s*,\s*/).forEach(function(dep){
                    deps.push('"' + dep + '"');
                });
                
                deps = "[" + deps.join(", ") + "], ";
            }
            
            if (settings.define) {
                if(settings.externalRequire){
                    moduleContent = 'define(' + defineName + deps + 'function('+ moduleDeps +') {\n' + loadCSS + script+'\n});';
                }
                else {
                    moduleContent = 'define(' + defineName + deps + 'function(require, exports, module) {\n' + loadCSS + script+'\n});';
                }
            } 
            else {
                moduleContent = script;
            }

            script = headerComment + moduleContent;
            
            content = script;
            
            if (!tags.script || !tags.template) {
                this.emit('error', new gutil.PluginError(PLUGIN_NAME, file.path + ' not vue component file, not have script and template tag'));
                return callback();
            }

            file.contents = new Buffer(content);
        }
        
        callback(null, file);
    });
}