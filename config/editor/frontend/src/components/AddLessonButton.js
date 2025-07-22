import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    marginLeft: 'auto',
    justifyContent: 'center'
  }
}));

function AddLessonButton({ lessons, history }) {
  const classes = useStyles();
  // guess the next lesson to preload some of the stuff

  return (
    <Link to={{ pathname: '/edit' }}>
      <Button className={classes.root} color="primary">
        Add Lesson
        <AddIcon />
      </Button>
    </Link>
  );
}

export default withRouter(AddLessonButton);
