/**
 * Home.jsx — Landing page pública de CorpHR.
 *
 * Presenta la plataforma con:
 *  - Hero principal con CTA (Administrador / Empleado)
 *  - Métricas destacadas
 *  - Sección de módulos / características
 *  - Sección "Para quién es"
 *  - Footer
 */
import { Link } from 'react-router-dom';
import './Home.css';

/* ── Iconos SVG ── */
const IcoUsers     = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoBuilding  = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 9h1m-1 4h1m4-4h1m-1 4h1"/></svg>;
const IcoClock     = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoChart     = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoShield    = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoBriefcase = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IcoArrow     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoCheck     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Datos estáticos ── */
const ADMIN_FEATURES = [
  'Panel de control con métricas en tiempo real',
  'Crear y gestionar empleados y cargos',
  'Administrar la estructura de departamentos',
  'Registrar y consultar asistencia del personal',
  'Generar reportes organizacionales',
  'Crear cuentas de acceso para empleados',
];

const EMP_FEATURES = [
  'Consultar su perfil y datos personales',
  'Ver su historial de asistencia',
  'Actualizar su información de contacto',
  'Acceso seguro con credenciales propias',
];

const MODULOS = [
  {
    icono: <IcoUsers />,
    color: 'accent',
    titulo: 'Gestión de Empleados',
    desc: 'Administra los cargos y posiciones de tu organización. Asigna roles, salarios y departamentos desde un solo lugar.',
  },
  {
    icono: <IcoBuilding />,
    color: 'purple',
    titulo: 'Departamentos',
    desc: 'Organiza la estructura interna de tu empresa creando y gestionando departamentos con sus respectivas descripciones.',
  },
  {
    icono: <IcoClock />,
    color: 'success',
    titulo: 'Control de Asistencia',
    desc: 'Registra entradas, salidas y ausencias del personal. Próximamente disponible con reportes detallados.',
  },
  {
    icono: <IcoChart />,
    color: 'warning',
    titulo: 'Reportes y Analítica',
    desc: 'Visualiza métricas clave: distribución salarial, rotación de personal y estadísticas por departamento.',
  },
  {
    icono: <IcoShield />,
    color: 'danger',
    titulo: 'Control de Acceso por Rol',
    desc: 'Dos niveles de acceso: Administrador con control total y Empleado con vista de su perfil y asistencia.',
  },
  {
    icono: <IcoBriefcase />,
    color: 'info',
    titulo: 'Gestión de Posiciones',
    desc: 'Define los cargos disponibles en la empresa, su descripción, salario mensual y departamento asociado.',
  },
];

