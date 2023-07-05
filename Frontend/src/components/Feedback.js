import React, { useEffect, useState } from "react";
import { Card, Button } from "@mui/material";
import { getQuestions, getCourseById, saveFeedback } from "../apiCalls";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const Feedback = () => {
  const [questions, setQuestions] = useState([]);
  const [course, setCourse] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [comments, setComments] = useState("");
  const { id } = useParams();
  useEffect(() => {
    fetchQuestions();
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const res = await getCourseById({ id: id });
      if (res) {
        setCourse(res.data[0]);
        console.log("Res", res.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchQuestions = async () => {
    try {
      const response = await getQuestions();
      console.log("Questions", response);
      setQuestions(response.data);
      initializeFeedbackState(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const buttonStyles = {
    backgroundColor: "#346448",
    marginRight: "5em",
    padding: "5px 17px",
    "&:hover": {
      backgroundColor: "#346448", // Ensures hover doesn't change the color
    },
  };

  const initializeFeedbackState = (questions) => {
    const initialState = questions?.map((question) => ({
      feedback_id: question.feedback_id,
      course_id: id,
      answer: "",
    }));
    setFeedback(initialState);
  };

  const handleOptionChange = (feedbackId, option) => {
    setFeedback((prevFeedback) =>
      prevFeedback.map((answer) =>
        answer.feedback_id === feedbackId
          ? { ...answer, answer: option }
          : answer
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasEmptyAnswer = feedback.some((answer) => answer.answer.trim() === "");
    if (hasEmptyAnswer) {
      toast.error("Please provide an answer for all questions.");
      return;
    }
    const newFeedback = {
      feedback_id: 0,
      course_id: id,
      answer: comments,
    };

    const updatedFeedback = [...feedback, newFeedback]; // Create the updated feedback array

    try {
      await saveFeedback(updatedFeedback); // Send the updated feedback array
      setFeedback(updatedFeedback); // Update the local state with the updated feedback
      toast.success("Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };


  const setcolor = {
    color: "#346448",
  };

  return (
    <div>
      <Card
        style={{
          padding: "30px",
          marginTop: "30px",
          marginBottom: "30px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center mb-5 mt-5 coursename">
            {course.courseCode} {course.name} {course.department} (Feedback)
          </div>
        </div>
        <div class="container">
          <form>
            {questions?.map((question) => (
              <div key={question.feedback_id}>
                <h5 className="my-2" style={setcolor}>
                  <b>{question.question}</b>
                </h5>
                <label className="my-2" style={setcolor}>
                  <input
                    type="radio"
                    value="Strongly Agree"
                    checked={
                      feedback.find(
                        (answer) => answer.feedback_id === question.feedback_id
                      )?.answer === "Strongly Agree"
                    }
                    onChange={() =>
                      handleOptionChange(question.feedback_id, "Strongly Agree")
                    }
                    className="radiostyles"
                  />
                  Strongly Agree
                </label>
                <label className="my-2 me-4 labelbuttons" style={setcolor}>
                  <input
                    type="radio"
                    value="Agree"
                    checked={
                      feedback.find(
                        (answer) => answer.feedback_id === question.feedback_id
                      )?.answer === "Agree"
                    }
                    onChange={() =>
                      handleOptionChange(question.feedback_id, "Agree")
                    }
                    className="radiostyles"
                  />
                  Agree
                </label>
                <label className="my-2 me-4 labelbuttons" style={setcolor}>
                  <input
                    type="radio"
                    value="good"
                    checked={
                      feedback.find(
                        (answer) => answer.feedback_id === question.feedback_id
                      )?.answer === "good"
                    }
                    onChange={() =>
                      handleOptionChange(question.feedback_id, "good")
                    }
                    className="radiostyles"
                  />
                  Good
                </label>
                <label className="my-3 me-4 labelbuttons" style={setcolor}>
                  <input
                    type="radio"
                    value="Disagree"
                    checked={
                      feedback.find(
                        (answer) => answer.feedback_id === question.feedback_id
                      )?.answer === "Disagree"
                    }
                    onChange={() =>
                      handleOptionChange(question.feedback_id, "Disagree")
                    }
                    className="radiostyles"
                  />
                  Disagree
                </label>
                <label className="my-2 me-4 labelbuttons">
                  <input
                    type="radio"
                    value="Strongly Disagree"
                    checked={
                      feedback.find(
                        (answer) => answer.feedback_id === question.feedback_id
                      )?.answer === "Strongly Disagree"
                    }
                    onChange={() =>
                      handleOptionChange(
                        question.feedback_id,
                        "Strongly Disagree"
                      )
                    }
                    className="radiostyles"
                  />
                  Strongly Disagree
                </label>
              </div>
            ))}
            <h5 className="my-2" style={setcolor}>
              <b>General Comments</b>
            </h5>
            <textarea
              rows={5}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="form-control"
            ></textarea>
          </form>
        </div>
        <div className="d-flex justify-content-end">
          <Button
            style={buttonStyles}
            onClick={handleSubmit}
            variant="contained"
            type="submit"
            sx={{ marginTop: "2em" }}
          >
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Feedback;
