var fs        = require('fs');
var path      = require('path');
var gulp      = require('gulp');
var rename    = require('gulp-rename');
var VueModule = require('../index.js');

gulp.task('vue', function() {
    return gulp.src('./vue/**/*.vue')
                .pipe(VueModule({
                    debug         : true,
                    //define        : false,  // Default true,  Using define wrapper module, false for Node.js (CommonJS style)
                    amd           : true,   // Default false, AMD style, define module name and deps
                    defineName    : true,   // define module name
                    //templateReplaceTag : '__template__', // vue component template replace tag
                    //loadCSSMethod : 'require.css' // define the load css method for require
                }))
                .pipe(rename({extname : ".js"}))
                .pipe(gulp.dest("./dist"));
});

gulp.task('default', ['vue']);