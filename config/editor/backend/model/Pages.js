const fs = require("fs");
const path = require("path");
const constants = require("../../../constants.js");
const { getAnswers } = require("../lib.js");

module.exports = class PagesModel {
  constructor() {
    this.pages = JSON.parse(fs.readFileSync(constants.PAGEDATA_PATH));
  }

  static backup() {
    if (!fs.existsSync(constants.BACKUP_PATH)) {
      fs.mkdirSync(constants.BACKUP_PATH);
    }
    fs.copyFileSync(
      constants.PAGEDATA_PATH,
      path.resolve(
        `${constants.BACKUP_PATH}/pages-${constants.MODIFIED_DATE}.json`
      )
    );
  }

  save(updatedPages) {
    this.constructor.backup();
    try {
      fs.writeFileSync(constants.PAGEDATA_PATH, JSON.stringify(updatedPages));
      console.log("pages.json saved");
      this.pages = updatedPages;
    } catch (e) {
      console.log(e);
    }
  }

  getPages() {
    return this.pages;
  }

  getLessonPages(lessonId) {
    return this.pages.filter(
      (page) => page.data && page.data.lessonId === lessonId
    );
  }

  getLessonIds() {
    // get unique lessonIds
    const lessonPages = this.pages
      .filter((page) => page.data && page.data.lessonId)
      .map((lessonPage) => lessonPage.data.lessonId);
    return [...new Set(lessonPages)];
  }

  getLessons() {
    const lessonIds = this.getLessonIds();
    return lessonIds.map(
      (lessonId) => ({
        lessonId,
        pages: this.getLessonPages(lessonId),
      }),
      this
    );
  }

  updateBook() {
    // store frontmatter pages; store backmatter pages
    const frontmatterPages = JSON.parse(
      fs.readFileSync(constants.FRONTMATTER_PAGES_PATH)
    );
    const backmatterPages = JSON.parse(
      fs.readFileSync(constants.BACKMATTER_PAGES_PATH)
    );
    // create a dialoguePages array
    const dialoguePages = [];
    const answerData = [];
    // get all lessons from file (lessons.json)
    const lessons = JSON.parse(fs.readFileSync(constants.LESSONDATA_PATH));
    // reduce each lesson to an array of pages:
    const lessonPages = lessons.reduce((acc, lesson) => {
      const titlepage = {
        id: `L${lesson.lessonId}_001_titlepage.xhtml`,
        template: "LessonTitlePage",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          listeningObjectives: lesson.listeningObjectives,
          readingObjectives: lesson.readingObjectives,
          lessonImage: lesson.lessonImage,
        },
      };

      const listening = {
        id: `L${lesson.lessonId}_002_listening.xhtml`,
        template: "CombinedListeningComprehension",
        title: "Listening Comprehension",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          exercises: lesson.listeningExercises,
          title: "Listening Comprehension",
        },
      };

      const listening1 = {
        id: `L${lesson.lessonId}_002_listening1.xhtml`,
        template: "ListeningComprehension",
        title: "Listening Comprehension 1",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          exercises: lesson.listeningExercises1,
          title: "Listening Comprehension 1",
        },
      };

      const listening2 = {
        id: `L${lesson.lessonId}_003_listening2.xhtml`,
        template: "ListeningComprehension",
        title: "Listening Comprehension 2",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          exercises: lesson.listeningExercises2,
          title: "Listening Comprehension 2",
        },
      };

      const reading1 = {
        id: `L${lesson.lessonId}_004_reading1.xhtml`,
        template: "ReadingComprehension",
        title: "Reading Comprehension",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,

          lessonTitle: lesson.lessonTitle,
          readalouds: lesson.readalouds,
        },
      };
      const reading2 = {
        id: `L${lesson.lessonId}_005_reading2.xhtml`,
        template: "ReadingExercises",
        title: "Reading Exercises",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          readingExercises: lesson.readingExercises,
        },
      };

      const reading3 = {
        id: `L${lesson.lessonId}_005a_reading3.xhtml`,
        template: "ReadingComprehension",
        title: "Dialogue based on Reading",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          readalouds: lesson.dialogueBasedOnReading,
        },
      };

      const vocab = {
        id: `L${lesson.lessonId}_006_vocab.xhtml`,
        title: "Vocabulary",
        template: "Vocabulary",
        type: "bodymatter",
        data: {
          lessonId: lesson.lessonId,
          vocabulary: lesson.vocabulary,
          lessonTitle: lesson.lessonTitle,
        },
      };

      lesson.dialogues.forEach((dialogue) => {
        dialoguePages.push({
          id: `zL${lesson.lessonId}_dialogue${dialogue.id}.xhtml`,
          template: "Dialogue",
          type: "bodymatter",
          data: {
            lessonId: lesson.lessonId,
            lessonTitle: lesson.lessonTitle,
            dialogue,
            returnLink:
              dialogue.id === "1"
                ? `L${lesson.lessonId}_002_listening1.xhtml`
                : `L${lesson.lessonId}_003_listening2.xhtml`,
          },
        });
      });

      const sections =
        listening.data.exercises &&
        Array.isArray(listening.data.exercises) &&
        listening.data.exercises.length > 0 &&
        listening.data.exercises[0].choices &&
        Array.isArray(listening.data.exercises[0].choices) &&
        listening.data.exercises[0].choices.length > 0
          ? [listening, reading1, vocab]
          : [listening1, listening2, reading1, vocab];

      titlepage.data.sections = sections.map((section) => ({
        title: section.title,
        href: section.id,
      }));

      const lessonAnswers = {
        title: `Lesson ${lesson.lessonId}`,
        lessonId: lesson.lessonId,
        listening1: lesson.listeningExercises1.map(
          (exercise, exerciseIndex) => ({
            type: exercise.type,
            title: exercise.title,
            instructions: exercise.instructions,
            lessonId: lesson.lessonId,
            lessonTitle: lesson.lessonTitle,
            href: `L${lesson.lessonId}_002_listening1.xhtml`,
            id: `L${lesson.lessonId}listening1-${exercise.title ||
              exerciseIndex + 1}`,
            answers: getAnswers(exercise),
          })
        ),
        listening2: lesson.listeningExercises2.map(
          (exercise, exerciseIndex) => ({
            type: exercise.type,
            title: exercise.title,
            instructions: exercise.instructions,
            href: `L${lesson.lessonId}_003_listening2.xhtml`,
            lessonId: lesson.lessonId,
            lessonTitle: lesson.lessonTitle,
            id: `L${lesson.lessonId}listening2-${exercise.title ||
              exerciseIndex + 1}`,
            answers: getAnswers(exercise),
          })
        ),
        reading2: lesson.readingExercises.map((exercise, exerciseIndex) => ({
          type: exercise.type,
          title: exercise.title,
          instructions: exercise.instructions,
          id: `L${lesson.lessonId}reading-${
            exercise.section
          }-${exercise.title || exerciseIndex + 1}`,
          href: `L${lesson.lessonId}_005_reading2.xhtml`,
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lessonTitle,
          answers: getAnswers(exercise),
          section: exercise.section,
        })),
      };

      answerData.push(lessonAnswers);

      const updatedAcc = [
        ...acc,
        titlepage,
        listening,
        listening1,
        listening2,
        reading1,
        reading2,
        reading3,
        vocab,
      ];

      return updatedAcc;
    }, []);
    // concat these pages to the updatePages array

    // create the answerPage
    const answersPage = {
      id: `zAnswers.xhtml`,
      template: "Answers",
      title: "Answer Key",
      type: "backmatter",
      data: {
        lessons: answerData,
      },
    };

    // concat the dialogues to the updatePages
    // concat the backmatter pages to updatedPages
    const updatedPages = [
      ...frontmatterPages,
      ...lessonPages,
      ...dialoguePages,
      answersPage,
      ...backmatterPages,
    ];

    console.log("saving....");
    this.save(updatedPages);
    return updatedPages;
  }
};
