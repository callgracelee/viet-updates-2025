import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import GroupTextsChoicesAnswersListing from "./GroupTextsChoicesAnswersListing";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Button } from "@material-ui/core";

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

export default function CustomizedInputBase({
  choices,
  addChoice,
  removeChoice,
  editChoice,
  shuffleChoices,
  exerciseType,
  setAnswer,
  removeAnswer,
  answer,
  trueLabel,
  falseLabel,
}) {
  const classes = useStyles();
  const [currentPromptText, setCurrentPromptText] = useState("");
  const [currentChoiceImage, setCurrentChoiceImage] = useState("");
  const [currentChoice, setCurrentChoice] = useState("");
  const [currentChoices, setCurrentChoices] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [withImages, setWithImages] = useState(false);
  const inputEl = useRef(null);

  // console.log("currentChoice", currentChoice);

  const addHandler = (e) => {
    addChoice({
      text: currentPromptText,
      img: currentChoiceImage,
      textChoices: currentChoices.map((item) => item.currentChoice),
      answer: currentAnswer,
    });
    setCurrentPromptText("");
    setCurrentChoiceImage("");
    setCurrentChoices([]);
    setCurrentAnswer("");
    inputEl.current.focus();
    nextId = 0;
  };

  const addChoiceHandler = (e) => {
    setCurrentChoice("");
    // console.log("currentChoice", currentChoice);

    // setCurrentChoices(currentChoices.concat(currentChoice));
    setCurrentChoices([
      ...currentChoices,
      { id: nextId++, currentChoice: currentChoice },
    ]);
  };

  return (
    <Paper className={classes.root}>
      <GroupTextsChoicesAnswersListing
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
      <FormControlLabel
        className={classes.switch}
        control={
          <Switch
            checked={withImages}
            onChange={() => setWithImages(!withImages)}
            value="withImages"
          />
        }
        label="Images"
      />
      <InputBase
        className={classes.input}
        value={currentPromptText}
        onChange={(e) => setCurrentPromptText(e.target.value)}
        placeholder="prompt text"
        inputProps={{ "aria-label": "text" }}
        inputRef={inputEl}
      />
      <div className={classes.containerDiv}>
        <InputBase
          className={classes.choiceInput}
          value={currentChoice}
          onChange={(e) => setCurrentChoice(e.target.value)}
          placeholder="choice"
          inputProps={{ "aria-label": "choice" }}
        />
        <Divider className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          onClick={addChoiceHandler}
          aria-label="add-objective"
        >
          <AddIcon />
        </IconButton>
      </div>
      {currentChoices.map((choice) => (
        <div className={classes.containerList} key={choice.id}>
          <span className={classes.listItem}>
            {alpha[choice.id]}. {choice.currentChoice}
          </span>
        </div>
      ))}
      {withImages && (
        <InputBase
          className={classes.input}
          value={currentChoiceImage}
          onChange={(e) => setCurrentChoiceImage(e.target.value)}
          placeholder="choice image"
          inputProps={{ "aria-label": "choice image" }}
        />
      )}

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

      <Button fullWidth onClick={() => shuffleChoices()}>
        Shuffle Choices and Answer
      </Button>
    </Paper>
  );
}
