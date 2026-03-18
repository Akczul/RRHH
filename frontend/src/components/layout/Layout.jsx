/**
 * Layout.jsx — Shell principal de la aplicacion autenticada.
 *
 * Compone el Sidebar fijo, la Topbar fija y el area de contenido
 * donde React Router renderiza la pagina activa via <Outlet />.
 */
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import './Layout.css';

export default function Layout() {
  return (
    /* Contenedor raiz del shell de la aplicacion */
    <div className="layout">

      {/* Barra lateral fija con la navegacion */}
      <Sidebar />

      {/* Columna principal: topbar + contenido de la pagina */}
      <div className="layout__main">

        {/* Barra superior fija con el titulo y controles */}
        <Topbar />

        {/* Area de contenido desplazable — aqui se renderiza cada pagina */}
        <main className="layout__content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}