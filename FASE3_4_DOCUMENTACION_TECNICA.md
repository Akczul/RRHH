# Fase 3 y 4 - Documentacion tecnica RRHH

## Diagnostico tecnico breve

El proyecto cumple la base de Fase 3 y 4: SPA en React + Vite, React Router v7, API REST Express/MongoDB, autenticacion JWT por cookie HTTP-only, CORS con credenciales, Swagger y arquitectura MVC. Se corrigieron las brechas principales: estado global migrado a Zustand, rutas protegidas sin depender de Context API, endpoints faltantes de perfil y recuperacion, y stores para auth, tema, departamentos, posiciones y catalogos.

## Decision Category/Product vs Department/Position

Se mantiene la opcion A: `Category/Product` como integracion parcial funcional del frontend.

Justificacion para sustentacion:

- Es la ruta mas estable porque `Departments.jsx`, `Employees.jsx` y `Dashboard.jsx` ya consumen esos endpoints y permiten demostrar CRUD real.
- Cumple la consigna de integracion parcial entre backend API REST y frontend React.
- Los modelos `Department/Position/Employee` quedan implementados en backend como dominio RRHH real y preparados para una siguiente iteracion.
- Evita una migracion riesgosa antes de la entrega.

## Arquitectura frontend

El frontend esta construido con React + Vite y React Router v7. La aplicacion usa rutas publicas y rutas internas protegidas con layouts anidados mediante `<Outlet />`.

Capas principales:

- `src/router/AppRouter.jsx`: mapa de rutas, guardias y layout protegido.
- `src/services/api.js`: cliente HTTP centralizado con `fetch`, base `/api` y `credentials: "include"`.
- `src/stores/useAuthStore.js`: sesion global con Zustand.
- `src/stores/useThemeStore.js`: tema oscuro/claro persistente.
- `src/stores/useDepartmentStore.js`: CRUD de departamentos sobre `/api/categories`.
- `src/stores/usePositionStore.js`: CRUD de posiciones sobre `/api/products`.
- `src/stores/useCatalogStore.js`: carga combinada de catalogos para dashboard.
- `src/components/ui`: componentes reutilizables.
- `src/components/layout`: layout interno con sidebar y topbar.

## Arquitectura backend

El backend sigue arquitectura MVC:

- `models/`: esquemas Mongoose.
- `controllers/`: logica de negocio.
- `routes/`: endpoints Express.
- `middlewares/`: autenticacion y autorizacion.
- `config/`: MongoDB y Swagger.
- `server.js`: arranque de Express, middlewares globales, CORS, cookies, Swagger y rutas.

Seguridad:

- JWT firmado con `JWT_SECRET`.
- Cookie `token` HTTP-only.
- `secure` solo en produccion.
- CORS con `credentials: true`.
- `protect` valida sesion.
- `authorize(...roles)` restringe por rol.

## Mapa de rutas frontend

Publicas:

- `/`
- `/login`
- `/register`
- `/recuperar-contrasena`

Protegidas con layout interno:

- `/app/dashboard`
- `/app/departamentos`
- `/app/posiciones`
- `/app/asistencia`
- `/app/reportes`
- `/app/registro`
- `/app/mi-perfil`
- `/app/mi-asistencia`

Guardias:

- `PublicRoute`: redirige usuarios autenticados.
- `PrivateRoute`: requiere sesion.
- `AdminRoute`: requiere rol `admin`.
- `EmployeeRoute`: requiere sesion, permite admin y employee.

## Stores Zustand implementados

- `useAuthStore`: `user`, `usuario`, `isAuthenticated`, `estaAutenticado`, `loading`, `cargando`, `error`, `login()`, `logout()`, `checkAuth()`, `refrescarPerfil()`, `esAdmin()`, `esEmpleado()`.
- `useThemeStore`: `isDark`, `initTheme()`, `setTheme()`, `toggleTheme()`.
- `useDepartmentStore`: `departments`, `loading`, `error`, `fetchDepartments()`, `createDepartment()`, `updateDepartment()`, `deleteDepartment()`.
- `usePositionStore`: `positions`, `loading`, `error`, `fetchPositions()`, `createPosition()`, `updatePosition()`, `deletePosition()`.
- `useCatalogStore`: carga paralela de departamentos y posiciones para dashboard.

El JWT no se guarda en `localStorage` ni `sessionStorage`; solo se almacena en cookie HTTP-only del backend.

## Contratos API principales

### POST `/api/auth/register`

Request:

