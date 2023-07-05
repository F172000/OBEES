const express = require("express");

////Import controller
const cloController = require("../controllers/cloController");

const router = express.Router();

router.post("/calculateClo", cloController.calculateClo);
router.post("/calculateFinalClo", cloController.calculateFinalClo);
router.post("/getClo", cloController.getCloByCourse);

module.exports = router;
