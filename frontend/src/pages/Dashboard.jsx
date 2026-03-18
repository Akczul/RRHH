/**
 * Dashboard.jsx — Panel principal del administrador.
 *
 * Obtiene datos reales del backend:
 *  - Total de departamentos (GET /api/categories)
 *  - Total de posiciones    (GET /api/products)
 *  - Perfil del usuario     (GET /api/auth/profile)
 *
 * Muestra:
 *  - Tarjetas de metricas (StatCard)
 *  - Tabla con las 5 posiciones mas recientes
 *  - Lista de departamentos con conteo de posiciones
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerDepartamentosAPI, obtenerPosicionesAPI } from '../services/api';
import StatCard from '../components/ui/StatCard';
import Badge    from '../components/ui/Badge';
import './Dashboard.css';

/* ── Formatear precio como moneda ── */
const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  useAuth(); /* contexto disponible para futuras expansiones */

  /* ── Estado de datos del backend ── */
  const [departamentos, setDepartamentos] = useState([]);
  const [posiciones,    setPosiciones]    = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [error,         setError]         = useState('');

  /* ── Cargar datos al montar el componente ── */
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        /* Hacer ambas peticiones en paralelo para mayor eficiencia */
        const [resDepts, resPos] = await Promise.all([
          obtenerDepartamentosAPI(),
          obtenerPosicionesAPI(),
        ]);
        setDepartamentos(resDepts.categories || []);
        setPosiciones(resPos.products || []);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  /* ── Calculos derivados ── */
  /* Salario promedio de todas las posiciones */
  const salarioPromedio = posiciones.length
    ? posiciones.reduce((acc, p) => acc + (p.price || 0), 0) / posiciones.length
    : 0;

  /* Posicion con mayor salario */
  const posicionTopSalario = posiciones.length
    ? posiciones.reduce((max, p) => p.price > max.price ? p : max, posiciones[0])
    : null;

  /* Ultimas 5 posiciones creadas para la tabla reciente */
  const recientes = [...posiciones].slice(0, 5);

  /* ── Construir datos para la lista de departamentos ── */
  const deptosConConteo = departamentos.map(dep => ({
    ...dep,
    /* Contar cuantas posiciones pertenecen a este departamento */
    totalPosiciones: posiciones.filter(
      p => p.categoryId?._id === dep._id || p.categoryId === dep._id
    ).length,
  }));

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

      {/* ── Mensaje de error ── */}
      {error && <div className="alert alert--error" style={{ marginBottom: 20 }}>{error}</div>}

      {/* ── Tarjetas de estadisticas ── */}
      <div className="dash__stats">
        <StatCard
          icono="🏢"
          valor={departamentos.length}
          etiqueta="Departamentos activos"
          color="blue"
        />
        <StatCard
          icono="💼"
          valor={posiciones.length}
          etiqueta="Posiciones registradas"
          color="green"
        />
        <StatCard
          icono="💰"
          valor={fmt(salarioPromedio)}
          etiqueta="Salario promedio"
          color="orange"
        />
        <StatCard
          icono="⭐"
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
            <h3 className="card__title">Posiciones Recientes</h3>
            <Link to="/posiciones" className="card__action">Ver todas</Link>
          </div>

          {posiciones.length === 0 ? (
            /* Estado vacio cuando no hay posiciones */
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
                      {/* Nombre de la posicion */}
                      <td>
                        <span className="table__primary">{pos.name}</span>
                        {pos.description && (
                          <span className="table__secondary">{pos.description.slice(0, 40)}...</span>
                        )}
                      </td>
                      {/* Departamento al que pertenece */}
                      <td>
                        <Badge texto={pos.categoryId?.name || 'Sin depto'} tipo="blue" />
                      </td>
                      {/* Salario formateado */}
                      <td className="table__mono">{fmt(pos.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Columna derecha: lista de departamentos con conteo */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Departamentos</h3>
            <Link to="/departamentos" className="card__action">Gestionar</Link>
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
                  {/* Nombre e indicador de posiciones */}
                  <div className="dash__dept-info">
                    <span className="dash__dept-name">{dep.name}</span>
                    {dep.description && (
                      <span className="dash__dept-desc">{dep.description}</span>
                    )}
                  </div>
                  {/* Conteo de posiciones en este departamento */}
                  <Badge
                    texto={`${dep.totalPosiciones} pos.`}
                    tipo={dep.totalPosiciones > 0 ? 'green' : 'gray'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}