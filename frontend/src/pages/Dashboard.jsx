/**
 * Dashboard.jsx — Panel principal del administrador.
 *
 * Obtiene datos reales del backend:
 *  - Total de departamentos (GET /api/categories)
 *  - Total de posiciones    (GET /api/products)
 *  - Perfil del usuario     (GET /api/auth/profile)
 *
 * Muestra:
 *  - Banner de bienvenida con nombre del usuario y fecha
 *  - Tarjetas de metricas (StatCard)
 *  - Tabla con las 5 posiciones mas recientes
 *  - Lista de departamentos con conteo + barra de proporcion
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCatalogStore } from '../stores/useCatalogStore';
import StatCard from '../components/ui/StatCard';
import Badge    from '../components/ui/Badge';
import './Dashboard.css';

/* ── Formatear precio como moneda ── */
const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

/* ── Formatear fecha larga ── */
const fmtFecha = () => new Intl.DateTimeFormat('es-CO', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}).format(new Date());

/* ── Iconos SVG inline ── */
const IcoBuilding  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1"/></svg>;
const IcoBriefcase = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 1 4 0"/></svg>;
const IcoSalary    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IcoStar      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

export default function Dashboard() {
  const { usuario } = useAuth();
  const {
    departments: departamentos,
    positions: posiciones,
    loading: cargando,
    error,
    fetchCatalogs
  } = useCatalogStore();
  const [errorLocal, setErrorLocal] = useState('');

  /* ── Cargar datos al montar el componente ── */
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await fetchCatalogs();
      } catch (err) {
        setErrorLocal(err.message || 'Error al cargar los datos');
      }
    };
    cargarDatos();
  }, [fetchCatalogs]);

  /* ── Calculos derivados ── */
  const salarioPromedio = posiciones.length
    ? posiciones.reduce((acc, p) => acc + (p.price || 0), 0) / posiciones.length
    : 0;

  const posicionTopSalario = posiciones.length
    ? posiciones.reduce((max, p) => p.price > max.price ? p : max, posiciones[0])
    : null;

  const recientes = [...posiciones].slice(0, 5);

  const deptosConConteo = departamentos.map(dep => ({
    ...dep,
    totalPosiciones: posiciones.filter(
      p => p.categoryId?._id === dep._id || p.categoryId === dep._id
    ).length,
  }));

  /* Maximo de posiciones por departamento (para calcular barras de proporcion) */
  const maxPosiciones = Math.max(...deptosConConteo.map(d => d.totalPosiciones), 1);

  /* Obtener primer nombre del usuario */
  const primerNombre = usuario?.name?.split(' ')[0] || 'Administrador';

  /* Mostrar skeleton mientras cargan los datos */
  if (cargando) {
    return (
      <div className="dash fade-in">
        <div className="dash__stats">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--radio-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dash fade-in">

      {/* ── Banner de bienvenida ── */}
      <div className="dash__welcome">
        <div className="dash__welcome-left">
          <p className="dash__welcome-caption">Panel de control</p>
          <h2 className="dash__welcome-title">Bienvenido, {primerNombre} 👋</h2>
          <p className="dash__welcome-date">{fmtFecha()}</p>
        </div>
        <div className="dash__welcome-meta">
          <span className="dash__welcome-badge">
            <span className="dash__welcome-dot" />
            Sistema activo
          </span>
        </div>
      </div>

      {/* ── Mensaje de error ── */}
      {(error || errorLocal) && <div className="alert alert--error" style={{ marginBottom: 20 }}>{error || errorLocal}</div>}

      {/* ── Tarjetas de estadisticas ── */}
      <div className="dash__stats">
        <StatCard
          icono={<IcoBuilding />}
          valor={departamentos.length}
          etiqueta="Departamentos activos"
          color="blue"
        />
        <StatCard
          icono={<IcoBriefcase />}
          valor={posiciones.length}
          etiqueta="Posiciones registradas"
          color="green"
        />
        <StatCard
          icono={<IcoSalary />}
          valor={fmt(salarioPromedio)}
          etiqueta="Salario promedio"
          color="orange"
        />
        <StatCard
          icono={<IcoStar />}
          valor={posicionTopSalario?.name || '—'}
          etiqueta="Posicion mejor remunerada"
          color="purple"
        />
      </div>

      {/* ── Layout de dos columnas ── */}
      <div className="dash__cols">

        {/* Columna izquierda: tabla de posiciones recientes */}
        <div className="card">
          <div className="card__header">
            <div className="card__header-left">
              <h3 className="card__title">Posiciones Recientes</h3>
              <span className="card__count">{posiciones.length} registros</span>
            </div>
            <Link to="/app/posiciones" className="card__action">Ver todas →</Link>
          </div>

          {posiciones.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">💼</div>
              <p className="empty-state__title">Sin posiciones</p>
              <p className="empty-state__desc">Agrega posiciones desde la seccion Posiciones</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Posicion</th>
                    <th>Departamento</th>
                    <th>Salario</th>
                  </tr>
                </thead>
                <tbody>
                  {recientes.map(pos => (
                    <tr key={pos._id}>
                      <td>
                        <span className="table__primary">{pos.name}</span>
                        {pos.description && (
                          <span className="table__secondary">{pos.description.slice(0, 40)}...</span>
                        )}
                      </td>
                      <td>
                        <Badge texto={pos.categoryId?.name || 'Sin depto'} tipo="blue" />
                      </td>
                      <td className="table__mono">{fmt(pos.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Columna derecha: lista de departamentos con barra de proporcion */}
        <div className="card">
          <div className="card__header">
            <div className="card__header-left">
              <h3 className="card__title">Departamentos</h3>
              <span className="card__count">{departamentos.length} activos</span>
            </div>
            <Link to="/app/departamentos" className="card__action">Gestionar →</Link>
          </div>

          {departamentos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🏢</div>
              <p className="empty-state__title">Sin departamentos</p>
              <p className="empty-state__desc">Crea departamentos desde la seccion correspondiente</p>
            </div>
          ) : (
            <div className="dash__dept-list">
              {deptosConConteo.map(dep => (
                <div key={dep._id} className="dash__dept-item">
                  <div className="dash__dept-info">
                    <div className="dash__dept-row">
                      <span className="dash__dept-name">{dep.name}</span>
                      <span className="dash__dept-count">{dep.totalPosiciones} pos.</span>
                    </div>
                    {/* Barra de proporcion visual */}
                    <div className="dash__dept-bar-track">
                      <div
                        className="dash__dept-bar-fill"
                        style={{ width: `${(dep.totalPosiciones / maxPosiciones) * 100}%` }}
                      />
                    </div>
                    {dep.description && (
                      <span className="dash__dept-desc">{dep.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
