/* =============================================
   Topbar.jsx — Barra superior de la aplicación
   Muestra el título de la página, avatar y toggle
   ============================================= */

import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { employees } from '../../data/mockData';
import ThemeToggle from '../ui/ThemeToggle';
import Avatar from '../ui/Avatar';
import './Topbar.css';

/* Mapeo de rutas a títulos descriptivos */
const tituloPagina = {
  '/dashboard': 'Dashboard',
  '/empleados': 'Empleados',
  '/asistencia': 'Asistencia',
  '/departamentos': 'Departamentos',
  '/reportes': 'Reportes',
  '/mi-perfil': 'Mi Perfil',
  '/mi-asistencia': 'Mi Asistencia',
};

/**
 * Topbar — Barra superior con título y acciones de usuario
 * @param {boolean} sidebarCollapsed - Estado del sidebar
 * @param {function} onToggleSidebar - Para contraer/expandir sidebar
 */
export default function Topbar({ sidebarCollapsed, onToggleSidebar }) {
  const location = useLocation();
  const { usuario } = useAuth();

  // Obtener título de la página actual
  const titulo = tituloPagina[location.pathname] || 'CorpHR';

  // Obtener datos del empleado si el usuario tiene rol empleado
  const empleado = usuario?.empleadoId
    ? employees.find(e => e.id === usuario.empleadoId)
    : null;

  // Datos para mostrar en el avatar
  const nombreUsuario = empleado
    ? `${empleado.nombre} ${empleado.apellido}`
    : 'Administrador';
  const iniciales = empleado
    ? empleado.iniciales
    : 'AD';
  const colorAvatar = empleado?.colorAvatar || 'linear-gradient(135deg, #4f8ef7, #a78bfa)';

  return (
    <header className="topbar">
      {/* Botón para contraer/expandir sidebar */}
      <button
        className="topbar-toggle"
        onClick={onToggleSidebar}
        aria-label="Alternar sidebar"
      >
        {sidebarCollapsed ? '▶' : '◀'}
      </button>

      {/* Título de la página */}
      <h2 className="topbar-titulo">{titulo}</h2>

      {/* Acciones del lado derecho */}
      <div className="topbar-acciones">
        {/* Toggle de tema */}
        <ThemeToggle />

        {/* Divisor */}
        <div className="topbar-divider" />

        {/* Info del usuario */}
        <div className="topbar-usuario">
          <div className="usuario-info">
            <span className="usuario-nombre">{nombreUsuario}</span>
            <span className="usuario-rol">
              {usuario?.rol === 'admin' ? 'Administrador' : 'Empleado'}
            </span>
          </div>
          <Avatar
            iniciales={iniciales}
            color={colorAvatar}
            size="sm"
          />
        </div>
      </div>
    </header>
  );
}
