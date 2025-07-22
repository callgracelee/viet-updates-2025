import { Timer } from '../../lib/Timer';
import { padTime } from '../../lib/padTime';

export class AudioPlayer {
  constructor(el, options = {}) {
    const defaultOptions = {
      audioEvents: {
        play: () => {
          this.uiElements.play.setAttribute('data-toggled', true);
        },
        pause: () => {
          this.uiElements.play.setAttribute('data-toggled', false);
        },
        ended: () => {
          this.uiElements.play.removeAttribute('data-toggled');
          this.uiElements.speedToggle.removeAttribute('data-toggled');
          this.stop();
        },
        loadedmetadata: () => {
          const delta = (this.audio.duration - this.audio.currentTime).toFixed(
            0
          );
          this.uiElements.time.textContent = `-${padTime(delta)}`;
        },
        ratechange: () => {
          console.log(`new rate: ${this.audio.playbackRate}`);
        },
      },
      ui: {
        audio: {
          selector: 'audio',
        },
        play: {
          selector: '[data-audio-play-button]',
          action: e => {
            e.preventDefault();
            this.play();
          },
        },
        progress: {
          selector: '[data-audio-progress-bar]',
          action: e => {
            e.preventDefault();
            this.seek(e);
          },
        },
        progressHandle: {
          selector: '[data-audio-progress-bar-handle]',
          action: e => {
            e.preventDefault();
          },
        },
        time: {
          selector: '[data-audio-time]',
        },
        speedToggle: {
          selector: '[data-audio-speed-button]',
          action: e => {
            e.preventDefault();
            this.toggleSpeed();
          },
        },
      },
    };

    this.node = el;

    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.audioEvents = this.options.audioEvents;
    this.uiElements = Object.keys(this.options.ui).reduce(
      (acc, key) => {
        acc[key] = this.node.querySelector(this.options.ui[key].selector);
        if (this.options.ui[key].action) {
          acc[key].addEventListener(
            'click',
            this.options.ui[key].action.bind(this)
          );
        }
        return acc;
      },
      {},
      this
    );

    this.audio = this.node.querySelector('audio');

    /* remove default html5 audio player by setting audio controls to false */
    this.audio.removeAttribute('controls');

    Object.keys(this.audioEvents).forEach(key => {
      this.audio.addEventListener(key, this.audioEvents[key].bind(this));
    }, this);

    this.timer = new Timer(this.timeupdate.bind(this), 10);

    this.playing = false;
    this.percent = 0;
  }

  play() {
    if (!this.playing) {
      this.audio.play();
      this.timer.start();
    } else {
      this.audio.pause();
      this.timer.stop();
    }
    this.playing = !this.playing;
  }

  stop() {
    this.audio.pause();
    this.timer.stop();
    this.audio.currentTime = 0;
    this.playing = false;
    this.timeupdate();
  }

  seek(e) {
    const percent = e.offsetX / this.uiElements.progress.offsetWidth;

    this.audio.currentTime = percent * this.audio.duration;

    this.timeupdate();
  }

  toggleSpeed() {
    if (this.audio.playbackRate === 1) {
      this.audio.playbackRate = 0.75;
      this.uiElements.speedToggle.setAttribute('data-toggled', true);
    } else {
      this.audio.playbackRate = 1;
      this.uiElements.speedToggle.removeAttribute('data-toggled');
    }
  }

  timeupdate() {
    const delta = (this.audio.duration - this.audio.currentTime).toFixed(0);
    this.uiElements.time.textContent = `-${padTime(delta)}`;

    this.percent = this.audio.currentTime / this.audio.duration;
    const left = Math.floor(this.percent * 100) - 2;

    this.uiElements.progressHandle.style = `left:${left}%;`;
  }
}
