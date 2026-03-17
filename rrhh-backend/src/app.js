const express = require("express");
const cors = require("cors");

const departmentsRoutes = require("./routes/departmentsRoutes");
const employeesRoutes = require("./routes/employeesRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend RRHH activo" });
});

app.use("/api/departments", departmentsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
