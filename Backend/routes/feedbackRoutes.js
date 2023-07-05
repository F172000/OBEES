const express = require("express");

////Import controller
const feedbackController = require("../controllers/feedbackController");

const router = express.Router();

router.post("/feedback-questions", feedbackController.getQuestions);
router.post("/save-feedback", feedbackController.saveFeedback);
module.exports = router;