import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import CheckboxIcon from "@material-ui/icons/CheckBoxOutlineBlankTwoTone";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "0 auto",
    width: "100%",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

/* needs to be different for true or false */

const getTrueOfrFalseIndexes = (i, trueLabel, falseLabel) => {
  return `${trueLabel}: ${2 * i + 1 - 1} | ${falseLabel}: ${2 * i + 1}`;
};

export default function InteractiveList({
  choices,
  removeChoice,
  editChoice,
  exerciseType,
  trueLabel,
  falseLabel,
}) {
  const classes = useStyles();

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editSubText, setEditSubText] = useState("");

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
  // const [answers, setAnswers] = useState([]);

  // const checkboxHandler = (i) => (e) => {
  //   if (e.target.checked) {
  //     setAnswer(i);
  //   } else {
  //     removeAnswer(i);
  //   }
  // };
  // Function to start editing a choice
  const handleEdit = (i) => {
    setEditIndex(i);
    setEditText(choices[i].text);
    setEditSubText(choices[i].subText || "");
  };

  // Function to save edited choice
  const handleSave = (i) => {
    editChoice(i, editText, null, editSubText);
    setEditIndex(null);
    setEditText("");
    setEditSubText("");
  };

  // Function to cancel editing
  const handleCancel = () => {
    setEditIndex(null); // Exit edit mode without saving
    setEditText(""); // Clear edit text
    setEditSubText("");
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.demo}>
            <List>
              {choices.map((choice, i) => (
                <ListItem key={choice.text + i}>
                  <ListItemAvatar>
                    <Avatar>
                      <CheckboxIcon />
                    </Avatar>
                  </ListItemAvatar>

                  {editIndex === i ? (
                    <>
                      <TextField
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        fullWidth
                      />
                      <TextField
                        value={editSubText}
                        onChange={(e) => setEditSubText(e.target.value)}
                        fullWidth
                        label="Edit Sub Text"
                      />
                    </>
                  ) : (
                    <ListItemText
                      primary={`${i + 1}. ${choice.text} (${
                        exerciseType !== "true-or-false"
                          ? i
                          : getTrueOfrFalseIndexes(i, trueLabel, falseLabel)
                      }${
                        exerciseType !== "true-or-false" ? ` | ${alpha[i]}` : ""
                      })`}
                      secondary={
                        <>
                          {choice.subText && (
                            <span>Sub Text: {choice.subText}</span>
                          )}
                          {choice.img && <span>{choice.img}</span>}
                        </>
                      }
                    />
                  )}

                  <ListItemSecondaryAction>
                    {editIndex === i ? (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="save"
                          onClick={() => handleSave(i)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="cancel"
                          onClick={handleCancel}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(i)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeChoice(i)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
