/* =============================================
   Reports.jsx — Página de reportes (admin)
   Tarjetas de reportes disponibles con descarga simulada
   ============================================= */

import { useState } from 'react';
import { employees, attendance, departments } from '../data/mockData';
import Button from '../components/ui/Button';
import './Reports.css';

/* Definición de los reportes disponibles */
const reportesDisponibles = [
  {
    id: 1,
    titulo: 'Asistencia Mensual',
    descripcion: 'Resumen completo de asistencia, tardanzas y ausencias del mes en curso.',
    icono: '📊',
    color: 'blue',
    formato: 'CSV',
  },
  {
    id: 2,
    titulo: 'Directorio de Empleados',
    descripcion: 'Lista completa de todos los empleados con sus datos de contacto y cargo.',
    icono: '👥',
    color: 'green',
    formato: 'PDF',
  },
  {
    id: 3,
    titulo: 'Tardanzas y Ausencias',
    descripcion: 'Detalle de incidencias del mes: empleados con tardanzas recurrentes o ausencias.',
    icono: '⚠️',
    color: 'orange',
    formato: 'XLSX',
  },
  {
    id: 4,
    titulo: 'Reporte por Departamento',
    descripcion: 'Asistencia y rendimiento agrupado por cada departamento activo.',
    icono: '🏢',
    color: 'purple',
    formato: 'PDF',
  },
  {
    id: 5,
    titulo: 'Nómina del Mes',
    descripcion: 'Resumen de salarios y deducciones del mes para cada empleado activo.',
    icono: '💰',
    color: 'green',
    formato: 'XLSX',
  },
  {
    id: 6,
    titulo: 'Nuevos Ingresos',
    descripcion: 'Empleados incorporados en los últimos 90 días con su información de onboarding.',
    icono: '🆕',
    color: 'blue',
    formato: 'CSV',
  },
];

export default function Reports() {
  /* Estado de carga por reporte (simula generación del archivo) */
  const [generando, setGenerando] = useState({});
  const [generados, setGenerados] = useState({});

  /* Métricas de resumen */
  const totalEmpleados = employees.length;
  const empleadosActivos = employees.filter(e => e.estado === 'activo').length;
  const totalRegistros = attendance.length;
  const totalDepts = departments.length;

  /* Simular descarga de reporte */
  const handleDescargar = (id, titulo) => {
    // Marcar como generando
    setGenerando(prev => ({ ...prev, [id]: true }));
    setGenerados(prev => ({ ...prev, [id]: false }));

    // Simular tiempo de generación
    setTimeout(() => {
      setGenerando(prev => ({ ...prev, [id]: false }));
      setGenerados(prev => ({ ...prev, [id]: true }));

      // Después de 3 segundos, resetear el estado de "listo"
      setTimeout(() => {
        setGenerados(prev => ({ ...prev, [id]: false }));
      }, 3000);
    }, 1500);
  };

  return (
    <div className="reports-page">
      {/* Cabecera */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Genera y descarga reportes del sistema</p>
        </div>
      </div>

      {/* Tarjetas de resumen rápido */}
      <div className="reports-resumen">
        <div className="resumen-item">
          <span className="resumen-valor">{totalEmpleados}</span>
          <span className="resumen-label">Total empleados</span>
        </div>
        <div className="resumen-sep" />
        <div className="resumen-item">
          <span className="resumen-valor">{empleadosActivos}</span>
          <span className="resumen-label">Empleados activos</span>
        </div>
        <div className="resumen-sep" />
        <div className="resumen-item">
          <span className="resumen-valor">{totalRegistros}</span>
          <span className="resumen-label">Registros de asistencia</span>
        </div>
        <div className="resumen-sep" />
        <div className="resumen-item">
          <span className="resumen-valor">{totalDepts}</span>
          <span className="resumen-label">Departamentos</span>
        </div>
      </div>

      {/* Cuadrícula de reportes */}
      <div className="reports-grid">
        {reportesDisponibles.map(rep => (
          <div key={rep.id} className={`report-card card report-card-${rep.color}`}>
            {/* Encabezado de la tarjeta */}
            <div className="report-card-header">
              <div className={`report-icono report-icono-${rep.color}`}>
                {rep.icono}
              </div>
              <div className="report-formato">
                {rep.formato}
              </div>
            </div>

            {/* Información */}
            <div className="report-info">
              <h3 className="report-titulo">{rep.titulo}</h3>
              <p className="report-desc">{rep.descripcion}</p>
            </div>

            {/* Botón de descarga */}
            <Button
              variante={generados[rep.id] ? 'secondary' : 'primary'}
              fullWidth
              disabled={generando[rep.id]}
              onClick={() => handleDescargar(rep.id, rep.titulo)}
            >
              {generando[rep.id]
                ? '⏳ Generando...'
                : generados[rep.id]
                ? '✅ Descargado'
                : '⬇ Descargar reporte'
              }
            </Button>
          </div>
        ))}
      </div>

      {/* Nota informativa */}
      <div className="reports-nota">
        <span>ℹ️</span>
        <p>
          Los reportes se generan con los datos actuales del sistema. En producción se
          exportarían a archivos reales. Actualmente la descarga es simulada.
        </p>
      </div>
    </div>
  );
}
