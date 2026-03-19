import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from '../routes/authRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

dotenv.config();

// Crear app de prueba
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

let employeeToken = '';
let adminToken = '';
let employeeUser = null;
let adminUser = null;

// Conectar a BD de prueba
beforeAll(async () => {
  try {
    const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/rrhh_test';
    await mongoose.connect(testDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Crear usuario employee
    employeeUser = await User.create({
      name: 'Empleado Test',
      email: 'employee@test.com',
      password: 'Password123',
      role: 'employee'
    });

    // Crear usuario admin
    adminUser = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'Password123',
      role: 'admin'
    });

    // Obtener tokens
    const empResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'employee@test.com',
        password: 'Password123'
      });

    employeeToken = empResponse.headers['set-cookie'];

    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Password123'
      });

    adminToken = adminResponse.headers['set-cookie'];
  } catch (error) {
    console.error('Error en beforeAll:', error);
  }
});

afterAll(async () => {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error en afterAll:', error);
  }
});

afterEach(async () => {
  await Category.deleteMany({});
});

describe('Categorías - GET /api/categories', () => {
  test('Sin autenticación devuelve 401', async () => {
    const response = await request(app)
      .get('/api/categories')
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  test('Autenticado devuelve 200 con array', async () => {
    // Crear una categoría
    await Category.create({
      name: 'Electrónica',
      description: 'Productos electrónicos'
    });

    const response = await request(app)
      .get('/api/categories')
      .set('Cookie', employeeToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.categories)).toBe(true);
    expect(response.body.categories.length).toBeGreaterThan(0);
  });
});

describe('Categorías - POST /api/categories', () => {
  test('Como employee devuelve 403', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Cookie', employeeToken)
      .send({
        name: 'Nueva Categoría',
        description: 'Test'
      })
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('permiso');
  });

  test('Como admin devuelve 201', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Cookie', adminToken)
      .send({
        name: 'Nueva Categoría',
        description: 'Test'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.category).toBeDefined();
    expect(response.body.category.name).toBe('Nueva Categoría');
  });
});

describe('Categorías - DELETE /api/categories/:id', () => {
  test('Como admin devuelve 200', async () => {
    // Crear una categoría
    const category = await Category.create({
      name: 'Categoría para eliminar',
      description: 'Test'
    });

    const response = await request(app)
      .delete(`/api/categories/${category._id}`)
      .set('Cookie', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);

    // Verificar que fue eliminada
    const deleted = await Category.findById(category._id);
    expect(deleted).toBeNull();
  });
});

describe('Categorías - PUT /api/categories/:id', () => {
  test('Como admin actualiza categoría y devuelve 200', async () => {
    const category = await Category.create({
      name: 'Categoria Original',
      description: 'Descripcion original'
    });

    const response = await request(app)
      .put(`/api/categories/${category._id}`)
      .set('Cookie', adminToken)
      .send({
        name: 'Categoria Actualizada',
        description: 'Descripcion actualizada'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.category.name).toBe('Categoria Actualizada');
    expect(response.body.category.description).toBe('Descripcion actualizada');
  });
});
