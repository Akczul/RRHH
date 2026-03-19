/* ============================================================
   RecoverPassword.jsx — Pagina de recuperacion de contrasena
   ============================================================ */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recuperarContrasenaAPI } from '../services/api';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import './RecoverPassword.css';

/* ── Icono de sobre ── */
const IcoMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

/* ── Icono de flecha izquierda ── */
const IcoArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError('');
    setEnviando(true);

    try {
      const respuesta = await recuperarContrasenaAPI(email.trim());
      if (respuesta?.success) {
        setEnviado(true);
      } else {
        throw new Error('No se pudo enviar la solicitud de recuperacion.');
      }
    } catch (err) {
      setError(err.message || 'Error al enviar instrucciones de recuperacion.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="recover-page">
      <div className="recover-brand">
        <div className="recover-brand__logo">
          <span className="recover-brand__dot" />
          CorpHR
        </div>
        <div className="recover-brand__body">
          <h1 className="recover-brand__title">Recupera el acceso<br />a tu cuenta.</h1>
          <p className="recover-brand__sub">Te enviaremos instrucciones para restablecer tu contrasena de forma segura.</p>
        </div>
        <div className="recover-brand__circle recover-brand__circle--1" />
        <div className="recover-brand__circle recover-brand__circle--2" />
      </div>

      <div className="recover-form-panel">
        <div className="recover-form-wrap">
          <Link to="/login" className="recover-back">
            <IcoArrowLeft /> Volver al inicio de sesion
          </Link>

          <div className="recover-icon">
            <IcoMail />
          </div>

          <h2 className="recover-title">Olvide mi contrasena</h2>
          <p className="recover-desc">
            Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena.
          </p>

          {enviado ? (
            <div className="recover-success">
              <div className="recover-success__icon">✅</div>
              <h3 className="recover-success__title">Correo enviado</h3>
              <p className="recover-success__desc">
                Si <strong>{email}</strong> esta registrado, recibiras las instrucciones en breve.
                Revisa tu carpeta de spam si no encuentras el correo.
              </p>
              <Link to="/login" className="recover-login-link">
                Regresar al inicio de sesion
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <Alert tipo="error" onCerrar={() => setError('')}>
                  {error}
                </Alert>
              )}

              <form className="recover-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="field__label" htmlFor="rec-email">Correo electronico</label>
                  <input
                    id="rec-email"
                    type="email"
                    className="field__input"
                    placeholder="tucorreo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" variante="primary" fullWidth cargando={enviando}>
                  Enviar instrucciones
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
