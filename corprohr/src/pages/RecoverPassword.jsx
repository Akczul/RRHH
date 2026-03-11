/* =============================================
   RecoverPassword.jsx — Página de recuperación de contraseña
   Barra de progreso de 2 pasos con confirmación
   ============================================= */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';
import './RecoverPassword.css';

export default function RecoverPassword() {
  // Control del paso actual (1 o 2)
  const [paso, setPaso] = useState(1);

  // Estado del formulario del paso 1
  const [correo, setCorreo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  /* Manejar envío del paso 1 */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validación básica del correo
    if (!correo.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setEnviando(true);
    // Simular envío con retardo
    setTimeout(() => {
      setEnviando(false);
      setPaso(2); // Avanzar al paso de confirmación
    }, 800);
  };

  return (
    <div className="recover-page">
      {/* Toggle de tema */}
      <div className="recover-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="recover-card">
        {/* Logo */}
        <div className="recover-logo">
          <div className="recover-logo-icon">
            <span>C</span>
          </div>
          <span className="recover-logo-nombre">CorpHR</span>
        </div>

        {/* Barra de progreso de 2 pasos */}
        <div className="progress-steps">
          {/* Paso 1 */}
          <div className={`step ${paso >= 1 ? 'step-active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Solicitud</span>
          </div>

          {/* Línea conectora */}
          <div className={`step-line ${paso === 2 ? 'step-line-done' : ''}`} />

          {/* Paso 2 */}
          <div className={`step ${paso === 2 ? 'step-active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Confirmación</span>
          </div>
        </div>

        {/* ─── PASO 1: Formulario ─── */}
        {paso === 1 && (
          <div className="recover-body">
            <h1 className="recover-titulo">Recuperar contraseña</h1>
            <p className="recover-subtitulo">
              Ingresa tu correo corporativo y el área de soporte se comunicará contigo.
            </p>

            <form className="recover-form" onSubmit={handleSubmit}>
              {/* Campo correo */}
              <div className="form-group">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  id="correo"
                  type="email"
                  placeholder="tucorreo@corphr.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>

              {/* Campo motivo (opcional) */}
              <div className="form-group">
                <label htmlFor="motivo">
                  Motivo de la solicitud{' '}
                  <span className="campo-opcional">(opcional)</span>
                </label>
                <textarea
                  id="motivo"
                  placeholder="Ej: Olvidé mi contraseña, no tengo acceso..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Aviso informativo */}
              <div className="recover-aviso">
                <span className="aviso-icono">ℹ️</span>
                <p>
                  El equipo de soporte responderá a tu solicitud en un plazo máximo de{' '}
                  <strong>24 horas hábiles</strong>.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="login-error">⚠️ {error}</div>
              )}

              {/* Botón de enviar */}
              <Button
                type="submit"
                variante="primary"
                fullWidth
                disabled={enviando}
              >
                {enviando ? 'Enviando solicitud...' : 'Enviar solicitud'}
              </Button>
            </form>
          </div>
        )}

        {/* ─── PASO 2: Confirmación ─── */}
        {paso === 2 && (
          <div className="recover-body">
            <div className="confirm-icono">✅</div>
            <h1 className="recover-titulo">¡Solicitud enviada!</h1>
            <p className="recover-subtitulo">
              Hemos recibido tu solicitud de recuperación de contraseña para:
            </p>

            <div className="confirm-correo">
              {correo}
            </div>

            <p className="recover-info">
              El equipo de soporte revisará tu caso y se pondrá en contacto contigo
              en un plazo máximo de <strong>24 horas hábiles</strong>.
              Revisa también tu carpeta de spam.
            </p>

            <Link to="/login">
              <Button variante="primary" fullWidth>
                ← Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        )}

        {/* Enlace de volver (solo en paso 1) */}
        {paso === 1 && (
          <div className="recover-footer">
            <Link to="/login">← Volver al inicio de sesión</Link>
          </div>
        )}
      </div>
    </div>
  );
}
