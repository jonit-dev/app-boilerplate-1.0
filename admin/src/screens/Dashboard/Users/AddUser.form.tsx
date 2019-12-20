import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

import { IUser } from '../../../typescript/User.types';

interface IProps {
  user: IUser;
}

export const AddUserForm = ({ user }: IProps) => {
  const classes = useStyles();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [type, setType] = useState(user.type);

  const handleSelectChange = (
    setHook,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setHook(event.target.value as string);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <TextField
          label="Name"
          fullWidth
          value={""}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          value={""}
          onChange={e => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          onChange={event => handleSelectChange(setType, event)}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Default">Default</MenuItem>
          <MenuItem value="Staff">Staff</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flex: 1,
      flexWrap: "wrap",
     
    },

    formControl: {
      margin: theme.spacing(1),
      flex: "100%"
    }
  })
);
