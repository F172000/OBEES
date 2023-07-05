const express = require("express");

////Import controller
const attendanceController = require("../controllers/attendanceController");

const router = express.Router();

router.post("/save_attendance", attendanceController.saveAttendance);
router.post("/view_attendance", attendanceController.viewAttendance);
router.post("/update_attendance", attendanceController.updateAttendance);
router.post("/get_extra_attendance", attendanceController.getExtraAttendance);
router.post("/add_extra_attendance", attendanceController.addExtraAttendance);


module.exports = router;
