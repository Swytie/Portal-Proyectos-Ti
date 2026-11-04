// auth.js — Acceso al Ecosistema TI · CHRISTUS MUGUERZA
// Protección de acceso del lado del navegador: evita la entrada casual, no sustituye un inicio de sesión corporativo.
(function () {
  'use strict';

  const AUTH_KEY    = 'cm_auth_ts';
  const LOCK_KEY    = 'cm_auth_lock';
  const SALT        = 'cm-ecosistema-ti:';
  const PASS_SHA256 = '52f72e739aea774e84e5f413da385408ba00ee1d60a3a35933d58595406af6df';
  const TIMEOUT_MS  = 20 * 60 * 1000;
  const MAX_TRIES   = 5;
  const LOCK_MS     = 30 * 1000;
  const EVENTS      = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
  let timer = null, lastTouch = 0, watching = false, tries = 0;

  const now = () => Date.now();
  const isAuthenticated = () => {
    const ts = parseInt(localStorage.getItem(AUTH_KEY) || '0', 10);
    return ts > 0 && now() - ts < TIMEOUT_MS;
  };

  function onActivity() {
    if (now() - lastTouch < 15000) return;
    lastTouch = now();
    if (!isAuthenticated()) return logout();
    localStorage.setItem(AUTH_KEY, String(lastTouch));
    clearTimeout(timer);
    timer = setTimeout(checkExpiry, TIMEOUT_MS);
  }
  function checkExpiry() { if (!isAuthenticated()) logout(); else { clearTimeout(timer); timer = setTimeout(checkExpiry, TIMEOUT_MS); } }
  function startWatching() {
    lastTouch = 0;
    if (!watching) { EVENTS.forEach(e => document.addEventListener(e, onActivity, { passive: true })); watching = true; }
    onActivity();
  }
  function stopWatching() {
    clearTimeout(timer);
    if (watching) { EVENTS.forEach(e => document.removeEventListener(e, onActivity)); watching = false; }
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    stopWatching();
    if (typeof window.onCmLogout === 'function') window.onCmLogout();
    whenBody(mount);
  }
  window.cmLogout = logout;

  // Cierre de sesión en otra pestaña
  window.addEventListener('storage', e => { if (e.key === AUTH_KEY && !e.newValue && !document.getElementById('auth-overlay')) logout(); });

  function whenBody(fn) {
    if (document.body) fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const CSS = `
    #auth-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow:auto;
      font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',sans-serif;color:#1E0F20;
      background:radial-gradient(1200px 600px at 10% 0%,rgba(158,94,163,.35),transparent 60%),radial-gradient(900px 500px at 100% 100%,rgba(42,120,214,.12),transparent 60%),linear-gradient(135deg,#170818 0%,#2a0f30 50%,#1c0b20 100%);
      transition:opacity .35s ease}
    #auth-overlay::before{content:'';position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(201,163,204,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,163,204,.05) 1px,transparent 1px);background-size:56px 56px}
    #auth-overlay *{box-sizing:border-box}
    @keyframes auIn{from{opacity:0;transform:translateY(16px) scale(.99)}to{opacity:1;transform:none}}
    @keyframes auShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
    .au-card{position:relative;margin:auto;flex-shrink:0;display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);width:min(940px,100%);min-height:min(560px,calc(100vh - 40px));border-radius:24px;overflow:hidden;
      box-shadow:0 30px 80px rgba(20,6,24,.5),0 0 0 1px rgba(255,255,255,.06);animation:auIn .45s cubic-bezier(.22,1,.36,1) both}
    .au-card.shake .au-inner{animation:auShake .35s ease}
    .au-brand{position:relative;overflow:hidden;color:#fff;padding:44px 40px;display:flex;flex-direction:column;background:linear-gradient(160deg,#4a2150 0%,#3a1a40 55%,#2b1230 100%)}
    .au-brand::after{content:'';position:absolute;width:380px;height:380px;border-radius:50%;border:1px solid rgba(255,255,255,.07);right:-180px;bottom:-150px}
    .au-brand::before{content:'';position:absolute;width:240px;height:240px;border-radius:50%;border:1px solid rgba(255,255,255,.06);right:-70px;bottom:-50px}
    .au-logo{background:#fff;border-radius:14px;padding:10px 16px;align-self:flex-start;box-shadow:0 10px 26px rgba(0,0,0,.25)}
    .au-logo img{height:46px;width:auto;display:block}
    .au-logo-fb{font-size:20px;font-weight:800;color:#5C2B60;padding:4px 6px}
    .au-dept{margin-top:34px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)}
    .au-title{font-size:32px;font-weight:800;letter-spacing:-.02em;margin-top:6px;line-height:1.08}
    .au-sub{font-size:14px;color:rgba(255,255,255,.62);margin-top:8px;line-height:1.55}
    .au-feats{list-style:none;margin:30px 0 0;padding:0;display:flex;flex-direction:column;gap:14px;position:relative;z-index:1}
    .au-feats li{display:flex;align-items:center;gap:12px;font-size:14px;color:rgba(255,255,255,.88)}
    .au-feats .ti{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:17px;color:#E3C6E5;flex-shrink:0}
    .au-feats small{display:block;font-size:12px;color:rgba(255,255,255,.5)}
    .au-ver{margin-top:auto;padding-top:28px;font-size:11px;color:rgba(255,255,255,.35);position:relative;z-index:1}
    .au-form{background:#FBF7FB;display:flex;align-items:center;justify-content:center;padding:48px 52px}
    .au-inner{width:100%;max-width:350px}
    .au-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#803F85;background:#F3EAF4;border-radius:999px;padding:5px 11px}
    .au-h1{font-size:28px;font-weight:800;margin:16px 0 6px;letter-spacing:-.02em;line-height:1.15}
    .au-p{font-size:14px;color:#5B4A5D;line-height:1.55;margin:0 0 26px}
    .au-label{display:block;font-size:13px;font-weight:700;margin-bottom:7px}
    .au-field{position:relative}
    .au-field>.ti{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px;color:#85748A;pointer-events:none}
    #auth-input{width:100%;height:50px;padding:0 48px 0 44px;border-radius:12px;border:1.5px solid #DDD0DE;background:#fff;font-family:inherit;font-size:15px;color:#1E0F20;outline:none;transition:border-color .2s,box-shadow .2s}
    #auth-input:focus{border-color:#803F85;box-shadow:0 0 0 4px rgba(128,63,133,.14)}
    #auth-input.err{border-color:#d03b3b;box-shadow:0 0 0 4px rgba(208,59,59,.12)}
    #auth-input:disabled{background:#F5F2F6;cursor:not-allowed}
    .au-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:36px;height:36px;border:none;background:none;border-radius:9px;cursor:pointer;color:#85748A;font-size:18px;display:flex;align-items:center;justify-content:center}
    .au-eye:hover{background:#F3EAF4;color:#803F85}
    .au-eye:focus-visible,#auth-btn:focus-visible{outline:2px solid #803F85;outline-offset:2px}
    .au-msg{min-height:20px;margin-top:8px;font-size:13px;display:flex;align-items:center;gap:6px}
    .au-msg.err{color:#A12424}
    .au-msg.warn{color:#7A5200}
    #auth-btn{width:100%;height:50px;margin-top:6px;border:none;border-radius:12px;cursor:pointer;font-family:inherit;font-size:15px;font-weight:700;color:#fff;
      background:linear-gradient(135deg,#8E4893,#5C2B60);box-shadow:0 10px 24px rgba(92,43,96,.3);display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .1s,box-shadow .2s,filter .2s}
    #auth-btn:hover{filter:brightness(1.06);box-shadow:0 14px 30px rgba(92,43,96,.38)}
    #auth-btn:active{transform:scale(.985)}
    #auth-btn:disabled{filter:grayscale(.6);opacity:.7;cursor:not-allowed}
    .au-note{display:flex;align-items:flex-start;gap:8px;margin-top:20px;padding:12px 14px;border-radius:12px;background:#fff;border:1px solid #ECE4ED;font-size:13px;color:#5B4A5D;line-height:1.45}
    .au-note .ti{font-size:17px;color:#803F85;margin-top:1px}
    .au-foot{margin-top:24px;font-size:12px;color:#85748A;display:flex;align-items:center;gap:6px}
    @media (max-width:800px){.au-card{grid-template-columns:1fr;min-height:0}.au-brand{padding:24px;flex-direction:row;align-items:center;gap:16px}.au-brand .au-dept,.au-brand .au-sub,.au-feats,.au-ver{display:none}.au-title{font-size:22px;margin:0}.au-logo img{height:36px}.au-form{padding:34px 24px}}
    @media (prefers-reduced-motion:reduce){.au-card,.au-card.shake .au-inner{animation:none}#auth-overlay{transition:none}}
  `;

  function lockRemaining() {
    const until = parseInt(sessionStorage.getItem(LOCK_KEY) || '0', 10);
    return Math.max(0, until - now());
  }

  function mount() {
    const old = document.getElementById('auth-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'au-h1');
    overlay.innerHTML = `
      <style>${CSS}</style>
      <div class="au-card" id="au-card">
        <aside class="au-brand">
          <div class="au-logo"><img src="logo.jpg" alt="CHRISTUS MUGUERZA" id="au-logo-img"><div class="au-logo-fb" id="au-logo-fb" hidden>CM</div></div>
          <div class="au-dept">GSEE · Proyectos TI</div>
          <div class="au-title">Ecosistema TI</div>
          <div class="au-sub">CHRISTUS MUGUERZA · Sistema de Salud</div>
          <ul class="au-feats">
            <li><i class="ti ti-layout-dashboard"></i><span>Portafolio Expansión TI<small>Avance, presupuesto y alertas por PM</small></span></li>
            <li><i class="ti ti-calculator"></i><span>Paramétrico TI<small>Equipamiento e infraestructura por proyecto</small></span></li>
            <li><i class="ti ti-report-money"></i><span>CAPEX y RPPs<small>Solicitudes de presupuesto</small></span></li>
          </ul>
          <div class="au-ver">v3.1 · 2026</div>
        </aside>
        <section class="au-form">
          <form class="au-inner" id="au-form" novalidate>
            <span class="au-eyebrow"><i class="ti ti-shield-lock"></i> Acceso restringido</span>
            <h1 class="au-h1" id="au-h1">Iniciar sesión</h1>
            <p class="au-p">Ingresa la contraseña de acceso proporcionada por GSEE Proyectos TI.</p>
            <label class="au-label" for="auth-input">Contraseña</label>
            <div class="au-field">
              <i class="ti ti-lock"></i>
              <input id="auth-input" type="password" autocomplete="current-password" spellcheck="false" aria-describedby="au-msg">
              <button class="au-eye" id="auth-eye" type="button" aria-label="Mostrar contraseña" aria-pressed="false"><i class="ti ti-eye"></i></button>
            </div>
            <div class="au-msg" id="au-msg" aria-live="polite"></div>
            <button id="auth-btn" type="submit">Ingresar <i class="ti ti-arrow-right"></i></button>
            <div class="au-note"><i class="ti ti-clock-hour-4"></i><span>Por seguridad, la sesión se cierra tras <b>20 minutos sin actividad</b>. Los datos del portafolio se procesan solo en este equipo.</span></div>
            <div class="au-foot"><i class="ti ti-building-hospital"></i> Uso interno · CHRISTUS MUGUERZA</div>
          </form>
        </section>
      </div>`;
    document.body.appendChild(overlay);
    document.documentElement.style.visibility = 'visible';

    const card = overlay.querySelector('#au-card');
    const form = overlay.querySelector('#au-form');
    const input = overlay.querySelector('#auth-input');
    const btn = overlay.querySelector('#auth-btn');
    const eye = overlay.querySelector('#auth-eye');
    const msg = overlay.querySelector('#au-msg');
    const logo = overlay.querySelector('#au-logo-img');
    logo.addEventListener('error', () => { logo.hidden = true; overlay.querySelector('#au-logo-fb').hidden = false; }, { once: true });

    const say = (text, kind, icon) => { msg.className = 'au-msg ' + (kind || ''); msg.innerHTML = text ? `<i class="ti ${icon}"></i>${text}` : ''; };
    let lockTimer = null;
    function applyLock() {
      const left = lockRemaining();
      input.disabled = btn.disabled = left > 0;
      if (left > 0) {
        say(`Demasiados intentos. Espera ${Math.ceil(left / 1000)} s para intentar de nuevo.`, 'err', 'ti-lock');
        clearTimeout(lockTimer);
        lockTimer = setTimeout(applyLock, 1000);
      } else if (lockTimer) {
        lockTimer = null; tries = 0; say('', ''); input.focus();
      }
    }
    applyLock();
    if (!input.disabled) input.focus();

    eye.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eye.setAttribute('aria-pressed', String(show));
      eye.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      eye.innerHTML = `<i class="ti ${show ? 'ti-eye-off' : 'ti-eye'}"></i>`;
      input.focus();
    });
    input.addEventListener('input', () => { input.classList.remove('err'); if (msg.classList.contains('err')) say('', ''); });
    input.addEventListener('keyup', e => {
      if (typeof e.getModifierState !== 'function' || msg.classList.contains('err')) return;
      if (e.getModifierState('CapsLock')) say('Bloq Mayús está activado.', 'warn', 'ti-arrow-big-up-line'); else if (msg.classList.contains('warn')) say('', '');
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (lockRemaining() > 0) return applyLock();
      const value = input.value.trim();
      if (!value) { say('Escribe la contraseña.', 'err', 'ti-alert-circle'); input.classList.add('err'); return input.focus(); }
      btn.disabled = true;
      let ok = false;
      try { ok = (await sha256(SALT + value)) === PASS_SHA256; } catch (err) { console.error(err); }
      btn.disabled = false;
      if (ok) {
        tries = 0;
        sessionStorage.removeItem(LOCK_KEY);
        localStorage.setItem(AUTH_KEY, String(now()));
        startWatching();
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 350);
        return;
      }
      tries++;
      input.classList.add('err');
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      input.select();
      if (tries >= MAX_TRIES) { sessionStorage.setItem(LOCK_KEY, String(now() + LOCK_MS)); return applyLock(); }
      say(`Contraseña incorrecta. Te quedan ${MAX_TRIES - tries} intentos.`, 'err', 'ti-alert-circle');
    });
  }

  if (isAuthenticated()) { whenBody(startWatching); return; }
  document.documentElement.style.visibility = 'hidden';
  whenBody(mount);
})();
