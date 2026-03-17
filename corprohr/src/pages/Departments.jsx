/* =============================================
   Departments.jsx — Gestión de departamentos (admin)
   Tarjetas con barra de progreso y modal para agregar
   ============================================= */

import { useState } from 'react';
import { departments as deptData, employees } from '../data/mockData';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import './Departments.css';

/* Estado inicial del formulario */
const FORM_INICIAL = { nombre: '', jefe: '', color: '#4f8ef7' };

export default function Departments() {
  /* Lista local de departamentos (para agregar sin backend) */
  const [lista, setLista] = useState(deptData);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [formError, setFormError] = useState('');

  /* Total de empleados en todos los departamentos */
  const totalGeneral = lista.reduce((sum, d) => sum + d.totalEmpleados, 0);

  /* Actualizar campo del formulario */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* Guardar nuevo departamento */
  const handleGuardar = (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.jefe.trim()) {
      setFormError('Nombre y jefe son obligatorios.');
      return;
    }

    const nuevoDept = {
      id: lista.length + 1,
      nombre: form.nombre,
      jefe: form.jefe,
      totalEmpleados: 0,
      color: form.color,
    };

    setLista(prev => [...prev, nuevoDept]);
    setModalAbierto(false);
    setForm(FORM_INICIAL);
    setFormError('');
  };

  /* Eliminar departamento */
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);

  const eliminarDept = (id) => {
    setConfirmarEliminarId(id);
  };

  const confirmarEliminar = () => {
    setLista(prev => prev.filter(d => d.id !== confirmarEliminarId));
    setConfirmarEliminarId(null);
  };

  return (
    <div className="departments-page">
      {/* Cabecera */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Departamentos</h1>
          <p className="page-subtitle">{lista.length} departamentos activos · {totalGeneral} empleados</p>
        </div>
        <Button variante="primary" onClick={() => setModalAbierto(true)}>
          + Nuevo Departamento
        </Button>
      </div>

      {/* Cuadrícula de tarjetas */}
      <div className="dept-cards-grid">
        {lista.map(dept => {
          const porcentaje = totalGeneral > 0
            ? Math.round((dept.totalEmpleados / totalGeneral) * 100)
            : 0;

          // Empleados de este departamento
          const empDept = employees.filter(e => e.departamento === dept.nombre);

          return (
            <div key={dept.id} className="dept-card card">
              {/* Franja de color superior */}
              <div className="dept-card-bar" style={{ background: dept.color }} />

              {/* Cabecera de la tarjeta */}
              <div className="dept-card-header">
                <div
                  className="dept-card-icon"
                  style={{
                    background: `${dept.color}22`,
                    color: dept.color,
                  }}
                >
                  🏢
                </div>
                <div className="dept-card-info">
                  <h3 className="dept-card-nombre">{dept.nombre}</h3>
                  <p className="dept-card-jefe">Jefe: {dept.jefe}</p>
                </div>
                {/* Botón eliminar */}
                <button
                  className="dept-card-delete"
                  onClick={() => eliminarDept(dept.id)}
                  title="Eliminar departamento"
                >
                  ✕
                </button>
              </div>

              {/* Métricas */}
              <div className="dept-card-metricas">
                <div className="dept-metrica">
                  <span className="metrica-valor">{dept.totalEmpleados}</span>
                  <span className="metrica-label">Empleados</span>
                </div>
                <div className="dept-metrica">
                  <span className="metrica-valor">{porcentaje}%</span>
                  <span className="metrica-label">Del total</span>
                </div>
                <div className="dept-metrica">
                  <span className="metrica-valor">
                    {empDept.filter(e => e.estado === 'activo').length}
                  </span>
                  <span className="metrica-label">Activos</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="dept-card-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${porcentaje}%`, background: dept.color }}
                  />
                </div>
                <span className="dept-footer-txt">
                  {porcentaje}% del personal total
                </span>
              </div>

              {/* Mini avatares de empleados del dept (máximo 4) */}
              {empDept.length > 0 && (
                <div className="dept-empleados-preview">
                  {empDept.slice(0, 4).map(emp => (
                    <div
                      key={emp.id}
                      className="mini-avatar"
                      style={{ background: emp.colorAvatar }}
                      title={`${emp.nombre} ${emp.apellido}`}
                    >
                      {emp.iniciales}
                    </div>
                  ))}
                  {empDept.length > 4 && (
                    <div className="mini-avatar mini-avatar-more">
                      +{empDept.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Confirmar eliminación */}
      {confirmarEliminarId !== null && (
        <Modal
          titulo="Eliminar departamento"
          onClose={() => setConfirmarEliminarId(null)}
          size="sm"
        >
          <div className="confirm-modal-body">
            <div className="confirm-modal-icono">🗑️</div>
            <p className="confirm-modal-texto">
              ¿Estás seguro de que deseas eliminar este departamento?
              <br />
              <span className="confirm-modal-aviso">Esta acción no se puede deshacer.</span>
            </p>
            <div className="modal-acciones">
              <Button
                variante="secondary"
                onClick={() => setConfirmarEliminarId(null)}
                type="button"
              >
                Cancelar
              </Button>
              <Button variante="danger" onClick={confirmarEliminar} type="button">
                Sí, eliminar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Nuevo departamento */}
      {modalAbierto && (
        <Modal
          titulo="Nuevo departamento"
          onClose={() => { setModalAbierto(false); setForm(FORM_INICIAL); setFormError(''); }}
          size="sm"
        >
          <form onSubmit={handleGuardar}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Nombre del departamento *</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Operaciones"
                  required
                />
              </div>

              <div className="form-group">
                <label>Jefe del departamento *</label>
                <input
                  name="jefe"
                  value={form.jefe}
                  onChange={handleChange}
                  placeholder="Nombre del responsable"
                  required
                />
              </div>

              <div className="form-group">
                <label>Color identificador</label>
                <div className="color-picker-row">
                  <input
                    name="color"
                    type="color"
                    value={form.color}
                    onChange={handleChange}
                    className="color-input"
                  />
                  <span className="color-preview" style={{ background: form.color }}>
                    {form.nombre || 'Vista previa'}
                  </span>
                </div>
              </div>

              {formError && (
                <div className="login-error">⚠️ {formError}</div>
              )}

              <div className="modal-acciones">
                <Button
                  variante="secondary"
                  onClick={() => setModalAbierto(false)}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button variante="primary" type="submit">
                  Crear departamento
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
