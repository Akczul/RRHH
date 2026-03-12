const express = require("express");
const cors = require("cors");

const departmentsRoutes = require("./routes/departmentsRoutes");
const employeesRoutes = require("./routes/employeesRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend RRHH activo" });
});

app.use("/api/departments", departmentsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/attendance", attendanceRoutes);

module.exports = app;
