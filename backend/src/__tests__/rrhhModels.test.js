import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Department from '../models/Department.js';
import Position from '../models/Position.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';

dotenv.config();

const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/rrhh_test';

describe('Modelos RRHH', () => {
  beforeAll(async () => {
    await mongoose.connect(testDbUri);
  });

  afterAll(async () => {
    await Attendance.deleteMany({});
    await Employee.deleteMany({});
    await Position.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Attendance.deleteMany({});
    await Employee.deleteMany({});
    await Position.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});
  });

  test('Employee usa status=active por defecto y referencias válidas', async () => {
    const user = await User.create({
      name: 'Empleado Modelo',
      email: 'model.employee@test.com',
      password: 'Password123',
      role: 'employee'
    });

    const dept = await Department.create({ name: 'Finanzas' });
    const position = await Position.create({ title: 'Analista', department: dept._id });

    const employee = await Employee.create({
      userId: user._id,
      position: position._id,
      department: dept._id,
      hireDate: new Date('2026-02-15')
    });

    expect(employee.status).toBe('active');

    const populated = await Employee.findById(employee._id)
      .populate('position', 'title')
      .populate('department', 'name');

    expect(populated.position.title).toBe('Analista');
    expect(populated.department.name).toBe('Finanzas');
  });

  test('Employee no permite userId duplicado (unique)', async () => {
    const user = await User.create({
      name: 'Unico User',
      email: 'unique.user@test.com',
      password: 'Password123',
      role: 'employee'
    });

    const dept = await Department.create({ name: 'Calidad' });
    const position = await Position.create({ title: 'Tester', department: dept._id });

    await Employee.create({
      userId: user._id,
      position: position._id,
      department: dept._id,
      hireDate: new Date('2026-01-01')
    });

    await expect(
      Employee.create({
        userId: user._id,
        position: position._id,
        department: dept._id,
        hireDate: new Date('2026-01-02')
      })
    ).rejects.toThrow();
  });

  test('Attendance no permite duplicados por employeeId+date', async () => {
    const user = await User.create({
      name: 'Att User',
      email: 'att.unique@test.com',
      password: 'Password123',
      role: 'employee'
    });

    const dept = await Department.create({ name: 'Soporte' });
    const position = await Position.create({ title: 'Soporte N1', department: dept._id });

    const employee = await Employee.create({
      userId: user._id,
      position: position._id,
      department: dept._id,
      hireDate: new Date('2026-02-01')
    });

    await Attendance.create({
      employeeId: employee._id,
      date: new Date('2026-03-19T00:00:00.000Z'),
      status: 'present'
    });

    await expect(
      Attendance.create({
        employeeId: employee._id,
        date: new Date('2026-03-19T00:00:00.000Z'),
        status: 'late'
      })
    ).rejects.toThrow();
  });
});
