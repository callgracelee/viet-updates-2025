const fs = require('fs');
const path = require('path');
const glob = require('glob');

const constants = require('../../../constants.js');

function base64Encode(file) {
  // read binary data
  const bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

module.exports = class ImagesModel {
  constructor() {
    this.imagePaths = glob.sync(
      `${constants.SOURCE_PATH}/**/*.{png,jpg,jpeg}`,
      { absolute: true }
    );
  }

  getImages() {
    return this.imagePaths.map(img => ({
      absolutePath: img,
      relativePath: path.relative(
        constants.CONTENT_PATH,
        path.resolve(
          `${constants.CONTENT_PATH}/${path.relative(
            constants.SOURCE_PATH,
            img
          )}`
        )
      ),
      filename: path
        .basename(img)
        .split('.')
        .shift(),
      base64: base64Encode(img),
    }));
  }
};
