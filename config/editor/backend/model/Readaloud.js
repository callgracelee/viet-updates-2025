const fs = require('fs');
const { toHtml } = require('../lib');
const constants = require('../../../constants.js');

module.exports = class ReadaloudModel {
  constructor() {
    this.readaloudData = JSON.parse(
      fs.readFileSync(`${constants.DATA_PATH}/readaloud-annotator.json`)
    );
  }

  getReadalouds() {
    return Object.keys(this.readaloudData).map(key => ({
      id: key,
      html: toHtml(this.readaloudData[key])
    }));
  }
};
