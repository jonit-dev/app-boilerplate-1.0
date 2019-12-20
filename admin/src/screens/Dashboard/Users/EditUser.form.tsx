import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setLoading, setActiveModal } from "../../../store/actions/ui.actions";
import { editUser } from '../../../store/actions/user.action';
import { IUser } from '../../../typescript/User.types';
 

interface IProps {
  user: IUser;
  userId: string;
}

export const EditUserForm = ({ user, userId }: IProps) => {
  const classes = useStyles();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [type, setType] = useState(user.type);

  const dispatch = useDispatch();

  useEffect(() => {
    const initActiveModal = async () => {
      await dispatch(setActiveModal("EditUser"));
    };
    initActiveModal();
  }, []);

  const handleSelectChange = (
    setHook,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setHook(event.target.value as string);
  };

  const onEditButtonClick = async () => {
    console.log(`Editing user ${userId}`);

    const payload = {
      name,
      email
    };

    await dispatch(setLoading(true));
    await dispatch(editUser(userId, payload));
    await dispatch(setLoading(false));
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl className={classes.formControl}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
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

      <FormControl className={classes.formControl}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onEditButtonClick();
          }}
        >
          Edit
        </Button>
      </FormControl>
    </form>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flex: 1,
      flexWrap: "wrap"
    },

    formControl: {
      margin: theme.spacing(1),
      flex: "100%"
    }
  })
);
