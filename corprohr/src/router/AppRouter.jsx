/* =============================================
   AppRouter.jsx — Router principal de la aplicación
   Rutas públicas, privadas por admin y por empleado
   Usa React Router v6
   ============================================= */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/* Layout */
import Layout from '../components/layout/Layout';

/* Páginas públicas */
import Login from '../pages/Login';
import RecoverPassword from '../pages/RecoverPassword';

/* Páginas admin */
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import Attendance from '../pages/Attendance';
import Departments from '../pages/Departments';
import Reports from '../pages/Reports';

/* Páginas empleado */
import MyProfile from '../pages/MyProfile';
import MyAttendance from '../pages/MyAttendance';

/* ─── Guardia de ruta privada ─── */
/**
 * PrivateRoute — Redirige a /login si no hay sesión activa
 * @param {string} rolRequerido - 'admin' | 'empleado' | undefined (cualquiera)
 */
function PrivateRoute({ children, rolRequerido }) {
  const { usuario, isAdmin } = useAuth();

  // Sin sesión → ir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Admin intentando entrar a rutas de empleado → redirigir al dashboard
  if (rolRequerido === 'empleado' && isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Empleado intentando entrar a rutas de admin → redirigir a mi-perfil
  if (rolRequerido === 'admin' && !isAdmin()) {
    return <Navigate to="/mi-perfil" replace />;
  }

  return children;
}

/* ─── Redirigir raíz según rol ─── */
function RootRedirect() {
  const { usuario, isAdmin } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin() ? '/dashboard' : '/mi-perfil'} replace />;
}

/**
 * AppRouter — Componente raíz de enrutamiento
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ─── Rutas públicas ─── */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecoverPassword />} />

        {/* ─── Rutas privadas (con Layout) ─── */}
        <Route element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          {/* Solo admin */}
          <Route path="/dashboard" element={
            <PrivateRoute rolRequerido="admin">
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/empleados" element={
            <PrivateRoute rolRequerido="admin">
              <Employees />
            </PrivateRoute>
          } />
          <Route path="/asistencia" element={
            <PrivateRoute rolRequerido="admin">
              <Attendance />
            </PrivateRoute>
          } />
          <Route path="/departamentos" element={
            <PrivateRoute rolRequerido="admin">
              <Departments />
            </PrivateRoute>
          } />
          <Route path="/reportes" element={
            <PrivateRoute rolRequerido="admin">
              <Reports />
            </PrivateRoute>
          } />

          {/* Solo empleado */}
          <Route path="/mi-perfil" element={
            <PrivateRoute rolRequerido="empleado">
              <MyProfile />
            </PrivateRoute>
          } />
          <Route path="/mi-asistencia" element={
            <PrivateRoute rolRequerido="empleado">
              <MyAttendance />
            </PrivateRoute>
          } />
        </Route>

        {/* ─── Ruta raíz ─── */}
        <Route path="/" element={<RootRedirect />} />

        {/* ─── Ruta 404 ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
