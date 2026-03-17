const express = require("express");
const {
  getDepartments,
  createDepartment,
} = require("../controllers/departmentsController");

const router = express.Router();

router.get("/", getDepartments);
router.post("/", createDepartment);

module.exports = router;
