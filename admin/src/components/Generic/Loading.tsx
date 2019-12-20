import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

 
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: 1,
      width: '100%',
      padding: theme.spacing(3, 2),
      minHeight: 200,
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
);
