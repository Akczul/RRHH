// Página: Mi Perfil
// Muestra la información personal y métricas del empleado autenticado

import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { employees, attendance } from '../data/mockData';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import './MyProfile.css';

const HOY = '2026-03-10';
const MES_ACTUAL = HOY.slice(0, 7); // '2026-03'

export default function MyProfile() {
  const { usuario } = useAuth();

  // Obtener datos del empleado autenticado
  const empleado = useMemo(
    () => employees.find((e) => e.id === usuario?.empleadoId),
    [usuario]
  );

  // Registros del mes actual para este empleado
  const registrosMes = useMemo(() => {
    if (!empleado) return [];
    return attendance.filter(
      (r) => r.empleadoId === empleado.id && r.fecha.startsWith(MES_ACTUAL)
    );
  }, [empleado]);

  // Métricas del mes
  const metricas = useMemo(() => {
    const presente = registrosMes.filter((r) => r.estado === 'presente').length;
    const tardio   = registrosMes.filter((r) => r.estado === 'tardio').length;
    const ausente  = registrosMes.filter((r) => r.estado === 'ausente').length;
    const total    = registrosMes.length;
    const pct      = total > 0 ? Math.round(((presente + tardio) / total) * 100) : 0;
    return { presente, tardio, ausente, total, pct };
  }, [registrosMes]);

  if (!empleado) {
    return (
      <div className="perfil-page">
        <p className="text-muted">No se encontraron datos del empleado.</p>
      </div>
    );
  }

  return (
    <div className="perfil-page">

      {/* ─── Tarjeta principal de perfil ─── */}
      <div className="card perfil-card">
        <div className="perfil-hero">
          <Avatar iniciales={empleado.iniciales} color={empleado.colorAvatar} size="lg" />
          <div className="perfil-hero-info">
            <h2 className="perfil-nombre">{empleado.nombre} {empleado.apellido}</h2>
            <p className="perfil-cargo">{empleado.cargo}</p>
            <Badge
              texto={empleado.estado === 'activo' ? 'Activo' : 'Inactivo'}
              color={empleado.estado === 'activo' ? 'green' : 'gray'}
            />
          </div>
        </div>

        {/* Datos personales en cuadrícula */}
        <div className="perfil-datos">
          <div className="perfil-dato">
            <span className="perfil-dato-label">Departamento</span>
            <span className="perfil-dato-valor">{empleado.departamento}</span>
          </div>
          <div className="perfil-dato">
            <span className="perfil-dato-label">Correo electrónico</span>
            <span className="perfil-dato-valor">{empleado.email}</span>
          </div>
          <div className="perfil-dato">
            <span className="perfil-dato-label">Teléfono</span>
            <span className="perfil-dato-valor">{empleado.telefono}</span>
          </div>
          <div className="perfil-dato">
            <span className="perfil-dato-label">Fecha de ingreso</span>
            <span className="perfil-dato-valor">
              {new Date(empleado.fechaIngreso + 'T00:00:00').toLocaleDateString('es-ES', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
          <div className="perfil-dato">
            <span className="perfil-dato-label">Salario mensual</span>
            <span className="perfil-dato-valor perfil-salario">
              ${empleado.salario.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="perfil-dato">
            <span className="perfil-dato-label">ID de empleado</span>
            <span className="perfil-dato-valor">EMP-{String(empleado.id).padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      {/* ─── Métricas de asistencia del mes ─── */}
      <div className="perfil-section">
        <h3 className="perfil-section-titulo">Asistencia — Marzo 2026</h3>
        <div className="perfil-metricas">
          <div className="perfil-metrica perfil-metrica-green">
            <span className="perfil-metrica-valor">{metricas.presente}</span>
            <span className="perfil-metrica-label">Días presentes</span>
          </div>
          <div className="perfil-metrica perfil-metrica-orange">
            <span className="perfil-metrica-valor">{metricas.tardio}</span>
            <span className="perfil-metrica-label">Tardanzas</span>
          </div>
          <div className="perfil-metrica perfil-metrica-red">
            <span className="perfil-metrica-valor">{metricas.ausente}</span>
            <span className="perfil-metrica-label">Ausencias</span>
          </div>
          <div className="perfil-metrica perfil-metrica-blue">
            <span className="perfil-metrica-valor">{metricas.pct}%</span>
            <span className="perfil-metrica-label">Puntualidad</span>
          </div>
        </div>

        {/* Barra de progreso de puntualidad */}
        <div className="perfil-puntualidad">
          <div className="perfil-puntualidad-header">
            <span className="perfil-puntualidad-label">Índice de puntualidad</span>
            <span className="perfil-puntualidad-pct">{metricas.pct}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${metricas.pct}%`,
                background: metricas.pct >= 90
                  ? 'var(--accent2)'
                  : metricas.pct >= 70
                  ? 'var(--accent3)'
                  : 'var(--danger)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── Registros recientes de asistencia ─── */}
      <div className="perfil-section">
        <h3 className="perfil-section-titulo">Registros recientes</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Día</th>
                <th>Hora entrada</th>
                <th>Hora salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {registrosMes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Sin registros este mes
                  </td>
                </tr>
              ) : (
                [...registrosMes]
                  .sort((a, b) => b.fecha.localeCompare(a.fecha))
                  .slice(0, 15)
                  .map((r) => {
                    const fecha   = new Date(r.fecha + 'T00:00:00');
                    const diaNombre = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
                    const diaFormato = fecha.toLocaleDateString('es-ES', {
                      day: '2-digit', month: 'short',
                    });
                    return (
                      <tr key={r.id}>
                        <td>{diaFormato}</td>
                        <td style={{ textTransform: 'capitalize' }}>{diaNombre}</td>
                        <td>{r.horaEntrada || '—'}</td>
                        <td>{r.horaSalida  || '—'}</td>
                        <td>
                          <Badge
                            texto={
                              r.estado === 'presente'
                                ? 'Presente'
                                : r.estado === 'tardio'
                                ? 'Tardío'
                                : 'Ausente'
                            }
                            color={
                              r.estado === 'presente'
                                ? 'green'
                                : r.estado === 'tardio'
                                ? 'orange'
                                : 'red'
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
