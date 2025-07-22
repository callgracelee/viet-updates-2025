const gulp = require("gulp");
const { assets } = require("./assetsAPI");
const pages = require("./tasks/pages");
const scripts = require("./tasks/scripts");
const styles = require("./tasks/styles");
const media = require("./tasks/media");
const opf = require("./tasks/opf");
const clean = require("./tasks/clean");
const init = require("./tasks/init");
const devServer = require("./tasks/devServer");
const zip = require("./tasks/zip.js");
const constants = require("./constants");

const buildContent = gulp.series(
  clean,
  assets.resetAssets.bind(assets), // reset this.assets every build
  pages(assets),
  scripts(assets),
  styles(assets),
  media(assets),
  opf(assets)
);

const build = gulp.series(init, buildContent);

const watchPug = () => gulp.watch(constants.ALL_PUG, buildContent);
// const watchLess = () => gulp.watch(constants.ALL_LESS, buildContent);
const watchStyles = () => gulp.watch(constants.STYLESHEET_PATHS, buildContent);
const watchBabel = () => gulp.watch(constants.ALL_JS, buildContent);
const watchMedia = () => gulp.watch(constants.MEDIA_PATHS, buildContent);
const watchData = () =>
  gulp.watch(constants.ALL_DATA, buildContent, { delay: 2000 });

const dev = gulp.series(
  build,
  devServer,
  gulp.parallel(watchPug, watchStyles, watchBabel, watchMedia, watchData)
);
const publish = gulp.series(build, zip());

module.exports = {
  default: build,
  build,
  dev,
  publish,
};
