import React, { useState } from 'react';
import DialogueEditorForm from './DialogueEditorForm';
import DialogueListing from './DialogueListing';
import { Button } from '@material-ui/core';

export default function DialogueEditor({ dialogues, setDialogues }) {
  const [currentDialogue, setCurrentDialogue] = useState(null);

  const initialState = { id: '', title: '', source: '', list: [] };

  const reset = () => {
    console.log('reset');
    setCurrentDialogue(null);
  };

  const removeDialogue = index => {
    let updatedDialogues = [...dialogues].filter((item, i) => i !== index);
    setDialogues(updatedDialogues);
    reset();
  };

  const editDialogue = i => {
    setCurrentDialogue(dialogues[i]);
  };

  const saveDialogue = payload => {
    // dialogue exists?
    let updatedDialogues = [...dialogues];
    const editingIndex = dialogues.findIndex(item => item.id === payload.id);
    if (editingIndex > -1) {
      updatedDialogues[editingIndex] = payload;
    } else {
      updatedDialogues.push(payload);
    }
    setDialogues(updatedDialogues);

    reset();
  };

  return (
    <div>
      <DialogueListing
        dialogues={dialogues}
        removeDialogue={removeDialogue}
        editDialogue={editDialogue}
      />
      <Button
        fullWidth
        color="primary"
        variant="outlined"
        onClick={() => setCurrentDialogue(initialState)}
      >
        New Dialogue
      </Button>
      {currentDialogue && (
        <DialogueEditorForm
          open={currentDialogue ? true : false}
          dialogue={currentDialogue}
          save={saveDialogue}
          cancel={reset}
        />
      )}
    </div>
  );
}
