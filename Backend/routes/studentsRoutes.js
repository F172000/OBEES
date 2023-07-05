const express = require('express');

////Import controller
const studentsController =require('../controllers/studentsController')

const router = express.Router();



router.post('/enroll_student',studentsController.enrollStudent);
router.post('/getstudents_bycourse',studentsController.getStudentsByCourse);



module.exports = router;