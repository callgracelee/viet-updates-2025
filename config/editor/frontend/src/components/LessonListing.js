import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  list: {
    margin: '1em 0',
    padding: '0'
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
    textTransform: 'uppercase'
  }
}));

function LessonListing({ lessons, removeLesson }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {lessons.map(lesson => (
          <Link
            to={{ pathname: `/edit/${lesson.lessonId}` }}
            key={lesson.lessonId}
          >
            <ListItem>
              <Typography className={classes.heading}>
                Lesson {lesson.lessonId}
              </Typography>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Delete"
                  onClick={e => {
                    e.preventDefault();
                    removeLesson(lesson.lessonId);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
}

export default withRouter(LessonListing);
