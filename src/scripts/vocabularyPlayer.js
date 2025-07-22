const vocabItems = document.querySelectorAll('[data-vocabulary-player="true"]');
const vocabMap = [];

// VocabItem class
class VocabItem {
  constructor(el) {
    this.audio = el.querySelector('audio');
    this.item = el;
    this.isPlaying = false;

    /* override no js */
    this.audio.removeAttribute('controls');

    this.item.addEventListener('click', e => {
      vocabMap.forEach(v => {
        if (v.playing()) {
          v.stop();
        }
      });
      this.audio.play();
      e.preventDefault();
    });

    this.item.addEventListener('keypress', e => {
      vocabMap.forEach(v => {
        if (v.playing()) {
          v.stop();
        }
      });
      this.audio.play();
      e.preventDefault();
    });
  }

  init() {
    // TODO: do not keep playing if the page has changed

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.item.setAttribute('data-playing', this.isPlaying);
      this.item.setAttribute('aria-pressed', this.isPlaying);
    });
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.item.setAttribute('data-playing', this.isPlaying);
      this.item.setAttribute('aria-pressed', this.isPlaying);
    });
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.item.setAttribute('data-playing', this.isPlaying);
      this.item.setAttribute('aria-pressed', this.isPlaying);
    });
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  playing() {
    return this.isPlaying;
  }
}

vocabItems.forEach((item, i) => {
  const vocab = new VocabItem(item, i);
  vocab.init();
  vocabMap.push(vocab);
});
