import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Paper, List, ListItem, ListItemText, Divider, IconButton, Grid, Typography, InputBase } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import showdown from "showdown";
import styled from "styled-components";
import GroupExerciseFillInTheBlankListing from './GroupExerciseFillInTheBlankListing'; // Uncomment and adjust path as needed
const converter = new showdown.Converter();

const StyledPreview = styled.div`
  [data-input] {
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#feeac4),
      to(#feeac4)
    );
    background-image: -webkit-linear-gradient(#feeac4, #feeac4);
    background-image: -o-linear-gradient(#feeac4, #feeac4);
    background-image: linear-gradient(#feeac4, #feeac4);
    text-decoration: underline;
  }
`;

const useStyles = makeStyles({
  root: {
    padding: 2,
    // display: "flex",
    // alignItems: "center",
    // flexWrap: "wrap",
    // margin: "0 auto",
  },
  switch: {
    marginLeft: 2,
  },
  containerDiv: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: 8,
    // flex: 1,
    width: "100%",
  },

  choiceInput: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  containerList: {
    marginLeft: 8,
  },
  listItem: {
    marginRight: 8,
  },
});

let nextId = 0;
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

export default function GroupExerciseFillInTheBlankEditor({
  choices,
  addChoice,
  removeChoice,
  editChoice,
  exerciseType,
  setAnswer,
  removeAnswer,
  answer,
  trueLabel,
  falseLabel, 
}) {
  const classes = useStyles();
  const [currentSource, setCurrentSource] = useState("");
  const [currentChoice, setCurrentChoice] = useState("");
  const [currentChoices, setCurrentChoices] = useState([]); // array of {id, value}
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentHtml, setCurrentHtml] = useState("");
  const inputEl = useRef(null);

  // Update preview when source changes
  const handleSourceChange = (e) => {
    const val = e.target.value;
    setCurrentSource(val);
    setCurrentHtml(replaceBlanks(converter.makeHtml(val)));
  };

  // Replace ___ with button for preview
  const replaceBlanks = (str) => {
    return str.replace(
      /___/g,
      '<button data-answer-slot="true" title="Answer Slot"></button>'
    );
  };

  // Add a single choice to the local currentChoices array
  const addChoiceHandler = () => {
    setCurrentChoice("");
    if (!currentChoice.trim()) return;
    setCurrentChoices([
      ...currentChoices,
      { id: nextId++, currentChoice: currentChoice },
    ]);

  };


  // Add the current question to the parent
  const addHandler = () => {
    if (!currentSource.trim() || currentChoices.length === 0 || !currentAnswer.trim()) return;
    const textChoices = currentChoices.map((c) => c.value);
    const answerIndices = currentAnswer.split(",").map((s) => parseInt(s.trim(), 10));

    addChoice({
      text: currentSource,
      html: currentHtml,
      textChoices,
      answer: currentAnswer,
    });
    setCurrentSource("");
    setCurrentHtml("");
    setCurrentChoices([]);
    setCurrentAnswer("");
    inputEl.current.focus();
    nextId = 0;
  };

  return (
    <Paper style={{ padding: 16 }}>
   
      <GroupExerciseFillInTheBlankListing
        choices={choices}
        removeChoice={removeChoice}
        editChoice={editChoice}
        exerciseType={exerciseType}
        setAnswer={setAnswer}
        removeAnswer={removeAnswer}
        answer={answer}
        trueLabel={trueLabel}
        falseLabel={falseLabel}
      />
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h5">Markdown (with HTML support)</Typography>
          <TextField
            label="Source (use ___ for blanks)"
            value={currentSource}
            onChange={handleSourceChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Preview</Typography>
          <StyledPreview dangerouslySetInnerHTML={{ __html: currentHtml }} />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
        <InputBase
          style={{ flex: 1 }}
          value={currentChoice}
          onChange={(e) => setCurrentChoice(e.target.value)}
          placeholder="Add a choice"
          inputProps={{ "aria-label": "choice" }}
        />
        <IconButton color="primary" onClick={addChoiceHandler} aria-label="add-choice">
          <AddIcon />
        </IconButton>
      </div>
      <div style={{ margin: '8px 0' }}>
      {currentChoices.map((choice) => (
        <div className={classes.containerList} key={choice.id}>
          <span className={classes.listItem}>
            {alpha[choice.id]}. {choice.currentChoice}
          </span>
        </div>
      ))}
      </div>


      <div className={classes.containerDiv}>
        <InputBase
          className={classes.input}
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          ss
          placeholder="Answer Key"
          inputProps={{ "aria-label": "answer key" }}
        />

        <Divider className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          onClick={addHandler}
          aria-label="add-question"
        >
          <AddIcon />
          ADD
        </IconButton>
      </div>
    </Paper>
  );
}