/* =============================================
   StatCard.jsx — Tarjeta de métrica/estadística
   Muestra un ícono, valor, etiqueta y cambio
   ============================================= */

import './StatCard.css';

/**
 * StatCard — Tarjeta de estadística con línea de color superior
 * @param {string} icono - Emoji o carácter como ícono
 * @param {string|number} valor - Valor principal de la métrica
 * @param {string} etiqueta - Descripción de la métrica
 * @param {string} cambio - Texto de comparación (ej: "+5 este mes")
 * @param {string} color - 'blue' | 'green' | 'orange' | 'red'
 */
export default function StatCard({ icono, valor, etiqueta, cambio, color = 'blue' }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      {/* Línea de color en la parte superior */}
      <div className="stat-card-bar" />

      <div className="stat-card-body">
        {/* Ícono */}
        <div className={`stat-card-icon stat-icon-${color}`}>
          {icono}
        </div>

        <div className="stat-card-info">
          {/* Valor principal */}
          <span className="stat-card-valor">{valor}</span>
          {/* Etiqueta descriptiva */}
          <span className="stat-card-etiqueta">{etiqueta}</span>
        </div>
      </div>

      {/* Cambio comparativo (opcional) */}
      {cambio && (
        <div className="stat-card-cambio">
          {cambio}
        </div>
      )}
    </div>
  );
}
