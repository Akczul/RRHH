const express = require("express");
const {
  getEmployees,
  createEmployee,
  updateEmployeeStatus,
} = require("../controllers/employeesController");

const router = express.Router();

router.get("/", getEmployees);
router.post("/", createEmployee);
router.patch("/:id/status", updateEmployeeStatus);

module.exports = router;
