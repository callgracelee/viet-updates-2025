import 'custom-event-polyfill';
import { Timer } from '../../lib/Timer';

/**
 * Listens to an audio element, adds a highlight class to elements with a data-attribute value for start time in seconds.
 *
 * @class CustomReadAloud
 * @author Phil Gray
 * @version 0.2.0
 *
 */
export class Readaloud {
  /**
   * Creates an instance of CustomReadAloud.
   * @param {string} el - The id of a container element for the elements to be highlighted.
   * @param {string} audioEl - The id of the audio element.
   * @param {object} [options={}]
   * @param {boolean} [options.touchTextToPlay=true] - Enable to allow user to touch or click text to begin playback.
   * @param {string} [options.highlightClass=highlighted] - The classname applied to highlighted elements. Customize for preference or to avoid namespace conflicts in stylesheet.
   * @param {string} [options.dataAttribute=playhead] - The unique part of the data-attribute property name. The default is `playhead`, so the data-attribute name is `data-playhead`. Customize for preference or to avoid namespace conflicts with other libraries.
   * @param {number} [options.audioClipBegin=0] - The start time for the audio clip.
   * @param {number|null} [options.audioClipEnd=null] - The end time for the audio clip.
   * @param {number} [options.playbackRate=1] - The initial playback rate for the audio element.
   * @param {boolean} [options.stopAfterCurrent=false] - When the user moves the playhead, only play the current highlight and then stop.
   * @memberof CustomReadAloud
   */
  constructor(el, options = {}) {
    this.el = el;
    this.audioEl = el.querySelector('audio');
    Object.assign(
      this,
      {
        touchTextToPlay: true,
        highlightClass: 'highlighted',
        dataAttribute: 'playhead',
        audioClipBegin: 0,
        audioClipEnd: this.audioEl.duration,
        playbackRate: 1,
        stopAfterCurrent: false,
      },
      options
    );
    this.current = this._roundTenth(this.audioClipBegin);
    this.lines = this.el.querySelectorAll(`[data-${this.dataAttribute}]`);
    this.player = this.audioEl;
    this.times = null;
    this.highlighted = null;
    this.previousHighlighted = null;
    this.isPlaying = false;
    this.stopAt = null;
    this.timer = new Timer(this._onTimeUpdate.bind(this), 10);
    this._init();
  }

  /** Utility Methods */

  /**
   * Rounds a number to the nearest 0.1.
   *
   * @param {number} n
   * @returns {number}
   * @memberof CustomReadAloud
   */

  // eslint-disable-next-line
  _roundTenth(n) {
    return Number((Math.round(Number(n) * 10) / 10).toFixed(1));
  }

  /**
   * Checks that `lines` and `player` elements are found in the document and not undefined. Then, extracts `times` as an object from the dataset for each line and sets event listeners on each line as well as the audio player.
   *
   * @returns {void}
   * @memberof CustomReadAloud
   */
  _init() {
    if (this.lines && this.player) {
      /** may require `Array.from` polyfill for older browsers */
      this.times = Array.from(this.lines).reduce((acc, curr) => {
        const roundedTime = this._roundTenth(curr.dataset.playhead);
        if (!acc[roundedTime]) {
          acc[roundedTime] = curr;
        }
        return acc;
      }, {});

      /** Event Listeners */
      if (this.touchTextToPlay) {
        /** may require `Array.forEach` polyfill for older browsers */
        this.lines.forEach(span => {
          const lineClickHandler = e => {
            span.setAttribute('aria-pressed', 'true');
            this._movePlayhead(span.dataset.playhead);
            e.preventDefault();
          };

          span.addEventListener('click', lineClickHandler);
          span.addEventListener('keydown', keyboardEvent => {
            if (keyboardEvent.keyCode === 13 || keyboardEvent.keyCode === 32) {
              lineClickHandler(keyboardEvent);
            }
          });
          span.setAttribute('role', 'button');
          span.setAttribute('tabindex', '0');
        });
      }

      this.player.addEventListener('ended', () => {
        this.stop();
        this.timer.stop();
        this.player.dispatchEvent(this._onPlayStateChange());
      });

      this.player.addEventListener('pause', () => {
        this.isPlaying = false;
        this.timer.stop();
        this.player.dispatchEvent(this._onPlayStateChange());
      });
      this.player.addEventListener('play', () => {
        // /* in case ended event never fires, set audioClipEnd with an actual value */
        if (!this.audioClipEnd || this.audioClipEnd > this.player.duration) {
          this.audioClipEnd = this.player.duration;
        }
        this.isPlaying = true;
        this.timer.start();
        this.player.dispatchEvent(this._onPlayStateChange());
      });
    }
  }

  /** "Private" methods prefixed with _ */

  /**
   * Removes all highlights and adds the class to the selected element.
   *
   * @param {HTMLElement} highlighted
   * @returns {void}
   * @memberof CustomReadAloud
   */
  _highlight(highlighted) {
    let previousHighlight = null;
    if (this.highlighted) {
      previousHighlight = this.highlighted;
    }
    this._removeHighlights();
    highlighted.el.setAttribute(`data-${this.highlightClass}`, true);
    this.highlighted = highlighted;
    if (previousHighlight) {
      previousHighlight.el.setAttribute('aria-pressed', false);
    }
  }

  /**
   * Iterates through `lines` and removes highlighted class from each.
   *
   * @returns {void}
   * @memberof CustomReadAloud
   */
  _removeHighlights() {
    this.lines.forEach(span => {
      span.removeAttribute(`data-${this.highlightClass}`);
    });
  }

