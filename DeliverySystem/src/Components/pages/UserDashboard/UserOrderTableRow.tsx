import { Typography } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export const UserOrderTableRow = ({ row, index }) => {
  const [open, setOpen] = React.useState(false);
  //get package by id
  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": {
            borderBottom: "unset",
            backgroundColor: index % 2 === 0 ? "white" : "#F5F5F5",
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ fontFamily: '"Montserrat", serif', fontWeight: "medium" }}
        >
          {row.trackingNumber}
        </TableCell>
        <TableCell
          align="center"
          sx={{ fontFamily: '"Montserrat", serif', fontWeight: "medium" }}
        >
          {row.driver}
        </TableCell>
        <TableCell
          align="center"
          sx={{ fontFamily: '"Montserrat", serif', fontWeight: "medium" }}
        >
          {row.recipient}
        </TableCell>
        <TableCell
          align="center"
          sx={{ fontFamily: '"Montserrat", serif', fontWeight: "medium" }}
        >
          {row.destination}
        </TableCell>
        <TableCell
          align="center"
          sx={{ fontFamily: '"Montserrat", serif', fontWeight: "medium" }}
        >
          {row.status}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Package Dimensions</TableCell>
                    <TableCell align="center">Weight</TableCell>
                    <TableCell align="center">Cost</TableCell>
                    <TableCell align="center">Payment method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.trackingNumber}>
                    <TableCell component="th" scope="row">
                      {row.packageDimension}
                    </TableCell>
                    <TableCell align="center">{row.weight}</TableCell>
                    <TableCell align="center">{row.cost}</TableCell>
                    <TableCell align="center">{row.paymentMethod}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
