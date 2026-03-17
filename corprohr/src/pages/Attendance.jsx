/* =============================================
   Attendance.jsx — Registro de asistencia (admin)
   Tres pestañas: Hoy, Historial y Calendario
   ============================================= */

import { useState, useMemo } from 'react';
import { attendance, employees } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import StatCard from '../components/ui/StatCard';
import './Attendance.css';

const HOY = '2026-03-10';

/* Función: obtener nombre del empleado por ID */
const getNombreEmpleado = (id) => {
  const emp = employees.find(e => e.id === id);
  return emp ? `${emp.nombre} ${emp.apellido}` : 'Desconocido';
};

/* Función: obtener empleado completo por ID */
const getEmpleado = (id) => employees.find(e => e.id === id);

/* Mapeo de estado a tipo de badge */
const badgeTipo = {
  presente: 'green',
  tardio: 'orange',
  ausente: 'red',
};

/* Mapeo de estado a texto legible */
const badgeTexto = {
  presente: 'Presente',
  tardio: 'Tardío',
  ausente: 'Ausente',
};

export default function Attendance() {
  const [tabActiva, setTabActiva] = useState('hoy');

  /* Filtros del historial */
  const [mesHistorial, setMesHistorial] = useState('2026-03');
  const [empHistorial, setEmpHistorial] = useState('todos');

  /* ─── Datos de hoy ─── */
  const asistenciaHoy = useMemo(
    () => attendance.filter(a => a.fecha === HOY),
    []
  );

  const metricasHoy = useMemo(() => ({
    presentes: asistenciaHoy.filter(a => a.estado === 'presente').length,
    tardios: asistenciaHoy.filter(a => a.estado === 'tardio').length,
    ausentes: asistenciaHoy.filter(a => a.estado === 'ausente').length,
    total: asistenciaHoy.length,
  }), [asistenciaHoy]);

  /* ─── Historial filtrado ─── */
  const historialFiltrado = useMemo(() => {
    return attendance.filter(a => {
      const coincideMes = a.fecha.startsWith(mesHistorial);
      const coincideEmp = empHistorial === 'todos' || a.empleadoId === parseInt(empHistorial);
      return coincideMes && coincideEmp;
    }).sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [mesHistorial, empHistorial]);

  /* ─── Datos del calendario (mes actual) ─── */
  const diasCalendario = useMemo(() => {
    const mes = new Date(2026, 2, 1); // Marzo 2026
    const diasEnMes = new Date(2026, 3, 0).getDate();
    const dias = [];

    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = `2026-03-${String(d).padStart(2, '0')}`;
      // Contar asistencias por estado para ese día
      const registrosDia = attendance.filter(a => a.fecha === fecha);
      const presentes = registrosDia.filter(a => a.estado === 'presente').length;
      const tardios = registrosDia.filter(a => a.estado === 'tardio').length;
      const ausentes = registrosDia.filter(a => a.estado === 'ausente').length;

      // Día laborable si hay registros
      const esLaboral = registrosDia.length > 0;
      const diaSemana = new Date(fecha + 'T00:00:00').getDay();
      const esFinde = diaSemana === 0 || diaSemana === 6;

      dias.push({ d, fecha, presentes, tardios, ausentes, esLaboral, esFinde });
    }

    // Offset para que el primer día caiga en el día correcto de la semana
    const primerDia = new Date(2026, 2, 1).getDay(); // 0=dom
    return { dias, primerDia };
  }, []);

  /* ─── Determinar color de celda del calendario ─── */
  const colorCelda = (dia) => {
    if (dia.esFinde || !dia.esLaboral) return '';
    if (dia.ausentes > dia.presentes + dia.tardios) return 'cal-red';
    if (dia.tardios > 0 && dia.presentes === 0) return 'cal-orange';
    if (dia.tardios > 0) return 'cal-orange-light';
    return 'cal-green';
  };

  return (
    <div className="attendance-page">
      {/* Cabecera */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Asistencia</h1>
          <p className="page-subtitle">Control de asistencia del personal</p>
        </div>

        {/* Pestañas */}
        <div className="tabs">
          <button
            className={`tab-btn ${tabActiva === 'hoy' ? 'active' : ''}`}
            onClick={() => setTabActiva('hoy')}
          >
            📅 Hoy
          </button>
          <button
            className={`tab-btn ${tabActiva === 'historial' ? 'active' : ''}`}
            onClick={() => setTabActiva('historial')}
          >
            📂 Historial
          </button>
          <button
            className={`tab-btn ${tabActiva === 'calendario' ? 'active' : ''}`}
            onClick={() => setTabActiva('calendario')}
          >
            🗓 Calendario
          </button>
        </div>
      </div>

      {/* ─── TAB: Registro de Hoy ─── */}
      {tabActiva === 'hoy' && (
        <div className="tab-content">
          {/* Métricas del día */}
          <div className="stats-grid">
            <StatCard icono="👥" valor={metricasHoy.total} etiqueta="Total registros" color="blue" />
            <StatCard icono="✅" valor={metricasHoy.presentes} etiqueta="Presentes" color="green" />
            <StatCard icono="⏰" valor={metricasHoy.tardios} etiqueta="Tardanzas" color="orange" />
            <StatCard icono="❌" valor={metricasHoy.ausentes} etiqueta="Ausentes" color="red" />
          </div>

          {/* Tabla de asistencia de hoy */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-titulo">Registro de hoy — {HOY}</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asistenciaHoy.map(reg => {
                    const emp = getEmpleado(reg.empleadoId);
                    return (
                      <tr key={reg.id}>
                        <td>
                          <div className="emp-cell">
                            <Avatar iniciales={emp?.iniciales} color={emp?.colorAvatar} size="sm" />
                            <div>
                              <p className="emp-nombre">{getNombreEmpleado(reg.empleadoId)}</p>
                              <p className="emp-email">{emp?.departamento}</p>
                            </div>
                          </div>
                        </td>
                        <td className={reg.entrada ? '' : 'sin-dato'}>
                          {reg.entrada || '—'}
                        </td>
                        <td className={reg.salida ? '' : 'sin-dato'}>
                          {reg.salida || '—'}
                        </td>
                        <td>
                          <Badge
                            texto={badgeTexto[reg.estado]}
                            tipo={badgeTipo[reg.estado]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Historial ─── */}
      {tabActiva === 'historial' && (
        <div className="tab-content">
          {/* Filtros */}
          <div className="historial-filtros">
            <div className="form-group" style={{ maxWidth: 200 }}>
              <label>Mes</label>
              <input
                type="month"
                value={mesHistorial}
                onChange={e => setMesHistorial(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ maxWidth: 220 }}>
              <label>Empleado</label>
              <select
                value={empHistorial}
                onChange={e => setEmpHistorial(e.target.value)}
              >
                <option value="todos">Todos los empleados</option>
                {employees.filter(e => e.estado === 'activo').map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-titulo">Historial de asistencia</h3>
              <span className="card-sub">{historialFiltrado.length} registros</span>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Fecha</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historialFiltrado.slice(0, 50).map(reg => {
                    const emp = getEmpleado(reg.empleadoId);
                    return (
                      <tr key={reg.id}>
                        <td>
                          <div className="emp-cell">
                            <Avatar iniciales={emp?.iniciales} color={emp?.colorAvatar} size="sm" />
                            <span className="emp-nombre">{getNombreEmpleado(reg.empleadoId)}</span>
                          </div>
                        </td>
                        <td>{new Date(reg.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                          weekday: 'short', day: '2-digit', month: 'short'
                        })}</td>
                        <td className={reg.entrada ? '' : 'sin-dato'}>{reg.entrada || '—'}</td>
                        <td className={reg.salida ? '' : 'sin-dato'}>{reg.salida || '—'}</td>
                        <td>
                          <Badge texto={badgeTexto[reg.estado]} tipo={badgeTipo[reg.estado]} />
                        </td>
                      </tr>
                    );
                  })}
                  {historialFiltrado.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        No hay registros para los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Calendario ─── */}
      {tabActiva === 'calendario' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h3 className="card-titulo">Calendario — Marzo 2026</h3>
              {/* Leyenda de colores */}
              <div className="cal-leyenda">
                <span className="cal-ley-item"><span className="cal-ley-dot cal-green" />Alta asistencia</span>
                <span className="cal-ley-item"><span className="cal-ley-dot cal-orange" />Con tardanzas</span>
                <span className="cal-ley-item"><span className="cal-ley-dot cal-red" />Muchas ausencias</span>
              </div>
            </div>

            {/* Encabezados de días de la semana */}
            <div className="cal-grid">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                <div key={dia} className="cal-head">{dia}</div>
              ))}

              {/* Celdas vacías para offset del primer día */}
              {Array.from({ length: diasCalendario.primerDia }, (_, i) => (
                <div key={`empty-${i}`} className="cal-cell cal-empty" />
              ))}

              {/* Días del mes */}
              {diasCalendario.dias.map(dia => (
                <div
                  key={dia.d}
                  className={`cal-cell ${dia.esFinde ? 'cal-finde' : colorCelda(dia)}`}
                >
                  <span className="cal-dia-num">{dia.d}</span>
                  {!dia.esFinde && dia.esLaboral && (
                    <div className="cal-stats">
                      <span title="Presentes">✅{dia.presentes}</span>
                      {dia.tardios > 0 && <span title="Tardíos">⏰{dia.tardios}</span>}
                      {dia.ausentes > 0 && <span title="Ausentes">❌{dia.ausentes}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
