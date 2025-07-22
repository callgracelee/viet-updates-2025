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
export default function ExerciseTypeSelect({ audioPlayer, setAudioPlayer }) {
  const classes = useStyles();

  const types = [
    { val: '', name: 'No audio player' },
    { val: 'dialogue1', name: 'Dialogue 1' },
    { val: 'dialogue2', name: 'Dialogue 2' },
    { val: 'reading1', name: 'Reading 1' },
    { val: 'reading1a', name: 'Reading 1A' },
    { val: 'reading1b', name: 'Reading 1B' },
    { val: 'reading1s', name: 'Reading 1S' },
    { val: 'reading2', name: 'Reading 2' },
    { val: 'reading2a', name: 'Reading 2A' },
    { val: 'reading2b', name: 'Reading 2B' },
    { val: 'reading2s', name: 'Reading 2S' }
  ];

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="audio-file-key">Audio File</InputLabel>
        <Select
          value={audioPlayer}
          onChange={setAudioPlayer}
          inputProps={{
            name: 'audio-file-key',
            id: 'audio-file-key'
          }}
        >
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
