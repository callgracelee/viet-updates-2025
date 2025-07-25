module.exports = `input DataInput{
  title: String
}

input PageInput{
  id: String!
  name: String
  template: String!
  lessonId: Int
  data: DataInput
}

type PageData{
  title: String
}

type Page{
  id: String!
  name: String
  template: String
  lessonId: Int
  data: PageData
}

type LessonImage{
  relativePath: String
  filename: String
}

input LessonImageInput{
  relativePath: String
  filename: String
}

type Dialouge{
  source: String
  id: String
  title: String
  list: [[String]]
}

input DialougeInput{
      source: String
  id: String
  title: String
  list: [[String]]
}

type ResourceLinks{
  dialogue1: Boolean
  dialogue2: Boolean
  reading: Boolean
}

input ResourceLinksInput{
  dialogue1: Boolean
  dialogue2: Boolean
  reading: Boolean
}

type FillInPreviewArea{
  source: String
  html: String
}

input FillInPreviewAreaInput{
  source: String
  html: String
}

type CompoundWordsHtml{
  source: String
  html: String
  answer: String
}

input CompoundWordsHtmlInput{
  source: String
  html: String
  answer: String
}

type Choice{
  text: String
  answer: String 
  img: String
  textChoices: [String] 
  source: String
  html: String
  subText: String
}

input ChoiceInput{
  text: String
  answer: String 
  img: String
  textChoices: [String] 
  source: String
  html: String
  subText: String 
}

type Exercise{
  type: String
  title: String
  section: String
  instructions: String
  prompt: String
  resourceLinks: ResourceLinks
  audioPlayer: String
  choices: [Choice]
  answer: String
  fillInPreviewArea: FillInPreviewArea
  compoundWordsHtml: [CompoundWordsHtml]
  trueLabel: String
  falseLabel: String
  youtubeLink: String
  subText: String
}

input ExerciseInput{
  type: String
  title: String
  section: String
  instructions: String
  prompt: String
  resourceLinks: ResourceLinksInput
  audioPlayer: String
  choices: [ChoiceInput]
  answer: String
  fillInPreviewArea: FillInPreviewAreaInput
  compoundWordsHtml: [CompoundWordsHtmlInput]
  trueLabel: String
  falseLabel: String
  youtubeLink: String
  subText: String 
}

type Readaloud{
  html: String
  title: String
  id: String
}

input ReadaloudInput{
  html: String
  title: String
  id: String
}

type Vocabulary{
  source: String
  list: [[String]]
}

input VocabularyInput{
      source: String
  list: [[String]]
}

type Lesson{
  lessonId: Int!
  lessonTitle: String
  lessonImage: LessonImage
  lessonImageDescription: String
  listeningObjectives: [String]
  readingObjectives: [String]
  dialogues: [Dialouge]
  listeningExercises: [Exercise]
  listeningExercises1: [Exercise]
  listeningExercises2: [Exercise]
  readingExercises: [Exercise]
  readalouds: [Readaloud]
  dialogueBasedOnReading: [Readaloud]
  vocabulary: Vocabulary
  
}

input LessonInput{
  lessonId: Int!
  lessonTitle: String
  lessonImage: LessonImageInput
  lessonImageDescription: String
  listeningObjectives: [String]
  readingObjectives: [String]
  dialogues: [DialougeInput]
  listeningExercises: [ExerciseInput]
  listeningExercises1: [ExerciseInput]
  listeningExercises2: [ExerciseInput]
  readingExercises: [ExerciseInput]
  readalouds: [ReadaloudInput]
  dialogueBasedOnReading: [ReadaloudInput]
  vocabulary: VocabularyInput
}

type ReadaloudHTML{
  id: String!
  html: String!
}

type Image{
  absolutePath: String
  relativePath: String
  base64: String
  filename: String
}

type Query{
  lessons: [Lesson]
  images: [Image]
  readalouds: [ReadaloudHTML]
  compoundWords: [String]
}

type Mutation{
  updateLessons(input:LessonInput): [Lesson],
  deleteLesson(lessonId:Int!): [Lesson],
  updateBook: [Page],
  save: [Page]
}`;
