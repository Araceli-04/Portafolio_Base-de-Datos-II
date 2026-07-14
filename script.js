/* ═══════════════════════════════════════════
   PORTAFOLIO BASE DE DATOS — script.js
═══════════════════════════════════════════ */

/* ── Dominio institucional permitido ── */
const DOMINIO = '@ms.upla.edu.pe';

/* ── Usuarios registrados (simulado en memoria) ── */
// Estructura: { 'correo@ms.upla.edu.pe': { pass, rol, uid, nombre, docs:[] } }
const USUARIOS = {
  'admin@ms.upla.edu.pe': {
    pass: 'admin2024',
    rol: 'admin',
    uid: 'UPLA-0001',
    nombre: 'Administradora',
    docs: []
  }
};

let sesionActiva = null; // { email, rol, uid, nombre }

/* ── Genera ID único institucional ── */
function generarUID(email) {
  const codigo = email.split('@')[0].toUpperCase().substring(0, 8);
  const sufijo = Math.floor(1000 + Math.random() * 9000);
  return `UPLA-${codigo}-${sufijo}`;
}

/* ── Datos por unidad ── */
const UNIDADES = {
  u1: {
    grid: 'gridU1',
    semanas: [
      {
        num: '01', titulo: 'Introducción a las Bases de Datos',
        temas: ['Conceptos fundamentales', 'Tipos de repositorios'],
        archivos: [
          { id:'s01a1', nombre:'Resumen sobre Bases de Datos.pdf', tipo:'pdf', label:'Resumen: Bases de Datos', url:'./docs/Arquitectura de BDD.pdf' },
          { id:'s01a2', nombre:'Tipos de Repositorios para Base de Datos.pdf', tipo:'pdf', label:'Tipos de Repositorios', url:'./docs/Tipos de Repositorios.pdf' }
        ]
      },
      {
        num: '02', titulo: 'Gestores de BD y Modelado E-R',
        temas: ['SGBD', 'SQL', 'Modelo E-R'],
        archivos: [
          { id:'s02a1', nombre:'Resumen Gestores de Base de Datos y su Aplicabilidad.pdf', tipo:'pdf', label:'Resumen: Gestores de BD', url:'./docs/Resumen_02.pdf' },
          { id:'s02a2', nombre:'Manual SQL.pdf',                tipo:'pdf', label:'Manual SQL', url:'./docs/Manual SQL.pdf' },
          { id:'s02a3', nombre:'Modelo Entidad-Relacion.pdf',   tipo:'pdf', label:'Modelo Entidad-Relación', url:'./docs/Ejerciciod de Modelo E-R.pdf' }
        ]
      },
      {
        num: '03', titulo: 'Arquitectura y Modelado Práctico',
        temas: ['Arquitectura BD', 'Ejercicios E-R'],
        archivos: [
          { id:'s03a1', nombre:'Resumen Arquitectura de Base de Datos.pdf', tipo:'pdf', label:'Resumen: Arquitectura de BD', url:'./docs/Resumen 03.pdf' },
          { id:'s03a2', nombre:'Ejercicios Entidad-Relacion.pdf',            tipo:'pdf', label:'Ejercicios Entidad-Relación', url:'./docs/Ejercicios de Modelo E-R.pdf' }
        ]
      },
      {
        num: '04', titulo: 'Álgebra Relacional',
        temas: ['Operadores', 'Consultas relacionales'],
        archivos: [
          { id:'s04a1', nombre:'Algebra Relacional.pdf', tipo:'pdf', label:'Álgebra Relacional', url:'./docs/Resumen 04.pdf' }
        ]
      }
    ]
  },
  u2: {
    grid: 'gridU2',
    semanas: [
      {
        num: '05', titulo: 'SQL Server e Introducción a la Normalización',
        temas: ['SQL Server 2022', 'Normalización'],
        archivos: [
          { id:'s05a1', nombre:'Resumen Introduccion a Microsoft SQL Server 2022.pdf', tipo:'pdf', label:'Resumen: Microsoft SQL Server 2022', url:'./docs/Resumen 05.pdf' },
          { id:'s05a2', nombre:'Normalizacion de Bases de Datos.pdf',                  tipo:'pdf', label:'Normalización de Bases de Datos', url:'./docs/Normalización.pdf' }
        ]
      },
      {
        num: '06', titulo: 'Microsoft SQL Server — Profundización',
        temas: ['SQL Server', 'Actividad práctica'],
        archivos: [
          { id:'s06a1', nombre:'Resumen Microsoft SQL Server.pdf',   tipo:'pdf', label:'Resumen: Microsoft SQL Server',url:'./docs/Resumen_06.pdf' },
          { id:'s06a2', nombre:'Actividad Respondiendo Preguntas.pdf', tipo:'pdf', label:'Actividad: Respondiendo Preguntas',url:'./docs/Actividad_06.pdf' }
        ]
      },
      {
        num: '07', titulo: 'Introducción a SQL',
        temas: ['DDL', 'DML', 'SQL básico'],
        archivos: [
          { id:'s07a1', nombre:'Intro SQL.pdf',  tipo:'pdf', label:'Introducción a SQL', url:'./docs/Resumen_07.pdf' },
        ]
      },
      {
        num: '08', titulo: 'Consultas Avanzadas en SQL Server',
        temas: ['SELECT', 'JOIN', 'Infografías', 'Datos de práctica'],
        archivos: [
          { id:'s08a1', nombre:'Consultas en SQL Server.pdf', tipo:'pdf', label:'Consultas en SQL Server', url:'./docs/Resumen_08.pdf' },
          { id:'s08a2', nombre:'30 Infografias sobre Consultas en SQL.pdf', tipo:'pdf', label:'30 Infografías sobre Consultas SQL', url:'./docs/Infografias_08.pdf' },
          { id:'s08a3', nombre:'Codigo con 50 Datos.txt', tipo:'txt', label:'Código con 50 Datos (TXT)', url:'./docs/50_registros.txt' }
        ]
      }
    ]
  },
  u3: {
    grid: 'gridU3',
    semanas: [
      { num:'09', titulo:'Normativa Académica: Reglamento General de Grados y Títulos', 
        temas:['Reglamento General','Grados Académicos','Títulos Profesionales'],
        archivos:[
          {id:'s09a1', nombre:'Reglamento General de Grados y Títulos.pdf', tipo:'pdf', label:'Reglamento General de Grados y Títulos', url:'./docs/Reglamento de Grados_Titulos.pdf'},
          {id:'s9a2', nombre:'Infografías sobre Vistas,funciones,eschemas,indices y store procedures', tipo:'pdf', label:'Infografias Semana_09, según Grados_Titulos', url:'./docs/Semana_09.pdf'}
        ] 
      },
      { num:'10', titulo:'Gestion de BDD', 
        temas:['Administracion esencial','Gestión de BDD'], 
        archivos:[
          {id:'s10a1', nombre:'Gestion de BDD.pdf', tipo:'pdf', label:'Gestion de BDD', url:'./docs/Gestion de BDD.pdf'},
          {id:'s10a2', nombre:'Administración Esencial de BDD', tipo:'html', label:'Ejercicios_Propuestos', url:'./Admin.html'},
          {id:'s10a3', nombre:'Manual', tipo:'pdf', label:'Manual de Azure', url:'./docs/Manual AZURE.pdf'},
          {id:'s10a4', nombre:'Ejercicios Prácticos en AZURE', tipo:'html', label:'Ejercicios Prácticos en AZURE', url:'./Ejercicios.html'}
        ] },
      { num:'11', titulo:'Seguridad y Control de acceso',
        temas:['Autentificacion','autorizacion','cifrado','seguridad'],
        archivos:[
          {id:'s11a1', nombre:'Seguridad y control de acceso.pdf', tipo:'pdf', label:'Seguridad y contro de acceso', url:'./docs/Seguridad y control de acceso.pdf'},
          {id:'s11a2', nombre:'Actividades de Contro de Acceso', tipo:'html', label:'Actividades_Ejercicios', url:'./control.html'}
        ] 
      },
      { num:'12', titulo:'Respaldo y recuperación',
        temas:['Disponibilidad', 'Recuperación','Respaldo'], 
        archivos:[
          {id:'s12a1', nombre:'Respaldo y recuperación de BDD', tipo:'pdf',label:'Respaldo y recuperación de BDD', url:'./docs/Respaldo y recuperacion.pdf'},
          {id:'s12a2', nombre:'Ejercicios_Respaldo y Recuperación de BDD', tipo:'html',label:'Ejercicios_Respaldo y Recuperación de BDD', url:'./seguridad.html'}
        ] }
    ]
  },
  u4: {
    grid: 'gridU4',
    semanas: [
      { num:'13', titulo:'Monitoreo y Rendimiento',    
        temas:['Estadísticas','Administración','Análisis'], 
        archivos:[
          {id:'s13a1:', nombre:'Monitoreo y Rendimiento', tipo:'pdf', label:'Monitoreo y Rendimiento', url:'./docs/Monitoreo.pdf'},
          {id:'s13a2', nombre:'Ejercicios de Monitoreo y Rendimiento en SQL', tipo:'html', label:'Ejercicios de Monitoreo y Rendimiento en SQL', url:'./Ejercicios-Monitoreo.html'}
        ] },
      { num:'14', titulo:'Autentificación y Mantenimiento en SQL Server', 
        temas:['Manual AWS', 'Microsoft Azure', 'Servidor de B.D'], 
        archivos:[
        {id:'s14a1', nombre:'Manual AWS-Creación de BD', tipo:'html', label:'Manual AWS-Creación de BD', url:'./AWS.html'},
        {id:'s14a2', nombre:'Autentificación y Mantenimiento', tipo:'pdf', label:'Autentificación y Mantenimiento', url:'./docs/Automatización.pdf'},
        {id:'s14a3', nombre:'Ejercicicios de Autentificación y Mantenimiento en SQL', tipo:'html', label:'Ejercicicios de Autentificación y Mantenimiento en SQL', url:'./Automatizacion.html'}
      ]
     },
      { num:'15', titulo:'Microsoft SQL Azure',
        temas:['Conceptos de BDD','Administrar BDD','Copiar BDD','Conectar con SQL Azure'],
        archivos:[
        {id:'s15a1', nombre:'SQL Azure_Capitulos I, II, III, IV, V', tipo:'html',label:'SQL Azure_ Capitulos del I-V', url:'./SQL.html'},
        ] },
      { num:'16', titulo:'Microsoft SQL Azure',
        temas:['TRANSACT-SQL','Instrucciones SQL','Lenguaje de definición de datos'],
        archivos:[
        {id:'s16a1', nombre:'SQL Azure_Capitulos VI, VII, VIII, IX', tipo:'html',label:'SQL Azure_ Capitulos del VI-IX', url:'./ResuAzure.html'}, 
        ] }
    ]
  }
};

