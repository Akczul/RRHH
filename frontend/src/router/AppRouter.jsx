/**
 * AppRouter.jsx — Enrutador principal de CorpHR.
 *
 * Define todas las rutas de la aplicacion con proteccion por rol:
 *   - Rutas publicas   : Login, Recuperar contrasena
 *   - Rutas admin      : Dashboard, Posiciones, Departamentos, Asistencia, Reportes
 *   - Rutas empleado   : Mi Perfil, Mi Asistencia
 *
 * Guardias de ruta:
 *   PrivateRoute  — requiere estar autenticado
 *   AdminRoute    — requiere rol 'admin'
 *   EmployeeRoute — requiere rol 'employee'
 *   PublicRoute   — redirige al dashboard si ya esta autenticado
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/* Componentes de layout */
import Layout from '../components/layout/Layout';

/* Paginas publicas */
import Login           from '../pages/Login';
import RecoverPassword from '../pages/RecoverPassword';

/* Paginas del administrador */
import Dashboard   from '../pages/Dashboard';
import Employees   from '../pages/Employees';     /* Posiciones/Cargos → /api/products */
import Departments from '../pages/Departments';   /* Departamentos     → /api/categories */
import Attendance  from '../pages/Attendance';
import Reports     from '../pages/Reports';
import Register    from '../pages/Register';       /* Registro de usuarios → /api/auth/register */

/* Paginas del empleado */
import MyProfile    from '../pages/MyProfile';
import MyAttendance from '../pages/MyAttendance';

/* ── Guardias de ruta ── */

/** Ruta privada: solo usuarios autenticados */
function PrivateRoute({ children }) {
  const { estaAutenticado, cargando } = useAuth();
  if (cargando) return null;  /* Esperar a que se resuelva la sesion */
  return estaAutenticado ? children : <Navigate to="/login" replace />;
}

/** Ruta de administrador: solo rol 'admin' */
function AdminRoute({ children }) {
  const { esAdmin, estaAutenticado, cargando } = useAuth();
  if (cargando) return null;
  if (!estaAutenticado) return <Navigate to="/login" replace />;
  return esAdmin() ? children : <Navigate to="/mi-perfil" replace />;
}

/** Ruta de empleado: rol 'employee' (admin tambien puede verlas) */
function EmployeeRoute({ children }) {
  const { estaAutenticado, cargando } = useAuth();
  if (cargando) return null;
  return estaAutenticado ? children : <Navigate to="/login" replace />;
}

/** Ruta publica: si ya esta autenticado redirige segun rol */
function PublicRoute({ children }) {
  const { estaAutenticado, esAdmin, cargando } = useAuth();
  if (cargando) return null;
  if (estaAutenticado) {
    return <Navigate to={esAdmin() ? '/dashboard' : '/mi-perfil'} replace />;
  }
  return children;
}

/* ── Componente principal del router ── */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Rutas publicas (sin layout) ── */}
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/recuperar-contrasena" element={
          <PublicRoute><RecoverPassword /></PublicRoute>
        } />

        {/* ── Rutas protegidas (con layout sidebar + topbar) ── */}
        <Route path="/" element={
          <PrivateRoute><Layout /></PrivateRoute>
        }>

          {/* Redireccion raiz segun rol */}
          <Route index element={<RedirectPorRol />} />

          {/* Rutas exclusivas del administrador */}
          <Route path="dashboard" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="posiciones" element={
            <AdminRoute><Employees /></AdminRoute>
          } />
          <Route path="departamentos" element={
            <AdminRoute><Departments /></AdminRoute>
          } />
          <Route path="asistencia" element={
            <AdminRoute><Attendance /></AdminRoute>
          } />
          <Route path="reportes" element={
            <AdminRoute><Reports /></AdminRoute>
          } />
          <Route path="registro" element={
            <AdminRoute><Register /></AdminRoute>
          } />

          {/* Rutas del empleado (cualquier usuario autenticado) */}
          <Route path="mi-perfil" element={
            <EmployeeRoute><MyProfile /></EmployeeRoute>
          } />
          <Route path="mi-asistencia" element={
            <EmployeeRoute><MyAttendance /></EmployeeRoute>
          } />
        </Route>

        {/* Ruta 404 — redirigir al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

/** Redirige al inicio correcto segun el rol del usuario */
function RedirectPorRol() {
  const { esAdmin } = useAuth();
  return <Navigate to={esAdmin() ? '/dashboard' : '/mi-perfil'} replace />;
}