import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionTwoTone from '@material-ui/icons/DescriptionTwoTone';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

export default function LessonPageListing({ page }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ListItem>
        <ListItemIcon>
          <DescriptionTwoTone />
        </ListItemIcon>
        <ListItemText primary={page.data && page.data.title} />
      </ListItem>
    </div>
  );
}
