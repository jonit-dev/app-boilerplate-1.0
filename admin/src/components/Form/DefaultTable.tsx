import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';

interface IProps {
  resource: string;
  data: object[];
  editCallback: () => void;
  addCallback: () => void;
  deleteCallback: () => void;
}

export const DefaultTable = ({
  resource,
  data,
  editCallback,
  addCallback,
  deleteCallback
}: IProps) => {
  const classes = useStyles();

  const renderActionButtons = () => {
    return (
      <TableCell align="right">
        <div className={classes.actionContainer}>
          <EditIcon color={"primary"} onClick={() => editCallback()} />
          <AddCircleIcon color={"primary"} onClick={() => addCallback()} />
          <DeleteIcon color={"primary"} onClick={() => deleteCallback()} />
        </div>
      </TableCell>
    );
  };

  const renderItem = () => {
    return data.map(item => {
      renderRows(item);
      renderActionButtons();
    });
  };

  const renderRows = item => {
    const rows = Object.values(item);

    console.log(rows);

    if (rows) {
      return rows.map((rows: any, index) => {
        if (index === 0) {
          return (
            <TableCell component="th" scope="row" key={index}>
              {rows}
            </TableCell>
          );
        }

        return (
          <TableCell align="right" key={index}>
            {rows}
          </TableCell>
        );
      });
    }
    return null;
  };

  const renderHeaders = () => {
    const headers = Object.keys(data);

    console.log(headers);

    return headers.map((header, index) => {
      if (index === 0) {
        return (
          <TableCell className={classes.tableRow} key={index}>
            {header}
          </TableCell>
        );
      } else {
        return (
          <TableCell className={classes.tableRow} align="right" key={index}>
            {header}
          </TableCell>
        );
      }
    });
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {renderHeaders()}
            <TableCell className={classes.tableRow} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>{renderItem()}</TableRow>
        </TableBody>
      </Table>
    </TableContainer>
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
    maxWidth: 650
  },
  actionContainer: {
    display: "flex",
    flex: 1,
    maxWidth: 80,
    justifyContent: "space-around",
    marginLeft: "auto"
  }
});