/* ════════════════════════
   Auxiliar: buscar semana
════════════════════════ */
function findSemana(num) {
  for (const u of Object.values(UNIDADES)) {
    const s = u.semanas.find(s => s.num === num);
    if (s) return s;
  }
  return null;
}

/* ═════════════════
   1. showSec
═════════════════ */
function showSec(id, linkEl) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  window.scrollTo(0, 0);
}

/* ═════════════════
   2. renderSemanas
═════════════════ */
function renderSemanas() {
  const esAdmin = sesionActiva?.rol === 'admin';

  Object.values(UNIDADES).forEach(({ grid, semanas }) => {
    const el = document.getElementById(grid);
    if (!el) return;

    el.innerHTML = semanas.map(s => {
      const tieneCont = s.archivos.length > 0;
      const pending   = !tieneCont;
      const multi     = s.archivos.length > 1;

      const temaChips = s.temas.map(t =>
        `<span class="chip ${pending ? 'chip-pend' : 'chip-tema'}">${t}</span>`
      ).join('');

      let contenido = '';

      if (pending) {
        contenido = `<div class="semana-btns"><span class="badge-pend">Próximamente</span></div>`;
      } else if (multi) {
        contenido = `<div class="tareas-list">` +
          s.archivos.map((a, i) => {
            const ruta    = a.url || `docs/${a.nombre}`;
            const esPDF   = a.tipo === 'pdf';
            const tipoCls = esPDF ? 'chip-tipo' : 'chip-sql';
            const verBtn  = esPDF
              ? `<button class="btn-ver" onclick="openPDF('${ruta}','${a.label}')">👁 Previsualizar</button>`
              : `<button class="btn-ver btn-abrir" onclick="window.open('${ruta}','_blank')">↗ Ver archivo</button>`;
            const dlBtn   = `<a class="btn-dl" href="${ruta}" download="${a.nombre}">⬇ Descargar</a>`;
            const delBtn  = esAdmin
              ? `<button class="btn-del" onclick="deleteArchivo('${s.num}','${a.id}')" title="Eliminar tarea">🗑</button>`
              : '';
            return `
              <div class="tarea-item" id="tarea-${a.id}">
                <div class="tarea-header">
                  <span class="tarea-num">Tarea ${i + 1}</span>
                  <span class="chip ${tipoCls}" style="font-size:10px;padding:2px 9px">${a.tipo.toUpperCase()}</span>
                  ${delBtn}
                </div>
                <div class="tarea-nombre">${a.label}</div>
                <div class="tarea-btns">${verBtn}${dlBtn}</div>
              </div>`;
          }).join('') +
        `</div>`;
      } else {
        const a    = s.archivos[0];
        const ruta = a.url || `docs/${a.nombre}`;
        const esPDF = a.tipo === 'pdf';
        const verBtn = esPDF
          ? `<button class="btn-ver" onclick="openPDF('${ruta}','${a.label}')">👁 Previsualizar</button>`
          : `<button class="btn-ver btn-abrir" onclick="window.open('${ruta}','_blank')">↗ Ver archivo</button>`;
        const dlBtn  = `<a class="btn-dl" href="${ruta}" download="${a.nombre}">⬇ Descargar</a>`;
        const delBtn = esAdmin
          ? `<button class="btn-del" onclick="deleteArchivo('${s.num}','${a.id}')" title="Eliminar tarea">🗑</button>`
          : '';
        contenido = `<div class="semana-btns">${verBtn}${dlBtn}${delBtn}</div>`;
      }

      const addBtn = esAdmin
        ? `<button class="btn-add-tarea" onclick="openAddModal('${s.num}')">＋ Agregar tarea</button>`
        : '';

      return `
        <div class="semana-card${pending ? ' pendiente' : ''}${multi ? ' multi' : ''}" id="card-sem-${s.num}">
          <div class="semana-num">Semana ${s.num}</div>
          <div class="semana-titulo">${s.titulo}</div>
          <div class="chips-row">${temaChips}</div>
          ${contenido}
          ${addBtn}
        </div>`;
    }).join('');
  });
}

