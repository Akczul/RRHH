// ============================================================
// ThemeContext.jsx — Contexto de tema oscuro/claro
// ============================================================
import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Leer preferencia guardada en localStorage (o usar oscuro por defecto)
  const [isDark, setIsDark] = useState(() => {
    const guardado = localStorage.getItem('corphr-theme');
    return guardado !== null ? guardado === 'dark' : true;
  });

  // Cada vez que cambie isDark, actualiza el atributo en <html> y guarda en localStorage
  useEffect(() => {
    const tema = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('corphr-theme', tema);
  }, [isDark]);

  // Alterna entre oscuro y claro
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
