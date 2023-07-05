import React, { useContext, useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import sir from "../images/sir.png";
import c1 from "../images/c1.png";
import c2 from "../images/c2.png";
import c3 from "../images/c3.png";
import Slider from "react-slick";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import GradingIcon from "@mui/icons-material/Grading";
import { Link } from "react-router-dom";
import { Avatar, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { UserContext } from "../context/UserContext";
import { getCoursesByTeacher } from "../apiCalls";
const Dashboard = () => {
  const [weightageCourse, setWeightageCourse] = useState();
  const [unweightageCourse, setUnWeightageCourse] = useState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchTeacherCourses();
    console.log(user);
  }, [user]);

  const fetchTeacherCourses = async () => {
    try {
      var res = await getCoursesByTeacher({ teacherId: user.id });
      if (res) {
        console.log(res);
        setUnWeightageCourse(res.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      <div class="container-fluid">
        <Paper
          elevation={1}
          sx={{
            paddingBottom: "15px",
            marginTop: "30px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <Grid container spacing={2} alignContent="start">
            <Grid
              item
              md={2}
              xs={12}
              sx={{ marginTop: "2px", marginLeft: "25px", marginBottom: "2px" }}
            >
              <img
                className="teacherpic"
                src={user?.image ? user?.image : sir}
                alt="teacher"
              ></img>
            </Grid>
            <Grid item md={3} className="mt-2" xs={12}>
              <h3 className="heading">{user?.name}</h3>
              <p className="para">Designation: {user?.position}</p>
              <p className="para">Department: {user?.department}</p>
              <p className="para">Email: {user?.email}</p>
              <p className="para">Campus: {user?.campus}</p>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={1}
          sx={{
            padding: "30px",
            marginTop: "30px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <Grid container spacing={2} alignContent="center">
            <Grid item md={12}>
              <h5 class="coursassi">Unassigned Weightage Courses</h5>
              <Slider {...settings}>
                {unweightageCourse?.map((course) => {
                  if (
                    (course.weightage < 100 && course.mainCourse === 0) ||
                    (course.weightage < 50 && course.mainCourse !== 0)
                  ) {
                    return (
                      <div key={course.id}>
                        <Link
                          to={"/setweight/" + course.id}
                          style={{ textDecoration: "none" }}
                        >
                          <Card sx={{ maxWidth: 270 }}>
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                height="150"
                                image={c1}
                                alt="green iguana"
                              ></CardMedia>
                              <div
                                style={{
                                  position: "absolute",
                                  color: "white",
                                  top: 35,
                                  marginLeft: "15px",
                                }}
                                className="corstext"
                              >
                                {course.courseCode}
                              </div>
                              <div
                                className="corstext2"
                                style={{
                                  position: "absolute",
                                  color: "white",
                                  top: 60,
                                  marginLeft: "15px",
                                }}
                              >
                                {course.name} - {course.courseType}
                              </div>
                              <div
                                className="corstext3"
                                style={{
                                  position: "absolute",
                                  top: 125,
                                  marginLeft: "18px",
                                }}
                              >
                                {course.department}
                              </div>
                              <CardContent>
                                <p
                                  className="course"
                                  gutterBottom
                                  component="div"
                                >
                                  {user.name}
                                </p>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Link>
                      </div>
                    );
                  }
                  return null;
                })}
              </Slider>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={1}
          sx={{
            padding: "30px",
            marginTop: "30px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <Grid container spacing={2} alignContent="center">
            <Grid item md={12}>
              <h5 class="coursassi">Assigned Courses</h5>
              <Slider {...settings}>
                {unweightageCourse?.map((course) => {
                  if (
                    (course.weightage >= 100 && course.mainCourse === 0) ||
                    (course.weightage >= 50 && course.mainCourse !== 0)
                  ) {
                    return (
                      <div key={course.id}>
                        <Link
                          to={"/coursedashboard/" + course.id}
                          style={{ textDecoration: "none" }}
                        >
                          <Card sx={{ maxWidth: 270 }}>
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                height="150"
                                image={c1}
                                alt="green iguana"
                              ></CardMedia>
                              <div
                                style={{
                                  position: "absolute",
                                  color: "white",
                                  top: 35,
                                  marginLeft: "15px",
                                }}
                                className="corstext"
                              >
                                {course.courseCode}
                              </div>
                              <div
                                className="corstext2"
                                style={{
                                  position: "absolute",
                                  color: "white",
                                  top: 60,
                                  marginLeft: "15px",
                                }}
                              >
                                {course.name} - {course.courseType}
                              </div>
                              <div
                                className="corstext3"
                                style={{
                                  position: "absolute",
                                  top: 125,
                                  marginLeft: "18px",
                                }}
                              >
                                {course.department}
                              </div>
                              <CardContent>
                                <p
                                  className="course"
                                  gutterBottom
                                  component="div"
                                >
                                  {user.name}
                                </p>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Link>
                      </div>
                    );
                  }
                  return null;
                })}
              </Slider>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default Dashboard;