/* ═════════════════════
   3. deleteArchivo
═════════════════════ */
function deleteArchivo(semNum, archivoId) {
  if (sesionActiva?.rol !== 'admin') { showToast('Sin permisos de administrador'); return; }
  const semana = findSemana(semNum);
  if (!semana) return;
  const idx = semana.archivos.findIndex(a => a.id === archivoId);
  if (idx === -1) return;
  const nombre = semana.archivos[idx].label;
  semana.archivos.splice(idx, 1);
  renderSemanas();
  showToast(`🗑 Tarea "${nombre}" eliminada`);
}

/* ══════════════════════════════════════
   4. REGISTRO — nuevo usuario
══════════════════════════════════════ */
function handleRegistro() {
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;
  const nombre = document.getElementById('regNombre').value.trim();

  // Validar dominio institucional
  if (!email.endsWith(DOMINIO)) {
    showToast(`❌ Usa tu correo institucional ${DOMINIO}`);
    return;
  }
  if (!nombre) { showToast('Ingresa tu nombre'); return; }
  if (pass.length < 8) { showToast('La contraseña debe tener al menos 8 caracteres'); return; }
  if (pass !== pass2) { showToast('Las contraseñas no coinciden'); return; }
  if (USUARIOS[email]) { showToast('Este correo ya está registrado'); return; }

  // Crear usuario con ID único
  const uid = generarUID(email);
  USUARIOS[email] = { pass, rol: 'alumna', uid, nombre, docs: [] };

  // Mostrar ID generado
  document.getElementById('uidGenerado').textContent = `Tu ID: ${uid}`;
  document.getElementById('uidResult').style.display = 'flex';

  showToast(`✅ ¡Registrada exitosamente! Tu ID: ${uid}`);

  // Auto-login tras registro
  setTimeout(() => {
    iniciarSesion(email);
  }, 1800);
}

