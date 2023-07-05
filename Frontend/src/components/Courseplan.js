import {
  Grid,
  Button,
  IconButton,
  Card,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useState } from "react";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import {
  AddCoursePlan,
  viewCoursePlan,
  DeleteCoursePlan,
  UpdateCoursePlan,
  getCourseById,
} from "../apiCalls";
import Menue from "./Menue";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "background.paper",
  border: "2px solid #346446",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

export default function Courseplan() {
  const { id } = useParams();
  const [week, setweek] = useState("");
  const [course, setCourse] = useState("");
  const [to, setto] = useState(null);
  const [from, setfrom] = useState(null);
  const [activity, setactivity] = useState("");
  const [topic, settopic] = useState("");
  const [data, setData] = useState([]);
  const [stateChanges, setStateChanges] = useState(false);

  useEffect(() => {
    setStateChanges(false);
    fetchData();
    fetchCourseData();
  }, [stateChanges]);

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
  const fetchData = async () => {
    try {
      var res = await viewCoursePlan({ id: id });
      if (res) {
        console.log("Res", res);
        setData(res.data.Results);
        console.log(res.data.Results);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleSubmit = async () => {
    if (!week || !from || !to || !topic || !activity) {
      toast.error("Fields cannot be empty");
      return;
    }

    const weekData = {
      courseId: id,
      weekNo: week,
      fromDate: new Date(from.substring(0, 10)),
      toDate: new Date(to.substring(0, 10)),
      topicCovered: topic,
      activities: activity,
    };

    weekData.fromDate.setDate(weekData.fromDate.getDate() + 1);
    weekData.toDate.setDate(weekData.toDate.getDate() + 1);

    if (weekData.toDate < weekData.fromDate) {
      toast.error("End date should be greater than start date");
      return;
    }
    // Convert the dates back to string format if needed
    weekData.fromDate = weekData.fromDate.toISOString().substring(0, 10);
    weekData.toDate = weekData.toDate.toISOString().substring(0, 10);

    console.log("Week weekData", weekData);

    const weekExists = data?.some((course) => course.weekNo === week);
    if (weekExists) {
      toast.error("Week already exists in Plan");
      return;
    }

    try {
      var res = await AddCoursePlan(weekData);

      if (res) {
        setStateChanges(true);
        toast.success("Plan Added Successfully");
        setweek("");
        settopic("");
        setactivity("");
        setto(null);
        setfrom(null);
        handleClose();
      }
    } catch (error) {
      toast.error("Error! Cannot add Course Plan.");
      console.log("Error", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to this plan?`);
    if (!confirmDelete) {
      return;
    }

    try {
      var res = await DeleteCoursePlan({ id: id });
      if (res) {
        setStateChanges(true);
        console.log("Success", res);
        toast.success("Plan Deleted Successfully");
      }
    } catch (error) {
      toast.error("Unable to delete");
      console.log("Error", error);
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const handleDateChangeto = (date) => {
    setto(date.toISOString());
  };
  const handleDateChangefrom = (date) => {
    setfrom(date.toISOString());
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedweek, setEditedweek] = useState("");
  const [editedfrom, setEditedfrom] = useState(null);
  const [editedto, setEditedto] = useState(null);
  const [editedtopic, setEditedtopic] = useState("");
  const [editedactivity, setEditedactivity] = useState("");
  const [editRowId, setEditRowId] = useState("");
  const handleEdit = (row) => {
    console.log(row);
    setEditModalOpen(true);
    setEditedweek(row.weekNo);
    setEditedto(row.toDate);
    setEditedfrom(row.fromDate);
    setEditedtopic(row.topicCovered);
    setEditedactivity(row.activities);
    setEditRowId(row.id);
    console.log(editedto, editedfrom, editedtopic);
  };
  const handleeditModalclose = () => setEditModalOpen(false);
  const handleSaveChanges = async (row) => {
    if (
      !editedweek ||
      !editedto ||
      !editedfrom ||
      !editedactivity ||
      !editedtopic
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const updatedData = {
      courseId: id,
      id: editRowId,
      weekNo: editedweek,
      fromDate: editedfrom,
      toDate: editedto,
      topicCovered: editedtopic,
      activities: editedactivity,
    };
    const existingWeek = data.find((item) => item.weekNo === editedweek);

    if (existingWeek && existingWeek.id !== editRowId) {
      toast.error("Week You are trying to add is already exist.");
      return;
    }

    if (editedto < editedfrom) {
      toast.error("End date should be greater than start date");
      return;
    }
    console.log("Updated ID", updatedData);
    try {
      var res = await UpdateCoursePlan(updatedData);
      if (res) {
        console.log(res);
        setStateChanges(true);
        toast.success("Plan updated");
      }
    } catch (error) {
      console.log("Error", error);
    }
    handleeditModalclose();
  };
  return (
    // style={{height:'531px'}}
    <div className="m-3">
      <Card
        style={{
          padding: "30px",
          marginTop: "5em",
          marginBottom: "5.5em",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Menue />
        <div className="m-4">
          <h3
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#346448",
            }}
          >
            {course
              ? course.courseCode +
                " " +
                course.name +
                " " +
                course.courseType +
                " " +
                course.department
              : ""}
          </h3>
        </div>
        <Grid container spacing={5} alignContent="center">
          <Grid item md={12}>
            <div className="row">
              <div className="col-md-4  col-xs-6 justify-content-start">
                <h5
                  style={{
                    marginLeft: "1em",
                    marginTop: "10px",
                    fontWeight: "bold",
                    color: "#346448",
                  }}
                >
                  CoursePlan
                </h5>
              </div>

              <div className="col-md-1 col-xs-6 offset-md-6">
                <IconButton
                  onClick={handleOpen}
                  sx={{
                    marginLeft: "4em",
                    marginTop: "20px",
                    color: "#346448",
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <p className="d-flex justify-content-center mb-4 courseplanmodalhtag">
                      CoursePlan
                    </p>

                    <TextField
                      required
                      className="mb-4 inputfield"
                      size="small"
                      color="success"
                      fullWidth
                      id="outlined-basic"
                      label="Weeks"
                      value={week}
                      onChange={(e) => setweek(e.target.value)}
                      // value={author}
                      variant="outlined"

                      // onChange={(e) => setAuthor(e.target.value)}
                    />

                    <div className="d-flex">
                      <Box style={{ width: 200, marginRight: "15px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="mb-4 ml-3 fullwidthdatepicker inputfield"
                              label="From"
                              slotProps={{
                                textField: { color: "success", size: "small" },
                              }}
                              selected={from}
                              onChange={(date) => handleDateChangefrom(date)}
                              format="DD/MM/YYYY"
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Box>

                      <Box style={{ width: 200 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="mb-4 fullwidthdatepicker inputfield"
                              label="To"
                              slotProps={{
                                textField: { color: "success", size: "small" },
                              }}
                              selected={to}
                              onChange={(date) => handleDateChangeto(date)}
                              format="DD/MM/YYYY"
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Box>
                    </div>

                    <TextField
                      required
                      className="mb-4 inputfield"
                      size="small"
                      color="success"
                      fullWidth
                      id="outlined-basic"
                      label="Topics Covered"
                      variant="outlined"
                      value={topic}
                      onChange={(e) => settopic(e.target.value)}
                    />
                    <TextField
                      required
                      className="mb-4 inputfield"
                      size="small"
                      color="success"
                      fullWidth
                      id="outlined-basic"
                      label="Activities"
                      // value={author}
                      variant="outlined"
                      value={activity}
                      onChange={(e) => setactivity(e.target.value)}
                    />
                    <div className="row">
                      <div className="col-md-12 d-flex justify-content-center">
                        <Button
                          style={{
                            backgroundColor: "#346448",
                            padding: "7px 50px 7px 50px",
                          }}
                          variant="contained"
                          size="small"
                          onClick={() => handleSubmit()}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </Box>
                </Modal>
              </div>
            </div>
            <div class="container table-responsive py-1">
              <table class="table table-bordered ">
                <thead className="tableheader">
                  <tr>
                    <th scope="col" style={{ width: "3%" }}>
                      Weeks
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Days
                    </th>
                    <th scope="col" style={{ width: "40%" }}>
                      Topics Covered
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Activities
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((row) => (
                    <tr key={row.id}>
                      <td>{row.weekNo}</td>
                      <td>
                        {row.fromDate} - {row.toDate}
                      </td>
                      <td>{row.topicCovered}</td>
                      <td>{row.activities}</td>
                      <td>
                        {" "}
                        <IconButton onClick={() => handleDelete(row.id)}>
                          <DeleteForeverIcon
                            sx={{ fontSize: "18px", color: "#346448" }}
                          />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(row)}>
                          <EditIcon
                            sx={{ fontSize: "18px", color: "#346448" }}
                          />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p className="d-flex justify-content-center mb-4 courseplanmodalhtag">
              Edit CoursePlan
            </p>

            <TextField
              required
              className="mb-4 inputfield"
              size="small"
              color="success"
              fullWidth
              id="outlined-basic"
              label="Weeks"
              value={editedweek}
              onChange={(e) => setEditedweek(e.target.value)}
              // value={author}
              variant="outlined"

              // onChange={(e) => setAuthor(e.target.value)}
            />

            <div className="d-flex">
              <Box style={{ width: 200, marginRight: "15px" }}>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      className="mb-4 ml-3 fullwidthdatepicker inputfield"
                      label="From"
                      slotProps={{
                        textField: { color: "success", size: "small" },
                      }}
                      value={editedfrom}
                      // selected={editedfrom}
                      onChange={(date) => setEditedfrom(date.toISOString())}
                      format="DD/MM/YYYY"
                    />
                  </DemoContainer>
                </LocalizationProvider> */}
                <lable>From</lable>
                <input
                  type="date"
                  format="DD/MM/YYYY"
                  className="form-control mb-4"
                  value={editedfrom}
                  onChange={(e) => setEditedfrom(e.target.value)}
                />
              </Box>

              <Box style={{ width: 200 }}>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      className="mb-4 fullwidthdatepicker inputfield"
                      label="To"
                      slotProps={{
                        textField: { color: "success", size: "small" },
                      }}
                      value={editedto}
                      //  selected={editedto}
                      onChange={(date) => setEditedto(date.toISOString())}
                      format="DD/MM/YYYY"
                    />
                  </DemoContainer>
                </LocalizationProvider> */}
                <lable>To</lable>
                <input
                  type="date"
                  format="DD/MM/YYYY"
                  className="form-control mb-4"
                  value={editedto}
                  onChange={(e) => setEditedto(e.target.value)}
                />
              </Box>
            </div>
            <TextField
              required
              className="mb-4 inputfield"
              size="small"
              color="success"
              fullWidth
              id="outlined-basic"
              label="Topics Covered"
              variant="outlined"
              value={editedtopic}
              onChange={(e) => setEditedtopic(e.target.value)}
            />
            <TextField
              required
              className="mb-4 inputfield"
              size="small"
              color="success"
              fullWidth
              id="outlined-basic"
              label="Activities"
              variant="outlined"
              value={editedactivity}
              onChange={(e) => setEditedactivity(e.target.value)}
            />
            <div className="row">
              <div className="col-md-12 d-flex justify-content-center">
                <Button
                  style={{
                    backgroundColor: "#346448",
                    padding: "7px 50px 7px 50px",
                  }}
                  variant="contained"
                  size="small"
                  onClick={() => handleSaveChanges()}
                >
                  save
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
        <div className="row">
          <div className="col d-flex justify-content-end">
            <Button
              variant="contained"
              className="weightbutton"
              style={{
                backgroundColor: "#346448",
                // textAlign: "center",
                paddingLeft: "30px",
                paddingRight: "30px",
                marginRight: "45px",
              }}
              onClick={() => navigate("/coursedashboard/" + id)}
            >
              Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
