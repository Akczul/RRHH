const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    fecha: { type: Date, required: true },
    entrada: { type: String, default: "" },
    salida: { type: String, default: "" },
    estado: {
      type: String,
      enum: ["presente", "tardio", "ausente"],
      default: "presente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
