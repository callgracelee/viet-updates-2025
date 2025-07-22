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
  listItem: {
    marginRight: 8,
  },
}));

export default function InteractiveList({ choices, removeChoice, editChoice }) {
  const classes = useStyles();

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

  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
  const [editText, setEditText] = useState(""); // Track edited text
  const [editAnswer, setEditAnswer] = useState(""); // Track edited answer
  const [editTextChoices, setEditTextChoices] = useState([]); // Track edited textChoices

  // Function to start editing a choice
  const handleEdit = (i) => {
    setEditIndex(i);
    setEditText(choices[i].text); // Initialize with current choice text
    setEditAnswer(choices[i].answer); // Initialize with current choice answer
    setEditTextChoices([...choices[i].textChoices]); // Initialize with current choice textChoices
  };

  const handleSave = (i) => {
    editChoice(i, editText, editAnswer, editTextChoices); // Pass both text and answer
    setEditIndex(null); // Exit edit mode
  };

  // Function to cancel editing
  const handleCancel = () => {
    setEditIndex(null); // Exit edit mode without saving
    setEditText(""); // Clear edit text
    setEditAnswer(""); // Clear edit answer
    setEditTextChoices([]); // Clear edit textChoices
  };

  // Function to handle text change for textChoices
  const handleTextChoiceChange = (index, newValue) => {
    const updatedTextChoices = [...editTextChoices];
    updatedTextChoices[index] = newValue;
    setEditTextChoices(updatedTextChoices);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.demo}>
            <List>
              {choices.map((choice, i) => (
                <ListItem
                  key={choice.text + i}
                  style={{ paddingRight: "85px" }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <CheckboxIcon />
                    </Avatar>
                  </ListItemAvatar>

                  {editIndex === i ? (
                    <ListItemText
                      primary={
                        <>
                          <span style={{ marginRight: 8 }}>{i + 1}</span>
                          <TextField
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            label="Edit Prompt"
                            multiline // Allow multiline text
                            fullWidth
                            style={{ marginBottom: 16 }}
                          />
                        </>
                      }
                      secondary={
                        <div>
                          <div>
                            {choice.textChoices.map((textChoice, index) => (
                              <div
                                className={classes.listItem}
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 16,
                                }} // Flexbox to keep elements in one line
                              >
                                <span style={{ marginRight: 8 }}>
                                  {alpha[index]}.
                                </span>{" "}
                                {/* Add spacing between alpha and TextField */}
                                <TextField
                                  value={editTextChoices[index]}
                                  onChange={(e) =>
                                    handleTextChoiceChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  multiline // Allow multiline text
                                  fullWidth
                                  label="Edit Choice"
                                />
                              </div>
                            ))}
                          </div>

                          <TextField
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            label="Edit Answer"
                            style={{ marginTop: 16 }}
                          />
                        </div>
                      }
                    />
                  ) : (
                    <ListItemText
                      primary={`${i + 1}. ${choice.text}`}
                      secondary={
                        <>
                          <span>
                            {choice.textChoices.map((textChoice, index) => (
                              <span className={classes.listItem} key={index}>
                                {alpha[index]}. {textChoice}
                              </span>
                            ))}
                          </span>
                          <div>Answer: {choice.answer}</div>
                        </>
                      }
                    />
                  )}

                  <ListItemSecondaryAction>
                    {editIndex === i ? (
                      <div>
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
                      </div>
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
