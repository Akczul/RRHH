/* =============================================
   AuthContext.jsx — Contexto de autenticación
   Guarda el usuario actual con rol y empleadoId
   Funciones: login, logout, isAdmin
   ============================================= */

import { createContext, useState } from 'react';

// Crear el contexto
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Estado del usuario: null = no autenticado
  const [usuario, setUsuario] = useState(() => {
    // Recuperar sesión guardada en sessionStorage
    const sesionGuardada = sessionStorage.getItem('corprohr-user');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  /**
   * Iniciar sesión simulada
   * @param {string} rol - 'admin' o 'empleado'
   * @param {number|null} empleadoId - ID del empleado (solo para rol empleado)
   */
  const login = (rol, empleadoId = null) => {
    const nuevoUsuario = { rol, empleadoId };
    setUsuario(nuevoUsuario);
    // Guardar en sessionStorage para persistir durante la sesión del navegador
    sessionStorage.setItem('corprohr-user', JSON.stringify(nuevoUsuario));
  };

  // Cerrar sesión: limpiar estado y sessionStorage
  const logout = () => {
    setUsuario(null);
    sessionStorage.removeItem('corprohr-user');
  };

  // Verificar si el usuario actual tiene rol de administrador
  const isAdmin = () => usuario?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
