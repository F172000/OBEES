import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import {
  getunAssignedCources,
  getTeachers,
  assignCourse,
  getCourses,
} from "../../apiCalls";
export default function AssignCourse() {
  const [credit, setcredit] = React.useState("");
  const [teacher, setteacher] = React.useState("");
  const [status, setstatus] = React.useState(false);
  const [courses, setCourses] = React.useState("");
  const [teachers, setTeachers] = React.useState([]);
  const [assignedCourses, setassignedCourses] = React.useState([]);
  const [selectedCourses, setSelectedCourses] = React.useState([]);

  // setassignedCourses([
  //   {
  //     teacher: "Zahid",
  //   },
  // ]);
  const buttonStyles = {
    backgroundColor: "#346448",
    marginRight: "10.5em",
    padding: "px 15px",
    "&:hover": {
      backgroundColor: "#346448", // Ensures hover doesn't change the color
    },
  };
  const buttonStylegreen = {
    backgroundColor: "#346448",
    "&:hover": {
      backgroundColor: "#346448", // Ensures hover doesn't change the color
    },
  };
  const buttonStylered = {
    backgroundColor: "#CD3737",
    "&:hover": {
      backgroundColor: "#CD3737", // Ensures hover doesn't change the color
    },
  };
  useEffect(() => {
    setstatus(false);
    fetchCourse();
    fetchTeacher();
    fetchAllCourses();
    return () => {};
  }, [status]);

  const handleCourseChange = (event, value) => {
    setSelectedCourses(value);
    console.log("Value", value);
  };

  const fetchAllCourses = async () => {
    try {
      const res = await getCourses();

      if (res && res.data) {
        const courses = res.data.filter((course) => course.teacherId !== null);
        setassignedCourses(courses);
        console.log(res);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Error While Fetching Courses");
    }
  };

  const fetchCourse = async () => {
    try {
      var res = await getunAssignedCources();
      if (res) {
        // Extract the "name" key from each object using the map method
        const courseNames = res.data.map((course) => {
          return {
            title:
              course.name +
              " " +
              course.courseType +
              " " +
              course.creditHour +
              " Housrs",
            id: course.id,
          };
        });

        // Set the extracted names as the new state using setCourses
        setCourses(courseNames);
        console.log("Success", res);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchTeacher = async () => {
    try {
      var res = await getTeachers();
      if (res) {
        // Extract the "name" key from each object using the map method
        const teacherNames = res.data.map((teacher) => {
          return {
            name: teacher.name + " - " + teacher.position,
            id: teacher.id,
          };
        });

        // Set the extracted names as the new state using setteachers
        setTeachers(teacherNames);
        console.log("Success", res);
        console.log(teachers);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleSubmit = async () => {
    if (selectedCourses.length == 0) {
      toast.error("Please Select Course");
      return;
    }
    if (!teacher) {
      toast.error("Please Select Teacher");
      return;
    }
    var data = {
      courses: selectedCourses,
      teacher: teacher,
    };
    console.log(data);

    try {
      var res = await assignCourse(data);
      if (res) {
        setstatus(true);
        setSelectedCourses([]);
        setteacher("");
        console.log("Success", res);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error", error);
    }
  };

  const handleDelete = async (course) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to unassign the course ${course.name}?`
    );
    if (!confirmDelete) {
      return;
    }
    var data = {
      courses: [
        {
          title:
            course.name +
            " " +
            course.courseType +
            " " +
            course.creditHour +
            " Housrs",
          id: course.id,
        },
      ],
      teacher: null,
    };

    try {
      var res = await assignCourse(data);
      if (res) {
        setstatus(true);
        setSelectedCourses([]);
        setteacher("");
        console.log("Success", res);
        toast.success("Course Unassinged Successfully");
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error", error);
    }
  };
  const handleEdit = (course) => {
    setSelectedCourses([
      {
        title:
          course.name +
          " " +
          course.courseType +
          " " +
          course.creditHour +
          " Housrs",
        id: course.id,
      },
    ]);
    setteacher(course.teacherId);
    console.log(selectedCourses);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 d-flex justify-content-center quizheading">Assign Courses</h1>
      <div className="d-flex justify-content-center">
        <div style={{ width: "50%" }}>
          <div className="mb-4">
            <Autocomplete
              multiple
              id="tags-standard"
              options={courses}
              getOptionLabel={(option) => option.title}
              value={selectedCourses}
              onChange={handleCourseChange}
              renderInput={(params) => (
                <TextField
                sx={{backgroundColor:'white'}}
                className="inputfield"
                  {...params}
                  size="small"
                  variant="outlined"
                  label="Assign Courses"
                  placeholder="Assign Courses"
                />
              )}
            />
          </div>

          <div className="mb-4">
            <FormControl fullWidth sx={{backgroundColor:'white'}} className="inputfield">
              <InputLabel id="demo-simple-select-label" >
                Select Teacher
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={teacher}
                label="Select Teacher"
                onChange={(e) => {
                  setteacher(e.target.value);
                }}
              >
                {teachers?.map((teacher) => {
                  return (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>

          <div className="mb-4">
            <Button
              fullWidth
              style={buttonStyles}
              size="large"
              className="rounded mb-4"
              variant="contained"
              onClick={() => handleSubmit()}
              sx={{ bgcolor: " #346448" }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <h1 className="mb-4 d-flex justify-content-center quizheading">Courses Assigned</h1>

      <div className="table-repsonsive">
        <table className="table table-striped mb-5">
          <thead>
            <tr className="text-center">
              <th>Teacher Name</th>
              <th>Courses</th>
              <th>Credit Hour</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {assignedCourses?.map((course) => {
              return (
                <tr>
                  <td>{course.teacherName}</td>
                  <td>{course.name}</td>
                  <td>{course.creditHour}</td>
                  <td>{course.courseType}</td>
                  <td>
                    <Button
                     variant="contained"
                     style={buttonStylegreen}
                     sx={{marginRight:'1em', backgroundColor:'#346448'}}
                      onClick={() => handleEdit(course)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      style={buttonStylered}
                      sx={{backgroundColor:'#CD3737'}}
                      onClick={() => handleDelete(course)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