/* ══════════════════════════════════════
   5. LOGIN
══════════════════════════════════════ */
function handleLogin() {
  const email = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPass').value;

  // Validar dominio
  if (!email.endsWith(DOMINIO)) {
    showToast(`❌ Usa tu correo institucional ${DOMINIO}`);
    return;
  }

  const usuario = USUARIOS[email];
  if (usuario && usuario.pass === pass) {
    iniciarSesion(email);
  } else {
    showToast('Correo o contraseña incorrectos');
  }
}

function iniciarSesion(email) {
  const u = USUARIOS[email];
  sesionActiva = { email, rol: u.rol, uid: u.uid, nombre: u.nombre };

  document.getElementById('navUser').textContent   = u.nombre || email.split('@')[0];
  document.getElementById('navUser').style.display = 'inline';
  document.getElementById('btnLogin').style.display  = 'none';
  document.getElementById('btnLogout').style.display = 'inline-block';

  // Mostrar chip de ID único en nav
  const chipEl = document.getElementById('navUID');
  if (chipEl) { chipEl.textContent = u.uid; chipEl.style.display = 'inline'; }

  updateAdminVisibility();
  renderSemanas();
  renderMisDocs();
  showSec('inicio', document.querySelector('.nav-link'));
  showToast(`¡Bienvenida, ${u.nombre || email.split('@')[0]}! 🌸  ID: ${u.uid}`);
}

