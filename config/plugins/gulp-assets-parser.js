const through = require('through2');
// var Vinyl = require("vinyl");

/** largely based on gulp-file-assets by @Lanfei */

// to recurse or not to recurse? could just run this plugin through

module.exports = function({ cache, dependencies }) {
  const ASSETS_RE = /([^'"# ()?]+\.(EXT))\b/gi;
  const removeComments = str =>
    str.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');

  const isLocal = url => !/^(https?:)?\/\//.test(url);
  const hasSvgTag = str => /(<svg)([^<]*|[^>]*)/gm.test(str);

  // id, href, assets

  function parseAssetDependencies(f) {
    const {
      // cwd,
      // base,
      // path,
      relative,
      // dirname,
      basename,
      // stem,
      extname,
      contents,
    } = f;

    let currentAsset;

    // if it's code, store it and find any
    if (dependencies) {
      const allDeps = cache.getAllDependencies();
      if (extname !== '.xhtml' && !allDeps.includes(basename)) {
        return;
      }
      currentAsset = cache.addAsset(basename, relative);
      const pattern = new RegExp(
        ASSETS_RE.source.replace('EXT', dependencies.join('|')),
        'ig'
      );
      const contentsWithoutComments = removeComments(contents.toString());
      const results = contentsWithoutComments.match(pattern);
      if (results && results.length > 0) {
        results.forEach(result => {
          if (!isLocal(result)) return;
          cache.addDependency(basename, result.split('/').pop());
        });
      }
      if (hasSvgTag(contentsWithoutComments)) {
        cache.addProperty(basename, 'svg');
      }
    }
    // only include media items that are already stored as dependencies
    else {
      const allDeps = cache.getAllDependencies();
      if (!allDeps.includes(basename)) {
        return;
      }
      currentAsset = cache.addAsset(basename, relative);
    }
    return f;
  }

  return through.obj((file, encoding, callback) => {
    if (file.isBuffer()) {
      return callback(null, parseAssetDependencies(file));
    }
    return callback();
  });
};
