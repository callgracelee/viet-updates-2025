import React, { useState } from "react";
import omit from "omit-deep-lodash";
import { withRouter, Prompt } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

import Layout from "../components/Layout";
import TitlePageImage from "../components/NewLessonForm/TitlepageImageEditor/TitlepageImage";
import ImageDescription from "../components/NewLessonForm//TitlepageImageEditor/TitlepageImageDescription";
import LessonId from "../components/NewLessonForm/LessonId";
import LessonTitle from "../components/NewLessonForm/LessonTitle";
import ObjectivesEditor from "../components/NewLessonForm/ObjectivesEditor/ObjectivesEditor";
import ExerciseBuilder from "../components/NewLessonForm/ExerciseBuilder/ExerciseBuilder";
import ReadaloudEditor from "../components/NewLessonForm/ReadaloudEditor/ReadaloudEditor";
import VocabularyEditor from "../components/NewLessonForm/VocabularyEditor/VocabularyEditor";
import DialogueEditor from "../components/NewLessonForm/DialogueEditor/DialogueEditor";

const UPDATE_LESSONS = gql`
  mutation updateLessons($input: LessonInput) {
    updateLessons(input: $input) {
      lessonId
    }
  }
`;

function New({ lessons, history, match, refetchLessons }) {
  const [updateLessons] = useMutation(UPDATE_LESSONS);
  const nextLessonId =
    lessons.length > 0
      ? Math.max(...lessons.map((lesson) => lesson.lessonId)) + 1
      : 1;

  const initialState = {
    lessonId: nextLessonId,
    lessonTitle: "",
    lessonImage: null,
    lessonImageDescription: "",
    listeningObjectives: [],
    readingObjectives: [],
    listeningExercises: [],
    listeningExercises1: [],
    listeningExercises2: [],
    readingExercises: [],
    readalouds: [],
    dialogueBasedOnReading: [],
    dialogues: [],
    vocabulary: null,
  };

  const [values, setValues] = useState(
    match.params.lessonId
      ? {
          ...omit(
            lessons.find(
              (lesson) => lesson.lessonId === Number(match.params.lessonId)
            ),
            "__typename"
          ),
          // listeningExercises:
          //   lessons.find(
          //     (lesson) => lesson.lessonId === Number(match.params.lessonId)
          //   )?.listeningExercises || [],
        }
      : { ...initialState }
  );

  const [saved, setSaved] = useState(false);

  // useEffect(() => {
  //   console.log(values);
  // }, [values]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const updateVocabulary = (payload) =>
    setValues({ ...values, vocabulary: payload });

  const setLessonImage = ({ filename, relativePath }) =>
    setValues({
      ...values,
      lessonImage: { filename, relativePath },
    });

  const updateInArray = (name) => (index) => (payload) => {
    const arrayToUpdate = [...values[name]];
    arrayToUpdate[index] = payload;
    setValues({ ...values, [name]: arrayToUpdate });
  };

  const addToArrayInValues = (name) => (objective) =>
    setValues({ ...values, [name]: [...values[name], objective] });

  const removeFromArrayInValues = (name) => (index) =>
    setValues({
      ...values,
      [name]: [...values[name]].filter((objective, i) => i !== index),
    });

  const setReadalouds = (payload) => {
    setValues({ ...values, readalouds: payload });
  };

  const setDialogueBasedOnReading = (payload) => {
    setValues({ ...values, dialogueBasedOnReading: payload });
  };

  const setDialogues = (payload) => {
    setValues({ ...values, dialogues: payload });
  };

  const setExercises = (name) => (payload) => {
    setValues({ ...values, [name]: payload });
  };

  const duplicateExercise = (name) => (index) => {
    const exerciseToDuplicate = { ...values[name][index] };
    exerciseToDuplicate.title += "-copy";
    setValues({ ...values, [name]: [...values[name], exerciseToDuplicate] });
  };

  const save = async () => {
    try {
      await updateLessons({ variables: { input: values } });
      setSaved(true);
      await refetchLessons();
      history.push("/");
    } catch (e) {
      setSaved(false);
      console.log(e);
      alert("the server was disconnected. resolve and try again.");
    }
  };

  return (
    <Layout>
      <Prompt
        when={!saved}
        message="Are you sure you want to leave without saving?"
      />
      <header>
        <Typography variant="h3" align="center">
          L{values.lessonId}: BÀI {values.lessonId}
        </Typography>
      </header>
      <section className="form__section">
        <LessonTitle
          lessonTitle={values.lessonTitle}
          setLessonTitle={handleChange("lessonTitle")}
        />
        <LessonId
          lessonId={values.lessonId}
          setLessonId={(e) =>
            handleChange("lessonId")({
              target: { value: Number(e.target.value) },
            })
          }
        />
      </section>
      <section className="form__section">
        <TitlePageImage
          lessonId={values.lessonId}
          values={values}
          setLessonImage={setLessonImage}
        />
        <ImageDescription
          handleChange={handleChange("lessonImageDescription")}
          value={values.lessonImageDescription}
        />
      </section>
      <section className="form__section">
        <Typography variant="h3" align="center">
          Dialogues
        </Typography>
        <DialogueEditor
          dialogues={values.dialogues}
          setDialogues={setDialogues}
        />
      </section>
      <section className="form__section">
        <Typography variant="h4" align="center">
          Readalouds
        </Typography>

        <ReadaloudEditor
          readalouds={values.readalouds}
          setReadalouds={setReadalouds}
        />
      </section>
      <section className="form__section">
        <Typography variant="h4" align="center">
          Dialogue based on Reading
        </Typography>

        <ReadaloudEditor
          readalouds={values.dialogueBasedOnReading || []}
          setReadalouds={setDialogueBasedOnReading}
        />
      </section>
      <section className="form__section">
        <Typography variant="h3" align="center">
          Vocabulary
        </Typography>
        <VocabularyEditor
          vocabulary={values.vocabulary}
          setVocabulary={updateVocabulary}
        />
      </section>
      <section className="form__section">
        <Typography variant="h3" align="center">
          Listening
        </Typography>
        <Typography variant="h4" align="center">
          Objectives
        </Typography>
        <ObjectivesEditor
          objectives={values.listeningObjectives}
          addObjective={addToArrayInValues("listeningObjectives")}
          removeObjective={removeFromArrayInValues("listeningObjectives")}
        />

        <Typography variant="h4" align="center">
          Listening Exercises
        </Typography>

        <ExerciseBuilder
          exercises={values.listeningExercises}
          addExercise={addToArrayInValues("listeningExercises")}
          removeExercise={removeFromArrayInValues("listeningExercises")}
          updateExercise={updateInArray("listeningExercises")}
          setExercises={setExercises("listeningExercises")}
          duplicateExercise={duplicateExercise("listeningExercises")}
          page="listening"
        />

        <Typography variant="h4" align="center">
          Listening 1 Exercises
        </Typography>

        <ExerciseBuilder
          exercises={values.listeningExercises1}
          addExercise={addToArrayInValues("listeningExercises1")}
          removeExercise={removeFromArrayInValues("listeningExercises1")}
          updateExercise={updateInArray("listeningExercises1")}
          setExercises={setExercises("listeningExercises1")}
          duplicateExercise={duplicateExercise("listeningExercises1")}
          page="listening1"
        />
        <Typography variant="h4" align="center">
          Listening 2 Exercises
        </Typography>

        <ExerciseBuilder
          exercises={values.listeningExercises2}
          addExercise={addToArrayInValues("listeningExercises2")}
          removeExercise={removeFromArrayInValues("listeningExercises2")}
          updateExercise={updateInArray("listeningExercises2")}
          setExercises={setExercises("listeningExercises2")}
          duplicateExercise={duplicateExercise("listeningExercises2")}
          page="listening2"
        />
      </section>
      <section className="form__section">
        <Typography variant="h3" align="center">
          Reading
        </Typography>
        <Typography variant="h4" align="center">
          Objectives
        </Typography>
        <ObjectivesEditor
          objectives={values.readingObjectives}
          addObjective={addToArrayInValues("readingObjectives")}
          removeObjective={removeFromArrayInValues("readingObjectives")}
        />

        <Typography variant="h4" align="center">
          Reading Exercises
        </Typography>

        <ExerciseBuilder
          exercises={values.readingExercises}
          addExercise={addToArrayInValues("readingExercises")}
          removeExercise={removeFromArrayInValues("readingExercises")}
          updateExercise={updateInArray("readingExercises")}
          setExercises={setExercises("readingExercises")}
          duplicateExercise={duplicateExercise("readingExercises")}
          page="reading"
        />
      </section>
      <Button variant="contained" color="primary" fullWidth onClick={save}>
        Save Lesson
      </Button>
    </Layout>
  );
}

export default withRouter(New);
