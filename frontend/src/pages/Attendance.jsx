/* ============================================================
   Attendance.jsx — Modulo de Asistencia (Administrador)
   Este modulo aun no cuenta con soporte en el backend.
   Se muestra una vista de "en desarrollo".
   ============================================================ */
import './Placeholder.css';

export default function Attendance() {
  return (
    <div className="placeholder-page">

      {/* Encabezado de la pagina */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Asistencia</h1>
          <p className="page-header__desc">Control y registro de asistencia del personal</p>
        </div>
      </div>

      {/* Contenido placeholder */}
      <div className="placeholder-card">
        <div className="placeholder-card__icon">📋</div>
        <h2 className="placeholder-card__title">Modulo en desarrollo</h2>
        <p className="placeholder-card__desc">
          El modulo de control de asistencia esta siendo construido.
          Proximamente podras registrar entradas, salidas y gestionar permisos del personal.
        </p>
        <span className="placeholder-card__badge">Proximamente</span>

        {/* Funcionalidades planificadas */}
        <div className="placeholder-features">
          <span className="placeholder-feature">Registro de entrada y salida</span>
          <span className="placeholder-feature">Control de tardanzas</span>
          <span className="placeholder-feature">Gestion de permisos</span>
          <span className="placeholder-feature">Reportes de asistencia</span>
        </div>
      </div>
    </div>
  );
}