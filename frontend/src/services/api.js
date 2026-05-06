/**
 * api.js — Capa central de comunicación con el backend de CorpHR.
 *
 * Todas las peticiones HTTP de la aplicación pasan por este módulo.
 * Se utiliza el proxy de Vite (/api → http://localhost:5000) para
 * evitar problemas de CORS en el entorno de desarrollo.
 *
 * Entidades disponibles en el backend:
 *  - Auth   : POST /auth/login | register | logout | GET /auth/profile
 *  - Categorías (Departamentos): CRUD en /categories
 *  - Productos  (Posiciones)  : CRUD en /products  (populated con categoryId)
 */

// Base URL — el vite.config.js redirige /api → localhost:5000
const BASE = '/api';

/* ── Mensajes de error amigables segun codigo HTTP ── */
const MENSAJES_HTTP = {
  400: 'Datos incorrectos. Revisa los campos e intenta de nuevo.',
  401: 'Credenciales incorrectas. Verifica tu correo y contraseña.',
  403: 'No tienes permiso para realizar esta accion.',
  404: 'El recurso solicitado no fue encontrado.',
  409: 'Ya existe un registro con esos datos.',
  422: 'Los datos ingresados no son validos.',
  429: 'Demasiados intentos. Espera un momento antes de continuar.',
  500: 'Error interno del servidor. Intenta mas tarde.',
  502: 'No se puede conectar al servidor. Verifica que el servicio este activo.',
  503: 'Servicio no disponible. Intenta mas tarde.',
};

const mensajeHTTP = (status) =>
  MENSAJES_HTTP[status] ?? `Error del servidor (${status}). Intenta mas tarde.`;

/* ============================================================
   Utilidad interna: ejecutar una petición HTTP
   ============================================================ */

/**
 * Realiza una petición al backend y devuelve los datos JSON.
 * Lanza un Error con el mensaje del servidor si la respuesta no es 2xx.
 *
 * @param {string} endpoint  - Ruta relativa, p. ej. '/auth/login'
 * @param {RequestInit} opts - Opciones extra de fetch
 * @returns {Promise<any>}   - Objeto JSON devuelto por el servidor
 */
async function peticion(endpoint, opts = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      credentials: 'include',
      ...opts,
    });
  } catch {
    /* El servidor no esta disponible (backend apagado, sin red) */
    throw new Error('No se puede conectar al servidor. Verifica que el servicio este activo.');
  }

  /* Leer el cuerpo como texto para manejar respuestas vacias o no-JSON */
  const texto = await respuesta.text();

  /* Intentar parsear JSON; si falla, construir objeto minimal */
  let datos = {};
  try {
    datos = texto ? JSON.parse(texto) : {};
  } catch {
    /* El servidor devolvio HTML u otro formato no-JSON */
    if (!respuesta.ok) throw new Error(mensajeHTTP(respuesta.status));
    return {};
  }

  /* Si el servidor respondio con error HTTP, usar mensaje amigable */
  if (!respuesta.ok) {
    throw new Error(datos.message || mensajeHTTP(respuesta.status));
  }

  return datos;
}

/* ============================================================
   AUTH — Autenticación y perfil de usuario
   ============================================================ */

/**
 * Iniciar sesión. El servidor responde con una cookie httpOnly.
 * @param {string} email
 * @param {string} password
 * @returns {{ success, user: { id, name, email, role } }}
 */
