/* =============================================
   Employees.jsx — Gestión de empleados (admin)
   Buscador, filtros, tabla y modal de nuevo empleado
   ============================================= */

import { useState, useMemo } from 'react';
import { employees as empData, departments } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import './Employees.css';

/* Estado inicial del formulario de nuevo empleado */
const FORM_INICIAL = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  departamento: '',
  cargo: '',
  salario: '',
  fechaIngreso: '',
};

export default function Employees() {
  /* Estado local de la lista de empleados (para agregar/editar/eliminar) */
  const [lista, setLista] = useState(empData);

  /* Buscador y filtros */
  const [busqueda, setBusqueda] = useState('');
  const [deptFiltro, setDeptFiltro] = useState('Todos');

  /* Modal y formulario */
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [formError, setFormError] = useState('');

  /* Modal de confirmación de eliminación */
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);

  /* ─── Filtrado en vivo ─── */
  const empleadosFiltrados = useMemo(() => {
    return lista.filter(emp => {
      // Filtro por búsqueda de nombre completo o departamento
      const busqLower = busqueda.toLowerCase();
      const coincideBusqueda =
        `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqLower) ||
        emp.departamento.toLowerCase().includes(busqLower) ||
        emp.email.toLowerCase().includes(busqLower);

      // Filtro por departamento seleccionado
      const coincideDept = deptFiltro === 'Todos' || emp.departamento === deptFiltro;

      return coincideBusqueda && coincideDept;
    });
  }, [lista, busqueda, deptFiltro]);

  /* ─── Actualizar campo del formulario ─── */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ─── Guardar nuevo empleado ─── */
  const handleGuardar = (e) => {
    e.preventDefault();
    setFormError('');

    // Validación básica: todos los campos requeridos
    const camposRequeridos = ['nombre', 'apellido', 'email', 'departamento', 'cargo', 'fechaIngreso'];
    const faltante = camposRequeridos.find(c => !form[c].trim());
    if (faltante) {
      setFormError('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Crear objeto del nuevo empleado
    const nuevoEmpleado = {
      ...form,
      id: lista.length + 1,
      salario: parseFloat(form.salario) || 0,
      estado: 'activo',
      iniciales: `${form.nombre[0]}${form.apellido[0]}`.toUpperCase(),
      colorAvatar: 'linear-gradient(135deg, #4f8ef7, #38d9a9)',
    };

    // Agregar a la lista local
    setLista(prev => [nuevoEmpleado, ...prev]);
    setModalAbierto(false);
    setForm(FORM_INICIAL);
  };

  /* ─── Cambiar estado (activo/inactivo) ─── */
  const toggleEstado = (id) => {
    setLista(prev => prev.map(emp =>
      emp.id === id
        ? { ...emp, estado: emp.estado === 'activo' ? 'inactivo' : 'activo' }
        : emp
    ));
  };

  /* ─── Eliminar empleado ─── */
  const eliminarEmpleado = (id) => {
    setConfirmarEliminarId(id);
  };

  const confirmarEliminar = () => {
    setLista(prev => prev.filter(emp => emp.id !== confirmarEliminarId));
    setConfirmarEliminarId(null);
  };

  /* Nombres de departamentos para los chips de filtro */
  const deptNombres = ['Todos', ...departments.map(d => d.nombre)];

  return (
    <div className="employees-page">
      {/* Cabecera */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Empleados</h1>
          <p className="page-subtitle">{lista.length} empleados registrados</p>
        </div>
        <Button variante="primary" onClick={() => setModalAbierto(true)}>
          + Nuevo Empleado
        </Button>
      </div>

      {/* Buscador y filtros */}
      <div className="employees-filtros">
        {/* Buscador */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, email o departamento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Chips de filtro por departamento */}
        <div className="filter-chips">
          {deptNombres.map(dept => (
            <button
              key={dept}
              className={`chip ${deptFiltro === dept ? 'active' : ''}`}
              onClick={() => setDeptFiltro(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Departamento</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Ingreso</th>
                <th>Salario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    No se encontraron empleados con ese criterio.
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map(emp => (
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
                    <td>{emp.telefono}</td>
                    <td>
                      {new Date(emp.fechaIngreso + 'T00:00:00').toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td>
                      ${emp.salario.toLocaleString('es')}
                    </td>
                    <td>
                      <Badge
                        texto={emp.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        tipo={emp.estado === 'activo' ? 'green' : 'gray'}
                      />
                    </td>
                    <td>
                      <div className="acciones-cell">
                        <Button
                          variante="secondary"
                          small
                          onClick={() => toggleEstado(emp.id)}
                        >
                          {emp.estado === 'activo' ? '⏸' : '▶'}
                        </Button>
                        <Button
                          variante="danger"
                          small
                          onClick={() => eliminarEmpleado(emp.id)}
                        >
                          🗑
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Confirmar eliminación */}
      {confirmarEliminarId !== null && (
        <Modal
          titulo="Eliminar empleado"
          onClose={() => setConfirmarEliminarId(null)}
          size="sm"
        >
          <div className="confirm-modal-body">
            <div className="confirm-modal-icono">🗑️</div>
            <p className="confirm-modal-texto">
              ¿Estás seguro de que deseas eliminar este empleado?
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

      {/* Modal: Nuevo empleado */}
      {modalAbierto && (
        <Modal
          titulo="Registrar nuevo empleado"
          onClose={() => { setModalAbierto(false); setForm(FORM_INICIAL); setFormError(''); }}
          size="lg"
        >
          <form onSubmit={handleGuardar}>
            <div className="form-grid-2">
              {/* Nombre */}
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleFormChange}
                  placeholder="Carlos"
                  required
                />
              </div>

              {/* Apellido */}
              <div className="form-group">
                <label>Apellido *</label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleFormChange}
                  placeholder="Mendoza"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Correo electrónico *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="correo@corphr.com"
                  required
                />
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleFormChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Departamento */}
              <div className="form-group">
                <label>Departamento *</label>
                <select
                  name="departamento"
                  value={form.departamento}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.nombre}>{d.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Cargo */}
              <div className="form-group">
                <label>Cargo *</label>
                <input
                  name="cargo"
                  value={form.cargo}
                  onChange={handleFormChange}
                  placeholder="Desarrollador Senior"
                  required
                />
              </div>

              {/* Salario */}
              <div className="form-group">
                <label>Salario mensual ($)</label>
                <input
                  name="salario"
                  type="number"
                  min="0"
                  value={form.salario}
                  onChange={handleFormChange}
                  placeholder="3500"
                />
              </div>

              {/* Fecha de ingreso */}
              <div className="form-group">
                <label>Fecha de ingreso *</label>
                <input
                  name="fechaIngreso"
                  type="date"
                  value={form.fechaIngreso}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            {/* Error del formulario */}
            {formError && (
              <div className="login-error" style={{ marginTop: '0.75rem' }}>
                ⚠️ {formError}
              </div>
            )}

            {/* Botones de acción */}
            <div className="modal-acciones">
              <Button
                variante="secondary"
                onClick={() => { setModalAbierto(false); setForm(FORM_INICIAL); }}
                type="button"
              >
                Cancelar
              </Button>
              <Button variante="primary" type="submit">
                Guardar empleado
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
