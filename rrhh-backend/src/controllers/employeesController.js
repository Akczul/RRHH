const Employee = require("../models/Employee");
const { validateRequiredStrings } = require("../utils/validators");

async function getEmployees(req, res) {
  try {
    const employees = await Employee.find()
      .populate("departamento", "nombre color")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo empleados" });
  }
}

async function createEmployee(req, res) {
  try {
    const payload = req.body;

    const validation = validateRequiredStrings([
      { value: payload.nombre,       name: "nombre" },
      { value: payload.apellido,     name: "apellido" },
      { value: payload.email,        name: "email" },
      { value: payload.departamento, name: "departamento" },
    ]);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const newEmployee = await Employee.create(payload);
    const result = await Employee.findById(newEmployee._id).populate(
      "departamento",
      "nombre color"
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("[createEmployee]", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "El email ya esta registrado" });
    }
    return res.status(500).json({ message: "Error creando empleado" });
  }
}

async function updateEmployeeStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!["activo", "inactivo"].includes(estado)) {
      return res.status(400).json({ message: "estado invalido" });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    ).populate("departamento", "nombre color");

    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: "Error actualizando estado" });
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployeeStatus,
};
