/* ============================================================
   Reports.jsx — Modulo de Reportes (Administrador)
   Sin soporte en el backend actualmente.
   ============================================================ */
import './Placeholder.css';

export default function Reports() {
  return (
    <div className="placeholder-page">

      {/* Encabezado */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Reportes</h1>
          <p className="page-header__desc">Analisis y estadisticas de la organizacion</p>
        </div>
      </div>

      {/* Vista en desarrollo */}
      <div className="placeholder-card">
        <div className="placeholder-card__icon">📊</div>
        <h2 className="placeholder-card__title">Modulo en desarrollo</h2>
        <p className="placeholder-card__desc">
          El modulo de reportes y analisis esta siendo construido.
          Podras visualizar metricas clave de recursos humanos con graficas interactivas.
        </p>
        <span className="placeholder-card__badge">Proximamente</span>

        {/* Funcionalidades planeadas */}
        <div className="placeholder-features">
          <span className="placeholder-feature">Rotacion de personal</span>
          <span className="placeholder-feature">Distribucion por departamento</span>
          <span className="placeholder-feature">Analisis salarial</span>
          <span className="placeholder-feature">Exportar a PDF / Excel</span>
        </div>
      </div>
    </div>
  );
}