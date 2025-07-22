import { merge } from 'lodash-es';
import { Storage } from './Storage';
import { types, defaultType } from './ExerciseTypes';
import { Exercise } from './Exercise';
import { isNode } from '../../lib/isNode';

import {
  INITIAL,
  INPUT_SELECTOR,
  PREVIEW_SELECTOR,
  RESET_CONTROL_SELECTOR,
  VALIDATE_CONTROL_SELECTOR,
  ANSWER_SLOT_SELECTOR,
  DATA_TOGGLED_ATTRIBUTE,
  DATA_CORRECT_ATTRIBUTE,
  DATA_INCORRECT_ATTRIBUTE,
  DATA_SLOT_ACTIVE_ATTRIBUTE,
} from './constants';

/* =============================================
=            default options            =
============================================= */
// TODO: not actually functional yet
const defaultOptions = {
  INPUT_SELECTOR,
  PREVIEW_SELECTOR,
  RESET_CONTROL_SELECTOR,
  VALIDATE_CONTROL_SELECTOR,
  ANSWER_SLOT_SELECTOR,
  DATA_TOGGLED_ATTRIBUTE,
  DATA_CORRECT_ATTRIBUTE,
  DATA_INCORRECT_ATTRIBUTE,
  DATA_SLOT_ACTIVE_ATTRIBUTE,
  extend() {},
};

/* =====  End of default options  ====== */

export class Quiz {
  constructor(selector, options) {
    this.ready = false;
    // setup
    this.init = function() {
      // if the provided selector is not a node, make it one
      // this is useful for when you want to select multiple quiz elements with querySelectorAll and then instantiate them all at once inside a forEach loop
      // constructor
      this.node = isNode(selector)
        ? selector
        : document.querySelector(selector);
      this.key = this.node.dataset.quiz;

      // merge options
      this.options = merge(defaultOptions, options);

      // call extension
      this.extensions = [];
      this.options.extend.call(this);

      // LIFECYCLE: beforeCreate
      this.extensions.forEach(function(extension) {
        if (extension.beforeCreate) {
          extension.beforeCreate.call(this);
        }
      }, this);

      // instantiate exercises
      this.exerciseNodes = this.node.querySelectorAll('[data-type]');
      this.exerciseNodes.forEach(function(exerciseNode) {
        return new Exercise(exerciseNode, this.context, this.options);
      }, this);

      // LIFECYCLE: created
      this.extensions.forEach(function(extension) {
        if (extension.created) {
          extension.created.call(this);
        }
      }, this);

      // set ready
      this.ready = true;
    };
    this.updated = function(payload) {
      if (this.ready) {
        // console.log("quiz updated");
        // after exercises exensions lifecycle
        this.extensions.forEach(function(extension) {
          if (extension.updated) {
            extension.updated.call(this, payload);
          }
        }, this);
      }
    };
    this.defaultType = defaultType;
    this.types = types;

    // global api. available everywhere
    // ideally, extensions can add functionality to the context functions; for instance, storage and scoring can hook into this api
    this.context = {
      ready: false,
      types: this.types,
      extensions: this.extensions,
      register: function(exercise, key) {
        if (!this.exercises) {
          this.exercises = {};
        }
        this.exercises[key] = exercise;
        if (Object.keys(this.exercises).length === this.exerciseNodes.length) {
          this.context.ready = true;
          delete this.exerciseNodes;
        }
      }.bind(this),
      beforeEach() {
        // setup
        this.getResponseKey = this.context.types[this.type].getResponseKey.bind(
          this
        );
        this.compare = this.context.types[this.type].compare.bind(this);

        this.reset = function() {
          this.context.types[this.type].reset.call(this);
        };
        // register components first
        this.registerComponents();
        // then call before
        this.context.types[this.type].before.call(this);
        if (!this.state.name) {
          this.reset();
          if (
            this.context.initialStates &&
            this.context.initialStates[this.key]
          ) {
            this.setState(this.context.initialStates[this.key]);
          }
        }
        // eslint-disable-next-line no-unused-expressions
        this.transitions[this.state.name];
        // context functions are a way for the parent Quiz module to access all the individual exercise instances
        this.context.register(this, this.key);
      },
      updateEach() {
        this.context.types[this.type].update.call(this);
      },
      update: this.updated.bind(this),
    };
    // initialize quiz
    this.init();
  }

  registerExtension(extension) {
    this.extensions.push(extension);
  }

  // eslint-disable-next-line no-unused-vars
  useExtension(cb, options = {}) {
    return cb.call(this);
  }

  useStorage(UICallback, options) {
    if (!window.localStorage) return;
    const extension = this.useExtension(() => ({
      beforeCreate() {
        this.store = new Storage(this, options);
        this.store.readStorage();
        this.context.initialStates = this.store.store;
      },
      created() {
        this.store.loadAll();
        return UICallback.call(this.store);
      },
      updated(payload) {
        if (payload.state.name === INITIAL) {
          this.store.removeItem(payload.key);
        } else {
          this.store.saveItem(payload.key, payload.state);
        }
      },
    }));
    this.registerExtension(extension);
  }
}
