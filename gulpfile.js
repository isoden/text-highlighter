var gulp    = require('gulp');
var header  = require('gulp-header');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');

gulp.task('default', () => {
  gulp.watch('./src/text-highlighter.ts', ['webpack']);
});

gulp.task('webpack', () => {
  gulp.src('./src/text-highlighter.ts')
    .pipe(plumber())
    .pipe(webpack({
      resolve : {
        extensions : ['', '.ts']
      },
      output : {
        filename      : 'text-highlighter.js',
        library       : 'TextHighlighter',
        libraryTarget : 'umd'
      },
      module : {
        loaders : [
          {
            test    : /\.ts$/,
            loader  : 'ts',
            exclude : /node_modules/
          }
        ]
      }
    }))
    .pipe(gulp.dest('lib/'));
});

gulp.task('build', () => {
  gulp.src('./lib/text-highlighter.js')
    .pipe(header(`
/*!
 * text-highlighter.js v1.0.1
 * https://github.com/isoden/text-highlighter.git
 *
 * Copyright (c) 2015 isoden <isoda@maboroshi.biz> (http://isoden.me)
 * Licensed under the MIT license.
 */
    `))
    .pipe(gulp.dest('./lib'))
    .pipe(rename({suffix : '.min'}))
    .pipe(uglify({preserveComments : 'some'}))
    .pipe(gulp.dest('./lib'));
});
