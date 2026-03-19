# Backend - API de RRHH

> Este es el backend unico y oficial del proyecto RRHH.
> Ejecuta siempre el servidor desde esta carpeta para evitar inconsistencias.

## ¿Qué se hizo en esta fase?

Este backend es la **base del proyecto RRHH**. Aquí hemos implementado:

-  **Autenticación segura**: Los usuarios pueden registrarse y hacer login
-  **Contraseñas encriptadas**: Usamos bcryptjs, que es casi imposible de hackear
-  **Tokens JWT en cookies**: Las sesiones son seguras y duran 7 días
-  **Rutas protegidas**: Solo usuarios autenticados pueden acceder ciertas URL
-  **Base de datos MongoDB**: Almacenamos usuarios de forma persistente
-  **CORS configurado**: El frontend puede comunicarse con el backend

### Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           ← Configuraciones (conexión a BD)
│   │   └── database.js
│   ├── models/           ← Esquemas de datos (qué información guardamos)
│   │   └── User.js
│   ├── controllers/      ← Lógica de negocios (qué hacer con los datos)
│   │   └── authController.js
│   ├── routes/           ← URLs de la API (dónde hace peticiones el frontend)
│   │   └── authRoutes.js
│   └── middlewares/      ← Funciones que protegen rutas (verifican autenticación)
│       └── authMiddleware.js
├── server.js             ← Archivo principal que inicia el servidor
├── package.json          ← Lista de dependencias
├── .env.example          ← Ejemplo de variables de entorno
└── .gitignore            ← Archivos que no se suben a git
```

##  Cómo ejecutar el backend

### Paso 1: Instalar MongoDB
Descarga MongoDB Community desde: https://www.mongodb.com/try/download/community

### Paso 2: Clonar o descargar el proyecto
Ya está en tu carpeta

### Paso 3: Configurar variables de entorno

1. Clona el archivo `.env.example` y renómbralo a `.env`
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` si es necesario:
   ```
   MONGO_URI=mongodb://localhost:27017/rrhh_db
   JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

### Paso 4: Instalar dependencias

```bash
cd backend
npm install
```

### Paso 5: Iniciar el servidor

**Modo producción:**
```bash
npm start
```

**Modo desarrollo (con nodemon - se reinicia automáticamente):**
```bash
npm run dev
```

Deberías ver algo como:
```
 Servidor iniciado en puerto 5000
 URL: http://localhost:5000
```

##  Endpoints de la API

Todas las peticiones van a `http://localhost:5000/api/auth`

### 1. **Registrar un nuevo usuario**
```
POST /api/auth/register

Body (JSON):
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "password": "Password123"
}

Respuesta exitosa (201):
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "user": {
    "id": "...",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "employee"
  }
}
```

### 2. **Iniciar sesión**
```
POST /api/auth/login

Body (JSON):
{
  "email": "juan@email.com",
  "password": "Password123"
}

Respuesta exitosa (200):
{
  "success": true,
  "message": "Sesión iniciada correctamente",
  "user": {
    "id": "...",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "employee"
  }
}
```

### 3. **Obtener perfil (PROTEGIDA - requiere estar logeado)**
```
GET /api/auth/profile

Respuesta exitosa (200):
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "employee",
    "createdAt": "2024-03-17T..."
  }
}
```

