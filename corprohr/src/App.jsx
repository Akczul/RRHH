/* =============================================
   App.jsx — Componente raíz de la aplicación
   Envuelve todos los proveedores de contexto
   ============================================= */

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';

import './styles/globals.css';

/**
 * App — Punto de entrada de la aplicación
 * Orden: ThemeProvider > AuthProvider > AppRouter
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