export const loginAPI = (email, password) =>
  peticion('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

/**
 * Registrar un nuevo usuario (solo disponible para administradores en la UI).
 * @param {{ name, email, password, role }} datos
 */
export const registrarAPI = (datos) =>
  peticion('/auth/register', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

/**
 * Crear usuario desde panel administrador. Permite asignar rol.
 * @param {{ name, email, password, role }} datos
 */
export const registrarAdminAPI = (datos) =>
  peticion('/auth/register-admin', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

/**
 * Cerrar sesión. El servidor limpia la cookie httpOnly.
 */
export const logoutAPI = () =>
  peticion('/auth/logout', { method: 'POST' });

/**
 * Obtener el perfil del usuario autenticado actualmente.
 * @returns {{ success, user: { id, name, email, role, createdAt } }}
 */
export const obtenerPerfilAPI = () =>
  peticion('/auth/profile');

/**
 * Actualizar nombre y/o contraseña del usuario autenticado.
 * @param {{ name?: string, password?: string }} datos
 */
export const actualizarPerfilAPI = (datos) =>
  peticion('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });

/**
 * Solicitar recuperacion de contrasena por email.
 * El backend envia el correo con el enlace de restablecimiento.
 * @param {string} email
 */
export const recuperarContrasenaAPI = (email) =>
  peticion('/auth/recover', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

/* ============================================================
   ASISTENCIA Y REPORTES — integracion disponible para futuras vistas
   ============================================================ */

export const registrarEntradaAPI = (datos = {}) =>
  peticion('/attendance/checkin', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

export const registrarSalidaAPI = (datos = {}) =>
  peticion('/attendance/checkout', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });

export const obtenerAsistenciaPorFechaAPI = (date) =>
  peticion(`/attendance/date/${date}`);

export const obtenerMiAsistenciaAPI = () =>
  peticion('/attendance/me');

export const obtenerAsistenciaEmpleadoAPI = (employeeId) =>
  peticion(`/attendance/${employeeId}`);

export const obtenerEmpleadosAPI = () =>
  peticion('/empleados');

export const obtenerReporteAsistenciaMensualAPI = ({ month, year }) =>
  peticion(`/reports/attendance/monthly?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}`);

export const obtenerReporteHeadcountAPI = () =>
  peticion('/reports/headcount');

export const obtenerResumenEmpleadoAPI = (employeeId) =>
  peticion(`/reports/employee/${employeeId}/summary`);

/* ============================================================
   DEPARTAMENTOS — mapeados al recurso /categories del backend
   Modelo: { _id, name, description, createdAt }
   ============================================================ */

/** Listar todos los departamentos */
export const obtenerDepartamentosAPI = () =>
  peticion('/categories');

/** Obtener un departamento por ID */
export const obtenerDepartamentoPorIdAPI = (id) =>
  peticion(`/categories/${id}`);

/**
 * Crear un departamento.
 * @param {{ name: string, description?: string }} datos
 */
export const crearDepartamentoAPI = (datos) =>
  peticion('/categories', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

/**
 * Actualizar un departamento existente.
 * @param {string} id
 * @param {{ name?: string, description?: string }} datos
 */
export const actualizarDepartamentoAPI = (id, datos) =>
  peticion(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });

/** Eliminar un departamento por ID */
export const eliminarDepartamentoAPI = (id) =>
  peticion(`/categories/${id}`, { method: 'DELETE' });

/* ============================================================
   POSICIONES — mapeadas al recurso /products del backend
   Modelo: { _id, name, description, price (salario), categoryId (depto), createdAt }
   La respuesta incluye categoryId populado: { _id, name, description }
   ============================================================ */

/** Listar todas las posiciones con su departamento populado */
export const obtenerPosicionesAPI = () =>
  peticion('/products');

/** Obtener una posición por ID */
export const obtenerPosicionPorIdAPI = (id) =>
  peticion(`/products/${id}`);

/**
 * Crear una nueva posición/cargo.
 * @param {{ name: string, description?: string, price: number, categoryId: string }} datos
 */
export const crearPosicionAPI = (datos) =>
  peticion('/products', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

/**
 * Actualizar una posición existente.
 * @param {string} id
 * @param {{ name?, description?, price?, categoryId? }} datos
 */
export const actualizarPosicionAPI = (id, datos) =>
  peticion(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });

/** Eliminar una posición por ID */
export const eliminarPosicionAPI = (id) =>
  peticion(`/products/${id}`, { method: 'DELETE' });
