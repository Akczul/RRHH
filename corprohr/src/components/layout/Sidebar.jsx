/* =============================================
   Sidebar.jsx — Barra lateral de navegación
   Navegación principal para admin y empleado
   ============================================= */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

/* Rutas de navegación para administrador */
const navAdmin = [
  { path: '/dashboard', icono: '⬛', label: 'Dashboard' },
  { path: '/empleados', icono: '👥', label: 'Empleados' },
  { path: '/asistencia', icono: '📋', label: 'Asistencia' },
  { path: '/departamentos', icono: '🏢', label: 'Departamentos' },
  { path: '/reportes', icono: '📊', label: 'Reportes' },
];

/* Rutas de navegación para empleado */
const navEmpleado = [
  { path: '/mi-perfil', icono: '👤', label: 'Mi Perfil' },
  { path: '/mi-asistencia', icono: '📅', label: 'Mi Asistencia' },
];

/**
 * Sidebar — Panel lateral de navegación
 * @param {boolean} collapsed - Si el sidebar está contraído
 * @param {function} onToggle - Para expandir/contraer desde móvil
 */
export default function Sidebar({ collapsed, onToggle }) {
  const { usuario, logout, isAdmin } = useAuth();
  const navItems = isAdmin() ? navAdmin : navEmpleado;

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo y nombre de la app */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <span>C</span>
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-nombre">CorpHR</span>
            <span className="logo-slogan">Recursos Humanos</span>
          </div>
        )}
      </div>

      {/* Rol del usuario */}
      {!collapsed && (
        <div className="sidebar-rol">
          <span className="rol-badge">
            {isAdmin() ? '🛡️ Administrador' : '👤 Empleado'}
          </span>
        </div>
      )}

      {/* Separador */}
      <div className="sidebar-sep" />

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="nav-icono">{item.icono}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Separador parte inferior */}
      <div className="sidebar-sep sidebar-sep-bottom" />

      {/* Botón de cerrar sesión */}
      <button
        className="sidebar-logout"
        onClick={logout}
        title="Cerrar sesión"
      >
        <span className="nav-icono logout-icono">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            width="18" height="18">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </span>
        {!collapsed && <span className="logout-label">Cerrar sesión</span>}
      </button>
    </aside>
  );
}
