import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
export default function ExerciseSectionSelect({ section, setSection }) {
  const classes = useStyles();

  const types = [
    { val: 'reading-comprehension', name: 'Reading Comprehension' },
    { val: 'vocabulary', name: 'Vocabulary' },
    { val: 'structure', name: 'Structure' },
    { val: 'listening-activities', name: 'Listening Activities' }
  ];

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="reading-section-key">Reading Section</InputLabel>
        <Select
          value={section}
          onChange={setSection}
          inputProps={{
            name: 'reading-section-key',
            id: 'reading-section-key'
          }}>
          {types.map(type => (
            <MenuItem key={type.name} value={type.val}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
}
