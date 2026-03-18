/**
 * AuthContext.jsx — Contexto global de autenticacion de CorpHR.
 *
 * Gestiona el estado del usuario autenticado, conectandose
 * exclusivamente al backend real (POST /api/auth/login).
 * El usuario se persiste en sessionStorage para sobrevivir
 * recargas de pagina dentro de la misma sesion del navegador.
 */
import { createContext, useState, useEffect, useCallback } from 'react';
import { loginAPI, logoutAPI, obtenerPerfilAPI } from '../services/api';

/* Crear el contexto que compartira el estado de auth en toda la app */
export const AuthContext = createContext(null);

/**
 * AuthProvider — Proveedor del contexto de autenticacion.
 * Envuelve la aplicacion completa desde App.jsx.
 */
export function AuthProvider({ children }) {

  /* Estado del usuario autenticado; null = no autenticado */
  const [usuario, setUsuario] = useState(null);

  /* Indica si se esta verificando la sesion existente al cargar */
  const [cargando, setCargando] = useState(true);

  /* ── Verificar sesion persistida al montar la app ── */
  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem('corphr-user');
    if (usuarioGuardado) {
      try {
        /* Restaurar usuario del sessionStorage si la sesion sigue viva */
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        /* Si el JSON es invalido, limpiar el storage */
        sessionStorage.removeItem('corphr-user');
      }
    }
    setCargando(false);
  }, []);

  /* ── Iniciar sesion ── */
  const login = useCallback(async (email, password) => {
    /* Llamar al endpoint real del backend */
    const datos = await loginAPI(email, password);

    if (datos.success && datos.user) {
      /* Guardar usuario en estado y persistirlo en sessionStorage */
      setUsuario(datos.user);
      sessionStorage.setItem('corphr-user', JSON.stringify(datos.user));
      return datos.user;
    }

    /* Si el backend responde success:false, lanzar error */
    throw new Error(datos.message || 'Credenciales invalidas');
  }, []);

  /* ── Cerrar sesion ── */
  const logout = useCallback(async () => {
    try {
      /* Notificar al backend para que borre la cookie httpOnly */
      await logoutAPI();
    } catch {
      /* Si el backend falla, igual cerramos sesion en el frontend */
    } finally {
      setUsuario(null);
      sessionStorage.removeItem('corphr-user');
    }
  }, []);

  /* ── Refrescar perfil desde el backend ── */
  const refrescarPerfil = useCallback(async () => {
    try {
      const datos = await obtenerPerfilAPI();
      if (datos.success && datos.user) {
        setUsuario(datos.user);
        sessionStorage.setItem('corphr-user', JSON.stringify(datos.user));
      }
    } catch {
      /* Si el token expiro, cerrar sesion automaticamente */
      setUsuario(null);
      sessionStorage.removeItem('corphr-user');
    }
  }, []);

  /* ── Helpers de roles ── */
  const esAdmin    = useCallback(() => usuario?.role === 'admin',    [usuario]);
  const esEmpleado = useCallback(() => usuario?.role === 'employee', [usuario]);

  /* Valor expuesto por el contexto */
  const valor = {
    usuario,
    cargando,
    login,
    logout,
    refrescarPerfil,
    esAdmin,
    esEmpleado,
    estaAutenticado: !!usuario,
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}