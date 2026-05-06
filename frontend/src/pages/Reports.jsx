import { useState, useEffect } from 'react';
import {
  obtenerReporteHeadcountAPI,
  obtenerReporteAsistenciaMensualAPI,
} from '../services/api';
import './Reports.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ── Iconos ── */
const IcoUsers    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoCheck    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoX        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoClock    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function Reports() {
  const [tab, setTab] = useState('headcount');

  /* ── Headcount state ── */
  const [headcount, setHeadcount]       = useState(null);
  const [loadingHC, setLoadingHC]       = useState(false);
  const [errorHC, setErrorHC]           = useState('');

  /* ── Asistencia state ── */
  const hoy = new Date();
  const [mes, setMes]                   = useState(hoy.getMonth() + 1);
  const [anio, setAnio]                 = useState(hoy.getFullYear());
  const [asistencia, setAsistencia]     = useState(null);
  const [loadingAS, setLoadingAS]       = useState(false);
  const [errorAS, setErrorAS]           = useState('');

  /* ── Cargar headcount al montar ── */
  useEffect(() => {
    const cargar = async () => {
      setLoadingHC(true);
      setErrorHC('');
      try {
        const data = await obtenerReporteHeadcountAPI();
        setHeadcount(data);
      } catch (e) {
        setErrorHC(e.message || 'Error al cargar headcount');
      } finally {
        setLoadingHC(false);
      }
    };
    cargar();
  }, []);

  /* ── Cargar asistencia mensual ── */
  const cargarAsistencia = async () => {
    setLoadingAS(true);
    setErrorAS('');
    setAsistencia(null);
    try {
      const data = await obtenerReporteAsistenciaMensualAPI({ month: mes, year: anio });
      setAsistencia(data);
    } catch (e) {
      setErrorAS(e.message || 'Error al cargar asistencia');
    } finally {
      setLoadingAS(false);
    }
  };

  const maxHC = headcount?.departments?.length
    ? Math.max(...headcount.departments.map(d => d.headcount), 1)
    : 1;

   /* ── Exportar Headcount a Excel ── */
const exportarHeadcountExcel = () => {
  const filas = headcount.departments.map(d => ({
    Departamento: d.departmentName,
    Empleados: d.headcount,
  }));
  filas.push({ Departamento: 'TOTAL', Empleados: headcount.totalEmployees });

  const ws = XLSX.utils.json_to_sheet(filas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Headcount');
  XLSX.writeFile(wb, 'headcount.xlsx');
};

/* ── Exportar Headcount a PDF ── */
const exportarHeadcountPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Reporte de Headcount por Departamento', 14, 18);
  doc.setFontSize(11);
  doc.text(`Total empleados: ${headcount.totalEmployees}`, 14, 27);

  autoTable(doc, {
    startY: 33,
    head: [['Departamento', 'Empleados']],
    body: headcount.departments.map(d => [d.departmentName, d.headcount]),
    foot: [['TOTAL', headcount.totalEmployees]],
    styles: { fontSize: 11 },
    headStyles: { fillColor: [99, 102, 241] },
    footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
  });

  doc.save('headcount.pdf');
};

/* ── Exportar Asistencia a Excel ── */
const exportarAsistenciaExcel = () => {
  const filas = asistencia.data.map(e => ({
    Empleado: e.name || '—',
    Email: e.email,
    Departamento: e.department || '—',
    Presentes: e.present,
    Tardanzas: e.late,
    Ausentes: e.absent,
    'Total días': e.totalDays,
  }));

  const ws = XLSX.utils.json_to_sheet(filas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');
  XLSX.writeFile(wb, `asistencia_${MESES[mes - 1]}_${anio}.xlsx`);
};

/* ── Exportar Asistencia a PDF ── */
const exportarAsistenciaPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text(`Reporte de Asistencia — ${MESES[mes - 1]} ${anio}`, 14, 18);
  doc.setFontSize(11);
  doc.text(`Total empleados: ${asistencia.totalEmployees}`, 14, 27);

  autoTable(doc, {
    startY: 33,
    head: [['Empleado', 'Email', 'Departamento', 'Presentes', 'Tardanzas', 'Ausentes', 'Total días']],
    body: asistencia.data.map(e => [
      e.name || '—', e.email, e.department || '—',
      e.present, e.late, e.absent, e.totalDays,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [99, 102, 241] },
    columnStyles: {
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center' },
    },
  });

  doc.save(`asistencia_${MESES[mes - 1]}_${anio}.pdf`);
};

  return (
    <div className="rep fade-in">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Reportes</h1>
          <p className="page-header__desc">Análisis y estadísticas de la organización</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="rep__tabs">
        <button
          className={`rep__tab ${tab === 'headcount' ? 'rep__tab--active' : ''}`}
          onClick={() => setTab('headcount')}
        >
          <IcoUsers /> Headcount por Departamento
        </button>
        <button
          className={`rep__tab ${tab === 'asistencia' ? 'rep__tab--active' : ''}`}
          onClick={() => setTab('asistencia')}
        >
          <IcoCalendar /> Asistencia Mensual
        </button>
      </div>

      {/* ══════════════ TAB: HEADCOUNT ══════════════ */}
      {tab === 'headcount' && (
        <div className="rep__section">

          {/* Tarjeta total */}
          {headcount && (
            <div className="rep__total-card">
              <span className="rep__total-num">{headcount.totalEmployees}</span>
              <span className="rep__total-label">Empleados activos en total</span>
            </div>
          )}

          {/* Skeleton */}
          {loadingHC && (
            <div className="rep__list">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 'var(--radio)' }} />
              ))}
            </div>
          )}

          {/* Error */}
          {errorHC && <div className="alert alert--error">{errorHC}</div>}

          {/* Lista de departamentos */}
          {!loadingHC && headcount && (
            <div className="card">
             <div className="card__header">
              <div className="card__header-left">
               <h3 className="card__title">Empleados por departamento</h3>
                <span className="card__count">{headcount.departments?.length} departamentos</span>
             </div>
            <div className="rep__export-btns">
           <button className="btn btn--sm btn--outline" onClick={exportarHeadcountExcel}>
               ⬇ Excel
          </button>
          <button className="btn btn--sm btn--outline" onClick={exportarHeadcountPDF}>
               ⬇ PDF
               </button>
              </div>
             </div>
              <div className="rep__dept-list">
                {headcount.departments?.map(dept => (
                  <div key={dept.departmentId} className="rep__dept-row">
                    <div className="rep__dept-info">
                      <span className="rep__dept-name">{dept.departmentName}</span>
                      <span className="rep__dept-count">{dept.headcount} empleado{dept.headcount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="rep__bar-track">
                      <div
                        className="rep__bar-fill"
                        style={{ width: `${(dept.headcount / maxHC) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {headcount.departments?.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state__icon">🏢</div>
                    <p className="empty-state__title">Sin empleados registrados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ TAB: ASISTENCIA ══════════════ */}
      {tab === 'asistencia' && (
        <div className="rep__section">

          {/* Filtros */}
          <div className="card rep__filters">
            <select
              className="form-input form-input--sm"
              value={mes}
              onChange={e => setMes(Number(e.target.value))}
            >
              {MESES.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              className="form-input form-input--sm"
              value={anio}
              onChange={e => setAnio(Number(e.target.value))}
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button className="btn btn--primary" onClick={cargarAsistencia} disabled={loadingAS}>
              {loadingAS ? 'Cargando...' : 'Generar reporte'}
            </button>
          </div>

          {/* Error */}
          {errorAS && <div className="alert alert--error">{errorAS}</div>}

          {/* Skeleton */}
          {loadingAS && (
            <div className="rep__list">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton" style={{ height: 52, borderRadius: 'var(--radio)' }} />
              ))}
            </div>
          )}

          {/* Tabla */}
          {!loadingAS && asistencia && (
            <div className="card">
            <div className="card__header">
              <div className="card__header-left">
                <h3 className="card__title">Reporte — {MESES[mes - 1]} {anio}</h3>
                  <span className="card__count">{asistencia.totalEmployees} empleados</span>
              </div>
             <div className="rep__export-btns">
               <button className="btn btn--sm btn--outline" onClick={exportarAsistenciaExcel}>
                ⬇ Excel
              </button>
              <button className="btn btn--sm btn--outline" onClick={exportarAsistenciaPDF}>
                ⬇ PDF
              </button>
             </div>
            </div>

              {asistencia.data?.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">📅</div>
                  <p className="empty-state__title">Sin registros para este período</p>
                  <p className="empty-state__desc">No hay datos de asistencia en {MESES[mes - 1]} {anio}</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Empleado</th>
                        <th>Departamento</th>
                        <th style={{ textAlign: 'center' }}>
                          <span className="rep__th-icon rep__th-icon--green"><IcoCheck /></span> Presentes
                        </th>
                        <th style={{ textAlign: 'center' }}>
                          <span className="rep__th-icon rep__th-icon--orange"><IcoClock /></span> Tardanzas
                        </th>
                        <th style={{ textAlign: 'center' }}>
                          <span className="rep__th-icon rep__th-icon--red"><IcoX /></span> Ausentes
                        </th>
                        <th style={{ textAlign: 'center' }}>Total días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistencia.data.map(emp => (
                        <tr key={emp.employeeId}>
                          <td>
                            <span className="table__primary">{emp.name || '—'}</span>
                            <span className="table__secondary">{emp.email}</span>
                          </td>
                          <td>{emp.department || '—'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="rep__badge rep__badge--green">{emp.present}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="rep__badge rep__badge--orange">{emp.late}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="rep__badge rep__badge--red">{emp.absent}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="table__mono">{emp.totalDays}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Estado inicial — sin generar aún */}
          {!loadingAS && !asistencia && !errorAS && (
            <div className="rep__empty-hint">
              <span>📊</span>
              <p>Selecciona un mes y año, luego haz clic en <strong>Generar reporte</strong></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}