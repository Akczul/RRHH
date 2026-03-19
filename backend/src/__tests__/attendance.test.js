import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from '../routes/authRoutes.js';
import attendanceRoutes from '../routes/attendanceRoutes.js';

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
app.use('/api/attendance', attendanceRoutes);

let employeeToken = '';
let adminToken = '';
let employeeRecord = null;

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

  await User.create({
    name: 'Admin RRHH',
    email: 'admin.att@test.com',
    password: 'Password123',
    role: 'admin'
  });

  const employeeUser = await User.create({
    name: 'Empleado RRHH',
    email: 'employee.att@test.com',
    password: 'Password123',
    role: 'employee'
  });

  const department = await Department.create({
    name: 'Ingenieria',
    description: 'Equipo tecnico'
  });

  const position = await Position.create({
    title: 'Desarrollador Backend',
    department: department._id
  });

  employeeRecord = await Employee.create({
    userId: employeeUser._id,
    position: position._id,
    department: department._id,
    hireDate: new Date('2026-03-01'),
    status: 'active'
  });

  const employeeLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'employee.att@test.com',
      password: 'Password123'
    })
    .expect(200);

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin.att@test.com',
      password: 'Password123'
    })
    .expect(200);

  employeeToken = employeeLogin.headers['set-cookie'];
  adminToken = adminLogin.headers['set-cookie'];
});

describe('Asistencia - POST /api/attendance/checkin', () => {
  test('Empleado autenticado registra entrada correctamente (201)', async () => {
    const response = await request(app)
      .post('/api/attendance/checkin')
      .set('Cookie', employeeToken)
      .send({
        date: '2026-03-19',
        status: 'present'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.attendance).toBeDefined();
    expect(response.body.attendance.employeeId.userId.email).toBe('employee.att@test.com');
    expect(response.body.attendance.employeeId.position.title).toBe('Desarrollador Backend');
  });

  test('No permite doble checkin para la misma fecha (400)', async () => {
    await request(app)
      .post('/api/attendance/checkin')
      .set('Cookie', employeeToken)
      .send({ date: '2026-03-19', status: 'present' })
      .expect(201);

    const response = await request(app)
      .post('/api/attendance/checkin')
      .set('Cookie', employeeToken)
      .send({ date: '2026-03-19', status: 'late' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('entrada ya fue registrada');
  });
});

describe('Asistencia - PUT /api/attendance/checkout', () => {
  test('Empleado puede registrar salida después del checkin (200)', async () => {
    await request(app)
      .post('/api/attendance/checkin')
      .set('Cookie', employeeToken)
      .send({ date: '2026-03-20', status: 'present' })
      .expect(201);

    const response = await request(app)
      .put('/api/attendance/checkout')
      .set('Cookie', employeeToken)
      .send({ date: '2026-03-20' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.attendance.checkOut).toBeDefined();
  });

  test('No permite checkout sin checkin previo (404)', async () => {
    const response = await request(app)
      .put('/api/attendance/checkout')
      .set('Cookie', employeeToken)
      .send({ date: '2026-03-21' })
      .expect(404);

    expect(response.body.success).toBe(false);
  });
});

describe('Asistencia - Endpoints admin', () => {
  test('Admin puede ver historial por empleado (200)', async () => {
    await Attendance.create({
      employeeId: employeeRecord._id,
      date: new Date('2026-03-18'),
      checkIn: new Date('2026-03-18T08:00:00Z'),
      checkOut: new Date('2026-03-18T17:00:00Z'),
      status: 'present'
    });

    const response = await request(app)
      .get(`/api/attendance/${employeeRecord._id}`)
      .set('Cookie', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.total).toBeGreaterThan(0);
  });

  test('Empleado no puede ver historial de otro empleado (403)', async () => {
    const response = await request(app)
      .get(`/api/attendance/${employeeRecord._id}`)
      .set('Cookie', employeeToken)
      .expect(403);

    expect(response.body.success).toBe(false);
  });

  test('Admin puede consultar asistencia por fecha (200)', async () => {
    await Attendance.create({
      employeeId: employeeRecord._id,
      date: new Date('2026-03-22'),
      checkIn: new Date('2026-03-22T08:10:00Z'),
      status: 'late'
    });

    const response = await request(app)
      .get('/api/attendance/date/2026-03-22')
      .set('Cookie', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.total).toBe(1);
    expect(response.body.attendance[0].status).toBe('late');
  });
});
