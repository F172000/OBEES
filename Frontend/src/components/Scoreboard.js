import React, { useEffect, useRef } from "react";
import { getMarkSheet, updateGrades, getCourseById } from "../apiCalls";
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
import Button from '@mui/material/Button';
import { toast } from "react-toastify";
import Menue from "./Menue";
export default function Scoreboard() {
  const [updatedMarks, setUpdatedMarks] = React.useState([]);
  const [course, setCourse] = React.useState([]);
  var assesmentTotalMarks = 0;
  const tableRef = useRef(null);
  const tableContainerRef = useRef(null);

  // const [totalGrandtotal, settotalGrandtotal] = React.useState([]);
  var totalGrandtotal = 0.0;
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
  }, [id]);

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
      var res = await getMarkSheet({ id: id });
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
    };
  });

  const assignments = Object.keys(obtainedMarks[studentNames[0]]).filter(
    (key) => key !== "studentRollno"
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
              <p className="scoreboardheading">Scoreboard</p>
              <div>
                <Button
                style={buttonStyles}
                  sx={{backgroundColor:'#346648', marginRight:'0.3em',color:'white',fontSize:'12px'}}
                  onClick={() => handleUpdateChanges()}
                >
                  Save Changes
                </Button>
                <Button
                style={buttonStyles}
                 sx={{backgroundColor:'#346648',color:'white',fontSize:'12px'}}
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
                  <th rowSpan="3" colSpan="3">
                    Participants
                  </th>
                  {assignments.flatMap((assignment, index) => {
                    const assignmentData =
                      obtainedMarks[studentNames[0]][assignment];
                    const questionKeys = Object.keys(assignmentData);
                    var colSpan = 0;
                    var currentAssessmentId = 0;
                    questionKeys.flatMap((question) => {
                      const questionData = assignmentData[question];
                      const partKeys = Object.keys(questionData);
                      colSpan += partKeys.length > 0 ? partKeys.length : 1;
                      partKeys.map((part) => {
                        const partData = questionData[part];

                        currentAssessmentId = partData.assessmentId;
                      });
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

                    if (currentAssessmentId != nextAssessmentId) {
                      return [
                        <th
                          style={{
                            minWidth: "50px",

                            whiteSpace: "nowrap",
                          }}
                          colSpan={colSpan}
                        >
                          {assignment}
                        </th>,
                        <th
                          style={{
                            minWidth: "50px",

                            whiteSpace: "nowrap",
                          }}
                        ></th>,
                      ];
                    }
                    return [
                      <th
                        style={{
                          minWidth: "50px",

                          whiteSpace: "nowrap",
                        }}
                        colSpan={colSpan}
                      >
                        {assignment}
                      </th>,
                    ];
                  })}

                  <th></th>
                </tr>
                <tr className="score1 ">
                  {assignments.flatMap((assignment, index) => {
                    var currentAssessmentId = 0;
                    const assignmentData =
                      obtainedMarks[studentNames[0]][assignment];
                    const questionKeys = Object.keys(assignmentData);

                    const columns = questionKeys.flatMap((question) => {
                      const questionData = assignmentData[question];

                      const partKeys = Object.keys(questionData);
                      partKeys.map((part) => {
                        const partData = questionData[part];

                        currentAssessmentId = partData.assessmentId;
                      });
                      const colSpan = partKeys.length > 0 ? partKeys.length : 1;
                      return <th colSpan={colSpan}>{"Q" + question}</th>;
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
                      return [...columns, <th></th>];
                    }

                    return [...columns];
                  })}
                  <th></th>
                </tr>
                <tr className="score1">
                  {assignments.flatMap((assignment, index) => {
                    const assignmentData =
                      obtainedMarks[studentNames[0]][assignment];
                    const questionKeys = Object.keys(assignmentData);

                    var clo = 0;
                    var currentAssessmentId = 0;
                    const columns = questionKeys.flatMap((question) => {
                      const questionData = assignmentData[question];
                      const partKeys = Object.keys(questionData);
                      const partColumns = partKeys.map((part) => {
                        const partData = questionData[part];
                        clo = partData.clo;
                        currentAssessmentId = partData.assessmentId;

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
                      return [...columns, <th>Total</th>];
                    }

                    return [...columns];
                  })}
                  <th></th>
                </tr>
                <tr className="score2">
                  <th>Sr no.</th>
                  <th>Roll no.</th>
                  <th>Name</th>

                  {assignments.flatMap((assignment, index) => {
                    console.log(assignment);
                    const assignmentData =
                      obtainedMarks[studentNames[0]][assignment];
                    const questionKeys = Object.keys(assignmentData);

                    var assignmentTotal = 0;
                    var assignmentWeightage = 0;
                    var currentAssessmentId = 0;

                    const columns = questionKeys.flatMap((question) => {
                      const questionData = assignmentData[question];
                      const partKeys = Object.keys(questionData);
                      const partColumns = partKeys.map((part) => {
                        const partData = questionData[part];
                        const totalMarks = partData.questionTotalMarks;
                        assignmentTotal = partData.totalMarks;
                        assignmentWeightage = partData.weightage;
                        currentAssessmentId = partData.assessmentId;

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
                      totalGrandtotal =
                        parseFloat(totalGrandtotal) +
                        parseFloat(assesmentTotalMarks);
                      let marks = Number(assesmentTotalMarks).toFixed(1);
                      assesmentTotalMarks = 0;
                      return [
                        ,
                        ...columns,
                        <th>{parseFloat(marks).toFixed(1)}</th>,
                      ];
                    }

                    return [...columns];
                  })}

                  <th>
                    Grand Total (
                    {course?.haveLab == 0 && course?.mainCourse == 0
                      ? parseFloat(totalGrandtotal).toFixed(1)
                      : course?.mainCourse == 0
                      ? Number(parseFloat(totalGrandtotal) * 0.75).toFixed(1)
                      : Number(parseFloat(totalGrandtotal) * 0.50).toFixed(1)}
                    )
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentNames.map((studentName, index) => {
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
                          finalGrandTotal =
                            parseFloat(finalGrandTotal) +
                            parseFloat(grandTotal);
                          let marks = grandTotal;
                          grandTotal = 0;
                          return [
                            ...columns,
                            <td
                              className="text-white"
                              style={{
                                minWidth: "50px",
                                backgroundColor: "#346448",
                              }}
                            >
                              {Number(marks).toFixed(1)}
                            </td>,
                            ,
                          ];
                        }
                        // grandTotal=0;
                        return columns;
                      })}
                      <td>
                        {course?.haveLab == 0 && course?.mainCourse == 0
                          ? parseFloat(finalGrandTotal).toFixed(1)
                          : course?.mainCourse == 0
                          ? Number(parseFloat(finalGrandTotal) * 0.75).toFixed(
                              1
                            )
                          : Number(parseFloat(finalGrandTotal) * 0.50).toFixed(
                              1
                            )}
                      </td>
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
