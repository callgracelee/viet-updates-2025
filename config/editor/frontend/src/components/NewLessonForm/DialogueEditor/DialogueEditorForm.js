import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FullScreenDialog from '../../FullScreenDialog';

export default function DialogueEditor({ dialogue, save, cancel, open }) {
  const tsvToList = str => str.split('\n').map(item => item.split('\t'));

  const [list, setList] = useState(dialogue.list);
  const [tsv, setTsv] = useState(dialogue.source);
  const [id, setId] = useState(dialogue.id);
  const [title, setTitle] = useState(dialogue.title);

  const handleChange = e => {
    setTsv(e.target.value);
    setList(tsvToList(e.target.value));
  };

  const handleSave = () => {
    save({
      source: tsv,
      list,
      id,
      title
    });
  };

  return (
    <FullScreenDialog
      open={open}
      handleDialogClose={cancel}
      save={handleSave}
      cancel={cancel}
      title="Dialogue Editor">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Dialogue ID"
            helperText="examples: 1, 2"
            value={id}
            margin="normal"
            variant="outlined"
            onChange={e => setId(e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Dialogue Title"
            value={title}
            margin="normal"
            variant="outlined"
            onChange={e => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">TSV</Typography>
          <TextField
            value={tsv}
            onChange={handleChange}
            helperText="Copy and paste table cells directly from Google Sheets"
            label="Source TSV"
            rows="10"
            multiline
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Table Preview</Typography>
          {list.length > 0 && (
            <table>
              <tbody>
                {list.map((row, i) => (
                  <tr key={`row-${i}`}>
                    {row.map(cell => (
                      <td key={cell} style={{ border: '1px solid black' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Grid>
      </Grid>
    </FullScreenDialog>
  );
}
