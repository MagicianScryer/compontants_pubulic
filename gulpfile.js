'use strict';

var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var gulpUglifycss = require('gulp-uglifycss');
var gulpRename = require('gulp-rename');
var gulpFlatten = require('gulp-flatten');
var gulpSass = require('gulp-sass')(require('sass'));

gulp.task('build-scss', function() {
  return gulp.src([
    process.env.STYLE_INPUT_DIR + '**/*.scss'
  ])
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulpConcat('ruibaireact.css'))
    .pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources'))
    .pipe(gulpUglifycss({ "uglyComments": true }))
    .pipe(gulpRename('ruibaireact.min.css'))
    .pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources'));
});

gulp.task('copy-d.ts', function() {
  return gulp.src(process.env.INPUT_DIR + '**/*.d.ts')
    .pipe(gulpRename(function(path) {
      path.basename = path.basename.toLowerCase();
    }))
    .pipe(gulp.dest(process.env.OUTPUT_DIR));
});

gulp.task('copy-image', function() {
  return gulp.src(process.env.INPUT_DIR + '**/images/*.png')
    .pipe(gulpFlatten())
    .pipe(gulp.dest(process.env.OUTPUT_DIR + 'resources/images'));
});

gulp.task('copy-package.json', function() {
  return gulp.src(process.env.INPUT_DIR + '**/package.json')
    .pipe(gulp.dest(process.env.OUTPUT_DIR));
});

gulp.task('build-meta', function() {
  return gulp.src(['README.md', 'CHANGELOG.md', 'LICENSE.md', 'package-build.json'])
    .pipe(gulpRename(function(path) {
      if (path.basename === 'package-build') {
        path.basename = path.basename.replace('package-build', 'package');
      }
    }))
    .pipe(gulp.dest(process.env.OUTPUT_DIR));
});

//Building project with run sequence
gulp.task('copy-files', gulp.series('copy-image', 'copy-d.ts', 'copy-package.json'));
gulp.task('build-resources', gulp.series('build-scss', 'build-meta'));
gulp.task('build-ruibaireact', gulp.series('build-resources', 'copy-files'));
