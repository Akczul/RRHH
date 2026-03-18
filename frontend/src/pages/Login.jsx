/**
 * Login.jsx — Pagina de inicio de sesion de CorpHR.
 *
 * Funcionalidad:
 *  - Formulario con email y contrasena
 *  - Autenticacion via POST /api/auth/login (backend real)
 *  - Mostrar/ocultar contrasena
 *  - Mensajes de error del servidor
 *  - Redireccion segun rol tras el login exitoso
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Alert  from '../components/ui/Alert';
import './Login.css';

/* Icono de ojo para mostrar/ocultar contrasena */
const IcoEye     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoEyeOff  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

export default function Login() {
  const { login, esAdmin } = useAuth();
  const navigate = useNavigate();

  /* ── Estado del formulario ── */
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [verPass,    setVerPass]    = useState(false);   /* Toggle mostrar/ocultar */
  const [cargando,   setCargando]   = useState(false);
  const [error,      setError]      = useState('');

  /* ── Manejar el envio del formulario ── */
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      /* Llamar al login del contexto (que llama al backend) */
      const usuario = await login(email.trim(), password);

      /* Redirigir segun el rol obtenido del servidor */
      navigate(
        usuario.role === 'admin' ? '/dashboard' : '/mi-perfil',
        { replace: true }
      );
    } catch (err) {
      /* Mostrar el mensaje de error devuelto por el backend */
      setError(err.message || 'Error al iniciar sesion');
    } finally {
      setCargando(false);
    }
  };

  return (
    /* Contenedor de pantalla completa centrado */
    <div className="login-screen">

      {/* Panel de branding (lado izquierdo en pantallas grandes) */}
      <div className="login-brand">
        <div className="login-brand__logo">CH</div>
        <h1 className="login-brand__name">CorpHR</h1>
        <p className="login-brand__tagline">
          Gestion inteligente de recursos humanos.
        </p>

        {/* Decoracion de puntos de fondo */}
        <div className="login-brand__deco" aria-hidden="true" />
      </div>

      {/* Panel del formulario (lado derecho) */}
      <div className="login-panel">
        <div className="login-card">

          {/* ── Encabezado del formulario ── */}
          <div className="login-card__header">
            <h2 className="login-card__title">Bienvenido</h2>
            <p className="login-card__sub">Ingresa tus credenciales de acceso</p>
          </div>

          {/* ── Mensaje de error del servidor ── */}
          {error && (
            <Alert tipo="error" onCerrar={() => setError('')} className="login-card__alert">
              {error}
            </Alert>
          )}

          {/* ── Formulario de autenticacion ── */}
          <form className="login-form" onSubmit={manejarEnvio} noValidate>

            {/* Campo de correo electronico */}
            <div className="field">
              <label htmlFor="email" className="field__label">Correo electronico</label>
              <input
                id="email"
                type="email"
                className="field__input"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                autoFocus
              />
            </div>

            {/* Campo de contrasena con toggle de visibilidad */}
            <div className="field">
              <div className="field__label-row">
                <label htmlFor="password" className="field__label">Contraseña</label>
                {/* Enlace a la pagina de recuperacion */}
                <Link to="/recuperar-contrasena" className="field__link">
                  Olvidé mi contraseña
                </Link>
              </div>

              {/* Envoltorio posicion relativa para el icono de ojo */}
              <div className="field__input-wrap">
                <input
                  id="password"
                  type={verPass ? 'text' : 'password'}
                  className="field__input"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                {/* Boton para mostrar u ocultar la contrasena */}
                <button
                  type="button"
                  className="field__eye"
                  onClick={() => setVerPass(v => !v)}
                  aria-label={verPass ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {verPass ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div>
            </div>

            {/* Boton de envio del formulario */}
            <Button
              type="submit"
              variante="primary"
              size="lg"
              fullWidth
              cargando={cargando}
            >
              {cargando ? 'Verificando...' : 'Iniciar Sesion'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}