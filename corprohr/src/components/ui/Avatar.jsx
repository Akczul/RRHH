/* =============================================
   Avatar.jsx — Componente de avatar circular
   Muestra iniciales con fondo degradado
   ============================================= */

import './Avatar.css';

/**
 * Avatar — Círculo con iniciales y degradado
 * @param {string} iniciales - Iniciales del empleado (ej: "CM")
 * @param {string} color - Degradado CSS (ej: "linear-gradient(135deg, #4f8ef7, #a78bfa)")
 * @param {string} size - 'sm' | 'md' | 'lg' (por defecto 'md')
 */
export default function Avatar({ iniciales, color, size = 'md' }) {
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: color || 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}
    >
      <span className="avatar-iniciales">{iniciales}</span>
    </div>
  );
}
