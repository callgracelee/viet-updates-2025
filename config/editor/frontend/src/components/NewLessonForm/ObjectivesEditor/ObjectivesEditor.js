import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ObjectivesListing from './ObjectivesListing';

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '600px',
    margin: '0 auto'
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
});

export default function CustomizedInputBase({
  objectives,
  addObjective,
  removeObjective
}) {
  const classes = useStyles();
  const [currentObjective, setCurrentObjective] = useState('');
  const inputEl = useRef(null);

  const addHandler = e => {
    addObjective(currentObjective);
    setCurrentObjective('');
    inputEl.current.focus();
  };

  return (
    <Paper className={classes.root}>
      <ObjectivesListing
        objectives={objectives}
        removeObjective={removeObjective}
      />
      <InputBase
        className={classes.input}
        value={currentObjective}
        onChange={e => setCurrentObjective(e.target.value)}
        placeholder="add objective"
        inputProps={{ 'aria-label': 'add objective' }}
        inputRef={inputEl}
      />
      <Divider className={classes.divider} />
      <IconButton
        color="primary"
        className={classes.iconButton}
        onClick={addHandler}
        aria-label="add-objective">
        <AddIcon />
      </IconButton>
    </Paper>
  );
}
