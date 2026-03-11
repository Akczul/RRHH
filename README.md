# RRHH

## CorpHR — Sistema de Recursos Humanos

SPA (Single Page Application) para la gestión de Recursos Humanos, construida con **React + Vite**. Incluye control de empleados, asistencia, departamentos y reportes, con soporte para dos roles de usuario y tema oscuro/claro.

> **Estado actual:** fase frontend — todos los datos provienen de `mockData.js`. Próximamente se integrará un backend con API REST (Node.js + Express), base de datos MySQL y autenticación mediante JWT.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework UI | React 18 + Vite 7 |
| Enrutamiento | React Router v6 |
| Estilos | CSS puro con variables (sin librerías UI) |
| Tipografías | Google Fonts — Syne + DM Sans |
| Estado global | Context API (AuthContext + ThemeContext) |
| Persistencia | `sessionStorage` (sesión) · `localStorage` (tema) |
| Datos | `mockData.js` (fase actual — sin backend) |

**Stack backend planeado (próxima fase)**

| Capa | Tecnología |
|---|---|
| Servidor | Node.js + Express |
| Base de datos | MySQL + Sequelize ORM |
| Autenticación | JWT (JSON Web Tokens) |

---

## Funcionalidades

**Rol Administrador**
- Dashboard con métricas, gráfico de barras CSS y tabla de empleados recientes
- Gestión de empleados: búsqueda, filtros por departamento, agregar, activar/desactivar y eliminar
- Control de asistencia: vista del día, historial filtrable y calendario mensual con colores
- Gestión de departamentos: tarjetas con métricas y selector de color
- Reportes: 6 tipos de reporte con simulación de descarga (CSV / PDF / XLSX)

**Rol Empleado**
- Mi Perfil: datos personales, métricas del mes e índice de puntualidad
- Mi Asistencia: calendario mensual navegable con detalle de registros

**Generales**
- Toggle de tema oscuro / claro persistente
- Sidebar colapsable con navegación basada en rol
- Modales personalizados (sin `window.confirm`)
- Diseño completamente responsivo

---

## Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/RRHH.git
cd RRHH/corprohr

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

La app estará disponible en `http://localhost:5173`.

---

## Credenciales de acceso

> Todos los datos son simulados. No existe backend ni base de datos real.

### 🛡️ Administrador

| Campo | Valor |
|---|---|
| Correo | `admin@corphr.com` |
| Contraseña | `admin123` |
| Acceso | Dashboard completo, empleados, asistencia, departamentos, reportes |

### 👤 Empleados

| Nombre | Correo | Contraseña |
|---|---|---|
| Carlos Mendoza | `cmendoza@corphr.com` | `emp123` |
| Lucía Fernández | `lfernandez@corphr.com` | `emp123` |
| Roberto Salinas | `rsalinas@corphr.com` | `emp123` |
| Diego Torres | `dtorres@corphr.com` | `emp123` |
| Andrea Morales | `amorales@corphr.com` | `emp123` |

> Los empleados solo pueden ver su perfil y su historial de asistencia personal.

---

## Notas de desarrollo

- La fecha de referencia del sistema es **10 de marzo de 2026**. Los registros de asistencia generados en `mockData.js` cubren los últimos 30 días hábiles desde esa fecha.
- Todos los cambios de estado (agregar, eliminar, activar empleados o departamentos) son **en memoria** y se pierden al recargar la página.
- El proyecto no implementa autenticación real; la validación de credenciales se hace contra el array `credenciales[]` en el frontend.
