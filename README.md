#  RRHH - Sistema de Gestión de Recursos Humanos

##  Descripción del Proyecto

Este proyecto es una **aplicación web moderna** para gestionar Recursos Humanos en una empresa. Con esta app puedes:

-  Registrar y administrar empleados
-  Controlar la asistencia diaria
-  Generar reportes de personal
-  Gestionar departamentos y cargos

La aplicación es una **SPA (Single Page Application)** con:
- **Frontend**: React + Vite (interfaz visual bonita y rápida)
- **Backend**: Node.js + Express (lógica del negocio)
- **Base de datos**: MongoDB (almacenamiento de datos)

### Tipos de usuarios:
- **Administrador**: Acceso total (crear empleados, reportes, gestionar sistema)
- **Empleado**: Acceso limitado (ver su información y asistencia)

---

##  Arquitectura del Proyecto

```
RRHH/
├── frontend/               ← Interfaz visual (React + Vite)
├── backend/                ← API REST (Node.js + Express)
│   ├── src/
│   │   ├── models/        ← Modelos de datos
│   │   ├── controllers/   ← Lógica de negocios
│   │   ├── routes/        ← Endpoints de la API
│   │   ├── middlewares/   ← Validaciones de seguridad
│   │   └── config/        ← Configuraciones
│   └── server.js          ← Archivo principal del servidor
└── README.md
```

---

##  Tecnologías Utilizadas

### Frontend
- React
- Vite
- Pinia (gestión de estado)

### Backend
- **Node.js**: Entorno JavaScript en servidor
- **Express**: Framework para crear APIs REST
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación segura
- **bcryptjs**: Encriptación de contraseñas

### Seguridad
- Autenticación con JWT
- Contraseñas encriptadas
- Cookies HTTP-only
- CORS configurado

---

##  Cómo Ejecutar el Proyecto

### Backend
```bash
cd backend
npm install
npm run dev
```
El backend se ejecutará en: `http://localhost:5000`

Lee [backend/README.md](backend/README.md) para más detalles.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend se ejecutará en: `http://localhost:5173`

---

##  Documentación

- [Backend README](backend/README.md) - Instalación y uso del servidor
- [Frontend README](frontend/README.md) - Interfaz visual

---

##  Equipo de Desarrollo

Este proyecto fue desarrollado como parte del curso **Electiva Complementaria III** del Sexto Semestre
