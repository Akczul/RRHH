const express = require("express");
const {
  getAttendance,
  createAttendance,
  getAttendanceSummary,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/summary", getAttendanceSummary);
router.get("/", getAttendance);
router.post("/", createAttendance);

module.exports = router;
