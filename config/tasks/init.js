const fs = require('fs');
const constants = require('../constants.js');

module.exports = function init(done) {
  // create mimetype

  if (!fs.existsSync(constants.BUILDS_PATH)) {
    fs.mkdirSync(constants.BUILDS_PATH);
  }
  fs.writeFileSync(`${constants.BUILDS_PATH}/mimetype`, `application/epub+zip`);

  // create  container.xml
  const META_INF_PATH = `${constants.BUILDS_PATH}/META-INF`;

  if (!fs.existsSync(META_INF_PATH)) {
    fs.mkdirSync(META_INF_PATH);
  }
  const CONTAINER_PATH = `${META_INF_PATH}/container.xml`;
  fs.writeFileSync(CONTAINER_PATH, constants.CONTAINER_XML);
  done();
};
