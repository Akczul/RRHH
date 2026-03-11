/* =============================================
   ThemeContext.jsx — Contexto de tema oscuro/claro
   Guarda la preferencia en localStorage y aplica
   las variables CSS directamente al elemento <html>
   ============================================= */

import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Leer preferencia guardada en localStorage (por defecto: oscuro)
  const [isDark, setIsDark] = useState(() => {
    const guardado = localStorage.getItem('corprohr-theme');
    return guardado !== null ? guardado === 'dark' : true;
  });

  // Aplicar clase CSS al elemento <html> cada vez que cambia el tema
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('light');
    } else {
      html.classList.add('light');
    }
    // Guardar en localStorage
    localStorage.setItem('corprohr-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Función para alternar entre temas
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
