const gulp = require('gulp');
const constants = require('../constants');

module.exports = assetsAPI => {
  return function media(done) {
    return gulp
      .src(constants.MEDIA_PATHS)
      .pipe(gulp.dest(constants.CONTENT_PATH));
    done();
  };
};
