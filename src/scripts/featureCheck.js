import { name } from '../data/metadata';

const clearUserDataButton = document.querySelector('[data-clear-storage]');
const root = document.querySelector('[data-js]');

/* test interactivity */

if (root) {
  root.setAttribute('data-js', true);
}

/* test contenteditable */

const testEl = document.createElement('div');
testEl.setAttribute('contenteditable', true);
testEl.style.height = '1px';
testEl.style.width = '1px';
document.body.appendChild(testEl);

setTimeout(() => {
  if (
    testEl.contentEditable != null &&
    testEl.getAttribute('contenteditable')
  ) {
    root.setAttribute('data-supports-contenteditable', true);
    document.body.removeChild(testEl);
  }
}, 200);

/* test localStorage */

if (clearUserDataButton && window.localStorage) {
  if (root) {
    root.setAttribute('data-supports-storage', true);
  }
  clearUserDataButton.removeAttribute('disabled');
  clearUserDataButton.addEventListener('click', e => {
    e.preventDefault();
    window.localStorage.removeItem(name);
  });
}
