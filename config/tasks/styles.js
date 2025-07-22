const gulp = require("gulp");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const purgecss = require("gulp-purgecss");
// const autoprefixer = require('autoprefixer');
// const extReplace = require('gulp-ext-replace');
const constants = require("../constants");
const assetsParser = require("../plugins/gulp-assets-parser");

// const LESS_OPTIONS = {};
// const POSTCSS_PLUGINS = [autoprefixer()];

module.exports = (assetsAPI) =>
  function styles(done) {
    return (
      gulp
        .src(constants.STYLESHEET_PATHS)
        // .pipe(less(LESS_OPTIONS))
        // .pipe(postcss(POSTCSS_PLUGINS))
        // .pipe(extReplace('.css'))
        .pipe(
          assetsParser({
            dependencies: constants.EXTENSIONS_MAP.map((ext) => ext.name),
            cache: assetsAPI,
          })
        )

        .pipe(gulp.dest(constants.CONTENT_PATH))
    );
    done();
  };
