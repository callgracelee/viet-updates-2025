import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import exerciseTypes from '../../../exerciseTypes';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 auto',
    width: '100%'
  },
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));
export default function ExerciseTypeSelect({ exerciseType, setExerciseType }) {
  const classes = useStyles();

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="exercise-type">Exercise Type</InputLabel>
        <Select
          value={exerciseType ? exerciseType : ''}
          onChange={setExerciseType}
          inputProps={{
            name: 'exercise-type',
            id: 'exercise-type'
          }}>
          {exerciseTypes.map(type => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
}
