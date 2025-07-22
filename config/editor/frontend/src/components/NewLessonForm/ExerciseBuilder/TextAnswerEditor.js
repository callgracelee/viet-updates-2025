import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import TextsAnswersListing from "./TextsAnswersListing";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Switch from "@material-ui/core/Switch";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "0 auto",
  },
  input: {
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
});

export default function CustomizedInputBase({
  choices,
  addChoice,
  removeChoice,
  editChoice,
  shuffleChoices,
  exerciseType,
  setAnswer,
  setSubText,
  removeAnswer,
  answer,
  subText,
  trueLabel,
  falseLabel,
}) {
  const classes = useStyles();
  const [currentChoiceText, setCurrentChoiceText] = useState("");
  const [currentChoiceAnswer, setCurrentChoiceAnswer] = useState("");
  const [currentSubText, setCurrentSubText] = useState("");

  // const [withImages, setWithImages] = useState(false);
  const inputEl = useRef(null);

  const addHandler = (e) => {
    addChoice({
      text: currentChoiceText,
      answer: currentChoiceAnswer,
      subText: currentSubText,
    });
    setCurrentChoiceText("");
    setCurrentChoiceAnswer("");
    setCurrentSubText("");
    inputEl.current.focus();
  };

  return (
    <Paper className={classes.root}>
      <TextsAnswersListing
        choices={choices}
        removeChoice={removeChoice}
        editChoice={editChoice}
        exerciseType={exerciseType}
        setAnswer={setAnswer}
        setSubText={setSubText}
        removeAnswer={removeAnswer}
        subText={subText}
        answer={answer}
        trueLabel={trueLabel}
        falseLabel={falseLabel}
      />
      {/* <FormControlLabel
        control={
          <Switch
            checked={withImages}
            onChange={() => setWithImages(!withImages)}
            value="withImages"
          />
        }
        label="Images"
      /> */}
      <InputBase
        className={classes.input}
        value={currentSubText}
        onChange={(e) => setCurrentSubText(e.target.value)}
        placeholder="subtext"
        inputProps={{ "aria-label": "subtext" }}
      />
      <InputBase
        className={classes.input}
        value={currentChoiceText}
        onChange={(e) => setCurrentChoiceText(e.target.value)}
        placeholder="text"
        inputProps={{ "aria-label": "prompt text" }}
        inputRef={inputEl}
      />

      <InputBase
        className={classes.input}
        value={currentChoiceAnswer}
        onChange={(e) => setCurrentChoiceAnswer(e.target.value)}
        placeholder="answer key"
        inputProps={{ "aria-label": "prompt answer" }}
      />

      <Divider className={classes.divider} />
      <IconButton
        color="primary"
        className={classes.iconButton}
        onClick={addHandler}
        aria-label="add-objective"
      >
        <AddIcon />
      </IconButton>
      <Button fullWidth onClick={() => shuffleChoices()}>
        Shuffle Choices and Answer
      </Button>
    </Paper>
  );
}
