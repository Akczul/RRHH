# 🚀 RESUMEN: TAREAS FRONTEND

## 📋 Dos tareas asignadas para desarrolladores frontend

---

## 👨‍💻 TAREA 1: Autenticación (Login/Register)

### 🎯 Objetivo
Conectar el frontend con la API de autenticación del backend

### ¿Qué hará?
```
Usuario escribe email y contraseña
        ↓
Hace click en "Iniciar Sesión"
        ↓
Vue envía datos al backend
        ↓
Backend valida y devuelve token JWT
        ↓
Token se guarda en cookie automáticamente
        ↓
Usuario entra al Dashboard ✓
```

### Archivos a crear:
- `src/services/authService.js` - Comunicación con API
- `src/stores/authStore.js` - Pinia store para estado
- `src/views/LoginView.vue` - Formulario de login
- `src/views/RegisterView.vue` - Formulario de registro
- Actualizar `router/index.js` con rutas

### Tecnologías:
- Vue.js 3 (Composition API)
- Pinia (gestión de estado)
- Fetch API (peticiones HTTP)
- Vue Router (navegación)

### Endpoints del backend que usará:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

### Estimación: 3-4 horas

---

## 🎨 TAREA 2: Layout Principal (Dashboard)

### 🎯 Objetivo
Crear la estructura visual global de la aplicación

### ¿Qué hará?
```
┌─────────────────────────────────────────┐
│  NAVBAR (Logo + Nombre Usuario + Menu) │
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │     MAIN CONTENT             │
│          │                              │
│ - Dashboard                    [Cards]  │
│ - Empleados                    [Info]   │
│ - Asistencia                            │
│ - Reportes                              │
│ - Departamentos                         │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Archivos a crear:
- `src/components/Navbar.vue` - Barra superior
- `src/components/Sidebar.vue` - Menú lateral
- `src/components/ProfileDropdown.vue` - Menú usuario
- `src/layouts/MainLayout.vue` - Layout envolvente
- `src/views/DashboardView.vue` - Dashboard principal
- `src/views/ProfileView.vue` - Perfil del usuario
- `src/views/SettingsView.vue` - Configuraciones

### Características:
- ✅ Navbar responsiva
- ✅ Sidebar desplegable en móvil
- ✅ Dashboard con info visual (cards)
- ✅ Menú de usuario con logout
- ✅ Rutas protegidas
- ✅ Responsive design

### Tecnologías:
- Vue.js 3
- Vue Router
- CSS Grid/Flexbox
- Vue Router meta (protección de rutas)

### Estimación: 4-5 horas

---

## 📊 Comparación de tareas

| Aspecto | Tarea 1 | Tarea 2 |
|---------|---------|---------|
| **Enfoque** | Backend ↔ Frontend | Interfaz Visual |
| **Complejidad** | Media | Media |
| **Componentes** | 2 vistas | 7 componentes/vistas |
| **Integración API** | Sí (autenticación) | No (solo lógica local) |
| **Dependencia** | Segunda usa esto ✓ | Requiere Tarea 1 |
| **Duración** | 3-4 horas | 4-5 horas |

---

## ✅ Dependencias entre tareas

```
BACKEND (Ya completado ✓)
    ↓
TAREA 1: Autenticación
    ├─ Login/Register
    ├─ Pinia store
    └─ Conexión API
        ↓
TAREA 2: Layout Principal
    ├─ Navbar
    ├─ Sidebar  
    ├─ Dashboard
    └─ Rutas protegidas
```

**⚠️ IMPORTANTE**: La Tarea 1 debe completarse ANTES que Tarea 2

---

## 🎓 Lo que aprenderán

### Tarea 1:
✓ Peticiones HTTP desde Vue.js  
✓ Gestión de estado con Pinia  
✓ Formularios en Vue  
✓ Validaciones de usuario  
✓ Almacenamiento de tokens  
✓ Guardias de navegación (route guards)  

### Tarea 2:
✓ Componentes reutilizables  
✓ Layouts en Vue  
✓ CSS responsivo  
✓ Navegación dinámica  
✓ Integración de componentes  
✓ UX/UI básico  

---

## 📁 Estructura final del frontend

```
frontend/src/
├── assets/
├── components/
│   ├── Navbar.vue              ← Tarea 2
│   ├── Sidebar.vue             ← Tarea 2
│   └── ProfileDropdown.vue     ← Tarea 2
├── layouts/
│   └── MainLayout.vue          ← Tarea 2
├── views/
│   ├── LoginView.vue           ← Tarea 1
│   ├── RegisterView.vue        ← Tarea 1
│   ├── DashboardView.vue       ← Tarea 2
│   ├── ProfileView.vue         ← Tarea 2
│   └── SettingsView.vue        ← Tarea 2
├── services/
│   └── authService.js          ← Tarea 1
├── stores/
│   └── authStore.js            ← Tarea 1
├── router/
│   └── index.js                ← Ambas tareas
├── App.vue
├── main.js
└── ...
```

---

## 🚀 Cómo ejecutar

### 1. Instalar dependencias
```bash
cd frontend
npm install
npm install pinia
npm install vue-router
```

### 2. Iniciar servidor
```bash
npm run dev
```

### 3. Asegúrate que backend está ejecutándose
```bash
cd backend
npm run dev
```

Accede a: `http://localhost:5173`

---

## 🧪 Flujo de prueba

1. **Tarea 1 completada:**
   - Abre `/register`
   - Rellena formulario
   - Verifica que se registre
   - Abre `/login`
   - Inicia sesión
   - Verifica que el token se guarde

2. **Tarea 2 completada:**
   - Después del login, verás el Dashboard
   - El navbar muestra tu nombre
   - El sidebar muestra el menú
   - Al hacer logout, vuelves a login

---

## 📚 Referencias

- [TAREA_FRONTEND_1.md](TAREA_FRONTEND_1.md) - Ver archivo completo
- [TAREA_FRONTEND_2.md](TAREA_FRONTEND_2.md) - Ver archivo completo
- [backend/README.md](backend/README.md) - Documentación del backend
- Vue.js Docs: https://vuejs.org
- Pinia Docs: https://pinia.vuejs.org

---

## 💡 Consejos Generales

### Para Tarea 1:
- Usa `credentials: 'include'` en fetch para enviar cookies
- Valida los datos antes de enviar
- Muestra mensajes de error claros
- Usa computed para estado reactivo

### Para Tarea 2:
- Usa CSS Grid para responsive
- Mantén componentes pequeños y reutilizables
- Usa router-link en lugar de `<a>`
- Prueba en móvil mientras desarrollas

---

## ❓ Preguntas Frecuentes

**¿Puedo hacer ambas tareas a la vez?**
No, la Tarea 1 debe estar lista antes de empezar Tarea 2.

**¿El backend de dónde sale?**
Ya está creado en `/backend`. Solo necesitas que esté corriendo.

**¿Qué si el login no funciona?**
Verifica que el backend esté en puerto 5000 y MongoDB esté conectado.

**¿Necesito Tailwind?**
No, el CSS está incluido en los ejemplos. Tailwind es opcional.

**¿Qué paquetes necesito instalar además?**
`pinia` y `vue-router` son los únicos obligatorios.

---

## 📈 Siguiente Fase (Futuro)

Después de estas 2 tareas:
- Crear modelos adicionales (Products, Categories)
- Crear vistas de Empleados, Asistencia
- Crear dashboard con gráficos
- Sistema de permisos por rol
- Reportes

---

**¡Asigna estas tareas a tu equipo! 🚀**

Ambas están paso a paso con código completo.
