# audio_import

A way to quickly extract and rename the audio files.

- From within Google Drive, right click on the 'Audio Vocab' and 'Audio Dialogue and Reading' directories and choose 'Download'.
- Move the downloaded .zip file(s) into this directory (audio_import)
- Run the following command in the terminal:

```bash
npm run audio:import
```

- All MP3s from the zipped archives should be extracted to the src/media directory with template-ready filenames.

## Audio Vocab

- Expects a directory and filename in the following format: Lesson 23/10 ke ca.mp3
- Returns a filename in the following format: L23V10.mp3
- The template where this filename is coded is located here: src/pages/Vocabulary.pug

## Audio Dialouge and Reading

- Expects a filename in the following format: Lesson 05 - Reading 1N.mp3
- Returns a filename in the following format: L5reading1n.mp3
- The templates where this filename is coded are located here: src/pages/ReadingComprehension.pug for the readalouds and src/templates/mixins.pug (mixin exercise, dialogueAudioHref) for the exercises
