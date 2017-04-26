'use strict'

var del = require('del')
var gulp = require('gulp')
var gulpJasmine = require('gulp-jasmine')
var gulpRename = require('gulp-rename')
var gulpStandard = require('gulp-standard')
var gulpTypescript = require('gulp-typescript')
var runSequence = require('run-sequence')

gulp.task('delete', function () {
  del.sync('./dist')
})

gulp.task('standard', function () {
  return gulp
    .src(['./**/*.js', '!node_modules/**/*.js'])
    .pipe(gulpStandard())
    .pipe(gulpStandard.reporter('default'))
})

gulp.task('jasmine', function () {
  return gulp
    .src('./spec/index.spec.js')
    .pipe(gulpJasmine({
      verbose: true,
      includeStackTrace: true
    }))
})

gulp.task('ts', function () {
  return gulp
    .src('./src/index.ts')
    .pipe(gulpTypescript({
      module: 'system',
      noImplicitAny: true,
      noUnusedLocals: true,
      noFallthroughCasesInSwitch: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noImplicitUseStrict: true,
      noUnusedParameters: true,
      strictNullChecks: true,
      outFile: 'base65536.js'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', function (cb) {
  runSequence('delete', 'standard', 'ts', 'jasmine', cb)
})

gulp.task('watch', ['build'], function () {
  gulp.watch('./src/**/*.*', ['build'])
})
