import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DefaultModal } from '../../../components/Generic/Modal';
import { DefaultScreen } from '../../../components/Screen/DefaultScreen';
import { setLoading } from '../../../store/actions/ui.actions';
import { getUsers } from '../../../store/actions/user.action';
import { ActionType } from '../../../typescript/Form.types';
import { IUser } from '../../../typescript/User.types';
import { AddUserForm } from './AddUser.form';
import { EditUserForm } from './EditUser.form';

export const UsersScreen = () => {
  const classes = useStyles();

  const [actionScreen, setActionScreen] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const dispatch = useDispatch();
  const users = useSelector<any, any>(state => state.userReducer.users);

  useEffect(() => {
    const fetchUsers = async () => {
      await dispatch(setLoading(true));

      await dispatch(getUsers());

      await dispatch(setLoading(false));
    };
    fetchUsers();
  }, [dispatch]);

  const renderRows = () => {
    if (users) {
      return users.map((user: any) => {
        return (
          <TableRow key={user.name}>
            <TableCell component="th" scope="row">
              {user.name}
            </TableCell>
            <TableCell align="right">{user.email}</TableCell>
            <TableCell align="right">{user.type}</TableCell>
            <TableCell align="right">
              <div className={classes.actionContainer}>
                <EditIcon
                  color={"primary"}
                  onClick={() => {
                    setActionScreen(ActionType.EditResource);
                    setSelectedUserId(user._id);
                  }}
                />
                {/* <AddCircleIcon
                  color={"primary"}
                  onClick={() => {
                    setActionScreen(ActionType.AddResource);
                    setSelectedUserId(user._id);
                  }}
                /> */}
                <DeleteIcon
                  color={"primary"}
                  onClick={() => {
                    setActionScreen(ActionType.DeleteResource);
                    setSelectedUserId(user._id);
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        );
      });
    }
    return null;
  };

  const renderActionScreen = actionScreen => {
    if (users) {
      const selectedUser = users.find(
        (user: IUser) => user._id === selectedUserId
      );

      if (selectedUser) {
        switch (actionScreen) {
          case ActionType.AddResource:
            return (
              <DefaultModal
                title={"Add New User"}
                content={<AddUserForm user={selectedUser} />}
              />
            );

          case ActionType.DeleteResource:
            return <AddUserForm user={selectedUser} />;
          case ActionType.EditResource:
            return (
              <DefaultModal
                title={"Edit User"}
                content={
                  <EditUserForm user={selectedUser} userId={selectedUserId} />
                }
              />
            );

          default:
            return null;
        }
      }
    }

    return null;
  };

  return (
    <DefaultScreen title="Users">
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRow}>User</TableCell>
              <TableCell className={classes.tableRow} align="right">
                Email
              </TableCell>
              <TableCell className={classes.tableRow} align="right">
                Type
              </TableCell>
              <TableCell className={classes.tableRow} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>

      {renderActionScreen(actionScreen)}
    </DefaultScreen>
  );
};

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  tableRow: {
    fontWeight: "bold"
  },
  tableContainer: {
    // maxWidth: 650
  },
  actionContainer: {
    display: "flex",
    flex: 1,
    maxWidth: 80,
    justifyContent: "space-around",
    marginLeft: "auto"
  }
});
