const fs = require('fs');
const constants = require('../../../constants.js');

module.exports = class CompoundWordsModel {
  constructor() {
    this.compoundWordsData = JSON.parse(
      fs.readFileSync(`${constants.DATA_PATH}/compoundWords.json`)
    );
  }

  getCompoundWords() {
    return this.compoundWordsData;
  }
};
