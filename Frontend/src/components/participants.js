import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStudentsByCourse, enrollStudent } from "../apiCalls";
import Menue from "./Menue";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { toast } from "react-toastify";
import CSVReader from "react-csv-reader";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";

export default function Participants() {
  const [students, setStudents] = useState();
  const [participants, setParticipants] = useState();
  const [openenroll, setopenenroll] = React.useState(false);
  const handleopenenroll = () => setopenenroll(true);
  const handleCloseenroll = () => setopenenroll(false);
  const { id } = useParams();
  useEffect(() => {
    fetchStudetns();
  }, [id]);
  const buttonStyles = {
    backgroundColor: "#346448",
    "&:hover": {
      backgroundColor: "#346448", // Ensures hover doesn't change the color
    },
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #346448",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };
  const fetchStudetns = async () => {
    try {
      var res = await getStudentsByCourse({ id: id });
      if (res) {
        console.log("Res", res);
        setParticipants(res.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleFileChange = (data) => {
    setStudents("");
    setStudents(data);
    console.log(students);
    console.log(data);
  };

  const uploadCSVFile = async () => {
    try {
      var res = await enrollStudent({ students: students, courseId: id });
      if (res) {
        fetchStudetns();
        toast.success("Students Enrolled Successfully");
        handleCloseenroll();
      }
    } catch (error) {
      toast.error("Error cannot enroll students.");
      console.log("Error", error);
    }
  };
  return (
    <div className="m-3">
      <Card
        style={{
          padding: "30px",
          marginTop: "5em",
          marginBottom: "5em",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Menue />
        <div className="m-4 d-flex justify-content-center">
          <h3
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#346448",
            }}
          >
            Enrolled Students
          </h3>
          </div>
          <div className="m-4 d-flex justify-content-end">
          <Button
          variant="contained"
          style={buttonStyles}
          onClick={handleopenenroll}
          sx={{ textDecoration: "none",fontSize:'12px',backgroundColor:'#346448' }}
        >
          <PersonAddAlt1Icon
            style={{
              fontSize: "22px",
              color: "#fff",
              marginRight:'3px',
              marginBottom:'2px'
            }}
          />
          Enroll Students
        </Button>
          </div>

        <Modal
          open={openenroll}
          onClose={handleCloseenroll}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2 id="modal-modal-title">Upload CSV File</h2>
            <p>Roll no should be in first column and name in second.</p>
            <CSVReader
              onFileLoaded={(data, fileInfo, originalFile) =>
                handleFileChange(data)
              }
            />

            <Button
            style={buttonStyles}
              variant="contained"
              className="my-3"
              sx={{backgroundColor:'#346448'}}
              onClick={() => uploadCSVFile()}
            >
              Upload
            </Button>
          </Box>
        </Modal>
        <div className="table-repsonsive mt-4 ">
          <table
            className="table table-bordered"
            style={{ textAlign: "center" }}
          >
            <thead className="tableheader">
              <tr>
                <th>
                  <b>Student Name</b>
                </th>
                <th>
                  <b>Registeration No</b>
                </th>
              </tr>
            </thead>
            <tbody>
              {participants?.map((student, index) => {
                return (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
