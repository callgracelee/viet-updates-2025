import React from 'react';
import { TextField } from '@material-ui/core';

export default function LessonId({ lessonId, setLessonId }) {
  return (
    <>
      <TextField
        value={lessonId}
        onChange={setLessonId}
        label="Lesson Number"
        type="number"
      />
    </>
  );
}
