/* =============================================
   useAuth.js — Hook personalizado para AuthContext
   Simplifica el acceso al contexto de autenticación
   ============================================= */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return contexto;
}
