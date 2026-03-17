# Backend - API de RRHH

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

##  Tecnologías utilizadas

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

El siguiente compañero debe:
1. Crear 2 modelos adicionales: **Product** y **Category**
2. Crear relaciones entre ellos (con ObjectId de MongoDB)
3. Crear controladores y rutas para estas entidades
4. Actualizar este README explicando lo que hizo

---


