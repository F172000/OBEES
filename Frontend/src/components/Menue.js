import React, { useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PieChartIcon from "@mui/icons-material/PieChart";
import { Link, useParams } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/Preview";
import GradingIcon from "@mui/icons-material/Grading";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/system";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export default function Menue() {
  const { id } = useParams();
  return (
    <div className="d-flex justify-content-center" style={{ color: "#346448" }}>
      <Stack className="d-flex justify-content-start flex-wrap" spacing={1} direction="row" style={{ marginBottom: "50px" }}>
        <Link to={"/coursedashboard/" + id}>
          <Chip
            component="a"
            href="#basic-chip"
            clickable
            color="success"
            size="medium"
            icon={<PreviewIcon />}
            label="Dashboard"
            variant="outlined"
            sx={{
              marginRight: "20px",
              border: "1px solid white",
              backgroundColor: "#346448",
              color: "white",
              padding: "8px",
              "&:hover": {
                backgroundColor: "white",
                color: "#346448",
                border: "1px solid #346448",
                "& .MuiChip-icon": {
                  color: "#346448",
                },
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Link>
        <Link to={"/participants/" + id}>
          <Chip
            icon={<GroupsIcon />}
            label="Participants"
            variant="outlined"
            component="a"
            href="/participants"
            clickable
            color="success"
            size="medium"
            sx={{
              marginRight: "20px",
              border: "1px solid white",
              backgroundColor: "#346448",
              color: "white",
              padding: "8px",
              "&:hover": {
                backgroundColor: "white",
                color: "#346448",
                border: "1px solid #346448",
                "& .MuiChip-icon": {
                  color: "#346448",
                },
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Link>
        <Link to={"/assessmentdashboard/" + id}>
          <Chip
            icon={<MenuBookIcon />}
            label="Add Exam"
            component="a"
            href="#basic-chip"
            clickable
            color="success"
            size="medium"
            variant="outlined"
            sx={{
              marginRight: "20px",
              border: "1px solid white",
              backgroundColor: "#346448",
              color: "white",
              padding: "8px",
              "&:hover": {
                backgroundColor: "white",
                color: "#346448",
                border: "1px solid #346448",
                "& .MuiChip-icon": {
                  color: "#346448",
                },
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Link>
        <Link to={"/Scoreboard/" + id}>
          <Chip
            icon={<PieChartIcon />}
            label="Scoreboard"
            variant="outlined"
            component="a"
            href="#basic-chip"
            clickable
            color="success"
            size="medium"
            sx={{
              marginRight: "20px",
              border: "1px solid white",
              backgroundColor: "#346448",
              color: "white",
              padding: "8px",
              "&:hover": {
                backgroundColor: "white",
                color: "#346448",
                border: "1px solid #346448",
                "& .MuiChip-icon": {
                  color: "#346448",
                },
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Link>
        <Link to={"/feedback/" + id}>
          <Chip
            icon={< ThumbsUpDownIcon/>}
            label="Course Feedback"
            variant="outlined"
            component="a"
            href="#basic-chip"
            clickable
            color="success"
            size="medium"
            sx={{
              marginRight: "20px",
              border: "1px solid white",
              backgroundColor: "#346448",
              color: "white",
              padding: "8px",
              "&:hover": {
                backgroundColor: "white",
                color: "#346448",
                border: "1px solid #346448",
                "& .MuiChip-icon": {
                  color: "#346448",
                },
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Link>
        <Link to={"/courseplan/" + id}>
          <Chip
            icon={<HistoryToggleOffIcon />}
            component="a"
            clickable
            color="success"
            size="medium"
            label=" Course Plan"
            variant="outlined"
            sx={{
              marginRight: "20px",
              border: "1px solid white",
              backgroundColor: "#346448",
              color: "white",
              padding: "8px",
              "&:hover": {
                backgroundColor: "white",
                color: "#346448",
                border: "1px solid #346448",
                "& .MuiChip-icon": {
                  color: "#346448",
                },
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Link>
        <Link to={"/addattendance/" + id}>
          <Chip
            icon={<HowToRegIcon />}
            component="a"
            clickable
            color="success"
            size="medium"
            label=" Attendance"
            variant="outlined"
            sx={{
              marginRight: "20px",
              border: "1px solid white",
              backgroundColor: "#346448",
              color: "white",
              padding: "8px",
              "&:hover": {
                backgroundColor: "white",
                color: "#346448",
                border: "1px solid #346448",
                "& .MuiChip-icon": {
                  color: "#346448",
                },
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Link>

      </Stack>
    </div>
  );
}
