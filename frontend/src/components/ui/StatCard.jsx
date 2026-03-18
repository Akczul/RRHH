/**
 * StatCard.jsx — Tarjeta de estadistica/metrica para el Dashboard.
 *
 * Props:
 *   icono    ReactNode|string — icono o emoji del indicador
 *   valor    string|number    — valor principal de la metrica
 *   etiqueta string           — descripcion del indicador
 *   color    'blue'|'green'|'orange'|'red'|'purple'
 */
import './StatCard.css';

export default function StatCard({ icono, valor, etiqueta, color = 'blue' }) {
  return (
    /* La clase de color controla el esquema de colores de la tarjeta */
    <div className={`stat-card stat-card--${color}`}>

      {/* ── Fila superior: icono + valor ── */}
      <div className="stat-card__top">
        {/* Icono del indicador con fondo suave */}
        <div className="stat-card__icon-wrap">
          <span className="stat-card__icon">{icono}</span>
        </div>

        {/* Valor numerico principal */}
        <span className="stat-card__value">{valor}</span>
      </div>

      {/* ── Etiqueta descriptiva del indicador ── */}
      <p className="stat-card__label">{etiqueta}</p>

      {/* Linea de acento en la parte inferior de la tarjeta */}
      <div className="stat-card__accent-line" />
    </div>
  );
}