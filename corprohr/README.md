# CorpHR — Frontend

Módulo frontend de la aplicación CorpHR, desarrollado como SPA con React 18 y Vite 7. Gestiona empleados, asistencia, departamentos y reportes con soporte para dos roles de usuario y sistema de temas oscuro/claro.

---

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

La aplicación corre en `http://localhost:5173` por defecto.

---

## Credenciales de acceso

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@corphr.com` | `admin123` |
| Empleado | `cmendoza@corphr.com` | `emp123` |
| Empleado | `lfernandez@corphr.com` | `emp123` |
| Empleado | `rsalinas@corphr.com` | `emp123` |
| Empleado | `dtorres@corphr.com` | `emp123` |
| Empleado | `amorales@corphr.com` | `emp123` |

---

## Estructura del proyecto

```
corprohr/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx / Layout.css       # Wrapper principal con Outlet
│   │   │   ├── Sidebar.jsx / Sidebar.css     # Navegación lateral colapsable
│   │   │   └── Topbar.jsx / Topbar.css       # Barra superior con título y usuario
│   │   └── ui/
│   │       ├── Avatar.jsx / Avatar.css       # Círculo con iniciales del empleado
│   │       ├── Badge.jsx / Badge.css         # Etiqueta de estado con variantes de color
│   │       ├── Button.jsx / Button.css       # Botón reutilizable (primary/secondary/danger)
│   │       ├── Modal.jsx / Modal.css         # Ventana emergente con animación y ESC
│   │       ├── StatCard.jsx / StatCard.css   # Tarjeta de métrica con barra de color
│   │       └── ThemeToggle.jsx / .css        # Interruptor oscuro/claro
│   ├── context/
│   │   ├── AuthContext.jsx                   # Sesión, rol y login/logout
│   │   └── ThemeContext.jsx                  # Tema oscuro/claro con localStorage
│   ├── data/
│   │   └── mockData.js                       # Empleados, departamentos, asistencia y credenciales
│   ├── hooks/
│   │   ├── useAuth.js                        # Acceso al AuthContext
│   │   └── useTheme.js                       # Acceso al ThemeContext
│   ├── pages/
│   │   ├── Login.jsx / Login.css             # Inicio de sesión con selector de rol
│   │   ├── RecoverPassword.jsx / .css        # Recuperación en 2 pasos
│   │   ├── Dashboard.jsx / Dashboard.css     # Métricas, gráfico y tabla reciente
│   │   ├── Employees.jsx / Employees.css     # CRUD local de empleados
│   │   ├── Attendance.jsx / Attendance.css   # Asistencia: hoy, historial y calendario
│   │   ├── Departments.jsx / Departments.css # Tarjetas de departamentos
│   │   ├── Reports.jsx / Reports.css         # 6 tipos de reporte con descarga simulada
│   │   ├── MyProfile.jsx / MyProfile.css     # Perfil personal del empleado autenticado
│   │   └── MyAttendance.jsx / .css           # Calendario de asistencia del empleado
│   ├── router/
│   │   └── AppRouter.jsx                     # Rutas públicas, privadas y guardias por rol
│   ├── styles/
│   │   └── globals.css                       # Variables CSS, reset y utilidades globales
│   ├── App.jsx                               # Raíz: ThemeProvider > AuthProvider > AppRouter
│   └── main.jsx                              # Punto de entrada React DOM
├── index.html
├── vite.config.js
└── package.json
```

---

## Decisiones técnicas relevantes

- **Sin librerías de UI.** Todos los componentes están construidos con CSS puro y variables de color, lo que permite control total sobre el diseño y facilita la futura migración a cualquier sistema de estilos.
- **Datos simulados.** `mockData.js` genera automáticamente ~400 registros de asistencia para los últimos 30 días hábiles. La fecha de referencia del sistema es el 10 de marzo de 2026.
- **Rutas protegidas por rol.** `PrivateRoute` en `AppRouter.jsx` verifica la sesión activa y el rol antes de renderizar cada página, redirigiendo al destino correcto según corresponda.
- **Estado local.** Las operaciones de agregar, editar o eliminar empleados y departamentos se aplican sobre estado local con `useState` y no persisten al recargar. Esto cambiará cuando se integre el backend.
- **Modales personalizados.** Se reemplazó `window.confirm` por modales propios para mantener la coherencia visual en toda la aplicación.

---

## Pendiente para la siguiente fase

- Integración con API REST (Node.js + Express)
- Autenticación real con JWT
- Persistencia en base de datos MySQL mediante Sequelize
- Validaciones de formulario más robustas del lado servidor
