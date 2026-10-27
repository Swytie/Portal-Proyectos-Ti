'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOQUES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BLOCKS = [
  { letter: 'A', label: 'Información general',      sub: 'Tipo, versión y fechas' },
  { letter: 'B', label: 'Servicios y capacidad',     sub: 'Áreas, espacios y accesos' },
  { letter: 'C', label: 'Plantilla',                 sub: 'Posiciones y funciones' },
  { letter: 'D', label: 'Perfil de usuario',         sub: 'Asignación de equipo' },
  { letter: 'E', label: 'Equipamiento por espacio',  sub: 'Módulos, salas y espacios' },
  { letter: 'F', label: 'Infraestructura',           sub: 'Red, Wi-Fi, sites y UPS' },
  { letter: 'G', label: 'Sistemas y licencias',      sub: 'Aplicativos y tipo de licencia' },
  { letter: 'I', label: 'Reutilización',             sub: 'Equipamiento existente' },
  { letter: 'J', label: 'Excepciones',               sub: 'Revisión manual' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATÁLOGO DE UNIDADES REALES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const UNIDADES = [
  {
    nombre: 'Hospital Alta Especialidad CHRISTUS MUGUERZA',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 2400,
    camasUrg: 24, camasHosp: 48, consultorios: 18,
    estEnfermeria: 6, puestosFarmacia: 6, puestosAdmin: 22,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas', 'Imagenología'],
    inicio: '2026-09-01', apertura: '2027-06-01',
    alcance: 'Expansión del área de Urgencias y piso 6 de Hospitalización. Incluye nueva farmacia satélite, módulo de Imagenología y adecuación de oficinas administrativas.',
    posicionesPreset: [
      { nombre: 'Médico urgenciólogo', cantidad: 6, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas', 'Resultados'] },
      { nombre: 'Enfermera general', cantidad: 10, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Médico internista', cantidad: 4, area: 'Hospitalización', modalidad: 'presencial', turnos: 2, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Consulta de expediente'] },
      { nombre: 'Analista administrativo', cantidad: 6, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Gestión administrativa', 'Finanzas'] },
      { nombre: 'Químico farmacéutico', cantidad: 3, area: 'Farmacia satélite', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Farmacia', 'Inventarios'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Conchita',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 1600,
    camasUrg: 14, camasHosp: 28, consultorios: 10,
    estEnfermeria: 4, puestosFarmacia: 4, puestosAdmin: 14,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-10-01', apertura: '2027-04-01',
    alcance: 'Ampliación del área de Maternidad y UCI Neonatal. Remodelación de consultorios externos y creación de farmacia satélite en planta baja.',
    posicionesPreset: [
      { nombre: 'Ginecólogo obstetra', cantidad: 4, area: 'Consultorios externos', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción'] },
      { nombre: 'Enfermera neonatal', cantidad: 8, area: 'Hospitalización', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Recepcionista', cantidad: 4, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Admisión', 'Agenda'] },
      { nombre: 'Auxiliar de farmacia', cantidad: 2, area: 'Farmacia satélite', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Farmacia', 'Inventarios'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Cumbres',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 1800,
    camasUrg: 16, camasHosp: 30, consultorios: 12,
    estEnfermeria: 4, puestosFarmacia: 4, puestosAdmin: 16,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-11-01', apertura: '2027-05-01',
    alcance: 'Ampliación de piso 3 de hospitalización y apertura de nuevo módulo de consultorios externos. Incluye adecuación de farmacia y área administrativa.',
    posicionesPreset: [
      { nombre: 'Médico de urgencias', cantidad: 4, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas'] },
      { nombre: 'Enfermera general', cantidad: 8, area: 'Hospitalización', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería'] },
      { nombre: 'Coordinador administrativo', cantidad: 4, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Gestión administrativa'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Sur',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 2000,
    camasUrg: 18, camasHosp: 36, consultorios: 14,
    estEnfermeria: 5, puestosFarmacia: 4, puestosAdmin: 18,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas', 'Laboratorio'],
    inicio: '2026-08-01', apertura: '2027-02-01',
    alcance: 'Apertura de nuevo pabellón de hospitalización y expansión del área de Urgencias. Incluye laboratorio de análisis clínicos, farmacia satélite y módulo administrativo.',
    posicionesPreset: [
      { nombre: 'Médico urgenciólogo', cantidad: 5, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas', 'Resultados'] },
      { nombre: 'Enfermera general', cantidad: 9, area: 'Hospitalización', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Químico analista', cantidad: 2, area: 'Laboratorio', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Laboratorio', 'Resultados'] },
      { nombre: 'Analista de admisión', cantidad: 5, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Facturación'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Vidriera',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 1200,
    camasUrg: 10, camasHosp: 20, consultorios: 8,
    estEnfermeria: 3, puestosFarmacia: 3, puestosAdmin: 10,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-07-01', apertura: '2026-12-01',
    alcance: 'Remodelación y ampliación del área de Urgencias. Adecuación de consultorios y apertura de módulo de hemodiálisis.',
    posicionesPreset: [
      { nombre: 'Médico de urgencias', cantidad: 3, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas'] },
      { nombre: 'Enfermera general', cantidad: 6, area: 'Hospitalización', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería'] },
      { nombre: 'Recepcionista', cantidad: 3, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Admisión', 'Agenda'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA San Nicolás',
    ciudad: 'San Nicolás de los Garza, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 1400,
    camasUrg: 12, camasHosp: 24, consultorios: 10,
    estEnfermeria: 3, puestosFarmacia: 3, puestosAdmin: 12,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-09-01', apertura: '2027-03-01',
    alcance: 'Ampliación de área de Rehabilitación y Endocrinología. Nuevo módulo de consultorios y adecuación de farmacia.',
    posicionesPreset: [
      { nombre: 'Médico rehabilitador', cantidad: 3, area: 'Consultorios externos', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción'] },
      { nombre: 'Enfermera general', cantidad: 6, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Analista administrativo', cantidad: 4, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Facturación'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA San Pedro',
    ciudad: 'San Pedro Garza García, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 2600,
    camasUrg: 18, camasHosp: 36, consultorios: 16,
    estEnfermeria: 5, puestosFarmacia: 5, puestosAdmin: 20,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'UCI / Terapia intensiva', 'Farmacia satélite', 'Oficinas administrativas', 'Imagenología'],
    inicio: '2026-09-01', apertura: '2027-05-01',
    alcance: 'Ampliación de UCI adultos y expansión del área de Cardiología intervencionista. Nuevo piso de hospitalización, modernización de Imagenología y consultorios de alta especialidad.',
    posicionesPreset: [
      { nombre: 'Médico urgenciólogo', cantidad: 5, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas', 'Resultados'] },
      { nombre: 'Intensivista UCI', cantidad: 3, area: 'UCI / Terapia intensiva', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Órdenes médicas'] },
      { nombre: 'Cardiólogo intervencionista', cantidad: 3, area: 'Consultorios externos', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Imagenología'] },
      { nombre: 'Analista administrativo', cantidad: 7, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Facturación', 'Gestión administrativa'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Saltillo',
    ciudad: 'Saltillo, Coahuila',
    tipo: 'Expansión de servicios existentes',
    m2: 2200,
    camasUrg: 20, camasHosp: 40, consultorios: 16,
    estEnfermeria: 5, puestosFarmacia: 5, puestosAdmin: 20,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas', 'Laboratorio'],
    inicio: '2026-06-01', apertura: '2027-01-01',
    alcance: 'Ampliación del servicio de Hemodinamia y Gastroenterología. Nuevo piso de hospitalización, modernización de laboratorio y expansión de farmacia.',
    posicionesPreset: [
      { nombre: 'Cardiólogo intervencionista', cantidad: 3, area: 'Consultorios externos', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Imagenología'] },
      { nombre: 'Médico de urgencias', cantidad: 5, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas', 'Resultados'] },
      { nombre: 'Enfermera general', cantidad: 10, area: 'Hospitalización', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Analista de facturación', cantidad: 5, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Facturación', 'Caja', 'Gestión administrativa'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Reynosa',
    ciudad: 'Reynosa, Tamaulipas',
    tipo: 'Expansión de servicios existentes',
    m2: 1800,
    camasUrg: 16, camasHosp: 32, consultorios: 12,
    estEnfermeria: 4, puestosFarmacia: 4, puestosAdmin: 16,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-10-01', apertura: '2027-05-01',
    alcance: 'Apertura de servicios de Oncología y Neurología. Ampliación de área quirúrgica y adecuación de infraestructura para pacientes internacionales.',
    posicionesPreset: [
      { nombre: 'Oncólogo', cantidad: 3, area: 'Consultorios externos', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Consulta de expediente'] },
      { nombre: 'Médico de urgencias', cantidad: 4, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas'] },
      { nombre: 'Coordinador bilingüe', cantidad: 3, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Gestión administrativa'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Del Parque Juventud',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 1600,
    camasUrg: 14, camasHosp: 28, consultorios: 10,
    estEnfermeria: 4, puestosFarmacia: 4, puestosAdmin: 14,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-08-01', apertura: '2027-02-01',
    alcance: 'Ampliación del área de Ginecología y Obstetricia. Nuevo módulo de Hemodinamia e imagenología con mamografía digital.',
    posicionesPreset: [
      { nombre: 'Ginecólogo obstetra', cantidad: 4, area: 'Consultorios externos', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción'] },
      { nombre: 'Enfermera general', cantidad: 7, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Analista administrativo', cantidad: 4, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Facturación'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Puebla',
    ciudad: 'Puebla, Puebla',
    tipo: 'Expansión de servicios existentes',
    m2: 1900,
    camasUrg: 16, camasHosp: 32, consultorios: 14,
    estEnfermeria: 4, puestosFarmacia: 4, puestosAdmin: 16,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas', 'Laboratorio'],
    inicio: '2026-09-01', apertura: '2027-04-01',
    alcance: 'Apertura de UCI Neonatal y ampliación de Cardiología. Nuevo piso de hospitalización y modernización del laboratorio de análisis clínicos.',
    posicionesPreset: [
      { nombre: 'Cardiólogo', cantidad: 3, area: 'Consultorios externos', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Imagenología'] },
      { nombre: 'Neonatólogo', cantidad: 3, area: 'UCI / Terapia intensiva', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Órdenes médicas'] },
      { nombre: 'Enfermera neonatal', cantidad: 8, area: 'UCI / Terapia intensiva', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Analista administrativo', cantidad: 5, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Facturación', 'Finanzas'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Murano',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Nueva unidad / torre',
    m2: 2800,
    camasUrg: 16, camasHosp: 34, consultorios: 14,
    estEnfermeria: 4, puestosFarmacia: 4, puestosAdmin: 18,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas', 'Laboratorio'],
    inicio: '2026-10-01', apertura: '2027-08-01',
    alcance: 'Hospital de nueva construcción en la zona norte de Monterrey. Capacidad para 50 camas, urgencias y hospitalización de alta calidad, laboratorio integrado y consultorios de especialidades.',
    posicionesPreset: [
      { nombre: 'Médico urgenciólogo', cantidad: 4, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas', 'Resultados'] },
      { nombre: 'Médico internista', cantidad: 4, area: 'Hospitalización', modalidad: 'presencial', turnos: 2, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Consulta de expediente'] },
      { nombre: 'Analista administrativo', cantidad: 6, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Facturación', 'Gestión administrativa'] },
      { nombre: 'Químico analista', cantidad: 2, area: 'Laboratorio', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Laboratorio', 'Resultados'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Altagracia',
    ciudad: 'León, Guanajuato',
    tipo: 'Expansión de servicios existentes',
    m2: 1700,
    camasUrg: 14, camasHosp: 28, consultorios: 12,
    estEnfermeria: 4, puestosFarmacia: 4, puestosAdmin: 14,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-07-01', apertura: '2027-01-01',
    alcance: 'Apertura de Centro de Cáncer de Mama y modernización de Cardiología. Ampliación del banco de sangre y nuevas habitaciones de hospitalización.',
    posicionesPreset: [
      { nombre: 'Oncólogo mamólogo', cantidad: 2, area: 'Consultorios externos', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción', 'Imagenología'] },
      { nombre: 'Médico de urgencias', cantidad: 4, area: 'Urgencias', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Órdenes médicas'] },
      { nombre: 'Enfermera oncológica', cantidad: 6, area: 'Hospitalización', modalidad: 'presencial', turnos: 2, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Analista administrativo', cantidad: 4, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Facturación'] },
    ],
  },
  {
    nombre: 'Hospital CHRISTUS MUGUERZA Faro del Mayab',
    ciudad: 'Mérida, Yucatán',
    tipo: 'Expansión de servicios existentes',
    m2: 2000,
    camasUrg: 16, camasHosp: 32, consultorios: 14,
    estEnfermeria: 4, puestosFarmacia: 5, puestosAdmin: 18,
    areas: ['Urgencias', 'Hospitalización', 'Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas', 'Imagenología'],
    inicio: '2026-08-01', apertura: '2027-03-01',
    alcance: 'Ampliación del área de Imagenología con resonancia magnética de 3 Tesla y tomógrafo de 128 cortes. Nuevo pabellón de hospitalización y expansión del área de Infectología.',
    posicionesPreset: [
      { nombre: 'Radiólogo', cantidad: 3, area: 'Imagenología', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Imagenología', 'Resultados', 'Documentación clínica'] },
      { nombre: 'Infectólogo', cantidad: 2, area: 'Consultorios externos', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Consulta / atención al paciente', 'Documentación clínica', 'Prescripción'] },
      { nombre: 'Enfermera general', cantidad: 8, area: 'Hospitalización', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Documentación clínica', 'Enfermería', 'Órdenes médicas'] },
      { nombre: 'Analista administrativo', cantidad: 6, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Admisión', 'Agenda', 'Gestión administrativa'] },
    ],
  },
  {
    nombre: 'Centro de Servicio 7-24 CHRISTUS MUGUERZA',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 800,
    camasUrg: 0, camasHosp: 0, consultorios: 6,
    estEnfermeria: 0, puestosFarmacia: 2, puestosAdmin: 20,
    areas: ['Consultorios externos', 'Farmacia satélite', 'Oficinas administrativas'],
    inicio: '2026-07-01', apertura: '2026-12-01',
    alcance: 'Expansión del equipo de servicio al cliente y soporte técnico 7-24. Nuevos puestos de atención, farmacia de conveniencia y área de backoffice.',
    posicionesPreset: [
      { nombre: 'Agente de servicio', cantidad: 10, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Admisión', 'Agenda', 'Gestión administrativa'] },
      { nombre: 'Coordinador de turno', cantidad: 3, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 3, dedicado: false, funciones: ['Admisión', 'Agenda', 'Gestión administrativa', 'Cobranza'] },
      { nombre: 'Auxiliar de farmacia', cantidad: 2, area: 'Farmacia satélite', modalidad: 'presencial', turnos: 2, dedicado: true, funciones: ['Farmacia', 'Inventarios'] },
    ],
  },
  {
    nombre: 'Corporativo CHRISTUS MUGUERZA',
    ciudad: 'Monterrey, Nuevo León',
    tipo: 'Expansión de servicios existentes',
    m2: 1200,
    camasUrg: 0, camasHosp: 0, consultorios: 0,
    estEnfermeria: 0, puestosFarmacia: 0, puestosAdmin: 40,
    areas: ['Oficinas administrativas'],
    inicio: '2026-08-01', apertura: '2026-11-01',
    alcance: 'Remodelación de pisos 4 y 5 de corporativo. Nuevas estaciones de trabajo para áreas de Finanzas, RH, TI y Dirección General. Incluye sala de juntas equipada y área de trabajo colaborativo.',
    posicionesPreset: [
      { nombre: 'Analista de finanzas', cantidad: 10, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['Facturación', 'Finanzas', 'Cobranza', 'Compras'] },
      { nombre: 'Analista de RH', cantidad: 6, area: 'Oficinas administrativas', modalidad: 'presencial', turnos: 1, dedicado: true, funciones: ['RH', 'Gestión administrativa'] },
      { nombre: 'Analista TI', cantidad: 5, area: 'Oficinas administrativas', modalidad: 'movil', turnos: 1, dedicado: true, funciones: ['Gestión administrativa', 'Compras'] },
      { nombre: 'Gerente de área', cantidad: 8, area: 'Oficinas administrativas', modalidad: 'movil', turnos: 1, dedicado: true, funciones: ['Gestión administrativa', 'Finanzas', 'RH'] },
    ],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATÁLOGO DE FUNCIONES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FUNCIONES = {
  clinica: [
    'Consulta / atención al paciente', 'Documentación clínica', 'Prescripción',
    'Consulta de expediente', 'Órdenes médicas', 'Resultados',
    'Enfermería', 'Imagenología', 'Laboratorio',
  ],
  admin: [
    'Admisión', 'Agenda', 'Facturación', 'Caja', 'Cobranza',
    'Compras', 'Almacén', 'Finanzas', 'RH', 'Gestión administrativa',
  ],
  operativa: [
    'Farmacia', 'Inventarios', 'Traslados', 'Logística',
    'Mantenimiento', 'Servicios generales',
  ],
};

// Costos unitarios en MXN
const COSTOS = {
  pcClinica:     38_000,
  pcAdmin:       24_000,
  impresora:     17_500,
  telefono:       4_800,
  ap:            28_000,
  switch48:      95_000,
  puntoRed:       3_500,
  camara:         8_500,
  lector:        12_000,
  ups:           16_000,
  implementacion: 0.14, // % del CAPEX hardware
  tasy:         185_000, // por licencia concurrente/año
  sapWM:         98_000, // por usuario/año
  m365:           4_400, // por usuario/mes × 12
};

const AREAS_CLINICAS = ['Hospitalización','Urgencias','Consulta externa','Quirófanos','Imagenología','Laboratorio','Farmacia','Áreas médicas','Enfermería'];

// ── Paquete tecnológico estándar por tipo de espacio físico ──────
// pc: workstations, puntoRed: puntos de red (por nodo/unidad), tel: teléfonos IP
// imp: impresoras (fraccionario = compartida), lector: lector código de barras
// ap: access points (fraccionario = compartido entre N unidades)
// tasy: requiere licencia TASY, sap: requiere SAP
const ESPACIOS_PAQUETE = {
  // ── Clínico hospitalario ─────────────────────────────────────────
  'Habitaciones ordinarias': { label:'Habitación ordinaria',    pc:0, puntoRed:3, tel:1, imp:0,   lector:0.5, ap:0.25, tasy:true,  sap:false },
  'Habitaciones privadas':   { label:'Habitación privada/VIP',  pc:1, puntoRed:3, tel:1, imp:0,   lector:0.5, ap:0.5,  tasy:true,  sap:false },
  'Consultorios':            { label:'Consultorio',             pc:1, puntoRed:3, tel:1, imp:0,   lector:0,   ap:0.33, tasy:true,  sap:false },
  'Estaciones de enfermería':{ label:'Estación de enfermería',  pc:1, puntoRed:3, tel:1, imp:0.5, lector:1,   ap:1,    tasy:true,  sap:false },
  'Cuartos médicos':         { label:'Cuarto médico',           pc:1, puntoRed:2, tel:1, imp:0,   lector:0,   ap:0,    tasy:true,  sap:false },
  'Quirófanos':              { label:'Quirófano',               pc:1, puntoRed:6, tel:0, imp:0,   lector:1,   ap:1,    tasy:true,  sap:false },
  'Salas de procedimiento':  { label:'Sala de procedimiento',   pc:1, puntoRed:4, tel:0, imp:0,   lector:1,   ap:1,    tasy:true,  sap:false },
  // ── Servicios de apoyo ───────────────────────────────────────────
  'Farmacias':               { label:'Farmacia',                pc:1, puntoRed:4, tel:1, imp:1,   lector:2,   ap:1,    tasy:false, sap:true  },
  'Módulos de admisión':     { label:'Módulo de admisión',      pc:1, puntoRed:3, tel:1, imp:0.5, lector:0,   ap:0,    tasy:false, sap:false },
  'Cajas':                   { label:'Caja',                    pc:1, puntoRed:2, tel:1, imp:1,   lector:0,   ap:0,    tasy:false, sap:false },
  'Recepciones':             { label:'Recepción',               pc:1, puntoRed:3, tel:1, imp:0.5, lector:0,   ap:0,    tasy:false, sap:false },
  // ── Administración e infraestructura ────────────────────────────
  'Oficinas':                { label:'Oficina',                 pc:1, puntoRed:2, tel:1, imp:0.5, lector:0,   ap:0,    tasy:false, sap:false },
  'Salas de juntas':         { label:'Sala de juntas',          pc:0, puntoRed:6, tel:1, imp:0,   lector:0,   ap:1,    tasy:false, sap:false },
  'Áreas de espera':         { label:'Área de espera',          pc:0, puntoRed:1, tel:0, imp:0,   lector:0,   ap:0.33, tasy:false, sap:false },
  'Otros':                   { label:'Otro espacio',            pc:1, puntoRed:2, tel:1, imp:0,   lector:0,   ap:0,    tasy:false, sap:false },
};

// ── Categorías de reutilización ──────────────────────────────────
const REUTIL_CATEGORIAS = [
  { key:'pc',         label:'Equipo de cómputo (PC/AIO)',  costo: 38_000 },
  { key:'monitores',  label:'Monitores',                   costo: 8_000  },
  { key:'impresoras', label:'Impresoras',                  costo: 17_500 },
  { key:'telefonos',  label:'Telefonía IP',                costo: 4_800  },
  { key:'aps',        label:'Access Points',               costo: 28_000 },
  { key:'switches',   label:'Switches',                    costo: 95_000 },
  { key:'ups',        label:'UPS',                         costo: 16_000 },
  { key:'racks',      label:'Racks',                       costo: 18_000 },
  { key:'licencias',  label:'Licencias (usuarios)',        costo: 4_400  },
  { key:'infra',      label:'Infraestructura (cableado)',  costo: 3_500  },
  { key:'equipClin',  label:'Equipamiento clínico TI',     costo: 12_000 },
];

// Estado: detalle de áreas Bloque B
let areasConfig = {};   // { 'Urgencias': { total,nuevos,existentes,estacion,telefonia,impresion,clinico,sistemas } }
// Estado: espacios físicos Bloque E
let espaciosNuevos = {}; // { 'Consultorios': 5, ... }
let espaciosPkgOverride = {}; // { 'Consultorios': { pc:2, ... } } — sobreescrituras del usuario
let espaciosCustomNombre = {}; // { 'Otros': 'Almacén central' }

// Devuelve el paquete base fusionado con cualquier override del usuario
function getPkg(tipo) {
  const base = ESPACIOS_PAQUETE[tipo];
  if (!base) return null;
  return { ...base, ...(espaciosPkgOverride[tipo] || {}) };
}

// Estado: existente utilizable Bloque I
let reutilExistente = {}; // { 'pc': 2, ... }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REGLAS DE PERFIL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PERFIL_RULES = [
  {
    letra: 'A', nombre: 'Clínico fijo',
    test: p => FUNCIONES.clinica.some(f => p.funciones.includes(f)) && p.dedicado,
    razon: 'Función clínica con equipo dedicado. Se asigna una estación por persona.',
  },
  {
    letra: 'B', nombre: 'Clínico compartido',
    test: p => FUNCIONES.clinica.some(f => p.funciones.includes(f)) && !p.dedicado && p.turnos >= 2,
    razon: p => `Función clínica en ${p.turnos} turnos sin equipo dedicado. Se asigna una estación por turno, no por persona.`,
  },
  {
    letra: 'E', nombre: 'Móvil',
    test: p => FUNCIONES.admin.some(f => p.funciones.includes(f)) && p.modalidad === 'movil',
    razon: 'Funciones administrativas con movilidad. Laptop y acceso remoto.',
  },
  {
    letra: 'D', nombre: 'Operativo',
    test: p => FUNCIONES.operativa.some(f => p.funciones.includes(f))
            && !FUNCIONES.admin.some(f => p.funciones.includes(f))
            && !FUNCIONES.clinica.some(f => p.funciones.includes(f)),
    razon: 'Funciones operativas sin trabajo de escritorio. Terminal o tableta según el proceso.',
  },
  {
    letra: 'C', nombre: 'Administrativo fijo',
    test: p => FUNCIONES.admin.some(f => p.funciones.includes(f)),
    razon: 'Funciones administrativas en posición fija. PC o laptop con M365 y SAP según función.',
  },
  {
    letra: 'F', nombre: 'Sin estación',
    test: () => true,
    razon: 'Sin funciones seleccionadas. Solo se provisiona identidad y accesos básicos.',
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let current = 0;
const done = new Set();

let posiciones = JSON.parse(JSON.stringify(UNIDADES[0].posicionesPreset)).map((p, i) => ({ id: i + 1, ...p }));
let nextId = posiciones.length + 1;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVEGACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function goTo(idx) {
  if (idx < 0 || idx >= BLOCKS.length) return;
  done.add(current);
  document.querySelector(`.pm-block[data-block="${current}"]`)?.classList.remove('active');
  current = idx;
  document.querySelector(`.pm-block[data-block="${current}"]`)?.classList.add('active');
  buildStepper();
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBlock(dir) { goTo(current + dir); }

function buildStepper() {
  const el = document.getElementById('pm-stepper');
  el.innerHTML = '<div class="pm-step-lbl">Cuestionario</div>';
  BLOCKS.forEach((b, i) => {
    const isComplete = isBlockComplete(i);
    const isActive = i === current;
    const div = document.createElement('div');
    div.className = 'pm-step' + (isComplete ? ' done' : '') + (isActive ? ' active' : '');
    div.onclick = () => goTo(i);
    div.innerHTML = `
      <div class="pm-step-ico">${isComplete ? '<i class="ti ti-check"></i>' : b.letter}</div>
      <div class="pm-step-info">
        <div class="pm-step-name">${b.label}</div>
        <div class="pm-step-sub">${b.sub}</div>
      </div>`;
    el.appendChild(div);
  });
}

function updateProgress() {
  const pct = Math.round(((current + 1) / BLOCKS.length) * 100);
  document.getElementById('pm-prog-fill').style.width = pct + '%';
  document.getElementById('pm-prog-txt').textContent = `Bloque ${current + 1} de ${BLOCKS.length}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARGA DE UNIDAD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function cargarUnidad(idx) {
  const u = UNIDADES[idx];
  if (!u) return;

  // Bloque A — combo unidad
  const comboInput = document.getElementById('campo-nombre');
  if (comboInput) comboInput.value = u.nombre;
  document.getElementById('campo-unidad').value = idx;
  const clearBtn = document.getElementById('unidad-clear');
  if (clearBtn) clearBtn.style.display = 'flex';
  setVal('campo-ciudad',   u.ciudad);
  setVal('campo-tipo',     u.tipo);
  dpSetValue('campo-inicio',   u.inicio);
  setVal('campo-alcance',  u.alcance);

  // Bloque B — seleccionar áreas y generar areasConfig desde preset
  areasConfig = {};
  document.querySelectorAll('#bloque-b-chips .pm-chip').forEach(chip => {
    const area = chip.dataset.area || chip.textContent.trim();
    const esDeLaUnidad = u.areas.some(a => a.toLowerCase().includes(area.toLowerCase()) || area.toLowerCase().includes(a.toLowerCase()));
    chip.classList.toggle('sel', esDeLaUnidad);
    if (esDeLaUnidad) {
      areasConfig[area] = {
        total: 0, nuevos: 0, existentes: 0,
        estacion: true, telefonia: true, impresion: 'compartida',
        clinico: AREAS_CLINICAS.includes(area),
        sistemas: AREAS_CLINICAS.includes(area) ? 'TASY' : 'M365',
      };
    }
  });
  renderAreaDetalles();

  // Bloque E — espacios físicos desde preset de capacidad
  espaciosNuevos = {};
  if (u.camasHosp)      espaciosNuevos['Habitaciones ordinarias'] = Math.round(u.camasHosp * 0.8);
  if (u.camasHosp)      espaciosNuevos['Habitaciones privadas']   = Math.round(u.camasHosp * 0.2);
  if (u.camasUrg)       espaciosNuevos['Estaciones de enfermería'] = u.estEnfermeria || 0;
  if (u.consultorios)   espaciosNuevos['Consultorios'] = u.consultorios;
  if (u.puestosAdmin)   espaciosNuevos['Oficinas'] = Math.ceil(u.puestosAdmin / 4);
  if (u.puestosFarmacia) espaciosNuevos['Farmacias'] = Math.ceil(u.puestosFarmacia / 2);
  if (u.camasUrg)       espaciosNuevos['Áreas de espera'] = Math.ceil(u.camasUrg / 6);
  renderEspacios();

  // Bloque F — m²
  setVal('campo-m2', u.m2);

  // Bloque C — posiciones
  document.getElementById('plantilla-si').checked = true;
  togglePlantilla();
  posiciones = JSON.parse(JSON.stringify(u.posicionesPreset)).map((p, i) => ({ id: i + 1, preset: true, disabled: false, ...p }));
  nextId = posiciones.length + 1;
  document.getElementById('posiciones-list').innerHTML = '';
  renderPosiciones();

  calcReglas();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTOR DE REGLAS DINÁMICO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calcReglas() {
  const m2 = +getVal('campo-m2') || 0;

  // ── 1. Equipo desde PLANTILLA (Bloque C) ──────────────────────
  let pcClinicaPos = 0, pcAdminPos = 0, moviles = 0;
  const tienePersonal = document.getElementById('plantilla-si')?.checked !== false;
  if (tienePersonal) {
    posiciones.filter(p => !p.disabled).forEach(p => {
      const pf = calcPerfil(p);
      if (pf.letra === 'A') pcClinicaPos += p.cantidad;
      else if (pf.letra === 'B') pcClinicaPos += p.turnos;
      else if (pf.letra === 'C') pcAdminPos += p.cantidad;
      else if (pf.letra === 'E') moviles += p.cantidad;
    });
  }

  // ── 2. Equipo desde ESPACIOS FÍSICOS (Bloque E) ───────────────
  let pcEsp = 0, puntosEsp = 0, telEsp = 0, impEsp = 0, lectorEsp = 0, apEsp = 0;
  let tasyDeEspacios = 0, sapDeEspacios = 0;
  Object.entries(espaciosNuevos).forEach(([tipo, qty]) => {
    if (!qty) return;
    const pkg = getPkg(tipo);
    if (!pkg) return;
    pcEsp      += pkg.pc       * qty;
    puntosEsp  += pkg.puntoRed * qty;
    telEsp     += pkg.tel      * qty;
    impEsp     += pkg.imp      * qty;
    lectorEsp  += pkg.lector   * qty;
    apEsp      += pkg.ap       * qty;
    if (pkg.tasy) tasyDeEspacios += qty;
    if (pkg.sap)  sapDeEspacios  += qty;
  });

  // ── 3. Combinar ambas dimensiones (máximo) ────────────────────
  const pcTotal   = Math.max(pcClinicaPos + pcAdminPos, pcEsp);
  const pcClinica = Math.max(pcClinicaPos, Math.round(pcEsp * 0.6));
  const pcAdmin   = Math.max(pcAdminPos,   Math.round(pcEsp * 0.4));
  const areasSelCount = [...document.querySelectorAll('#bloque-b-chips .pm-chip.sel')].length;
  const impresoras = areasSelCount === 0 && impEsp === 0 ? 0
    : Math.max(1, Math.ceil(impEsp) + Math.ceil(areasSelCount / 3));
  const telefonos  = Math.max(telEsp, Math.ceil((pcClinica + pcAdmin) * 1.1 / 5) * 5);
  const lectorTotal = lectorEsp;

  // APs: mayor entre cobertura por m² y suma de APs por tipo de espacio
  const apsDesdeM2      = m2 ? Math.ceil(m2 / 150) : 0;
  const apsDeEspacios   = Math.ceil(apEsp);
  const aps             = Math.max(apsDesdeM2, apsDeEspacios);

  // Puntos de red: asegurar suficientes para todos los dispositivos + 20% headroom
  const puntosRed = Math.max(puntosEsp,
    Math.ceil((pcClinica + pcAdmin + telefonos + aps + lectorTotal + Math.ceil(impresoras * 0.5)) * 1.2));

  // Switches 48p: 1 por cada 24 puertos activos (uplinks + PoE + headroom)
  const portsDemand = pcClinica + pcAdmin + telefonos + aps + lectorTotal + Math.ceil(impresoras * 0.5);
  const switches = Math.max(
    Math.ceil(portsDemand / 24),
    Math.ceil(aps / 8)           // mínimo 1 switch por cada 8 APs (backhaul PoE)
  );
  const upsUnits = Math.ceil((pcClinica + pcAdmin) / 20);

  // ── 4. Licencias (Bloque G derivadas) ─────────────────────────
  const licTasy = Math.max(+getVal('campo-lic-tasy') || 0, tasyDeEspacios);
  const licSap  = Math.max(+getVal('campo-lic-sap')  || 0, sapDeEspacios);
  const licM365 = Math.max(+getVal('campo-lic-m365') || 0, pcAdminPos + moviles);

  // ── 5. Reutilización (Bloque I) ───────────────────────────────
  actualizarTablaReutilizacion({ pcTotal: pcClinica + pcAdmin, telefonos, aps, switches, impresoras, upsUnits });
  const ahorroReutil = calcAhorroReutilizacion();

  // ── 6. Campos calculados ──────────────────────────────────────
  setVal('campo-aps-calc',      aps);
  setVal('campo-switches-calc', switches);
  setVal('campo-puntos-calc',   puntosRed);
  // Nota de origen del cálculo de APs
  const apNota = document.getElementById('ap-nota');
  if (apNota) {
    if (apsDeEspacios > 0 && apsDeEspacios >= apsDesdeM2)
      apNota.textContent = `Por tipos de espacio: ${apsDeEspacios} AP · Por m²: ${apsDesdeM2} AP`;
    else if (apsDesdeM2 > 0)
      apNota.textContent = `Por m² (1 c/150 m²): ${apsDesdeM2} AP${apsDeEspacios > 0 ? ` · Por espacios: ${apsDeEspacios} AP` : ''}`;
    else
      apNota.textContent = '';
  }

  // ── 7. Presupuesto ────────────────────────────────────────────
  const areasClinicas = [...document.querySelectorAll('#bloque-b-chips .pm-chip.sel')]
    .map(c => c.textContent.trim()).filter(a => AREAS_CLINICAS.includes(a));

  const capexHW = pcClinica * COSTOS.pcClinica
                + pcAdmin   * COSTOS.pcAdmin
                + moviles   * COSTOS.pcAdmin
                + impresoras * COSTOS.impresora
                + telefonos  * COSTOS.telefono
                + aps        * COSTOS.ap
                + switches   * COSTOS.switch48
                + puntosRed  * COSTOS.puntoRed
                + lectorTotal * COSTOS.lector
                + upsUnits   * COSTOS.ups;
  const implementacion = Math.round(capexHW * COSTOS.implementacion);
  const capex = capexHW + implementacion - ahorroReutil;
  const opex  = licTasy * COSTOS.tasy + licSap * COSTOS.sapWM + licM365 * COSTOS.m365 * 12;

  actualizarTablaPresupuesto({ pcClinica, pcAdmin, impresoras, telefonos, aps, switches,
    puntosRed, lectores: lectorTotal, upsUnits, implementacion,
    tasyLic: licTasy, sapLic: licSap, m365Lic: licM365, capex, opex, ahorro: ahorroReutil });

  actualizarPanel({ pcClinica, pcAdmin, moviles, impresoras, telefonos, aps, switches,
    puntosRed, tasyLic: licTasy, sapLic: licSap, m365Lic: licM365, ahorro: ahorroReutil, areasClinicas });

  actualizarBloqueD({ pcClinica, pcAdmin, moviles });
  buildStepper();
}

function getVal(id) {
  return document.getElementById(id)?.value ?? '';
}

function mxn(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + ' M';
  if (n >= 1_000)     return '$' + Math.round(n / 1_000) + ' K';
  return '$' + n;
}

function actualizarPanel({ pcClinica, pcAdmin, moviles, impresoras, telefonos, aps, switches, puntosRed, tasyLic, sapLic, m365Lic, ahorro, areasClinicas }) {
  const panel = document.getElementById('panel-body');
  if (!panel) return;
  panel.innerHTML = `
    <div class="pm-rule-section">Por espacio</div>
    ${ruleItem('var(--p)',     'PC estación clínica',    `${areasClinicas.length > 0 ? areasClinicas.join(', ') : 'sin áreas clínicas'}`, pcClinica, true)}
    ${ruleItem('var(--blue)',  'PC estación administrativa', 'Oficinas y farmacia', pcAdmin, true)}
    ${moviles > 0 ? ruleItem('var(--blue)', 'Laptop móvil', 'Posiciones con modalidad móvil', moviles, true) : ''}
    ${ruleItem('var(--t2)',    'Impresora compartida',   '1 por cada 2 áreas', impresoras, true)}
    ${ruleItem('var(--t2)',    'Teléfono IP',            'Estimado por puestos', telefonos, true)}

    <div class="pm-rule-section">Infraestructura</div>
    ${ruleItem('var(--amber)', 'Access Points Wi-Fi 6',  '1 AP por cada 150 m²', aps, false)}
    ${ruleItem('var(--t2)',    'Switches 48p PoE',       'Calculado con 20% de reserva', switches, false)}
    ${ruleItem('var(--t2)',    'Puntos de red',          'Equipos + teléfonos + APs', puntosRed, false)}

    <div class="pm-rule-section">Sistemas</div>
    ${ruleItem('var(--red)',   'TASY concurrente',       `${tasyLic} área${tasyLic !== 1 ? 's' : ''} clínica${tasyLic !== 1 ? 's' : ''}`, tasyLic, true)}
    ${sapLic > 0 ? ruleItem('var(--amber)', 'SAP WM', 'Farmacia e inventarios', sapLic, true) : ''}
    ${m365Lic > 0 ? ruleItem('var(--t2)', 'Microsoft 365', 'Puestos administrativos', m365Lic, true) : ''}

    <div class="pm-rule-section">Reutilización</div>
    <div class="pm-rule-item ahorro">
      <div class="pm-rule-dot" style="background:var(--green)"></div>
      <div class="pm-rule-body">
        <div class="pm-rule-name" style="color:var(--green)">Ahorro estimado</div>
        <div class="pm-rule-desc">PC, monitores, red y teléfonos existentes</div>
      </div>
      <div class="pm-rule-qty verde">${mxn(ahorro)}</div>
    </div>`;
}

function ruleItem(color, nombre, desc, qty, nuevo) {
  return `<div class="pm-rule-item ${nuevo ? 'nuevo' : ''}">
    <div class="pm-rule-dot" style="background:${color}"></div>
    <div class="pm-rule-body">
      <div class="pm-rule-name">${nombre}</div>
      <div class="pm-rule-desc">${desc}</div>
    </div>
    <div class="pm-rule-qty">${qty}</div>
  </div>`;
}

function actualizarTablaPresupuesto({ pcClinica, pcAdmin, impresoras, telefonos, aps, switches,
  puntosRed, lectores, upsUnits, implementacion, tasyLic, sapLic, m365Lic,
  capex, opex, ahorro }) {

  const rows = [
    ['PC estación clínica',         pcClinica * COSTOS.pcClinica,       0],
    ['PC estación administrativa',  pcAdmin * COSTOS.pcAdmin,           0],
    ['Impresoras compartidas',      impresoras * COSTOS.impresora,      0],
    ['Teléfonos IP',                telefonos * COSTOS.telefono,        0],
    ['Access Points Wi-Fi 6',       aps * COSTOS.ap,                    0],
    ['Switches 48p PoE',            switches * COSTOS.switch48,         0],
    ['Cableado estructurado',       puntosRed * COSTOS.puntoRed,        0],
    ...(lectores > 0 ? [['Lectores de acceso (clínico)',  lectores * COSTOS.lector, 0]] : []),
    ['UPS',                         upsUnits * COSTOS.ups,              0],
    ['Implementación y puesta en marcha', implementacion,               0],
    ['TASY concurrente',            0,   tasyLic * COSTOS.tasy],
    ...(sapLic > 0 ? [['SAP WM', 0, sapLic * COSTOS.sapWM]] : []),
    ...(m365Lic > 0 ? [['Microsoft 365', 0, m365Lic * COSTOS.m365 * 12]] : []),
    ['Reutilización (descuento)',   -ahorro,   0],
  ];

  const tbody = document.getElementById('tabla-presupuesto-body');
  if (!tbody) return;

  // Si no hay nada calculado, mostrar estado vacío
  if (capex === 0 && opex === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--t3);padding:24px;font-size:12px">
      Completa los bloques anteriores para generar el presupuesto estimado.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .filter(([, cap, op]) => cap !== 0 || op !== 0)  // ocultar filas vacías
    .map(([rubro, cap, op]) => `
    <tr>
      <td>${rubro}</td>
      <td class="${cap < 0 ? 'td-ahorro' : cap > 0 ? 'td-capex' : 'td-dash'}" style="text-align:right">
        ${cap !== 0 ? mxn(cap) : ''}
      </td>
      <td class="${op > 0 ? 'td-opex' : 'td-dash'}" style="text-align:right">
        ${op > 0 ? mxn(op) + ' / año' : ''}
      </td>
    </tr>`).join('') + `
    <tr class="tr-total">
      <td>Total estimado</td>
      <td class="td-capex" style="text-align:right">${mxn(capex - ahorro)}</td>
      <td class="td-opex" style="text-align:right">${mxn(opex)} / año</td>
    </tr>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POSICIONES — Bloque C
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calcPerfil(pos) {
  const rule = PERFIL_RULES.find(r => r.test(pos));
  return {
    letra: rule.letra,
    nombre: rule.nombre,
    razon: typeof rule.razon === 'function' ? rule.razon(pos) : rule.razon,
  };
}

function renderPosiciones() {
  const list = document.getElementById('posiciones-list');
  list.innerHTML = '';

  posiciones.forEach((pos, idx) => {
    const pf = calcPerfil(pos);
    const isOpen = list.dataset['open_' + pos.id] === '1';

    const card = document.createElement('div');
    card.className = 'pos-card' + (isOpen ? ' open' : '');
    card.id = 'poscard-' + pos.id;

    const isDisabled = pos.disabled === true;
    card.innerHTML = `
      <div class="pos-header${isDisabled ? ' pos-header-disabled' : ''}">
        ${pos.preset
          ? `<label class="pos-toggle" onclick="event.stopPropagation()" title="${isDisabled ? 'Activar' : 'Desactivar'} posición">
               <input type="checkbox" ${isDisabled ? '' : 'checked'} onchange="togglePosDisabled(${pos.id},!this.checked)">
               <span class="pos-toggle-track"></span>
             </label>`
          : `<div class="pos-num" onclick="togglePos(${pos.id})">${idx + 1}</div>`
        }
        <div style="flex:1;min-width:0;cursor:pointer;opacity:${isDisabled?'.4':'1'}" onclick="togglePos(${pos.id})">
          <div class="pos-title">
            ${pos.preset
              ? `<span style="font-size:12px;font-weight:600;color:var(--t1)">${pos.nombre}</span>`
              : `<input class="pos-nombre-inline" value="${pos.nombre}"
                   placeholder="Nombre del puesto"
                   onclick="event.stopPropagation()"
                   onblur="setPos(${pos.id},'nombre',this.value)"
                   onkeydown="if(event.key==='Enter'){this.blur();event.preventDefault()}"
                   oninput="setPos(${pos.id},'nombre',this.value)">`
            }
            <span style="font-weight:400;color:var(--t3);margin-left:4px">× ${pos.cantidad}</span>
          </div>
          <div class="pos-subtitle">${pos.area || 'Sin área'} · ${pos.modalidad} · ${pos.turnos} turno${pos.turnos !== 1 ? 's' : ''}</div>
        </div>
        <span class="pos-badge-perfil ${pf.letra}" style="cursor:default;opacity:${isDisabled?'.35':'1'}">${pf.letra} — ${pf.nombre}</span>
        ${!pos.preset
          ? `<button class="pos-delete-hdr" onclick="event.stopPropagation();deletePos(${pos.id})" title="Eliminar posición">
               <i class="ti ti-trash"></i>
             </button>`
          : ''
        }
        <span class="pos-chevron" onclick="togglePos(${pos.id})" style="opacity:${isDisabled?'.3':'1'}">▼</span>
      </div>
      <div class="pos-body">
        <div class="pos-fields">
          <div class="pm-field">
            <label class="pm-label">Nombre del puesto</label>
            <input class="pm-input" value="${pos.nombre}" oninput="setPos(${pos.id},'nombre',this.value)">
          </div>
          <div class="pm-field">
            <label class="pm-label">Cantidad</label>
            <input class="pm-input" type="number" min="1" value="${pos.cantidad}" oninput="setPos(${pos.id},'cantidad',+this.value)">
          </div>
          <div class="pm-field">
            <label class="pm-label">Área</label>
            <input class="pm-input" value="${pos.area}" oninput="setPos(${pos.id},'area',this.value)">
          </div>
          <div class="pm-field">
            <label class="pm-label">Turnos</label>
            <input class="pm-input" type="number" min="1" max="3" value="${pos.turnos}" oninput="setPos(${pos.id},'turnos',+this.value)">
          </div>
          <div class="pm-field">
            <label class="pm-label">Modalidad</label>
            <select class="pm-select" onchange="setPos(${pos.id},'modalidad',this.value)">
              <option value="presencial" ${pos.modalidad==='presencial'?'selected':''}>Presencial</option>
              <option value="movil"      ${pos.modalidad==='movil'     ?'selected':''}>Móvil</option>
              <option value="remoto"     ${pos.modalidad==='remoto'    ?'selected':''}>Remoto</option>
            </select>
          </div>
          <div class="pm-field">
            <label class="pm-label">Equipo dedicado</label>
            <select class="pm-select" onchange="setPos(${pos.id},'dedicado',this.value==='si')">
              <option value="no" ${!pos.dedicado?'selected':''}>No</option>
              <option value="si" ${pos.dedicado ?'selected':''}>Sí</option>
            </select>
          </div>
        </div>
        <div style="font-size:10.5px;font-weight:700;color:var(--t2);margin-bottom:10px">Funciones de este puesto</div>
        ${renderFuncGroup('clinica',   'Clínicas',        pos.id, pos.funciones)}
        ${renderFuncGroup('admin',     'Administrativas', pos.id, pos.funciones)}
        ${renderFuncGroup('operativa', 'Operativas',      pos.id, pos.funciones)}
        <div class="pos-perfil-result">
          <span class="pos-badge-perfil ${pf.letra}" style="flex-shrink:0">${pf.letra}</span>
          <div class="pos-perfil-razon"><strong>${pf.nombre}.</strong> ${pf.razon}</div>
          <button class="pos-delete" onclick="deletePos(${pos.id})">Eliminar</button>
        </div>
      </div>`;

    list.appendChild(card);
  });

  const total = posiciones.reduce((s, p) => s + (p.cantidad || 0), 0);
  const info = document.getElementById('plantilla-nav-info');
  if (info) info.textContent = `${posiciones.length} puesto${posiciones.length !== 1 ? 's' : ''}, ${total} persona${total !== 1 ? 's' : ''}`;

  calcReglas();
}

function renderFuncGroup(tipo, nombre, posId, seleccionadas) {
  const chips = FUNCIONES[tipo].map(f => {
    const sel = seleccionadas.includes(f);
    return `<span class="func-chip ${tipo}${sel?' sel':''}" onclick="toggleFuncion(${posId},'${f}')">${f}</span>`;
  }).join('');
  return `<div class="func-group">
    <div class="func-group-lbl ${tipo}">${nombre}</div>
    <div class="func-chips">${chips}</div>
  </div>`;
}

function togglePos(id) {
  const list = document.getElementById('posiciones-list');
  const card = document.getElementById('poscard-' + id);
  if (!card) return;
  const isOpen = card.classList.toggle('open');
  list.dataset['open_' + id] = isOpen ? '1' : '0';
}

function setPos(id, key, val) {
  const pos = posiciones.find(p => p.id === id);
  if (!pos) return;
  pos[key] = val;
  const list = document.getElementById('posiciones-list');
  list.dataset['open_' + id] = '1';
  renderPosiciones();
}

function toggleFuncion(id, func) {
  const pos = posiciones.find(p => p.id === id);
  if (!pos) return;
  const idx = pos.funciones.indexOf(func);
  if (idx >= 0) pos.funciones.splice(idx, 1);
  else pos.funciones.push(func);
  const list = document.getElementById('posiciones-list');
  list.dataset['open_' + id] = '1';
  renderPosiciones();
}

function addPosicion() {
  const id = nextId++;
  posiciones.push({ id, nombre: '', cantidad: 1, area: '', modalidad: 'presencial', turnos: 1, dedicado: false, funciones: [] });
  const list = document.getElementById('posiciones-list');
  list.dataset['open_' + id] = '1';
  renderPosiciones();
  const card = document.getElementById('poscard-' + id);
  card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  // Foco inmediato en el nombre inline del header
  setTimeout(() => card?.querySelector('.pos-nombre-inline')?.focus(), 80);
}

function deletePos(id) {
  posiciones = posiciones.filter(p => p.id !== id);
  renderPosiciones();
}

function togglePosDisabled(id, disable) {
  const pos = posiciones.find(p => p.id === id);
  if (!pos) return;
  pos.disabled = disable;
  const list = document.getElementById('posiciones-list');
  list.dataset['open_' + id] = list.dataset['open_' + id] || '0';
  renderPosiciones();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REINICIAR FORMULARIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function reiniciarFormulario(silencioso) {
  if (!silencioso && !confirm('¿Quieres reiniciar el formulario? Se perderán todos los datos capturados.')) return;

  current = 0;
  done.clear();

  // Limpiar inputs de texto y selects
  document.querySelectorAll('.pm-input, .pm-select, .pm-textarea').forEach(el => {
    if (el.type === 'number') el.value = '';
    else if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
  });

  // Deseleccionar chips
  document.querySelectorAll('.pm-chip.sel').forEach(c => c.classList.remove('sel'));

  // Resetear combo unidad
  document.getElementById('campo-unidad').value = '-1';
  const clearBtn2 = document.getElementById('unidad-clear');
  if (clearBtn2) clearBtn2.style.display = 'none';
  document.getElementById('unidad-drop').style.display = 'none';

  // Resetear estados nuevos
  areasConfig = {};
  espaciosNuevos = {};
  espaciosPkgOverride = {};
  espaciosCustomNombre = {};
  reutilExistente = {};
  _brutaSnapshot = {};
  _brutaAuto = {};
  _brutaManual = {};
  // Limpiar inputs hidden de licencias
  ['campo-lic-tasy','campo-lic-sap','campo-lic-m365'].forEach(id => setVal(id, 0));
  // Limpiar fechas del datepicker
  dpSetValue('campo-inicio',   '');
  dpCloseAll();

  document.getElementById('bloque-b-detalles-card').style.display = 'none';
  document.getElementById('bloque-g-apps-card').style.display = 'none';
  document.getElementById('bloque-g-apps').innerHTML = '';
  document.querySelectorAll('#bloque-g-procesos input[type=checkbox]').forEach(c => c.checked = false);

  // Limpiar campos calculados de infraestructura
  ['campo-aps-calc','campo-switches-calc','campo-puntos-calc'].forEach(id => setVal(id, ''));
  document.getElementById('plantilla-si').checked = true;
  togglePlantilla();
  renderEspacios();
  actualizarTablaReutilizacion({ pcTotal:0, telefonos:0, aps:0, switches:0, impresoras:0, upsUnits:0 });

  // Posiciones vacías
  posiciones = [];
  nextId = 1;
  document.getElementById('posiciones-list').innerHTML = '';
  renderPosiciones();

  // Navegar al primer bloque
  document.querySelectorAll('.pm-block').forEach(b => b.classList.remove('active'));
  document.querySelector('.pm-block[data-block="0"]')?.classList.add('active');
  buildStepper();
  updateProgress();
  calcReglas();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIRMAR RESET (modal propio, no alert nativo)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function confirmarReset() {
  const modal = document.createElement('div');
  modal.id = 'modal-reset';
  modal.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center">
      <div style="background:var(--card);border-radius:14px;padding:28px 28px 20px;width:360px;box-shadow:0 20px 60px rgba(0,0,0,.25)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <div style="width:36px;height:36px;border-radius:10px;background:#fee2e2;display:flex;align-items:center;justify-content:center">
            <i class="ti ti-refresh" style="color:#b91c1c;font-size:18px"></i>
          </div>
          <div style="font-size:15px;font-weight:700;color:var(--t1)">Reiniciar formulario</div>
        </div>
        <p style="font-size:12.5px;color:var(--t2);margin:0 0 20px;line-height:1.6">
          Se eliminarán todos los datos capturados, incluyendo áreas, posiciones, espacios y presupuesto. Esta acción no se puede deshacer.
        </p>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button onclick="document.getElementById('modal-reset').remove()"
            style="padding:8px 18px;border:1.5px solid var(--border);border-radius:8px;background:transparent;color:var(--t1);font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit">
            Cancelar
          </button>
          <button onclick="document.getElementById('modal-reset').remove();reiniciarFormulario(true)"
            style="padding:8px 18px;border:none;border-radius:8px;background:#b91c1c;color:#fff;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit">
            Sí, reiniciar
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEMO DUMMY — llena el formulario completo con un ejemplo realista
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function cargarDummy() {
  // Reiniciar silencioso
  reiniciarFormulario(true);

  // ── Bloque A ──────────────────────────────────────────────────
  document.getElementById('campo-unidad').value = '-1';
  const comboInput = document.getElementById('campo-nombre');
  if (comboInput) comboInput.value = 'Hospital Alta Especialidad CHRISTUS MUGUERZA';
  const clearBtn = document.getElementById('unidad-clear');
  if (clearBtn) clearBtn.style.display = 'flex';
  setVal('campo-ciudad',   'Monterrey, Nuevo León');
  setVal('campo-tipo',     'Expansión de servicios existentes');
  setVal('campo-tipo-parametrico', 'Paramétrico de planeación');
  setVal('campo-version',  'v1.0');
  setVal('campo-lider',    'Dirección de TI CHRISTUS MUGUERZA');
  setVal('campo-responsable-ti', 'Jorge Guerrero');
  dpSetValue('campo-inicio',   '2026-09-01');
  setVal('campo-alcance',  'Expansión del área de Urgencias (piso 2), apertura de piso 6 de Hospitalización, nueva farmacia satélite en planta baja, módulo de Imagenología y adecuación de oficinas administrativas. Proyecto aprobado por Comité de TI en sesión agosto 2026.');

  // ── Bloque B — áreas ──────────────────────────────────────────
  areasConfig = {};
  const areasDemo = ['Urgencias','Hospitalización','Consultorios externos','Farmacia satélite','Oficinas administrativas','Imagenología'];
  document.querySelectorAll('#bloque-b-chips .pm-chip').forEach(chip => {
    const area = chip.dataset.area || chip.textContent.trim();
    const activa = areasDemo.includes(area);
    chip.classList.toggle('sel', activa);
    if (activa) {
      const esClinica = AREAS_CLINICAS.includes(area);
      const totales = { 'Urgencias':12, 'Hospitalización':24, 'Consultorios externos':10,
                        'Farmacia satélite':4, 'Oficinas administrativas':14, 'Imagenología':6 };
      const nuevos  = { 'Urgencias':8,  'Hospitalización':18, 'Consultorios externos':6,
                        'Farmacia satélite':4, 'Oficinas administrativas':8,  'Imagenología':4 };
      areasConfig[area] = {
        total:      totales[area] || 6,
        nuevos:     nuevos[area]  || 4,
        existentes: (totales[area] || 6) - (nuevos[area] || 4),
        estacion:   true,
        telefonia:  area !== 'Imagenología',
        impresion:  area === 'Farmacia satélite' ? 'local' : 'compartida',
        clinico:    esClinica,
        sistemas:   esClinica ? 'TASY' : (area === 'Farmacia satélite' ? 'SAP' : 'M365'),
      };
    }
  });
  renderAreaDetalles();

  // ── Bloque C — posiciones ─────────────────────────────────────
  document.getElementById('plantilla-si').checked = true;
  togglePlantilla();
  posiciones = [
    { id:1, preset:true, disabled:false, nombre:'Médico urgenciólogo',     cantidad:6,  area:'Urgencias',               modalidad:'presencial', turnos:3, dedicado:false, funciones:['Consulta / atención al paciente','Documentación clínica','Órdenes médicas','Resultados'] },
    { id:2, preset:true, disabled:false, nombre:'Enfermera general',        cantidad:10, area:'Urgencias',               modalidad:'presencial', turnos:3, dedicado:false, funciones:['Documentación clínica','Enfermería','Órdenes médicas'] },
    { id:3, nombre:'Médico internista',        cantidad:4,  area:'Hospitalización',         modalidad:'presencial', turnos:2, dedicado:false, funciones:['Consulta / atención al paciente','Documentación clínica','Prescripción','Consulta de expediente'] },
    { id:4, nombre:'Analista administrativo',  cantidad:8,  area:'Oficinas administrativas',modalidad:'presencial', turnos:1, dedicado:true,  funciones:['Admisión','Agenda','Gestión administrativa','Finanzas'] },
    { id:5, nombre:'Químico farmacéutico',     cantidad:4,  area:'Farmacia satélite',       modalidad:'presencial', turnos:2, dedicado:true,  funciones:['Farmacia','Inventarios'] },
    { id:6, nombre:'Técnico radiólogo',        cantidad:3,  area:'Imagenología',            modalidad:'presencial', turnos:2, dedicado:true,  funciones:['Documentación clínica','Resultados'] },
  ];
  nextId = 7;
  document.getElementById('posiciones-list').innerHTML = '';
  renderPosiciones();

  // ── Bloque E — espacios físicos ───────────────────────────────
  espaciosNuevos = {
    'Habitaciones ordinarias':  18,
    'Habitaciones privadas':     6,
    'Consultorios':             10,
    'Estaciones de enfermería':  6,
    'Farmacias':                 1,
    'Recepciones':               2,
    'Cuartos médicos':           4,
    'Salas de juntas':           1,
    'Áreas de espera':           3,
    'Oficinas':                  4,
  };
  renderEspacios();

  // ── Bloque F — infraestructura ────────────────────────────────
  setVal('campo-m2', 2400);
  const infSi = document.querySelector('input[name="infra-soporte"][value="parcial"]');
  if (infSi) infSi.checked = true;
  setVal('campo-idf',   '2');
  setVal('campo-racks', '4');
  setVal('campo-fibra', 'Fibra monomodo OS2 entre IDFs y MDF existente');

  // ── Bloque G — procesos / licencias ───────────────────────────
  ['proc-clinico','proc-farmacia','proc-personal','proc-medicos'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = true;
  });
  derivarLicencias();
  setTimeout(() => {
    setVal('campo-lic-tasy', 18);
    setVal('campo-lic-sap',  4);
    setVal('campo-lic-m365', 22);
    calcReglas();
  }, 100);

  // ── Bloque I — reutilización manual ──────────────────────────
  reutilExistente = { pc:4, monitores:4, impresoras:2, telefonos:6, aps:2, switches:1, ups:1 };
  _brutaManual    = {};

  // ── Calcular y navegar ────────────────────────────────────────
  calcReglas();
  goTo(0);

  // Feedback visual
  const btn = document.querySelector('.pm-sact-dummy');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-check"></i><span>¡Ejemplo cargado!</span>';
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.borderColor = ''; }, 2000);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VISTA PREVIA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function abrirPreview() {
  const overlay = document.getElementById('pv-overlay');
  const nombre = getVal('campo-nombre') || 'CHRISTUS MUGUERZA';
  const ciudad = getVal('campo-ciudad') || '';

  document.getElementById('pv-titulo').textContent = nombre + (ciudad ? ', ' + ciudad : '');
  document.getElementById('pv-meta').textContent =
    'Generado el ' + new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

  const totalPos  = posiciones.length;
  const totalPers = posiciones.reduce((s, p) => s + (p.cantidad || 0), 0);

  // Leer del panel (último cálculo)
  const capexEl = document.querySelector('#tabla-presupuesto-body .tr-total .td-capex');
  const opexEl  = document.querySelector('#tabla-presupuesto-body .tr-total .td-opex');
  const capexTxt = capexEl?.textContent?.trim() || 'N/D';
  const opexTxt  = opexEl?.textContent?.trim() || 'N/D';

  document.getElementById('pv-kpis').innerHTML = [
    { lbl: 'Puestos',      val: totalPos,   sub: 'tipos de puesto',    color: 'var(--p)' },
    { lbl: 'Personas',     val: totalPers,  sub: 'plantilla nueva',    color: 'var(--blue)' },
    { lbl: 'CAPEX',        val: capexTxt,   sub: 'inversión inicial',  color: '#92400E' },
    { lbl: 'OPEX / año',   val: opexTxt.replace(' / año',''), sub: 'licencias y soporte', color: 'var(--green)' },
  ].map(k => `
    <div class="pv-kpi">
      <div class="pv-kpi-lbl">${k.lbl}</div>
      <div class="pv-kpi-val" style="color:${k.color}">${k.val}</div>
      <div class="pv-kpi-sub">${k.sub}</div>
    </div>`).join('');

  const body = document.getElementById('pv-body');
  body.innerHTML =
    pvSeccion('Puestos y funciones',   buildTablaPos()) +
    pvSeccion('Resumen por perfil',    buildTablaPerfiles()) +
    pvSeccion('Equipamiento calculado',buildEquipPanel()) +
    pvSeccion('Presupuesto estimado',  buildPresupuestoPanel()) +
    pvSeccion('Excepciones',           buildExcepciones());

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarPreview() {
  document.getElementById('pv-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function pvSeccion(titulo, contenido) {
  return `<div class="pv-section">
    <div class="pv-section-title">${titulo}</div>
    <div class="pv-section-body">${contenido}</div>
  </div>`;
}

function buildTablaPos() {
  if (!posiciones.length) return '<p style="font-size:12px;color:var(--t3)">No se registraron posiciones.</p>';
  const rows = posiciones.map(p => {
    const pf = calcPerfil(p);
    return `<tr>
      <td>${p.nombre || 'Sin nombre'}</td>
      <td style="text-align:center">${p.cantidad}</td>
      <td><span class="pos-badge-perfil ${pf.letra}" style="font-size:9.5px">${pf.letra}</span></td>
      <td style="color:var(--t2);font-size:10.5px">${p.funciones.join(', ') || 'Sin funciones'}</td>
    </tr>`;
  }).join('');
  return `<div style="overflow-x:auto"><table class="pv-table">
    <thead><tr><th>Puesto</th><th>Cant.</th><th>Perfil</th><th>Funciones</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function buildTablaPerfiles() {
  const mapa = {};
  posiciones.forEach(p => {
    const pf = calcPerfil(p);
    mapa[pf.letra] = mapa[pf.letra] || { nombre: pf.nombre, personas: 0 };
    mapa[pf.letra].personas += p.cantidad || 0;
  });
  if (!Object.keys(mapa).length) return '<p style="font-size:12px;color:var(--t3)">Sin datos.</p>';
  const rows = Object.entries(mapa).map(([l, d]) => `
    <tr>
      <td><span class="pos-badge-perfil ${l}" style="font-size:10px">${l} — ${d.nombre}</span></td>
      <td style="font-weight:700;color:var(--p);text-align:right">${d.personas} persona${d.personas !== 1 ? 's' : ''}</td>
    </tr>`).join('');
  return `<table class="pv-table"><thead><tr><th>Perfil</th><th style="text-align:right">Total</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="pv-note" style="margin-top:10px">Los puestos con funciones clínicas en 2 o más turnos comparten estación (Perfil B). No se asigna un equipo por persona.</p>`;
}

function buildEquipPanel() {
  const rows = [...document.querySelectorAll('#tabla-presupuesto-body tr:not(.tr-total)')].slice(0, 9);
  // Tomar datos del panel dinámico
  const items = [...document.querySelectorAll('#panel-body .pm-rule-item:not(.ahorro)')].map(item => ({
    nom: item.querySelector('.pm-rule-name')?.textContent,
    qty: item.querySelector('.pm-rule-qty')?.textContent,
    color: item.querySelector('.pm-rule-dot')?.style.background,
  }));
  return `<div class="pv-equip-grid">${items.map(i => `
    <div class="pv-equip-item">
      <div class="pv-equip-nom">${i.nom}</div>
      <div class="pv-equip-val" style="color:${i.color}">${i.qty}</div>
    </div>`).join('')}</div>`;
}

function buildPresupuestoPanel() {
  const tbody = document.getElementById('tabla-presupuesto-body');
  if (!tbody) return '';
  return `<div style="overflow-x:auto"><table class="pv-table">
    <thead><tr><th>Rubro</th><th style="text-align:right">CAPEX</th><th style="text-align:right">OPEX / año</th></tr></thead>
    ${tbody.outerHTML.replace('<tbody','<tbody class="pv"')}
  </table></div>`.replace(/<tbody[^>]*>/, '').replace('</tbody></div>', '</div>') +
    `<div style="overflow-x:auto"><table class="pv-table">${tbody.innerHTML}</table></div>`;
}

function buildExcepciones() {
  const ta = document.querySelector('#bloque-J .pm-textarea');
  const txt = (ta?.value || '').trim() || 'No se registraron excepciones.';
  return `<div class="pv-note" style="white-space:pre-wrap;line-height:1.7">${txt}</div>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORTACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function exportarPDF() {
  const box   = document.getElementById('pv-box');
  const titulo = document.getElementById('pv-titulo').textContent;
  const w = window.open('', '_blank', 'width=900,height=700');
  const styles = [...document.styleSheets]
    .flatMap(s => { try { return [...s.cssRules].map(r => r.cssText); } catch { return []; } })
    .join('\n');
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${titulo}</title>
    <style>${styles}
    @media print { .pv-close,.pv-footer{display:none!important} body{margin:0;padding:0} }
    </style></head><body>`);
  w.document.write(box.outerHTML);
  w.document.write(`<script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close();
}

function exportarCSV() {
  const rows = [
    ['Puesto','Cantidad','Área','Turnos','Modalidad','Equipo dedicado','Perfil','Funciones'],
    ...posiciones.map(p => {
      const pf = calcPerfil(p);
      return [p.nombre, p.cantidad, p.area, p.turnos, p.modalidad, p.dedicado?'Sí':'No', pf.letra+' '+pf.nombre, p.funciones.join(' | ')];
    }),
  ];
  const csv = '﻿' + rows.map(r => r.map(c => `"${String(c??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'})),
    download: 'parametrico-ti.csv',
  });
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOQUE B — DETALLE DINÁMICO POR ÁREA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderAreaDetalles() {
  const selected = [...document.querySelectorAll('#bloque-b-chips .pm-chip.sel')]
    .map(c => c.dataset.area || c.textContent.trim());
  const card = document.getElementById('bloque-b-detalles-card');
  const container = document.getElementById('bloque-b-detalles');
  if (!card || !container) return;

  if (!selected.length) { card.style.display = 'none'; return; }
  card.style.display = '';

  // Preservar valores existentes en areasConfig
  selected.forEach(area => {
    if (!areasConfig[area]) {
      areasConfig[area] = { total: 0, nuevos: 0, existentes: 0,
        estacion: true, telefonia: true, impresion: 'compartida',
        clinico: AREAS_CLINICAS.includes(area), sistemas: 'TASY' };
    }
  });
  // Limpiar áreas deseleccionadas
  Object.keys(areasConfig).forEach(k => { if (!selected.includes(k)) delete areasConfig[k]; });

  container.innerHTML = selected.map(area => {
    const d = areasConfig[area];
    return `
    <div class="area-det-row">
      <div class="area-det-name"><i class="ti ti-building-hospital" style="font-size:11px;color:var(--p)"></i> ${area}</div>
      <div class="area-det-fields">
        <div class="pm-field" style="min-width:100px">
          <label class="pm-label">Total espacios</label>
          <input class="pm-input" type="number" min="0" value="${d.total}"
            oninput="setAreaConfig('${area}','total',+this.value);setAreaConfig('${area}','existentes',Math.max(0,(areasConfig['${area}']?.total||0)-(areasConfig['${area}']?.nuevos||0)));renderAreaDetalles();calcReglas()">
        </div>
        <div class="pm-field" style="min-width:100px">
          <label class="pm-label">Nuevos</label>
          <input class="pm-input" type="number" min="0" max="${d.total}" value="${d.nuevos}"
            oninput="setAreaConfig('${area}','nuevos',Math.min(+this.value,areasConfig['${area}']?.total||999));renderAreaDetalles();calcReglas()">
        </div>
        <div class="pm-field" style="min-width:100px">
          <label class="pm-label">Existentes</label>
          <input class="pm-input" type="number" value="${Math.max(0, d.total - d.nuevos)}" readonly style="color:var(--t3)">
        </div>
        <div class="pm-field area-det-checks">
          <label class="pm-label">Requiere</label>
          <div class="area-req-row">
            <label class="area-req-lbl"><input type="checkbox" ${d.estacion?'checked':''} onchange="setAreaConfig('${area}','estacion',this.checked);calcReglas()"> Estación</label>
            <label class="area-req-lbl"><input type="checkbox" ${d.telefonia?'checked':''} onchange="setAreaConfig('${area}','telefonia',this.checked);calcReglas()"> Telefonía</label>
            <label class="area-req-lbl"><input type="checkbox" ${d.impresion==='compartida'||d.impresion==='individual'?'checked':''} onchange="setAreaConfig('${area}','impresion',this.checked?'compartida':'ninguna');calcReglas()"> Impresión</label>
            <label class="area-req-lbl"><input type="checkbox" ${d.clinico?'checked':''} onchange="setAreaConfig('${area}','clinico',this.checked);calcReglas()"> Dispositivos clínicos</label>
          </div>
        </div>
        <div class="pm-field" style="min-width:140px">
          <label class="pm-label">Acceso a sistemas</label>
          <select class="pm-select" onchange="setAreaConfig('${area}','sistemas',this.value);calcReglas()">
            <option value="ninguno" ${d.sistemas==='ninguno'?'selected':''}>Ninguno</option>
            <option value="TASY" ${d.sistemas==='TASY'?'selected':''}>TASY</option>
            <option value="SAP" ${d.sistemas==='SAP'?'selected':''}>SAP WM</option>
            <option value="M365" ${d.sistemas==='M365'?'selected':''}>Microsoft 365</option>
            <option value="Varios" ${d.sistemas==='Varios'?'selected':''}>Varios</option>
          </select>
        </div>
      </div>
    </div>`;
  }).join('<div class="area-det-sep"></div>');
}

function setAreaConfig(area, key, val) {
  if (!areasConfig[area]) areasConfig[area] = {};
  areasConfig[area][key] = val;
  if (key === 'total') areasConfig[area].existentes = Math.max(0, val - (areasConfig[area].nuevos || 0));
  if (key === 'nuevos') areasConfig[area].existentes = Math.max(0, (areasConfig[area].total || 0) - val);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOQUE C — TOGGLE DE PLANTILLA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function togglePlantilla() {
  const tienePlantilla = document.getElementById('plantilla-si')?.checked;
  const section = document.getElementById('bloque-c-plantilla');
  if (section) section.style.display = tienePlantilla ? '' : 'none';
  calcReglas();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOQUE E — TABLA DE ESPACIOS FÍSICOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderEspacios() {
  const tbody = document.getElementById('espacio-tbody');
  if (!tbody) return;

  tbody.innerHTML = Object.entries(ESPACIOS_PAQUETE).map(([tipo]) => {
    return buildEspacioRows(tipo);
  }).join('');

  actualizarTotalesEspacios();
}

function buildEspacioRows(tipo) {
  const pkg = getPkg(tipo);
  if (!pkg) return '';
  const qty  = espaciosNuevos[tipo] || 0;
  const key  = tipo.replace(/[^a-z]/gi, '');
  const activa = qty > 0;
  const hasOverride = !!espaciosPkgOverride[tipo];
  const nombreLabel = tipo === 'Otros'
    ? `<input class="espacio-name-edit" id="espacio-nombre-${key}"
         value="${espaciosCustomNombre[tipo] || ''}" placeholder="Nombre del espacio…"
         oninput="setCustomNombre('${tipo}',this.value)">`
    : pkg.label;

  const mainRow = `
    <tr class="${activa ? 'espacio-row-activa' : ''}" id="espacio-tr-${key}">
      <td>
        ${nombreLabel}
        ${activa ? `<button class="espacio-edit-btn" title="Editar equipo por unidad"
          onclick="togglePkgEdit('${tipo}')" id="btn-edit-${key}">
          <i class="ti ti-${hasOverride ? 'settings-filled' : 'settings'}" style="font-size:11px"></i>
        </button>` : ''}
      </td>
      <td style="text-align:center">
        <input class="pm-input espacio-qty-input" type="number" min="0" value="${qty || ''}" placeholder="0"
          style="width:${activa?'64':'52'}px;text-align:center;margin:0 auto;opacity:${activa?'1':'.5'}"
          oninput="setEspacio('${tipo}',+this.value||0)">
      </td>
      <td class="espacio-paquete" id="espacio-pkg-${key}">${calcPaqueteDesc(pkg, qty)}</td>
    </tr>`;

  const editRow = buildPkgEditRow(tipo, key, pkg);
  return mainRow + editRow;
}

function buildPkgEditRow(tipo, key, pkg) {
  const base = ESPACIOS_PAQUETE[tipo];
  const fields = [
    { f:'pc',       label:'PC',        min:0, step:1  },
    { f:'puntoRed', label:'Pts. red',  min:1, step:1  },
    { f:'tel',      label:'Tel. IP',   min:0, step:1  },
    { f:'imp',      label:'Impr.',     min:0, step:0.5},
    { f:'lector',   label:'Lectores',  min:0, step:0.5},
    { f:'ap',       label:'AP',        min:0, step:0.25},
  ];
  const inputs = fields.map(({ f, label, min, step }) => `
    <div class="espacio-edit-field">
      <label>${label} / ud.</label>
      <input type="number" min="${min}" step="${step}" value="${pkg[f]}"
        oninput="setPkgOverride('${tipo}','${f}',+this.value)">
    </div>`).join('');
  return `
    <tr class="espacio-edit-row" id="espacio-edit-${key}" style="display:none">
      <td colspan="3">
        <div class="espacio-edit-grid">
          ${inputs}
          <div style="align-self:flex-end">
            <button class="espacio-edit-reset" onclick="resetPkgOverride('${tipo}')">Restablecer valores predeterminados</button>
          </div>
        </div>
      </td>
    </tr>`;
}

function setEspacio(tipo, qty) {
  espaciosNuevos[tipo] = qty;
  const key = tipo.replace(/[^a-z]/gi, '');
  // Rebuild rows en lugar de patch parcial para reflejar el botón edit
  const container = document.getElementById('espacio-tbody');
  const trMain = document.getElementById(`espacio-tr-${key}`);
  const trEdit = document.getElementById(`espacio-edit-${key}`);
  if (trMain && trEdit) {
    const html = buildEspacioRows(tipo);
    const tmp = document.createElement('tbody');
    tmp.innerHTML = html;
    trMain.replaceWith(...tmp.children);
    // Re-fetch after replace
    const newEdit = document.getElementById(`espacio-edit-${key}`);
    const newMain = document.getElementById(`espacio-tr-${key}`);
    // Keep edit panel open if it was open
    if (newEdit && trEdit.style.display !== 'none') newEdit.style.display = '';
  } else if (container) {
    renderEspacios();
  }
  actualizarTotalesEspacios();
  calcReglas();
}

function togglePkgEdit(tipo) {
  const key = tipo.replace(/[^a-z]/gi, '');
  const row = document.getElementById(`espacio-edit-${key}`);
  if (!row) return;
  row.style.display = row.style.display === 'none' ? '' : 'none';
}

function setPkgOverride(tipo, field, val) {
  if (!espaciosPkgOverride[tipo]) espaciosPkgOverride[tipo] = {};
  espaciosPkgOverride[tipo][field] = val;
  const key = tipo.replace(/[^a-z]/gi, '');
  const pkg  = getPkg(tipo);
  const qty  = espaciosNuevos[tipo] || 0;
  const cell = document.getElementById(`espacio-pkg-${key}`);
  if (cell) cell.innerHTML = calcPaqueteDesc(pkg, qty);
  // Actualizar ícono del botón para indicar que hay overrides
  const btn = document.getElementById(`btn-edit-${key}`);
  if (btn) btn.innerHTML = '<i class="ti ti-settings-filled" style="font-size:11px"></i>';
  actualizarTotalesEspacios();
  calcReglas();
}

function resetPkgOverride(tipo) {
  delete espaciosPkgOverride[tipo];
  const key = tipo.replace(/[^a-z]/gi, '');
  const base = ESPACIOS_PAQUETE[tipo];
  const qty  = espaciosNuevos[tipo] || 0;
  const cell = document.getElementById(`espacio-pkg-${key}`);
  if (cell) cell.innerHTML = calcPaqueteDesc(base, qty);
  const btn = document.getElementById(`btn-edit-${key}`);
  if (btn) btn.innerHTML = '<i class="ti ti-settings" style="font-size:11px"></i>';
  // Rebuild the edit row inputs with default values
  const editRow = document.getElementById(`espacio-edit-${key}`);
  if (editRow) {
    const tmp = document.createElement('tbody');
    tmp.innerHTML = buildPkgEditRow(tipo, key, base);
    editRow.replaceWith(tmp.firstElementChild);
    document.getElementById(`espacio-edit-${key}`).style.display = '';
  }
  actualizarTotalesEspacios();
  calcReglas();
}

function setCustomNombre(tipo, val) {
  espaciosCustomNombre[tipo] = val;
}

function calcPaqueteDesc(pkg, qty) {
  if (!qty) return '<span style="color:var(--t3);font-size:10.5px;font-style:italic">— sin cantidad</span>';
  const items = [];
  if (pkg.pc)       items.push(`<span class="epkg-badge epkg-pc">${pkg.pc * qty} PC</span>`);
  if (pkg.puntoRed) items.push(`<span class="epkg-badge epkg-red">${pkg.puntoRed * qty} pts. red</span>`);
  if (pkg.tel)      items.push(`<span class="epkg-badge epkg-tel">${pkg.tel * qty} tel. IP</span>`);
  if (pkg.imp)      items.push(`<span class="epkg-badge epkg-imp">${Math.ceil(pkg.imp * qty)} impr.</span>`);
  if (pkg.lector)   items.push(`<span class="epkg-badge epkg-lec">${Math.ceil(pkg.lector * qty)} lector</span>`);
  if (pkg.ap) {
    const apCount = Math.ceil(pkg.ap * qty);
    const ratio   = pkg.ap < 1 ? ` (1 c/${Math.round(1/pkg.ap)})` : '';
    items.push(`<span class="epkg-badge epkg-ap">${apCount} AP${ratio}</span>`);
  }
  if (pkg.tasy)     items.push(`<span class="epkg-badge epkg-lic">TASY ×${qty}</span>`);
  if (pkg.sap)      items.push(`<span class="epkg-badge epkg-lic">SAP ×${qty}</span>`);
  return items.join('');
}

function actualizarTotalesEspacios() {
  const tot = document.getElementById('espacio-totales');
  if (!tot) return;
  let pc = 0, puntos = 0, tel = 0, imp = 0, lec = 0, ap = 0;
  Object.entries(espaciosNuevos).forEach(([tipo, qty]) => {
    if (!qty) return;
    const pkg = getPkg(tipo);
    if (!pkg) return;
    pc     += pkg.pc       * qty;
    puntos += pkg.puntoRed * qty;
    tel    += pkg.tel      * qty;
    imp    += Math.ceil(pkg.imp    * qty);
    lec    += Math.ceil(pkg.lector * qty);
    ap     += pkg.ap       * qty;
  });
  const total = Object.values(espaciosNuevos).reduce((s, v) => s + (v || 0), 0);
  if (!total) { tot.style.display = 'none'; return; }
  tot.style.display = '';
  tot.innerHTML = `
    <div class="espacio-tot-title">Equipamiento total derivado de espacios</div>
    <div class="espacio-tot-grid">
      ${pc     ? `<div class="espacio-tot-item"><span class="epkg-badge epkg-pc">${pc} PC</span></div>` : ''}
      <div class="espacio-tot-item"><span class="epkg-badge epkg-red">${puntos} pts. red</span></div>
      ${tel    ? `<div class="espacio-tot-item"><span class="epkg-badge epkg-tel">${tel} tel. IP</span></div>` : ''}
      ${imp    ? `<div class="espacio-tot-item"><span class="epkg-badge epkg-imp">${imp} impr.</span></div>` : ''}
      ${lec    ? `<div class="espacio-tot-item"><span class="epkg-badge epkg-lec">${lec} lectores</span></div>` : ''}
      ${ap > 0 ? `<div class="espacio-tot-item"><span class="epkg-badge epkg-ap">${Math.ceil(ap)} AP mín.</span></div>` : ''}
    </div>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOQUE G — DERIVACIÓN DE LICENCIAS POR PROCESO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PROC_APPS = [
  { proc:'proc-clinico',      apps:[
    { app:'TASY (HIS)', tipo:'Concurrente', desc:'Una licencia por estación clínica simultánea.', campo:'campo-lic-tasy' },
  ]},
  { proc:'proc-farmacia',     apps:[
    { app:'SAP WM',     tipo:'Nominal',    desc:'Una licencia por usuario de farmacia/inventarios.', campo:'campo-lic-sap' },
  ]},
  { proc:'proc-personal',     apps:[
    { app:'Microsoft 365', tipo:'Nominal', desc:'Una licencia por colaborador nuevo.', campo:'campo-lic-m365' },
    { app:'AD / Entra ID',  tipo:'Por sede', desc:'Incluido en el contrato de dominio corporativo.', campo:null },
    { app:'ServiceNow',     tipo:'Nominal', desc:'Para gestión de incidentes y onboarding.', campo:null },
  ]},
  { proc:'proc-medicos',      apps:[
    { app:'Accesos clínicos', tipo:'Nominal', desc:'Credencialización y perfil en TASY/HIS.', campo:null },
  ]},
  { proc:'proc-imagen',       apps:[
    { app:'PACS / RIS', tipo:'Por sede', desc:'Licencia por instalación de imagenología.', campo:null },
  ]},
  { proc:'proc-telemedicina', apps:[
    { app:'Plataforma de videoconsulta', tipo:'Por sede', desc:'Licencia de plataforma + licencias por médico.', campo:null },
  ]},
  { proc:'proc-mantenimiento',apps:[
    { app:'CMMS', tipo:'Nominal', desc:'Una licencia por técnico de mantenimiento.', campo:null },
  ]},
];

function derivarLicencias() {
  const card = document.getElementById('bloque-g-apps-card');
  const container = document.getElementById('bloque-g-apps');
  if (!card || !container) return;

  const activeApps = [];
  PROC_APPS.forEach(({ proc, apps }) => {
    if (document.getElementById(proc)?.checked) activeApps.push(...apps);
  });

  if (!activeApps.length) { card.style.display = 'none'; calcReglas(); return; }
  card.style.display = '';

  container.innerHTML = `
    <table class="lic-table">
      <thead><tr><th>Aplicativo derivado</th><th>Tipo de licencia</th><th style="width:80px;text-align:center">Cantidad</th><th>Nota</th></tr></thead>
      <tbody>${activeApps.map((a, i) => `
        <tr>
          <td style="font-weight:600">${a.app}</td>
          <td><span class="lic-tipo">${a.tipo}</span></td>
          <td style="text-align:center">
            ${a.campo ? `<input class="pm-input" type="number" min="0" placeholder="0" id="lic-qty-${i}"
              style="width:65px;text-align:center;margin:0 auto"
              oninput="document.getElementById('${a.campo}').value=this.value||0;calcReglas()">` : '<span style="color:var(--t3);font-size:11px">Contrato</span>'}
          </td>
          <td style="font-size:11px;color:var(--t3)">${a.desc}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  calcReglas();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOQUE I — REUTILIZACIÓN: BRUTA − EXISTENTE = INCREMENTAL
// _brutaAuto   = valores calculados por calcReglas() (no editables por usuario)
// _brutaManual = overrides del usuario (cuando ingresa un valor distinto)
// La bruta efectiva = _brutaManual[key] ?? _brutaAuto[key]
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _brutaSnapshot = {};  // alias legacy → apunta a _brutaAuto
let _brutaAuto   = {};
let _brutaManual = {};

function getBruta(key) {
  return _brutaManual[key] !== undefined ? _brutaManual[key] : (_brutaAuto[key] || 0);
}

function actualizarTablaReutilizacion({ pcTotal, telefonos, aps, switches, impresoras, upsUnits }) {
  _brutaAuto = { pc: pcTotal, telefonos, aps, switches, impresoras, ups: upsUnits,
    monitores:0, racks:0, licencias:0, infra:0, equipClin:0 };
  _brutaSnapshot = _brutaAuto; // compatibilidad

  const tbody = document.getElementById('tabla-reutilizacion');
  if (!tbody) return;

  tbody.innerHTML = REUTIL_CATEGORIAS.map(cat => {
    const autoVal   = _brutaAuto[cat.key] || 0;
    const bruta     = getBruta(cat.key);
    const isManual  = _brutaManual[cat.key] !== undefined;
    const existente = reutilExistente[cat.key] || 0;
    const incremental = Math.max(0, bruta - existente);

    const badgeAuto = autoVal > 0 && !isManual
      ? `<span style="font-size:9px;background:var(--accent-bg,#ede9fe);color:var(--accent,#5C2B60);border-radius:4px;padding:1px 5px;margin-left:4px;font-weight:600">auto</span>`
      : '';
    const badgeEdit = isManual
      ? `<span style="font-size:9px;background:#fff7ed;color:#c2410c;border-radius:4px;padding:1px 5px;margin-left:4px;font-weight:600">editado</span>`
      : '';

    return `
    <tr>
      <td style="font-weight:500">${cat.label}</td>
      <td style="text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:4px">
          <input class="pm-input reutil-bruta-inp" type="number" min="0"
            value="${bruta || ''}" placeholder="0"
            data-auto="${autoVal}"
            style="width:64px;text-align:center;margin:0;${autoVal>0&&!isManual?'background:var(--bg2,#f5f3ff);':''};"
            oninput="setBrutaManual('${cat.key}',this)">
          ${badgeAuto}${badgeEdit}
        </div>
      </td>
      <td style="text-align:center">
        <input class="pm-input" type="number" min="0" value="${existente || ''}" placeholder="0"
          style="width:64px;text-align:center;margin:0 auto"
          oninput="setReutilExistente('${cat.key}',+this.value||0)">
      </td>
      <td style="text-align:center;font-weight:700;color:${incremental===0&&bruta>0?'var(--green)':'var(--t1)'}">
        ${bruta ? incremental : '—'}
        ${incremental===0&&bruta>0?' <i class="ti ti-check" style="color:var(--green);font-size:11px"></i>':''}
      </td>
    </tr>`;
  }).join('');

  actualizarAhorroTotal();
}

function setBrutaManual(key, input) {
  const raw = +input.value;
  const auto = +input.dataset.auto || 0;
  if (input.value === '' || raw === auto) {
    delete _brutaManual[key];
  } else {
    _brutaManual[key] = raw || 0;
  }
  actualizarAhorroTotal();
  calcReglas();
}

function setReutilExistente(key, val) {
  reutilExistente[key] = val;
  actualizarAhorroTotal();
  calcReglas();
}

function actualizarAhorroTotal() {
  let total = 0;
  REUTIL_CATEGORIAS.forEach(cat => {
    const existente = reutilExistente[cat.key] || 0;
    const bruta = getBruta(cat.key);
    total += Math.min(existente, bruta) * cat.costo;
  });
  const el = document.getElementById('reutil-ahorro-total');
  if (el) el.textContent = mxn(total);
}

function calcAhorroReutilizacion() {
  let total = 0;
  REUTIL_CATEGORIAS.forEach(cat => {
    const existente = reutilExistente[cat.key] || 0;
    const bruta = getBruta(cat.key);
    total += Math.min(existente, bruta) * cat.costo;
  });
  return total;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOQUE D — RESUMEN DINÁMICO DE PERFILES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PERFIL_META = {
  A: { color: '#0F766E', bg: '#CCFBF1', label: 'Clínico fijo',         desc: 'Una estación por persona' },
  B: { color: '#1D4ED8', bg: '#DBEAFE', label: 'Clínico compartido',   desc: 'Una estación por turno — ahorro real' },
  C: { color: '#6D28D9', bg: '#EDE9FE', label: 'Administrativo fijo',  desc: 'PC o laptop con M365/SAP' },
  D: { color: '#B45309', bg: '#FEF3C7', label: 'Operativo',            desc: 'Terminal o tableta por proceso' },
  E: { color: '#0369A1', bg: '#E0F2FE', label: 'Móvil',               desc: 'Laptop sin estación fija' },
  F: { color: '#71717A', bg: '#F4F4F5', label: 'Sin estación',         desc: 'Solo identidad y accesos' },
};

function actualizarBloqueD({ pcClinica, pcAdmin, moviles }) {
  const container = document.getElementById('bloque-d-resumen');
  if (!container) return;

  if (!posiciones.length) {
    container.innerHTML = `
      <div class="pm-empty-notice">
        <i class="ti ti-users" style="font-size:28px;color:var(--border)"></i>
        <div style="font-size:13px;color:var(--t2);margin-top:8px">Aún no hay posiciones en el Bloque C.</div>
        <div style="font-size:11.5px;color:var(--t3)">Agrega puestos para ver el resumen de perfiles.</div>
      </div>`;
    return;
  }

  // Calcular distribución de perfiles
  const dist = {};
  let totalPersonas = 0;
  let totalEstaciones = 0;
  let personasB = 0;
  let estacionesB = 0;

  posiciones.forEach(p => {
    const pf = calcPerfil(p);
    const qty = p.cantidad || 0;
    if (!dist[pf.letra]) dist[pf.letra] = { ...PERFIL_META[pf.letra], letra: pf.letra, personas: 0, estaciones: 0 };
    dist[pf.letra].personas += qty;
    totalPersonas += qty;

    if (pf.letra === 'A') { dist[pf.letra].estaciones += qty; totalEstaciones += qty; }
    else if (pf.letra === 'B') {
      dist[pf.letra].estaciones += p.turnos;
      totalEstaciones += p.turnos;
      personasB += qty;
      estacionesB += p.turnos;
    } else if (pf.letra === 'C') { dist[pf.letra].estaciones += qty; totalEstaciones += qty; }
    else if (pf.letra === 'D') { dist[pf.letra].estaciones += Math.ceil(qty / 2); totalEstaciones += Math.ceil(qty / 2); }
    else if (pf.letra === 'E') { dist[pf.letra].estaciones += qty; totalEstaciones += qty; }
  });

  const ahorroB = personasB - estacionesB;
  const sorted = Object.values(dist).sort((a, b) => b.personas - a.personas);

  const barsHtml = sorted.map(d => {
    const pct = totalPersonas > 0 ? Math.round((d.personas / totalPersonas) * 100) : 0;
    const showEst = d.letra === 'B' && d.estaciones < d.personas;
    return `
      <div class="bd-row">
        <div class="bd-label">
          <span class="pos-badge-perfil ${d.letra}" style="font-size:10px;margin-right:6px">${d.letra}</span>
          <span class="bd-name">${d.label}</span>
          <span class="bd-desc">${d.desc}</span>
        </div>
        <div class="bd-bar-wrap">
          <div class="bd-bar-fill" style="width:${pct}%;background:${d.color}"></div>
        </div>
        <div class="bd-qty">
          <strong>${d.personas}</strong> <span>persona${d.personas !== 1 ? 's' : ''}</span>
          ${showEst ? `<span class="bd-est-chip"><i class="ti ti-device-desktop" style="font-size:9px"></i> ${d.estaciones} est.</span>` : ''}
        </div>
      </div>`;
  }).join('');

  const savingsHtml = ahorroB > 0 ? `
    <div class="bd-saving">
      <i class="ti ti-trending-down" style="font-size:18px;color:#15803D"></i>
      <div>
        <div class="bd-saving-title">Perfil B ahorra ${ahorroB} estación${ahorroB !== 1 ? 'es' : ''}</div>
        <div class="bd-saving-sub">${personasB} personas clínicas rotando en ${estacionesB} estaciones compartidas. El sistema considera turnos, no plazas, para calcular el hardware.</div>
      </div>
    </div>` : '';

  container.innerHTML = `
    <div class="bd-totals">
      <div class="bd-total-item">
        <div class="bd-total-val">${totalPersonas}</div>
        <div class="bd-total-lbl">Personas en plantilla</div>
      </div>
      <div class="bd-total-sep"></div>
      <div class="bd-total-item">
        <div class="bd-total-val" style="color:var(--p)">${pcClinica + pcAdmin + moviles}</div>
        <div class="bd-total-lbl">Equipos de cómputo necesarios</div>
      </div>
      <div class="bd-total-sep"></div>
      <div class="bd-total-item">
        <div class="bd-total-val" style="color:#15803D">${Math.max(0, totalPersonas - (pcClinica + pcAdmin + moviles))}</div>
        <div class="bd-total-lbl">Estaciones ahorradas</div>
      </div>
    </div>
    <div class="bd-bars">${barsHtml}</div>
    ${savingsHtml}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VALIDACIÓN DE CAMPOS REQUERIDOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function isBlockComplete(idx) {
  if (idx === 0) {
    return !!(getVal('campo-nombre').trim() &&
              getVal('campo-tipo').trim() &&
              getVal('campo-tipo-parametrico') &&
              getVal('campo-version').trim() &&
              getVal('campo-lider').trim() &&
              getVal('campo-inicio'));
  }
  if (idx === 1) {
    // Bloque B: al menos un área seleccionada
    return document.querySelectorAll('#bloque-B .pm-chips .pm-chip.sel').length > 0;
  }
  if (idx === 2) {
    // Bloque C: al menos una posición con al menos una función
    return posiciones.length > 0 && posiciones.some(p => p.funciones.length > 0);
  }
  // Bloques D-J: se marcan al visitar
  return done.has(idx);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Rueda del mouse en inputs numéricos.
// - Bloquea scroll de página cuando el cursor está sobre un number input.
// - Auto-enfoca el campo al hacer hover con la rueda (sin necesidad de click).
// - Una vez sobre el campo la rueda sube/baja el valor de forma continua.
document.addEventListener('wheel', (e) => {
  const over = e.target?.closest('input[type=number]');
  if (!over) return;
  e.preventDefault();
  if (document.activeElement !== over) over.focus();
  const step = +over.step || 1;
  const min  = over.min !== '' ? +over.min : -Infinity;
  const max  = over.max !== '' ? +over.max :  Infinity;
  const next = (+over.value || 0) + (e.deltaY < 0 ? step : -step);
  over.value = Math.min(max, Math.max(min, next));
  over.dispatchEvent(new Event('input', { bubbles: true }));
}, { passive: false });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBO UNIDAD — buscar en catálogo o escribir nombre libre
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function unidadFilter(q) {
  const drop  = document.getElementById('unidad-drop');
  const clear = document.getElementById('unidad-clear');
  clear.style.display = q ? 'flex' : 'none';
  drop.style.display = 'block';
  const matches = UNIDADES.map((u, i) => ({ u, i }))
    .filter(({ u }) => !q || u.nombre.toLowerCase().includes(q.toLowerCase()) || u.ciudad.toLowerCase().includes(q.toLowerCase()));
  drop.innerHTML = matches.map(({ u, i }) => `
    <div class="unidad-opt" onmousedown="unidadSelect(${i})">
      <div>${u.nombre}</div>
      <div class="unidad-opt-ciudad">${u.ciudad}</div>
    </div>`).join('')
    + (q ? `<div class="unidad-opt-nueva" onmousedown="unidadLibre('${q.replace(/'/g,"\\'")}')">
        <i class="ti ti-plus"></i> Usar "<strong>${q}</strong>" como nombre de la unidad
      </div>` : '');
}

function unidadOpen() {
  const q = document.getElementById('campo-nombre').value;
  unidadFilter(q);
}

function unidadClose() {
  document.getElementById('unidad-drop').style.display = 'none';
}

function unidadSelect(idx) {
  document.getElementById('campo-unidad').value = idx;
  cargarUnidad(idx);
  document.getElementById('unidad-drop').style.display = 'none';
  document.getElementById('unidad-clear').style.display = 'flex';
}

function unidadLibre(nombre) {
  document.getElementById('campo-nombre').value = nombre;
  document.getElementById('campo-unidad').value = '-1';
  document.getElementById('unidad-drop').style.display = 'none';
  document.getElementById('unidad-clear').style.display = 'flex';
  buildStepper();
}

function unidadClear() {
  document.getElementById('campo-nombre').value = '';
  document.getElementById('campo-unidad').value = '-1';
  document.getElementById('campo-ciudad').value = '';
  document.getElementById('unidad-clear').style.display = 'none';
  document.getElementById('unidad-drop').style.display = 'none';
  buildStepper();
}

document.addEventListener('DOMContentLoaded', () => {
  // Cerrar combo al clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#unidad-combo')) unidadClose();
  });

  buildStepper();
  updateProgress();
  document.querySelector('.pm-block[data-block="0"]')?.classList.add('active');
  renderPosiciones();

  // Chips Bloque B — áreas (disparan detalle dinámico)
  document.querySelectorAll('#bloque-b-chips .pm-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('sel');
      renderAreaDetalles();
      calcReglas();
      buildStepper();
    });
  });

  // Chips Bloque H y J
  document.querySelectorAll('#bloque-H .pm-chips .pm-chip, #bloque-J .pm-chips .pm-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('sel'));
  });

  // Inputs numéricos que disparan el motor
  document.getElementById('campo-m2')?.addEventListener('input', calcReglas);

  // Inicializar Bloque E
  renderEspacios();

  // Inicializar Bloque I
  actualizarTablaReutilizacion({ pcTotal:0, telefonos:0, aps:0, switches:0, impresoras:0, upsUnits:0 });

  // Cerrar preview al hacer clic fuera del box
  document.getElementById('pv-overlay').addEventListener('click', function(e) {
    if (e.target === this) cerrarPreview();
  });

  // Stepper revalida en campos requeridos de Bloque A
  ['campo-nombre','campo-ciudad','campo-tipo','campo-tipo-parametrico','campo-version','campo-lider','campo-inicio','campo-alcance'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', buildStepper);
    document.getElementById(id)?.addEventListener('change', buildStepper);
  });

  // Cerrar datepicker al clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dp-wrap')) dpCloseAll();
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATEPICKER CUSTOM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DP_MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DP_DIAS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];
let _dpState = {}; // { wrapId: { year, month, view:'days'|'months' } }

function dpOpen(wrapId) {
  dpCloseAll();
  const wrap  = document.getElementById(wrapId);
  const input = wrap.querySelector('.dp-input');
  const val   = input.value; // formato YYYY-MM-DD

  let year, month;
  if (val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const d = new Date(val + 'T00:00:00');
    year = d.getFullYear(); month = d.getMonth();
  } else {
    const now = new Date();
    year = now.getFullYear(); month = now.getMonth();
  }
  _dpState[wrapId] = { year, month, view: 'days' };
  dpRender(wrapId);
}

function dpCloseAll() {
  document.querySelectorAll('.dp-pop').forEach(p => p.remove());
}

function dpRender(wrapId) {
  const wrap  = document.getElementById(wrapId);
  const old   = wrap.querySelector('.dp-pop');
  if (old) old.remove();

  const st    = _dpState[wrapId];
  const pop   = document.createElement('div');
  pop.className = 'dp-pop';
  pop.onclick   = e => e.stopPropagation();

  if (st.view === 'months') {
    pop.innerHTML = `
      <div class="dp-nav">
        <button class="dp-nav-btn" onclick="dpYear('${wrapId}',-1)">‹</button>
        <span class="dp-month-lbl">${st.year}</span>
        <button class="dp-nav-btn" onclick="dpYear('${wrapId}',1)">›</button>
      </div>
      <div class="dp-months">
        ${DP_MESES.map((m,i) => `
          <button class="dp-mon-btn${i===st.month?' dp-mon-sel':''}"
            onclick="dpSelectMonth('${wrapId}',${i})">${m.slice(0,3)}</button>`).join('')}
      </div>`;
  } else {
    const today   = new Date();
    const selVal  = wrap.querySelector('.dp-input').value;
    const selDate = selVal ? new Date(selVal + 'T00:00:00') : null;
    const first   = new Date(st.year, st.month, 1);
    // Lunes=0 … Dom=6
    let startDow = first.getDay() - 1; if (startDow < 0) startDow = 6;
    const daysInMonth = new Date(st.year, st.month + 1, 0).getDate();

    let cells = '';
    DP_DIAS.forEach(d => { cells += `<div class="dp-dow">${d}</div>`; });
    for (let i = 0; i < startDow; i++) cells += `<button class="dp-day dp-empty" disabled></button>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dd   = new Date(st.year, st.month, d);
      const iso  = `${st.year}-${String(st.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isSel = selDate && dd.toDateString() === selDate.toDateString();
      const isTod = dd.toDateString() === today.toDateString();
      const isPast = dd < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      cells += `<button class="dp-day${isSel?' dp-sel':isTod?' dp-today':isPast?' dp-past':''}"
        onclick="dpSelect('${wrapId}','${iso}')">${d}</button>`;
    }

    pop.innerHTML = `
      <div class="dp-nav">
        <button class="dp-nav-btn" onclick="dpMonth('${wrapId}',-1)">‹</button>
        <span class="dp-month-lbl" onclick="dpToggleView('${wrapId}')">${DP_MESES[st.month]} ${st.year}</span>
        <button class="dp-nav-btn" onclick="dpMonth('${wrapId}',1)">›</button>
      </div>
      <div class="dp-grid">${cells}</div>`;
  }

  wrap.appendChild(pop);
}

function dpMonth(wrapId, delta) {
  const st = _dpState[wrapId];
  st.month += delta;
  if (st.month > 11) { st.month = 0;  st.year++; }
  if (st.month < 0)  { st.month = 11; st.year--; }
  dpRender(wrapId);
}
function dpYear(wrapId, delta) {
  _dpState[wrapId].year += delta;
  dpRender(wrapId);
}
function dpToggleView(wrapId) {
  const st = _dpState[wrapId];
  st.view = st.view === 'days' ? 'months' : 'days';
  dpRender(wrapId);
}
function dpSelectMonth(wrapId, month) {
  const st = _dpState[wrapId];
  st.month = month; st.view = 'days';
  dpRender(wrapId);
}
// Setea programáticamente una fecha ISO en el campo visible
function dpSetValue(fieldId, iso) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) { input.value = ''; return; }
  const [y,m,d] = iso.split('-');
  input.dataset.isoValue = iso;
  input.value = `${d} ${DP_MESES[+m-1]} ${y}`;
}

function dpSelect(wrapId, iso) {
  const wrap  = document.getElementById(wrapId);
  const input = wrap.querySelector('.dp-input');
  input.value = iso;
  // Mostrar formato legible en el campo
  const [y,m,d] = iso.split('-');
  // Mostrar legible pero mantener ISO como valor real via dataset
  input.dataset.isoValue = iso;
  input.value = `${d} ${DP_MESES[+m-1]} ${y}`;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  dpCloseAll();
  buildStepper();
}
