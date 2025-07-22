import React, { useState } from 'react';
import ReadaloudEditorForm from './ReadaloudEditorForm';
import ReadaloudListing from './ReadaloudListing';
import { Button } from '@material-ui/core';

export default function ReadaloudEditor({ readalouds, setReadalouds }) {
  const [currentReadaloud, setCurrentReadaloud] = useState(null);

  const initialState = { id: '', title: '', html: '' };

  const reset = () => {
    console.log('reset');
    setCurrentReadaloud(null);
  };

  const removeReadaloud = index => {
    console.log('remove readaloud');
    let updatedReadalouds = [...readalouds].filter((item, i) => i !== index);
    setReadalouds(updatedReadalouds);
    reset();
  };

  const editReadaloud = i => {
    console.log('edit readaloud');
    setCurrentReadaloud(readalouds[i]);
  };

  const saveReadaloud = payload => {
    // readaloud exists?
    let updatedReadalouds = [...readalouds];
    const editingIndex = readalouds.findIndex(item => item.id === payload.id);
    if (editingIndex > -1) {
      updatedReadalouds[editingIndex] = payload;
    } else {
      updatedReadalouds.push(payload);
    }
    setReadalouds(updatedReadalouds);

    reset();
  };

  return (
    <div>
      <ReadaloudListing
        readalouds={readalouds}
        removeReadaloud={removeReadaloud}
        editReadaloud={editReadaloud}
      />
      <Button
        fullWidth
        color="primary"
        variant="outlined"
        onClick={() => setCurrentReadaloud(initialState)}
      >
        New Readaloud
      </Button>
      {currentReadaloud && (
        <ReadaloudEditorForm
          open={currentReadaloud ? true : false}
          readaloud={currentReadaloud}
          save={saveReadaloud}
          cancel={reset}
        />
      )}
    </div>
  );
}
