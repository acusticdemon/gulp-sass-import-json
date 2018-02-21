'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sassImportJson = require('../');

gulp.task('default', function () {
  return gulp.src('./*.sass')
    .pipe(sassImportJson({isScss: true}))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dest'));
});