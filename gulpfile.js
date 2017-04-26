'use strict'

var del = require('del')
var gulp = require('gulp')
var gulpJasmine = require('gulp-jasmine')
var gulpStandard = require('gulp-standard')
var gulpTslint = require('gulp-tslint')
var gulpTypescript = require('gulp-typescript')
var runSequence = require('run-sequence')
var tslint = require('tslint')

gulp.task('delete', function () {
  del.sync('./dist')
})

gulp.task('standard', function () {
  return gulp
    .src(['./**/*.js', '!node_modules/**/*.js'])
    .pipe(gulpStandard())
    .pipe(gulpStandard.reporter('default', {
      breakOnError: true,
      breakOnWarning: true
    }))
})

gulp.task('jasmine', function () {
  return gulp
    .src('./spec/index.spec.js')
    .pipe(gulpJasmine({
      verbose: true,
      includeStackTrace: true
    }))
})

gulp.task('tslint', function () {
  return gulp
    .src('./src/index.ts')
    .pipe(gulpTslint({
      formatter: 'verbose',
      program: tslint.Linter.createProgram('tsconfig.json')
    }))
    .pipe(gulpTslint.report())
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
