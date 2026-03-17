# 🎨 TAREA 2 PARA FRONTEND: Layout Principal y Navegación

## 🎯 Objetivo

Crear el **layout principal** de la aplicación con:
- Navbar responsiva
- Sidebar de navegación
- Sistema de rutas protegidas
- Página de Dashboard
- Funcionalidad de logout

---

## 📌 Descripción

Esta tarea es crear la estructura visual global de la app. El usuario, una vez autenticado, verá:

1. **Navbar** en la parte superior con el logo y opciones de usuario
2. **Sidebar** con menú de navegación
3. **Main Content** donde irá el contenido de cada página
4. **Footer** (opcional)

---

## 🛠️ Requisitos Técnicos

### Lo que necesitas:
- Vue.js 3 (Composition API)
- Pinia (del estado de autenticación de la tarea anterior)
- Vue Router (del setup de la tarea anterior)
- CSS (o Tailwind si quieres)
- Icons (opcional: usar emojis o Font Awesome)

### Archivos a crear:
```
frontend/src/
├── components/
│   ├── Navbar.vue          ← Barra superior
│   ├── Sidebar.vue         ← Menú lateral
│   └── ProfileDropdown.vue ← Menú de usuario
├── layouts/
│   └── MainLayout.vue      ← Layout envolvente
├── views/
│   ├── DashboardView.vue   ← Página principal del usuario
│   ├── ProfileView.vue     ← Perfil del usuario
│   └── SettingsView.vue    ← Configuraciones
└── styles/
    └── layout.css          ← Estilos globales
```

---

## 📝 Paso a Paso

### 1. Crear componente Navbar.vue
```vue
<template>
  <nav class="navbar">
    <div class="navbar-left">
      <h1 class="logo">🏢 RRHH System</h1>
    </div>

    <div class="navbar-right">
      <span class="welcome">Hola, {{ user?.name }}</span>
      <ProfileDropdown />
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import ProfileDropdown from './ProfileDropdown.vue';

const authStore = useAuthStore();

const user = computed(() => authStore.user);
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome {
  font-size: 14px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 10px;
  }

  .welcome {
    display: none;
  }
}
</style>
```

### 2. Crear componente ProfileDropdown.vue
```vue
<template>
  <div class="dropdown">
    <button class="dropdown-btn" @click="toggleDropdown">
      ⚙️ Menú ▼
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <router-link to="/profile" class="dropdown-item">
        👤 Mi Perfil
      </router-link>
      <router-link to="/settings" class="dropdown-item">
        ⚙️ Configuración
      </router-link>
      <button @click="handleLogout" class="dropdown-item logout">
        🚪 Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-btn {
  background-color: #34495e;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.dropdown-btn:hover {
  background-color: #1a252f;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  z-index: 200;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 15px;
  color: #2c3e50;
  text-decoration: none;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-item.logout {
  color: #e74c3c;
  font-weight: bold;
}

.dropdown-item.logout:hover {
  background-color: #ffe6e6;
}
</style>
```

### 3. Crear componente Sidebar.vue
```vue
<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <button class="close-btn" @click="toggleSidebar">✕</button>

    <nav class="nav-menu">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        📊 Dashboard
      </router-link>
      <router-link to="/employees" class="nav-item" active-class="active">
        👥 Empleados
      </router-link>
      <router-link to="/attendance" class="nav-item" active-class="active">
        📋 Asistencia
      </router-link>
      <router-link to="/reports" class="nav-item" active-class="active">
        📈 Reportes
      </router-link>
      <router-link to="/departments" class="nav-item" active-class="active">
        🏢 Departamentos
      </router-link>
    </nav>
  </aside>

  <button v-if="!isOpen" class="sidebar-toggle" @click="toggleSidebar">
    ☰ Menú
  </button>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 70px; /* Altura del navbar */
  width: 250px;
  height: calc(100vh - 70px);
  background-color: #34495e;
  padding: 20px;
  overflow-y: auto;
  transition: transform 0.3s;
  z-index: 90;
}

.sidebar.open {
  transform: translateX(0);
}

.close-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 15px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: block;
  padding: 12px 15px;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
}

.nav-item:hover {
  background-color: #2c3e50;
  color: white;
}

.nav-item.active {
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

.sidebar-toggle {
  position: fixed;
  left: 20px;
  bottom: 20px;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 15px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  z-index: 89;
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 100%;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .close-btn {
    display: block;
  }

  .sidebar-toggle {
    display: block;
  }
}
</style>
```

### 4. Crear MainLayout.vue
```vue
<template>
  <div class="layout">
    <Navbar />
    <div class="layout-container">
      <Sidebar />
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .main-content {
    padding: 15px;
  }
}
</style>
```

