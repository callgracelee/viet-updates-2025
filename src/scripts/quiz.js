import { Quiz } from './components/Quiz';
import metadata from '../data/metadata.json';

// instantiate one quiz (with a reference)
const config = {
  extend() {
    function storageUI() {
      const resetAllButton = this.quiz.querySelector('[data-reset-all]');
      const saveAllButton = this.quiz.querySelector('[data-save-all]');

      if (resetAllButton) {
        resetAllButton.removeAttribute('disabled');
        resetAllButton.addEventListener('click', e => {
          e.preventDefault();
          this.resetAll();
        });
      }
      if (saveAllButton) {
        saveAllButton.addEventListener('click', e => {
          e.preventDefault();
          this.saveAll();
        });
      }
    }
    this.useStorage(storageUI, { prefixKey: metadata.name });
  },
};

const quiz = new Quiz('[data-quiz]', config);

// instantiate multiple quizzes (with a reference)
// const quizzes = Array.from(document.querySelectorAll('[data-quiz]')).map(
//   quiz => new Quiz(quiz, config)
// );
