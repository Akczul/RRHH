const Attendance = require("../models/Attendance");

async function getAttendance(req, res) {
  try {
    const { empleado, month, year, from, to } = req.query;

    const filters = {};

    if (empleado) {
      filters.empleado = empleado;
    }

    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      filters.fecha = { $gte: start, $lt: end };
    } else if (from || to) {
      filters.fecha = {};
      if (from) filters.fecha.$gte = new Date(from);
      if (to) filters.fecha.$lte = new Date(to);
    }

    const attendance = await Attendance.find(filters)
      .populate("empleado", "nombre apellido email")
      .sort({ fecha: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo asistencia" });
  }
}

async function createAttendance(req, res) {
  try {
    const { empleado, fecha, entrada, salida, estado } = req.body;

    if (!empleado || !fecha) {
      return res
        .status(400)
        .json({ message: "empleado y fecha son obligatorios" });
    }

    const newAttendance = await Attendance.create({
      empleado,
      fecha,
      entrada,
      salida,
      estado,
    });

    const result = await Attendance.findById(newAttendance._id).populate(
      "empleado",
      "nombre apellido email"
    );

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error creando asistencia" });
  }
}

async function getAttendanceSummary(req, res) {
  try {
    const { empleado, month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "month y year son obligatorios" });
    }

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);

    const match = {
      fecha: { $gte: start, $lt: end },
    };

    if (empleado) {
      match.empleado = empleado;
    }

    const result = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$estado",
          total: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      presente: 0,
      tardio: 0,
      ausente: 0,
      total: 0,
    };

    result.forEach((item) => {
      if (summary[item._id] !== undefined) {
        summary[item._id] = item.total;
        summary.total += item.total;
      }
    });

    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo resumen" });
  }
}

module.exports = {
  getAttendance,
  createAttendance,
  getAttendanceSummary,
};
