import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function VocabularyEditor({ vocabulary, setVocabulary }) {
  const tsvToList = str => str.split('\n').map(item => item.split('\t'));

  const [list, setList] = useState(vocabulary ? vocabulary.list : []);
  const [tsv, setTsv] = useState(vocabulary ? vocabulary.source : []);

  const handleChange = e => {
    setTsv(e.target.value);
    setList(tsvToList(e.target.value));

    setVocabulary({
      source: e.target.value,
      list: tsvToList(e.target.value)
    });
  };
  return (
    <Grid container spacing={2}>
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
  );
}
