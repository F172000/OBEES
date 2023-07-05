import { Button, Card, Grid, Radio, RadioGroup } from "@mui/material";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";

export default function AttendanceHod() {
  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const buttonStyles = {
    backgroundColor: "#346448",
    marginRight: "10.5em",
    padding: "px 15px",
    "&:hover": {
      backgroundColor: "#346448", // Ensures hover doesn't change the color
    },
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "reg_no", headerName: "Reg No.", flex: 1 },
    { field: "name", headerName: "Name", flex: 3 },
    {
      field: "attendance_p",
      headerName: "Present",
      flex: 0.5,
      renderCell: () => {
        return (
          <>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Radio
                checked={selectedValue === "a"}
                onChange={handleChange}
                value="a"
                color="success"
                name="radio-buttons"
                componentsProps={{ input: { "aria-label": "A" } }}
              />
            </Box>
          </>
        );
      },
    },
    {
      field: "attendance_a",
      headerName: "Absent",
      flex: 0.5,
      renderCell: () => {
        return (
          <>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Radio
                checked={selectedValue === "b"}
                onChange={handleChange}
                value="b"
                name="radio-buttons"
                componentsProps={{ input: { "aria-label": "B" } }}
              />
            </Box>
          </>
        );
      },
    },
    {
      field: "attendance_l",
      headerName: "Leave",
      flex: 0.5,
      renderCell: () => {
        return (
          <>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Radio
                checked={selectedValue === "l"}
                onChange={handleChange}
                value="l"
                name="radio-buttons"
                componentsProps={{ input: { "aria-label": "L" } }}
              />
            </Box>
          </>
        );
      },
    },
  ];
  const rows = [
    { id: 1, reg_no: 3866, name: "Sidra Rehman Afridi" },
    { id: 2, reg_no: 3866, name: "Sidra Rehman Afridi" },
    { id: 3, reg_no: 3866, name: "Sidra Rehman Afridi" },
    { id: 4, reg_no: 3866, name: "Sidra Rehman Afridi" },
    { id: 5, reg_no: 3866, name: "Sidra Rehman Afridi" },
  ];
  return (
    <div className="m-5">
      <Card style={{ padding: 70 }}>
        <div className="row " style={{ marginBottom: 10 }}>
          <div className="col-md-10">
            <h5>Date and Time </h5>
            <input
              className="form-control"
              type="datetime-local"
              placeholder="Select Date and time"
            ></input>
          </div>
          <div className="col-md-2 ">
            <Button
              fullWidth
              style={buttonStyles}
              variant="contained"
              size="small"
             className="mt-5"
            >
              Submit
            </Button>
          </div>
        </div>
        <DataGrid
          style={{ height: 450, width: "100%" }}
          rows={rows}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
        />
      </Card>{" "}
    </div>
  );
}
