import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import showdown from "showdown";
import styled from "styled-components";
const converter = new showdown.Converter();

const StyledPreview = styled.div`
  [data-input] {
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#feeac4),
      to(#feeac4)
    );
    background-image: -webkit-linear-gradient(#feeac4, #feeac4);
    background-image: -o-linear-gradient(#feeac4, #feeac4);
    background-image: linear-gradient(#feeac4, #feeac4);
    text-decoration: underline;
  }
`;

export default function ExerciseFillInTheBlankEditor({
  fillInPreviewArea,
  setFillInPreviewArea,
}) {
  const [html, setHtml] = useState(
    fillInPreviewArea ? fillInPreviewArea.html : ""
  );

  const replaceBlanks = (str) => {
    console.log(str);
    return str.replace(
      /___/g,
      '<button data-answer-slot="true" title="Answer Slot"></button>'
    );
  };

  const handleChange = (e) => {
    setHtml(replaceBlanks(converter.makeHtml(e.target.value)));
    setFillInPreviewArea({
      source: e.target.value,
      html: replaceBlanks(converter.makeHtml(e.target.value)),
    });
  };
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="h5">Markdown (with HTML support)</Typography>
        <TextField
          value={fillInPreviewArea ? fillInPreviewArea.source : ""}
          onChange={handleChange}
          helperText="Use '___' (3x) for blanks."
          label="Source Text"
          rows="10"
          multiline
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">Preview</Typography>
        <StyledPreview dangerouslySetInnerHTML={{ __html: html }} />
      </Grid>
    </Grid>
  );
}
