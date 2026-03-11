/* =============================================
   mockData.js — Datos de prueba para CorpHR
   Todos los datos son ficticios y se usan sin backend
   ============================================= */

/* ─── DEPARTAMENTOS ─── */
export const departments = [
  {
    id: 1,
    nombre: 'Tecnología',
    jefe: 'Carlos Mendoza',
    totalEmpleados: 12,
    color: '#4f8ef7',
  },
  {
    id: 2,
    nombre: 'Recursos Humanos',
    jefe: 'Lucía Fernández',
    totalEmpleados: 6,
    color: '#38d9a9',
  },
  {
    id: 3,
    nombre: 'Finanzas',
    jefe: 'Roberto Salinas',
    totalEmpleados: 8,
    color: '#f7a94f',
  },
  {
    id: 4,
    nombre: 'Marketing',
    jefe: 'Valentina Ruiz',
    totalEmpleados: 5,
    color: '#a78bfa',
  },
];

/* ─── EMPLEADOS ─── */
export const employees = [
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Mendoza',
    email: 'cmendoza@corphr.com',
    telefono: '+1 (555) 101-2030',
    departamento: 'Tecnología',
    cargo: 'Jefe de Tecnología',
    salario: 5800,
    fechaIngreso: '2020-03-15',
    estado: 'activo',
    iniciales: 'CM',
    colorAvatar: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
  },
  {
    id: 2,
    nombre: 'Lucía',
    apellido: 'Fernández',
    email: 'lfernandez@corphr.com',
    telefono: '+1 (555) 202-3040',
    departamento: 'Recursos Humanos',
    cargo: 'Jefa de RRHH',
    salario: 4900,
    fechaIngreso: '2019-07-01',
    estado: 'activo',
    iniciales: 'LF',
    colorAvatar: 'linear-gradient(135deg, #38d9a9, #4f8ef7)',
  },
  {
    id: 3,
    nombre: 'Roberto',
    apellido: 'Salinas',
    email: 'rsalinas@corphr.com',
    telefono: '+1 (555) 303-4050',
    departamento: 'Finanzas',
    cargo: 'Director Financiero',
    salario: 6200,
    fechaIngreso: '2018-11-20',
    estado: 'activo',
    iniciales: 'RS',
    colorAvatar: 'linear-gradient(135deg, #f7a94f, #f75f5f)',
  },
  {
    id: 4,
    nombre: 'Valentina',
    apellido: 'Ruiz',
    email: 'vruiz@corphr.com',
    telefono: '+1 (555) 404-5060',
    departamento: 'Marketing',
    cargo: 'Directora de Marketing',
    salario: 5100,
    fechaIngreso: '2021-01-10',
    estado: 'activo',
    iniciales: 'VR',
    colorAvatar: 'linear-gradient(135deg, #a78bfa, #38d9a9)',
  },
  {
    id: 5,
    nombre: 'Diego',
    apellido: 'Torres',
    email: 'dtorres@corphr.com',
    telefono: '+1 (555) 505-6070',
    departamento: 'Tecnología',
    cargo: 'Desarrollador Senior',
    salario: 4400,
    fechaIngreso: '2022-06-01',
    estado: 'activo',
    iniciales: 'DT',
    colorAvatar: 'linear-gradient(135deg, #4f8ef7, #38d9a9)',
  },
  {
    id: 6,
    nombre: 'Andrea',
    apellido: 'Morales',
    email: 'amorales@corphr.com',
    telefono: '+1 (555) 606-7080',
    departamento: 'Recursos Humanos',
    cargo: 'Analista de Nóminas',
    salario: 3200,
    fechaIngreso: '2023-02-14',
    estado: 'activo',
    iniciales: 'AM',
    colorAvatar: 'linear-gradient(135deg, #38d9a9, #f7a94f)',
  },
  {
    id: 7,
    nombre: 'Miguel',
    apellido: 'Castro',
    email: 'mcastro@corphr.com',
    telefono: '+1 (555) 707-8090',
    departamento: 'Tecnología',
    cargo: 'Diseñador UX',
    salario: 3800,
    fechaIngreso: '2022-09-20',
    estado: 'activo',
    iniciales: 'MC',
    colorAvatar: 'linear-gradient(135deg, #a78bfa, #4f8ef7)',
  },
  {
    id: 8,
    nombre: 'Patricia',
    apellido: 'Vega',
    email: 'pvega@corphr.com',
    telefono: '+1 (555) 808-9010',
    departamento: 'Finanzas',
    cargo: 'Contadora General',
    salario: 4100,
    fechaIngreso: '2021-08-05',
    estado: 'inactivo',
    iniciales: 'PV',
    colorAvatar: 'linear-gradient(135deg, #f75f5f, #f7a94f)',
  },
];

