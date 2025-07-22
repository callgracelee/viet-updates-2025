import React from 'react';
import { TextField } from '@material-ui/core';

export default function LessonTitle({ lessonTitle, setLessonTitle }) {
  return (
    <TextField
      value={lessonTitle}
      onChange={setLessonTitle}
      label="Lesson Title"
      fullWidth
      autoFocus
    />
  );
}
