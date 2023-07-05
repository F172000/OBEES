import React, { useEffect, useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import Card from "@mui/material/Card";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PieChartIcon from "@mui/icons-material/PieChart";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PreviewIcon from "@mui/icons-material/Preview";
import { Link } from "react-router-dom";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GradingIcon from "@mui/icons-material/Grading";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/system";
import { ShowAssessment, getExamsByAssisment } from "../apiCalls";
import { useParams } from "react-router-dom";
import Menue from "./Menue";

const b = {
  color: "#346448",
  width: "100%",
  borderRadius: "13px",
};
export default function Listofassessments() {
  const { id } = useParams();
  const [clo, setCLO] = React.useState("");
  const [plo, setPLO] = React.useState("");

  useEffect(() => {
    fetchAssessments();
  }, []);

  const [assessments, setAssessments] = useState([]);

  const fetchAssessments = async () => {
    try {
      const res = await ShowAssessment({ id: id });
      if (res) {
        console.log("Assessments", res);
        const assessmentData = res.data.results;

        // Fetch exams for each assessment
        const fetchExams = assessmentData.map(async (assessment) => {
          try {
            const res = await getExamsByAssisment({ id: assessment.id });
            if (res) {
              console.log("Exams", res);
              // Add the exams as a separate key in the assessment object
              assessment.exams = res.data.results;
            }
          } catch (err) {
            console.log("Exam Error", err);
          }
        });

        // Wait for all fetchExams promises to resolve
        await Promise.all(fetchExams);

        // Update the state with the modified assessmentData
        setAssessments(assessmentData);
        console.log(assessmentData);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };
  return (
    <div>
      <div className="m-5">
        <Card style={{ padding: 50 }}>
          <div
            className="d-flex justify-content-center"
            style={{ color: "#346448" }}
          >
          <Menue/>
          </div>

          <div>
            {assessments?.map((assessment, index) => {
              if (assessment.exams.length > 0) {
                return assessment.exams.map((exam, examIndex) => (
                  <Link
                    to={"/quizform/" + id + "/" + assessment.id}
                    style={{ textDecoration: "none" }}
                    key={exam.id} // Add a unique key prop
                  >
                    <Card
                      className="shadow-inner"
                      style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
                    >
                      <div className="row m-2">
                        <div
                          className="col-1  mt-1"
                          style={{ paddingLeft: "35px" }}
                        >
                          <AssessmentIcon
                            style={{
                              fontSize: "30px",
                              marginTop: "3px",
                              color: "#346448",
                            }}
                          />
                        </div>
                        <div
                          className="col-11 mt-2"
                          style={{ paddingLeft: "0" }}
                        >
                          <p className="coursedashpara">
                            {assessment.name + " " + (examIndex + 1)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ));
              } else {
                return (
                  <Link
                    to={"/quizform/" + id + "/" + assessment.id}
                    style={{ textDecoration: "none" }}
                    key={assessment.id} // Add a unique key prop
                  >
                    <Card
                      className="shadow-inner"
                      style={{ marginTop: "15px", backgroundColor: "#F5F5F5" }}
                    >
                      <div className="row m-2">
                        <div
                          className="col-1  mt-1"
                          style={{ paddingLeft: "35px" }}
                        >
                          <AssessmentIcon
                            style={{
                              fontSize: "30px",
                              marginTop: "3px",
                              color: "#346448",
                            }}
                          />
                        </div>
                        <div
                          className="col-11 mt-2"
                          style={{ paddingLeft: "0" }}
                        >
                          <p className="coursedashpara">{assessment.name}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              }
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
