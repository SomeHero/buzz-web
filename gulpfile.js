'use strict';

require('dotenv').load();

//   Libraries
var argv = require('yargs').argv,
    fs = require('fs'),

    gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    wrap = require('gulp-wrap'),
    gulpif = require('gulp-if'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    sequence = require('gulp-sequence'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps');

var env = argv.env || process.env.NODE_ENV || 'development';
process.env.NODE_ENV = env;

//
//   Paths and configurations
//
var paths = {
    js : [
        'src/app.js',

        // common
        'src/common/common-module.js',
        'src/common/*.js',

        // base
        'src/base/base-module.js',
        'src/base/**/*.js',

        // auth
        'src/auth/auth-module.js',
        'src/auth/**/*.js',

        // news
        'src/news/news-module.js',
        'src/news/**/*.js',

        // menu
        'src/menu/menu-module.js',
        'src/menu/**/*.js'

    ],
    libs : [
        'vendor/jquery/dist/jquery.js',
        'vendor/angular/angular.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
        'vendor/angular-animate/angular-animate.js',
        'vendor/angular-cookies/angular-cookies.js'
    ]
};

//
//   Layout
//
gulp.task('jade', function() {
    return gulp
        .src('src/**/*.jade')
        .pipe(jade({
            doctype : 'html',
            pretty : true,
            locals : {
                config : {
                    twitter_id  : process.env.TWITTER_ID,
                    twitter_uri : process.env.TWITTER_URI
                }
            }
        }))
        .pipe(gulp.dest('dist'))
});

//
//   CSS related tasks
//
gulp.task('less-app', function() {
    return gulp
        .src(['assets/styles/styles.less'])
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('less-bootstrap', function() {
    return gulp
        .src('vendor/bootstrap/less/bootstrap.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('less', ['less-app', 'less-bootstrap']);

//
//   JS related tasks
//
gulp.task('js-app', function() {
    return gulp
        .src(paths.js)
        .pipe(wrap(" 'use strict';\n\n(function(){\n<%= contents %>\n})();"))
        //.pipe(babel({ modules : 'common' }))
        .pipe(concat('all.js'))
        .pipe(gulpif(argv.minify, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('js-libs', function() {
    return gulp
        .src(paths.libs)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.minify, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('js', ['js-app', 'js-libs']);

//
//   Common tasks
//
gulp.task('copy-images', function () {
    return gulp
        .src('assets/images/**/*.*')
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('copy-fonts', function() {
    return gulp
        .src([
            'vendor/bootstrap/fonts/*.*',
            'vendor/font-awesome/fonts/*.*',
            'src/fonts/*.*'
        ])
        .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('clean', function() {
    return gulp.src('./dist', { read: false })
        .pipe(rimraf());
});

gulp.task('install', [
    'copy-images',
    'copy-fonts',
    'js',
    'less',
    'jade'
]);

gulp.task('watch', function () {
    gulp.watch(['src/**/*.jade'], ['jade']);
    gulp.watch(['src/**/*.js'], ['js-app']);
    gulp.watch(['assets/styles/**/*.less'], ['less-app']);
    gulp.watch(['assets/images/**/*.*'], ['copy-images']);
});