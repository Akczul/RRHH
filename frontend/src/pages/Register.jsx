import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarAPI, registrarAdminAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Alert  from '../components/ui/Alert';
import './Register.css';

/* ── Icono ojo para contrasena ── */
const IcoEye    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

/* ================================================================
   Pagina: Registrar Usuario
   Solo accesible para el rol 'admin'.
   Llama a POST /api/auth/register con { name, email, password, role }.
   ================================================================ */
export default function Register() {
  const navigate = useNavigate();
  const { esAdmin, estaAutenticado } = useAuth();
  const puedeAsignarRol = estaAutenticado && esAdmin();

  /* ── Estado del formulario ── */
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', rol: 'employee' });
  const [verPass, setVerPass]   = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error,    setError]    = useState('');
  const [exito,    setExito]    = useState('');

  const cambiar = e => {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  /* ── Envio del formulario al backend ── */
  const enviar = async e => {
    e.preventDefault();
    setError('');
    setExito('');

    /* Validacion local de contrasenas coincidentes */
    if (form.password !== form.confirmar) {
      setError('Las contrasenas no coinciden. Verificalas e intenta de nuevo.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const datos = puedeAsignarRol
        ? await registrarAdminAPI({
            name: form.nombre.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.rol
          })
        : await registrarAPI({
            name: form.nombre.trim(),
            email: form.email.trim(),
            password: form.password
          });
      /* Mostrar nombre del usuario creado en el mensaje de exito */
      setExito(`Usuario "${datos.user?.name ?? form.nombre}" creado correctamente.`);
      /* Limpiar formulario para permitir crear otro */
      setForm({ nombre: '', email: '', password: '', confirmar: '', rol: 'employee' });
    } catch (err) {
      setError(err.message || 'Error al crear el usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Registrar usuario</h1>
          <p className="page-header__desc">Crear una nueva cuenta de acceso al sistema</p>
        </div>
      </div>

      {/* ── Tarjeta del formulario ── */}
      <div className="registro__card card">

        {/* Alertas de resultado */}
        {exito && (
          <Alert tipo="success" onCerrar={() => setExito('')} className="registro__alert">
            {exito}
          </Alert>
        )}
        {error && (
          <Alert tipo="error" onCerrar={() => setError('')} className="registro__alert">
            {error}
          </Alert>
        )}

        <form className="registro__form" onSubmit={enviar} noValidate>

          {/* Nombre completo */}
          <div className="field">
            <label className="field__label" htmlFor="rg-nombre">Nombre completo *</label>
            <input id="rg-nombre" name="nombre" className="field__input"
              placeholder="Ej. Maria Gonzalez" value={form.nombre}
              onChange={cambiar} required autoFocus />
          </div>

          {/* Email */}
          <div className="field">
            <label className="field__label" htmlFor="rg-email">Correo electronico *</label>
            <input id="rg-email" name="email" type="email" className="field__input"
              placeholder="usuario@empresa.com" value={form.email}
              onChange={cambiar} required />
          </div>

          {/* Fila: contrasena + confirmacion */}
          <div className="registro__row">
            <div className="field">
              <label className="field__label" htmlFor="rg-pass">Contrasena *</label>
              <div className="field__input-wrap">
                <input id="rg-pass" name="password"
                  type={verPass ? 'text' : 'password'}
                  className="field__input"
                  placeholder="Min. 6 caracteres"
                  value={form.password} onChange={cambiar} required />
                <button type="button" className="field__eye" onClick={() => setVerPass(v => !v)} tabIndex={-1}>
                  {verPass ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="rg-confirm">Confirmar contrasena *</label>
              <div className="field__input-wrap">
                <input id="rg-confirm" name="confirmar"
                  type={verPass ? 'text' : 'password'}
                  className="field__input"
                  placeholder="Repite la contrasena"
                  value={form.confirmar} onChange={cambiar} required />
              </div>
            </div>
          </div>

          {puedeAsignarRol ? (
            <div className="field">
              <label className="field__label" htmlFor="rg-rol">Rol en el sistema *</label>
              <select id="rg-rol" name="rol" className="field__input field__select"
                value={form.rol} onChange={cambiar}>
                <option value="employee">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
              <span className="field__hint">
                Solo un administrador autenticado puede crear cuentas admin.
              </span>
            </div>
          ) : (
            <div className="field">
              <span className="field__hint">
                El registro publico crea una cuenta de empleado. Las cuentas admin se crean desde el panel interno.
              </span>
            </div>
          )}

          {/* Acciones */}
          <div className="registro__footer">
            <Button type="button" variante="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" variante="primary" cargando={cargando}>
              Crear usuario
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
