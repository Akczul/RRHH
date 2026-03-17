const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    frontendId: { type: Number, unique: true, sparse: true },
    nombre: { type: String, required: true, trim: true, unique: true },
    jefe: { type: String, trim: true, default: "" },
    color: { type: String, trim: true, default: "#4f8ef7" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
