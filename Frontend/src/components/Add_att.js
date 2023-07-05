import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Card, Box, Radio, Button } from "@mui/material";
import { getStudentsByCourse, saveAttendanece } from "../apiCalls";
import { toast } from "react-toastify";
import Menue from "./Menue";

export default function Add_Attendance() {
  const [students, setStudents] = useState([]);
  const [dateTime, setDateTime] = useState();

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
            attendance: "P", // Initialize attendance value for each student
          }))
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleChange = (event, studentId) => {
    const { value } = event.target;
    console.log(value);
    console.log(studentId);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.rollNo == studentId
          ? { ...student, attendance: value }
          : student
      )
    );
  };

  const handleSubmit = async () => {
    if (!dateTime) {
      toast.error("Please Select Date");

      return;
    }
    try {
      console.log(dateTime);
      var res = await saveAttendanece({
        date: dateTime,
        attendance: students,
        courseId: id,
      });
      if (res) {
        toast.success("Attendance Saved for date " + dateTime);
      }
    } catch (error) {
      if (error.response.status == 400) {
        toast.error("Attendance already exists for the given course and date");
      } else {
        toast.error("Error! Failed to save attendance");
      }
      console.log("Error", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "rollNo",
      headerName: "Roll No.",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 3,
      headerClassName: "column-header",
    },
    {
      field: "attendance",
      headerName: "Attendance",
      flex: 1,
      headerClassName: "column-header",
      renderCell: (params) => {
        const { rollNo, attendance } = params.row;
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Radio
              checked={attendance === "P"}
              onChange={(event) => handleChange(event, rollNo)}
              value="P"
              className="text-success"
              name={`radio-buttons-${rollNo}`}
              componentsProps={{ input: { "aria-label": "P" } }}
            />
            <Radio
              checked={attendance === "A"}
              onChange={(event) => handleChange(event, rollNo)}
              value="A"
              className="text-danger"
              name={`radio-buttons-${rollNo}`}
              componentsProps={{ input: { "aria-label": "A" } }}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <div className="m-5">
      <Card style={{ padding: 60 }}>
        <Menue />
        <div className="row " style={{ marginBottom: 10 }}>
          <div className="col-md-10">
            <h5>Date and Time</h5>
            <input
              className="form-control"
              type="date"
              value={dateTime}
              placeholder="Select Date"
              max={new Date().toISOString().split("T")[0]} // Set max attribute to present date
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>
          <div className="col-md-2 ">
            <Button
              onClick={() => handleSubmit()}
              fullWidth
              variant="contained"
              size="small"
              style={{ backgroundColor: "#346448", marginTop: 34 }}
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
