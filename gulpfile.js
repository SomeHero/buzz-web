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
    sourcemaps = require('gulp-sourcemaps');

//   Paths and configurations
var paths = {
    js : [
        'src/app.js',
        'src/**/*.module.js',
        'src/**/*.js'
    ],
    libs : [
        'vendor/jquery/dist/jquery.js',
        'vendor/angular/angular.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
        'vendor/angular-animate/angular-animate.js',
        'vendor/angular-loading-bar/build/loading-bar.js',
        'vendor/angular-relative-date/angular-relative-date.js',
        'vendor/angular-socialshare/dist/angular-socialshare.min.js',
        'vendor/ngInfiniteScroll/build/ng-infinite-scroll.js',
        'vendor/satellizer/satellizer.js'
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
                    api_url : process.env.API_URL,
                    site_title : process.env.SITE_TITLE,
                    feed_id : process.env.FEED_ID,
                    fb_id : process.env.FACEBOOK_APP_ID,
                    ga_id : process.env.GA_ID
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
        .pipe(wrap("\n(function(){\n<%= contents %>\n})();"))
        .pipe(babel({}))
        .pipe(concat('all.js'))
        .pipe(gulpif(argv.minify, uglify()))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('js-libs', function() {
    return gulp
        .src(paths.libs)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
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
            'assets/fonts/*.*'
        ])
        .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('clean', function() {
    return gulp
        .src('./dist', { read: false })
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
