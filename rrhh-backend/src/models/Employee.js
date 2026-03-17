const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    frontendId: { type: Number, unique: true, sparse: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    telefono: { type: String, trim: true, default: "" },
    cargo: { type: String, trim: true, default: "" },
    salario: { type: Number, default: 0 },
    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },
    fechaIngreso: { type: Date, default: Date.now },
    departamento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
