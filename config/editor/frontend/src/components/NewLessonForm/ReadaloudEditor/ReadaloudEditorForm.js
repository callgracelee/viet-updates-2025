import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import TextField from '@material-ui/core/TextField';
import FullScreenDialog from '../../FullScreenDialog';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2)
  }
}));

const GET_READALOUDS = gql`
  query {
    readalouds {
      id
      html
    }
  }
`;

export default function OutlinedTextFields({ readaloud, save, cancel, open }) {
  const { data } = useQuery(GET_READALOUDS);
  const [html, setHtml] = useState(readaloud.html);
  const [title, setTitle] = useState(readaloud.title);
  const [id, setId] = useState(readaloud.id);
  const [selected, setSelected] = useState('');
  const classes = useStyles();

  useEffect(() => {
    if (data && selected && data.readalouds) {
      const [selectedReadaloud] = data.readalouds.filter(
        readaloud => readaloud.id === selected
      );
      setHtml(selectedReadaloud.html);
    }
  }, [data, selected]);

  const handleSave = () => {
    save({ html, title, id });
  };

  const selectChangeHandler = e => {
    setSelected(e.target.value);
  };

  return (
    <FullScreenDialog
      open={open}
      handleDialogClose={cancel}
      save={handleSave}
      cancel={cancel}
      title="Readaloud Editor">
      <TextField
        fullWidth
        label="Readaloud ID"
        helperText="examples: 1, 1a, 1b, or 2"
        value={id}
        margin="normal"
        variant="outlined"
        onChange={e => setId(e.target.value)}
      />
      <TextField
        fullWidth
        label="Readaloud Title"
        value={title}
        margin="normal"
        variant="outlined"
        onChange={e => setTitle(e.target.value)}
      />
      {data && data.readalouds && (
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-readaloud">
            Load HTML from File
          </InputLabel>
          <Select
            fullWidth
            value={selected ? selected : ''}
            onChange={selectChangeHandler}
            inputProps={{
              name: 'select-readaloud',
              id: 'select-readaloud'
            }}>
            {data.readalouds.map(readaloud => (
              <MenuItem key={readaloud.id} value={readaloud.id}>
                {readaloud.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <TextField
        label="Readaloud HTML"
        value={html}
        style={{ margin: 8 }}
        fullWidth
        multiline
        rows="10"
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true
        }}
        onChange={e => setHtml(e.target.value)}
      />
    </FullScreenDialog>
  );
}
