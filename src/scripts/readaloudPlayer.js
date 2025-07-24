class TextAudioSync {
  constructor(container) {
    this.container = container;
    this.audio = container.querySelector("audio");
    this.playPauseButton = container.querySelector(".readaloud__playButton");
    this.stopButton = container.querySelector(".readaloud__stopButton");
    this.speedButton = container.querySelector(".readaloud__speedToggle");
    this.shadowButton = container.querySelector(".readaloud__shadowButton");
    this.loopButton = container.querySelector(".readaloud__loopButton");

    this.textElements = Array.from(container.querySelectorAll("[data-playhead]"));

    this.textElements.forEach((element) => {
      element.dataset.playhead = (Math.max(0, parseFloat(element.dataset.playhead) - 0.4)).toFixed(2);
    });

    this.state = {
      playTimer: null,
      pauseTimer: null,
      isInPauseCycle: false,
      isShadowMode: false,
      isSlowSpeed: false,
      isLoopMode: false,
    };

    this._init();
  }

  _init() {
    this._setupEventListeners();
    this._setupAudioEvents();
  }

  _setupEventListeners() {
    // Use event delegation
    const events = [
      {
        element: this.playPauseButton,
        event: "click",
        handler: this.togglePlayPause,
      },
      { element: this.stopButton, event: "click", handler: this.stop },
      {
        element: this.shadowButton,
        event: "click",
        handler: this.toggleShadow,
      },
      { element: this.speedButton, event: "click", handler: this.toggleSpeed },
      { element: this.loopButton, event: "click", handler: this.loop },
    ];

    events.forEach(({ element, event, handler }) => {
      element.addEventListener(event, handler.bind(this));
    });

    // Add click event to text elements for direct playback
    this.textElements.forEach((element) => {
      element.addEventListener("click", () => this.seekToElement(element));
    });
  }

  _setupAudioEvents() {
    this._timeUpdateHandler = () => {
      this.highlightspan();
    };
    if (this.audio) {
      this.audio.addEventListener("timeupdate", this._timeUpdateHandler);
      this.audio.addEventListener("ended", this._handleAudioEnd.bind(this));
    }

   // Remove highlight and reset play button when audio ends
    this.audio.addEventListener("ended", () => {
      this.textElements.forEach((span) => span.classList.remove("active"));
      // if (this.playPauseButton) {
      //   this.playPauseButton.setAttribute("data-playing", true);
      // }
    });
  }

  highlightspan() {
    const currentTime = this.audio.currentTime;

    this.textElements.forEach((element, i) => {
      const playhead = parseFloat(element.dataset.playhead);
      const nextPlayhead = i + 1 < this.textElements.length ? parseFloat(this.textElements[i + 1].dataset.playhead) : Number.MAX_VALUE;

      if (currentTime >= playhead && currentTime < nextPlayhead) {
        element.setAttribute("data-highlighted", true);
      } else {
        element.removeAttribute("data-highlighted", true);
      }
    });
  }

  play() {
    // if (this.state.isInPauseCycle) return;
    if (this.state.isInPauseCycle) {
      this.state.isInPauseCycle = false;
      // if (this.audio.currentTime === 0 && this.textElements.length > 0) {
      //   const firstPlayhead = parseFloat(this.textElements[0].dataset.playhead);
      //   this.audio.currentTime = firstPlayhead;
      // }
      this.shadow();
    }
    this.audio.play();
    this._updateButtonState(true);
  }

  pause() {
    this.audio.pause();
    this._clearTimers();
    this._updateButtonState(false);
  }

  stop() {
    this.audio.pause();
    this.audio.removeEventListener("timeupdate", this._timeUpdateHandler);
    this._clearTimers();
    this._resetState();
    this._updateButtonState(false);
    this._disableSpecialModes();

    // Set currentTime to 0 or firstPlayhead if you want, but do it before clearing highlights
    // if (this.textElements.length > 0) {
    //   const firstPlayhead = parseFloat(this.textElements[0].dataset.playhead);
    //   this.audio.currentTime = firstPlayhead;
    // } else {
    //   this.audio.currentTime = 0;
    // }

    // Now clear all highlights
    this._clearHighlights();
  }

  togglePlayPause() {
    if (this.audio.paused) {
      if (this.audio.currentTime === 0 && this.textElements.length > 0) {
        const firstPlayhead = parseFloat(this.textElements[0].dataset.playhead);
        this.audio.currentTime = firstPlayhead;
      }
      this.play();
    } else {
      this.pause();
    }
  }

  toggleShadow() {
    this.state.isShadowMode = !this.state.isShadowMode;
    this.shadowButton.setAttribute("data-toggled", this.state.isShadowMode);
    // this._updateButtonState(this.state.isShadowMode);

    if (this.state.isShadowMode) {
      this.shadow();
    } else {
      // Clear any pending shadow timers
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this._clearTimers();
      this.state.isInPauseCycle = false;
      // Restore normal highlighting
      this.audio.removeEventListener("timeupdate", this._timeUpdateHandler); // Prevent duplicates
      this._setupAudioEvents(); // This will re-add the highlightspan handler
      // Optionally, update highlights immediately
      this.highlightspan();
    }
  }

  shadow() {
    console.log(this.state.isShadowMode);
    // this.shadowButton.setAttribute("data-toggled", this.state.isShadowMode);

    if (this.state.isInPauseCycle) return;

    const { span, spanPlayhead, spanDuration } = this._findCurrentSpan();

    this.play();
    if (this.state.isShadowMode) {
      this._startPlayPauseCycle(span, spanPlayhead, spanDuration);
    }
  }

  loop() {
    this.state.isLoopMode = !this.state.isLoopMode;
    console.log("this.state.isLoopMode", this.state.isLoopMode);
    this.loopButton.setAttribute("data-toggled", this.state.isLoopMode ? "true" : "false");
  }

  seekToElement(element) {
    const playheadTime = parseFloat(element.dataset.playhead);
    this.stop();
    this.audio.currentTime = playheadTime;
    this.play();
  }

  toggleSpeed() {
    this.state.isSlowSpeed = !this.state.isSlowSpeed;
    if (this.audio) {
      this.audio.playbackRate = this.state.isSlowSpeed ? 0.75 : 1.0;
    }
    this.speedButton.setAttribute("data-toggled", this.state.isSlowSpeed ? true : false);
  }

  // ------------- UTILITY METHODS -------------

  _handleAudioEnd() {
    console.log("ended!");
    this.textElements.forEach((element) => {
      element.removeAttribute("data-highlighted", true);
    });

    if (this.state.isLoopMode && this.textElements.length > 0) {
      const firstPlayhead = parseFloat(this.textElements[0].dataset.playhead);
      this.audio.currentTime = firstPlayhead;
      if (this.state.isShadowMode) {
        // Find the first span and its duration
        const firstSpan = this.textElements[0];
        const secondPlayhead = this.textElements[1] ? parseFloat(this.textElements[1].dataset.playhead) : this.audio.duration;
        const spanDuration = parseFloat((secondPlayhead - firstPlayhead).toFixed(2));
        this._startPlayPauseCycle(firstSpan, firstPlayhead, spanDuration);
      } else {
        this.play();
      }
    } else {
      this.stop();
    }

  }

  _updateButtonState(isPlaying) {
    if (isPlaying) {
      this.playPauseButton.setAttribute("data-playing", "true");
      this.playPauseButton.setAttribute("data-pressed", "true");
    } else {
      console.log("update button state");
      this.playPauseButton.setAttribute("data-playing", "false");
      this.playPauseButton.setAttribute("data-pressed", "false");
      this.speedButton.setAttribute("data-toggled", "false");
      this.shadowButton.setAttribute("data-toggled", "false");
      this.loopButton.setAttribute("data-toggled", "false");
    }
  }

  _clearTimers() {
    if (this.state.playTimer) clearTimeout(this.state.playTimer);
    if (this.state.pauseTimer) clearTimeout(this.state.pauseTimer);
  }

  _resetState() {
    this.state.isInPauseCycle = false;
    this.state.isShadowMode = false;
    this.state.isLoopMode = false;
  }

  _clearHighlights() {
    this.textElements.forEach((element) => {
      element.removeAttribute("data-highlighted", true);
    });
  }

  _disableSpecialModes() {
    this.audio.loop = false;
  }

  _findCurrentSpan() {
    const currentTime = this.audio.currentTime;
    let span = null;
    let spanPlayhead = null;
    let spanDuration = null;

    for (let i = 0; i < this.textElements.length; i++) {
      spanPlayhead = parseFloat(this.textElements[i].dataset.playhead);

      if (spanPlayhead <= currentTime) {
        span = this.textElements[i];
        const isLastSpan = i === this.textElements.length - 1;
        const nextspanPlayhead = isLastSpan ? this.audio.duration : parseFloat(this.textElements[i + 1].dataset.playhead);
        spanDuration = parseFloat((nextspanPlayhead - spanPlayhead).toFixed(2));
        if (isLastSpan) {
          spanPlayhead = this.audio.duration - 0.2;
        }
      } else {
        break;
      }
    }

    return { span, spanPlayhead, spanDuration };
  }

  _startPlayPauseCycle(el, playhead, duration) {
    if (this.state.isShadowMode) {
      this._clearTimers();
    }
    // If at the beginning, jump to first span's playhead
    if (this.audio.currentTime === 0 && this.textElements.length > 0) {
      const firstPlayhead = parseFloat(this.textElements[0].dataset.playhead);
      this.audio.currentTime = firstPlayhead;
    }

    if (this.audio.currentTime >= this.audio.duration - 0.5) {
      this.textElements.forEach((span) => span.removeAttribute("data-highlighted"));
      // this.audio.currentTime = 0;
      if (this.audio.currentTime === 0 && this.textElements.length > 0) {
        const firstPlayhead = parseFloat(this.textElements[0].dataset.playhead);
        this.audio.currentTime = firstPlayhead;
      }
      return;
    }
    this.state.isShadowMode = true;
    this.audio.pause();
    this.audio.removeEventListener("timeupdate", this._timeUpdateHandler);

    // const { span, spanPlayhead, spanDuration } = this.findCurrentSpan();

    if (el) {
      this.textElements.forEach((span) => {
        if (span !== el) {
          span.removeAttribute("data-highlighted");
        }
      });
      el.setAttribute("data-highlighted", true);
    }
    const playTimer = () => {
      if (!this.state.isShadowMode) {
        this.audio.removeEventListener("timeupdate", playTimer);
        return;
      }
      if (playhead !== null && this.audio.currentTime > playhead) {
        this.audio.pause();
        this.audio.removeEventListener("timeupdate", playTimer);

        const delay = Math.round(duration * 1000);
        this.timer = setTimeout(() => {
          this.shadow();
        }, delay);
      }
    };

    this.audio.addEventListener("timeupdate", playTimer);
    this.audio.play();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-readaloud-player]").forEach((container) => {
    new TextAudioSync(container);
  });
});