### 4. **Cerrar sesión**
```
POST /api/auth/logout

Respuesta exitosa (200):
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

## Nuevos Modelos

### Category

- `name` (String, requerido): nombre de la categoria.
- `description` (String, opcional): descripcion de la categoria.
- `createdAt` (Date): fecha de creacion automatica.

### Product

- `name` (String, requerido): nombre del producto.
- `description` (String, opcional): descripcion del producto.
- `price` (Number, requerido): precio del producto (minimo `0`).
- `categoryId` (ObjectId, requerido): referencia a `Category`.
- `createdAt` (Date): fecha de creacion automatica.

### Department

- `name` (String, requerido, único): nombre del departamento (ej: "Recursos Humanos", "IT").
- `description` (String, opcional): descripción del departamento.
- `createdAt` (Date): fecha de creación automática.

### Employee

- `userId` (ObjectId, requerido): referencia al usuario (User).
- `position` (String, requerido): cargo del empleado (ej: "Developer", "Manager").
- `departmentId` (ObjectId, requerido): referencia al departamento (Department).
- `salary` (Number, requerido): salario del empleado (mínimo 0).
- `hireDate` (Date): fecha de contratación.
- `isActive` (Boolean): indica si el empleado sigue activo (default: true).
- `createdAt` (Date): fecha de creación automática.

### Attendance

- `employeeId` (ObjectId, requerido): referencia al empleado (Employee).
- `date` (Date): fecha de registro de asistencia.
- `status` (String, enum): estado de asistencia: `'present'`, `'absent'`, `'late'`, `'leave'`.
- `notes` (String, opcional): notas adicionales.
- `createdAt` (Date): fecha de creación automática.
- **Índice único**: `(employeeId, date)` para evitar duplicados.

### Relación entre modelos

- `User (1) -> (1) Employee`: Un usuario tiene un perfil de empleado.
- `Department (1) -> (N) Employee`: Un departamento puede tener muchos empleados.
- `Employee (1) -> (N) Attendance`: Un empleado puede tener muchos registros de asistencia.
- `Category (1) -> (N) Product`: Una categoría puede tener muchos productos.
- `Product (N) -> (1) Category`: Un producto pertenece a una categoría.

## Nuevos Endpoints

### Categories (`/api/categories`)
**Requiere autenticación (token en cookie)**

- `GET /api/categories`: listar categorías.
- `GET /api/categories/:id`: obtener categoría por ID.
- `POST /api/categories`: crear categoría (solo **admin**).
- `PUT /api/categories/:id`: actualizar categoría (solo **admin**).
- `DELETE /api/categories/:id`: eliminar categoría (solo **admin**).

### Products (`/api/products`)
**Requiere autenticación (token en cookie)**

- `GET /api/products`: listar productos (con categoría populada).
- `GET /api/products/:id`: obtener producto por ID.
- `POST /api/products`: crear producto (solo **admin**).
- `PUT /api/products/:id`: actualizar producto (solo **admin**).
- `DELETE /api/products/:id`: eliminar producto (solo **admin**).

### Reports (`/api/reports`)
**Requiere autenticación + rol admin**

- `GET /api/reports/attendance/monthly?month=3&year=2024`: Obtener reporte de asistencia mensual de todos los empleados con totales por estado.
- `GET /api/reports/headcount`: Obtener cantidad total de empleados activos agrupados por departamento.
- `GET /api/reports/employee/:employeeId/summary`: Obtener resumen individual del empleado (posición, departamento, días trabajados en el mes actual).

## Ejemplos de peticiones y respuestas

### 1) Crear categoria

Request:

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Laptops",
  "description": "Equipos portatiles"
}
```

Response `201`:

```json
{
  "success": true,
  "message": "Categoria creada correctamente",
  "category": {
    "_id": "67d7503d0f9a0d0f40e8f111",
    "name": "Laptops",
    "description": "Equipos portatiles",
    "createdAt": "2026-03-17T18:00:00.000Z",
    "__v": 0
  }
}
```

### 2) Crear producto

Request:

```http
POST /api/products
Content-Type: application/json

{
  "name": "ThinkPad X1",
  "description": "Laptop para trabajo",
  "price": 1850,
  "categoryId": "67d7503d0f9a0d0f40e8f111"
}
```

Response `201`:

```json
{
  "success": true,
  "message": "Producto creado correctamente",
  "product": {
    "_id": "67d7508d0f9a0d0f40e8f222",
    "name": "ThinkPad X1",
    "description": "Laptop para trabajo",
    "price": 1850,
    "categoryId": {
      "_id": "67d7503d0f9a0d0f40e8f111",
      "name": "Laptops",
      "description": "Equipos portatiles"
    },
    "createdAt": "2026-03-17T18:02:00.000Z",
    "__v": 0
  }
}
```

### 3) Obtener productos

Request:

```http
GET /api/products
```

Response `200`:

```json
{
  "success": true,
  "products": [
    {
      "_id": "67d7508d0f9a0d0f40e8f222",
      "name": "ThinkPad X1",
      "description": "Laptop para trabajo",
      "price": 1850,
      "categoryId": {
        "_id": "67d7503d0f9a0d0f40e8f111",
        "name": "Laptops",
        "description": "Equipos portatiles"
      },
      "createdAt": "2026-03-17T18:02:00.000Z",
      "__v": 0
    }
  ]
}
```

### 4) Reporte de asistencia mensual

Request:

```http
GET /api/reports/attendance/monthly?month=3&year=2024
Cookie: token=<jwt_token>
```

Response `200`:

```json
{
  "success": true,
  "message": "Reporte de asistencia para 3/2024",
  "month": 3,
  "year": 2024,
  "totalEmployees": 5,
  "data": [
    {
      "employeeId": "67d7508d0f9a0d0f40e8f333",
      "name": "Juan Pérez",
      "email": "juan@company.com",
      "position": "Developer",
      "department": "IT",
      "present": 18,
      "absent": 1,
      "late": 2,
      "leave": 0,
      "totalDays": 21
    }
  ]
}
```

