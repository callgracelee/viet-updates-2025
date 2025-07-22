const gulp = require('gulp');
const constants = require('../constants');
const assetsParser = require('../plugins/gulp-assets-parser');

module.exports = assetsAPI => {
  return function media(done) {
    return gulp
      .src(constants.MEDIA_PATHS)
      .pipe(
        assetsParser({
          cache: assetsAPI
        })
      )
      .pipe(gulp.dest(constants.CONTENT_PATH));
    done();
  };
};
