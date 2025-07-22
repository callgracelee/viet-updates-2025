# VIET-EBOOK-WORKFLOW

This document is written in markdown. Use a markdown viewer for the best reading experience. If you opened the project in VSCode, [there is a built-in markdown preview](https://code.visualstudio.com/docs/languages/markdown#_markdown-preview).

- [Getting started](#getting-started)
  - [Prerequesites](#prerequesites)
    - [Required](#required)
    - [(Optional)](#-optional-)
  - [Installing project dependencies](#installing-project-dependencies)
- [Media](#media)
  - [Images](#images)
  - [Audio](#audio)
  - [Fonts](#fonts)
- [Project-Specific Data](#project-specific-data)
  - [metadata.json](#metadatajson)
  - [readaloud-annotator.json](#readaloud-annotatorjson)
  - [frontmatterPages.json](#frontmatterpagesjson)
  - [backmatterPages.json](#backmatterpagesjson)
  - [compoundWords.json](#compoundwordsjson)
  - [generated](#generated)
- [Editing generated data with the editor interface](#editing-generated-data-with-the-editor-interface)
- [Updating data manually](#updating-data-manually)
- [Restoring data from a backup](#restoring-data-from-a-backup)
- [Building and Previewing the EPUB](#building-and-previewing-the-epub)
  - [Build `build.epub` and view it in Readium on a development server in a new browser tab:](#build--buildepub--and-view-it-in-readium-on-a-development-server-in-a-new-browser-tab-)
  - [Explore the EPUB files in `build.epub`](#explore-the-epub-files-in--buildepub-)
  - [Build and compress the EPUB](#build-and-compress-the-epub)
- [Development](#development)
  - [Exporting and sharing the workflow or project files](#exporting-and-sharing-the-workflow-or-project-files)
    - [workflow](#workflow)
    - [project-files](#project-files)
  - [Editing the editor](#editing-the-editor)
    - [Resources:](#resources-)
  - [Tutorial: Adding a custom font](#tutorial--adding-a-custom-font)
    - [See also:](#see-also-)
  - [Tutorial: Adding a frontmatter page](#tutorial--adding-a-frontmatter-page)
  - [Advanced Tutorial: Adding a custom lesson page](#advanced-tutorial--adding-a-custom-lesson-page)
    - [Understanding updateBook](#understanding-updatebook)
    - [Adding the new page object](#adding-the-new-page-object)
    - [Creating the page template](#creating-the-page-template)
    - [Note](#note)
    - [Resources](#resources)
  - [Advanced Tutorial: Adding a custom exercise type](#advanced-tutorial--adding-a-custom-exercise-type)
    - [Steps](#steps)
    - [Understanding how the exercise type object](#understanding-how-the-exercise-type-object)
    - [Understanding how the type gets merged with the defaultType](#understanding-how-the-type-gets-merged-with-the-defaulttype)
    - [Example](#example)

## Getting started

### Prerequesites

#### Required

- Node (developed with v10.x, but other newer versions should work fine too)
  - Checking your Node version (in the command line):
    ```bash
    node --version
    # v10.7.0
    ```
  - If you installed Node with [Homebrew](https://brew.sh/), you can update to the latest version like this:
    ```bash
        brew update
        brew upgrade node
    ```

#### (Optional)

- To follow along with the batch image resizing doc (image_import/README.md), you need to install [imagemagick](https://imagemagick.org/index.php):
  ```bash
  brew install imagemagick
  ```

### Installing project dependencies

After unzipping the project directory, run the setup command once to install all dependencies and rebuild the editor frontend:

```bash
    npm run setup
```

This will create a `node_modules` directory in the root folder as well as one in the submodule `config/editor/frontend` folder

## Media

Supported filetypes and their associated mimetypes can be found and changed in the array `EXTENSIONS_MAP` in `config/constants.js`

### Images

- Refer to instructions in `image_import/README.md` for batch resizing images
- You may also want to optimize images; one free tool for OSX is [ImageOptim](https://imageoptim.com/mac)
- Copy and paste or move all resized/optimized images you may need to the `src/media` directory
- There is no required naming convention for images
- This workflow does not perform any image optimization

### Audio

- All audio files you may want to use for the project should be located in the `src/media`
- The page/exercise templates construct the path to the audio file paths from context (the lesson number, whether it's an exercise or readaloud, or from the vocab item index). Therefore, it's important to adhere to the file naming conventions documented in `audio_import/README.md`.

- For convenience, the following steps will automatically rename and extract all audio files into the `media` directory:

  - Download the directories of audio files from Google Drive as .zip files
  - Copy or move the .zip files into the `audio_import` directory
  - Run the following script in the command line:

    ```bash
        npm run audio:import
    ```

- For more detailed instructions, see `audio_import/README.md` for importing audio

### Fonts

You may also include fonts in the `src/media` directory. These will be automatically copied to the build if they are referenced anywhere in the source code.

See [Tutorial: Adding a custom font](#tutorial--adding-a-custom-font) for more information

## Project-Specific Data

Each ebook created with this workflow will have different project-specific data (for instance: the EPUB name, the book title, the cover image and description, the compound words list, the readaloud data, etc.).

Rather than hardcoding all of this information into the templates, it's been separated out into different `.json` files located in `src/data` that get read by the editor as well as the process that builds the EPUB:

```txt
src/data
├── backmatterPages.json
├── compoundWords.json
├── frontmatterPages.json
├── generated
│   ├── lessons.json
│   └── pages.json
├── metadata.json
└── readaloud-annotator.json
```

You should not remove or rename any of these files. If you want to remove the data that's inside of them. Save the file with an empty `[]` or `{}` so that it is still a valid `JSON` file:

```json
[]
```

- Follow [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) conventions when editing the files. The format is very similar to JavaScript objects, but has some minor but important differences.

### metadata.json

At a minimum, you should change the values for the following fields:

- name
- title
- cover.src
- cover.description

### readaloud-annotator.json

Replace this with the file of the same name generated by the annotator tool.

### frontmatterPages.json

- Some data required for generating the frontmatter pages (and including them in the TOC, etc.) of the original project is hardcoded in this file. You probably don't need to change it.

- Each object in this array represents a frontmatter page.
- You can change the order that these pages appear in by changing the order of the objects.
- You can remove any of the pages by deleting the object corresponding to that page.
- You can add a page to the frontmatter by adding an object with the same format as the others.
  - Be sure that the value of the `template` field corresponds with a filename in `src/pages`
  - Any data that you add to the `data` object can be consumed by the templates with pug interpolation. Be careful not to unintentionally override any existing variable names that are already being used by that template or its enclosing layout template.

### backmatterPages.json

- Empty by default
- Processed in the same way as `frontmatterPages.json` but any pages named here will be generated at the end of the book, after `zAnswers.xhtml` (the answer key) and any dialogue pages.

### compoundWords.json

- An array of compound words, consumed by the editor for automatically identifying them from text.
- This may not be required, since the preferred method of processing the compound words will be to use source text with a delimiter wrapping around each compound word, provided by the Vietnamese team.

### generated

- `pages.json` is the data generated by the editor when you click the `UDATE BOOK` button; this is the primary data file that contains all the necessary data to build the inner pages of the ebook
- `lessons.json` is the data generated by the editor whenever you save a lesson; this data is used to build `pages.json`
- Since these are both generated files, it is probably best not to touch them, as they will be overwritten any time you use the editor. However, in some cases, such as an error that causes the data to become corrupt or if you mistakenly delete something, you may want to restore from a backup. See [Restoring from a backup](#restoring-from-a-backup) below for more details.

## Editing generated data with the editor interface

- Once you have completed the previous steps of setting up the project and copying any necessary media and data, you can run the editor with the following command:

```bash
    npm run editor
```

The backend server will start on [http://localhost:4000/](http://localhost:4000/) and once it's ready, the http-server will start on [http://localhost:8080/](http://localhost:8080/), launching the Lesson Builder in a new tab of your default browser.

You can exit the server at any time, by typing <kbd>Control</kbd>+<kbd>c</kbd> in the terminal.

In most cases, you should probably exit the server before running any other commands. Always, ensure that your work is saved before exiting the server process.

## Updating data manually

Using the editor interface should make it easier to work on one lesson or one exercise at a time. But sometimes you may want to edit the data directly, for instance, if you want to perform a find & replace on all the lesson data.

To do this, you can edit `src/data/generated/lessons.json` in your text editor of choice. JSON rules are strict, so be careful to avoid syntax errors. Also, make sure to rebuild `src/data/generated/pages.json` after making changes to the lessons data. You can do this in one of two ways:

- Restart the editor and click the `UPDATE BOOK` button
  or
- Stop any other processes and run the following command:

```bash
npm run pages:rebuild
```

## Restoring data from a backup

- Each time you save a lesson in the editor, `lessons.json` is replaced with the latest data. The old data is saved to `config/backup/lessons-<date>.json`
- Each time you press the the `UPDATE BOOK` button in the editor, `pages.json` is recompiled from `lessons.json`. The old data is saved to `config/backup/pages-<date>.json`

If you made a mistake or the data has become corrupt (causing an error message in the editor), replace `lessons.json` with the data from an earlier version. Then, re-run the editor, and click the `UPDATE BOOK` button to recompile `pages.json`.

## Building and Previewing the EPUB

Building the book involves the following tasks:

- reading the data files
- compiling all the xhtml pages from the data and pug templates
- compiling all CSS from `src/css/styles.less`
- compiling all JS from ES modules
- parsing the compiled XHTML, CSS, and JS files for asset references, and storing these references for the manifest
- building `build.epub/OEBPS/content.opf` from the data (including the assets data) and pug template
- copying all assets in `src/media` that were also in the manifest

Depending on the size of the book (assets and total pages), this process can take a while.

### Build `build.epub` and view it in Readium on a development server in a new browser tab:

```bash
npm run dev
```

- Changes you make to your src files will cause the book to automatically rebuild and refresh in the browser.

  - The entire book will be rebuilt
  - This can take a while depending on the size of the book.

- A faster alternative is to only build a single lesson or a range of lessons at a time. Here are some examples:

Only build lesson 1:

```bash
npm run dev -- --lessons=1
```

Only build lessons 3-5:

```bash
npm run dev -- --lessons=3-5
```

- Note: the extra `--` before the `--lessons` flag is a convention for passing custom commands to a Gulp process.

### Explore the EPUB files in `build.epub`

To simply build or rebuild `build.epub` without running the development server:

```bash
npm run build
```

- A faster alternative is to only build a single lesson or a range of lessons at a time. Here are some examples:

Only build lesson 5:

```bash
npm run build -- --lessons=5
```

Only build lessons 6-7:

```bash
npm run build -- --lessons=6-7
```

### Build and compress the EPUB

```bash
npm run publish

#or with the timestamp

npm run publish -- --date
```

- The compressed EPUB will be saved in the `dist` directory

* A faster alternative is to only build a single lesson or a range of lessons at a time. Here are some examples:

Only publish lesson 2:

```bash
npm run publish -- --lessons=2
```

Only publish lessons 12-25:

```bash
npm run publish -- --date --lessons=12-25
```

## Development

### Exporting and sharing the workflow or project files

- For your convenience, you can use the following command to automate the export steps:
  ```bash
  npm run export
  ```
- Answer the questions in the terminal or tap <kbd>return</kbd> to use the default answer (which typically appears after the prompt message)
- Choose what you want to export: either workflow or project-files

#### workflow

- Choose if you want to update the workflow to reuse it for another project or send it to another device (via airdrop or email).
- Commits all changes (recursively, including the submodule) and clones the repository to a new project (which will remove the `node_modules` directories).
- This will perform all these tasks, including cloning the repo into the directory you specify after running the script.
- This will only package the workflow, including all the templates and scripts, but not any media or data you may have added or generated with the editor specific to a single project.
- You can optionally zip the cloned project for easy transport and sharing.

#### project-files

The `src` directory contains all of the project-specific files and data necessary to build your EPUB.

- This option will copy all of your source (`src`) files into a new directory within the directory you specify after running the script.
- You can then copy the exported directory into a new project.
- You can optionally zip the cloned folder for easy transport and sharing.

### Editing the editor

To launch the editor in development, use the following command.

```bash
npm run editor:dev
```

As you make changes in `config/editor/frontend`, the changes will hotreload in the browser.

If you make changes to `config/editor/backend`, you will need to rerun the command above.

Keep in mind that as you're developing the editor, it will alter the real data in `src/data/generated`, so you may want to do development work in a fresh clone (`npm run export`) with test data loaded into `src/data/generated`.

Once you've completed making changes to the editor code in development mode, run the following command to update the production editor used in the workflow:

```
npm run editor:rebuild
```

Now, when you run the editor in production with `npm run editor`, you should see the latest version including any changes you made. You may need to refresh or hard refresh the first time, though.

#### Resources:

- [create-react-app docs](https://create-react-app.dev/)
- [react docs](https://reactjs.org/docs/getting-started.html)
- [material-ui docs](https://material-ui.com)

### Tutorial: Adding a custom font

- Download [Alegreya](https://fonts.google.com/specimen/Alegreya?selection.family=Alegreya) from Google Fonts.
- Unzip it and copy the font files you need into `src/media`

```txt
src/media
├── Alegreya-Bold.ttf
├── Alegreya-BoldItalic.ttf
├── Alegreya-Regular.ttf
├── Alegreya-RegularItalic.ttf
```

- Add the font-face rule as you would normally

```less
/**
 *
 * src/css/global.less
 *
 */

@font-face {
  font-family: 'Alegreya';
  src: url('../media/Alegreya-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Alegreya';
  src: url('../media/Alegreya-RegularItalic.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
}
@font-face {
  font-family: 'Alegreya';
  src: url('../media/Alegreya-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'Alegreya';
  src: url('../media/Alegreya-BoldItalic.ttf') format('truetype');
  font-weight: bold;
  font-style: italic;
}

body {
  font-family: 'Alegreya', serif;
}
```

- the fonts will be automatically added to `content.opf` as part of the build process

#### See also:

- [Vietnamese font recommendations](https://vietnamesetypography.com/type-recommendations/)

### Tutorial: Adding a frontmatter page

- Open `src/data/frontmatterPages.json` and add an object to the array:

```json
{
  "id": "a006_note2.xhtml",
  "type": "frontmatter",
  "template": "Note2",
  "data": {
    "title": "Note 2",
    "customNote2Field": "Hello World!"
  }
}
```

- Create a template for it in `src/pages`

```pug
extends ../templates/layout
append variables
    - var classes = 'note2'
    - var epubTypes = ['frontmatter']
block content
    header
        h1=title
    section
        p Note 2 text
        p=customNote2Field
```

### Advanced Tutorial: Adding a custom lesson page

If the project requirements change over time, and you need to add another type of page to each lesson, you will need to create a page template for it in `src/pages` as well as adjust the source code in `config/editor/backend/model/Pages.js`.

#### Understanding updateBook

`PagesModel.updateBook` (in `config/editor/backend/model/Pages.js`) uses custom logic to convert `src/data/generated/lessons.json` along with any other data from `src/data/generated` into `src/data/generated/pages.json`. It is a bit verbose and may be difficult to follow. But these are the steps:

- Store frontmatter and backmatter page data from `src/data`
- Store the latest lesons data from `src/data/generated/lessons.json`
- Loop through each lesson in the lessons data
  - Create a titlepage object, which sets the template (the filename not including the extension of a pug file in `src/pages`), and provides all the data the template needs to render in the `data` object (any of the keys of this object can be reference directly in the template); the `lessonId` and `lessonTitle` are also passed into the `data` object (for each of these lesson page objects)
  - Create objects for Listening Comprehension 1 and Listening Comprehension 2, including the exercises for each of these in the data
  - Create objects for Reading Comprehension, including the readaloud data in `data.readalouds`
  - Create an object for Reading Exercises, including the reading exercises in `data.readingExercises`
  - Create an object for the Vocabulary page, including the vocab data in `data.vocabulary`
  - Add `data.sections` to the titelpage object, which is an array of the titles and ids for all lesson page objects used for creating the navigation on the lesson title page
  - Create objects for each dialogue in the lesson, pushing it into an array outside of the current loop, so that all the dialogues can be stored together and added to the end of the book
  - Create an object for the answers, parsing them from each lesson page with exercises, and pushing the final object to an array outside of the current loop, so that all the answers can be stored together and added to the end of the book
  - Finally, combine the lesson page objects into a single array and return an array of these arrays which represent all the lesson pages
- Create an answersPage page object that includes all the answer data for each lesson in a single array `data.lessons` which was compiled during the loop
- Combine all the book pages into a single array of objects, `updatedPages`, by spreading them in order
- Then passing this array of page objects to the `save` method copies the old data to a backup file and writes the new data to `src/data/generated/pages.json`

#### Adding the new page object

- Create a new object inside of the anonymous function in `lessons.reduce`:
  - The `id` refers to the output xhtml filename; it must include the `.xhtml` extension
  - The `title` is used to construct the `pageTitle` variable in `src/templates/layout.pug`, which is referenced in the layout template used to compile every page (`src/templates/layout.pug`)
  - The `template` can be the filename (without the extension) of any pug template in `src/pages`
  - The `type` value should always be set to `bodymatter` for a lesson page
  - `data.lessonId` should always be set to `lesson.lessonId`
  - `data.lessonTitle` should always be set to `lesson.lessonTitle`
  - You may add any other fields to `data` that you want to be available to the template for this lesson page

```js
const newPage = {
  id: `L${lesson.lessonId}_007_newPage.xhtml`,
  title: 'New Page',
  template: 'NewPage',
  type: 'bodymatter',
  data: {
    lessonId: lesson.lessonId,
    lessonTitle: lesson.lessonTitle,
    newPageField: 'hello'
  }
};
```

- To add the page to the navigation on the lesson title page, include a reference to it in the sections array (order matters):

```js
// adding newPage after vocab
const sections = [listening1, listening2, reading1, vocab, newPage];
```

- Note: If the page has any exercises, be sure to include it in the `lessonAnswers` object, still inside `lessons.reduce`.

- Add the reference to the page to `updatedAcc` (order matters):

```js
const updatedAcc = [
  ...acc,
  titlepage,
  listening1,
  listening2,
  reading1,
  reading2,
  vocab,
  newPage
];
```

#### Creating the page template

- Start by duplicating a simple page template like `About.pug` in `src/pages`, renaming it to the template name specified in the page object:

```pug
//- src/pages/NewPage.pug
extends ../templates/layout
append variables
    - var classes = 'about'
    - var epubTypes = ['frontmatter']
block content
    header
        h1 About FSI
    section
        p Established in 1947.....
```

- Update `var classes` to add a custom css classname that only applies to this page template:

```pug
//- src/pages/NewPage.pug
extends ../templates/layout
append variables
    - var classes = 'newPage'
    - var epubTypes = ['frontmatter']
block content
    header
        h1 About FSI
    section
        p Established in 1947.....
```

- You can access any variable that you made available in the new page object `data` object. You also have access to some global variables defined in `src/templates/variables.pug`:

```js
//- src/pages/NewPage.pug
extends ../templates/layout
append variables
    - var classes = 'newPage'
    - var epubTypes = ['frontmatter']
block content
    header
        h1 #{newPageField} World!
    section
        p #{pageTitle} content.
```

- NOTE: To add scripts, use the `append scripts` block as in `src/pages/ListeningComprehension.pug` or `src/pages/Vocabulary.pug` and other files with interactivity

- Lastly, you need to update `src/data/generated/pages.json` before the new page will appear in the build:

```bash
npm run pages:rebuild
```

- Run a dev build to view the new page

```bash
npm run dev
```

In `build.epub`, you should see something like this for each lesson:

```html
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:epub="http://www.idpf.org/2007/ops"
  xml:lang="en-US"
  lang="en-US"
>
  <head>
    <meta charset="utf-8" />
    <title>Bài 1: New Page</title>
    <link type="text/css" href="../css/styles.css" rel="stylesheet" />
  </head>
  <body data-js="false">
    <section class="page newPage" epub:type="frontmatter">
      <header><h1>hello World!</h1></header>
      <section><p>Bài 1: New Page content.</p></section>
    </section>
  </body>
</html>
```

#### Note

The steps above assume that you want to create a new lesson page using existing data.

If you want to create new data fields in the editor for this new lesson page, you'll also need to update the following:

- `type Lesson` and `input LessonInput` in `config/editor/backend/typeDefs.js`
- `config/editor/frontend/src/pages/New.js`

Updating these is not all that difficult but outside the scope of this document. You'll want to have a basic understanding of GraphQL types and React.

#### Resources

- [GraphQL Schemas and Types](https://graphql.org/learn/schema/)
- [Pug Language Reference](https://pugjs.org/language/attributes.html)

### Advanced Tutorial: Adding a custom exercise type

#### Steps

1. Create a new exercise type in `src/scripts/components/Quiz/ExerciseTypes`.
2. Import it to `src/scripts/components/Quiz/ExerciseTypes/ExerciseTypes.js` and define it in export types object
3. Add any custom logic for parsing the answer key in `getAnswers` function in `config/editor/backend/lib.js`. The default behavior expects the answer key is a comma-separated list of indexes, and it will get the text from the answer inputs at those indexes.
4. Add the type to `config/editor/frontend/src/exerciseTypes.js` to make it available in the dropdown in the editor.
5. Some of the exercise types have custom styles. This is a good strategy for new question types to avoid overriding existing styles for other question types. Follow the `compound-words` example in `src/css/modules/exercise.less`:

```less
.exercise {
  &[data-type='compound-words'] [data-input='true'] {
    background: transparent;
    background-image: none;
    transition: background-image 0.5s ease-in 2s;
  }
}
```

#### Understanding how the exercise type object

Each exercise type is a state machine object. It may be helpful to start with the following reading: [The Rise Of The State Machines](https://www.smashingmagazine.com/2018/01/rise-state-machines/), which was influential for this script.

New exercise types should always be merged with the default type `src/scripts/components/Quiz/ExerciseTypes/defaultType.js` to ensure that the core properties are always included. These properties inlcude:

- `before(){}`: an optional method that is executed from the constructor of the `Exercise` class before state is set or any event listeners are registered. This is a good place to set new methods or properties that can be used throughout the transitions of the exercise type.
- `reset(){}`: a required method that tells the program how to return the exercise to its initial state
- `compare(){}`: a required method that tells the program how to compare the answer key in the html with the user's response, which is stored in the exercise state and in `localStorage`
- `getResponseKey(){}`: an required method that is used by the defaultType to format the response key stored in state / local storage into its preferred form for comparison
- `components`: an object of components to used throughout the exercise, where the key is the name of the component and the value is the selector (used inside of `querySelectorAll()` query). You can use any selector that you would normally use in `document.querySelectorAll` here to store a nodelist of html elements under one reuseable name throughout the exercise.
  - HINT: to access the elements for a component named `answer-inputs`, use `this.components['answer-inputs'].nodes`. The actual HTML elements are `this.components['answer-inputs'].nodes[0]` and `this.components['answer-inputs'].nodes[1]`, etc.
- `transitions`: an object of states that describe how the exercise should look in all of its possible states
  - There are fininite number of possible states; each of these states or "transitions" describe exactly how all the registered components should behave including setting any properties and how they should handle events
  - Each element for each component registered in `components` will be iterated over each time the state is set to one of the possible states or "transitions". If the selector used to register `answer-inputs` selects 5 different HTML elements, all 5 elements will be iterated over.
  - The top-level element that wraps the exercise will also be available with the `exercise` key
  - When an element is iterated over, it will execute whatever is in the component's `effects(){}` hook for the current transition. The `effects` hook will always be called with two arguments: the current element, and the index of that element in relation to the other elements returned by the component's querySelector.
  - It will also register any event handlers included in the `handlers`. Here you can use any JavaScript event handlers that you would pass to `HTMLElement.addEventListener`. The callback you provide will be called with two arguments: the current element, and the index of that element in relation to the other elements returned by the component's querySelector. '

#### Understanding how the type gets merged with the defaultType

All the exercise types are registered in `src/scripts/components/Quiz/ExerciseTypes/ExerciseTypes.js`, which looks like this:

```js
import { merge } from 'lodash-es';
import { defaultType } from './defaultType';
import { WriteIn } from './WriteIn';
import { FindPattern } from './FindPattern';
import { WordOrder } from './WordOrder';
import { SelectOne } from './SelectOne';
import { SelectManyTrueOrFalse } from './SelectManyTrueOrFalse';

/* =============================================
=            UI: All Available Types            =
============================================= */

export const types = {
  // 1. select-many, alias: multiple-choice
  'select-many': merge({}, defaultType, {}),
  'multiple-choice': merge({}, defaultType, {}),
  // 2. select-one
  'select-one': merge({}, defaultType, SelectOne),
  // 3. true-or-false, alias: select-many-true-or-false
  'true-or-false': merge({}, defaultType, SelectManyTrueOrFalse),
  'select-many-true-or-false': merge({}, defaultType, SelectManyTrueOrFalse),
  // 4. find-pattern, alias: compound-words
  'find-pattern': merge({}, defaultType, FindPattern),
  'compound-words': merge({}, defaultType, FindPattern),
  // 5. fill-in-the-blank, alias: word-order
  'fill-in-the-blank': merge({}, defaultType, WordOrder),
  'word-order': merge({}, defaultType, WordOrder),
  // 6. write-in
  'write-in': merge({}, defaultType, WriteIn)
};

export { defaultType };
```

The `merge` function takes a series of objects and deep merges them on to eachother from right to left, finally returning the left-most object.

This is an inheritance model works kind of like `CSS` cascade, where later properties will override those that appear earlier.

#### Example

Suppose you want to create a new type called `select-two` in which the user is allowed to select no more than 2 answer-inputs. It is similar to `select-many` which is an exact copy of the `defaultType`. The only thing we would want to override is the `answer-inputs` click handler in the `INTIAL` transition.

We could start by copying this into the new object:

```js
export const SelectTwo = {
  transitions: {
    INITIAL: {
      handlers: {
        'answer-inputs': {
          click(e, targetIndex) {
            const responses = [].concat(this.state.responses);
            const matchingIndex = responses.indexOf(targetIndex);
            // if it does not exist in responses
            if (matchingIndex === -1) {
              responses.push(targetIndex);
            } else {
              // if it already exists in responses
              responses.splice(matchingIndex, 1);
            }
            this.setState({
              name: 'TOUCHED',
              responses
            });
          }
        }
      }
    }
  }
};
```

- Now let's only add the new response to state if there are less than 2 responses.

```js
export const SelectTwo = {
  transitions: {
    INITIAL: {
      'answer-inputs': {
        handlers: {
          click(e, targetIndex) {
            const responses = [].concat(this.state.responses);
            const matchingIndex = responses.indexOf(targetIndex);
            // if it does not exist in responses
            if (matchingIndex === -1) {
              // responses.length is less than 2
              if (responses.length < 2) {
                responses.push(targetIndex);
              } else {
                // do nothing
              }
            } else {
              // if it already exists in responses
              responses.splice(matchingIndex, 1);
            }
            this.setState({
              name: 'TOUCHED',
              responses
            });
          }
        }
      }
    }
  }
};
```

- All other properties will be inherited from the `defaultType`
- Import this type and register it in `src/scripts/components/Quiz/ExerciseTypes/ExerciseTypes.js`:

```js
import { merge } from 'lodash-es';
import { defaultType } from './defaultType';
import { WriteIn } from './WriteIn';
import { FindPattern } from './FindPattern';
import { WordOrder } from './WordOrder';
import { SelectOne } from './SelectOne';
import { SelectManyTrueOrFalse } from './SelectManyTrueOrFalse';
import { SelectTwo } from './SelectTwo';

/* =============================================
=            UI: All Available Types            =
============================================= */

export const types = {
  // 1. select-many, alias: multiple-choice
  'select-many': merge({}, defaultType, {}),
  'multiple-choice': merge({}, defaultType, {}),
  // 2. select-one
  'select-one': merge({}, defaultType, SelectOne),
  // 3. true-or-false, alias: select-many-true-or-false
  'true-or-false': merge({}, defaultType, SelectManyTrueOrFalse),
  'select-many-true-or-false': merge({}, defaultType, SelectManyTrueOrFalse),
  // 4. find-pattern, alias: compound-words
  'find-pattern': merge({}, defaultType, FindPattern),
  'compound-words': merge({}, defaultType, FindPattern),
  // 5. fill-in-the-blank, alias: word-order
  'fill-in-the-blank': merge({}, defaultType, WordOrder),
  'word-order': merge({}, defaultType, WordOrder),
  // 6. write-in
  'write-in': merge({}, defaultType, WriteIn),
  // 7. select-two
  'select-two': merge({}, defaultType, SelectTwo)
};

export { defaultType };

/* =====  End of All Available Types  ====== */
```

- Next, update `src/templates/mixins.pug`. Since the template for this should be the same as `select-many`, you can just add `when 'select-two'` to the `case type` switch right after `when 'select-many'`:

```pug
case type
    when 'multiple-choice'
    when 'select-many'
    when 'select-two'
        - var exerciseEpubType = 'multiple-choice-problem'
        .exercise__inputs
            each choice in choices
                if choice.img
                    button(data-input="true")
                        img(src="../" + choice.img alt=choice.text)/
                else
                    button(data-input="true")=choice.text
```

- Then, add `select-two` to `config/editor/frontend/src/exerciseTypes.js` to register it in the editor

- You may want to run `npm run editor:dev` to preview the editor on a development server..

- You should be able to create a `select-two` type in the exercise builder

- Rebuild the production editor with `npm run editor:rebuild`

- The last step is to update how the answers for `select-two` type questions get compiled in the answer sheet:

  - Open `config/editor/backend/lib.js` and add a case to the `getAnswers` function if necessary. However, this is not necessary for this example as the default case is the same for `select-many` type questions and will work fine for this one too:

  ```js
  exports.getAnswers = function(exercise) {
    switch (exercise.type) {
      case 'true-or-false':
        return exercise.answer
          .split(',')
          .map(answer =>
            answer % 2 === 0 ? exercise.trueLabel : exercise.falseLabel
          );
      case 'compound-words' || 'find-pattern':
        return exercise.compoundWordsHtml.answer.split(',');
      case 'write-in':
        return exercise.answer;
      default:
        return exercise.answer
          .split(',')
          .map(a => (exercise.choices[a] ? exercise.choices[a].text : ''));
    }
  };
  ```