/* ══════════════════════════════════════
   6. LOGOUT
══════════════════════════════════════ */
function handleLogout() {
  sesionActiva = null;
  document.getElementById('navUser').style.display   = 'none';
  document.getElementById('btnLogin').style.display  = 'inline-block';
  document.getElementById('btnLogout').style.display = 'none';
  const chipEl = document.getElementById('navUID');
  if (chipEl) chipEl.style.display = 'none';
  updateAdminVisibility();
  renderSemanas();
  showSec('inicio', document.querySelector('.nav-link'));
  showToast('Sesión cerrada. ¡Hasta pronto! 👋');
}

/* ══════════════════════════════════════
   7. PANEL MIS DOCUMENTOS
══════════════════════════════════════ */
function renderMisDocs() {
  if (!sesionActiva) return;
  const usuario = USUARIOS[sesionActiva.email];
  const grid = document.getElementById('docsGrid');
  if (!grid) return;

  if (!usuario.docs || usuario.docs.length === 0) {
    grid.innerHTML = `
      <div class="docs-empty" style="grid-column:1/-1">
        <span>📂</span>
        Aún no has subido documentos. ¡Sube el primero!
      </div>`;
    return;
  }

  grid.innerHTML = usuario.docs.map((doc, i) => {
    const icono = doc.tipo === 'pdf' ? '📄' :
                  doc.tipo === 'image' ? '🖼️' : '📝';
    const fecha = new Date(doc.fecha).toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' });
    return `
      <div class="doc-card">
        <div class="doc-icon">${icono}</div>
        <div class="doc-name">${doc.nombre}</div>
        <div class="doc-meta">${(doc.size / 1024).toFixed(1)} KB · ${fecha}</div>
        <div class="doc-actions">
          <button class="btn-doc-open" onclick="abrirDocPropio(${i})">👁 Abrir</button>
          <button class="btn-doc-del"  onclick="eliminarDocPropio(${i})">🗑</button>
        </div>
      </div>`;
  }).join('');
}

