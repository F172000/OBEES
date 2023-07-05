const express = require("express");

////Import controller
const assessmentController = require("../controllers/assessmentController");

const router = express.Router();

router.post("/AddAssessment", assessmentController.AddAssessment);
router.post("/UpdateAssessment", assessmentController.UpdateAssessment);
router.post("/DeleteAssessment", assessmentController.DeleteAssessment);
router.post("/ShowAssessment", assessmentController.ShowAssessment);
// router.post("/scores", assessmentController.getScoreBasedonCourse);

module.exports = router;
