/* =============================================
   Badge.jsx — Componente de etiqueta de estado
   Variantes: green, blue, orange, red, gray
   ============================================= */

import './Badge.css';

/**
 * Badge — Píldora de estado con color
 * @param {string} texto - Texto a mostrar
 * @param {string} tipo - 'green' | 'blue' | 'orange' | 'red' | 'gray'
 */
export default function Badge({ texto, tipo = 'gray' }) {
  return (
    <span className={`badge badge-${tipo}`}>
      {texto}
    </span>
  );
}
