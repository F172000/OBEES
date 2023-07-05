import {
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const columns = [
  { field: "id", headerName: "ID", width: 40 },
  {
    field: "reg_no",
    type: "number",
    headerName: "Reg No.",
    width: 90,
  },
  { field: "name", headerName: "Name", width: 300 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  { field: "date", headerName: "Date", width: 40 },
  {
    field: "percent",
    type: "number",
    headerName: "percent",
    width: 90,
  },
  {
    field: "action",
    headerName: "Action",
    width: 90,
    renderCell: () => {
      return (
        <>
          <div>
            <EditIcon />
          </div>
        </>
      );
    },
  },
];
const rows = [
  {
    id: 1,
    reg_no: 3866,
    name: "Sidra Rehman Afridi",
    date: "P",
    percent: "80%",
  },
  { id: 2, reg_no: 3277, name: "Wajiha Zahra ", date: "A", percent: "80%" },
  {
    id: 3,
    reg_no: 3865,
    name: "Sidra Rehman Afridi",
    date: "P",
    percent: "70%",
  },
  {
    id: 4,
    reg_no: 3867,
    name: "Sidra Rehman Afridi",
    date: "P",
    percent: "60%",
  },
];

export default function View_Att() {
  const [course, setcourse] = React.useState("");

  return (
    <div className="m-5">
      <Card style={{ padding: 60 }}>
        <h1  className="mb-4 d-flex justify-content-center">View/Edit Attendance</h1>
        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={course}
              label="Credit Hours"
              onChange={(e) => {
                setcourse(e.target.value);
              }}
            >
              <MenuItem value="OOP">OOP</MenuItem>
              <MenuItem value="PF">PF</MenuItem>
              <MenuItem value="ICT">ICT</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <DataGrid
            style={{ height: 1050, width: "100%" }}
            rows={rows}
            columns={columns}
            pageSize={30}
            rowsPerPageOptions={[30]}
          />
        </div>
      </Card>
    </div>
  );
}
