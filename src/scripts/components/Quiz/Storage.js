import { merge } from 'lodash-es';
import { TOUCHED, VALIDATED_CORRECT, VALIDATED_INCORRECT } from './constants';

export class Storage {
  constructor(context, options) {
    this.options = merge({}, options);
    this.contextKey = context.key;
    this.storageKey = this.options.prefixKey;
    this.states = [TOUCHED, VALIDATED_CORRECT, VALIDATED_INCORRECT];
    this.exercises = context.exercises;
    this.context = context.context;
    this.quizContext = context;
    this.quiz = context.node;
    this.store = {};
  }

  static clearStorage(storageKey) {
    window.localStorage.removeItem(storageKey);
  }

  saveItem(key, value) {
    const isStorable = this.states.indexOf(value.name) > -1;
    if (isStorable) {
      if (!this.store[this.contextKey]) {
        this.store[this.contextKey] = {};
      }
      this.store[this.contextKey][key] = value;
      this.saveAll();
    }
  }

  removeItem(key) {
    delete this.store[this.contextKey][key];
    this.saveAll();
  }

  saveAll() {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.store));
  }

  readStorage() {
    this.store = JSON.parse(window.localStorage.getItem(this.storageKey)) || {};
  }

  loadAll() {
    if (!this.quizContext.exercises) return;
    if (!this.store[this.contextKey]) {
      this.store[this.contextKey] = {};
    }
    Object.keys(this.quizContext.exercises).forEach(function(key) {
      const storedState = this.store[this.contextKey][key];
      if (storedState) {
        this.quizContext.exercises[key].setState(storedState);
      }
    }, this);
  }

  setAllStates() {
    Object.keys(this.exercises).forEach(exercise => {
      exercise.setState();
    }, this);
  }

  resetAll() {
    if (!this.quizContext.exercises) return;
    console.log('resetting all...');
    Object.keys(this.quizContext.exercises).forEach(function(key) {
      const storedState = this.store[this.contextKey][key];
      if (storedState) {
        this.quizContext.exercises[key].reset();
      }
    }, this);
    delete this.store[this.contextKey];
    this.saveAll();
  }
}
