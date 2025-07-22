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
export default function TitlepageImageSelect({
  images,
  setLessonImage,
  selectedImage
}) {
  const classes = useStyles();

  const selectImage = relativePath => {
    const lessonImage = images.find(img => img.relativePath === relativePath);
    setLessonImage(lessonImage);
  };

  return images ? (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="titlepage-image">
          Lesson Title Page Image
        </InputLabel>
        <Select
          value={selectedImage ? selectedImage.relativePath : ''}
          onChange={e => selectImage(e.target.value)}
          inputProps={{
            name: 'img',
            id: 'titlepage-image'
          }}
        >
          {images.map(img => (
            <MenuItem key={img.relativePath} value={img.relativePath}>
              {img.relativePath}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  ) : (
    <p>Loading....</p>
  );
}
