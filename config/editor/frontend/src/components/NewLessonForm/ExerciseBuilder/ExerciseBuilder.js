import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Paper,
  Button,
  FormGroup,
} from "@material-ui/core";
import FullScreenDialog from "../../FullScreenDialog";
import shuffle from "lodash/shuffle";
import ExercisesListing from "./ExerciseListing";
import ExerciseTypeSelect from "./ExerciseTypeSelect";
import ExerciseResourceLinks from "./ExerciseResourceLinks";
import AudioPlayerSelect from "./AudioPlayerSelect";
import ExerciseFillInTheBlankEditor from "./ExerciseFillInTheBlankEditor";
import ChoiceAnswerEditor from "./ChoiceAnswerEditor";
import GroupChoiceAnswerEditor from "./GroupChoiceAnswerEditor";
import TextAnswerEditor from "./TextAnswerEditor";
import ExerciseCompoundWordsEditor from "./ExerciseCompoundWordsEditor";
import ExerciseSectionSelect from "./ExerciseSectionSelect";
import GroupExerciseFillInTheBlankEditor from "./GroupExerciseFillInTheBlankEditor";

export default function ExerciseBuilder({
  exercises,
  addExercise,
  removeExercise,
  updateExercise,
  setExercises,
  duplicateExercise,
  page,
}) {
  const getDefaultPlayer = () => {
    switch (page) {
      case "listening":
        return "";
      case "listening2":
        return "dialogue2";
      case "listening1":
        return "dialogue1";
      case "listening2":
        return "dialogue2";
      default:
        return "";
    }
  };

  const initialState = {
    type: "",
    title: "",
    section: "",
    instructions: "",
    prompt: "",
    resourceLinks: {
      dialogue1: page === "listening1",
      dialogue2: page === "listening2",
      reading: page === "reading",
    },
    audioPlayer: getDefaultPlayer(),
    choices: [],
    answer: "",
    fillInPreviewArea: null,
    trueLabel: "True",
    falseLabel: "False",
    youtubeLink: "",
  };

  const [values, setValues] = useState({ ...initialState });

  const [editing, setEditing] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  // for debugging
  useEffect(() => {
    console.log(values);
  }, [values]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const addToArrayInValues = (name) => (newVal) =>
    setValues({ ...values, [name]: [...values[name], newVal] });

  const removeFromArrayInValues = (name) => (index) =>
    setValues({
      ...values,
      [name]: [...values[name]].filter((newVal, i) => i !== index),
    });

  // const editFromArrayInValues = (name) => (index, newVal) => {
  //   const updatedArray = [...values[name]];
  //   updatedArray[index] = newVal;
  //   setValues({
  //     ...values,
  //     [name]: updatedArray,
  //   });
  // };

  const editFromArrayInValues = (name) => (
    index,
    newTextVal,
    newAnswerVal,
    newTextChoicesVal,
    newSource
  ) => {
    const updatedArray = [...values[name]];

    if (
      typeof updatedArray[index] === "object" &&
      updatedArray[index] !== null
    ) {
      updatedArray[index] = {
        ...updatedArray[index],
        text: newTextVal,
        answer: newAnswerVal,
        textChoices: newTextChoicesVal,
        source: newSource,
      };
    } else {
      updatedArray[index] = newTextVal;
    }

    // For debugging
    console.log("Updating array with:", {
      index,
      newTextVal,
      newAnswerVal,
      newTextChoicesVal,
      newSource,
      updatedItem: updatedArray[index],
    });

    setValues({
      ...values,
      [name]: updatedArray,
    });
  };

  const editFromArrayInValuesCompoundWords = (name) => (
    index,
    newSource,
    updatedHTML
  ) => {
    const updatedArray = [...values[name]]; // Copy the array

    // Check if the item at the given index is an object and has a 'text' property
    if (
      typeof updatedArray[index] === "object" &&
      updatedArray[index] !== null
    ) {
      updatedArray[index] = {
        ...updatedArray[index], // Spread the current object
        source: newSource,
        html: updatedHTML,
      };
    } else {
      // If it's not an object, just replace it with newVal
      updatedArray[index] = newSource;
    }

    // Update the state with the modified array
    setValues({
      ...values,
      [name]: updatedArray,
    });
  };

  const editFromArrayInValuesWriteIn = (name) => (
    index,
    newTextVal,
    newAnswerVal,
    subText
  ) => {
    const updatedArray = [...values[name]];

    if (
      typeof updatedArray[index] === "object" &&
      updatedArray[index] !== null
    ) {
      updatedArray[index] = {
        ...updatedArray[index],
        text: newTextVal,
        answer: newAnswerVal,
        subText: subText,
      };
    } else {
      updatedArray[index] = newTextVal;
    }

    // For debugging
    console.log("Updating write-in array with:", {
      index,
      newTextVal,
      newAnswerVal,
      subText,
      updatedItem: updatedArray[index],
    });

    setValues({
      ...values,
      [name]: updatedArray,
    });
  };

  const removeAnswer = (val) =>
    setValues({
      ...values,
      answer: [...values.answer].filter((answer, i) => answer !== val),
    });

  const setResourceLinks = (name) => (event) => {
    setValues({
      ...values,
      resourceLinks: { ...values.resourceLinks, [name]: event.target.checked },
    });
  };

  const setFillInPreviewArea = ({ html, source }) => {
    setValues({
      ...values,
      fillInPreviewArea: { html, source },
    });
  };

  const shuffleChoices = () => {
    const choicesWithOriginalPositions = values.choices.map((c, i) => ({
      text: c.text,
      img: c.img,
      id: i,
    }));
    const shuffled = shuffle(choicesWithOriginalPositions);
    const shuffledAnswer = shuffled
      .map((c, i) => ({ id: c.id, newId: i }))
      .sort((a, b) => a.id - b.id)
      .map((c) => c.newId)
      .join(",");
    const choices = shuffled.map((c) => ({ text: c.text, img: c.img }));

    setValues({
      ...values,
      choices,
      answer: shuffledAnswer,
    });
  };

  const saveExercise = () => {
    if (editing) {
      updateExercise(editingIndex)(values);
    } else {
      addExercise(values);
    }
    setValues({ ...initialState });
    setEditing(false);
    setEditingIndex(null);
    handleDialogClose();
  };

  const newExercise = () => {
    setValues({ ...initialState });
    setEditing(false);
    setEditingIndex(null);
    handleModalOpen();
  };

  const edit = (i) => {
    setValues({ ...exercises[i] });
    setEditing(true);
    setEditingIndex(i);
    document.activeElement.blur();
    handleModalOpen();
  };

  const cancel = () => {
    setValues({ ...initialState });
    setEditing(false);
    setEditingIndex(null);
    handleDialogClose();
  };

  const handleModalOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const alpha = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  const editFromArrayInValuesTrueOrFalse = (name) => (
    index,
    newTextVal,
    newAnswerVal,
    newSubText
  ) => {
    const updatedArray = [...values[name]];

    if (
      typeof updatedArray[index] === "object" &&
      updatedArray[index] !== null
    ) {
      updatedArray[index] = {
        ...updatedArray[index],
        text: newTextVal,
        answer: newAnswerVal,
        subText: newSubText,
      };
    } else {
      updatedArray[index] = newTextVal;
    }

    // For debugging
    console.log("Updating true-or-false array with:", {
      index,
      newTextVal,
      newAnswerVal,
      newSubText,
      updatedItem: updatedArray[index],
    });

    setValues({
      ...values,
      [name]: updatedArray,
    });
  };

  // const editChoice = (index, updatedChoice) => {
  //   setValues((prev) => ({
  //     ...prev,
  //     choices: prev.choices.map((c, i) => (i === index ? updatedChoice : c)),
  //   }));
  // };

  const editFromArrayInValuesFillInTheBlank = (name) => (
    index,
    updatedObj
  ) => {
    const updatedArray = [...values[name]];
    updatedArray[index] = updatedObj;

    setValues({
      ...values,
      [name]: updatedArray,
    });
  };

  return (
    <div>
      <ExercisesListing
        exercises={exercises}
        removeExercise={removeExercise}
        editExercise={edit}
        setExercises={setExercises}
        duplicateExercise={duplicateExercise}
      />
      {/*  ideally use a custom handler to set the defaults for the other inputs based on the type */}
      <Button
        fullWidth
        color="primary"
        onClick={newExercise}
        variant="outlined"
      >
        New Exercise
      </Button>
      <FullScreenDialog
        open={dialogOpen}
        handleDialogClose={handleDialogClose}
        save={saveExercise}
        cancel={cancel}
        title="Exercise Editor"
      >
        <Paper style={{ padding: "1em" }}>
          <ExerciseTypeSelect
            exerciseType={values.type}
            setExerciseType={handleChange("type")}
          />
          {/* {values.type && ( */}
          <>
            {/* <p>fields for {values.type}</p> */}
            {page === "reading" && (
              <ExerciseSectionSelect
                section={values.section}
                setSection={handleChange("section")}
              />
            )}
            <FormGroup>
              <TextField
                value={values.title}
                onChange={handleChange("title")}
                helperText="Example: A-2"
                label="Exercise title"
              />
              <Typography variant="h5">Resource Links</Typography>
              <ExerciseResourceLinks
                resourceLinks={values.resourceLinks}
                setResourceLinks={setResourceLinks}
              />
              <Typography variant="h5">Audio Player</Typography>
              <AudioPlayerSelect
                audioPlayer={values.audioPlayer}
                setAudioPlayer={handleChange("audioPlayer")}
              />
              <TextField
                value={values.instructions}
                onChange={handleChange("instructions")}
                helperText="Example: Listen to the audio again and select the best answer."
                label="Exercise instructions"
              />
              <TextField
                value={values.youtubeLink || ""}
                onChange={handleChange("youtubeLink")}
                helperText="Example: https://www.youtube.com/watch?v=uSFiFVLnVaE"
                label="YouTube Link"
              />
              <TextField
                value={values.prompt}
                onChange={handleChange("prompt")}
                helperText="Example: True or False:"
                label="Exercise Prompt"
              />
            </FormGroup>
            {values.type === "true-or-false" && (
              <>
                <FormGroup>
                  <TextField
                    value={values.trueLabel}
                    onChange={handleChange("trueLabel")}
                    label="Exercise true label"
                  />
                  <TextField
                    value={values.falseLabel}
                    onChange={handleChange("falseLabel")}
                    label="Exercise false label"
                  />
                </FormGroup>
                <Typography variant="h5">Choices/Prompts/Answers</Typography>
                <ChoiceAnswerEditor
                  shuffleChoices={shuffleChoices}
                  exerciseType={values.type}
                  choices={values.choices}
                  answer={values.answer}
                  setAnswer={addToArrayInValues("answer")}
                  setSubText={addToArrayInValues("subText")}
                  removeAnswer={removeAnswer}
                  addChoice={addToArrayInValues("choices")}
                  removeChoice={(index) => {
                    removeFromArrayInValues("choices")(index);
                  }}
                  editChoice={(index, newText, newAnswer, subText) => {
                    editFromArrayInValuesTrueOrFalse("choices")(
                      index,
                      newText,
                      newAnswer,
                      subText
                    );
                  }}
                  trueLabel={values.trueLabel}
                  falseLabel={values.falseLabel}
                />
                <TextField
                  value={values.answer}
                  onChange={handleChange("answer")}
                  label="Answer Key"
                />
              </>
            )}

            {values.type === "fill-in-the-blank" && (
              <>
                <Typography variant="h5">
                  Fill-in-the-blank Preview Area
                </Typography>
                <ExerciseFillInTheBlankEditor
                  fillInPreviewArea={values.fillInPreviewArea}
                  setFillInPreviewArea={setFillInPreviewArea}
                />
              </>
            )}

            {values.type === "compound-words" && (
              <>
                <Typography variant="h5">Compound Words Text</Typography>
                <ExerciseCompoundWordsEditor
                  // compoundWordsHtml={values.compoundWordsHtml}
                  // setCompoundWordsHtml={setCompoundWordsHtml}
                  removeChoice={(index) => {
                    removeFromArrayInValues("choices")(index);
                  }}
                  editChoice={(index, newSource, updatedHTML) => {
                    editFromArrayInValuesCompoundWords("choices")(
                      index,
                      newSource,
                      updatedHTML
                    );
                  }}
                  exerciseType={values.type}
                  choices={values.choices}
                  addChoice={addToArrayInValues("choices")}
                />
              </>
            )}

            {values.type === "select-one" && (
              <>
                <Typography variant="h5">Prompt/Choices/Answer List</Typography>
                <GroupChoiceAnswerEditor
                  shuffleChoices={shuffleChoices}
                  exerciseType={values.type}
                  choices={values.choices}
                  answer={values.answer}
                  setAnswer={addToArrayInValues("answer")}
                  removeAnswer={removeAnswer}
                  addChoice={addToArrayInValues("choices")}
                  removeChoice={(index) => {
                    removeFromArrayInValues("choices")(index);
                  }}
                  editChoice={(index, newText, newAnswer, newTextChoices) => {
                    editFromArrayInValues("choices")(
                      index,
                      newText,
                      newAnswer,
                      newTextChoices
                    );
                  }}
                  trueLabel={values.trueLabel}
                  falseLabel={values.falseLabel}
                />

                <TextField
                  value={values.answer}
                  onChange={handleChange("answer")}
                  label="Answer Key"
                />
              </>
            )}

            {(values.type === "select-many" ||
              values.type === "group-multiple-choice") && (
              <>
                <Typography variant="h5">Prompts/Answer</Typography>
                <GroupChoiceAnswerEditor
                  shuffleChoices={shuffleChoices}
                  exerciseType={values.type}
                  choices={values.choices}
                  answer={values.answer}
                  setAnswer={addToArrayInValues("answer")}
                  removeAnswer={removeAnswer}
                  addChoice={addToArrayInValues("choices")}
                  removeChoice={(index) => {
                    removeFromArrayInValues("choices")(index);
                  }}
                  editChoice={(index, newText, newAnswer, subText) => {
                    editFromArrayInValues("choices")(
                      index,
                      newText,
                      newAnswer,
                      subText
                    );
                  }}
                  trueLabel={values.trueLabel}
                  falseLabel={values.falseLabel}
                />

                <TextField
                  value={values.answer}
                  onChange={handleChange("answer")}
                  label="Answer Key"
                />
              </>
            )}

            {(values.type === "multi-fill-in-the-blank" || values.type === "word-order") && (
              <>
                <Typography variant="h5">Multi Fill-in-the-Blank (Grouped)</Typography>
                <GroupExerciseFillInTheBlankEditor
                  choices={values.choices}
                  addChoice={addToArrayInValues("choices")}
                  removeChoice={(index) => {
                    removeFromArrayInValues("choices")(index);
                  }}
                  editChoice={(index, newText, newAnswer, newTextChoices) =>
                    editFromArrayInValuesFillInTheBlank("choices")(
                      index,
                      {
                        source: newText,
                        answer: newAnswer,
                        textChoices: newTextChoices
                      }
                    )
                  }
                  shuffleChoices={shuffleChoices}
                  exerciseType={values.type}
                  setAnswer={addToArrayInValues("answer")}
                  removeAnswer={removeAnswer}
                  answer={values.answer}
                  trueLabel={values.trueLabel}
                  falseLabel={values.falseLabel}
                />
              </>
            )}

            {values.type !== "compound-words" &&
              values.type !== "write-in" &&
              values.type !== "select-one" &&
              values.type !== "select-many" &&
              values.type !== "true-or-false" &&
              values.type !== "group-multiple-choice" &&
              values.type !== "multi-fill-in-the-blank" &&
              values.type !== "word-order" && (
                <>
                  <Typography variant="h5">Choices/Prompts/Answers</Typography>
                  <ChoiceAnswerEditor
                    shuffleChoices={shuffleChoices}
                    exerciseType={values.type}
                    choices={values.choices}
                    answer={values.answer}
                    setAnswer={addToArrayInValues("answer")}
                    removeAnswer={removeAnswer}
                    addChoice={addToArrayInValues("choices")}
                    removeChoice={(index) => {
                      removeFromArrayInValues("choices")(index);
                    }}
                    editChoice={(index, newText, newAnswer, subText) => {
                      editFromArrayInValues("choices")(
                        index,
                        newText,
                        newAnswer,
                        null,
                        null,
                        subText
                      );
                    }}
                    trueLabel={values.trueLabel}
                    falseLabel={values.falseLabel}
                  />

                  <TextField
                    value={values.answer}
                    onChange={handleChange("answer")}
                    label="Answer Key"
                  />
                  {values.answer.length > 0 && (
                    <>
                      <Typography variant="h5">Answer Key Preview</Typography>
                      <p>
                        {values.type !== "true-or-false" &&
                          values.answer
                            .split(",")
                            .map((answer, i) => (
                              <span key={`${answer}${i + 1}`}>
                                {`${i + 1}. ${
                                  values.choices[answer]
                                    ? values.choices[answer].text
                                    : answer
                                } (${alpha[answer]}), `}
                              </span>
                            ))}
                        {values.type === "true-or-false" &&
                          values.answer
                            .split(",")
                            .map((answer, i) => (
                              <span key={`${answer}${i + 1}`}>{`${i + 1}. ${
                                answer % 2 === 0
                                  ? values.trueLabel
                                  : values.falseLabel
                              } (${alpha[answer]}), `}</span>
                            ))}
                      </p>
                    </>
                  )}
                </>
              )}

            {values.type === "write-in" && (
              <>
                <Typography variant="h5">Prompts/Answers</Typography>
                <TextAnswerEditor
                  shuffleChoices={shuffleChoices}
                  exerciseType={values.type}
                  choices={values.choices}
                  answer={values.answer}
                  setAnswer={addToArrayInValues("answer")}
                  setSubText={addToArrayInValues("subText")}
                  removeAnswer={removeAnswer}
                  addChoice={addToArrayInValues("choices")}
                  removeChoice={(index) => {
                    removeFromArrayInValues("choices")(index);
                  }}
                  editChoice={(index, newText, newAnswer, subText) => {
                    editFromArrayInValuesWriteIn("choices")(
                      index,
                      newText,
                      newAnswer,
                      subText
                    );
                  }}
                  trueLabel={values.trueLabel}
                  falseLabel={values.falseLabel}
                />
              </>
            )}
          </>
        </Paper>
      </FullScreenDialog>
    </div>
  );
}
