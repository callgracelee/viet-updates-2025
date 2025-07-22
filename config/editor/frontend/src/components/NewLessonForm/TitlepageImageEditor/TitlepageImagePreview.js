import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  root: {
    width: '50%',
    margin: '1em auto',
    textAlign: 'center'
  },
  img: {
    height: '300px'
  }
}));

export default function ImagePreview({ selectedImage, children }) {
  const classes = useStyles();
  return selectedImage ? (
    <Card className={classes.root}>
      {children}
      <img
        className={classes.img}
        src={`data:image/jpg;base64,${selectedImage.base64}`}
        alt={selectedImage.filename}
      />
    </Card>
  ) : (
    <>
      {children}
      <Typography>No preview available. Select an image.</Typography>
    </>
  );
}
