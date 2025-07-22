const {
  PagesModel,
  ImagesModel,
  LessonsModel,
  ReadaloudModel,
  CompoundWordsModel,
} = require('./model');

module.exports = {
  Query: {
    lessons: () => LessonsModel.getLessons(),
    images: () => ImagesModel.getImages(),
    readalouds: () => ReadaloudModel.getReadalouds(),
    compoundWords: () => CompoundWordsModel.getCompoundWords(),
  },
  Mutation: {
    updateLessons: (parent, { input }) => LessonsModel.updateLessons(input),
    deleteLesson: (parent, { lessonId }) => LessonsModel.deleteLesson(lessonId),
    updateBook: () => PagesModel.updateBook(),
    save: () => PagesModel.save(),
  },
};
