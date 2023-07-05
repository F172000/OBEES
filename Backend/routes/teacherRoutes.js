const express = require("express");

////Import controller
const teacherController = require("../controllers/teacherController");

const router = express.Router();

router.post("/all", teacherController.getTeachers);
router.post("/update", teacherController.updateProfile);
router.post("/update_password", teacherController.updatePassword);

module.exports = router;
