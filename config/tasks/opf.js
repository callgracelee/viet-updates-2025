const gulp = require("gulp");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const { v5: uuidv5 } = require("uuid");
const constants = require("../constants");
const pagesTask = require("./pages.js");

module.exports = (assetsAPI) =>
  function opf(done) {
    const { book, pages } = assetsAPI.getBookAndPagesData();
    const assets = assetsAPI.getAssetsArray();

    return gulp
      .src(constants.PACKAGE_TEMPLATE_PATH)
      .pipe(
        pug({
          doctype: "xml",
          pretty: true,
          locals: {
            assets,
            book: {
              ...book,
              modified: constants.MODIFIED_DATE,
              identifier: {
                text: uuidv5(book.name, constants.IDENTIFIER_NAMESPACE),
                scheme: "URN",
              },
            },
            pages,
          },
        })
      )
      .pipe(rename(`content.opf`))
      .pipe(gulp.dest(constants.CONTENT_PATH));
    done();
  };
