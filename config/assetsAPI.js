const fs = require('fs');
const constants = require('./constants');
const argv = require('minimist')(process.argv.slice(2));

class AssetsAPI {
  constructor() {
    this.assets = {};
    this.bookData = JSON.parse(fs.readFileSync(constants.METADATA_PATH));
    this.pagesData = JSON.parse(fs.readFileSync(constants.PAGEDATA_PATH));

    // custom filter logic if `-- --lessons=` argument is passed in the command line
    if (argv.lessons) {
      this.filterPages();
    }
  }

  filterPages() {
    this.pagesData = this.pagesData.filter(page => {
      let [start, end] = String(argv.lessons).split('-');
      if (!end) {
        end = start;
      }
      // lesson page
      if (page.data && page.data.lessonId) {
        return page.data.lessonId >= start && page.data.lessonId <= end;
      }

      // answer page
      if (page.data && page.data.lessons) {
        page.data.lessons = page.data.lessons.filter(
          lessonAnswerData =>
            lessonAnswerData.lessonId >= start &&
            lessonAnswerData.lessonId <= end
        );
      }
      // other
      return page;
    });
  }

  getPagesData() {
    return this.pagesData;
  }

  getBookData() {
    return this.bookData;
  }

  getBookAndPagesData() {
    return { book: this.getBookData(), pages: this.getPagesData() };
  }

  addAsset(assetId, assetHref) {
    const { mediaType } = constants.EXTENSIONS_MAP.find(
      ext => ext.name === assetHref.split('.').pop()
    );
    const { pages, book } = this.getBookAndPagesData();
    const currentPage = pages.find(p => p.id === assetId) || {};

    this.assets[assetId] = {
      href: assetHref,
      manifest: {
        'media-type': mediaType,
        ...currentPage.manifest,
      },
    };

    if (book.cover && book.cover.src && book.cover.src === assetHref) {
      this.addProperty(assetId, 'cover-image');
    }

    return this.assets[assetId];
  }

  addProperty(assetId, property) {
    const asset = this.assets[assetId];

    if (!asset.manifest.properties) {
      this.assets[assetId].manifest.properties = [];
    }
    if (asset.manifest.properties.indexOf(property) < 0) {
      console.log(`add property ${property} to ${assetId}`);
      this.assets[assetId].manifest.properties.push(property);
    }
    return asset;
  }

  addDependency(assetId, dependency) {
    const asset = this.assets[assetId];
    if (!asset.dependencies) {
      asset.dependencies = [];
    }
    if (asset.dependencies.indexOf(dependency) < 0) {
      asset.dependencies.push(dependency);
      this.assets[assetId].dependencies = asset.dependencies;
    }
    const ext = dependency.split('.').pop();

    if (asset.manifest['media-type'] === 'application/xhtml+xml') {
      if (ext === 'js') {
        this.addProperty(assetId, 'scripted');
      }
      if (ext === 'svg') {
        this.addProperty(assetId, 'svg');
      }
    }

    return asset;
  }

  getAllDependencies() {
    return Object.keys(this.assets).reduce((acc, curr) => {
      const asset = this.assets[curr];
      let deps = [];
      if (asset.dependencies) {
        deps = asset.dependencies.filter(dep => acc.indexOf(dep) === -1);
      }
      return [...acc, ...deps];
    }, []);
  }

  getAssetsArray() {
    return Object.keys(this.assets).map(key => ({
      id: key,
      ...this.assets[key],
    }));
  }

  getAssets() {
    return this.assets;
  }

  resetAssets(done) {
    this.assets = {};
    this.bookData = JSON.parse(fs.readFileSync(constants.METADATA_PATH));
    this.pagesData = JSON.parse(fs.readFileSync(constants.PAGEDATA_PATH));
    // custom filter logic if `-- --lessons=` argument is passed in the command line
    if (argv.lessons) {
      this.filterPages();
    }
    done();
  }
}

module.exports = { assets: new AssetsAPI() };
