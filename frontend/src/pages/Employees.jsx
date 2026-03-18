import { useState, useEffect, useCallback } from 'react';
import {
  obtenerPosicionesAPI,
  crearPosicionAPI,
  actualizarPosicionAPI,
  eliminarPosicionAPI,
  obtenerDepartamentosAPI
} from '../services/api';
import Modal   from '../components/ui/Modal';
import Button  from '../components/ui/Button';
import Badge   from '../components/ui/Badge';
import Alert   from '../components/ui/Alert';
import './Employees.css';

/* ── Icono de lapiz ── */
const IcoEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

/* ── Icono de papelera ── */
const IcoDelete = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

/* ── Icono de busqueda ── */
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ── Icono de mas ── */
const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

/* ── Formateador de salario en pesos colombianos ── */
const formatSalario = v => {
  const n = Number(v);
  if (isNaN(n)) return '—';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
};

/* ── Colores ciclicos para badge de departamento ── */
const DEPT_TYPES = ['blue', 'purple', 'orange', 'green', 'info'];
const deptColor = name => {
  const code = [...(name ?? '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  return DEPT_TYPES[code % DEPT_TYPES.length];
};

/* ══════════════════════════════════════════════════════════
   Formulario para crear / editar una posicion (cargo)
   Los campos siguen el modelo Product del backend:
     - name (titulo del cargo)
     - description (descripcion del cargo)
     - price (salario mensual)
     - categoryId (departamento al que pertenece)
   ══════════════════════════════════════════════════════════ */
function FormPosicion({ inicial, departamentos, guardando, error, onGuardar, onCerrarError }) {
  /* Estado del formulario */
  const [form, setForm] = useState({
    nombre: '', descripcion: '', salario: '', departamentoId: '',
    ...inicial
  });

  const cambiar = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* Validacion local antes de enviar al backend */
  const enviar = e => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    /* El backend requiere categoryId obligatorio y valido */
    if (!form.departamentoId) return;
    onGuardar(form);
  };

  return (
    <form className="pos-form" onSubmit={enviar}>
      {/* Error del servidor */}
      {error && <Alert tipo="error" onCerrar={onCerrarError}>{error}</Alert>}

      {/* Nombre del cargo */}
      <div className="field">
        <label className="field__label" htmlFor="pf-nombre">Titulo del cargo *</label>
        <input id="pf-nombre" name="nombre" className="field__input"
          placeholder="Ej. Desarrollador Senior" value={form.nombre} onChange={cambiar} required />
      </div>

      {/* Departamento (select obligatorio — backend requiere categoryId valido) */}
      <div className="field">
        <label className="field__label" htmlFor="pf-dept">Departamento *</label>
        <select id="pf-dept" name="departamentoId" className="field__input field__select"
          value={form.departamentoId} onChange={cambiar} required>
          <option value="">— Selecciona un departamento —</option>
          {departamentos.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        {!form.departamentoId && <span className="field__hint">Requerido para crear la posicion</span>}
      </div>

      {/* Grid de dos columnas: salario e informacion adicional */}
      <div className="pos-form__row">
        {/* Salario (precio en el modelo Product) */}
        <div className="field">
          <label className="field__label" htmlFor="pf-salario">Salario mensual (COP)</label>
          <input id="pf-salario" name="salario" type="number" min="0" className="field__input"
            placeholder="3500000" value={form.salario} onChange={cambiar} />
        </div>
      </div>

      {/* Descripcion del cargo */}
      <div className="field">
        <label className="field__label" htmlFor="pf-desc">Descripcion del cargo</label>
        <textarea id="pf-desc" name="descripcion" className="field__input field__textarea"
          placeholder="Describe las responsabilidades de esta posicion..." rows={3}
          value={form.descripcion} onChange={cambiar} />
      </div>

      {/* Boton guardar */}
      <div className="pos-form__footer">
        <Button type="submit" variante="primary" cargando={guardando} fullWidth>
          {inicial?._id ? 'Guardar cambios' : 'Crear posicion'}
        </Button>
      </div>
    </form>
  );
}

/* ================================================================
   Pagina principal: Posiciones / Cargos
   Conectado al endpoint real /api/products
   - name = titulo del cargo
   - price = salario mensual
   - categoryId = departamento (ref a Category)
   ================================================================ */
export default function Employees() {
  /* Lista de posiciones del backend */
  const [posiciones, setPosiciones] = useState([]);
  /* Lista de departamentos para el select */
  const [departamentos, setDepartamentos] = useState([]);
  /* Carga inicial */
  const [cargando, setCargando] = useState(true);
  /* Error al cargar datos */
  const [error, setError] = useState(null);
  /* Texto de busqueda */
  const [busqueda, setBusqueda] = useState('');

  /* Control de modales */
  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando]     = useState(null);
  const [eliminando, setEliminando] = useState(null);

  /* Estado de operaciones */
  const [guardando, setGuardando]       = useState(false);
  const [errorAccion, setErrorAccion]   = useState(null);

  /* ── Carga paralela: posiciones + departamentos ── */
  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [rPos, rDept] = await Promise.all([
        obtenerPosicionesAPI(),
        obtenerDepartamentosAPI()
      ]);
      setPosiciones(rPos.products ?? []);
      setDepartamentos(rDept.categories ?? []);
    } catch (e) {
      setError(e.message ?? 'Error al cargar posiciones');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  /* ── Filtro de busqueda local ── */
  const filtradas = posiciones.filter(p => {
    const q = busqueda.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.categoryId?.name?.toLowerCase().includes(q)
    );
  });

  /* ── Crear nueva posicion ── */
  const crearPosicion = async ({ nombre, descripcion, salario, departamentoId }) => {
    setGuardando(true);
    setErrorAccion(null);
    try {
      await crearPosicionAPI({
        name: nombre,
        description: descripcion,
        price: salario !== '' ? Number(salario) : 0,
        categoryId: departamentoId || undefined
      });
      setModalCrear(false);
      cargar();
    } catch (e) {
      setErrorAccion(e.message ?? 'Error al crear');
    } finally {
      setGuardando(false);
    }
  };

  /* ── Actualizar posicion existente ── */
  const actualizarPosicion = async ({ nombre, descripcion, salario, departamentoId }) => {
    setGuardando(true);
    setErrorAccion(null);
    try {
      await actualizarPosicionAPI(editando._id, {
        name: nombre,
        description: descripcion,
        price: salario !== '' ? Number(salario) : 0,
        categoryId: departamentoId || undefined
      });
      setEditando(null);
      cargar();
    } catch (e) {
      setErrorAccion(e.message ?? 'Error al actualizar');
    } finally {
      setGuardando(false);
    }
  };

  /* ── Confirmar y ejecutar eliminacion ── */
  const confirmarEliminar = async () => {
    setGuardando(true);
    setErrorAccion(null);
    try {
      await eliminarPosicionAPI(eliminando._id);
      setEliminando(null);
      cargar();
    } catch (e) {
      setErrorAccion(e.message ?? 'Error al eliminar');
    } finally {
      setGuardando(false);
    }
  };

  /* ── Formateador de fecha ── */
  const fecha = iso => iso
    ? new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  /* ── Prepara valores iniciales para el modal de edicion ── */
  const inicialEdicion = p => ({
    _id: p._id,
    nombre: p.name ?? '',
    descripcion: p.description ?? '',
    salario: p.price ?? '',
    departamentoId: typeof p.categoryId === 'object' ? p.categoryId?._id : p.categoryId ?? ''
  });

  return (
    <div className="posiciones">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Posiciones</h1>
          <p className="page-header__desc">Cargos y posiciones disponibles en la organizacion</p>
        </div>
        <Button variante="primary" icono={<IcoPlus />}
          onClick={() => { setErrorAccion(null); setModalCrear(true); }}>
          Nueva posicion
        </Button>
      </div>

      {/* ── Barra de busqueda ── */}
      <div className="dept-toolbar">
        <div className="search-bar">
          <span className="search-bar__icon"><IcoSearch /></span>
          <input className="search-bar__input" placeholder="Buscar por cargo, departamento..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        {!cargando && (
          <span className="dept-count">
            {filtradas.length} {filtradas.length === 1 ? 'posicion' : 'posiciones'}
          </span>
        )}
      </div>

      {/* ── Skeleton de carga ── */}
      {cargando && (
        <div className="card">
          <div className="dept-skeleton">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="dept-skeleton__row">
                <div className="skeleton" style={{ width: '35%', height: 14 }} />
                <div className="skeleton" style={{ width: '55%', height: 12, marginTop: 6 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Error general ── */}
      {!cargando && error && (
        <Alert tipo="error" onCerrar={() => setError(null)}>{error}</Alert>
      )}

      {/* ── Tabla de posiciones ── */}
      {!cargando && !error && (
        <div className="card">
          {filtradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">💼</div>
              <p className="empty-state__title">
                {busqueda ? 'Sin resultados' : 'No hay posiciones'}
              </p>
              <p className="empty-state__desc">
                {busqueda
                  ? `No se encontro "${busqueda}"`
                  : 'Crea la primera posicion para comenzar.'}
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cargo</th>
                    <th>Departamento</th>
                    <th>Salario mensual</th>
                    <th>Creado</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map(pos => (
                    <tr key={pos._id}>
                      {/* Nombre del cargo */}
                      <td>
                        <span className="table__primary">{pos.name}</span>
                        {pos.description && (
                          <span className="table__secondary pos-desc">{pos.description}</span>
                        )}
                      </td>

                      {/* Departamento (badge) */}
                      <td>
                        {pos.categoryId
                          ? <Badge
                              texto={pos.categoryId?.name ?? pos.categoryId}
                              tipo={deptColor(pos.categoryId?.name ?? pos.categoryId)}
                            />
                          : <span style={{ color: 'var(--text3)', fontSize: 13 }}>—</span>
                        }
                      </td>

                      {/* Salario formateado */}
                      <td>
                        <span className="table__mono pos-salary">
                          {pos.price != null ? formatSalario(pos.price) : '—'}
                        </span>
                      </td>

                      {/* Fecha creacion */}
                      <td><span className="table__secondary">{fecha(pos.createdAt)}</span></td>

                      {/* Acciones */}
                      <td>
                        <div className="table__actions" style={{ justifyContent: 'flex-end' }}>
                          <button className="table__btn table__btn--edit" title="Editar"
                            onClick={() => { setErrorAccion(null); setEditando(pos); }}>
                            <IcoEdit />
                          </button>
                          <button className="table__btn table__btn--delete" title="Eliminar"
                            onClick={() => { setErrorAccion(null); setEliminando(pos); }}>
                            <IcoDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ Modal: Crear posicion ══ */}
      {modalCrear && (
        <Modal titulo="Nueva posicion" onClose={() => setModalCrear(false)}>
          <FormPosicion
            departamentos={departamentos}
            guardando={guardando}
            error={errorAccion}
            onGuardar={crearPosicion}
            onCerrarError={() => setErrorAccion(null)}
          />
        </Modal>
      )}

      {/* ══ Modal: Editar posicion ══ */}
      {editando && (
        <Modal titulo="Editar posicion" onClose={() => setEditando(null)}>
          <FormPosicion
            inicial={inicialEdicion(editando)}
            departamentos={departamentos}
            guardando={guardando}
            error={errorAccion}
            onGuardar={actualizarPosicion}
            onCerrarError={() => setErrorAccion(null)}
          />
        </Modal>
      )}

      {/* ══ Modal: Confirmar eliminacion ══ */}
      {eliminando && (
        <Modal
          titulo="Eliminar posicion"
          onClose={() => setEliminando(null)}
          footer={
            <>
              <Button variante="secondary" onClick={() => setEliminando(null)}>Cancelar</Button>
              <Button variante="danger" cargando={guardando} onClick={confirmarEliminar}>Eliminar</Button>
            </>
          }
        >
          <div className="dept-confirm">
            {errorAccion && <Alert tipo="error" onCerrar={() => setErrorAccion(null)}>{errorAccion}</Alert>}
            <p>?Esta seguro de eliminar el cargo <strong>{eliminando.name}</strong>?</p>
            <p className="dept-confirm__warn">Esta accion no se puede deshacer.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}