export default function Home() {
  return (
    <div className="home">

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <nav className="home-nav">
        <div className="home-nav__brand">
          <div className="home-nav__logo">CH</div>
          <span className="home-nav__name">CorpHR</span>
        </div>
        <div className="home-nav__actions">
          <Link to="/login" className="home-nav__link">Iniciar sesión</Link>
        </div>
      </nav>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="home-hero">
        {/* Fondo decorativo */}
        <div className="home-hero__bg" aria-hidden="true">
          <div className="home-hero__orb home-hero__orb--1" />
          <div className="home-hero__orb home-hero__orb--2" />
          <div className="home-hero__grid" />
        </div>

        <div className="home-hero__content">

          <h1 className="home-hero__title">
            Gestiona tu equipo con
            <span className="home-hero__title-accent"> inteligencia</span>
          </h1>

          <p className="home-hero__sub">
            CorpHR centraliza la administración de tu capital humano: empleados, departamentos,
            asistencia y reportes en una plataforma moderna, segura y fácil de usar.
          </p>

          {/* CTAs por rol */}
          <div className="home-hero__ctas">
            <Link to="/login?rol=admin" className="home-cta home-cta--admin">
              <div className="home-cta__icon">
                <IcoShield />
              </div>
              <div className="home-cta__body">
                <span className="home-cta__label">Acceso Administrador</span>
                <span className="home-cta__desc">Panel de control completo</span>
              </div>
              <IcoArrow />
            </Link>

            <Link to="/login?rol=empleado" className="home-cta home-cta--emp">
              <div className="home-cta__icon">
                <IcoUsers />
              </div>
              <div className="home-cta__body">
                <span className="home-cta__label">Acceso Empleado</span>
                <span className="home-cta__desc">Mi perfil y asistencia</span>
              </div>
              <IcoArrow />
            </Link>
          </div>
        </div>

        {/* Panel visual derecho */}
        <div className="home-hero__visual">
          <div className="home-hero__mockup">
            <div className="home-mock__bar">
              <span /><span /><span />
            </div>
            <div className="home-mock__sidebar">
              {['Dashboard','Posiciones','Departamentos','Asistencia','Reportes','Configuración'].map(item => (
                <div key={item} className={`home-mock__item ${item === 'Dashboard' ? 'home-mock__item--active' : ''}`}>
                  <div className="home-mock__item-dot" />
                  {item}
                </div>
              ))}
            </div>
            <div className="home-mock__content">
              <div className="home-mock__stat-row">
                {['Empleados','Departamentos','Posiciones'].map(s => (
                  <div key={s} className="home-mock__stat">
                    <div className="home-mock__stat-val skeleton-anim" />
                    <div className="home-mock__stat-lbl">{s}</div>
                  </div>
                ))}
              </div>
              <div className="home-mock__table-head" />
              {[1,2,3].map(i => (
                <div key={i} className="home-mock__table-row">
                  <div className="home-mock__table-cell home-mock__table-cell--w40" />
                  <div className="home-mock__table-cell home-mock__table-cell--w25" />
                  <div className="home-mock__table-cell home-mock__table-cell--w20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MÓDULOS
      ══════════════════════════════════ */}
      <section className="home-section">
        <div className="home-section__head">
          <h2 className="home-section__title">Todo lo que necesitas en un solo lugar</h2>
          <p className="home-section__sub">Módulos diseñados para cubrir cada aspecto de la gestión del talento humano.</p>
        </div>
        <div className="home-modules">
          {MODULOS.map(({ icono, color, titulo, desc }) => (
            <div key={titulo} className={`home-module home-module--${color}`}>
              <div className="home-module__icon">{icono}</div>
              <h3 className="home-module__title">{titulo}</h3>
              <p className="home-module__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          PARA QUIÉN ES
      ══════════════════════════════════ */}
      <section className="home-section home-section--alt">
        <div className="home-section__head">
          <h2 className="home-section__title">Dos niveles de acceso, una sola plataforma</h2>
          <p className="home-section__sub">Accesos diferenciados según el rol, con permisos configurados desde el inicio.</p>
        </div>
        <div className="home-roles">
          <div className="home-role home-role--admin">
            <div className="home-role__header">
              <div className="home-role__icon"><IcoShield /></div>
              <div>
                <h3 className="home-role__title">Administrador</h3>
                <p className="home-role__sub">Control total del sistema</p>
              </div>
            </div>
            <ul className="home-role__list">
              {ADMIN_FEATURES.map(f => (
                <li key={f} className="home-role__item">
                  <span className="home-role__check"><IcoCheck /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="home-role home-role--emp">
            <div className="home-role__header">
              <div className="home-role__icon"><IcoUsers /></div>
              <div>
                <h3 className="home-role__title">Empleado</h3>
                <p className="home-role__sub">Tu espacio personal de RRHH</p>
              </div>
            </div>
            <ul className="home-role__list">
              {EMP_FEATURES.map(f => (
                <li key={f} className="home-role__item">
                  <span className="home-role__check"><IcoCheck /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer className="home-footer">
        <div className="home-footer__brand">
          <div className="home-nav__logo home-footer__logo">CH</div>
          <span className="home-footer__name">CorpHR</span>
        </div>
        <p className="home-footer__copy">
          © {new Date().getFullYear()} CorpHR — Sistema de Gestión de Recursos Humanos.
        </p>
      </footer>

    </div>
  );
}