### 5) Reporte de cantidad de empleados

Request:

```http
GET /api/reports/headcount
Cookie: token=<jwt_token>
```

Response `200`:

```json
{
  "success": true,
  "message": "Reporte de cantidad de empleados por departamento",
  "totalEmployees": 12,
  "departments": [
    {
      "departmentId": "67d7503d0f9a0d0f40e8f444",
      "departmentName": "IT",
      "headcount": 5
    },
    {
      "departmentId": "67d7503d0f9a0d0f40e8f555",
      "departmentName": "HR",
      "headcount": 7
    }
  ]
}
```

### 6) Resumen de empleado

Request:

```http
GET /api/reports/employee/67d7508d0f9a0d0f40e8f333/summary
Cookie: token=<jwt_token>
```

Response `200`:

```json
{
  "success": true,
  "message": "Resumen del empleado",
  "employee": {
    "employeeId": "67d7508d0f9a0d0f40e8f333",
    "name": "Juan Pérez",
    "email": "juan@company.com",
    "position": "Developer",
    "department": "IT",
    "salary": 3500,
    "hireDate": "2023-01-15T00:00:00.000Z",
    "isActive": true,
    "currentMonthAttendance": {
      "present": 18,
      "absent": 1,
      "late": 2,
      "leave": 0,
      "total": 21
    }
  }
}
```
    }
  ]
}
```

##  Testing

Este proyecto incluye pruebas de integración que validan todas las rutas del backend.

### Configurar la BD de prueba

Antes de ejecutar los tests, configura una base de datos separada en tu archivo `.env`:

```
MONGO_URI=mongodb://localhost:27017/rrhh_db
MONGO_URI_TEST=mongodb://localhost:27017/rrhh_test
JWT_SECRET=tu_clave_secreta_super_segura
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Ejecutar tests

```bash
npm test
```

Esto ejecutará todos los tests en `src/__tests__/` con salida detallada.

### Cobertura de tests

Los tests cubren:

**auth.test.js:**
- ✅ POST `/api/auth/register` — registro exitoso devuelve 201
- ✅ POST `/api/auth/register` — email duplicado devuelve 400
- ✅ POST `/api/auth/login` — credenciales correctas devuelven 200 con cookie
- ✅ POST `/api/auth/login` — credenciales incorrectas devuelven 401

**categories.test.js:**
- ✅ GET `/api/categories` — sin autenticación devuelve 401
- ✅ GET `/api/categories` — autenticado devuelve 200 con array
- ✅ POST `/api/categories` — como `employee` devuelve 403
- ✅ POST `/api/categories` — como `admin` devuelve 201
- ✅ DELETE `/api/categories/:id` — como `admin` devuelve 200

**products.test.js:**
- ✅ GET `/api/products` — autenticado devuelve 200 con productos y categoría populada
- ✅ POST `/api/products` — como `admin` con `categoryId` válido devuelve 201
- ✅ POST `/api/products` — con `categoryId` inexistente devuelve 400
- ✅ PUT `/api/products/:id` — como `employee` devuelve 403

### Nota sobre limpieza

Los tests limpian automáticamente la base de datos de prueba después de cada suite, asegurando que no haya datos contaminados entre ejecuciones.

| Tecnología | ¿Para qué sirve? |
|-----------|-----------------|
| **Node.js** | Entorno de ejecución de JavaScript en el servidor |
| **Express** | Framework para crear la API REST fácilmente |
| **MongoDB** | Base de datos NoSQL para guardar los usuarios |
| **Mongoose** | Librería para conectar MongoDB con Node.js |
| **JWT (jsonwebtoken)** | Para crear tokens de seguridad en las sesiones |
| **bcryptjs** | Para encriptar contraseñas (no son legibles) |
| **cookie-parser** | Para trabajar con cookies HTTP-only |
| **CORS** | Para que el frontend pueda hablar con el backend |
| **dotenv** | Para guardar información sensible en archivos `.env` |
| **nodemon** | Herramienta de desarrollo que reinicia el server automáticamente |

##  Seguridad

- **Contraseñas encriptadas**: Imposible ver la contraseña original
- **JWT en cookies HTTP-only**: El token no se puede robar desde JavaScript
- **CORS configurado**: Solo el frontend autorizado puede hacer peticiones
- **Variables de entorno**: Datos sensibles no están en el código

##  Próximos pasos

1. Agregar middleware de autorizacion por rol para proteger operaciones de escritura.
2. Crear pruebas de integracion para `/api/categories` y `/api/products`.
3. Conectar estas rutas con el frontend para reemplazar datos mock.

---


