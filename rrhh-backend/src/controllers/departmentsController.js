const Department = require("../models/Department");
const { validateNonEmptyTitle } = require("../utils/validators");

async function getDepartments(req, res) {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (error) {
    console.error("[getDepartments]", error);
    res.status(500).json({ message: "Error obteniendo departamentos" });
  }
}

async function createDepartment(req, res) {
  try {
    const { nombre, jefe, color } = req.body;

    const validation = validateNonEmptyTitle(nombre);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const newDepartment = await Department.create({ nombre, jefe, color });
    return res.status(201).json(newDepartment);
  } catch (error) {
    console.error("[createDepartment]", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "El departamento ya existe" });
    }
    return res.status(500).json({ message: "Error creando departamento" });
  }
}

module.exports = {
  getDepartments,
  createDepartment,
};