function subirDocumento(input) {
  if (!sesionActiva) { showToast('Inicia sesión para subir documentos'); return; }
  const archivos = Array.from(input.files);
  if (!archivos.length) return;

  const usuario = USUARIOS[sesionActiva.email];
  const permitidos = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'image/jpeg', 'image/png', 'text/plain'];
  let subidos = 0;

  archivos.forEach(file => {
    if (!permitidos.includes(file.type) && !file.name.match(/\.(pdf|docx|jpg|jpeg|png|txt|sql)$/i)) {
      showToast(`❌ Formato no permitido: ${file.name}`);
      return;
    }
    const tipo = file.type.startsWith('image') ? 'image' :
                 file.name.endsWith('.pdf')     ? 'pdf'   : 'doc';
    const url  = URL.createObjectURL(file);
    usuario.docs.push({
      nombre: file.name,
      tipo,
      size: file.size,
      fecha: Date.now(),
      url
    });
    subidos++;
  });

  if (subidos > 0) {
    renderMisDocs();
    showToast(`✅ ${subidos} archivo(s) subido(s) correctamente`);
  }
  input.value = ''; // resetear input
}

function abrirDocPropio(idx) {
  if (!sesionActiva) return;
  const doc = USUARIOS[sesionActiva.email].docs[idx];
  if (!doc) return;
  if (doc.tipo === 'pdf') {
    openPDF(doc.url, doc.nombre);
  } else {
    window.open(doc.url, '_blank');
  }
}

function eliminarDocPropio(idx) {
  if (!sesionActiva) return;
  const usuario = USUARIOS[sesionActiva.email];
  const nombre  = usuario.docs[idx]?.nombre;
  usuario.docs.splice(idx, 1);
  renderMisDocs();
  showToast(`🗑 "${nombre}" eliminado`);
}

/* ══════════════════════════════════════
   8. MODAL PDF
══════════════════════════════════════ */
function openPDF(ruta, nombre) {
  const overlay = document.getElementById('modalOverlay');
  const frame   = document.getElementById('pdfFrame');
  const title   = document.getElementById('modalTitle');
  const dlBtn   = document.getElementById('modalDownload');
  title.textContent = nombre;
  dlBtn.href        = ruta;
  dlBtn.download    = nombre;
  overlay.classList.add('open');
  frame.src = '';
  setTimeout(() => { frame.src = ruta; }, 100);
}

function closePDF() {
  document.getElementById('modalOverlay').classList.remove('open');
  setTimeout(() => { document.getElementById('pdfFrame').src = ''; }, 200);
}

/* ══════════════════════════════════════
   9. MODAL AGREGAR TAREA (Admin)
══════════════════════════════════════ */
// Archivo seleccionado temporalmente en el modal admin
let _adminArchivoTemp = null;

function openAddModal(semNum) {
  document.getElementById('addModalSemNum').value = semNum;
  document.getElementById('addLabel').value       = '';
  document.getElementById('addFilePreview').innerHTML = '📁 Haz clic aquí para elegir un archivo';
  document.getElementById('addFileInput').value   = '';
  _adminArchivoTemp = null;
  document.getElementById('addModalOverlay').classList.add('open');
}

function closeAddModal() {
  document.getElementById('addModalOverlay').classList.remove('open');
  _adminArchivoTemp = null;
}

function previsualizarArchivoAdmin(input) {
  const file = input.files[0];
  if (!file) return;
  _adminArchivoTemp = file;
  const icono = file.type === 'application/pdf' ? '📄' :
                file.name.match(/\.(jpg|jpeg|png)$/i) ? '🖼️' : '📝';
  const size  = (file.size / 1024).toFixed(1);
  document.getElementById('addFilePreview').innerHTML =
    `${icono} <strong>${file.name}</strong><br><span style="font-size:11px;color:var(--text-s)">${size} KB — listo para subir</span>`;
  // Auto-completar label si está vacío
  const labelInput = document.getElementById('addLabel');
  if (!labelInput.value.trim()) {
    labelInput.value = file.name.replace(/\.[^.]+$/, '');
  }
}

