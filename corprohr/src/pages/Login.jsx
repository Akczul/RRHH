/* =============================================
   Login.jsx — Página de inicio de sesión
   Selector de rol, campos de acceso y toggle de tema
   ============================================= */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { credenciales } from '../data/mockData';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado del formulario
  const [rolSeleccionado, setRolSeleccionado] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  /* Manejar envío del formulario */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    // Simular retardo de autenticación
    setTimeout(() => {
      // Buscar credenciales que coincidan con el rol seleccionado
      const matchCredencial = credenciales.find(
        c => c.email === email && c.password === password && c.rol === rolSeleccionado
      );

      if (matchCredencial) {
        // Login exitoso: guardar en contexto y navegar
        login(matchCredencial.rol, matchCredencial.empleadoId);
        navigate(matchCredencial.rol === 'admin' ? '/dashboard' : '/mi-perfil');
      } else {
        setError('Correo o contraseña incorrectos. Inténtalo de nuevo.');
      }

      setCargando(false);
    }, 600);
  };

  return (
    <div className="login-page">
      {/* Toggle de tema en esquina superior derecha */}
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      {/* Tarjeta central del login */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <span>C</span>
          </div>
          <div className="login-logo-text">
            <span className="login-logo-nombre">CorpHR</span>
            <span className="login-logo-slogan">Sistema de Recursos Humanos</span>
          </div>
        </div>

        {/* Título */}
        <div className="login-header">
          <h1 className="login-titulo">Bienvenido</h1>
          <p className="login-subtitulo">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Selector de rol con pestañas */}
        <div className="login-rol-tabs">
          <button
            type="button"
            className={`login-rol-tab ${rolSeleccionado === 'admin' ? 'active' : ''}`}
            onClick={() => { setRolSeleccionado('admin'); setError(''); }}
          >
             Administrador
          </button>
          <button
            type="button"
            className={`login-rol-tab ${rolSeleccionado === 'empleado' ? 'active' : ''}`}
            onClick={() => { setRolSeleccionado('empleado'); setError(''); }}
          >
             Empleado
          </button>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo correo */}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder={
                rolSeleccionado === 'admin'
                  ? 'admin@corphr.com'
                  : 'empleado@corphr.com'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Campo contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarPassword(prev => !prev)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          {/* Botón de login */}
          <Button
            type="submit"
            variante="primary"
            fullWidth
            disabled={cargando}
          >
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Enlace a recuperar contraseña */}
        <div className="login-footer">
          <Link to="/recuperar-contrasena">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
