require("dotenv").config();

const connectDB = require("../config/db");
const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

const departmentsSeed = [
  { id: 1, nombre: "Tecnologia", jefe: "Carlos Mendoza", color: "#4f8ef7" },
  { id: 2, nombre: "Recursos Humanos", jefe: "Lucia Fernandez", color: "#38d9a9" },
  { id: 3, nombre: "Finanzas", jefe: "Roberto Salinas", color: "#f7a94f" },
  { id: 4, nombre: "Marketing", jefe: "Valentina Ruiz", color: "#a78bfa" },
];

const employeesSeed = [
  {
    id: 1,
    nombre: "Carlos",
    apellido: "Mendoza",
    email: "cmendoza@corphr.com",
    telefono: "+1 (555) 101-2030",
    departamento: "Tecnologia",
    cargo: "Jefe de Tecnologia",
    salario: 5800,
    fechaIngreso: "2020-03-15",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Lucia",
    apellido: "Fernandez",
    email: "lfernandez@corphr.com",
    telefono: "+1 (555) 202-3040",
    departamento: "Recursos Humanos",
    cargo: "Jefa de RRHH",
    salario: 4900,
    fechaIngreso: "2019-07-01",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Roberto",
    apellido: "Salinas",
    email: "rsalinas@corphr.com",
    telefono: "+1 (555) 303-4050",
    departamento: "Finanzas",
    cargo: "Director Financiero",
    salario: 6200,
    fechaIngreso: "2018-11-20",
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Valentina",
    apellido: "Ruiz",
    email: "vruiz@corphr.com",
    telefono: "+1 (555) 404-5060",
    departamento: "Marketing",
    cargo: "Directora de Marketing",
    salario: 5100,
    fechaIngreso: "2021-01-10",
    estado: "activo",
  },
  {
    id: 5,
    nombre: "Diego",
    apellido: "Torres",
    email: "dtorres@corphr.com",
    telefono: "+1 (555) 505-6070",
    departamento: "Tecnologia",
    cargo: "Desarrollador Senior",
    salario: 4400,
    fechaIngreso: "2022-06-01",
    estado: "activo",
  },
  {
    id: 6,
    nombre: "Andrea",
    apellido: "Morales",
    email: "amorales@corphr.com",
    telefono: "+1 (555) 606-7080",
    departamento: "Recursos Humanos",
    cargo: "Analista de Nominas",
    salario: 3200,
    fechaIngreso: "2023-02-14",
    estado: "activo",
  },
  {
    id: 7,
    nombre: "Miguel",
    apellido: "Castro",
    email: "mcastro@corphr.com",
    telefono: "+1 (555) 707-8090",
    departamento: "Tecnologia",
    cargo: "Disenador UX",
    salario: 3800,
    fechaIngreso: "2022-09-20",
    estado: "activo",
  },
  {
    id: 8,
    nombre: "Patricia",
    apellido: "Vega",
    email: "pvega@corphr.com",
    telefono: "+1 (555) 808-9010",
    departamento: "Finanzas",
    cargo: "Contadora General",
    salario: 4100,
    fechaIngreso: "2021-08-05",
    estado: "inactivo",
  },
];

function generateWorkingDates() {
  const dates = [];
  const today = new Date(2026, 2, 10);

  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const weekday = date.getDay();
    if (weekday !== 0 && weekday !== 6) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates;
}

function randomEntry(late = false) {
  if (late) {
    const minutes = Math.floor(Math.random() * 45) + 10;
    return `09:${String(minutes).padStart(2, "0")}`;
  }
  const minutes = Math.floor(Math.random() * 8);
  return `08:${String(minutes).padStart(2, "0")}`;
}

function randomExit() {
  const minutes = Math.floor(Math.random() * 30);
  return `17:${String(minutes).padStart(2, "0")}`;
}

async function runSeed() {
  await connectDB();

  await Attendance.deleteMany({});
  await Employee.deleteMany({});
  await Department.deleteMany({});

  const departments = await Department.insertMany(
    departmentsSeed.map((d) => ({
      frontendId: d.id,
      nombre: d.nombre,
      jefe: d.jefe,
      color: d.color,
    }))
  );

  const departmentByName = new Map(departments.map((d) => [d.nombre, d._id]));

  const employees = await Employee.insertMany(
    employeesSeed.map((e) => ({
      frontendId: e.id,
      nombre: e.nombre,
      apellido: e.apellido,
      email: e.email,
      telefono: e.telefono,
      cargo: e.cargo,
      salario: e.salario,
      estado: e.estado,
      fechaIngreso: new Date(e.fechaIngreso),
      departamento: departmentByName.get(e.departamento),
    }))
  );

  const employeeByFrontendId = new Map(employees.map((e) => [e.frontendId, e._id]));
  const workDates = generateWorkingDates();
  const attendanceDocs = [];

  employeesSeed.forEach((employee) => {
    if (employee.estado !== "activo") return;

    workDates.forEach((date) => {
      const random = Math.random();
      let estado;
      let entrada = "";
      let salida = "";

      if (random < 0.1) {
        estado = "ausente";
      } else if (random < 0.2) {
        estado = "tardio";
        entrada = randomEntry(true);
        salida = randomExit();
      } else {
        estado = "presente";
        entrada = randomEntry(false);
        salida = randomExit();
      }

      attendanceDocs.push({
        empleado: employeeByFrontendId.get(employee.id),
        fecha: new Date(date),
        entrada,
        salida,
        estado,
      });
    });
  });

  await Attendance.insertMany(attendanceDocs);

  console.log("Seed completado");
  console.log(`Departamentos: ${departments.length}`);
  console.log(`Empleados: ${employees.length}`);
  console.log(`Asistencias: ${attendanceDocs.length}`);

  process.exit(0);
}

runSeed().catch((error) => {
  console.error("Error ejecutando seed", error.message);
  process.exit(1);
});
