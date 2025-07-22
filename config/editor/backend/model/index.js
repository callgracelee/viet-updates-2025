const ImagesModel = require('./Images');
const LessonsModel = require('./Lessons');
const PagesModel = require('./Pages');
const ReadaloudModel = require('./Readaloud');
const CompoundWordsModel = require('./CompoundWords');

module.exports = {
  PagesModel: new PagesModel(),
  LessonsModel: new LessonsModel(),
  ImagesModel: new ImagesModel(),
  ReadaloudModel: new ReadaloudModel(),
  CompoundWordsModel: new CompoundWordsModel(),
};
