const del = require('del');
const constants = require('../constants.js');

module.exports = function clean() {
  return del([constants.CONTENT_PATH]);
};
