import "./Table.css";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

import EditBroadcastMenu from './EditBroadcastMenu'

import { useDispatch, useSelector } from "react-redux";
import { broadcastFormActions } from "../../store/slices/broadcastFormSlice";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable({ headCells, detailedBroadcasts }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("clueCount");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const dispatch = useDispatch();
  const selectedLog = useSelector(
    (state) => state.myBroadcasts.myBroadcastsFilter
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - detailedBroadcasts.length)
      : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(detailedBroadcasts, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, detailedBroadcasts]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={detailedBroadcasts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={detailedBroadcasts.length}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const options = {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                };
                const labelId = `enhanced-table-checkbox-${index}`;
                const broadcastImg = `/hidden/broadcast/${row.broadcastName}.png`;
                const casketImg = `/hidden/other/Reward_casket_(${row.clueTier}).png`;
                const displayName = row.broadcastName.replaceAll("_", " ");
                const displayDate = row.dateReceived
                  ? new Date(row.dateReceived).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })
                  : "-";

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.broadcastId}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="center">
                      <EditBroadcastMenu id={row.broadcastId}/>
                    </TableCell>
                    <TableCell align="center">
                      <img src={casketImg} alt="Casket of Broadcast" />
                    </TableCell>
                    <TableCell className="broadcast-image-col" align="center">
                      <img
                        src={broadcastImg}
                        alt="Image of Broadcast"
                        align="center"
                        className="broadcast-image"
                      />
                    </TableCell>
                    <TableCell>{displayName}</TableCell>
                    <TableCell align="right">#{row.broadcastCount?.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      {row.clueCount === "" ? "-" : row.clueCount?.toLocaleString()}
                    </TableCell>
                    <TableCell
                      id={labelId}
                      scope="row"
                      padding="normal"
                    >
                      {displayDate}
                    </TableCell>
                    <TableCell
                      id={labelId}
                      scope="row"
                      padding="normal"
                      align="right"
                    >
                      {row.sellPrice === null ? "-" :row.sellPrice?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={detailedBroadcasts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
