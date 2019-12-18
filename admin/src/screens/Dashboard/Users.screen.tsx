import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';

import { DefaultScreen } from '../../components/Screen/DefaultScreen';
import { APIHelper } from '../../helpers/APIHelper';
import { RequestTypes } from '../../typescript/Request.types';

export const UsersScreen = () => {
  const classes = useStyles();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await APIHelper.request(
        RequestTypes.GET,
        "/users",
        {},
        true
      );

      if (response) {
        setUsers(response.data);
      }
    };
    fetchUsers();
  }, []);

  const renderRows = () => {
    if (users) {
      return users.map((user: any) => {
        return (
          <TableRow key={user.name}>
            <TableCell component="th" scope="row">
              {user.name}
            </TableCell>
            <TableCell align="right">{user.email}</TableCell>
          </TableRow>
        );
      });
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
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>
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
  }
});
