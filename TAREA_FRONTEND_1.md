# 👨‍💻 TAREA 1 PARA FRONTEND: Conexión API de Autenticación

## 🎯 Objetivo

Crear las vistas de **Login y Register** en Vue.js 3 y conectarlas con el backend de autenticación que ya está funcionando.

---

## 📌 Descripción

Tu tarea es:
1. Crear componentes Vue para **Login** y **Register**
2. Conectar estos componentes con los endpoints del backend
3. Guardar el token JWT en el estado (Pinia)
4. Manejar los errores y mostrar mensajes al usuario

---

## 🛠️ Requisitos Técnicos

### Tecnologías:
- **Vue.js 3** (Composition API)
- **Pinia** (gestión de estado)
- **Fetch API o Axios** (peticiones HTTP)
- **Vue Router** (navegación)

### Archivos a crear:
```
frontend/src/
├── views/
│   ├── LoginView.vue         ← Vista de iniciar sesión
│   └── RegisterView.vue      ← Vista de registrarse
├── stores/
│   └── authStore.js          ← Pinia store para autenticación
├── services/
│   └── authService.js        ← Funciones para llamar la API
└── router/
    └── index.js              ← Configurar rutas
```

---

## 📝 Paso a Paso

### 1. Crear el servicio de API (authService.js)
```javascript
// frontend/src/services/authService.js
const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  // Registrar nuevo usuario
  async register(userData) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Importante: permite enviar cookies
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Iniciar sesión
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Importante!
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // Obtener perfil del usuario autenticado
  async getProfile() {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      credentials: 'include'
    });
    return response.json();
  },

  // Logout
  async logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return response.json();
  }
};
```

### 2. Crear Pinia store (authStore.js)
```javascript
// frontend/src/stores/authStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Computed
  const isAuthenticated = computed(() => user.value !== null);

  // Actions
  const register = async (userData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authService.register(userData);
      if (response.success) {
        user.value = response.user;
        return { success: true };
      } else {
        error.value = response.message;
        return { success: false, error: response.message };
      }
    } catch (e) {
      error.value = e.message;
      return { success: false, error: e.message };
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        user.value = response.user;
        return { success: true };
      } else {
        error.value = response.message;
        return { success: false, error: response.message };
      }
    } catch (e) {
      error.value = e.message;
      return { success: false, error: e.message };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      user.value = null;
    } catch (e) {
      console.error('Error en logout:', e);
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout
  };
});
```

### 3. Crear LoginView.vue
```vue
<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          v-model="credentials.email" 
          type="email" 
          id="email"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          v-model="credentials.password" 
          type="password" 
          id="password"
          placeholder="Tu contraseña"
          required
        />
      </div>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
    </form>

    <p v-if="authStore.error" class="error">{{ authStore.error }}</p>

    <p class="link">
      ¿No tienes cuenta? 
      <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const credentials = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  const result = await authStore.login(credentials.value);
  if (result.success) {
    // Redirigir al dashboard
    router.push('/dashboard');
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 15px;
  text-align: center;
}

.link {
  text-align: center;
  margin-top: 15px;
}

.link a {
  color: #4CAF50;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}
</style>
```

### 4. Crear RegisterView.vue
```vue
<template>
  <div class="register-container">
    <h1>Registrarse</h1>
    
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input 
          v-model="formData.name" 
          type="text" 
          id="name"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          v-model="formData.email" 
          type="email" 
          id="email"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          v-model="formData.password" 
          type="password" 
          id="password"
          placeholder="Al menos 6 caracteres"
          minlength="6"
          required
        />
      </div>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Registrando...' : 'Registrarse' }}
      </button>
    </form>

    <p v-if="authStore.error" class="error">{{ authStore.error }}</p>

    <p class="link">
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const formData = ref({
  name: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  const result = await authStore.register(formData.value);
  if (result.success) {
    router.push('/dashboard');
  }
};
</script>

<style scoped>
/* Igual que LoginView.vue */
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 15px;
  text-align: center;
}

.link {
  text-align: center;
  margin-top: 15px;
}

.link a {
  color: #4CAF50;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}
</style>
```

### 5. Configurar rutas (router/index.js)
```javascript
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import { useAuthStore } from '@/stores/authStore';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true } // Ruta protegida
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Si necesita autenticación y no está autenticado, ir a login
    next('/login');
  } else {
    next();
  }
});

export default router;
```

---

## ✅ Checklist

- [ ] Archivos creados: authService.js, authStore.js
- [ ] Vista LoginView.vue creada y funcional
- [ ] Vista RegisterView.vue creada y funcional
- [ ] Rutas configuradas en router
- [ ] Guard de navegación protegiendo rutas privadas
- [ ] Conexión con backend probada (Login funciona)
- [ ] Conexión con backend probada (Register funciona)
- [ ] Se muestra el nombre del usuario después de login
- [ ] Se redirige correctamente después de autenticarse
- [ ] Se muestran mensajes de error si falla

---

## 🧪 Pruebas

1. Abre `http://localhost:5173/register`
2. Rellena: nombre, email, contraseña
3. Click en "Registrarse"
4. Deberías ver el dashboard (o ir a login)
5. En login, usa las credenciales que registraste
6. Verifica que aparezca tu nombre en la pantalla

---

## 💡 Consejos

- Instala Pinia: `npm install pinia`
- Instala Vue Router: `npm install vue-router`
- Asegúrate que el backend está corriendo en puerto 5000
- Usa `credentials: 'include'` en fetch para enviar cookies
- El token se envía automáticamente en las cookies

---

## 📚 Referencias

- Backend API: `http://localhost:5000/api/auth`
- Documentación backend: [backend/README.md](../backend/README.md)
- Pinia docs: https://pinia.vuejs.org
- Fetch con cookies: https://developer.mozilla.org/es/docs/Web/API/Fetch_API

---

**¡Éxito! Cualquier duda mira el backend/README.md** 🚀
