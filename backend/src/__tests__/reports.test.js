import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from '../routes/authRoutes.js';
import reportRoutes from '../routes/reportRoutes.js';

import User from '../models/User.js';
import Department from '../models/Department.js';
import Position from '../models/Position.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

let adminToken = '';
let employeeToken = '';
let employeeRecord = null;
let department = null;

const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/rrhh_test';

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

  const admin = await User.create({
    name: 'Admin Reportes',
    email: 'admin.rep@test.com',
    password: 'Password123',
    role: 'admin'
  });

  const employeeUser = await User.create({
    name: 'Empleado Reportes',
    email: 'employee.rep@test.com',
    password: 'Password123',
    role: 'employee'
  });

  department = await Department.create({
    name: 'Operaciones',
    description: 'Area de operaciones'
  });

  const position = await Position.create({
    title: 'Analista de Operaciones',
    department: department._id
  });

  employeeRecord = await Employee.create({
    userId: employeeUser._id,
    position: position._id,
    department: department._id,
    hireDate: new Date('2026-01-10'),
    status: 'active'
  });

  await Attendance.create({
    employeeId: employeeRecord._id,
    date: new Date('2026-03-10'),
    checkIn: new Date('2026-03-10T08:00:00Z'),
    checkOut: new Date('2026-03-10T17:00:00Z'),
    status: 'present'
  });

  await Attendance.create({
    employeeId: employeeRecord._id,
    date: new Date('2026-03-11'),
    checkIn: new Date('2026-03-11T08:20:00Z'),
    status: 'late'
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: admin.email, password: 'Password123' })
    .expect(200);

  const employeeLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: employeeUser.email, password: 'Password123' })
    .expect(200);

  adminToken = adminLogin.headers['set-cookie'];
  employeeToken = employeeLogin.headers['set-cookie'];
});

describe('Reportes - seguridad y coherencia', () => {
  test('Empleado no admin recibe 403 al consultar reportes', async () => {
    const response = await request(app)
      .get('/api/reports/headcount')
      .set('Cookie', employeeToken)
      .expect(403);

    expect(response.body.success).toBe(false);
  });

  test('Headcount refleja empleados activos por departamento', async () => {
    const response = await request(app)
      .get('/api/reports/headcount')
      .set('Cookie', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.totalEmployees).toBe(1);
    expect(response.body.departments[0].departmentName).toBe(department.name);
  });

  test('Reporte mensual devuelve datos con campos del nuevo dominio', async () => {
    const response = await request(app)
      .get('/api/reports/attendance/monthly?month=3&year=2026')
      .set('Cookie', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(1);

    const row = response.body.data[0];
    expect(row.position).toBe('Analista de Operaciones');
    expect(row.department).toBe('Operaciones');
    expect(row.present).toBe(1);
    expect(row.late).toBe(1);
  });

  test('Resumen individual usa status y conteo del mes actual', async () => {
    const response = await request(app)
      .get(`/api/reports/employee/${employeeRecord._id}/summary`)
      .set('Cookie', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.employee.status).toBe('active');
    expect(response.body.employee.position).toBe('Analista de Operaciones');
    expect(response.body.employee.department).toBe('Operaciones');
  });
});
