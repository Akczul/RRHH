/**
 * useAuth.js — Hook de acceso al contexto de autenticacion.
 *
 * Uso:
 *   const { usuario, login, logout, esAdmin, estaAutenticado } = useAuth();
 *
 * Lanza un error si se usa fuera de AuthProvider.
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const contexto = useContext(AuthContext);

  /* Proteger contra uso incorrecto fuera del proveedor */
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }

  return contexto;
}