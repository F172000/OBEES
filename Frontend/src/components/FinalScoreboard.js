import React, { useEffect, useRef, useState } from "react";
import {
  getFinalMarkSheet,
  updateGrades,
  calculateFinalClo,
  getCourseById,
} from "../apiCalls";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { Card } from "@mui/material";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/system";
import GradingIcon from "@mui/icons-material/Grading";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PieChartIcon from "@mui/icons-material/PieChart";
import PreviewIcon from "@mui/icons-material/Preview";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupsIcon from "@mui/icons-material/Groups";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Menue from "./Menue";
export default function FinalScoreboard() {
  const [updatedMarks, setUpdatedMarks] = React.useState([]);
  const [course, setCourse] = React.useState([]);
  const [cloData, setCloData] = useState([]);
  const [cloIds, setCloIds] = useState([]);
  const [ploData, setploData] = useState([]);
  const [ploIds, setploIds] = useState([]);
  var assesmentTotalMarks = 0;
  const tableRef = useRef(null);
  const tableContainerRef = useRef(null);

  // const [totalGrandtotal, settotalGrandtotal] = React.useState([]);
  var totalGrandtotal = 0.0;
  let labTotal = 0.0;
  let labObtained = 0.0;
  const [changedMarks, setChangedMarks] = React.useState([]);
  const [obtainedMarks, setObtainedMarks] = React.useState({
    "Student Name": {
      studentRollno: "1122",
      "Loading Marks if Exist": {
        1: {
          1: {
            obtainedMarks: 0,
            gradingId: 0,
          },
          2: {
            obtainedMarks: 0,
            gradingId: 0,
          },
        },
      },
    },
  });
  const buttonStyles = {
    backgroundColor: "#346448",
    "&:hover": {
      backgroundColor: "#346448", // Ensures hover doesn't change the color
    },
  };
  const { id } = useParams();
  useEffect(() => {
    fetchMarks();
    fetchCourseData();
    fetchData();
    fetchPloData();
  }, [id]);
  const fetchPloData = async () => {
    try {
      // Calculate CLO achievement using the apiCalls function
      const calculatedploData = await calculateFinalClo({ id: id });

      // Merge cloAchievements with the same ploId
      const mergedploData = mergeCloAchievementsByPloId(calculatedploData.data);

      // Set the calculated and merged CLO data in the state
      setploData(mergedploData);

      // Extract the CLO IDs from the data and set them in the state
      if (mergedploData.length > 0) {
        const extractedploIds = Object.keys(mergedploData[0].cloAchievements);
        setploIds(extractedploIds);
      }

      console.log(mergedploData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch CLO data.");
    }
  };
  const mergeCloAchievementsByPloId = (data) => {
    const mergedData = [];

    data.forEach((student) => {
      const mergedCloAchievements = {};

      Object.values(student.cloAchievements).forEach((achievement) => {
        const { cloId, ploId, totalMarks, obtainedMarks, ploKpi, cloKpi } =
          achievement;

        if (!mergedCloAchievements[ploId]) {
          mergedCloAchievements[ploId] = {
            cloId,
            ploId,
            totalMarks,
            ploKpi,
            cloKpi,
            obtainedMarks,
          };
        } else {
          mergedCloAchievements[ploId].totalMarks += totalMarks;
          mergedCloAchievements[ploId].obtainedMarks += obtainedMarks;
        }
      });

      student.cloAchievements = Object.values(mergedCloAchievements);
      mergedData.push(student);
    });

    return mergedData;
  };
  const fetchData = async () => {
    try {
      // Calculate CLO achievement using the apiCalls function
      const calculatedCloData = await calculateFinalClo({ id: id });

      // Set the calculated CLO data in the state
      setCloData(calculatedCloData.data);
      console.log("Calculated", calculatedCloData.data);
      // Extract the CLO IDs from the data and set them in the state
      if (calculatedCloData.data.length > 0) {
        const extractedCloIds = Object.keys(
          calculatedCloData.data[0].cloAchievements
        );
        setCloIds(extractedCloIds);
      }

      console.log(calculatedCloData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch CLO data.");
    }
  };
  const fetchCourseData = async () => {
    try {
      const res = await getCourseById({ id: id });
      if (res && res.data.length > 0) {
        setCourse(res.data[0]);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const fetchMarks = async () => {
    try {
      var res = await getFinalMarkSheet({ id: id });
      console.log("success", res);
      if (res.data && Object.keys(res.data).length > 0) {
        setObtainedMarks(res.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleMarkChange = (event, studentName, assignment, question, part) => {
    const updatedMark = {
      studentName,
      assignment,
      question,
      part,
      mark: event.target.value,
    };
    if (event.target.value == "") {
      updatedMark.mark = 0;
      event.target.value = 0;
    }

    var totalMarks =
      obtainedMarks[studentName][assignment][question][part].questionTotalMarks;

    if (parseFloat(totalMarks) < parseFloat(event.target.value)) {
      toast.error("Obtained marks cannot exceed total marks");
      return;
    }
    setObtainedMarks((prevMarks) => {
      const updatedMarks = { ...prevMarks };
      updatedMarks[studentName][assignment][question][part].obtainedMarks =
        event.target.value;
      return updatedMarks;
    });

    setUpdatedMarks((prevMarks) => [...prevMarks, updatedMark]);
    setChangedMarks((prevMarks) => {
      const updatedMarks = prevMarks.map((mark) => {
        if (
          mark.id ===
          obtainedMarks[studentName][assignment][question][part].gradingId
        ) {
          return {
            id: obtainedMarks[studentName][assignment][question][part]
              .gradingId,
            mark: event.target.value,
          };
        }
        return mark;
      });

      const existingMarkIndex = updatedMarks.findIndex(
        (mark) =>
          mark.id ===
          obtainedMarks[studentName][assignment][question][part].gradingId
      );
      if (existingMarkIndex === -1) {
        updatedMarks.push({
          id: obtainedMarks[studentName][assignment][question][part].gradingId,
          mark: event.target.value,
        });
      }

      return updatedMarks;
    });

    // // console.log(updatedMark);
    // console.log(
    //   "to change",
    //   changedMarks,
    //   obtainedMarks[studentName][assignment][question][part]
    // );
  };

  if (obtainedMarks.length === 0) {
    return <div>Loading...</div>;
  }

  const studentNames = Object.keys(obtainedMarks);

  const studentData = Object.keys(obtainedMarks).map((studentName) => {
    return {
      name: studentName,
      rollNo: obtainedMarks[studentName].studentRollno, // Assuming the student roll number is stored in the 'rollNo' property
      labMarks: obtainedMarks[studentName].labMarks,
    };
  });

  const assignments = Object.keys(obtainedMarks[studentNames[0]]).filter(
    (key) => key !== "studentRollno" && key !== "labMarks"
  );
  const questions = Object.keys(obtainedMarks[studentNames[0]][assignments[0]]);

  const assessmentCounts = {};

  const firstStudentName = studentNames[0];

  assignments.forEach((assignment) => {
    const questions = Object.keys(obtainedMarks[firstStudentName][assignment]);
    const assessmentIds = {};

    questions.forEach((question) => {
      const parts = Object.keys(
        obtainedMarks[firstStudentName][assignment][question]
      );

      parts.forEach((part) => {
        const assessmentId =
          obtainedMarks[firstStudentName][assignment][question][part]
            .assessmentId;

        if (assessmentId) {
          if (!assessmentIds[assessmentId]) {
            assessmentIds[assessmentId] = true;
            if (!assessmentCounts[assessmentId]) {
              assessmentCounts[assessmentId] = 1;
            } else {
              assessmentCounts[assessmentId]++;
            }
          }
        }
      });
    });
  });

  const handleUpdateChanges = async () => {
    try {
      var res = await updateGrades({ marks: changedMarks });
      if (res) {
        toast.success("Marks Updated Successfully");
        console.log("Marks Updated", res);
      }
    } catch (error) {
      toast.error("Failed to update new marks.");
      console.log("Error", error);
    }
  };

  const handleExportPDF = () => {
    const tableContainer = tableContainerRef.current;
    tableContainer.scrollLeft = 0;
    tableContainer.scrollTop = 0;

    const dpi = 300; // Increase DPI for higher resolution
    const scale = dpi / 96; // Adjust scale factor based on DPI

    html2canvas(tableRef.current, { scrollX: -window.scrollX, scale: scale })
      .then((canvas) => {
        const pdf = new jsPDF("l", "pt", "a4");
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, null, "FAST"); // Use "FAST" option for better rendering
        pdf.save(course.name + " - " + course.courseType + "-scoreboard.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };

  return (
    <div>
      <div className="m-5">
        <Card
          style={{
            padding: "30px 20px 20px 20px",
            marginTop: "30px",
            marginBottom: "30px",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        >
          <div
            className="d-flex justify-content-center"
            style={{ color: "#346448" }}
          >
            <Menue />
          </div>
          <div className="row">
            <div className="col-md-12 d-flex justify-content-between">
              <p className="scoreboardheading">Final Scoreboard</p>
              <div>
                {/* <Button
                style={buttonStyles}
                  sx={{backgroundColor:'#346648', marginRight:'0.3em',color:'white',fontSize:'12px'}}
                  onClick={() => handleUpdateChanges()}
                >
                  Save Changes
                </Button> */}
                <Button
                  style={buttonStyles}
                  sx={{
                    backgroundColor: "#346648",
                    color: "white",
                    fontSize: "12px",
                  }}
                  onClick={handleExportPDF}
                >
                  Export to PDF
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={tableContainerRef}
            className="table-responsive py-0 px-0"
            // style={{ paddingTop: 20, textAlign: "center" }}
            style={{ height: "600px", overflow: "auto", textAlign: "center" }}
          >
            <table
              ref={tableRef}
              className="table table-bordered score4 text-center"
            >
              <thead>
                <tr className="score">
                  <th colSpan={3}>Participants</th>

                  {assignments.flatMap((assignment, index) => {
                    const assignmentData =
                      obtainedMarks[studentNames[0]][assignment];
                    const questionKeys = Object.keys(assignmentData);

                    var clo = 0;
                    var currentAssessmentId = 0;
                    var courseId = 0;
                    var assessmentName = null;
                    const columns = questionKeys.flatMap((question) => {
                      const questionData = assignmentData[question];
                      const partKeys = Object.keys(questionData);
                      const partColumns = partKeys.map((part) => {
                        const partData = questionData[part];
                        assessmentName = partData.assessmentName;
                        clo = partData.clo;
                        currentAssessmentId = partData.assessmentId;
                        courseId = partData.courseId;

                        return <th>{clo == 0 ? "No Clo" : "Clo " + clo}</th>;
                      });
                      return partColumns;
                    });
                    const nextAssignment = assignments[index + 1];
                    let nextAssessmentId = null;

                    if (nextAssignment) {
                      const nextAssignmentData =
                        obtainedMarks[studentNames[0]][nextAssignment];
                      const nextQuestionKeys = Object.keys(nextAssignmentData);

                      // Find the nextAssessmentId from any of the parts

                      for (let i = 0; i < nextQuestionKeys.length; i++) {
                        const questionData =
                          nextAssignmentData[nextQuestionKeys[i]];
                        const partKeys = Object.keys(questionData);
                        const partData = questionData[partKeys[0]]; // Assuming only one part per question

                        if (
                          partData &&
                          partData.hasOwnProperty("assessmentId")
                        ) {
                          nextAssessmentId = partData.assessmentId;
                          break;
                        }
                      }
                    }

                    if (currentAssessmentId !== nextAssessmentId) {
                      return [<th>{assessmentName}</th>];
                    }

                    // return [...columns];
                  })}
                  {course?.haveLab != 0 ? (
                    <th>Theory Total</th>
                  ) : (
                    <th>Grand Total</th>
                  )}
                  {course?.haveLab != 0 ? <th>Lab Total</th> : null}
                  {course?.haveLab != 0 ? <th>Grand Total</th> : null}
                  {<th>Grade</th>}

                  {cloIds?.map((cloId) => (
                    <th
                      style={{ top: "0px", whiteSpace: "nowrap" }}
                      key={cloId}
                    >
                      {"Clo " + cloData?.[0]?.cloAchievements[cloId]?.cloId}
                    </th>
                  ))}
                  {ploIds?.map((cloId) => (
                    <th
                      style={{ top: "0px", whiteSpace: "nowrap" }}
                      key={cloId}
                    >
                      Plo {ploData?.[0]?.cloAchievements[cloId]?.ploId}
                    </th>
                  ))}
                </tr>
                <tr className="score1">
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "#346448",
                      color: "white",
                      zIndex: 2,
                      backgroundColor: "#f5b204",
                      color: "black",
                    }}
                  >
                    Sr no.
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "56px",
                      backgroundColor: "#346448",
                      color: "white",
                      zIndex: 2,
                      backgroundColor: "#f5b204",
                      color: "black",
                    }}
                  >
                    Roll no.
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "123px",
                      backgroundColor: "#346448",
                      color: "white",
                      zIndex: 2,
                      backgroundColor: "#f5b204",
                      color: "black",
                    }}
                  >
                    Name
                  </td>

                  {assignments.flatMap((assignment, index) => {
                    console.log(assignment);
                    const assignmentData =
                      obtainedMarks[studentNames[0]][assignment];
                    const questionKeys = Object.keys(assignmentData);

                    var assignmentTotal = 0;
                    var assignmentWeightage = 0;
                    var currentAssessmentId = 0;
                    var courseId = 0;

                    const columns = questionKeys.flatMap((question) => {
                      const questionData = assignmentData[question];
                      const partKeys = Object.keys(questionData);
                      const partColumns = partKeys.map((part) => {
                        const partData = questionData[part];
                        const totalMarks = partData.questionTotalMarks;

                        assignmentTotal = partData.totalMarks;
                        assignmentWeightage = partData.weightage;
                        currentAssessmentId = partData.assessmentId;
                        courseId = partData.courseId;

                        return (
                          <th>
                            {part === "null"
                              ? " (" + totalMarks + ")"
                              : "P" + part + " (" + totalMarks + ")"}
                          </th>
                        );
                      });
                      return partColumns;
                    });

                    const nextAssignment = assignments[index + 1];
                    let nextAssessmentId = null;

                    if (nextAssignment) {
                      const nextAssignmentData =
                        obtainedMarks[studentNames[0]][nextAssignment];
                      const nextQuestionKeys = Object.keys(nextAssignmentData);

                      // Find the nextAssessmentId from any of the parts
                      for (let i = 0; i < nextQuestionKeys.length; i++) {
                        const questionData =
                          nextAssignmentData[nextQuestionKeys[i]];
                        const partKeys = Object.keys(questionData);
                        const partData = questionData[partKeys[0]]; // Assuming only one part per question

                        if (
                          partData &&
                          partData.hasOwnProperty("assessmentId")
                        ) {
                          nextAssessmentId = partData.assessmentId;
                          break;
                        }
                      }
                    }

                    assesmentTotalMarks =
                      assesmentTotalMarks +
                      assignmentWeightage /
                        assessmentCounts["" + currentAssessmentId];

                    if (currentAssessmentId !== nextAssessmentId) {
                      if (courseId == id) {
                        totalGrandtotal =
                          parseFloat(totalGrandtotal) +
                          parseFloat(assesmentTotalMarks);
                      }
                      let marks = Number(assesmentTotalMarks).toFixed(1);
                      assesmentTotalMarks = 0;
                      return [<th>{parseFloat(marks).toFixed(1)}</th>];
                    }

                    // return [...columns];
                  })}

                  <th>
                    {course?.haveLab == 0 && course?.mainCourse == 0
                      ? parseFloat(totalGrandtotal).toFixed(1)
                      : course?.mainCourse == 0
                      ? Number(parseFloat(totalGrandtotal) * 0.75).toFixed(1)
                      : Number(parseFloat(totalGrandtotal) * 0.5).toFixed(1)}
                  </th>

                  {course?.haveLab != 0 &&
                    studentNames.map((studentName, index) => {
                      if (index === 0) {
                        if (studentData[index].labMarks) {
                          Object.keys(studentData[index].labMarks).forEach(
                            (labMarkKey) => {
                              labTotal +=
                                studentData[index].labMarks[labMarkKey]
                                  .weightage;
                            }
                          );
                        }
                        return <th>{(labTotal * 0.5).toFixed(1)}</th>;
                      }
                    })}

                  {course?.haveLab != 0 && (
                    <th>
                      {Number(
                        parseFloat(labTotal * 0.5) +
                          parseFloat(totalGrandtotal) * 0.75
                      ).toFixed(1)}
                    </th>
                  )}
                  <th></th>
                  {cloIds?.map((cloId) => (
                    <th style={{ top: "0px" }} key={cloId}>
                      {
                        cloData?.[0]?.cloAchievements[cloId]?.totalMarks
                          ? Number(
                              cloData[0].cloAchievements[cloId].totalMarks
                            ).toFixed(1)
                          : "N/A" // Set a default value or handle the case when the value is not available
                      }
                    </th>
                  ))}
                  {ploIds?.map((cloId) => (
                    <th style={{ top: "0px" }} key={cloId}>
                      {Number(
                        ploData?.[0]?.cloAchievements[cloId]?.totalMarks
                      ).toFixed(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentNames.map((studentName, index) => {
                  labObtained = 0.0;
                  if (studentData[index].labMarks) {
                    Object.keys(studentData[index].labMarks).forEach(
                      (labMarkKey) => {
                        labObtained +=
                          (studentData[index].labMarks[labMarkKey]
                            .obtainedMarks /
                            studentData[index].labMarks[labMarkKey]
                              .totalMarks) *
                          studentData[index].labMarks[labMarkKey].weightage;
                      }
                    );
                  }
                  var grandTotal = 0;
                  var finalGrandTotal = 0;
                  var totalMarks = 0;
                  console.log("assignment before");

                  return (
                    <tr key={index} className="score2">
                      <td>{index + 1}</td>
                      <td>{studentData[index].rollNo}</td>
                      <td>{studentName}</td>
                      {assignments.flatMap((assignment, assIndex) => {
                        console.log("assignment start");

                        const assignmentData =
                          obtainedMarks[studentName][assignment];
                        const questionKeys = Object.keys(assignmentData);
                        let columns = questionKeys.flatMap((question) => {
                          const questionData = assignmentData[question];
                          const partKeys = Object.keys(questionData);
                          return partKeys.map((part) => (
                            <td style={{ minWidth: "50px" }}>
                              {typeof obtainedMarks[studentName][assignment][
                                question
                              ][part.obtainedMarks] === "object" ? (
                                "-"
                              ) : (
                                <input
                                  type="number"
                                  value={
                                    obtainedMarks[studentName][assignment][
                                      question
                                    ][part].obtainedMarks
                                  }
                                  onChange={(event) => {
                                    const inputValue = event.target.value;
                                    const validInput = /^\d*\.?\d*$/.test(
                                      inputValue
                                    )
                                      ? inputValue
                                      : "0";
                                    handleMarkChange(
                                      {
                                        ...event,
                                        target: {
                                          ...event.target,
                                          value: validInput,
                                        },
                                      },
                                      studentName,
                                      assignment,
                                      question,
                                      part
                                    );
                                  }}
                                  min={0}
                                  step="any"
                                  onKeyDown={(event) => {
                                    const key = event.key;
                                    if (
                                      key === "-" || // Prevent entering negative numbers
                                      (key === "e" &&
                                        event.target.value.includes("e")) // Prevent entering exponential notation
                                    ) {
                                      event.preventDefault();
                                    }
                                  }}
                                />
                              )}
                            </td>
                          ));
                        });
                        var weightage = 0;
                        var examTotalMarks = 0;
                        var assesmentId = 0;
                        var courseId = 0;
                        var nextAssignment = null;
                        var nextAssessmentId = null;

                        totalMarks = questionKeys.reduce((total, question) => {
                          const questionData = assignmentData[question];
                          const partKeys = Object.keys(questionData);

                          partKeys.forEach((part, index) => {
                            if (index == 0) {
                              weightage =
                                obtainedMarks[studentName][assignment][
                                  question
                                ][part].weightage;
                              assesmentId =
                                obtainedMarks[studentName][assignment][
                                  question
                                ][part].assessmentId;
                              courseId =
                                obtainedMarks[studentName][assignment][
                                  question
                                ][part].courseId;
                              examTotalMarks =
                                obtainedMarks[studentName][assignment][
                                  question
                                ][part].totalMarks;
                            }
                            nextAssignment = assignments[assIndex + 1];
                            nextAssessmentId = null;
                            console.log("Next Assisgment", nextAssignment);
                            if (nextAssignment) {
                              const nextAssignmentData =
                                obtainedMarks[studentName][nextAssignment];
                              const nextQuestionKeys =
                                Object.keys(nextAssignmentData);
                              console.log("Next ", nextAssignmentData);
                              // Find the nextAssessmentId from any of the parts
                              for (
                                let i = 0;
                                i < nextQuestionKeys.length;
                                i++
                              ) {
                                const questionData =
                                  nextAssignmentData[nextQuestionKeys[i]];
                                const partKeys = Object.keys(questionData);
                                const partData = questionData[partKeys[0]]; // Assuming only one part per question

                                if (
                                  partData &&
                                  partData.hasOwnProperty("assessmentId")
                                ) {
                                  nextAssessmentId = partData.assessmentId;
                                  break;
                                }
                              }
                            }

                            total =
                              parseFloat(total) +
                              parseFloat(
                                obtainedMarks[studentName][assignment][
                                  question
                                ][part].obtainedMarks
                              );
                          });
                          console.log("assignment befre total");

                          return total;
                          // return Object.keys(obtainedMarks[studentName][assignment]).length;
                        }, 0);

                        grandTotal =
                          grandTotal +
                          (totalMarks / examTotalMarks) *
                            (weightage / assessmentCounts["" + assesmentId]);

                        if (
                          parseInt(assesmentId) != parseInt(nextAssessmentId)
                        ) {
                          if (courseId == id) {
                            finalGrandTotal =
                              parseFloat(finalGrandTotal) +
                              parseFloat(grandTotal);
                          }
                          let marks = grandTotal;
                          grandTotal = 0;
                          return [<td>{Number(marks).toFixed(1)}</td>, ,];
                        }
                        // grandTotal=0;
                        // return columns;
                      })}
                      <td
                        className={
                          ((finalGrandTotal * 0.75) / 75) * 100 < 50
                            ? "bg-danger text-white"
                            : ""
                        }
                      >
                        {course?.haveLab == 0 && course?.mainCourse == 0
                          ? parseFloat(finalGrandTotal).toFixed(1)
                          : course?.mainCourse == 0
                          ? Number(parseFloat(finalGrandTotal) * 0.75).toFixed(
                              1
                            )
                          : Number(parseFloat(finalGrandTotal) * 0.5).toFixed(
                              1
                            )}
                      </td>

                      {course?.haveLab != 0 ? (
                        <td
                          className={
                            ((labObtained * 0.5) / 25) * 100 < 50
                              ? "bg-danger text-white"
                              : ""
                          }
                        >
                          {(labObtained * 0.5).toFixed(1)}
                        </td>
                      ) : null}

                      {course?.haveLab != 0 && (
                        <td>
                          {(((labObtained * 0.5) / 25) * 100 < 50 ||
                          ((finalGrandTotal * 0.75) / 75) * 100 < 50) && ( parseFloat(labObtained * 0.5) +
                          parseFloat(finalGrandTotal) * 0.75>50)
                            ? 49
                            : Number(
                                parseFloat(labObtained * 0.5) +
                                  parseFloat(finalGrandTotal) * 0.75
                              ).toFixed(1)}
                        </td>
                      )}
                      <td>
                        {(() => {
                          var totalNumber = 0;
                          if (course?.haveLab != 0) {
                            totalNumber =
                              ((labObtained * 0.5) / 25) * 100 < 50 ||
                              ((finalGrandTotal * 0.75) / 75) * 100 < 50
                                ? 49
                                : Number(
                                    parseFloat(labObtained * 0.5) +
                                      parseFloat(finalGrandTotal) * 0.75
                                  ).toFixed(1);
                          } else {
                            totalNumber = finalGrandTotal;
                          }

                          if (totalNumber >= 85 && totalNumber <= 100) {
                            return <span style={{ color: "green" }}>A</span>;
                          } else if (totalNumber >= 80 && totalNumber <= 84) {
                            return <span style={{ color: "green" }}>A-</span>;
                          } else if (totalNumber >= 75 && totalNumber <= 79) {
                            return <span style={{ color: "blue" }}>B+</span>;
                          } else if (totalNumber >= 70 && totalNumber <= 74) {
                            return <span style={{ color: "blue" }}>B</span>;
                          } else if (totalNumber >= 65 && totalNumber <= 69) {
                            return <span style={{ color: "blue" }}>B-</span>;
                          } else if (totalNumber >= 61 && totalNumber <= 64) {
                            return <span style={{ color: "orange" }}>C+</span>;
                          } else if (totalNumber >= 58 && totalNumber <= 60) {
                            return <span style={{ color: "orange" }}>C</span>;
                          } else if (totalNumber >= 55 && totalNumber <= 57) {
                            return <span style={{ color: "orange" }}>C-</span>;
                          } else if (totalNumber >= 53 && totalNumber <= 54) {
                            return <span style={{ color: "orange" }}>D+</span>;
                          } else if (totalNumber >= 50 && totalNumber <= 52) {
                            return <span style={{ color: "orange" }}>D</span>;
                          } else {
                            return <span style={{ color: "red" }}>F</span>;
                          }
                        })()}
                      </td>

                      {cloData?.map(
                        (student, index) =>
                          student.name == studentName &&
                          cloIds.map((cloId) => (
                            <td
                              key={cloId}
                              className={
                                "text-success " +
                                (parseFloat(
                                  student.cloAchievements[cloId]
                                    ?.obtainedMarks /
                                    student.cloAchievements[cloId]?.totalMarks
                                ) *
                                  100 <
                                parseFloat(
                                  student.cloAchievements[cloId]?.cloKpi
                                )
                                  ? "bg-danger text-white"
                                  : "")
                              }
                            >
                              {student.cloAchievements[cloId] ? (
                                <>
                                  {Number(
                                    student.cloAchievements[cloId].obtainedMarks
                                  ).toFixed(1) +
                                    " (" +
                                    Number(
                                      (student.cloAchievements[cloId]
                                        .obtainedMarks /
                                        student.cloAchievements[cloId]
                                          .totalMarks) *
                                        100
                                    ).toFixed(1) +
                                    "% )"}
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                          ))
                      )}
                      {ploData?.map(
                        (student, index) =>
                          student.name == studentName &&
                          ploIds.map((cloId) => (
                            <td
                              key={cloId}
                              className={
                                "text-success " +
                                (parseFloat(
                                  student.cloAchievements[cloId]
                                    ?.obtainedMarks /
                                    student.cloAchievements[cloId]?.totalMarks
                                ) *
                                  100 <
                                parseFloat(
                                  student.cloAchievements[cloId]?.ploKpi
                                )
                                  ? "bg-danger text-white"
                                  : "")
                              }
                            >
                              {student.cloAchievements[cloId] ? (
                                <>
                                  {parseFloat(
                                    student.cloAchievements[cloId]
                                      ?.obtainedMarks /
                                      student.cloAchievements[cloId]?.totalMarks
                                  ) *
                                    100 <
                                  parseFloat(
                                    student.cloAchievements[cloId]?.ploKpi
                                  )
                                    ? "No"
                                    : "Yes"}
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                          ))
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}