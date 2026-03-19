import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from '../routes/authRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

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
app.use('/api/products', productRoutes);

let employeeToken = '';
let adminToken = '';
let testCategory = null;

// Conectar a BD de prueba
beforeAll(async () => {
  try {
    const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/rrhh_test';
    await mongoose.connect(testDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Crear usuarios
    const employeeUser = await User.create({
      name: 'Empleado Test',
      email: 'employee_prod@test.com',
      password: 'Password123',
      role: 'employee'
    });

    const adminUser = await User.create({
      name: 'Admin Test',
      email: 'admin_prod@test.com',
      password: 'Password123',
      role: 'admin'
    });

    // Crear categoría de prueba
    testCategory = await Category.create({
      name: 'Electrónica',
      description: 'Productos electrónicos'
    });

    // Obtener tokens
    const empResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'employee_prod@test.com',
        password: 'Password123'
      });

    employeeToken = empResponse.headers['set-cookie'];

    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin_prod@test.com',
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
    await Product.deleteMany({});
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error en afterAll:', error);
  }
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Productos - GET /api/products', () => {
  test('Autenticado devuelve 200 con productos y categoría populada', async () => {
    // Crear un producto
    const product = await Product.create({
      name: 'Laptop',
      description: 'Laptop de prueba',
      price: 1000,
      categoryId: testCategory._id
    });

    const response = await request(app)
      .get('/api/products')
      .set('Cookie', employeeToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.products.length).toBeGreaterThan(0);
    
    // Verificar que la categoría está populada
    const prod = response.body.products[0];
    expect(prod.categoryId).toBeDefined();
    expect(prod.categoryId.name).toBe('Electrónica');
  });
});

describe('Productos - POST /api/products', () => {
  test('Como admin con categoryId válido devuelve 201', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Cookie', adminToken)
      .send({
        name: 'Nuevo Producto',
        description: 'Descripción del producto',
        price: 500,
        categoryId: testCategory._id.toString()
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.product).toBeDefined();
    expect(response.body.product.name).toBe('Nuevo Producto');
    expect(response.body.product.categoryId.name).toBe('Electrónica');
  });

  test('Con categoryId inexistente devuelve 400', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post('/api/products')
      .set('Cookie', adminToken)
      .send({
        name: 'Producto con ID falso',
        description: 'Test',
        price: 200,
        categoryId: fakeId.toString()
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Categoria');
  });
});

describe('Productos - PUT /api/products/:id', () => {
  test('Como employee devuelve 403', async () => {
    const product = await Product.create({
      name: 'Producto Test',
      description: 'Test',
      price: 300,
      categoryId: testCategory._id
    });

    const response = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Cookie', employeeToken)
      .send({
        name: 'Producto Modificado'
      })
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('permiso');
  });
});
