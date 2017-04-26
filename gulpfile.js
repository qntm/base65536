'use strict'

var del = require('del')
var gulp = require('gulp')
var gulpRename = require('gulp-rename')
var runSequence = require('run-sequence')

gulp.task('delete', function () {
  del.sync('./dist')
})

gulp.task('js', function () {
  return gulp
    .src('./src/index.js')
    .pipe(gulpRename('base65536.js'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', function (cb) {
  runSequence('delete', 'js', cb)
})

gulp.task('watch', ['build'], function () {
  gulp.watch('./src/**/*.*', ['build'])
})
