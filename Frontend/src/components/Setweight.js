// eslint-disable-next-line
import {
  Paper,
  Grid,
  Button,
  IconButton,
  Typography,
  Modal,
  Box,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InsertChart } from "@mui/icons-material";

import {
  assignWeightage,
  ShowAssessment,
  UpdateAssessment,
  getCourseById,
  DeleteAssessment,
} from "../apiCalls";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Menue from "./Menue";
const buttonStyles = {
  backgroundColor: "#346448",
  "&:hover": {
    backgroundColor: "#346448", // Ensures hover doesn't change the color
  },
};
const Setweight = () => {
  const { id } = useParams();
  const [course, setCourse] = useState();
  const [assismensts, setAssismensts] = useState([]);
  const [weightage, setWeightage] = useState();
  const [name, setName] = useState();
  const [editRowId, setEditRowId] = useState("");
  const [stateChanged, setStateChanged] = useState(false);
  const [validNames, setvalidNames] = useState([
    "Quiz",
    "Assignment",
    "Midterm",
    "Final Term",
    "Project",
    "Presentation",
    "Viva",
  ]);
  useEffect(() => {
    setStateChanged(false);
    fetchAssisments();
    fetchCourseData();
  }, [stateChanged]);

  const fetchCourseData = async () => {
    try {
      var res = await getCourseById({ id: id });
      setCourse(res.data[0]);
      if (res.data[0].mainCourse > 0) {
        setvalidNames([
          "Lab work",
          "Lab exam",
          "Lab quiz",
          "Lab project",
          "Lab viva",
          "Lab assignment",
        ]);
      }
      if (res) {
        console.log("Success Course", res);
      }
    } catch (error) {
      console.log("Error Course", error);
    }
  };
  const fetchAssisments = async () => {
    try {
      var res = await ShowAssessment({ id: id });
      if (res) {
        console.log("Success", res);
        setAssismensts(res.data.results);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const setAssisment = async () => {
    if (!validNames.includes(name)) {
      toast.error("Invalid Name Valid Names are " + validNames);
      return;
    }
    var data = { courseId: id, name: name, weightage: weightage };
    try {
      var res = await assignWeightage(data);
      console.log("Success", res);
      setStateChanged(true);
      handletheoryclose();
      toast.success("Assisment Created Successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      console.log("Error", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to Delete this assisment?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      var res = await DeleteAssessment({ id: id });
      if (res) {
        setStateChanged(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(res.data.error);
    }
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
  const [theory, settheory] = React.useState(false);
  const handletheoryopen = () => {
    setName("");
    setWeightage("");
    settheory(true);
  };
  const handletheoryclose = () => settheory(false);
  const [lab, setlab] = React.useState(false);
  const handlelabopen = () => setlab(true);
  const handlelabclose = () => setlab(false);
  function addtheory(e) {
    // insert(e);
    handletheoryclose();
  }
  function addlab() {
    handlelabclose();
  }
  const navigate = useNavigate();
  // const theoryWeight = data.reduce((total, row) => {
  //   if (row.assessplanid === 2) {
  //     return total + row.weight;
  //   }
  //   return total;
  // }, 0);
  const totalWeightage = assismensts?.reduce(
    (sum, assignment) => sum + assignment?.weightage,
    0
  );

  var maxPercentage = 100;

  if (course?.mainCourse == 0) {
    maxPercentage = 100;
  } else {
    maxPercentage = 50;
  }
  const percentage = Math.floor((totalWeightage / maxPercentage) * 100);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedAssessmentType, setEditedAssessmentType] = useState("");
  const [editedWeight, setEditedWeight] = useState("");
  const handleEdit = (row) => {
    setEditModalOpen(true);
    setName(row.name);
    setWeightage(row.weightage);
    setEditRowId(row.id);
  };
  const handleeditModalclose = () => setEditModalOpen(false);
  const handleSaveChanges = async () => {
    if (!validNames.includes(name)) {
      toast.error("Invalid Name Valid Names are " + validNames);
      return;
    }
    var data = { id: editRowId, name: name, weightage: weightage };
    try {
      var res = await UpdateAssessment(data);
      console.log("Success", res);
      setStateChanged(true);
      toast.success("Assisment Updated Successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      console.log("Error", error);
    }

    handleeditModalclose();
  };
  return (
    <div>
      <Paper
        elevation={1}
        sx={{
          padding: "30px",
          marginTop: "4em",
          marginBottom: "4em",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        {/* <Menue/> */}
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center mb-5 coursename">
            {course?.courseCode}-{course?.name}
          </div>
        </div>
        <Grid container spacing={5} alignContent="center">
          <Grid item md={8} className="mx-auto">
            <div className="row">
              <div className="col-md-4">
                <h5 class="weightportion">Course Type {course?.courseType}</h5>
              </div>
              <div className="col-md-1 col-xs-12 offset-md-6">
                <IconButton
                  onClick={handletheoryopen}
                  sx={{
                    marginLeft: "3em",
                    marginTop: "20px",
                    color: "#346448",
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
                <Modal
                  open={theory}
                  onClose={handletheoryclose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  {/* <Box sx={style}>
        <div className='row'>
          <div className='col'>
            <label for="assessmentype">Enter Assessment Type:</label>
          </div>
         </div>
         <div className='row'>
          <div className='col-md-12 mb-3'>
<TextField color='success'variant='outlined'fullWidth size='small'placeholder='Assignment'value={theassessmenttype}onChange={(e)=>settheassessmenttype(e.target.value)}></TextField>
          </div>
         </div>
         <div className='row'>
          <div className='col-md-7'>
            <label for="weight">Enter Assessment Weight:</label>
          </div>
         </div>
         <div className='row'>
          <div className='col-md-12'>
          <TextField color='success' variant='outlined'fullWidth size='small'placeholder='0'value={theweight}onChange={(e)=>settheweight(e.target.value)}></TextField>
          </div>
         </div>
        <div className='row mt-3'>
          <div className='col-md-12 d-flex justify-content-end'>
            <Button onClick={insert} variant='contained'sx={{bgcolor:' #346448'}}>Add </Button>
          </div>
        </div>
        </Box> */}
                  <Box sx={style}>
                    <div className="row mb-3">
                      <div className="col-md-12 d-flex justify-content-center">
                        {/* <p className="setweightmodalhtag">Theory Portion</p> */}
                      </div>
                    </div>
                    <div className="row">
                      <div class="col">
                        <div>
                          <InputLabel id="assessment-name-label">
                            Enter Assessment Name
                          </InputLabel>
                          <Select
                            required
                            className="mb-4 inputfield"
                            size="small"
                            color="success"
                            fullWidth
                            id="outlined-basic"
                            labelId="assessment-name-label"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          >
                            {validNames.map((nameOption) => {
                              const nameExists = assismensts.some(
                                (assignment) => assignment.name === nameOption
                              );
                              if (nameExists) {
                                return null;
                              }
                              return (
                                <MenuItem key={nameOption} value={nameOption}>
                                  {nameOption}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div class="col">
                        <TextField
                          required
                          className="mb-4 inputfield"
                          size="small"
                          color="success"
                          type="number"
                          fullWidth
                          id="outlined-basic"
                          label="Enter Assessment Weightage"
                          variant="outlined"
                          value={weightage}
                          onChange={(e) => setWeightage(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-12 d-flex justify-content-center">
                        <Button
                          onClick={(event) => setAssisment()}
                          className="rounded"
                          variant="contained"
                          style={buttonStyles}
                          sx={{
                            bgcolor: " #346448",
                            padding: "7px 60px 7px 60px",
                          }}
                        >
                          Add
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
                    <th scope="col" style={{ width: "30%" }}>
                      Assessment Type
                    </th>
                    <th scope="col">Weight</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {insertrow.map((val,index)=>( */}
                  {assismensts?.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.weightage}</td>
                      <td>
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
                  {/*  ))} */}
                </tbody>
              </table>
            </div>
            <Modal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="row mb-3">
                  <div className="col-md-12 d-flex justify-content-center">
                    <p className="setweightmodalhtag">Edit Assessment</p>
                  </div>
                </div>
                <div className="row">
                  <div class="col">
                    <div>
                      <InputLabel id="assessment-name-label">
                        Enter Assessment Name
                      </InputLabel>
                      <Select
                        required
                        className="mb-4 inputfield"
                        size="small"
                        color="success"
                        fullWidth
                        id="outlined-basic"
                        labelId="assessment-name-label"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      >
                        {validNames.map((nameOption) => {
                          const nameExists = assismensts.some(
                            (assignment) => assignment.name === nameOption
                          );
                          if (nameExists && nameOption !== name) {
                            return null;
                          }
                          return (
                            <MenuItem key={nameOption} value={nameOption}>
                              {nameOption}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div class="col">
                    <TextField
                      required
                      className="mb-4 inputfield"
                      size="small"
                      color="success"
                      type="number"
                      fullWidth
                      id="outlined-basic"
                      label="Enter Assessment Marks"
                      variant="outlined"
                      value={weightage}
                      onChange={(e) => setWeightage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12 d-flex justify-content-center">
                    <Button
                      onClick={() => handleSaveChanges()}
                      className="rounded"
                      variant="contained"
                      sx={{ bgcolor: " #346448", padding: "7px 60px 7px 60px" }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>

            <div className="row mb-1">
              <div className="col-md-4 Total">
                <h6 className="Total">
                  Max Weightage: {course?.mainCourse == 0 ? "100" : "50"}
                </h6>
              </div>
              <div className="col-md-1 Marks">
                {/* <h6 className="Marks">{theoryWeight}</h6> */}
              </div>
            </div>
            <div class="progress">
              <div
                className="progress-bar progress-bar-striped active"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="50"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: "#346448",
                }}
              >
                {percentage}%
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="row mt-3">
          <div className="col-md-12 d-flex justify-content-center mt-5 coursename">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="contained"
              className="weightbutton"
              sx={{
                paddingRight: "50px",
                paddingLeft: "50px",
                backgroundColor: "#346448",
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Setweight;
