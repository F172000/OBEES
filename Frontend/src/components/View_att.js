import { Button, Card, Menu, TextField } from "@mui/material";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import {
  getCourseById,
  viewAttendance,
  getExtraAttendance,
  addExtraAttendance,
  updateAttendance,
} from "../apiCalls";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import Menue from "./Menue";
import { UserContext } from "../context/UserContext";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
borderRadius:'0.2em',
border:'1px solid #346448',
  boxShadow: 24,
  p: 4,
};
export default function View_Att() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const apiRef = useRef(null);
  // const [rows, setRows] = useState([]);
  // const [columns, setColumns] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [attendanceTable, setAttendanceTable] = useState(null);
  const [course, setCourse] = useState(null);
  const [extraAttendance, setExtraAttendacne] = useState();
  const [extraExist, setExtraExist] = useState("");
  const [stateUpdated, setStateUpdated] = useState(false);
  const { id } = useParams();
  const [updatedCellValue, setUpdatedCellValue] = useState({
    id: "",
    field: "",
    value: "",
  });

  useEffect(() => {
    setStateUpdated(false);
    fetchExtraAttendance();
    fetchAttendance();
    fetchCourseData();
  }, [stateUpdated]);

  const fetchExtraAttendance = async () => {
    try {
      const res = await getExtraAttendance({ id: id });
      if (res) {
        console.log("Res", res);
        setExtraAttendacne(res.data.result[0].percentage);
        if (res.data.result[0].percentage > 0) {
          setExtraExist(
            "Extra " +
              res.data.result[0].percentage +
              " % has been added to the total attendance of each student."
          );
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchCourseData = async () => {
    try {
      const res = await getCourseById({ id: id });
      if (res && res.data.length > 0) {
        setCourse(res.data[0]);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await viewAttendance({ id: id });
      if (response) {
        setAttendanceTable(response.data.attendanceTable);
        console.log(response.data.attendanceTable);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleSubmit = async () => {
    try {
      var res = await addExtraAttendance({
        id: id,
        percentage: extraAttendance,
      });
      if (res) {
        console.log("Res", res);
        handleClose();
        toast.success("Attendance Percentage Updated");
        setStateUpdated(true);
      }
    } catch (error) {
      toast.success("Error Cannot update percentage.");
      console.log("Error", error);
    }
  };

  // const handleCellEditCommit = async (params) => {
  //   console.log("Updated");
  //   const { field, id } = params;
  //   console.log("Params", params);
  //   const columnField = field; // Column field of the edited cell
  //   const columnIndex = columns.findIndex(
  //     (column) => column.field === columnField
  //   ); // Column index of the edited cell
  //   const date = columns[columnIndex].headerName; // Date value from the header of the edited column

  //   console.log("Date:", date);
  //   console.log("Row ID:", id);
  //   // console.log("Value:", updatedValue);

  //   // const studentAttendance = attendanceTable.data.find(
  //   //   (studentAttendance) => studentAttendance.studentId === id
  //   // );

  //   // if (studentAttendance) {
  //   //   const { attendanceIds } = studentAttendance;
  //   //   const dateIndex = parseInt(field.replace("date_", "")) - 1;

  //   //   if (attendanceIds && attendanceIds[dateIndex]) {
  //   //     const attendanceId = attendanceIds[dateIndex];
  //   //     console.log("Att ID", attendanceId);

  //   //     try {
  //   //       // await updateAttendance(attendanceId, updatedValue);

  //   //       const updatedAttendance = [...studentAttendance.attendance];
  //   //       updatedAttendance[dateIndex] = "0000";
  //   //       console.log(updatedAttendance[dateIndex]);
  //   //       const updatedRows = attendanceTable.data.map((row) =>
  //   //         row.studentId === id
  //   //           ? { ...row, attendance: updatedAttendance }
  //   //           : row
  //   //       );

  //   //       setAttendanceTable((prevState) => ({
  //   //         ...prevState,
  //   //         data: updatedRows,
  //   //       }));
  //   //     } catch (error) {
  //   //       console.error("Error: ", error);
  //   //     }
  //   //   }
  //   // }
  // };

  var rows = [];
  var columns = [];
  if (attendanceTable) {
    const sortedDates = attendanceTable.dates
      .map((date, index) => ({ date, index }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort the dates with their corresponding indices

    rows = attendanceTable.data.map((studentAttendance) => ({
      id: studentAttendance.studentId,
      reg_no: studentAttendance.studentRollNo,
      name: studentAttendance.studentName,
      ...studentAttendance.attendance.reduce(
        (rowData, status, index) => ({
          ...rowData,
          [`date_${index + 1}`]: status,
        }),
        {}
      ),
      percent:
        studentAttendance.attendancePercentage || extraAttendance
          ? Math.min(
              parseFloat(extraAttendance || 0) +
                parseFloat(studentAttendance.attendancePercentage),
              100
            ).toFixed(2)
          : 0.0,
    }));

    var editable = false;
    if (user.type == 0) {
      editable = true;
    }

    columns = [
      { field: "reg_no", type: "number", headerName: "Reg No.", width: 90,headerClassName: "column-header" },
      { field: "name", headerName: "Name", width: 300,headerClassName: "column-header" },
      ...sortedDates.map((dateObj) => ({
        field: `date_${dateObj.index + 1}`,
        headerName: dateObj.date,
        width: 90,
        editable: editable,headerClassName: "column-header"
      })),
      { field: "percent", headerName: "Percent", width: 90 ,headerClassName: "column-header"},
    ];

    // Sort the rows based on the sorted dates
    const sortedRows = rows.map((row) => {
      const sortedRow = { ...row };
      sortedDates.forEach((dateObj) => {
        const { index } = dateObj;
        const fieldName = `date_${index + 1}`;
        sortedRow[fieldName] = row[fieldName];
      });
      return sortedRow;
    });
    rows = sortedRows;
  }



  const processRowUpdate = React.useCallback(
    async (newRow) => {
      // Make the HTTP request to save in the backend
      const response = newRow;
      console.log(newRow);
      const updates = []; // Array to hold the updates

      for (const key in newRow) {
        if (Object.hasOwnProperty.call(newRow, key)) {
          const value = newRow[key];
          if (columns.length > 0 && key.includes("date_")) {
            const columnIndex = columns.findIndex(
              (column) => column.field === key
            );
            const date = columns[columnIndex].headerName;
            updates.push({ date, value }); // Add the date and value to the updates array
          }
        }
      }

      // console.log("Date:", date);
      console.log("Updates:", updates);
      console.log({ children: "User successfully saved", severity: "success" });

      try {
        var res = await updateAttendance({
          updates: updates,
          id: newRow.reg_no,
          course: id,
        });
        if (res) {
          console.log("Response ", res);
          toast.success("Attendance Updated");
        }
      } catch (error) {
        toast.error("Failed to Update Attendance");
        console.log("Error", error);
      }

      return response;
    },
    [columns]
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log({ children: error.message, severity: "error" });
  }, []);

  const getRowClassName = (params) => {
    const percent = parseFloat(params.row.percent);
    return percent < 70 ? "yellow-row" : "";
  };

  return (
    <div className="m-5">
      <style>
        {`
          .yellow-row {
            background-color: yellow;
          }
        `}
      </style>
      <Card style={{ padding: 60 }}>
        <Menue />
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h5 className="pb-2 ">
              <b className="me-4  weightportion">Course Name: {course?.name}</b>
              {/* <b class="weightportion">Course Code: {course?.courseCode}</b> */}
              <b class="weightportion">Course Type: {course?.courseType}</b>
            </h5>
          </div>
          <div className="my-auto">
            {/* <Button
              onClick={handleOpen}
              variant="contained"
              size="small"
              className="my-auto"
              style={{ backgroundColor: "#346448", marginTop: 34 }}
            >
              Add Extra Attendance
            </Button> */}
          </div>
          {/* <div className="col-12">{extraExist}</div> */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Extra Attendance Percentage.
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Allowed values 0 - 100
              </Typography>
              <TextField
                fullWidth
                className="my-3 inputfield"
                id="outlined-basic"
                value={extraAttendance}
                onChange={(e) => {
                  const input = e.target.value;
                  if (
                    input === "" ||
                    (/^\d*$/.test(input) &&
                      parseInt(input) >= 0 &&
                      parseInt(input) <= 100)
                  ) {
                    // Allow empty input or enforce minimum and maximum values for numeric input
                    setExtraAttendacne(input === "" ? "" : parseInt(input));
                  }
                }}
                placeholder="Enter Percentage"
                variant="outlined"
              />

              <Button
                onClick={handleSubmit}
                variant="contained"
                size="small"
                className="my-2"
                style={{ backgroundColor: "#346448", marginTop: 34 }}
              >
                Save
              </Button>
            </Box>
          </Modal>
        </div>
        <div>
          <DataGrid
            style={{ height: 1050, width: "100%" }}
            rows={rows}
            columns={columns}
            pageSize={30}
            // apiRef={apiRef}
            // onGridReady={handleGridReady}
            rowsPerPageOptions={[30]}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            getRowClassName={getRowClassName}
            //  processCellUpdate={handleCellEditCommit}
            // onCellEditStop={handleCellEditCommit}
          />
        </div>
      </Card>
    </div>
  );
}