/* ─── FUNCIÓN AUXILIAR: generar fechas de los últimos 30 días ─── */
const generarFechas = () => {
  const fechas = [];
  const hoy = new Date(2026, 2, 10); // 10 de Marzo 2026
  for (let i = 29; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    // Saltar fines de semana
    const diaSemana = fecha.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      fechas.push(fecha.toISOString().split('T')[0]);
    }
  }
  return fechas;
};

/* ─── FUNCIÓN AUXILIAR: hora aleatoria de entrada ─── */
const horaEntrada = (tardio = false) => {
  if (tardio) {
    const minutos = Math.floor(Math.random() * 45) + 10;
    return `09:${String(minutos).padStart(2, '0')}`;
  }
  const minutos = Math.floor(Math.random() * 8);
  return `08:${String(minutos).padStart(2, '0')}`;
};

const horaSalida = () => {
  const minutos = Math.floor(Math.random() * 30);
  return `17:${String(minutos).padStart(2, '0')}`;
};

/* ─── ASISTENCIA: generar registros para los últimos 30 días ─── */
const fechasDeTrabajo = generarFechas();

export const attendance = [];
let idAsistencia = 1;

// Generar registros para cada empleado activo en cada día laboral
employees.forEach(emp => {
  if (emp.estado !== 'activo') return;

  fechasDeTrabajo.forEach(fecha => {
    // Probabilidad: 80% presente, 10% tardío, 10% ausente
    const aleatorio = Math.random();
    let estado, entrada, salida;

    if (aleatorio < 0.10) {
      estado = 'ausente';
      entrada = null;
      salida = null;
    } else if (aleatorio < 0.20) {
      estado = 'tardio';
      entrada = horaEntrada(true);
      salida = horaSalida();
    } else {
      estado = 'presente';
      entrada = horaEntrada(false);
      salida = horaSalida();
    }

    attendance.push({
      id: idAsistencia++,
      empleadoId: emp.id,
      fecha,
      entrada,
      salida,
      estado,
    });
  });
});

/* ─── USUARIO ACTUAL (por defecto: admin) ─── */
// Este objeto se usa como referencia inicial; AuthContext lo gestiona dinámicamente
export const currentUser = {
  rol: 'admin',
  empleadoId: null,
};

/* ─── CREDENCIALES SIMULADAS ─── */
// Para la pantalla de login; en producción esto vendría del backend
export const credenciales = [
  { email: 'admin@corphr.com', password: 'admin123', rol: 'admin', empleadoId: null },
  { email: 'cmendoza@corphr.com', password: 'emp123', rol: 'empleado', empleadoId: 1 },
  { email: 'lfernandez@corphr.com', password: 'emp123', rol: 'empleado', empleadoId: 2 },
  { email: 'rsalinas@corphr.com', password: 'emp123', rol: 'empleado', empleadoId: 3 },
  { email: 'dtorres@corphr.com', password: 'emp123', rol: 'empleado', empleadoId: 5 },
  { email: 'amorales@corphr.com', password: 'emp123', rol: 'empleado', empleadoId: 6 },
];

/* ─── DATOS DE ASISTENCIA MENSUAL (para el gráfico del Dashboard) ─── */
export const asistenciaMensual = [
  { mes: 'Oct', presentes: 85, tardios: 8, ausentes: 7 },
  { mes: 'Nov', presentes: 88, tardios: 6, ausentes: 6 },
  { mes: 'Dic', presentes: 80, tardios: 10, ausentes: 10 },
  { mes: 'Ene', presentes: 90, tardios: 5, ausentes: 5 },
  { mes: 'Feb', presentes: 87, tardios: 7, ausentes: 6 },
  { mes: 'Mar', presentes: 82, tardios: 9, ausentes: 9 },
];
