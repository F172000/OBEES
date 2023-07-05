import React from "react";
import {
  Paper,
  Button,
  Grid,
  TextField,
  IconButton,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { countExam, addExam, getStudentsByCourse, getClo } from "../apiCalls";
import { toast } from "react-toastify";
import Menue from "./Menue";
const Quizform = () => {
  const navigate = useNavigate();
  const { assisment_id } = useParams();
  const { id } = useParams();
  const [formInfo, setFormInfo] = useState();
  const [count, setCount] = useState(1);
  const [isStudents, setIsStudents] = useState(false);
  const [clos, setClos] = useState([]);
  useEffect(() => {
    fetchCount();
    fetchStudents();
    fetchClo();
  }, [assisment_id]);
  const fetchClo = async () => {
    try {
      var res = await getClo({ id: id });
      if (res) {
        setClos(res.data);
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchStudents = async () => {
    try {
      var res = await getStudentsByCourse({ id: id });
      console.log(res);
      if (res.data.length > 0) {
        setIsStudents(true);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchCount = async () => {
    try {
      var res = await countExam({ id: assisment_id });
      if (res) {
        console.log("Success", res);
        if (
          res.data.assessmentData[0].name == "Midterm" ||
          res.data.assessmentData[0].name == "Final Term" ||
          res.data.assessmentData[0].name == "Lab exam" ||
          res.data.assessmentData[0].name == "Project" ||
          res.data.assessmentData[0].name == "Lab project"
        ) {
          if (res.data.count > 0) {
            toast.error(
              "You cannot create morethan one " +
                res.data.assessmentData[0].name
            );
            navigate("/assessmentdashboard/" + id);

            return;
          }
          setCount(-1);
        } else {
          setCount(res.data.count + 1);
        }
        setFormInfo(res.data);
      }
      console.log("Count", count);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const [quiz, setquiz] = useState({
    number: 1,
    totalMarks: "",
    examName: formInfo?.assessmentData[0].name + count,

    questions: [
      {
        questionNumber: 1,
        clo: 0, // input type number
        marks: "", // input type number
        parts: [],
      },
    ],
  });

  const addParts = (questionIndex) => {
    const newQuiz = { ...quiz };
    const currentQuestionObject = newQuiz.questions[questionIndex];
    const partNo = currentQuestionObject.parts.length + 1;

    // if (currentQuestionObject.clo !== "") {
    //   // Reset CLO if it is selected for the question
    //   currentQuestionObject.clo = "";
    // }

    currentQuestionObject.parts.push({
      part: partNo,
      clo: 0,
      marks: "",
    });

    setquiz(newQuiz);
  };

  const addQuestion = () => {
    const newQuiz = { ...quiz };
    newQuiz.questions.push({
      questionNumber: newQuiz.questions.length + 1,
      clo: 0, // input type number
      marks: "", // input type number
      parts: [], // initialize parts array
    });
    setquiz(newQuiz);
  };

  const handleMarksChange = (event, questionIndex, partIndex, isQuestion) => {
    const newQuiz = { ...quiz };
    const inputValue = event.target.value;
    if (isQuestion) {
      if (inputValue.match(/^\d*\.?\d*$/)) {
        newQuiz.questions[questionIndex].marks = inputValue;
      } else {
        newQuiz.questions[questionIndex].marks = "";
      }

      // Adjust part marks if total marks exceed question marks
      const totalMarks = newQuiz.questions[questionIndex].parts.reduce(
        (total, part) => total + parseInt(part.marks || 0),
        0
      );
      if (totalMarks > newQuiz.questions[questionIndex].marks) {
        newQuiz.questions[questionIndex].parts.forEach((part) => {
          part.marks = "";
        });
      }
    } else {
      if (inputValue.match(/^\d*\.?\d*$/)) {
        newQuiz.questions[questionIndex].parts[partIndex].marks = inputValue;
      } else {
        newQuiz.questions[questionIndex].parts[partIndex].marks = "";
      }

      // Adjust other part marks if total marks exceed question marks
      const totalMarks = newQuiz.questions[questionIndex].parts.reduce(
        (total, part) => total + parseInt(part.marks || 0),
        0
      );
      if (totalMarks > newQuiz.questions[questionIndex].marks) {
        newQuiz.questions[questionIndex].parts[partIndex].marks = "";
        toast.error(
          "Sum of marks of parts cannot be greater then the total marks of question."
        );
        // newQuiz.questions[questionIndex].parts.forEach((part, idx) => {
        //   if (idx !== partIndex) {
        //     part.marks = "";
        //   }
        // });
      }
    }

    // Calculate the total marks of all main questions
    const totalMainQuestionMarks = newQuiz.questions.reduce(
      (total, question) => total + parseFloat(question.marks || 0),
      0
    );
    // Compare the total main question marks with the quiz total marks
    if (totalMainQuestionMarks > parseFloat(newQuiz.totalMarks || 0)) {
      // If total main question marks exceed quiz total marks, reset marks
      toast.error(
        "Sum of marks of all questions can not be greater than the total marks of the exam."
      );
      if (isQuestion) {
        newQuiz.questions[questionIndex].marks = "";
      } else {
        newQuiz.questions[questionIndex].parts[partIndex].marks = "";
      }
    }
    setquiz(newQuiz);
  };

  const handleQuiz1TotalMarksChange = (event) => {
    const inputValue = event.target.value;
    const newQuiz = { ...quiz }; // create a new copy of the quiz object
    // Calculate the total marks of all main questions

    if (inputValue.match(/^\d+$/)) {
      newQuiz.totalMarks = parseInt(inputValue, 10); // convert the input value to an integer
    } else {
      newQuiz.totalMarks = ""; // reset the total marks if the input is not a positive number
    }

    const totalMainQuestionMarks = newQuiz.questions.reduce(
      (total, question) => total + parseFloat(question.marks || 0),
      0
    );
    // Compare the total main question marks with the quiz total marks
    if (totalMainQuestionMarks > parseFloat(newQuiz.totalMarks || 0)) {
      newQuiz.totalMarks = totalMainQuestionMarks;
      toast.error(
        "Total Marks cannot be less than the sum of questions marks "
      );
    }

    setquiz(newQuiz); // update the state of the quiz object
  };

  const handleCloChange = (event, questionIndex, partIndex, isQuestion) => {
    const newQuiz = { ...quiz };

    if (isQuestion) {
      if (
        newQuiz.questions[questionIndex].parts.some((part) => part.clo !== 0)
      ) {
        // Reset all part CLO values to 0 if question CLO is selected
        newQuiz.questions[questionIndex].parts.forEach((part) => {
          part.clo = 0;
        });
      }
      newQuiz.questions[questionIndex].clo = event.target.value;
    } else {
      newQuiz.questions[questionIndex].clo = 0;

      newQuiz.questions[questionIndex].parts[partIndex].clo =
        event.target.value;
    }

    setquiz(newQuiz);
  };

  const handleRemoveQuestion = (questionIndex) => {
    console.log(questionIndex);
    const newQuiz = { ...quiz };
    newQuiz.questions.splice(questionIndex, 1);
    newQuiz.questions.forEach((question, index) => {
      question.no = index + 1;
    });
    setquiz(newQuiz);
  };
  const handleRemoveParts = (questionIndex, partIndex) => {
    const newQuiz = { ...quiz };
    newQuiz.questions[questionIndex].parts.splice(partIndex, 1);
    newQuiz.questions[questionIndex].parts.forEach((part, index) => {
      part.no = index + 1;
    });
    setquiz(newQuiz);
    console.log(quiz);
  };
  const handleSubmit = async (event) => {
    if (!isStudents) {
      toast.error(
        "No students are currently enrolled in this course. Please enroll at least one student before proceeding."
      );
      return;
    }
    if (quiz.totalMarks <= 0 || !quiz.totalMarks) {
      toast.error("Exam Total Marks cannot be empty or zero.");
      return;
    }
    var incrementedCount = "";
    if (parseInt(count) >= 0) {
      incrementedCount = parseInt(count);
    }

    ////To check if total marks is exactly equals to all marks of questions and thier parts
    var currentTotal = 0;
    quiz.questions.map((question) => {
      if (question.parts.length > 0) {
        question.parts.map((part) => {
          if (parseFloat(part.marks) > 0 && part.marks != "") {
            currentTotal = parseFloat(currentTotal) + parseFloat(part.marks);
          }
        });
      } else {
        if (parseFloat(question.marks) > 0 && question.marks != "") {
          currentTotal = parseFloat(currentTotal) + parseFloat(question.marks);
        }
      }
    });

    if (currentTotal != quiz.totalMarks) {
      toast.error(
        "Total " +
          (parseFloat(quiz.totalMarks) - parseFloat(currentTotal)) +
          " Marks of the exam are still un assigned."
      );
      return;
    }

    var data = {
      questions: quiz.questions,
      marks: quiz.totalMarks,
      assessmentId: assisment_id,
      courseId: id,
      examName: formInfo?.assessmentData[0].name + " " + incrementedCount,
    };
    console.log(data);
    try {
      var res = await addExam(data);
      if (res) {
        toast.success("Saved Successfully");
        console.log(res);
        navigate("/assessmentdashboard/" + id);
        // setquiz({
        //   number: 1,
        //   totalMarks: "",
        //   questions: [
        //     {
        //       no: 1,
        //       clo: "", // input type number
        //       marks: "", // input type number
        //       parts: [
        //         {
        //           no: 1,
        //           clo: "",
        //           marks: "",
        //         },
        //       ],
        //     },
        //   ],
        // });
      }
      console.log("Success", res);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div>
      <Paper
        elevation={5}
        sx={{
          padding: "50px",
          marginTop: "30px",
          marginBottom: "30px",
          marginLeft: { xs: "0", sm: "0", md: "20%", lg: "20%" },
          marginRight: { xs: "0", sm: "0", md: "20%", lg: "20%" },
          width: { xs: "100%", sm: "100%", md: "60%", lg: "60%" },
        }}
      >
        {/* <Menue /> */}

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <h6 align="center" className="quizheading">
              {formInfo?.assessmentData[0].name} {count > 0 ? count : ""}
            </h6>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            className="d-flex justify-content-start quizcontent"
          >
            <p>Total Marks:</p>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              type="number"
              variant="outlined"
              value={quiz.totalMarks}
              onChange={(event) => handleQuiz1TotalMarksChange(event)}
              size="small"
              className="inputfield"
              placeholder="Enter Marks"
            />
          </Grid>

          {quiz.questions.map((ques, questionIndex) => (
            <React.Fragment key={questionIndex}>
              <Grid item xs={12} className="mt-1">
                <div className="row">
                  <div className="col mt-1 d-flex justify-content-start quizcontent">
                    <p>Question {questionIndex + 1}:</p>
                  </div>
                  <div className="col d-flex justify-content-end">
                    <IconButton
                      onClick={() => handleRemoveQuestion(questionIndex)}
                    >
                      <CancelIcon className="plusiconbutton" />
                    </IconButton>
                  </div>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={2}
                className="mt-1 d-flex justify-content-start quizcontent"
              >
                <p>CLO:</p>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  fullWidth
                  variant="filled"
                  size="small"
                  select
                  className="inputfield"
                  value={ques.clo}
                  onChange={(event) =>
                    handleCloChange(event, questionIndex, 0, true)
                  }
                  placeholder="Select CLO"
                >
                  <MenuItem value={0}>None</MenuItem>
                  {clos.map((clo) => (
                    <MenuItem key={clo.id} value={clo.id}>
                      {clo.id} - {clo.clo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={2}
                className="mt-1 d-flex justify-content-start quizcontent"
              >
                <p>Total Marks:</p>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  value={ques.marks}
                  onChange={(event) =>
                    handleMarksChange(event, questionIndex, 0, true)
                  }
                  size="small"
                  className="inputfield"
                  placeholder="Enter Marks"
                />
              </Grid>
              <Grid item xs={12} className="mt-1">
                <div className="row">
                  <div className="col mt-1 d-flex justify-content-start quizcontent">
                    <p>Add Parts of Question {questionIndex + 1}:</p>
                  </div>
                  <div className="col d-flex justify-content-end">
                    <IconButton onClick={() => addParts(questionIndex)}>
                      <AddCircleIcon className="plusiconbutton" />
                    </IconButton>
                  </div>
                </div>
              </Grid>
              {ques.parts.map((part, partIndex) => (
                <React.Fragment key={partIndex}>
                  <Grid item xs={12}>
                    <div className="row">
                      <div className="col mt-1 d-flex justify-content-start quizcontent">
                        <p>Part {part.part}:</p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <IconButton
                          onClick={() =>
                            handleRemoveParts(questionIndex, partIndex)
                          }
                        >
                          <CancelIcon className="plusiconbutton" />
                        </IconButton>
                      </div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    className="mt-1 d-flex justify-content-start quizcontent"
                  >
                    <p>CLO:</p>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      fullWidth
                      variant="filled"
                      size="small"
                      value={part.clo}
                      onChange={(event) =>
                        handleCloChange(event, questionIndex, partIndex, false)
                      }
                      select
                      className="inputfield"
                    >
                      <MenuItem value={0}>None</MenuItem>
                      {clos.map((clo) => (
                        <MenuItem key={clo.id} value={clo.id}>
                          {clo.id} - {clo.clo}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    className="mt-1 d-flex justify-content-start quizcontent"
                  >
                    <p>Total Marks:</p>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={part.marks}
                      onChange={(event) =>
                        handleMarksChange(
                          event,
                          questionIndex,
                          partIndex,
                          false
                        )
                      }
                      className="inputfield"
                      placeholder="Enter Marks"
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          <Grid item xs={12} className="mt-1">
            <div className="row">
              <div className="col mt-1 d-flex justify-content-start quizcontent">
                <p>Add Questions</p>
              </div>
              <div className="col d-flex justify-content-end">
                <IconButton onClick={addQuestion}>
                  <AddCircleIcon className="plusiconbutton" />
                </IconButton>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={(event) => navigate("/assessmentdashboard/" + id)}
              variant="contained"
              className="quizbutton me-3"
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
                backgroundColor: "#346448",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={(event) => handleSubmit(event)}
              variant="contained"
              className="quizbutton"
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
                backgroundColor: "#346448",
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Quizform;
