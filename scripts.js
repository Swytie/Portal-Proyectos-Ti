'use strict';
/* Portafolio Expansión TI · CHRISTUS MUGUERZA
   Todo el procesamiento ocurre en el navegador: el Excel nunca sale del equipo. */
(function () {

// ═══════════════════════════ CONFIGURACIÓN ═══════════════════════════
const PM_CONFIG = [
  { name: 'Alexia C',    aliases: ['Alexia C', 'A C'],    role: 'Project Manager' },
  { name: 'Alexis L',    aliases: ['Alexis L', 'A L'],    role: 'Project Manager' },
  { name: 'Zaira F',     aliases: ['Zaira F', 'Z F'],     role: 'Project Manager' },
  { name: 'Cynthia M',   aliases: ['Cynthia M', 'C M'],   role: 'Project Manager' },
  { name: 'Alejandra R', aliases: ['Alejandra R', 'A R'], role: 'Jefe de Proyectos de Unidades y Expansión', fullName: 'Alejandra Rojas' },
];
const pmInfo = pm => PM_CONFIG.find(p => p.name === pm) || { name: pm, role: 'Project Manager' };
// Paleta categórica validada (orden fijo; el color sigue al PM, nunca a su posición en un ranking)
const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'];
const C = {
  brand700: '#5C2B60', brand600: '#803F85', brand500: '#9E5EA3', brand300: '#C9A3CC',
  ink2: '#5B4A5D', ink3: '#85748A', grid: '#EFE8F0', plan: '#CFC6D1',
};
const SHEET_RULES = [
  { re: /^consolidado/i,      reason: 'Consolidado histórico: repite los proyectos de las hojas de PM' },
  { re: /^expansi[oó]n$/i,    reason: 'Consolidado de la gerencia: repite los proyectos de las hojas de PM' },
  { re: /^infraestructura$/i, reason: 'Portafolio de otra gerencia (fuera de Expansión TI)' },
  { re: /macti/i,             reason: 'Checklist MACTI (se usa para el indicador de cumplimiento)' },
];
const COLS = {
  tipo:        ['tipo de esfuerzo'],
  rrpp:        ['rrpp', 'rpp'],
  id:          ['# proyecto en oracle', '# proyecto'],
  nombre:      ['nombre del proyecto'],
  direccion:   ['direccion solicitante'],
  tipoProy:    ['tipo de proyecto'],
  tamano:      ['tamano del proyecto'],
  fase:        ['fase actual del proyecto', 'fase actual', 'fase'],
  fechaIni:    ['fecha de inicio'],
  golive:      ['fecha go live'],
  fechaCie:    ['fecha de cierre'],
  unidad:      ['unidades a desplegar', 'unidad'],
  pct:         ['% real'],
  pctPlan:     ['% planeado'],
  monto:       ['monto aprobado ti', 'monto ti'],
  erogado:     ['presupuesto erogado'],
  comprometido:['presupuesto comprometido'],
  disponible:  ['presupuesto disponible'],
  clasif:      ['clasificacion del proyecto'],
  prioridad:   ['prioridad'],
  estado:      ['estado', 'estatus'],
  lider:       ['lider ti'],
  gestor:      ['pm / gestor de proyecto asignado', 'pm / gestor'],
  sponsor:     ['sponsor'],
  liderProy:   ['lider de proyecto'],
  ruta:        ['ruta critica'],
  tipoServ:    ['tipo de servicio'],
  core:        ['aplicativo core'],
  desc:        ['descripcion', 'comentarios'],
  macti:       ['% macti'],
};
const ESFUERZOS = ['Proyecto', 'Backlog', 'Iniciativa', 'Cerrado', 'Cancelado', 'Sin clasificar'];
const ESF_COLOR = { Proyecto: '#803F85', Backlog: '#C9A3CC', Iniciativa: '#9E5EA3', Cerrado: '#85748A', Cancelado: '#B9AEBB', 'Sin clasificar': '#D9CFDA' };
const ESTADO_ORDER = ['parametrizacion', 'en aprobacion', 'iniciativa', 'inicio', 'planeacion', 'ejecucion', 'activo', 'en espera', 'on hold', 'cierre', 'en proceso de cierre', 'cerrado', 'cancelado'];
const MAX_FILE_MB = 30;
const IDB = { name: 'cm_portafolio', store: 'excel_cache', key: 'latest' };
const LS_META = 'cm_excel_meta';

// ═══════════════════════════ UTILIDADES ═══════════════════════════
const INVISIBLE = /[​-‏‪-‮⁦-⁩﻿]/g;
const clean = v => String(v ?? '').replace(INVISIBLE, '').replace(/\s+/g, ' ').trim();
const cleanMulti = v => String(v ?? '').replace(INVISIBLE, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const fold = v => clean(v).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const isBlank = v => ['', '-', '--', 'n/a', 'na', 'nan', 'none', 'null'].includes(fold(v));
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sum = (arr, k) => arr.reduce((s, r) => s + (r[k] || 0), 0);
const uniq = arr => [...new Set(arr)];
const initials = name => clean(name).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

function toMoney(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (isBlank(v)) return 0;
  const n = parseFloat(clean(v).replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function toPct(v) {
  if (v === '' || v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? (v > 1.5 ? v / 100 : v) : null;
  if (isBlank(v)) return null;
  const s = clean(v);
  const n = parseFloat(s.replace(/[%,\s]/g, ''));
  if (!Number.isFinite(n)) return null;
  return s.includes('%') || n > 1.5 ? n / 100 : n;
}
const MESES = { ene: 0, jan: 0, feb: 1, mar: 2, abr: 3, apr: 3, may: 4, jun: 5, jul: 6, ago: 7, aug: 7, sep: 8, sept: 8, set: 8, oct: 9, nov: 10, dic: 11, dec: 11 };
function dmy(d, m, y) {
  y = +y; if (y < 100) y += 2000;
  const dt = new Date(y, +m - 1, +d);
  return dt.getMonth() === +m - 1 && dt.getDate() === +d ? dt : null;
}
function toDate(v) {
  if (v === '' || v == null) return { date: null, text: '', kind: 'vacio' };
  if (v instanceof Date) return { date: new Date(v.getFullYear(), v.getMonth(), v.getDate()), text: '', kind: 'fecha' };
  if (typeof v === 'number') {
    if (v > 20000 && v < 80000) {
      const u = new Date(Math.round((v - 25569) * 864e5));
      return { date: new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate()), text: '', kind: 'fecha' };
    }
    return { date: null, text: String(v), kind: 'texto' };
  }
  const text = cleanMulti(v);
  const f = fold(text);
  if (isBlank(f)) return { date: null, text: '', kind: 'vacio' };
  if (f.includes('iniciativa')) return { date: null, text, kind: 'iniciativa' };
  if (/^(tbd|tbc|por definir|pendiente|sin fecha)$/.test(f)) return { date: null, text, kind: 'tbd' };
  let m = f.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})$/);
  if (m) { const d = dmy(m[1], m[2], m[3]); if (d) return { date: d, text, kind: 'fecha' }; }
  m = f.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) { const d = dmy(m[3], m[2], m[1]); if (d) return { date: d, text, kind: 'fecha' }; }
  m = f.match(/^([a-z]{3,4})\.?[\s\-/]*(\d{2}|\d{4})$/);
  if (m && MESES[m[1]] !== undefined) {
    let y = +m[2]; if (y < 100) y += 2000;
    return { date: new Date(y, MESES[m[1]] + 1, 0), text, kind: 'mes' };
  }
  if (/^20\d{2}$/.test(f)) return { date: new Date(+f, 11, 31), text, kind: 'anio' };
  const found = [...f.matchAll(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g)].map(x => dmy(x[1], x[2], x[3])).filter(Boolean);
  if (found.length) return { date: new Date(Math.max(...found)), text, kind: 'multiple' };
  return { date: null, text, kind: 'texto' };
}

function esfuerzoDe(raw) {
  const f = fold(raw);
  if (!f) return 'Sin clasificar';
  if (f.includes('backlog')) return 'Backlog';
  if (f.includes('cancel')) return 'Cancelado';
  if (f.includes('cerrad') || f.includes('cierre')) return 'Cerrado';
  if (f.includes('iniciativa')) return 'Iniciativa';
  if (f.startsWith('proyecto')) return 'Proyecto';
  return clean(raw);
}
function tipoProyDe(raw) {
  const f = fold(raw);
  if (f === 'ryr' || f === 'r&r' || f === 'r y r') return 'RyR';
  if (f.startsWith('estrat')) return 'Estratégico';
  return isBlank(raw) ? '' : clean(raw);
}
const faseNum = fase => { const m = clean(fase).match(/^(\d{1,2})/); return m ? +m[1] : 99; };
const estadoRank = e => { const i = ESTADO_ORDER.indexOf(fold(e)); return i < 0 ? 50 : i; };
const isCierre = r => /cierr|cerrad|cancel/.test(fold(r.fase) + ' ' + fold(r.estado));

// ═══════════════════════════ PARSER (puro, sin DOM) ═══════════════════════════
function parseWorkbook(wb, XLSXlib) {
  const X = XLSXlib || window.XLSX;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const records = [];
  const sheets = [];
  const pmOrder = [];
  const configured = new Map();
  PM_CONFIG.forEach(pm => pm.aliases.forEach(a => configured.set(fold(a), pm.name)));
  const found = new Set();

  wb.SheetNames.forEach((sheetName, sheetIdx) => {
    const pmName = configured.get(fold(sheetName));
    const rule = SHEET_RULES.find(r => r.re.test(clean(sheetName)));
    if (!pmName && rule) { sheets.push({ sheet: sheetName, status: 'ignored', reason: rule.reason, rows: 0, monto: 0 }); return; }

    const ws = wb.Sheets[sheetName];
    const raw = X.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true, blankrows: true });
    const firstRow = ws['!ref'] ? X.utils.decode_range(ws['!ref']).s.r : 0;
    const hdr = raw.slice(0, 40).findIndex(row => row.some(c => fold(c) === 'nombre del proyecto'));
    if (hdr < 0) {
      sheets.push({ sheet: sheetName, pm: pmName || '', status: pmName ? 'no-header' : 'ignored', reason: pmName ? 'No se encontró la columna "Nombre del proyecto"' : 'No contiene una tabla de proyectos', rows: 0, monto: 0 });
      return;
    }
    const pm = pmName || clean(sheetName);
    found.add(pm);
    const H = raw[hdr].map(fold);
    const idx = {};
    for (const [key, aliases] of Object.entries(COLS)) {
      idx[key] = -1;
      for (const a of aliases) { const i = H.indexOf(a); if (i >= 0) { idx[key] = i; break; } }
    }
    const get = (row, key) => (idx[key] >= 0 ? row[idx[key]] : '');
    const sheetInfo = { sheet: sheetName, pm, status: pmName ? 'ok' : 'auto', rows: 0, monto: 0, skipped: [],
      missingCols: ['tipo', 'monto', 'fase', 'estado', 'unidad', 'pct'].filter(k => idx[k] < 0) };
    if (!pmName) sheetInfo.reason = 'Hoja con proyectos que no está configurada como PM: se incluyó automáticamente';

    for (let r = hdr + 1; r < raw.length; r++) {
      const row = raw[r];
      const excelRow = r + firstRow + 1;
      const nombre = clean(get(row, 'nombre'));
      if (isBlank(nombre) || fold(nombre) === 'nombre del proyecto') continue;
      if (/^(sub)?total(es)?\b|^gran total/.test(fold(nombre))) { sheetInfo.skipped.push(`Fila ${excelRow}: "${nombre}" (fila de totales)`); continue; }
      const pct = toPct(get(row, 'pct'));
      const pctPlan = toPct(get(row, 'pctPlan'));
      const mactiRaw = toPct(get(row, 'macti'));
      const rec = {
        uid: `${sheetIdx}-${excelRow}`, order: sheetIdx * 100000 + excelRow, pm, sheet: sheetName, row: excelRow,
        tipoRaw: clean(get(row, 'tipo')),
        rrpp: isBlank(get(row, 'rrpp')) ? '' : clean(get(row, 'rrpp')),
        id: isBlank(get(row, 'id')) ? '' : clean(get(row, 'id')),
        nombre,
        direccion: clean(get(row, 'direccion')),
        tipoProy: tipoProyDe(get(row, 'tipoProy')),
        tamano: clean(get(row, 'tamano')),
        fase: isBlank(get(row, 'fase')) ? '' : clean(get(row, 'fase')),
        estado: isBlank(get(row, 'estado')) ? '' : clean(get(row, 'estado')),
        unidad: isBlank(get(row, 'unidad')) ? '' : clean(get(row, 'unidad')),
        pct, pctPlan,
        desv: pct != null && pctPlan != null ? pct - pctPlan : null,
        monto: toMoney(get(row, 'monto')),
        erogado: toMoney(get(row, 'erogado')),
        comprometido: toMoney(get(row, 'comprometido')),
        disponible: toMoney(get(row, 'disponible')),
        fechaIni: toDate(get(row, 'fechaIni')),
        golive: toDate(get(row, 'golive')),
        fechaCie: toDate(get(row, 'fechaCie')),
        clasif: clean(get(row, 'clasif')), prioridad: clean(get(row, 'prioridad')),
        lider: clean(get(row, 'lider')), gestor: clean(get(row, 'gestor')), sponsor: clean(get(row, 'sponsor')),
        liderProy: clean(get(row, 'liderProy')), ruta: clean(get(row, 'ruta')), tipoServ: clean(get(row, 'tipoServ')),
        core: clean(get(row, 'core')), desc: cleanMulti(get(row, 'desc')),
        macti: mactiRaw == null ? null : Math.round(mactiRaw * 1000) / 10,
      };
      rec.esfuerzo = esfuerzoDe(rec.tipoRaw);
      rec.activo = rec.esfuerzo === 'Proyecto';
      rec.overdue = rec.activo && !!rec.golive.date && rec.golive.date < today && !isCierre(rec);
      rec.health = rec.desv == null ? 'none' : rec.desv >= -0.05 ? 'ok' : rec.desv >= -0.10 ? 'warn' : 'bad';
      records.push(rec);
      sheetInfo.rows++;
      sheetInfo.monto += rec.monto;
    }
    sheets.push(sheetInfo);
    pmOrder.push(pm);
  });

  PM_CONFIG.forEach(pm => {
    if (!found.has(pm.name) && !sheets.some(s => s.pm === pm.name)) sheets.push({ sheet: pm.name, pm: pm.name, status: 'missing', reason: 'No se encontró la hoja de este PM en el archivo', rows: 0, monto: 0 });
  });

  // MACTI global: checklist dedicado si existe; si no, promedio de la columna "% MACTI" en proyectos activos
  let macti = null;
  const mactiSheet = wb.SheetNames.find(n => /macti/i.test(n));
  if (mactiSheet) {
    const raw = X.utils.sheet_to_json(wb.Sheets[mactiSheet], { header: 1, defval: '' });
    let req = 0, sub = 0;
    raw.slice(3).forEach(row => { if (typeof row[10] === 'number' && row[10] > 0) { req += row[10]; sub += typeof row[11] === 'number' ? row[11] : 0; } });
    if (req > 0) macti = { value: Math.round(sub / req * 1000) / 10, basis: 'checklist' };
  }
  return { records, sheets, pmOrder, issues: auditRecords(records), macti };
}

