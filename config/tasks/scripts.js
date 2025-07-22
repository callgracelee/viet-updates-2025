const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const constants = require('../constants');
const assetsParser = require('../plugins/gulp-assets-parser');

module.exports = assetsAPI =>
  function scripts(done) {
    return gulp
      .src(constants.SCRIPT_PATHS)
      .pipe(
        rollup(
          {
            plugins: [
              resolve(),
              commonjs({
                exclude: ['node_modules/lodash-es/**'],
              }),
              babel({
                presets: [['@babel/preset-env']],
                exclude: 'node_modules/**',
              }),
              json(),
            ],
          },
          'iife'
        )
      )
      .pipe(
        assetsParser({
          dependencies: constants.EXTENSIONS_MAP.map(ext => ext.name),
          cache: assetsAPI,
        })
      )
      .pipe(gulp.dest(constants.CONTENT_PATH));
    done();
  };
