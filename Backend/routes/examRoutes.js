const express = require("express");

////Import controller
const examController = require("../controllers/examController");

const router = express.Router();

router.post("/AddExam", examController.addExam);
router.post("/ShowExam", examController.showExam);
router.post("/ShowAllExam", examController.showAllExam);
router.post("/ShowExamQuestion", examController.showExamQuestion);
router.post("/ShowQuestionPart", examController.showQuestionPart);
// router.post('/getGradesbycourse',examController.getGraddingByCourse);
router.post("/countExam", examController.countExam);
router.post("/getMarkSheetData", examController.getMarkSheetData);
router.post("/getFinalMarkSheetData", examController.getFinalMarkSheetData);
router.post("/updateGrades", examController.updateGrades);

module.exports = router;
