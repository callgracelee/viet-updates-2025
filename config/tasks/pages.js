const gulp = require("gulp");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const prettier = require("@o2team/gulp-prettier-eslint");

const constants = require("../constants");
const assetsParser = require("../plugins/gulp-assets-parser");

module.exports = (assetsAPI) =>
  function compilePages(done) {
    const { book, pages } = assetsAPI.getBookAndPagesData();

    // pages.sort((a, b) => a.id.localeCompare(b.id)) // sort alphabetically

    let skipCount = 0; // Counter to track how many pages to skip

    pages.forEach((page) => {
      if (skipCount > 0) {
        skipCount--; // Decrement the skip counter
        return; // Skip this iteration
      }

      // Check if the template is CombinedListeningComprehension and if it has valid exercises data
      if (
        page.template === "CombinedListeningComprehension" &&
        page.data.exercises &&
        Array.isArray(page.data.exercises) &&
        page.data.exercises.length > 0 &&
        page.data.exercises[0].choices &&
        Array.isArray(page.data.exercises[0].choices) &&
        page.data.exercises[0].choices.length > 0
      ) {
        // Generate the page
        gulp
          .src(`${constants.PAGE_TEMPLATES_PATH}/${page.template}.pug`)
          .pipe(
            pug({
              locals: {
                book,
                pages,
                title: page.title,
                ...page.data,
              },
            })
          )
          .pipe(rename(`pages/${page.id}`))
          .pipe(
            assetsParser({
              dependencies: constants.EXTENSIONS_MAP.map((ext) => ext.name),
              cache: assetsAPI,
            })
          )
          .pipe(prettier({}))
          // .pipe(prettyHtml())
          .pipe(gulp.dest(`${constants.CONTENT_PATH}`));

        skipCount = 2; // Set the counter to skip the next two pages
        return; // Skip further processing for this iteration
      }

      // If the page is CombinedListeningComprehension but has no valid exercises data, skip processing it
      if (page.template === "CombinedListeningComprehension") {
        return; // Skip this page entirely
      }

      // If not generating the CombinedListeningComprehension page, continue with other pages
      gulp
        .src(`${constants.PAGE_TEMPLATES_PATH}/${page.template}.pug`)
        .pipe(
          pug({
            locals: {
              book,
              pages,
              title: page.title,
              ...page.data,
            },
          })
        )
        .pipe(rename(`pages/${page.id}`))
        .pipe(
          assetsParser({
            dependencies: constants.EXTENSIONS_MAP.map((ext) => ext.name),
            cache: assetsAPI,
          })
        )
        .pipe(prettier({}))
        // .pipe(prettyHtml())
        .pipe(gulp.dest(`${constants.CONTENT_PATH}`));
    });
    done();
  };