  _findHighlightedElement(currentTime) {
    // get the keys from this.times as an array and sort them from least to greatest
    const keys = Object.keys(this.times)
      .sort((a, b) => a - b)
      .map(str => Number(str));

    // determine the last key
    // const isLastKey = key => key === keys[keys.length - 1];

    const keyOfElementToHighlight =
      // find the key of the element to highlight
      keys.find(
        (key, i) =>
          // the current time should be greater than or equal to it
          Number(currentTime) >= key &&
          // the current time should also be less than the next key after it
          Number(currentTime) <
            (i < keys.length - 1 ? keys[i + 1] : this.audioClipEnd)
      );

    // return the HTMLElement for assigning a highlighting class or attribute
    return keyOfElementToHighlight
      ? {
          el: this.times[keyOfElementToHighlight],
          key: keyOfElementToHighlight,
        }
      : null;
  }

  /**
   * Sets `this.current` for each `timeupdate` event emitted randomly 4 times each second by the audio element.
   *
   * @returns {void}
   * @memberof CustomReadAloud
   */

  _onTimeUpdate() {
    this.current = this._roundTenth(this.player.currentTime);
    if (
      this.stopAfterCurrent &&
      this.current &&
      this.stopAt &&
      this.current >= this.stopAt
    ) {
      this.stopAt = null;
      return this.stop();
    }

    const highlighted =
      this._findHighlightedElement(this.current) || this.highlighted;

    if (highlighted && !this.highlighted) {
      this._highlight(highlighted);
      /** emit a custom event with each new highlight */
      this.player.dispatchEvent(this._onHighlightChange());
      return;
    }
    /** Only call`_highlight` if `highlighted` has changed since the last time. */
    if (highlighted && highlighted.key !== this.highlighted.key) {
      this.previousHighlighted = this.highlighted;
      this._highlight(highlighted);
      /** emit a custom event with each new highlight */
      this.player.dispatchEvent(this._onHighlightChange());
    }
    if (
      this.audioClipEnd &&
      this._roundTenth(this.current) === this._roundTenth(this.audioClipEnd)
    ) {
      this.stop();
    }
  }

  /**
   * Custom event for highlight changes
   *
   * @returns {CustomEvent}
   * @memberof CustomReadAloud
   */
  _onHighlightChange() {
    return new CustomEvent('highlightChange', {
      bubbles: true,
      detail: {
        ...this,
      },
    });
  }

  /**
   * Custom event for play state changes
   *
   * @returns {CustomEvent}
   * @memberof CustomReadAloud
   */
  _onPlayStateChange() {
    return new CustomEvent('playStateChange', {
      bubbles: true,
      detail: {
        ...this,
      },
    });
  }

  /**
   * Sets `current` and plays the audio.
   *
   * @param {number} newTime - The number of seconds from the start of the actual audio clip.
   * @returns {void}
   * @memberof CustomReadAloud
   */
  _movePlayhead(newTime) {
    const current = this._roundTenth(newTime);
    if (current && this.stopAfterCurrent) {
      this.stopAt = this._getNextTime(current);
    }
    this.current = current;
    this.play();
  }

  /**
   * Takes a time and finds the next
   *
   * @param {number, string} time
   * @returns {number}
   */
  _getNextTime(time) {
    const current = this._roundTenth(time);
    const keys = Object.keys(this.times)
      .map(str => Number(str))
      .sort((a, b) => a - b);
    const currentKey = keys.indexOf(current);
    return keys[currentKey + 1] || this._roundTenth(this.audioClipEnd);
  }

  /** Public Methods */
  /**
   * Sets `currentTime` and `playbackRate` on the audio element and calls its `play` method.
   *
   * @returns {void}
   * @memberof CustomReadAloud
   */
  play() {
    this.player.currentTime = this.current;
    this.player.playbackRate = this.playbackRate;
    this.player.play();
  }

  /**
   * Calls the audio element's `pause` method.
   *
   * @returns {void}
   * @memberof CustomReadAloud
   */
  pause() {
    this.player.pause();
  }

  /**
   * Simulates `stop` functionality by calling the element's `pause` button and resetting its `currentTime` to 0. Also removes all highlights and resets `current`.
   *
   * @returns {void}
   * @memberof CustomReadAloud
   */
  stop() {
    this.pause();
    this._removeHighlights();
    this.player.currentTime = this.audioClipBegin;
    this.current = this.audioClipBegin;
    this.highlighted = null;
  }

  /**
   * Updates the audio element's playback rate.
   *
   * @returns {void}
   * @param {number|string} newRate - The playback rate for the audio element in seconds.
   * @memberof CustomReadAloud
   */
  changePlaybackRate(newRate) {
    /** Dynamically typed for ease of use. */
    const rate = Number(newRate);
    if (Number.isNaN(rate)) {
      console.log('playback rate must be a number');
    } else {
      this.playbackRate = rate;
      this.player.playbackRate = this.playbackRate;
    }
  }

  /**
   * Calls `_movePlayhead` with a new time in seconds.
   *
   * @param {number|string} newTime - The number of seconds from the start of the actual audio clip.
   * @returns {void}
   * @memberof CustomReadAloud
   */
  movePlayhead(newTime) {
    /** Dynamically typed for ease of use. */
    const time = Number(newTime);
    if (Number.isNaN(time)) {
      this._movePlayhead(time);
    }
  }
}
