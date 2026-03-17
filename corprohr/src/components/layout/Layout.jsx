/* =============================================
   Layout.jsx — Estructura principal de la app
   Combina Sidebar + Topbar + área de contenido
   ============================================= */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

/**
 * Layout — Envuelve todas las páginas privadas
 * Gestiona el estado de colapso del sidebar
 */
export default function Layout() {
  // Estado de contracción del sidebar
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  return (
    <div className={`layout ${collapsed ? 'layout-collapsed' : ''}`}>
      {/* Barra lateral */}
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      {/* Área principal: topbar + contenido */}
      <main className="layout-main">
        {/* Barra superior */}
        <Topbar
          sidebarCollapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />

        {/* Contenido de la página (renderizado por React Router) */}
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
