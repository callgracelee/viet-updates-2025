import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import QuestionAnswerTwoTone from "@material-ui/icons/QuestionAnswerTwoTone";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopy from "@material-ui/icons/FileCopy";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RootRef from "@material-ui/core/RootRef";

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
  secondaryAction: {
    marginRight: "1em",
  },
}));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function InteractiveList({
  exercises = [],
  removeExercise,
  editExercise,
  setExercises,
  duplicateExercise,
}) {
  const classes = useStyles();

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      exercises,
      result.source.index,
      result.destination.index
    );

    setExercises(items);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.demo}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <RootRef rootRef={provided.innerRef}>
                    <List>
                      {Array.isArray(exercises) && exercises.length > 0 ? (
                        exercises.map((exercise, i) => (
                          <Draggable
                            key={exercise.title + i}
                            draggableId={exercise.title + i}
                            index={i}
                          >
                            {(provided, snapshot) => (
                              <ListItem
                                // key={exercise.title + i}
                                onClick={() => editExercise(i)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    editExercise(i);
                                    e.preventDefault();
                                  }
                                }}
                                ContainerComponent="li"
                                ContainerProps={{ ref: provided.innerRef }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ListItemAvatar>
                                  <Avatar>
                                    <QuestionAnswerTwoTone />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={`${exercise.title} (#${i + 1}) ${
                                    exercise.section ? exercise.section : ""
                                  }`}
                                  secondary={exercise.type}
                                />

                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    className={classes.secondaryAction}
                                    aria-label="duplicate"
                                    onClick={(e) => {
                                      duplicateExercise(i);
                                      e.stopPropagation();
                                    }}
                                  >
                                    <FileCopy />
                                  </IconButton>
                                </ListItemSecondaryAction>
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => removeExercise(i)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p>No exercises available.</p>
                      )}
                    </List>
                  </RootRef>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