```json
{
  "name": "Empleado Demo",
  "email": "empleado@empresa.com",
  "password": "Password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "user": {
    "id": "ObjectId",
    "name": "Empleado Demo",
    "email": "empleado@empresa.com",
    "role": "employee"
  }
}
```

### POST `/api/auth/register-admin`

Requiere cookie valida y rol `admin`.

```json
{
  "name": "Admin Demo",
  "email": "admin@empresa.com",
  "password": "Password123",
  "role": "admin"
}
```

### POST `/api/auth/login`

```json
{
  "email": "admin@empresa.com",
  "password": "Password123"
}
```

Devuelve usuario y setea cookie HTTP-only `token`.

### POST `/api/auth/logout`

Limpia la cookie `token`.

### GET `/api/auth/profile`

Requiere cookie valida. Devuelve datos del usuario autenticado.

### PUT `/api/auth/profile`

```json
{
  "name": "Nuevo Nombre",
  "password": "NuevaClave123"
}
```

`password` es opcional. Si se envia, debe tener minimo 6 caracteres.

### POST `/api/auth/recover`

```json
{
  "email": "usuario@empresa.com"
}
```

Devuelve una respuesta controlada sin revelar si el email existe.

### CRUD `/api/categories`

Usado como departamentos en la integracion parcial:

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Request:

```json
{
  "name": "Talento Humano",
  "description": "Area de RRHH"
}
```

### CRUD `/api/products`

Usado como posiciones/cargos en la integracion parcial:

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Request:

```json
{
  "name": "Analista de Nomina",
  "description": "Gestion de pagos",
  "price": 2500000,
  "categoryId": "ObjectId de categoria"
}
```

## JWT en cookies HTTP-only

El backend genera un JWT al registrar o iniciar sesion. Ese token se envia como cookie HTTP-only llamada `token`, por lo que JavaScript del navegador no puede leerlo. El frontend solo usa `credentials: "include"` para que el navegador envie la cookie automaticamente en cada peticion protegida.

## Modo oscuro persistente

El tema se maneja con `useThemeStore`. Se persiste solo la preferencia visual (`isDark`) en localStorage mediante Zustand persist. El store aplica `data-theme="dark|light"` y la clase `dark` al elemento `<html>`, permitiendo compatibilidad con CSS actual y Tailwind.

## Integracion parcial

La integracion demostrable se enfoca en:

- Login/logout/perfil con cookie HTTP-only.
- Dashboard protegido.
- CRUD de departamentos sobre `/api/categories`.
- CRUD de posiciones sobre `/api/products`.
- Registro publico de empleados.
- Registro interno de usuarios con rol desde admin.

Modulos con backend listo pero frontend pendiente:

- Asistencia.
- Reportes.
- CRUD real de `Department/Position/Employee`.

## Checklist final de pruebas

1. Instalar dependencias:

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Crear `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/rrhh_db
MONGO_URI_TEST=mongodb://localhost:27017/rrhh_test
JWT_SECRET=token_secreto_xd
PORT=5000
FRONTEND_URL=http://localhost:5173
```

3. Ejecutar MongoDB local.

4. Ejecutar backend:

```bash
cd backend
npm run dev
```

5. Ejecutar frontend:

```bash
cd frontend
npm run dev
```

6. Abrir Swagger:

```text
http://localhost:5000/api-docs
```

7. Probar registro publico en `/register`.

8. Probar login en `/login`.

9. Probar dashboard protegido `/app/dashboard`.

10. Probar CRUD de departamentos.

11. Probar CRUD de posiciones.

12. Probar logout.

13. Probar una ruta protegida sin sesion, por ejemplo `/app/dashboard`.

14. Probar modo oscuro/claro y recargar con F5.

15. Probar responsive en movil y escritorio.

16. Revisar commits por integrante:

```bash
git log --date=short --pretty=format:"%h %ad %an %s"
```

## Errores comunes y solucion

- Backend apagado: el frontend mostrara error de conexion. Ejecutar `npm run dev` en `backend`.
- MongoDB apagado: el backend no inicia o falla al consultar. Iniciar servicio MongoDB local.
- Cookie no llega: verificar `credentials: "include"` en frontend y `credentials: true` en CORS.
- Usuario no es admin: rutas `/app/dashboard`, `/app/departamentos`, `/app/posiciones`, `/app/registro` redirigen a perfil.
- No aparece rol admin en registro publico: es intencional; solo admin autenticado puede crear admins.
- Swagger no abre: confirmar backend en puerto 5000 y entrar a `/api-docs`.
- F5 redirige incorrectamente: revisar que `checkAuth()` se ejecute en `App.jsx` y que backend responda `GET /api/auth/profile`.

