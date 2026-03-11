/* =============================================
   ThemeToggle.jsx — Switch de tema oscuro/claro
   Con emojis de luna y sol, animación deslizante
   ============================================= */

import { useTheme } from '../../hooks/useTheme';
import './ThemeToggle.css';

/**
 * ThemeToggle — Switch deslizante para cambiar tema
 * Usa el ThemeContext a través del hook useTheme
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {/* Ícono de luna (modo oscuro) */}
      <span className="toggle-icon">🌙</span>

      {/* Pista del switch */}
      <div className="toggle-track">
        <div className="toggle-thumb" />
      </div>

      {/* Ícono de sol (modo claro) */}
      <span className="toggle-icon">☀️</span>
    </button>
  );
}