### 5. Crear DashboardView.vue
```vue
<template>
  <MainLayout>
    <div class="dashboard">
      <h1>📊 Bienvenido al Dashboard</h1>
      <p>Hola, <strong>{{ user?.name }}</strong></p>

      <div class="cards-grid">
        <div class="card">
          <h3>👥 Empleados</h3>
          <p class="number">25</p>
          <p class="text">Empleados activos</p>
        </div>

        <div class="card">
          <h3>📋 Asistencia</h3>
          <p class="number">98%</p>
          <p class="text">Tasa de asistencia</p>
        </div>

        <div class="card">
          <h3>🏢 Departamentos</h3>
          <p class="number">5</p>
          <p class="text">Departamentos</p>
        </div>

        <div class="card">
          <h3>📈 Reportes</h3>
          <p class="number">12</p>
          <p class="text">Reportes disponibles</p>
        </div>
      </div>

      <div class="section">
        <h2>Acciones Rápidas</h2>
        <div class="button-group">
          <button class="btn btn-primary">➕ Nuevo Empleado</button>
          <button class="btn btn-secondary">📋 Ver Asistencia</button>
          <button class="btn btn-secondary">📊 Generar Reporte</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import MainLayout from '@/layouts/MainLayout.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<style scoped>
.dashboard {
  width: 100%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
}

.number {
  font-size: 32px;
  font-weight: bold;
  color: #3498db;
  margin: 0;
}

.text {
  font-size: 12px;
  color: #999;
  margin: 10px 0 0 0;
}

.section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-top: 0;
  color: #2c3e50;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background-color: #bdc3c7;
}

/* Responsive */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
```

### 6. Crear ProfileView.vue
```vue
<template>
  <MainLayout>
    <div class="profile">
      <h1>👤 Mi Perfil</h1>

      <div class="profile-card">
        <h2>Información Personal</h2>
        <div class="info-group">
          <label>Nombre:</label>
          <span>{{ user?.name }}</span>
        </div>
        <div class="info-group">
          <label>Email:</label>
          <span>{{ user?.email }}</span>
        </div>
        <div class="info-group">
          <label>Rol:</label>
          <span class="badge">{{ user?.role === 'admin' ? 'Administrador' : 'Empleado' }}</span>
        </div>
        <div class="info-group">
          <label>Miembro desde:</label>
          <span>{{ formatDate(user?.createdAt) }}</span>
        </div>
      </div>

      <button class="btn btn-primary" @click="goToSettings">
        ⚙️ Ir a Configuración
      </button>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import MainLayout from '@/layouts/MainLayout.vue';

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES');
};

const goToSettings = () => {
  router.push('/settings');
};
</script>

<style scoped>
.profile {
  max-width: 600px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.profile-card {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.profile-card h2 {
  color: #2c3e50;
  margin-top: 0;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.info-group {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #ecf0f1;
}

.info-group:last-child {
  border-bottom: none;
}

.info-group label {
  font-weight: bold;
  color: #2c3e50;
}

.info-group span {
  color: #666;
}

.badge {
  background-color: #2ecc71;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}
</style>
```

### 7. Crear SettingsView.vue
```vue
<template>
  <MainLayout>
    <div class="settings">
      <h1>⚙️ Configuración</h1>

      <div class="settings-card">
        <h2>Notificaciones</h2>
        <div class="toggle-item">
          <label>Recibir notificaciones por email</label>
          <input type="checkbox" v-model="settings.emailNotifications" />
        </div>
      </div>

      <div class="settings-card">
        <h2>Tema</h2>
        <div class="radio-item">
          <input type="radio" id="light" value="light" v-model="settings.theme" />
          <label for="light">☀️ Claro</label>
        </div>
        <div class="radio-item">
          <input type="radio" id="dark" value="dark" v-model="settings.theme" />
          <label for="dark">🌙 Oscuro</label>
        </div>
      </div>

      <button class="btn btn-primary" @click="saveSettings">
        💾 Guardar Cambios
      </button>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';

const settings = ref({
  emailNotifications: true,
  theme: 'light'
});

const saveSettings = () => {
  alert('Configuración guardada');
  // Aquí iría la lógica para guardar en el backend
};
</script>

<style scoped>
.settings {
  max-width: 600px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.settings-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.settings-card h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.toggle-item,
.radio-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
}

.toggle-item label,
.radio-item label {
  flex: 1;
  margin: 0;
}

input[type="checkbox"],
input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  background-color: #3498db;
  color: white;
}

.btn:hover {
  background-color: #2980b9;
}
</style>
```

---

## 📋 Actualizar el Router

Agrega estas rutas a `router/index.js`:

```javascript
import ProfileView from '@/views/ProfileView.vue';
import SettingsView from '@/views/SettingsView.vue';
import DashboardView from '@/views/DashboardView.vue';

const routes = [
  // ... rutas anteriores ...
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  }
];
```

---

## ✅ Checklist

- [ ] Navbar creado y muestra el nombre del usuario
- [ ] Sidebar con menú de navegación funcional
- [ ] ProfileDropdown con opción de logout
- [ ] MainLayout envuelve todas las vistas
- [ ] DashboardView con cards y acciones
- [ ] ProfileView muestra información completa
- [ ] SettingsView con configuraciones básicas
- [ ] Todas las rutas protegidas funcionan correctamente
- [ ] Responsive en dispositivos móviles
- [ ] Logo y estilos visuales aplicados

---

## 🧪 Pruebas

1. Inicia sesión desde la Tarea 1
2. Deberías ver el Dashboard con navbar y sidebar
3. Haz click en los elementos del sidebar
4. Verifica que el logout funcione
5. Prueba en dispositivo móvil que sea responsive

---

## 🎨 Mejoras Opcionales

- Añadir animaciones suaves
- Usar Tailwind CSS en lugar de CSS básico
- Mejorar los colores y tipografía
- Añadir más cards en el dashboard con datos reales
- Implementar notificaciones toast

---

**¡Éxito en la interfaz! 🚀**
