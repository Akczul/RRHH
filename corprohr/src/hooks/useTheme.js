/* =============================================
   useTheme.js — Hook personalizado para ThemeContext
   Simplifica el acceso al contexto de tema
   ============================================= */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export function useTheme() {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return contexto;
}
