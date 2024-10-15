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
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

import { useDispatch, useSelector } from "react-redux";
import { getStandings } from "../../util/helpers/standings";
import { getManagerNames } from "../../util/helpers/sleeper";
import { sleeper_league_ids } from "../../util/constants";

function descendingComparator(a, b, orderBy) {
  if (b.settings[orderBy] < a.settings[orderBy]) {
    return -1;
  }

  if (b.settings[orderBy] > a.settings[orderBy]) {
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
            sortDirection={
              orderBy === headCell.id ? order : false
            }
            colSpan={
              headCell.id === "teamName" || headCell.id === "leagueName" ? 2 : 1
            }
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function StandingsTable({ headCells, rostersUsers }) {
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("powerScore");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  let standings = getStandings(rostersUsers);

  const dispatch = useDispatch();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "desc";
    setOrder(isAsc ? "asc" : "desc");
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - standings.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(standings, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, standings]
  );

  console.log(orderBy);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }} id="standings">
        {/* <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={standings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ border: '1px white solid', color: 'white'}}
        /> */}
        <TableContainer id="standings" sx={{ borderRadius: 0 }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={standings.length}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                let league = sleeper_league_ids.filter((league) => {
                  return league.id === row.league_id;
                });

                let selectedRostersUsers = rostersUsers.filter((rosterUser) => {
                  return rosterUser.leagueName === league[0].name;
                });

                let managerNames = getManagerNames(
                  selectedRostersUsers[0].rosters,
                  selectedRostersUsers[0].users,
                  row.roster_id
                );

                let fpts = row.settings.fpts + row.settings.fpts_decimal * 0.01;
                let fpts_against =
                  row.settings.fpts_against +
                  row.settings.fpts_against_decimal * 0.01;
                let ppts = row.settings.ppts + row.settings.ppts_decimal * 0.01;

                row.settings["accuracy"] =
                  Math.round((fpts / ppts) * 1000) / 10;
                row.settings["differential"] =
                  Math.round((fpts - fpts_against) * 100) / 100;
                row.settings["powerScore"] =
                  row.settings.wins * 200 + row.settings.fpts;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.owner_id}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* <TableCell align="center">{index + 1}</TableCell> */}
                    <TableCell className="name" align="center" colSpan={2}>
                      {league[0].name}
                    </TableCell>
                    <TableCell className="name" align="center" colSpan={2}>
                      {managerNames.teamName}{" "}
                      <div>({managerNames.managerName})</div>
                    </TableCell>
                    <TableCell className="stat" align="center">
                      {row.settings.powerScore}
                    </TableCell>
                    <TableCell className="stat" align="center">
                      {" "}
                      {row.settings.wins}
                    </TableCell>
                    <TableCell className="stat" align="center">
                      {row.settings.losses}
                    </TableCell>
                    <TableCell className="stat" align="center">
                      {fpts}
                    </TableCell>
                    <TableCell className="stat" align="center">
                      {ppts}
                    </TableCell>
                    <TableCell className="stat" align="center">
                      {row.settings.accuracy}%
                    </TableCell>
                    <TableCell className="stat" align="center">
                      {fpts_against}
                    </TableCell>
                    <TableCell
                      className={
                        row.settings["differential"] > 0
                          ? "positive state"
                          : "negative stat"
                      }
                      align="center"
                    >
                      {row.settings.differential}
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
                  <TableCell colSpan={12} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={standings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ border: '2px white solid', color: 'white'}}
        /> */}
      </Paper>
    </Box>
  );
}
