import React, { useEffect, useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PieChartIcon from "@mui/icons-material/PieChart";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import { Link } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/Preview";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GradingIcon from "@mui/icons-material/Grading";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import Chip from "@mui/material/Chip";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import { Stack } from "@mui/system";
import CSVReader from "react-csv-reader";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { enrollStudent, getClo } from "../apiCalls";
import { toast } from "react-toastify";
import Menue from "./Menue";
import { getCourseById } from "../apiCalls";
const b = {
  color: "#346448",
  width: "100%",
  borderRadius: "13px",
};

export default function Coursedashboard() {
  const { id } = useParams();
  const [clo, setCLO] = React.useState("");
  const [plo, setPLO] = React.useState("");
  const [openenroll, setopenenroll] = React.useState(false);
  const handleopenenroll = () => setopenenroll(true);
  const handleCloseenroll = () => setopenenroll(false);
  const [openclo, setopenclo] = React.useState(false);
  const handleopenclo = () => setopenclo(true);
  const handleCloseclo = () => setopenclo(false);
  const [students, setStudents] = useState(null);
  const [clos, setClos] = useState([]);
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
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #346448",
    borderRadius: "5px",
    boxShadow: 24,
    // backgroundImage:'diamond-gradient(circle at bottom right, #346448, #F5F5F5)',
    p: 4,
  };
  const [course, setCourse] = useState("");
  useEffect(() => {
    fetchClo();
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      var res = await getCourseById({ id: id });
      if (res) {
        console.log("Res", res);
        setCourse(res.data[0]);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchClo = async () => {
    try {
      var res = await getClo({ id: id });
      if (res) {
        setClos(res.data);
      }
    } catch (error) {
      console.log(error);
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
        toast.success("Students Enrolled Successfully");
        handleCloseenroll();
      }
    } catch (error) {
      toast.error("Error cannot enroll students.");
      console.log("Error", error);
    }
  };

  return (
    <div>
      <div className="m-5">
        <Card style={{ padding: 50 }}>
          <Menue />
          <div>
            <Link onClick={handleopenenroll} style={{ textDecoration: "none" }}>
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <PersonAddAlt1Icon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">Enroll Students</p>
                  </div>
                </div>
              </Card>
            </Link>
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
                  variant="contained"
                  className="my-3"
                  style={{ backgroundColor: "#346448" }}
                  onClick={() => uploadCSVFile()}
                >
                  Upload
                </Button>
              </Box>
            </Modal>
            <Link
              to={"/assessmentdashboard/" + id}
              style={{ textDecoration: "none" }}
            >
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1  mt-1" style={{ paddingLeft: "35px" }}>
                    <AssessmentIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">Create Exam</p>
                  </div>
                </div>
              </Card>
            </Link>
            {/* <Link
              to={"/Listofassessments/" + id}
              style={{ textDecoration: "none" }}
            >
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1  mt-1" style={{ paddingLeft: "35px" }}>
                    <AssessmentIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">Exixting Exam</p>
                  </div>
                </div>
              </Card>
            </Link> */}
            <Link
              to={"/addattendance/" + id}
              style={{ textDecoration: "none" }}
            >
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <BeenhereIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">Add Attendance</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link
              to={"/viewattendance/" + id}
              style={{ textDecoration: "none" }}
            >
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <AssignmentTurnedInIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">View Attendance</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to={"/Scoreboard/" + id} style={{ textDecoration: "none" }}>
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <PieChartIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">View Theory Scoreboard</p>
                  </div>
                </div>
              </Card>
            </Link>
            {course.mainCourse == 0 ? (
              <Link
                to={"/FinalScoreboard/" + id}
                style={{ textDecoration: "none" }}
              >
                <Card
                  className="shadow-inner"
                  style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
                >
                  <div className="row m-2">
                    <div
                      className="col-1 mt-1 "
                      style={{ paddingLeft: "35px" }}
                    >
                      <PieChartIcon
                        style={{
                          fontSize: "30px",
                          marginTop: "3px",
                          color: "#346448",
                        }}
                      />
                    </div>
                    <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                      <p className="coursedashpara">View Final Scoreboard</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : null}

            <Link to={"/clo/" + id} style={{ textDecoration: "none" }}>
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <AssessmentIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">View CLO Attainment</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to={"/plo/" + id} style={{ textDecoration: "none" }}>
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <AssessmentIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">View PLO Attainment</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to={"/courseplan/" + id} style={{ textDecoration: "none" }}>
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <HistoryToggleOffIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">View Course Plan</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to={"/feedback/" + id} style={{ textDecoration: "none" }}>
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <ThumbsUpDownIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">Course Feedback</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link onClick={handleopenclo} style={{ textDecoration: "none" }}>
              <Card
                className="shadow-inner"
                style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
              >
                <div className="row m-2">
                  <div className="col-1 mt-1 " style={{ paddingLeft: "35px" }}>
                    <PreviewIcon
                      style={{
                        fontSize: "30px",
                        marginTop: "3px",
                        color: "#346448",
                      }}
                    />
                  </div>
                  <div className="col-11 mt-2" style={{ paddingLeft: "0" }}>
                    <p className="coursedashpara">View Course CLO's</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Modal
              open={openclo}
              onClose={handleCloseclo}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style1}>
                <div className="row">
                  <div className="clo-md-12 d-flex justify-content-center cloheading">
                    Course Learning Outcomes
                  </div>
                </div>
                <div className="row">
                  <div className="clo-md-12 d-flex justify-content-center clodescription">
                    {/* <p>4. Create test cases for the elaborated user stories. [C,3] [PLO-2] </p> */}
                    <ul>
                      {clos.map((clo) => {
                        return <li>{clo.clo}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </Card>
      </div>
    </div>
  );
}
