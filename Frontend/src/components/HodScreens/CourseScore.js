import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../apiCalls";
import {
  Paper,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import sir from "../../images/sir.png";
import c1 from "../../images/c1.png";
import c2 from "../../images/c2.png";
import c3 from "../../images/c3.png";
import Slider from "react-slick";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import GradingIcon from "@mui/icons-material/Grading";
import { Link } from "react-router-dom";
import { Avatar, Table, TableBody, TableCell, TableRow } from "@mui/material";
export default function CourseScore() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [courses, setCourse] = useState();
  useEffect(() => {
    // Redirect if user type is not 0
    if (user && user.type !== 0) {
      navigate("/dashboard");
    }
    fetchAllCourses();
  }, [user, navigate]);

  const fetchAllCourses = async () => {
    try {
      var res = await getCourses();
      if (res) {
        console.log(res);
        setCourse(res.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  if (!user) {
    return "Loading"; // or display a loading spinner or placeholder
  }
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
      <Paper
        elevation={1}
        sx={{
          padding: "30px",
          marginTop: "5em",
          marginBottom:"5.5em",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Grid container spacing={2} alignContent="center">
          <Grid item md={12}>
            <h5 class="coursassi">All Courses</h5>
            <Slider {...settings}>
              {courses?.map((course) => {
                return (
                  <>
                    <div>
                      <Link
                        to={"/Scoreboard/" + course.id}
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
                              {course.name}
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
                  </>
                );
              })}
            </Slider>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
