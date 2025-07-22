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

export default function InteractiveList({ choices, removeChoice, editChoice }) {
  const classes = useStyles();

  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
  const [editText, setEditText] = useState(""); // Track edited text

  // Function to start editing a choice
  const handleEdit = (i) => {
    setEditIndex(i);
    setEditText(choices[i].source); // Initialize with current choice text
  };

  // Function to save edited choice
  const handleSave = (i) => {
    editChoice(i, editText); // Call editChoice handler with new text
    setEditIndex(null); // Exit edit mode
  };

  // Function to cancel editing
  const handleCancel = () => {
    setEditIndex(null); // Exit edit mode without saving
    setEditText(""); // Clear edit text
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.demo}>
            <List>
              {choices.map((choice, i) => (
                <ListItem
                  key={choice.html + i}
                  style={{ paddingRight: "85px" }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <CheckboxIcon />
                    </Avatar>
                  </ListItemAvatar>

                  {editIndex === i ? (
                    <TextField
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    <ListItemText primary={`${i + 1}. ${choice.source}`} />
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
