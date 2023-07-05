import { Button } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
export default function HodDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const buttonStyles = {
    backgroundColor: "#346448",
    marginRight: "10.5em",
    padding: "px 15px",
    "&:hover": {
      backgroundColor: "#346448", // Ensures hover doesn't change the color
    },
  };
  useEffect(() => {
    // Redirect if user type is not 0
    if (user && user.type !== 0) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  if (!user) {
    return "Loading"; // or display a loading spinner or placeholder
  }
  return (
    <div>
       <Card style={{ padding: 50, margin:'4em 7em 3.5em 7em' }}>
      <h1 className="mt-3 mb-4 d-flex justify-content-center quizheading">
        Select your preference
      </h1>
      <div className="d-flex justify-content-center">
        <div style={{ width: "50%" }}>
          <div>
            <Button
              fullWidth
              style={buttonStyles}
              size="large"
              className="rounded mb-4"
              variant="contained"
              sx={{ bgcolor: " #346448" }}
              onClick={() => {
                navigate("/assignhodcources");
              }}
            >
              Assign Courses
            </Button>
          </div>

          <Link to="/allcourses">
            <div>
              <Button
                fullWidth
                style={buttonStyles}
                size="large"
                className="rounded mb-4"
                variant="contained"
                sx={{ bgcolor: " #346448" }}
              >
                View/Edit Attendance
              </Button>
            </div>
          </Link>
          <Link to="/allcoursesscores">
            <div>
              <Button
                style={buttonStyles}
                fullWidth
                size="large"
                className="rounded mb-4"
                variant="contained"
                sx={{ bgcolor: " #346448" }}
              >
                View/Edit Scoreboard
              </Button>
            </div>
          </Link>
        </div>
      </div>
      </Card>
    </div>
  );
}
