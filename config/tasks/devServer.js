const LaunchEpub = require('launch-epub');
const constants = require('../constants.js');

const readium = new LaunchEpub(constants.BUILDS_PATH);

const reload = done => {
  readium.reload();
  done();
};

module.exports = function devServer(done) {
  readium.start();
  done();
};
