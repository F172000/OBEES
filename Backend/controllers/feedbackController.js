const { db } = require("../database");

exports.getQuestions = async (req, res) => {
  try {
    const query = "SELECT * FROM feedback";
    db.query(query, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch the questions" });
      } else {
        // const questions = result.map((row) => row.question);
        res.json(result);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch the questions" });
  }
};

exports.saveFeedback = async (req, res) => {
  const answers = req.body;
  const courseId = req.body[0].course_id; // Assuming all answers have the same courseId
  console.log(answers);
  const deleteQuery = "DELETE FROM coursefeedback WHERE courseId = ?";
  const insertQuery =
    "INSERT INTO coursefeedback (courseId, questionId, answer) VALUES (?, ?, ?)";

  try {
    try {
      db.query(deleteQuery, [courseId]);
    } catch (error) {}
    answers.forEach((answer) => {
      try {
        db.query(insertQuery, [
          answer.course_id,
          answer.feedback_id,
          answer.answer,
        ]);
      } catch (error) {
        console.error("Error inserting feedback:", error);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Feedback inserted/updated successfully",
    });
  } catch (error) {
    console.error("Error deleting existing feedback:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save feedback" });
  }
};
