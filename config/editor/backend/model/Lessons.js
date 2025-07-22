const fs = require('fs');
const path = require('path');
const constants = require('../../../constants.js');

module.exports = class LessonsModel {
  constructor() {
    this.lessons = JSON.parse(fs.readFileSync(constants.LESSONDATA_PATH));
  }

  static backup() {
    if (!fs.existsSync(constants.BACKUP_PATH)) {
      fs.mkdirSync(constants.BACKUP_PATH);
    }
    fs.copyFileSync(
      constants.LESSONDATA_PATH,
      path.resolve(
        `${constants.BACKUP_PATH}/lessons-${constants.MODIFIED_DATE}.json`
      )
    );
  }

  getLessons() {
    return this.lessons;
  }

  updateLessons(input) {
    this.lessons = this.lessons
      .filter(lesson => lesson.lessonId !== input.lessonId)
      .concat([input])
      .sort((a, b) => a.lessonId - b.lessonId);

    this.save();

    return this.lessons;
  }

  deleteLesson(lessonId) {
    this.lessons = this.lessons.filter(lesson => lesson.lessonId !== lessonId);
    this.save();
    return this.lessons;
  }

  save() {
    this.constructor.backup();
    try {
      fs.writeFileSync(constants.LESSONDATA_PATH, JSON.stringify(this.lessons));
    } catch (e) {
      console.log(e);
    }
  }
};