function auditRecords(records) {
  const checks = [
    { code: 'activo-sin-monto', level: 'warn', label: 'Proyectos activos sin Monto TI', test: r => r.activo && !r.monto },
    { code: 'activo-sin-fase', level: 'warn', label: 'Proyectos activos sin fase', test: r => r.activo && !r.fase },
    { code: 'activo-sin-avance', level: 'warn', label: 'Proyectos activos sin % real o % planeado', test: r => r.activo && (r.pct == null || r.pctPlan == null) },
    { code: 'erogado-excede', level: 'warn', label: 'Erogado mayor al monto aprobado', test: r => r.monto > 0 && r.erogado > r.monto + 1 },
    { code: 'pct-rango', level: 'warn', label: 'Porcentaje de avance mayor a 100%', test: r => (r.pct || 0) > 1.0001 || (r.pctPlan || 0) > 1.0001 },
    { code: 'rrpp-texto', level: 'info', label: 'RRPP con texto en lugar de número', test: r => r.rrpp && !/\d/.test(r.rrpp), detail: r => `RRPP: "${r.rrpp}"` },
    { code: 'sin-esfuerzo', level: 'info', label: 'Sin "Tipo de esfuerzo" (no cuentan como activos ni backlog)', test: r => r.esfuerzo === 'Sin clasificar' },
    { code: 'sin-tipo', level: 'info', label: 'Sin "Tipo de proyecto" (Estratégico / RyR)', test: r => !r.tipoProy },
    { code: 'sin-estado', level: 'info', label: 'Sin estado capturado', test: r => !r.estado },
    { code: 'sin-unidad', level: 'info', label: 'Sin unidad a desplegar', test: r => !r.unidad },
    { code: 'fecha-texto', level: 'info', label: 'Fechas escritas como texto (se muestran tal cual)', test: r => [r.fechaIni, r.golive, r.fechaCie].some(d => d.kind === 'texto' || d.kind === 'multiple'), detail: r => [['Inicio', r.fechaIni], ['Go Live', r.golive], ['Cierre', r.fechaCie]].filter(([, d]) => d.kind === 'texto' || d.kind === 'multiple').map(([k, d]) => `${k}: "${d.text.replace(/\n/g, ' / ')}"`).join(' · ') },
  ];
  const issues = checks.map(c => ({ ...c, items: records.filter(c.test).map(r => ({ uid: r.uid, pm: r.pm, nombre: r.nombre, row: r.row, sheet: r.sheet, detail: c.detail ? c.detail(r) : '' })) }));
  // Duplicados: mismo # de proyecto en más de un registro → riesgo de sumar dos veces el monto
  const byId = {};
  records.forEach(r => { if (r.id && /^\d+$/.test(r.id)) (byId[r.id] = byId[r.id] || []).push(r); });
  const dups = Object.entries(byId).filter(([, rs]) => rs.length > 1).flatMap(([id, rs]) => rs.map(r => ({ uid: r.uid, pm: r.pm, nombre: r.nombre, row: r.row, sheet: r.sheet, detail: `# ${id} aparece ${rs.length} veces` })));
  issues.unshift({ code: 'duplicado', level: 'bad', label: 'Mismo # de proyecto en más de un registro (posible doble conteo)', items: dups });
  return issues.map(({ test, detail, ...rest }) => rest);
}

// ═══════════════════════════ FORMATOS ═══════════════════════════
const NF0 = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 });
const NF2 = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NUM = new Intl.NumberFormat('es-MX');
const money = v => NF0.format(v || 0);
const moneyExact = v => NF2.format(v || 0);
function moneyShort(v) {
  const a = Math.abs(v || 0);
  if (a >= 1e6) return '$' + (v / 1e6).toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' M';
  if (a >= 1e3) return '$' + Math.round(v / 1e3).toLocaleString('es-MX') + ' K';
  return money(v);
}
const pctFmt = v => (v == null ? '—' : Math.round(v * 100) + '%');
const ptsFmt = v => (v == null ? '—' : (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Math.round(v * 100)) + ' pts');
const share = (a, b) => (b > 0 ? a / b : 0);
const DATE_FMT = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
function dateHtml(d) {
  if (d.kind === 'fecha') return esc(DATE_FMT.format(d.date));
  if (d.kind === 'mes') return esc(d.date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }));
  if (d.kind === 'anio') return esc(d.text);
  if (d.kind === 'iniciativa') return '<span class="tag">Iniciativa</span>';
  if (d.kind === 'tbd') return '<span class="tag">Por definir</span>';
  if (d.kind === 'multiple' || d.kind === 'texto') return `<span class="tag" title="${esc(d.text)}"><i class="ti ti-notes"></i>${d.date ? esc(DATE_FMT.format(d.date)) : 'Texto'}</span>`;
  return '<span class="muted">—</span>';
}
const dateText = d => (d.kind === 'fecha' ? DATE_FMT.format(d.date) : d.kind === 'mes' ? d.date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }) : d.text || '—');
const fmtStamp = ts => new Date(ts).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ═══════════════════════════ ESTADO ═══════════════════════════
const S = {
  data: null, meta: null, view: 'general',
  filters: { pm: '', esfuerzo: '', tipo: '', fase: '', unidad: '', estado: '', alerta: '' },
  q: '', sort: { key: 'order', dir: 1 }, charts: {}, pmColor: {},
};
const $ = id => document.getElementById(id);
const ALERTS = [
  { key: 'golive', label: 'Go Live vencido', icon: 'ti-calendar-x', st: 'critical', test: r => r.overdue },
  { key: 'desv', label: 'Atraso > 10 pts vs plan', icon: 'ti-trending-down', st: 'serious', test: r => r.activo && r.desv != null && r.desv < -0.10 },
  { key: 'aprob', label: 'En aprobación', icon: 'ti-hourglass-high', st: 'warning', test: r => fold(r.estado).includes('aprob') },
  { key: 'espera', label: 'En espera / On hold', icon: 'ti-player-pause', st: 'warning', test: r => /espera|hold|pausa|deten/.test(fold(r.estado)) },
  { key: 'sinmonto', label: 'Activos sin monto', icon: 'ti-coin-off', st: 'neutral', test: r => r.activo && !r.monto },
];
const viewRecords = () => (S.data ? (S.view === 'general' ? S.data.records : S.data.records.filter(r => r.pm === S.view)) : []);
function applyFilters(rows) {
  const f = S.filters;
  const alert = ALERTS.find(a => a.key === f.alerta);
  return rows.filter(r =>
    (!f.pm || r.pm === f.pm) && (!f.esfuerzo || r.esfuerzo === f.esfuerzo) &&
    (!f.tipo || (r.tipoProy || 'Sin tipo') === f.tipo) && (!f.fase || (r.fase || 'Sin fase') === f.fase) &&
    (!f.unidad || (r.unidad || 'Sin unidad') === f.unidad) && (!f.estado || fold(r.estado || 'Sin estado') === fold(f.estado)) &&
    (!alert || alert.test(r)));
}
function searched(rows) {
  const q = fold(S.q);
  if (!q) return rows;
  return rows.filter(r => fold([r.nombre, r.id, r.rrpp, r.unidad, r.pm, r.direccion, r.estado].join(' ')).includes(q));
}

