import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxLabels({ resourceLinks, setResourceLinks }) {
  return (
    <FormGroup row>
      {Object.keys(resourceLinks).map(key => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={resourceLinks[key]}
              onChange={setResourceLinks(key)}
              value={key}
              color="primary"
            />
          }
          label={key}
        />
      ))}
    </FormGroup>
  );
}
