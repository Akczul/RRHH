/* =============================================
   Dashboard.jsx — Panel principal del administrador
   Métricas, gráfico de asistencia y tabla reciente
   ============================================= */

import { useMemo } from 'react';
import { employees, departments, attendance, asistenciaMensual } from '../data/mockData';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import './Dashboard.css';

/* Fecha de hoy para filtrar asistencia */
const HOY = '2026-03-10';

export default function Dashboard() {
  /* ─── Calcular métricas del día ─── */
  const metricas = useMemo(() => {
    const asistenciaHoy = attendance.filter(a => a.fecha === HOY);
    const totalActivos = employees.filter(e => e.estado === 'activo').length;

    return {
      totalEmpleados: employees.length,
      presentes: asistenciaHoy.filter(a => a.estado === 'presente').length,
      tardios: asistenciaHoy.filter(a => a.estado === 'tardio').length,
      ausentes: asistenciaHoy.filter(a => a.estado === 'ausente').length,
      totalActivos,
    };
  }, []);

  /* ─── Calcular distribución por departamento ─── */
  const totalEmpleadosTodos = departments.reduce((sum, d) => sum + d.totalEmpleados, 0);

  /* ─── Últimos 5 empleados registrados ─── */
  const empleadosRecientes = useMemo(() => {
    return [...employees]
      .sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso))
      .slice(0, 5);
  }, []);

  /* ─── Valor máximo del gráfico de barras ─── */
  const maxValor = Math.max(...asistenciaMensual.map(m => m.presentes));

  return (
    <div className="dashboard">
      {/* ─── Título ─── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen del sistema — Hoy, 10 de Marzo 2026</p>
        </div>
      </div>

      {/* ─── Tarjetas de métricas ─── */}
      <div className="stats-grid">
        <StatCard
          icono="👥"
          valor={metricas.totalEmpleados}
          etiqueta="Total empleados"
          cambio={`${metricas.totalActivos} activos actualmente`}
          color="blue"
        />
        <StatCard
          icono="✅"
          valor={metricas.presentes}
          etiqueta="Presentes hoy"
          cambio={`De ${metricas.totalActivos} activos`}
          color="green"
        />
        <StatCard
          icono="⏰"
          valor={metricas.tardios}
          etiqueta="Tardanzas hoy"
          cambio="Llegaron después de las 09:00"
          color="orange"
        />
        <StatCard
          icono="❌"
          valor={metricas.ausentes}
          etiqueta="Ausencias hoy"
          cambio="Sin registro de entrada"
          color="red"
        />
      </div>

      {/* ─── Sección inferior: gráfico + tabla ─── */}
      <div className="dashboard-grid">

        {/* Gráfico de asistencia mensual (barras CSS) */}
        <div className="card dashboard-chart">
          <div className="card-header">
            <h3 className="card-titulo">Asistencia mensual</h3>
            <span className="card-sub">Últimos 6 meses</span>
          </div>

          <div className="bar-chart">
            {asistenciaMensual.map((mes) => (
              <div key={mes.mes} className="bar-group">
                {/* Barra de presentes */}
                <div className="bar-wrapper" title={`Presentes: ${mes.presentes}`}>
                  <div
                    className="bar bar-present"
                    style={{ height: `${(mes.presentes / maxValor) * 100}%` }}
                  />
                </div>
                {/* Barra de tardíos */}
                <div className="bar-wrapper" title={`Tardíos: ${mes.tardios}`}>
                  <div
                    className="bar bar-late"
                    style={{ height: `${(mes.tardios / maxValor) * 100}%` }}
                  />
                </div>
                {/* Barra de ausentes */}
                <div className="bar-wrapper" title={`Ausentes: ${mes.ausentes}`}>
                  <div
                    className="bar bar-absent"
                    style={{ height: `${(mes.ausentes / maxValor) * 100}%` }}
                  />
                </div>
                {/* Etiqueta del mes */}
                <span className="bar-label">{mes.mes}</span>
              </div>
            ))}
          </div>

          {/* Leyenda del gráfico */}
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot dot-present" />Presentes</span>
            <span className="legend-item"><span className="legend-dot dot-late" />Tardíos</span>
            <span className="legend-item"><span className="legend-dot dot-absent" />Ausentes</span>
          </div>
        </div>

        {/* Distribución por departamento */}
        <div className="card dashboard-departamentos">
          <div className="card-header">
            <h3 className="card-titulo">Por departamento</h3>
            <span className="card-sub">Distribución de empleados</span>
          </div>

          <div className="dept-list">
            {departments.map(dept => {
              const porcentaje = Math.round((dept.totalEmpleados / totalEmpleadosTodos) * 100);
              return (
                <div key={dept.id} className="dept-item">
                  <div className="dept-info">
                    <span
                      className="dept-dot"
                      style={{ background: dept.color }}
                    />
                    <div>
                      <p className="dept-nombre">{dept.nombre}</p>
                      <p className="dept-jefe">{dept.totalEmpleados} empleados</p>
                    </div>
                    <span className="dept-pct">{porcentaje}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${porcentaje}%`, background: dept.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Tabla de empleados recientes ─── */}
      <div className="card dashboard-tabla">
        <div className="card-header">
          <h3 className="card-titulo">Empleados recientes</h3>
          <span className="card-sub">Últimos incorporados</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Departamento</th>
                <th>Cargo</th>
                <th>Fecha ingreso</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {empleadosRecientes.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-cell">
                      <Avatar iniciales={emp.iniciales} color={emp.colorAvatar} size="sm" />
                      <div>
                        <p className="emp-nombre">{emp.nombre} {emp.apellido}</p>
                        <p className="emp-email">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{emp.departamento}</td>
                  <td>{emp.cargo}</td>
                  <td>{new Date(emp.fechaIngreso + 'T00:00:00').toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}</td>
                  <td>
                    <Badge
                      texto={emp.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      tipo={emp.estado === 'activo' ? 'green' : 'gray'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
