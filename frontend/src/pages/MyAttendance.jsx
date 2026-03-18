/* ============================================================
   MyAttendance.jsx — Mi Asistencia (Empleado)
   Sin soporte en el backend actualmente.
   ============================================================ */
import './Placeholder.css';

export default function MyAttendance() {
  return (
    <div className="placeholder-page">

      {/* Encabezado */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Mi Asistencia</h1>
          <p className="page-header__desc">Historial y estado de tu asistencia</p>
        </div>
      </div>

      {/* Vista en desarrollo */}
      <div className="placeholder-card">
        <div className="placeholder-card__icon">🕐</div>
        <h2 className="placeholder-card__title">Modulo en desarrollo</h2>
        <p className="placeholder-card__desc">
          Pronto podras consultar tu historial de asistencia, registrar
          tus horas de trabajo y gestionar tus solicitudes de permiso.
        </p>
        <span className="placeholder-card__badge">Proximamente</span>

        {/* Funcionalidades planeadas */}
        <div className="placeholder-features">
          <span className="placeholder-feature">Historial de asistencia</span>
          <span className="placeholder-feature">Solicitud de permisos</span>
          <span className="placeholder-feature">Calendario de ausencias</span>
          <span className="placeholder-feature">Horas trabajadas</span>
        </div>
      </div>
    </div>
  );
}