// ═══════════════════════════ CACHÉ LOCAL (IndexedDB) ═══════════════════════════
function idb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error('IndexedDB no disponible'));
    const req = indexedDB.open(IDB.name, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB.store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function cacheSave(buffer, meta) {
  const db = await idb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(IDB.store, 'readwrite');
    tx.objectStore(IDB.store).put({ buffer, meta }, IDB.key);
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
  });
  localStorage.setItem(LS_META, JSON.stringify(meta));
}
async function cacheLoad() {
  const db = await idb();
  const val = await new Promise((resolve, reject) => {
    const req = db.transaction(IDB.store, 'readonly').objectStore(IDB.store).get(IDB.key);
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
  if (!val) return null;
  if (val instanceof ArrayBuffer) return { buffer: val, meta: readMeta() || { name: 'Portafolio.xlsx', ts: Date.now() } };
  return val;
}
async function cacheClear() {
  localStorage.removeItem(LS_META);
  try {
    const db = await idb();
    await new Promise(resolve => { const tx = db.transaction(IDB.store, 'readwrite'); tx.objectStore(IDB.store).delete(IDB.key); tx.oncomplete = resolve; tx.onerror = resolve; });
  } catch (e) { /* sin IndexedDB no hay nada que borrar */ }
}
function readMeta() { try { return JSON.parse(localStorage.getItem(LS_META) || 'null'); } catch (e) { return null; } }

// ═══════════════════════════ AVISOS Y DIÁLOGOS ═══════════════════════════
function toast(msg, kind = 'good') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = `<i class="ti ${kind === 'bad' ? 'ti-alert-circle' : 'ti-circle-check'}"></i><div>${esc(msg)}</div>`;
  $('toasts').appendChild(el);
  setTimeout(() => el.remove(), kind === 'bad' ? 7000 : 4000);
}
function confirmDialog(title, text, okLabel) {
  return new Promise(resolve => {
    const bg = document.createElement('div');
    bg.className = 'dialog-bg';
    bg.innerHTML = `<div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t"><h3 id="dlg-t">${esc(title)}</h3><p>${esc(text)}</p>
      <div class="dialog-actions"><button class="btn btn-soft" data-r="0">Cancelar</button><button class="btn btn-primary" data-r="1">${esc(okLabel)}</button></div></div>`;
    const close = v => { bg.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
    const onKey = e => { if (e.key === 'Escape') close(false); };
    bg.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) close(b.dataset.r === '1'); else if (e.target === bg) close(false); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(bg);
    bg.querySelector('[data-r="1"]').focus();
  });
}
function setLoading(on, text = 'Procesando archivo…') {
  let el = $('loading');
  if (on && !el) { el = document.createElement('div'); el.id = 'loading'; el.className = 'loading'; el.innerHTML = `<div class="loading-card"><div class="spinner"></div><span>${esc(text)}</span></div>`; document.body.appendChild(el); }
  if (!on && el) el.remove();
}
const nextFrame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

// ═══════════════════════════ CARGA DE ARCHIVO ═══════════════════════════
async function handleFile(file) {
  if (!file) return;
  if (!/\.(xlsx|xlsm|xls)$/i.test(file.name)) return toast('El archivo debe ser de Excel (.xlsx).', 'bad');
  if (file.size > MAX_FILE_MB * 1024 * 1024) return toast(`El archivo pesa más de ${MAX_FILE_MB} MB.`, 'bad');
  setLoading(true);
  await nextFrame();
  try {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array', cellNF: true });
    const data = parseWorkbook(wb);
    data.wb = wb;
    data.buffer = buffer;
    if (!data.records.length) {
      setLoading(false);
      return toast('No se encontraron proyectos. Verifica que sea el Excel del Portafolio Expansión TI (hojas por PM con la columna "Nombre del proyecto").', 'bad');
    }
    const meta = { name: file.name, size: file.size, modified: file.lastModified || null, ts: Date.now() };
    try { await cacheSave(buffer, meta); } catch (e) { localStorage.setItem(LS_META, JSON.stringify(meta)); toast('El archivo se abrió, pero el navegador no permitió guardarlo para la próxima vez.', 'bad'); }
    setData(data, meta);
    hideMenu();
    const nSheets = data.sheets.filter(s => s.status === 'ok' || s.status === 'auto').length;
    toast(`${NUM.format(data.records.length)} registros leídos de ${nSheets} hojas · ${money(sum(data.records, 'monto'))} en Monto TI`);
  } catch (e) {
    console.error(e);
    toast('No se pudo leer el archivo. ¿Está dañado o protegido con contraseña?', 'bad');
  } finally {
    setLoading(false);
  }
}
async function restoreFromCache() {
  if (!readMeta()) return false;
  try {
    const cached = await cacheLoad();
    if (!cached) { localStorage.removeItem(LS_META); refreshMenu(); return false; }
    const wb = XLSX.read(cached.buffer, { type: 'array', cellNF: true });
    const data = parseWorkbook(wb);
    data.wb = wb;
    data.buffer = cached.buffer;
    setData(data, cached.meta);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
function setData(data, meta) {
  S.data = data; S.meta = meta;
  S.pmColor = {};
  let extra = 0;
  data.pmOrder.forEach(pm => {
    const i = PM_CONFIG.findIndex(p => p.name === pm);
    S.pmColor[pm] = i >= 0 ? SERIES[i] : (PM_CONFIG.length + extra < SERIES.length ? SERIES[PM_CONFIG.length + extra++] : C.ink3);
  });
  const saved = sessionStorage.getItem('cm_view');
  S.view = saved && (saved === 'general' || data.pmOrder.includes(saved)) ? saved : 'general';
  resetFilters();
  refreshMenu();
  refreshHeader();
  renderTabs();
  renderView();
}
const pmColor = pm => S.pmColor[pm] || C.brand600;
// Oscurece el color del PM lo justo para que las iniciales en blanco se lean bien (contraste WCAG ≥ 4.5)
function avatarBg(hex) {
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  let [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  for (let k = 0; k < 20 && 1.05 / (0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) + 0.05) < 4.5; k++) [r, g, b] = [r, g, b].map(v => Math.round(v * 0.92));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
function resetFilters() {
  S.filters = { pm: '', esfuerzo: '', tipo: '', fase: '', unidad: '', estado: '', alerta: '' };
  S.q = ''; S.sort = { key: 'order', dir: 1 };
}

// ═══════════════════════════ MENÚ ═══════════════════════════
function refreshMenu() {
  const meta = readMeta();
  const box = $('mn-pf-file');
  box.classList.toggle('has', !!meta);
  $('mn-pf-ico').className = 'ti ' + (meta ? 'ti-file-check' : 'ti-file-spreadsheet');
  $('mn-pf-t').textContent = meta ? 'Archivo guardado en este equipo' : 'Sin archivo en este equipo';
  $('mn-pf-s').title = meta ? meta.name : '';
  $('mn-pf-s').textContent = meta ? `${meta.name} · cargado el ${fmtStamp(meta.ts)}` : 'Carga el Excel del portafolio una vez y quedará guardado aquí.';
  $('mn-pf-load-t').textContent = meta ? 'Reemplazar' : 'Cargar Excel';
  $('mn-pf-open').hidden = !meta;
  const pill = $('mn-pf-pill');
  pill.textContent = meta ? 'Listo' : 'Sin archivo';
  pill.className = 'pill ' + (meta ? 'pill-g' : 'pill-p');
}
function hideMenu() { $('menu').classList.add('is-hidden'); sessionStorage.setItem('cm_dash_open', '1'); }
function showMenu() { showToolsStep(); refreshMenu(); $('menu').classList.remove('is-hidden'); sessionStorage.removeItem('cm_dash_open'); window.scrollTo(0, 0); }
function showToolsStep() {
  $('mn-step-users').classList.add('is-off-right'); $('mn-step-users').setAttribute('aria-hidden', 'true');
  $('mn-step-tools').classList.remove('is-off-left'); $('mn-step-tools').removeAttribute('aria-hidden');
}
function showUsersStep() {
  $('mn-step-tools').classList.add('is-off-left'); $('mn-step-tools').setAttribute('aria-hidden', 'true');
  $('mn-step-users').classList.remove('is-off-right'); $('mn-step-users').removeAttribute('aria-hidden');
}
async function openPortfolio() {
  if (!readMeta()) { $('file-input').click(); return; }
  if (!S.data) {
    setLoading(true, 'Abriendo portafolio…');
    await nextFrame();
    const ok = await restoreFromCache();
    setLoading(false);
    if (!ok) { refreshMenu(); toast('No se encontró el archivo guardado. Cárgalo de nuevo.', 'bad'); $('file-input').click(); return; }
  }
  hideMenu();
}

// ═══════════════════════════ ENCABEZADO Y PESTAÑAS ═══════════════════════════
function refreshHeader() {
  const meta = S.meta;
  $('hdr-file').hidden = !meta;
  $('btn-clear').hidden = !meta;
  if (!meta) return;
  $('hdr-file-name').textContent = meta.name;
  $('hdr-file-name').title = meta.name;
  $('hdr-file-date').textContent = 'Cargado el ' + fmtStamp(meta.ts);
}
function renderTabs() {
  if (!S.data) { $('tabs').innerHTML = ''; return; }
  const count = pm => S.data.records.filter(r => r.pm === pm).length;
  $('tabs').innerHTML = [
    `<button class="tab" role="tab" data-action="view" data-view="general" aria-selected="${S.view === 'general'}"><i class="ti ti-layout-dashboard"></i> Vista general <span class="tab-count">${S.data.records.length}</span></button>`,
    ...S.data.pmOrder.map(pm => `<button class="tab" role="tab" data-action="view" data-view="${esc(pm)}" aria-selected="${S.view === pm}" title="${esc((pmInfo(pm).fullName || pm) + ' · ' + pmInfo(pm).role)}"><span class="tab-dot" style="background:${pmColor(pm)}"></span>${esc(pm)} <span class="tab-count">${count(pm)}</span></button>`),
  ].join('');
}
function setView(view) {
  if (view === S.view) return;
  S.view = view;
  sessionStorage.setItem('cm_view', view);
  resetFilters();
  renderTabs();
  renderView();
  window.scrollTo({ top: 0 });
}

// ═══════════════════════════ VISTAS ═══════════════════════════
const secHead = (num, title, sub) => `<div class="dsec-hd"><span class="dsec-num">${num}</span><div><div class="dsec-title">${title}</div><div class="dsec-sub">${sub}</div></div><span class="dsec-line"></span></div>`;
const card = (id, title, sub, body, meta = '') => `<div class="card"><div class="card-hd"><div><div class="card-title">${title}</div>${sub ? `<div class="card-sub">${sub}</div>` : ''}</div>${meta ? `<span class="card-meta">${meta}</span>` : ''}</div>${body}</div>`;
const chartBox = (id, h) => `<div class="chart-box" style="height:${h}px"><canvas id="${id}" role="img" aria-label=""></canvas></div>`;

function renderEmpty() {
  destroyCharts();
  $('tabs').innerHTML = '';
  $('main').innerHTML = `
    <div class="empty">
      <div class="empty-ico"><i class="ti ti-file-spreadsheet"></i></div>
      <h2>Aún no hay un portafolio cargado</h2>
      <p>Carga el archivo Excel del Portafolio Expansión TI. Quedará guardado en este equipo y se abrirá solo la próxima vez.</p>
      <button class="btn btn-primary btn-lg" data-action="pick-file"><i class="ti ti-upload"></i> Cargar archivo Excel</button>
      <div class="empty-note"><i class="ti ti-lock"></i> El archivo se procesa y guarda solo en este navegador; no se envía a ningún servidor.</div>
    </div>`;
}

function renderView() {
  destroyCharts();
  if (!S.data) return renderEmpty();
  const isGeneral = S.view === 'general';
  const rows = viewRecords();
  const meta = S.meta || {};
  const modified = meta.modified ? `Archivo modificado el ${fmtStamp(meta.modified)}` : `Cargado el ${fmtStamp(meta.ts)}`;
  const nPm = uniq(rows.map(r => r.pm)).length;
  const hero = isGeneral ? `
    <div class="hero">
      <div>
        <span class="eyebrow"><i class="ti ti-layout-dashboard"></i> Vista general</span>
        <h1 class="hero-title">Portafolio Expansión TI 2026</h1>
        <div class="hero-sub"><span><i class="ti ti-folders"></i>${rows.length} registros</span><span><i class="ti ti-users"></i>${nPm} project managers</span><span><i class="ti ti-clock"></i>${esc(modified)}</span></div>
        <nav class="sec-index" aria-label="Secciones">
          <button data-action="goto" data-target="sec-resumen"><span>01</span> Resumen</button>
          <button data-action="goto" data-target="sec-inversion"><span>02</span> Inversión</button>
          <button data-action="goto" data-target="sec-avance"><span>03</span> Avance</button>
          <button data-action="goto" data-target="sec-detalle"><span>04</span> Detalle</button>
          <button data-action="goto" data-target="sec-calidad"><span>05</span> Calidad</button>
        </nav>
      </div>
      <div class="hero-actions">
        <button class="btn btn-soft" data-action="export-all" title="Todas las pestañas de los PMs en un solo listado, con todas sus columnas"><i class="ti ti-table-export"></i> Descargar consolidado</button>
        <button class="btn btn-primary" data-action="export" title="Descargar en formato MSR_R con los filtros aplicados"><i class="ti ti-file-download"></i> Exportar MSR_R</button>
      </div>
    </div>` : `
    <div class="pm-hero" style="--pm-color:${pmColor(S.view)};--pm-avatar:${avatarBg(pmColor(S.view))}">
      <div class="pm-avatar">${esc(initials(S.view))}</div>
      <div class="pm-hero-main">
        <span class="eyebrow"><i class="ti ${pmInfo(S.view).fullName ? 'ti-user-star' : 'ti-user'}"></i> ${esc(pmInfo(S.view).role)}</span>
        <h1 class="hero-title" style="margin-top:8px">${esc(pmInfo(S.view).fullName || S.view)}</h1>
        <div class="hero-sub"><span><i class="ti ti-folders"></i>${rows.length} registros</span><span><i class="ti ti-building-hospital"></i>${uniq(rows.map(r => r.unidad).filter(Boolean)).length} unidades</span><span><i class="ti ti-file-spreadsheet"></i>Hoja "${esc(rows[0] ? rows[0].sheet : S.view)}"</span></div>
      </div>
      <div class="hero-actions">
        <button class="btn btn-soft" data-action="export-all" title="Solo los proyectos de ${esc(S.view)}, en una hoja con el formato de su pestaña"><i class="ti ti-table-export"></i> Descargar consolidado</button>
        <button class="btn btn-primary" data-action="export" title="Descargar en formato MSR_R con los filtros aplicados"><i class="ti ti-file-download"></i> Exportar MSR_R</button>
      </div>
    </div>`;

  const inversion = isGeneral
    ? `<div class="grid grid-2">
        ${card('', 'Monto aprobado TI por PM', 'Total aprobado en pesos mexicanos', chartBox('ch-monto', 230))}
        ${card('', 'Ejecución presupuestal por PM', 'Cuánto del monto se ha erogado, comprometido o sigue disponible', chartBox('ch-ejec', 230) + legendHtml([['Erogado', C.brand700], ['Comprometido', C.brand500], ['Disponible', C.brand300]]))}
      </div>
      <div style="margin-top:14px">${card('', 'Composición del monto por tipo de proyecto', 'Expansión estratégica contra crecimiento (RyR)', '<div id="split-tipo"></div>')}</div>`
    : `<div class="grid grid-2">
        ${card('', 'Monto aprobado TI por unidad', 'Unidades con mayor inversión', chartBox('ch-monto', 260))}
        ${card('', 'Ejecución presupuestal por unidad', 'Erogado, comprometido y disponible', chartBox('ch-ejec', 260) + legendHtml([['Erogado', C.brand700], ['Comprometido', C.brand500], ['Disponible', C.brand300]]))}
      </div>
      <div style="margin-top:14px">${card('', 'Composición del monto por tipo de proyecto', 'Expansión estratégica contra crecimiento (RyR)', '<div id="split-tipo"></div>')}</div>`;

  const avance = `<div class="grid grid-2">
      ${card('', 'Registros por fase', 'Fase actual del proyecto, en orden oficial', chartBox('ch-fase', 240))}
      ${card('', 'Registros por estado', 'Estado capturado por el PM', chartBox('ch-estado', 240))}
    </div>
    ${isGeneral ? `<div style="margin-top:14px">${card('', 'Avance real contra planeado por PM', 'Promedio de los proyectos activos con avance capturado', chartBox('ch-avance', 250) + legendHtml([['Real', C.brand600], ['Planeado', C.plan]]))}</div>` : ''}`;

  $('main').innerHTML = `
    ${hero}
    <div class="filters" id="filters"></div>
    <section class="dsec" id="sec-resumen">${secHead('01', 'Resumen ejecutivo', 'Indicadores clave con los filtros aplicados')}<div id="kpis"></div><div class="alerts" id="alerts"></div></section>
    <section class="dsec" id="sec-inversion">${secHead('02', 'Inversión y ejecución', isGeneral ? 'Distribución del monto aprobado y su ejercicio por PM' : 'Distribución del monto aprobado y su ejercicio por unidad')}${inversion}</section>
    <section class="dsec" id="sec-avance">${secHead('03', 'Avance, fases y estados', 'Dónde está cada proyecto y cómo va contra lo planeado')}${avance}</section>
    <section class="dsec" id="sec-detalle">${secHead('04', 'Detalle de proyectos', 'Haz clic en un proyecto para ver toda su información')}
      <div class="card tbl-card">
        <div class="tbl-tools">
          <label class="search"><i class="ti ti-search"></i><span class="sr-only">Buscar</span><input id="q" type="search" placeholder="Buscar por nombre, # proyecto, RRPP o unidad" autocomplete="off"></label>
          <span class="count-pill" id="tbl-count"></span>
        </div>
        <div class="tbl-scroll" id="tbl"></div>
      </div>
    </section>
    <section class="dsec" id="sec-calidad">${secHead('05', 'Calidad de los datos', 'Qué se leyó del Excel y qué conviene corregir en el archivo')}<div id="quality"></div></section>`;
  update();
}
const legendHtml = items => `<div class="legend">${items.map(([l, c]) => `<span><i style="background:${c}"></i>${esc(l)}</span>`).join('')}</div>`;

function update() {
  const base = viewRecords();
  const rows = applyFilters(base);
  renderFilters(base, rows);
  renderKpis(rows);
  renderAlerts(base);
  renderCharts(rows);
  renderTable();
  renderQuality(base);
}

// ── Filtros ──
function renderFilters(base, rows) {
  const isGeneral = S.view === 'general';
  const opts = (key, values) => values.map(v => `<option value="${esc(v)}"${S.filters[key] === v ? ' selected' : ''}>${esc(v)}</option>`).join('');
  const sel = (key, label, values) => `<select class="fsel${S.filters[key] ? ' is-active' : ''}" data-filter="${key}" aria-label="${label}"><option value="">${label}</option>${opts(key, values)}</select>`;
  const fases = uniq(base.map(r => r.fase || 'Sin fase')).sort((a, b) => faseNum(a) - faseNum(b) || a.localeCompare(b));
  const estados = uniqueFold(base.map(r => r.estado || 'Sin estado')).sort((a, b) => estadoRank(a) - estadoRank(b) || a.localeCompare(b));
  const unidades = uniq(base.map(r => r.unidad || 'Sin unidad')).sort((a, b) => a.localeCompare(b, 'es'));
  const tipos = uniq(base.map(r => r.tipoProy || 'Sin tipo')).sort();
  const esf = ESFUERZOS.filter(e => base.some(r => r.esfuerzo === e)).concat(uniq(base.map(r => r.esfuerzo)).filter(e => !ESFUERZOS.includes(e)));
  const active = Object.entries(S.filters).filter(([, v]) => v);
  const label = { pm: 'PM', esfuerzo: 'Esfuerzo', tipo: 'Tipo', fase: 'Fase', unidad: 'Unidad', estado: 'Estado', alerta: 'Alerta' };
  $('filters').innerHTML = `
    <span class="filters-label"><i class="ti ti-adjustments-horizontal"></i> Filtros</span>
    ${isGeneral ? sel('pm', 'Todos los PMs', S.data.pmOrder) : ''}
    ${sel('esfuerzo', 'Tipo de esfuerzo', esf)}
    ${sel('tipo', 'Tipo de proyecto', tipos)}
    ${sel('fase', 'Fase', fases)}
    ${sel('estado', 'Estado', estados)}
    ${sel('unidad', 'Unidad', unidades)}
    <span class="filters-spacer"></span>
    <span class="filters-count">${rows.length === base.length ? `${base.length} registros` : `${rows.length} de ${base.length} registros`}</span>
    ${active.length ? `<button class="btn btn-ghost" data-action="clear-filters"><i class="ti ti-filter-off"></i> Limpiar</button>` : ''}
    ${active.length ? `<div class="chips-active">${active.map(([k, v]) => `<button class="chip-active" data-action="drop-filter" data-key="${k}">${label[k]}: ${esc(k === 'alerta' ? ALERTS.find(a => a.key === v).label : v)} <i class="ti ti-x"></i></button>`).join('')}</div>` : ''}`;
}
function uniqueFold(arr) { const seen = new Set(); return arr.filter(v => { const f = fold(v); if (seen.has(f)) return false; seen.add(f); return true; }); }

// ── KPIs ──
function renderKpis(rows) {
  const monto = sum(rows, 'monto'), erog = sum(rows, 'erogado'), comp = sum(rows, 'comprometido'), disp = sum(rows, 'disponible');
  const byEsf = {}; rows.forEach(r => { byEsf[r.esfuerzo] = (byEsf[r.esfuerzo] || 0) + 1; });
  const activos = rows.filter(r => r.activo);
  const conAvance = activos.filter(r => r.pct != null && r.pctPlan != null);
  const real = conAvance.length ? sum(conAvance, 'pct') / conAvance.length : null;
  const plan = conAvance.length ? sum(conAvance, 'pctPlan') / conAvance.length : null;
  const desv = real != null ? real - plan : null;
  const desvCls = desv == null ? '' : desv >= -0.02 ? 'good' : desv >= -0.10 ? 'warn' : 'bad';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const in90 = new Date(today); in90.setDate(in90.getDate() + 90);
  const proximos = rows.filter(r => r.activo && r.golive.date && r.golive.date >= today && r.golive.date <= in90 && !isCierre(r)).sort((a, b) => a.golive.date - b.golive.date);
  const unidades = uniq(rows.map(r => r.unidad).filter(Boolean));
  const conMacti = rows.filter(r => r.activo && r.macti != null);
  const macti = S.data.macti && S.view === 'general' && !Object.values(S.filters).some(Boolean) ? S.data.macti.value
    : conMacti.length ? Math.round(sum(conMacti, 'macti') / conMacti.length * 10) / 10 : null;
  const nMonto = rows.filter(r => r.monto > 0).length;
  const pE = share(erog, monto), pC = share(comp, monto), pD = share(disp, monto);
  const bd = ESFUERZOS.filter(e => byEsf[e]).concat(Object.keys(byEsf).filter(e => !ESFUERZOS.includes(e)))
    .map(e => `<span class="bd"><i style="background:${ESF_COLOR[e] || C.ink3}"></i>${esc(e)} <b>${byEsf[e]}</b></span>`).join('');
  const lastTile = macti != null
    ? kpi('ti-checklist', 'Cumplimiento MACTI', `${macti.toLocaleString('es-MX', { maximumFractionDigits: 1 })}%`, conMacti.length ? `Promedio de <b>${conMacti.length}</b> proyectos activos con medición` : 'Documentos entregados contra requeridos', meter([[Math.min(macti, 100) / 100, macti >= 80 ? 'var(--good)' : macti >= 50 ? 'var(--warning)' : 'var(--critical)']]))
    : kpi('ti-file-invoice', 'Con RRPP asignada', NUM.format(rows.filter(r => r.rrpp).length), `de <b>${rows.length}</b> registros`, '');

  $('kpis').innerHTML = `<div class="kpis">
    ${kpi('ti-folders', 'Registros en portafolio', NUM.format(rows.length), `<b>${activos.length}</b> proyectos activos`, `<div class="breakdown">${bd}</div>`)}
    ${kpi('ti-coin', 'Monto aprobado TI', moneyShort(monto), `${moneyExact(monto)} · <b>${nMonto}</b> con monto`, meter([[pE, C.brand700], [pC, C.brand500], [pD, C.brand300]]) + `<div class="meter-legend"><span>Erogado ${pctFmt(pE)}</span><span>Comprometido ${pctFmt(pC)}</span><span>Disponible ${pctFmt(pD)}</span></div>`, `Monto aprobado: ${moneyExact(monto)}`)}
    ${kpi('ti-receipt', 'Erogado', moneyShort(erog), `<b>${pctFmt(pE)}</b> del monto aprobado`, meter([[pE, C.brand700]]) + `<div class="meter-legend"><span>Comprometido</span><span>${money(comp)}</span></div>`, moneyExact(erog))}
    ${kpi('ti-wallet', 'Disponible', moneyShort(disp), `<b>${pctFmt(pD)}</b> del monto aprobado`, meter([[pD, C.brand300]]) + `<div class="meter-legend"><span>Por ejercer</span><span>${money(disp)}</span></div>`, moneyExact(disp))}
    ${kpi('ti-progress', 'Avance real promedio', real == null ? '—' : pctFmt(real), conAvance.length ? `Plan <b>${pctFmt(plan)}</b> · <span class="delta ${desvCls}"><i class="ti ${desv >= 0 ? 'ti-arrow-up-right' : 'ti-arrow-down-right'}"></i>${ptsFmt(desv)}</span>` : 'Sin proyectos activos con avance', conAvance.length ? meter([[real, C.brand600]]) + `<div class="meter-legend"><span>${conAvance.length} proyectos activos medidos</span><span>Plan ${pctFmt(plan)}</span></div>` : '')}
    ${kpi('ti-rocket', 'Go Live en 90 días', NUM.format(proximos.length), proximos.length ? `Próximo: <b>${esc(proximos[0].nombre)}</b>` : 'Sin salidas a producción próximas', proximos.length ? `<div class="meter-legend"><span>${esc(DATE_FMT.format(proximos[0].golive.date))}</span><span>${esc(proximos[0].pm)}</span></div>` : '')}
    ${kpi('ti-building-hospital', 'Unidades atendidas', NUM.format(unidades.length), `<b>${rows.filter(r => !r.unidad).length}</b> registros sin unidad`, '')}
    ${lastTile}
  </div>`;
}
function kpi(icon, label, value, sub, foot, title = '') {
  return `<div class="kpi"${title ? ` title="${esc(title)}"` : ''}><div class="kpi-hd"><span class="kpi-ico"><i class="ti ${icon}"></i></span>${label}</div><div class="kpi-val">${value}</div><div class="kpi-sub">${sub}</div>${foot ? `<div class="kpi-foot">${foot}</div>` : ''}</div>`;
}
function meter(parts) {
  return `<div class="meter">${parts.filter(([v]) => v > 0).map(([v, c]) => `<i style="width:${Math.max(0, Math.min(100, v * 100)).toFixed(1)}%;background:${c}"></i>`).join('')}</div>`;
}

// ── Alertas ──
function renderAlerts(base) {
  const current = S.filters.alerta;
  S.filters.alerta = '';
  const rows = applyFilters(base);
  S.filters.alerta = current;
  $('alerts').innerHTML = ALERTS.map(a => {
    const n = rows.filter(a.test).length;
    const pressed = S.filters.alerta === a.key;
    return `<button class="alert st-${a.st}" data-action="alert" data-key="${a.key}" aria-pressed="${pressed}" ${!n && !pressed ? 'disabled' : ''} title="${n ? 'Filtrar estos registros' : 'Sin registros'}">
      <span class="alert-ico"><i class="ti ${a.icon}"></i></span><span><span class="alert-n">${n}</span><span class="alert-l" style="display:block">${a.label}</span></span></button>`;
  }).join('');
}

// ── Gráficas ──
const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const barLabels = {
  id: 'barLabels',
  afterDatasetsDraw(chart, _args, opts) {
    if (!opts || !opts.format) return;
    const { ctx } = chart;
    const horiz = chart.options.indexAxis === 'y';
    ctx.save();
    ctx.font = '600 11.5px "DM Sans", system-ui, sans-serif';
    ctx.fillStyle = C.ink2;
    const meta = chart.getDatasetMeta(chart.data.datasets.length - 1);
    meta.data.forEach((el, i) => {
      const total = opts.total ? opts.total(i) : chart.data.datasets[0].data[i];
      if (!total) return;
      const pos = el.getProps(['x', 'y'], true);
      ctx.textAlign = horiz ? 'left' : 'center';
      ctx.textBaseline = horiz ? 'middle' : 'bottom';
      ctx.fillText(opts.format(total, i), horiz ? pos.x + 6 : pos.x, horiz ? pos.y : pos.y - 5);
    });
    ctx.restore();
  },
};
function chartDefaults() {
  if (!window.Chart || chartDefaults.done) return;
  chartDefaults.done = true;
  Chart.register(barLabels);
  Chart.defaults.font.family = '"DM Sans", system-ui, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = C.ink3;
  if (reducedMotion) Chart.defaults.animation = false;
  else Chart.defaults.animation.duration = 350;
  Chart.defaults.plugins.legend.display = false;
  Object.assign(Chart.defaults.plugins.tooltip, { backgroundColor: '#1C0B20', padding: 10, cornerRadius: 10, titleFont: { weight: '700' }, boxPadding: 4 });
}
function destroyCharts() { Object.values(S.charts).forEach(c => c.destroy()); S.charts = {}; }
function makeChart(id, config, label) {
  const el = $(id);
  if (!el || !window.Chart) return;
  el.setAttribute('aria-label', label);
  if (el.hidden) { el.hidden = false; const msg = el.parentElement.querySelector('.empty-chart'); if (msg) msg.remove(); }
  if (S.charts[id]) S.charts[id].destroy();
  S.charts[id] = new Chart(el, config);
}
function emptyChart(id, text) {
  const el = $(id);
  if (S.charts[id]) { S.charts[id].destroy(); delete S.charts[id]; }
  if (!el || el.hidden) return;
  el.hidden = true;
  el.insertAdjacentHTML('afterend', `<div class="empty-chart"><i class="ti ti-chart-bar-off"></i>${esc(text)}</div>`);
}
const axisMoney = () => ({ ticks: { callback: v => moneyShort(v), maxTicksLimit: window.innerWidth < 600 ? 4 : 6, maxRotation: 0, autoSkipPadding: 12 }, grid: { color: C.grid }, border: { display: false } });
const axisCat ={ grid: { display: false }, border: { color: '#DDD0DE' }, ticks: { color: C.ink2 } };
function topN(entries, n) {
  if (entries.length <= n) return entries;
  const head = entries.slice(0, n - 1);
  const tail = entries.slice(n - 1);
  const other = { label: `Otras (${tail.length})`, items: tail.flatMap(e => e.items) };
  return [...head, other];
}

function renderCharts(rows) {
  chartDefaults();
  if (!window.Chart) return;
  const isGeneral = S.view === 'general';
  // 1 · Monto aprobado por PM o por unidad
  let groups;
  if (isGeneral) {
    groups = S.data.pmOrder.map(pm => ({ label: pm, items: rows.filter(r => r.pm === pm), color: pmColor(pm) })).filter(g => g.items.length);
  } else {
    const byU = {};
    rows.forEach(r => { const k = r.unidad || 'Sin unidad'; (byU[k] = byU[k] || []).push(r); });
    groups = topN(Object.entries(byU).map(([label, items]) => ({ label, items })).sort((a, b) => sum(b.items, 'monto') - sum(a.items, 'monto')), 8)
      .map(g => ({ ...g, color: pmColor(S.view) }));
  }
  const totalMonto = sum(rows, 'monto');
  const withMonto = groups.filter(g => sum(g.items, 'monto') > 0).sort((a, b) => sum(b.items, 'monto') - sum(a.items, 'monto'));
  if (!withMonto.length) emptyChart('ch-monto', 'Sin montos para mostrar con estos filtros');
  else makeChart('ch-monto', {
    type: 'bar',
    data: { labels: withMonto.map(g => g.label), datasets: [{ data: withMonto.map(g => sum(g.items, 'monto')), backgroundColor: withMonto.map(g => g.color), borderRadius: 4, borderSkipped: false, maxBarThickness: 22 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false, layout: { padding: { right: 70 } },
      scales: { x: axisMoney(), y: axisCat },
      plugins: {
        barLabels: { format: v => moneyShort(v) },
        tooltip: { callbacks: { label: ctx => ` ${moneyExact(ctx.raw)} · ${pctFmt(share(ctx.raw, totalMonto))} del total`, afterLabel: ctx => ` ${withMonto[ctx.dataIndex].items.length} registros` } },
      },
    },
  }, `Monto aprobado TI por ${isGeneral ? 'PM' : 'unidad'}`);

  // 2 · Ejecución presupuestal (apilada)
  const ejec = withMonto;
  if (!ejec.length) emptyChart('ch-ejec', 'Sin montos para mostrar con estos filtros');
  else {
    const seg = (label, key, color) => ({ label, data: ejec.map(g => sum(g.items, key)), backgroundColor: color, borderColor: '#fff', borderWidth: { right: 2 }, borderSkipped: false, maxBarThickness: 22 });
    makeChart('ch-ejec', {
      type: 'bar',
      data: { labels: ejec.map(g => g.label), datasets: [seg('Erogado', 'erogado', C.brand700), seg('Comprometido', 'comprometido', C.brand500), seg('Disponible', 'disponible', C.brand300)] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisMoney(), stacked: true }, y: { ...axisCat, stacked: true } },
        plugins: { tooltip: { mode: 'index', callbacks: { label: ctx => ` ${ctx.dataset.label}: ${moneyExact(ctx.raw)} (${pctFmt(share(ctx.raw, sum(ejec[ctx.dataIndex].items, 'monto')))})`, footer: items => `Monto aprobado: ${moneyExact(sum(ejec[items[0].dataIndex].items, 'monto'))}` } } },
      },
    }, 'Ejecución presupuestal: erogado, comprometido y disponible');
  }

  // 3 · Composición por tipo de proyecto
  const tipos = [['Estratégico', C.brand700], ['RyR', C.brand300], ['Sin tipo', '#DDD0DE']]
    .map(([t, color]) => { const items = rows.filter(r => (r.tipoProy || 'Sin tipo') === t); return { t, color, n: items.length, m: sum(items, 'monto') }; })
    .filter(x => x.n);
  $('split-tipo').innerHTML = totalMonto > 0 ? `
    <div class="split">${tipos.filter(x => x.m > 0).map(x => `<i style="width:${(share(x.m, totalMonto) * 100).toFixed(2)}%;background:${x.color}" title="${esc(x.t)}: ${esc(moneyExact(x.m))}"></i>`).join('')}</div>
    <div class="split-rows">${tipos.map(x => `<div class="split-row"><i style="background:${x.color}"></i><div><b>${moneyShort(x.m)}</b><span>${esc(x.t === 'Estratégico' ? 'Expansión (Estratégico)' : x.t === 'RyR' ? 'Crecimiento (RyR)' : 'Sin tipo de proyecto')} · ${pctFmt(share(x.m, totalMonto))} · ${x.n} registros</span></div></div>`).join('')}</div>`
    : '<div class="empty-chart"><i class="ti ti-chart-bar-off"></i>Sin montos para mostrar con estos filtros</div>';

  // 4 · Fases (orden oficial)
  const fases = {};
  rows.forEach(r => { const k = r.fase || 'Sin fase'; fases[k] = (fases[k] || 0) + 1; });
  const fK = Object.keys(fases).sort((a, b) => faseNum(a) - faseNum(b) || a.localeCompare(b));
  if (!fK.length) emptyChart('ch-fase', 'Sin registros con estos filtros');
  else makeChart('ch-fase', {
    type: 'bar',
    data: { labels: fK, datasets: [{ data: fK.map(k => fases[k]), backgroundColor: fK.map(k => (k === 'Sin fase' ? '#DDD0DE' : C.brand600)), borderRadius: 4, borderSkipped: false, maxBarThickness: 48 }] },
    options: {
      responsive: true, maintainAspectRatio: false, layout: { padding: { top: 22 } },
      scales: { x: axisCat, y: { beginAtZero: true, ticks: { precision: 0, maxTicksLimit: 5 }, grid: { color: C.grid }, border: { display: false } } },
      plugins: { barLabels: { format: v => v }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} registros · ${pctFmt(share(ctx.raw, rows.length))}` } } },
    },
  }, 'Registros por fase');

  // 5 · Estados
  const est = {};
  rows.forEach(r => { const k = r.estado || 'Sin estado'; const f = fold(k); if (!est[f]) est[f] = { label: k, n: 0 }; est[f].n++; });
  const eK = Object.values(est).sort((a, b) => b.n - a.n || estadoRank(a.label) - estadoRank(b.label));
  if (!eK.length) emptyChart('ch-estado', 'Sin registros con estos filtros');
  else {
    $('ch-estado').parentElement.style.height = Math.max(200, eK.length * 30 + 30) + 'px';
    makeChart('ch-estado', {
      type: 'bar',
      data: { labels: eK.map(e => e.label), datasets: [{ data: eK.map(e => e.n), backgroundColor: eK.map(e => (e.label === 'Sin estado' ? '#DDD0DE' : C.brand500)), borderRadius: 4, borderSkipped: false, maxBarThickness: 20 }] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false, layout: { padding: { right: 36 } },
        scales: { x: { beginAtZero: true, ticks: { precision: 0, maxTicksLimit: 5 }, grid: { color: C.grid }, border: { display: false } }, y: axisCat },
        plugins: { barLabels: { format: v => v }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} registros · ${pctFmt(share(ctx.raw, rows.length))}` } } },
      },
    }, 'Registros por estado');
  }

  // 6 · Avance real vs planeado por PM
  if (isGeneral) {
    const av = S.data.pmOrder.map(pm => {
      const rs = rows.filter(r => r.pm === pm && r.activo && r.pct != null && r.pctPlan != null);
      return { pm, n: rs.length, real: rs.length ? sum(rs, 'pct') / rs.length : 0, plan: rs.length ? sum(rs, 'pctPlan') / rs.length : 0 };
    }).filter(a => a.n);
    if (!av.length) emptyChart('ch-avance', 'Sin proyectos activos con avance capturado');
    else makeChart('ch-avance', {
      type: 'bar',
      data: { labels: av.map(a => a.pm), datasets: [
        { label: 'Real', data: av.map(a => Math.round(a.real * 100)), backgroundColor: C.brand600, borderRadius: 4, borderSkipped: false, maxBarThickness: 34 },
        { label: 'Planeado', data: av.map(a => Math.round(a.plan * 100)), backgroundColor: C.plan, borderRadius: 4, borderSkipped: false, maxBarThickness: 34 },
      ] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: axisCat, y: { min: 0, max: 100, ticks: { callback: v => v + '%', maxTicksLimit: 6 }, grid: { color: C.grid }, border: { display: false } } },
        plugins: { tooltip: { mode: 'index', callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`, footer: items => { const a = av[items[0].dataIndex]; return `Diferencia: ${ptsFmt(a.real - a.plan)} · ${a.n} proyectos`; } } } },
      },
    }, 'Avance real contra planeado por PM');
  }
}

// ── Tabla ──
const TABLE_COLS = [
  { key: 'nombre', label: 'Proyecto', cls: 'col-name', sort: r => fold(r.nombre) },
  { key: 'id', label: '# Proyecto', sort: r => r.id ? +r.id || r.id : null },
  { key: 'pm', label: 'PM', general: true, sort: r => r.pm },
  { key: 'unidad', label: 'Unidad', sort: r => fold(r.unidad) || null },
  { key: 'esfuerzo', label: 'Esfuerzo', sort: r => ESFUERZOS.indexOf(r.esfuerzo) },
  { key: 'tipoProy', label: 'Tipo', sort: r => r.tipoProy || null },
  { key: 'fase', label: 'Fase', sort: r => (r.fase ? faseNum(r.fase) : null) },
  { key: 'estado', label: 'Estado', sort: r => (r.estado ? estadoRank(r.estado) : null) },
  { key: 'rrpp', label: 'RRPP', sort: r => r.rrpp || null },
  { key: 'fechaIni', label: 'Inicio', sort: r => (r.fechaIni.date ? +r.fechaIni.date : null) },
  { key: 'golive', label: 'Go Live', sort: r => (r.golive.date ? +r.golive.date : null) },
  { key: 'fechaCie', label: 'Cierre', sort: r => (r.fechaCie.date ? +r.fechaCie.date : null) },
  { key: 'monto', label: 'Monto TI', num: true, sort: r => r.monto },
  { key: 'erogado', label: 'Erogado', num: true, sort: r => r.erogado },
  { key: 'disponible', label: 'Disponible', num: true, sort: r => r.disponible },
  { key: 'pct', label: '% Real', num: true, sort: r => r.pct },
  { key: 'pctPlan', label: '% Plan', num: true, sort: r => r.pctPlan },
  { key: 'desv', label: 'Desviación', num: true, sort: r => r.desv },
  { key: 'macti', label: 'MACTI', num: true, macti: true, sort: r => r.macti },
];
function tableRows() {
  const rows = searched(applyFilters(viewRecords()));
  if (S.sort.key === 'order') return rows.slice().sort((a, b) => a.order - b.order);
  const col = TABLE_COLS.find(c => c.key === S.sort.key);
  const dir = S.sort.dir;
  return rows.slice().sort((a, b) => {
    const va = col.sort(a), vb = col.sort(b);
    if (va == null && vb == null) return a.order - b.order;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir || a.order - b.order;
    return String(va).localeCompare(String(vb), 'es') * dir || a.order - b.order;
  });
}
function renderTable() {
  const rows = tableRows();
  const hasMacti = viewRecords().some(r => r.macti != null);
  const cols = TABLE_COLS.filter(c => (!c.general || S.view === 'general') && (!c.macti || hasMacti));
  $('tbl-count').textContent = `${rows.length} ${rows.length === 1 ? 'registro' : 'registros'}`;
  if (!rows.length) {
    $('tbl').innerHTML = `<div class="tbl-empty"><i class="ti ti-search-off"></i>No hay registros con esta búsqueda o filtros.</div>`;
    return;
  }
  const head = cols.map(c => {
    const on = S.sort.key === c.key;
    const icon = on ? (S.sort.dir === 1 ? 'ti-sort-ascending' : 'ti-sort-descending') : 'ti-arrows-sort';
    return `<th class="${c.cls || ''}${c.num ? ' num' : ''}"${on ? ` aria-sort="${S.sort.dir === 1 ? 'ascending' : 'descending'}"` : ''}><button data-action="sort" data-key="${c.key}">${c.label}<i class="ti ${icon}"></i></button></th>`;
  }).join('');
  const healthColor = { ok: 'var(--good)', warn: 'var(--warning)', bad: 'var(--critical)', none: '#DDD0DE' };
  const healthTitle = { ok: 'En línea con el plan', warn: 'Atraso de 5 a 10 pts', bad: 'Atraso mayor a 10 pts', none: 'Sin avance capturado' };
  const cell = (c, r) => {
    switch (c.key) {
      case 'nombre': return `<span class="health" style="background:${healthColor[r.health]}" title="${healthTitle[r.health]}"></span>${r.overdue ? '<i class="ti ti-alert-triangle" style="color:var(--critical);margin-right:6px" title="Go Live vencido"></i>' : ''}${esc(r.nombre)}`;
      case 'id': return r.id ? `<span class="mono">${esc(r.id)}</span>` : '<span class="muted">—</span>';
      case 'pm': return `<span class="who"><i style="background:${pmColor(r.pm)}"></i>${esc(r.pm)}</span>`;
      case 'unidad': return r.unidad ? esc(r.unidad) : '<span class="muted">—</span>';
      case 'esfuerzo': return esc(r.esfuerzo);
      case 'tipoProy': return r.tipoProy ? esc(r.tipoProy) : '<span class="muted">—</span>';
      case 'fase': return r.fase ? `<span class="tag t-fase">${esc(r.fase)}</span>` : '<span class="muted">—</span>';
      case 'estado': return r.estado ? `<span class="tag">${esc(r.estado)}</span>` : '<span class="muted">—</span>';
      case 'rrpp': return r.rrpp ? `<span class="mono">${esc(r.rrpp)}</span>` : '<span class="muted">—</span>';
      case 'fechaIni': case 'golive': case 'fechaCie': return dateHtml(r[c.key]);
      case 'monto': case 'erogado': case 'disponible': return r[c.key] ? `<span title="${esc(moneyExact(r[c.key]))}">${money(r[c.key])}</span>` : '<span class="muted">—</span>';
      case 'pct': return r.pct == null ? '<span class="muted">—</span>' : `<span class="prog"><span class="prog-bar"><i style="width:${Math.min(100, r.pct * 100).toFixed(0)}%;background:${pmColor(r.pm)}"></i></span>${pctFmt(r.pct)}</span>`;
      case 'pctPlan': return pctFmt(r.pctPlan);
      case 'desv': return r.desv == null ? '<span class="muted">—</span>' : `<span class="delta ${r.desv >= -0.05 ? 'good' : r.desv >= -0.10 ? 'warn' : 'bad'}">${ptsFmt(r.desv)}</span>`;
      case 'macti': return r.macti == null ? '<span class="muted">—</span>' : `${r.macti.toLocaleString('es-MX', { maximumFractionDigits: 1 })}%`;
      default: return '';
    }
  };
  $('tbl').innerHTML = `<table class="tbl"><thead><tr>${head}</tr></thead><tbody>${rows.map(r =>
    `<tr data-uid="${r.uid}" tabindex="0" class="${r.overdue ? 'is-overdue' : ''}">${cols.map(c => `<td class="${c.cls || ''}${c.num ? ' num' : ''}">${cell(c, r)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

// ── Calidad de datos ──
function renderQuality(base) {
  const d = S.data;
  const inView = new Set(base.map(r => r.uid));
  const sheets = S.view === 'general' ? d.sheets : d.sheets.filter(s => s.pm === S.view);
  const issues = d.issues.map(i => ({ ...i, items: i.items.filter(x => inView.has(x.uid)) })).filter(i => i.items.length);
  const read = sheets.filter(s => s.status === 'ok' || s.status === 'auto');
  const nObs = issues.filter(i => i.level !== 'info').reduce((s, i) => s + i.items.length, 0);
  const statusTag = s => ({
    ok: '<span class="tag t-ok"><i class="ti ti-check"></i>Leída</span>',
    auto: '<span class="tag t-warn"><i class="ti ti-plus"></i>Agregada automáticamente</span>',
    ignored: '<span class="tag">No se usa</span>',
    missing: '<span class="tag t-bad"><i class="ti ti-alert-triangle"></i>No encontrada</span>',
    'no-header': '<span class="tag t-bad"><i class="ti ti-alert-triangle"></i>Sin encabezados</span>',
  }[s.status]);
  const levelStyle = { bad: 'background:var(--critical-bg);color:var(--critical-ink)', warn: 'background:var(--warning-bg);color:var(--warning-ink)', info: 'background:var(--brand-100);color:var(--brand-700)' };
  const levelIcon = { bad: 'ti-alert-octagon', warn: 'ti-alert-triangle', info: 'ti-info-circle' };
  const skipped = sheets.flatMap(s => (s.skipped || []).map(x => `${s.sheet} · ${x}`));
  const missingCols = sheets.filter(s => s.missingCols && s.missingCols.length);
  const colNames = { tipo: 'Tipo de esfuerzo', monto: 'Monto TI', fase: 'Fase actual', estado: 'Estado', unidad: 'Unidades a desplegar', pct: '% real' };

  $('quality').innerHTML = card('', 'Lectura del archivo', `${esc(S.meta ? S.meta.name : '')}`, `
    <div class="dq-summary">
      <div class="dq-stat"><b>${read.length}</b><span>hojas de PM leídas</span></div>
      <div class="dq-stat"><b>${NUM.format(base.length)}</b><span>registros con nombre de proyecto</span></div>
      <div class="dq-stat"><b>${money(sum(base, 'monto'))}</b><span>Monto TI leído (sin filtros)</span></div>
      <div class="dq-stat"><b>${nObs}</b><span>observaciones por revisar</span></div>
    </div>
    <div style="overflow:auto"><table class="dq-sheets"><thead><tr><th>Hoja del Excel</th><th>Uso en el dashboard</th><th class="num">Registros</th><th class="num">Monto TI</th></tr></thead><tbody>
      ${sheets.map(s => `<tr><td><b>${esc(s.sheet)}</b>${s.reason ? `<div class="muted" style="font-size:12px;color:var(--ink-3)">${esc(s.reason)}</div>` : ''}</td><td>${statusTag(s)}</td><td class="num">${s.rows || '—'}</td><td class="num">${s.monto ? money(s.monto) : '—'}</td></tr>`).join('')}
    </tbody></table></div>
    ${missingCols.length ? `<div class="dq-list" style="margin-bottom:10px">${missingCols.map(s => `<div class="dq-ok" style="background:var(--warning-bg);color:var(--warning-ink)"><i class="ti ti-columns-off"></i>Hoja "${esc(s.sheet)}": no tiene la columna ${s.missingCols.map(k => `"${colNames[k]}"`).join(', ')}.</div>`).join('')}</div>` : ''}
    ${skipped.length ? `<div class="dq-list" style="margin-bottom:10px"><div class="dq-ok" style="background:var(--brand-100);color:var(--brand-700)"><i class="ti ti-filter-minus"></i>${skipped.length} filas de totales omitidas para no duplicar montos: ${esc(skipped.join(' · '))}</div></div>` : ''}
    <div class="dq-list">
      ${issues.length ? issues.map(i => `
        <details class="dq-item"${i.level === 'bad' ? ' open' : ''}>
          <summary><span class="dq-n" style="${levelStyle[i.level]}">${i.items.length}</span><i class="ti ${levelIcon[i.level]}" style="color:var(--ink-3)"></i>${esc(i.label)}<i class="ti ti-chevron-down"></i></summary>
          <ul>${i.items.map(x => `<li><b>${esc(x.nombre)}</b> · ${esc(x.sheet)}, fila ${x.row}${x.detail ? ` · ${esc(x.detail)}` : ''}</li>`).join('')}</ul>
        </details>`).join('') : '<div class="dq-ok"><i class="ti ti-circle-check"></i>Sin observaciones: todos los registros tienen la información clave capturada.</div>'}
    </div>`);
}

// ── Panel de detalle ──
function openDrawer(uid) {
  const r = S.data.records.find(x => x.uid === uid);
  if (!r) return;
  const row = (k, v) => `<dt>${k}</dt><dd>${v === '' || v == null ? '<span class="muted" style="color:var(--ink-3);font-weight:400">—</span>' : v}</dd>`;
  const t = v => (v ? esc(v) : '');
  const d = x => (x.kind === 'vacio' ? '' : esc(dateText(x)));
  const drawer = $('drawer');
  drawer.innerHTML = `
    <div class="drawer-hd">
      <div style="flex:1;min-width:0">
        <span class="who" style="font-size:13px;font-weight:700;color:var(--ink-2)"><i style="background:${pmColor(r.pm)}"></i>${esc(r.pm)} · ${esc(r.esfuerzo)}</span>
        <h2 id="drawer-title">${esc(r.nombre)}</h2>
      </div>
      <button class="btn btn-ghost btn-icon" data-action="close-drawer" aria-label="Cerrar"><i class="ti ti-x"></i></button>
    </div>
    <div class="drawer-body">
      <div class="drawer-sec">Identificación</div>
      <dl class="dl">${row('# Proyecto', r.id ? `<span class="mono">${t(r.id)}</span>` : '')}${row('RRPP', t(r.rrpp))}${row('Dirección solicitante', t(r.direccion))}${row('Unidad', t(r.unidad))}${row('Tipo de proyecto', t(r.tipoProy))}${row('Tipo de esfuerzo', t(r.tipoRaw))}${r.tamano ? row('Tamaño', t(r.tamano)) : ''}${r.clasif ? row('Clasificación', t(r.clasif)) : ''}${r.prioridad ? row('Prioridad', t(r.prioridad)) : ''}</dl>
      <div class="drawer-sec">Estatus y avance</div>
      <dl class="dl">${row('Fase', t(r.fase))}${row('Estado', t(r.estado))}${row('% real', r.pct == null ? '' : pctFmt(r.pct))}${row('% planeado', r.pctPlan == null ? '' : pctFmt(r.pctPlan))}${row('Desviación', r.desv == null ? '' : `<span class="delta ${r.desv >= -0.05 ? 'good' : r.desv >= -0.10 ? 'warn' : 'bad'}">${ptsFmt(r.desv)}</span>`)}${r.macti != null ? row('MACTI', r.macti.toLocaleString('es-MX', { maximumFractionDigits: 1 }) + '%') : ''}</dl>
      <div class="drawer-sec">Fechas</div>
      <dl class="dl">${row('Inicio', d(r.fechaIni))}${row('Go Live', d(r.golive) + (r.overdue ? ' <span class="tag t-bad">Vencido</span>' : ''))}${row('Cierre', d(r.fechaCie))}</dl>
      <div class="drawer-sec">Presupuesto</div>
      <dl class="dl">${row('Monto aprobado TI', r.monto ? moneyExact(r.monto) : '')}${row('Erogado', r.erogado ? `${moneyExact(r.erogado)} · ${pctFmt(share(r.erogado, r.monto))}` : '')}${row('Comprometido', r.comprometido ? moneyExact(r.comprometido) : '')}${row('Disponible', r.disponible ? moneyExact(r.disponible) : '')}</dl>
      <div class="drawer-sec">Responsables</div>
      <dl class="dl">${row('Líder TI', t(r.lider))}${row('PM / Gestor', t(r.gestor))}${row('Sponsor', t(r.sponsor))}${row('Líder de proyecto', t(r.liderProy))}</dl>
      <div class="drawer-sec">Detalle</div>
      <dl class="dl">${row('Ruta crítica', t(r.ruta))}${row('Tipo de servicio', t(r.tipoServ))}${row('Aplicativo core', t(r.core))}${row('Descripción', t(r.desc))}</dl>
      <div class="drawer-sec">Origen del dato</div>
      <dl class="dl">${row('Hoja del Excel', t(r.sheet))}${row('Fila', String(r.row))}</dl>
    </div>`;
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  drawer.querySelector('[data-action="close-drawer"]').focus();
  S.lastFocus = uid;
}
function closeDrawer() {
  if (!document.body.classList.contains('drawer-open')) return;
  document.body.classList.remove('drawer-open');
  $('drawer').setAttribute('aria-hidden', 'true');
  const tr = S.lastFocus && document.querySelector(`tr[data-uid="${S.lastFocus}"]`);
  if (tr) tr.focus();
}

// ═══════════════════════════ EXPORTAR ═══════════════════════════
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('No se pudo cargar ' + src));
    document.head.appendChild(s);
  });
}
// Junta todas las pestañas de PM en un solo listado con TODAS sus columnas y valores originales.
// Las columnas que solo cambian de nombre entre pestañas (p. ej. "RPP" / "RRPP") se unifican.
const CONSOLIDADO_LABEL = {
  tipo: 'Tipo de esfuerzo', rrpp: 'RRPP', id: '# Proyecto', nombre: 'Nombre del proyecto', direccion: 'Dirección solicitante',
  tipoProy: 'Tipo de proyecto', tamano: 'Tamaño del proyecto', fase: 'Fase actual del proyecto', fechaIni: 'Fecha de inicio',
  golive: 'Fecha Go Live', fechaCie: 'Fecha de cierre', unidad: 'Unidades a desplegar', pct: '% Real', pctPlan: '% Planeado',
  monto: 'Monto Aprobado TI', erogado: 'Presupuesto erogado', comprometido: 'Presupuesto comprometido', disponible: 'Presupuesto disponible',
  clasif: 'Clasificación del proyecto', prioridad: 'Prioridad', estado: 'Estado', lider: 'Líder TI', gestor: 'PM / Gestor de proyecto asignado',
  sponsor: 'Sponsor', liderProy: 'Líder de proyecto', ruta: 'Ruta crítica', tipoServ: 'Tipo de servicio', core: 'Aplicativo core', macti: '% MACTI',
};
// Orden de columnas: el mismo de las pestañas del Excel. Se recorren en orden y cada columna
// nueva se inserta justo después de la columna que la antecede en su pestaña.
function consolidadoColumns(wb, sheets, records) {
  const aliasToKey = new Map();
  Object.keys(CONSOLIDADO_LABEL).forEach(k => COLS[k].forEach(a => aliasToKey.set(a, k)));
  const groups = new Map();
  const perSheet = {};
  const hdrRow = {};
  const order = [];
  sheets.forEach(s => {
    const ws = wb.Sheets[s.sheet];
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true, blankrows: true });
    const hdr = raw.slice(0, 40).findIndex(row => row.some(c => fold(c) === 'nombre del proyecto'));
    const range = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : { s: { r: 0, c: 0 }, e: { c: raw[hdr].length - 1 } };
    const c0 = range.s.c;
    hdrRow[s.sheet] = hdr + range.s.r + 1;
    const rowsOfSheet = records.filter(r => r.sheet === s.sheet).map(r => r.row);
    const seen = {};
    let prev = null;
    perSheet[s.sheet] = [];
    for (let i = 0; i <= range.e.c - c0; i++) {
      const c = i + c0;
      const h = raw[hdr][i];
      let key, label;
      if (h === '' || h == null) {
        // Columna sin encabezado: solo se incluye si trae algún dato en los proyectos
        const hasData = rowsOfSheet.some(row => { const cell = ws[XLSX.utils.encode_cell({ r: row - 1, c })]; return cell && cell.v !== '' && cell.v != null; });
        if (!hasData) continue;
        label = `Sin encabezado (${s.sheet}, columna ${XLSX.utils.encode_col(c)})`;
        key = 'x:' + s.sheet + ':' + c;
      } else {
        label = typeof h === 'number' && h > 20000 && h < 80000 ? DATE_FMT.format(toDate(h).date) : clean(h);
        const f = fold(label);
        seen[f] = (seen[f] || 0) + 1;
        const canon = seen[f] === 1 ? aliasToKey.get(f) : null;
        key = canon ? 'k:' + canon : 'h:' + f + (seen[f] > 1 ? '\u0001' + seen[f] : '');
      }
      if (!groups.has(key)) {
        groups.set(key, { key, canon: key.startsWith('k:') ? key.slice(2) : null, spellings: new Map(), dup: key.includes('\u0001') ? key.split('\u0001')[1] : null, from: { sheet: s.sheet, col: c } });
        const at = prev ? order.indexOf(prev) + 1 : 0;
        order.splice(at, 0, key);
      }
      const g = groups.get(key);
      g.spellings.set(label, (g.spellings.get(label) || 0) + 1);
      perSheet[s.sheet].push({ col: c, key });
      prev = key;
    }
  });
  // Nombre de cada columna: la forma en que lo escriben la mayoría de las pestañas
  const cols = order.map(k => {
    const g = groups.get(k);
    const best = [...g.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0];
    return { ...g, label: best + (g.dup ? ` (${g.dup})` : '') };
  });
  return { cols, perSheet, hdrRow };
}
const cloneStyle = s => (s ? JSON.parse(JSON.stringify(s)) : {});
// Fórmulas (incluidas las compartidas entre filas) se copian como su resultado calculado: las columnas cambian de lugar
const cellValue = cell => { if (cell.type === ExcelJS.ValueType.Formula) { const r = cell.result; return r === undefined ? null : r; } return cell.value; };

// Una sola hoja con el mismo formato de las pestañas del portafolio (títulos, encabezados, estilos
// de cada celda y tema de colores), con los proyectos de todos los PMs y una columna "PM" al inicio.
// Se construye sobre una copia del propio Excel para conservar su tema; luego se quitan las demás hojas.
async function buildConsolidadoStyled(d, sheets, records, cols, perSheet, hdrRow) {
  const out = new ExcelJS.Workbook();
  await out.xlsx.load(d.buffer);
  const hdrCounts = {};
  sheets.forEach(s => { hdrCounts[hdrRow[s.sheet]] = (hdrCounts[hdrRow[s.sheet]] || 0) + 1; });
  const H = +Object.entries(hdrCounts).sort((a, b) => b[1] - a[1])[0][0];
  const tplName = sheets.find(s => hdrRow[s.sheet] === H).sheet;
  const tpl = out.getWorksheet(tplName);
  let name = 'Consolidado';
  while (out.getWorksheet(name)) name += ' PMs';
  const ws = out.addWorksheet(name);
  const total = cols.length + 1;

  // Filas de título (las mismas que tiene la pestaña modelo sobre el encabezado)
  for (let r = 1; r < H; r++) {
    const sr = tpl.getRow(r), dr = ws.getRow(r);
    if (sr.height) dr.height = sr.height;
    const st = cloneStyle(sr.getCell(1).style);
    for (let c = 1; c <= total; c++) dr.getCell(c).style = cloneStyle(st);
    dr.getCell(1).value = cellValue(sr.getCell(1));
  }
  (tpl.model.merges || []).forEach(m => {
    const [a, b] = m.split(':');
    const ra = tpl.getCell(a), rb = tpl.getCell(b);
    if (ra.col === 1 && rb.row < H) ws.mergeCells(ra.row, 1, rb.row, total);
  });

  // Encabezado: cada columna conserva el estilo que tiene en su pestaña de origen
  const hr = ws.getRow(H);
  const tplHdrRow = tpl.getRow(H);
  if (tplHdrRow.height) hr.height = tplHdrRow.height;
  hr.getCell(1).value = 'PM';
  hr.getCell(1).style = cloneStyle(tplHdrRow.getCell(1).style);
  ws.getColumn(1).width = 14;
  cols.forEach((c, i) => {
    const srcWs = out.getWorksheet(c.from.sheet);
    const cell = hr.getCell(i + 2);
    cell.value = c.label;
    cell.style = cloneStyle(srcWs.getRow(hdrRow[c.from.sheet]).getCell(c.from.col + 1).style);
    ws.getColumn(i + 2).width = srcWs.getColumn(c.from.col + 1).width || 16;
  });

  // Proyectos: valor y estilo de cada celda copiados de su pestaña
  const thin = { style: 'thin', color: { argb: 'FFBFBFBF' } };
  const emptyStyle = { border: { top: thin, bottom: thin, left: thin, right: thin } };
  records.forEach((r, k) => {
    const srcWs = out.getWorksheet(r.sheet);
    const srcRow = srcWs.getRow(r.row);
    const dr = ws.getRow(H + 1 + k);
    if (srcRow.height) dr.height = srcRow.height;
    const colOf = new Map((perSheet[r.sheet] || []).map(x => [x.key, x.col]));
    const pmCell = dr.getCell(1);
    pmCell.value = r.pm;
    pmCell.style = cloneStyle(srcRow.getCell(1).style);
    cols.forEach((c, i) => {
      const dc = dr.getCell(i + 2);
      if (!colOf.has(c.key)) { dc.style = cloneStyle(emptyStyle); return; }
      const sc = srcRow.getCell(colOf.get(c.key) + 1);
      dc.value = cellValue(sc);
      dc.style = cloneStyle(sc.style);
    });
  });
  ws.views = [{ state: 'normal', showGridLines: true }];

  out.worksheets.filter(w => w.id !== ws.id).forEach(w => out.removeWorksheet(w.id));
  try { out.definedNames.model = []; } catch (e) { /* sin nombres definidos */ }
  out.views = [{ x: 0, y: 0, width: 20000, height: 12000, firstSheet: 0, activeTab: 0, visibility: 'visible' }];
  return out;
}

// Respaldo si el archivo no se puede abrir con formato (p. ej. .xls antiguo): misma hoja, estilo básico
function consolidadoValue(ws, row, col) {
  const cell = ws[XLSX.utils.encode_cell({ r: row - 1, c: col })];
  if (!cell || cell.v === '' || cell.v == null) return { v: null };
  if (cell.t === 'n' && cell.z && XLSX.SSF.is_date(cell.z)) { const dt = toDate(cell.v).date; if (dt) return { v: dt, date: true }; }
  if (cell.t === 'n') return { v: cell.v, fmt: cell.z && cell.z !== 'General' ? cell.z : null };
  if (cell.t === 'b') return { v: cell.v ? 'Sí' : 'No' };
  return { v: cleanMulti(cell.v) };
}
function buildConsolidadoBasic(d, records, cols, perSheet) {
  const out = new ExcelJS.Workbook();
  const ws = out.addWorksheet('Consolidado');
  const hr = ws.addRow(['PM', ...cols.map(c => c.label)]);
  hr.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5C2B60' } };
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  records.forEach(r => {
    const colOf = new Map((perSheet[r.sheet] || []).map(x => [x.key, x.col]));
    const vals = [{ v: r.pm }, ...cols.map(c => (colOf.has(c.key) ? consolidadoValue(d.wb.Sheets[r.sheet], r.row, colOf.get(c.key)) : { v: null }))];
    const row = ws.addRow(vals.map(x => x.v));
    vals.forEach((x, i) => { if (x.date) row.getCell(i + 1).numFmt = 'dd/mm/yyyy'; else if (x.fmt) row.getCell(i + 1).numFmt = x.fmt; });
  });
  ws.columns.forEach(c => { c.width = 18; });
  return out;
}

async function exportConsolidado() {
  const d = S.data;
  if (!d || !d.wb || !d.buffer) return toast('Vuelve a cargar el Excel para generar el consolidado.', 'bad');
  // En la pestaña de un PM se descargan solo sus proyectos; en la vista general, todos
  const onlyPm = S.view === 'general' ? null : S.view;
  const sheets = d.sheets.filter(s => (s.status === 'ok' || s.status === 'auto') && s.rows > 0 && (!onlyPm || s.pm === onlyPm));
  if (!sheets.length) return toast('Este PM no tiene proyectos para descargar.', 'bad');
  setLoading(true, 'Generando consolidado…');
  try {
    if (!window.ExcelJS) await loadScript('vendor/exceljs.min.js');
    const records = d.records.filter(r => !onlyPm || r.pm === onlyPm).sort((a, b) => a.order - b.order);
    const { cols, perSheet, hdrRow } = consolidadoColumns(d.wb, sheets, records);
    let out;
    try { out = await buildConsolidadoStyled(d, sheets, records, cols, perSheet, hdrRow); }
    catch (e) { console.warn('Consolidado con formato no disponible, se usa formato básico', e); out = buildConsolidadoBasic(d, records, cols, perSheet); }
    const buf = await out.xlsx.writeBuffer();
    const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const a = document.createElement('a');
    const now = new Date();
    a.href = url;
    a.download = `Portafolio_TI_Consolidado_${onlyPm ? onlyPm.replace(/\s+/g, '_') + '_' : ''}${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast(onlyPm ? `Consolidado de ${onlyPm}: ${records.length} proyectos.` : `Consolidado generado: ${records.length} proyectos de ${sheets.length} pestañas en una sola hoja.`);
  } catch (e) {
    console.error(e);
    toast('No se pudo generar el consolidado.', 'bad');
  } finally {
    setLoading(false);
  }
}

async function exportExcel() {
  const rows = tableRows();
  if (!rows.length) return toast('No hay registros para exportar con los filtros actuales.', 'bad');
  setLoading(true, 'Generando Excel…');
  try {
    if (!window.ExcelJS) await loadScript('vendor/exceljs.min.js');
    const wb = new ExcelJS.Workbook();
    wb.creator = 'GSEE Proyectos TI';
    wb.created = new Date();
    // Formato MSR_R: fila 1 = secciones combinadas, fila 2 = encabezados, datos desde la fila 3
    const SECTIONS = [
      { label: 'Información del Proyecto', from: 1, to: 11, band: 'FF5C2B60', head: 'FF803F85' },
      { label: 'Presupuesto', from: 12, to: 18, band: 'FF1F3864', head: 'FF2E4E8A' },
    ];
    const asDate = x => (x.date ? x.date : x.text || null);
    const COLS = [
      { h: '# Proyecto', w: 14, v: r => r.id },
      { h: 'Nombre del Proyecto', w: 42, v: r => r.nombre },
      { h: 'PM', w: 14, v: r => r.pm },
      { h: 'Unidad', w: 22, v: r => r.unidad },
      { h: 'Tipo', w: 16, v: r => r.tipoProy },
      { h: 'RRPP', w: 10, v: r => r.rrpp },
      { h: 'Fase', w: 18, v: r => r.fase },
      { h: 'Estado', w: 20, v: r => r.estado },
      { h: 'Fecha Inicio', w: 16, v: r => asDate(r.fechaIni), kind: 'date' },
      { h: 'Fecha Cierre', w: 16, v: r => asDate(r.fechaCie), kind: 'date' },
      { h: 'Fecha Go Live', w: 16, v: r => asDate(r.golive), kind: 'date' },
      { h: 'Monto Aprobado TI', w: 20, v: r => r.monto, kind: 'money' },
      { h: 'Erogado', w: 16, v: r => r.erogado, kind: 'money' },
      { h: 'Disponible', w: 16, v: r => r.disponible, kind: 'money' },
      { h: '% Real', w: 10, v: r => r.pct, kind: 'pct', fmt: '0%' },
      { h: '% Plan', w: 10, v: r => r.pctPlan, kind: 'pct', fmt: '0%' },
      { h: 'Desviación', w: 12, v: r => r.desv, kind: 'pct', fmt: '+0%;-0%;0%' },
      { h: '% MACTI', w: 10, v: r => (r.macti == null ? null : r.macti / 100), kind: 'pct', fmt: '0.00%' },
    ];
    const thin = { style: 'thin', color: { argb: 'FFBFBFBF' } };
    const border = { top: thin, bottom: thin, left: thin, right: thin };
    const sectionOf = i => SECTIONS.find(s => i >= s.from && i <= s.to);

    const ws = wb.addWorksheet('Portafolio', { views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }] });
    ws.columns = COLS.map(c => ({ width: c.w }));
    const r1 = ws.addRow(COLS.map((_, i) => sectionOf(i + 1).label));
    r1.height = 30;
    const r2 = ws.addRow(COLS.map(c => c.h));
    r2.height = 26;
    [r1, r2].forEach((row, k) => row.eachCell((cell, i) => {
      const s = sectionOf(i);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: k ? s.head : s.band } };
      cell.font = { name: 'Calibri', bold: true, size: k ? 10 : 12, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    }));
    SECTIONS.forEach(s => ws.mergeCells(1, s.from, 1, s.to));

    rows.forEach(r => {
      const row = ws.addRow(COLS.map(c => { const v = c.v(r); return v === '' || v === undefined ? null : v; }));
      row.height = 18;
      for (let i = 1; i <= COLS.length; i++) {
        const c = COLS[i - 1], cell = row.getCell(i);
        cell.font = { name: 'Calibri', size: 10 };
        cell.border = border;
        cell.alignment = { vertical: 'middle', horizontal: c.kind === 'money' ? 'right' : c.kind === 'pct' ? 'center' : 'left' };
        if (c.kind === 'money') cell.numFmt = '"$"#,##0.00';
        if (c.kind === 'pct') cell.numFmt = c.fmt;
        if (c.kind === 'date' && cell.value instanceof Date) cell.numFmt = '[$-es-MX]dd mmm yyyy';
      }
    });
    const last = rows.length + 2;
    ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: last, column: COLS.length } };

    // Hoja de resumen: totales, filtros y origen (separada para no alterar el formato MSR_R)
    const rs = wb.addWorksheet('Resumen');
    rs.columns = [{ width: 30 }, { width: 62 }];
    const active = Object.entries(S.filters).filter(([, v]) => v).map(([k, v]) => `${{ pm: 'PM', esfuerzo: 'Esfuerzo', tipo: 'Tipo', fase: 'Fase', unidad: 'Unidad', estado: 'Estado', alerta: 'Alerta' }[k]}: ${k === 'alerta' ? ALERTS.find(a => a.key === v).label : v}`);
    const t = rs.addRow(['Portafolio Expansión TI 2026 · GSEE Proyectos TI']);
    t.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF5C2B60' } };
    rs.addRow([]);
    const meta = [
      ['Vista', S.view === 'general' ? 'Vista general (todos los PMs)' : `${pmInfo(S.view).fullName || S.view} · ${pmInfo(S.view).role}`],
      ['Filtros aplicados', active.length ? active.join(' · ') : 'Ninguno'],
      ['Búsqueda', S.q || 'Ninguna'],
      ['Archivo de origen', S.meta ? S.meta.name : ''],
      ['Generado el', new Date()],
      ['Registros exportados', rows.length],
      ['Monto Aprobado TI', { formula: `SUM(Portafolio!L3:L${last})`, result: sum(rows, 'monto') }],
      ['Erogado', { formula: `SUM(Portafolio!M3:M${last})`, result: sum(rows, 'erogado') }],
      ['Comprometido', sum(rows, 'comprometido')],
      ['Disponible', { formula: `SUM(Portafolio!N3:N${last})`, result: sum(rows, 'disponible') }],
    ];
    meta.forEach(([k, v]) => {
      const row = rs.addRow([k, v]);
      row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF5B4A5D' } };
      row.getCell(2).font = { name: 'Calibri', size: 10 };
      row.getCell(2).alignment = { horizontal: 'left', wrapText: true };
      if (/Monto|Erogado|Comprometido|Disponible/.test(k)) row.getCell(2).numFmt = '"$"#,##0.00';
      if (k === 'Generado el') row.getCell(2).numFmt = '[$-es-MX]dd mmm yyyy hh:mm';
    });

    const buf = await wb.xlsx.writeBuffer();
    const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const a = document.createElement('a');
    a.href = url;
    const d = new Date();
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    a.download = `Portafolio_TI_${S.view === 'general' ? '' : S.view.replace(/\s+/g, '_') + '_'}${stamp}.xlsx`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast(`Excel generado con ${rows.length} registros.`);
  } catch (e) {
    console.error(e);
    toast('No se pudo generar el Excel.', 'bad');
  } finally {
    setLoading(false);
  }
}

// ═══════════════════════════ EVENTOS ═══════════════════════════
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
const onSearch = debounce(v => { S.q = v; renderTable(); }, 160);

document.addEventListener('click', async e => {
  const tr = e.target.closest('tr[data-uid]');
  if (tr && !e.target.closest('button')) return openDrawer(tr.dataset.uid);
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  if (a === 'open-portfolio') return openPortfolio();
  if (a === 'pick-file') return $('file-input').click();
  if (a === 'capex') return showUsersStep();
  if (a === 'back-tools') return showToolsStep();
  if (a === 'profile') { sessionStorage.setItem('gsee_usuario', el.dataset.user); location.href = "rpps/Dashboard - Rpp's.html"; return; }
  if (a === 'logout') { closeDrawer(); if (window.cmLogout) window.cmLogout(); return; }
  if (a === 'menu') { closeDrawer(); return showMenu(); }
  if (a === 'view') return setView(el.dataset.view);
  if (a === 'goto') { const t = $(el.dataset.target); if (t) t.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }); return; }
  if (a === 'export') return exportExcel();
  if (a === 'export-all') return exportConsolidado();
  if (a === 'close-drawer') return closeDrawer();
  if (a === 'clear-filters') { S.filters = { pm: '', esfuerzo: '', tipo: '', fase: '', unidad: '', estado: '', alerta: '' }; return update(); }
  if (a === 'drop-filter') { S.filters[el.dataset.key] = ''; return update(); }
  if (a === 'alert') { S.filters.alerta = S.filters.alerta === el.dataset.key ? '' : el.dataset.key; update(); return; }
  if (a === 'sort') {
    const k = el.dataset.key;
    if (S.sort.key === k) { if (S.sort.dir === 1) S.sort.dir = -1; else S.sort = { key: 'order', dir: 1 }; }
    else S.sort = { key: k, dir: TABLE_COLS.find(c => c.key === k).num ? -1 : 1 };
    return renderTable();
  }
  if (a === 'clear-cache') {
    const ok = await confirmDialog('¿Quitar el archivo de este equipo?', 'Se borrará la copia guardada en este navegador. El archivo original no se modifica. Tendrás que cargarlo de nuevo para ver el dashboard.', 'Quitar archivo');
    if (!ok) return;
    await cacheClear();
    S.data = null; S.meta = null;
    refreshHeader(); refreshMenu(); renderView();
    toast('Archivo quitado de este equipo.');
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'file-input') { const f = e.target.files[0]; e.target.value = ''; return handleFile(f); }
  const key = e.target.dataset && e.target.dataset.filter;
  if (key) { S.filters[key] = e.target.value; update(); }
});
document.addEventListener('input', e => { if (e.target.id === 'q') onSearch(e.target.value); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('tr[data-uid]')) { e.preventDefault(); openDrawer(e.target.dataset.uid); }
});
document.querySelectorAll('img[data-fallback]').forEach(img => img.addEventListener('error', () => {
  img.hidden = true;
  if (img.dataset.fallback) { const fb = $(img.dataset.fallback); if (fb) fb.hidden = false; }
}, { once: true }));
// Arrastrar y soltar el Excel sobre la página
document.addEventListener('dragover', e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
document.addEventListener('drop', e => { if (e.dataTransfer && e.dataTransfer.files.length) { e.preventDefault(); handleFile(e.dataTransfer.files[0]); } });
let resizeT;
window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => Object.values(S.charts).forEach(c => c.resize()), 150); });
window.addEventListener('beforeprint', () => Object.values(S.charts).forEach(c => c.resize()));

window.onCmLogout = () => { closeDrawer(); showMenu(); };
window.PortafolioParser = { parseWorkbook, toDate, toPct, toMoney };

// ═══════════════════════════ INICIO ═══════════════════════════
refreshMenu();
renderEmpty();
// Si el usuario estaba en el dashboard y recarga la página, vuelve directo al dashboard
const reopen = sessionStorage.getItem('cm_dash_open') === '1' && !!readMeta();
if (reopen) $('menu').classList.add('is-hidden');
if (readMeta()) restoreFromCache().then(ok => { if (!ok) { refreshMenu(); if (reopen) showMenu(); } });
})();
