import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Card, Box, Radio, Button } from "@mui/material";
import { getStudentsByCourse } from "../apiCalls";
import Menue from "./Menue";

export default function Add_Attendance() {
  const [students, setStudents] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchStudents();
  }, [id]);

  const fetchStudents = async () => {
    try {
      const res = await getStudentsByCourse({ id: id });
      if (res) {
        setStudents(
          res.data.map((student) => ({
            ...student,
            attendance: "p", // Initialize attendance value for each student
          }))
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleChange = (event, studentId) => {
    const { value } = event.target;
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, attendance: value } : student
      )
    );
  };


  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "rollNo", headerName: "Roll No.", flex: 1 },
    { field: "name", headerName: "Name", flex: 3 },
    {
      field: "attendance",
      headerName: "Attendance",
      flex: 1,
      renderCell: (params) => {
        const { id, attendance } = params.row;
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Radio
              checked={attendance === "p"}
              onChange={(event) => handleChange(event, id)}
              value="p"
              name={`radio-buttons-${id}`}
              componentsProps={{ input: { "aria-label": "P" } }}
            />
            <Radio
              checked={attendance === "a"}
              onChange={(event) => handleChange(event, id)}
              value="a"
              name={`radio-buttons-${id}`}
              componentsProps={{ input: { "aria-label": "A" } }}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <div className="m-5">
      <Card style={{ padding: 70 }}>
        <Menue/>
        <div className="row " style={{ marginBottom: 10 }}>
          <div className="col-md-10">
            <h5>Date and Time</h5>
            <input
              className="form-control"
              type="datetime-local"
              placeholder="Select Date and time"
            ></input>
          </div>
          <div className="col-md-2 ">
            <Button
              fullWidth
              variant="contained"
              size="small"
              style={{ backgroundColor: "#51BE78", marginTop: 34 }}
            >
              Submit
            </Button>
          </div>
        </div>
        <DataGrid
          style={{ height: 450, width: "100%" }}
          rows={students}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
          getRowId={(row) => row.id} // Set unique identifier for each row
        />
      </Card>{" "}
    </div>
  );
}
