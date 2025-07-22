import { AudioPlayer } from './components/AudioPlayer';

document
  .querySelectorAll('[data-audio-player]')
  .forEach(el => new AudioPlayer(el));