function confirmarAgregarTarea() {
  const semNum = document.getElementById('addModalSemNum').value;
  const label  = document.getElementById('addLabel').value.trim();

  if (!label)             { showToast('Escribe un nombre para la tarea'); return; }
  if (!_adminArchivoTemp) { showToast('Selecciona un archivo desde tu computadora'); return; }

  const semana = findSemana(semNum);
  if (!semana) return;

  const file  = _adminArchivoTemp;
  const tipo  = file.type === 'application/pdf' ? 'pdf' :
                file.name.match(/\.(jpg|jpeg|png)$/i) ? 'image' : 'doc';
  const url   = URL.createObjectURL(file);
  const id    = 'custom_' + Date.now();

  semana.archivos.push({ id, nombre: file.name, tipo, label, url });
  if (semana.temas[0] === 'Pendiente') semana.temas = [label];

  closeAddModal();
  renderSemanas();
  showToast(`✅ Tarea "${label}" agregada a Semana ${semNum}`);
}

/* ══════════════════════════════════════
   10. updateAdminVisibility
══════════════════════════════════════ */
function updateAdminVisibility() {
  const esAdmin = sesionActiva?.rol === 'admin';
  document.querySelectorAll('[data-admin]').forEach(el => {
    el.style.display = esAdmin ? '' : 'none';
  });
  const badge = document.getElementById('adminBadge');
  if (badge) badge.style.display = esAdmin ? 'inline-flex' : 'none';

  // Mostrar/ocultar link "Mis Docs" en el nav
  const linkDocs = document.getElementById('linkMisDocs');
  if (linkDocs) linkDocs.style.display = sesionActiva ? 'inline-block' : 'none';
}

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── Nav scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Escape cierra modales ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePDF(); closeAddModal(); }
});

/* ═══════════════════════════════════════
   Constelación canvas
═══════════════════════════════════════ */
function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, mouse = { x: -999, y: -999 };
  const N = 70, MAX_DIST = 110, MOUSE_RAD = 150;
  const pts = [];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  function initPts() {
    pts.length = 0;
    for (let i = 0; i < N; i++)
      pts.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()*1.8+.8 });
  }
  function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }

  function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
      const d=dist(pts[i],pts[j]);
      if(d<MAX_DIST) {
        const near=dist(pts[i],mouse)<MOUSE_RAD||dist(pts[j],mouse)<MOUSE_RAD;
        const alpha=(1-d/MAX_DIST)*(near?.4:.1);
        ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=near?`rgba(77,182,172,${alpha})`:`rgba(200,130,210,${alpha})`;
        ctx.lineWidth=near?1:.5; ctx.stroke();
      }
    }
    pts.forEach(p => {
      const near=dist(p,mouse)<MOUSE_RAD;
      ctx.beginPath(); ctx.arc(p.x,p.y,near?p.r*2.2:p.r,0,Math.PI*2);
      ctx.fillStyle=near?'rgba(77,182,172,.8)':'rgba(190,120,200,.4)'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  canvas.parentElement.addEventListener('mousemove', e => {
    const r=canvas.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x=-999; mouse.y=-999; });
  canvas.parentElement.addEventListener('touchmove', e => {
    const r=canvas.getBoundingClientRect(); mouse.x=e.touches[0].clientX-r.left; mouse.y=e.touches[0].clientY-r.top;
  },{passive:true});
  window.addEventListener('resize', () => { resize(); initPts(); });
  resize(); initPts(); draw();
}

/* ── Drag & Drop en zona de subida ── */
function initDropZone() {
  const zone = document.getElementById('dropZone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--menta-d)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = 'var(--menta)'; });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.borderColor = 'var(--menta)';
    const input = document.getElementById('fileInput');
    // Simular input files con los archivos del drop
    const dt = new DataTransfer();
    Array.from(e.dataTransfer.files).forEach(f => dt.items.add(f));
    input.files = dt.files;
    subirDocumento(input);
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderSemanas();
  initConstellation();
  initDropZone();
  updateAdminVisibility();
});