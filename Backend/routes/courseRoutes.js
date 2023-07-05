const express = require("express");

////Import controller
const courseController = require("../controllers/courseController");

const router = express.Router();

router.post("/all", courseController.getCources);
router.post("/unassigned", courseController.getunAssignedCources);
router.post("/assign", courseController.assignCourse);
router.post("/teacher", courseController.getCoursesByTeacher);
router.post("/getCourseById", courseController.getCourseById);

router.post('/AddCoursePlan',courseController.addCoursePlan);
router.post('/DeleteCoursePlan',courseController.deleteCoursePlan);
router.post('/UpdateCoursePlan',courseController.updateCoursePlan)
router.post('/viewCoursePlan',courseController.viewCoursePlan)
module.exports = router;
