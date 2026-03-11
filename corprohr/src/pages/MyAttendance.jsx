// Página: Mi Asistencia
// Calendario mensual y tabla de registros de asistencia del empleado autenticado

import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { attendance } from '../data/mockData';
import Badge from '../components/ui/Badge';
import './MyAttendance.css';

// Fecha de referencia del sistema
const FECHA_REF = new Date('2026-03-10T00:00:00');
const AÑO_INICIAL  = FECHA_REF.getFullYear();
const MES_INICIAL  = FECHA_REF.getMonth(); // 2 = marzo (0-indexed)

const DIAS_SEMANA  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const NOMBRES_MES  = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Convierte estado a color de celda
function colorCelda(estado) {
  if (estado === 'presente') return 'celda-presente';
  if (estado === 'tardio')   return 'celda-tardio';
  if (estado === 'ausente')  return 'celda-ausente';
  return '';
}

export default function MyAttendance() {
  const { usuario } = useAuth();

  // Navegación de mes
  const [año, setAño]   = useState(AÑO_INICIAL);
  const [mes, setMes]   = useState(MES_INICIAL);

  // Ir al mes anterior
  const irAtras = () => {
    if (mes === 0) { setMes(11); setAño((a) => a - 1); }
    else           { setMes((m) => m - 1); }
  };

  // Ir al mes siguiente (límite: mes actual de referencia)
  const irAdelante = () => {
    const esUltimo = año === AÑO_INICIAL && mes === MES_INICIAL;
    if (esUltimo) return;
    if (mes === 11) { setMes(0); setAño((a) => a + 1); }
    else            { setMes((m) => m + 1); }
  };

  // Clave "YYYY-MM"
  const claveMes = `${año}-${String(mes + 1).padStart(2, '0')}`;

  // Registros del mes para el empleado actual
  const registros = useMemo(() => {
    if (!usuario?.empleadoId) return [];
    return attendance.filter(
      (r) => r.empleadoId === usuario.empleadoId && r.fecha.startsWith(claveMes)
    );
  }, [usuario, claveMes]);

  // Mapa fecha → registro para el calendario
  const mapaRegistros = useMemo(() => {
    const m = {};
    registros.forEach((r) => { m[r.fecha] = r; });
    return m;
  }, [registros]);

  // Número de días del mes y primer día de la semana (lunes=0)
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const primerDiaJS = new Date(año, mes, 1).getDay(); // 0=domingo
  const offsetLunes = primerDiaJS === 0 ? 6 : primerDiaJS - 1;

  // Métricas del mes
  const metricas = useMemo(() => {
    const presente = registros.filter((r) => r.estado === 'presente').length;
    const tardio   = registros.filter((r) => r.estado === 'tardio').length;
    const ausente  = registros.filter((r) => r.estado === 'ausente').length;
    return { presente, tardio, ausente };
  }, [registros]);

  // Registros ordenados para la tabla (de más reciente a más antiguo)
  const registrosTabla = useMemo(
    () => [...registros].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [registros]
  );

  const esUltimoMes = año === AÑO_INICIAL && mes === MES_INICIAL;

  return (
    <div className="mi-asistencia-page">

      {/* ─── Encabezado de navegación ─── */}
      <div className="ma-nav">
        <button className="ma-nav-btn" onClick={irAtras} title="Mes anterior">
          ‹
        </button>
        <h2 className="ma-titulo-mes">
          {NOMBRES_MES[mes]} {año}
        </h2>
        <button
          className={`ma-nav-btn ${esUltimoMes ? 'ma-nav-btn-disabled' : ''}`}
          onClick={irAdelante}
          disabled={esUltimoMes}
          title="Mes siguiente"
        >
          ›
        </button>
      </div>

      {/* ─── Métricas rápidas del mes ─── */}
      <div className="ma-metricas">
        <div className="ma-metrica ma-metrica-green">
          <span className="ma-metrica-valor">{metricas.presente}</span>
          <span className="ma-metrica-label">Presentes</span>
        </div>
        <div className="ma-metrica ma-metrica-orange">
          <span className="ma-metrica-valor">{metricas.tardio}</span>
          <span className="ma-metrica-label">Tardanzas</span>
        </div>
        <div className="ma-metrica ma-metrica-red">
          <span className="ma-metrica-valor">{metricas.ausente}</span>
          <span className="ma-metrica-label">Ausencias</span>
        </div>
      </div>

      {/* ─── Calendario mensual ─── */}
      <div className="card">
        <div className="ma-calendario">
          {/* Cabecera con nombres de días */}
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="ma-cal-header">{d}</div>
          ))}

          {/* Celdas en blanco para el offset del primer día */}
          {Array.from({ length: offsetLunes }).map((_, i) => (
            <div key={`offset-${i}`} className="ma-cal-celda ma-cal-vacia" />
          ))}

          {/* Un día por cada día del mes */}
          {Array.from({ length: diasEnMes }).map((_, i) => {
            const dia       = i + 1;
            const fechaStr  = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const registro  = mapaRegistros[fechaStr];
            const clase     = registro ? colorCelda(registro.estado) : '';

            return (
              <div
                key={fechaStr}
                className={`ma-cal-celda ${clase}`}
                title={registro ? (
                  registro.estado === 'presente' ? 'Presente' :
                  registro.estado === 'tardio'   ? 'Tardío'   : 'Ausente'
                ) : ''}
              >
                <span className="ma-cal-dia">{dia}</span>
                {registro && (
                  <span className="ma-cal-punto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="ma-leyenda">
          <span className="ma-leyenda-item">
            <span className="ma-leyenda-punto leyenda-presente" /> Presente
          </span>
          <span className="ma-leyenda-item">
            <span className="ma-leyenda-punto leyenda-tardio" /> Tardío
          </span>
          <span className="ma-leyenda-item">
            <span className="ma-leyenda-punto leyenda-ausente" /> Ausente
          </span>
          <span className="ma-leyenda-item">
            <span className="ma-leyenda-punto leyenda-sin" /> Sin registro
          </span>
        </div>
      </div>

      {/* ─── Tabla de registros del mes ─── */}
      <div className="card">
        <h3 className="ma-subtitulo">Detalle de registros</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Día</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {registrosTabla.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Sin registros para {NOMBRES_MES[mes]} {año}
                  </td>
                </tr>
              ) : (
                registrosTabla.map((r) => {
                  const fecha     = new Date(r.fecha + 'T00:00:00');
                  const diaNombre = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
                  const diaFmt    = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'short'
                  });
                  return (
                    <tr key={r.id}>
                      <td>{diaFmt}</td>
                      <td style={{ textTransform: 'capitalize' }}>{diaNombre}</td>
                      <td>{r.horaEntrada || '—'}</td>
                      <td>{r.horaSalida  || '—'}</td>
                      <td>
                        <Badge
                          texto={
                            r.estado === 'presente' ? 'Presente' :
                            r.estado === 'tardio'   ? 'Tardío'   : 'Ausente'
                          }
                          color={
                            r.estado === 'presente' ? 'green' :
                            r.estado === 'tardio'   ? 'orange' : 'red'
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
