// auth.js — Acceso al Ecosistema TI · CHRISTUS MUGUERZA
(function () {
  'use strict';

  const AUTH_KEY   = 'cm_auth_ts';
  const PASS       = 'CMti2026';
  const TIMEOUT_MS = 20 * 60 * 1000;
  let   _timer     = null;

  const isAuthenticated = () => {
    const ts = parseInt(localStorage.getItem(AUTH_KEY) || '0', 10);
    return ts > 0 && (Date.now() - ts) < TIMEOUT_MS;
  };
  const touchAuth = () => localStorage.setItem(AUTH_KEY, String(Date.now()));

  function resetTimer() {
    touchAuth();
    clearTimeout(_timer);
    _timer = setTimeout(logout, TIMEOUT_MS);
  }

  let _watching = false;
  function startActivityWatcher() {
    if (!_watching) {
      ['mousemove','mousedown','keydown','touchstart','scroll','click'].forEach(evt =>
        document.addEventListener(evt, resetTimer, { passive: true }));
      _watching = true;
    }
    resetTimer();
  }

  function stopActivityWatcher() {
    clearTimeout(_timer);
    if (!_watching) return;
    ['mousemove','mousedown','keydown','touchstart','scroll','click'].forEach(evt =>
      document.removeEventListener(evt, resetTimer));
    _watching = false;
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    stopActivityWatcher();
    if (typeof window.onCmLogout === 'function') window.onCmLogout();
    whenBody(mount);
  }
  window.cmLogout = logout;

  function whenBody(fn) {
    if (document.body) fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function ensureAssets() {
    const head = document.head || document.documentElement;
    if (!document.querySelector('link[href*="tabler-icons"]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css';
      head.appendChild(l);
    }
    if (!document.querySelector('link[href*="DM+Sans"]')) {
      const f = document.createElement('link');
      f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap';
      head.appendChild(f);
    }
  }

  const CSS = `
    #auth-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;
      font-family:'DM Sans',system-ui,sans-serif;background:linear-gradient(135deg,#170818 0%,#2a0f30 45%,#3a1a40 75%,#1c0b20 100%);overflow:auto;transition:opacity .35s ease}
    #auth-overlay::before{content:'';position:absolute;inset:0;pointer-events:none;
      background-image:linear-gradient(rgba(188,139,191,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(188,139,191,.06) 1px,transparent 1px);background-size:56px 56px}
    @keyframes auIn{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
    @keyframes auShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
    .au-card{position:relative;display:grid;grid-template-columns:.92fr 1.08fr;width:min(900px,100%);min-height:540px;border-radius:22px;overflow:hidden;
      box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.06);animation:auIn .5s cubic-bezier(.22,1,.36,1) both}
    .au-card.shake .au-form-inner{animation:auShake .35s ease}
    .au-brand{position:relative;background:linear-gradient(160deg,#4a2150 0%,#3a1a40 55%,#2b1230 100%);color:#fff;padding:44px 40px;display:flex;flex-direction:column;overflow:hidden}
    .au-brand::after{content:'';position:absolute;width:340px;height:340px;border-radius:50%;border:1px solid rgba(255,255,255,.07);right:-150px;bottom:-130px}
    .au-brand::before{content:'';position:absolute;width:220px;height:220px;border-radius:50%;border:1px solid rgba(255,255,255,.06);right:-60px;bottom:-40px}
    .au-logo{background:#fff;border-radius:14px;padding:10px 16px;align-self:flex-start;box-shadow:0 10px 26px rgba(0,0,0,.25)}
    .au-logo img{height:46px;width:auto;display:block}
    .au-logo-fb{display:none;font-size:20px;font-weight:800;color:#5C2B60;padding:4px 6px}
    .au-dept{margin-top:34px;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5)}
    .au-title{font-size:32px;font-weight:800;letter-spacing:-.02em;margin-top:6px;line-height:1.1}
    .au-sub{font-size:13px;color:rgba(255,255,255,.55);margin-top:6px}
    .au-feats{list-style:none;margin:30px 0 0;padding:0;display:flex;flex-direction:column;gap:12px}
    .au-feats li{display:flex;align-items:center;gap:12px;font-size:13px;color:rgba(255,255,255,.82)}
    .au-feats .ti{width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:16px;color:#E3C6E5;flex-shrink:0}
    .au-ver{margin-top:auto;padding-top:28px;font-size:11px;color:rgba(255,255,255,.3)}
    .au-form{background:#fff;display:flex;align-items:center;justify-content:center;padding:48px 52px}
    .au-form-inner{width:100%;max-width:340px}
    .au-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#803F85;background:#F3EAF4;border-radius:999px;padding:5px 10px}
    .au-h1{font-size:26px;font-weight:800;color:#1E0F20;margin:16px 0 6px;letter-spacing:-.02em}
    .au-p{font-size:13px;color:#6B4F6E;line-height:1.55;margin:0 0 26px}
    .au-label{display:block;font-size:11.5px;font-weight:700;color:#1E0F20;margin-bottom:7px}
    .au-field{position:relative}
    .au-field>.ti{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:17px;color:#A889AB;pointer-events:none}
    #auth-input{width:100%;box-sizing:border-box;height:48px;padding:0 46px 0 42px;border-radius:12px;border:1.5px solid #E8DCE9;background:#FBF8FB;
      font-family:inherit;font-size:14px;color:#1E0F20;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}
    #auth-input:focus{border-color:#803F85;background:#fff;box-shadow:0 0 0 4px rgba(128,63,133,.12)}
    #auth-input.err{border-color:#D94040;box-shadow:0 0 0 4px rgba(217,64,64,.1)}
    .au-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:none;background:none;border-radius:8px;cursor:pointer;color:#A889AB;font-size:18px;display:flex;align-items:center;justify-content:center}
    .au-eye:hover{background:#F3EAF4;color:#803F85}
    #auth-err{min-height:18px;margin-top:8px;font-size:12px;color:#D94040;display:flex;align-items:center;gap:5px}
    #auth-btn{width:100%;height:48px;margin-top:8px;border:none;border-radius:12px;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;color:#fff;
      background:linear-gradient(135deg,#8E4893,#5C2B60);box-shadow:0 10px 24px rgba(92,43,96,.32);display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .1s,box-shadow .2s,filter .2s}
    #auth-btn:hover{filter:brightness(1.06);box-shadow:0 14px 30px rgba(92,43,96,.4)}
    #auth-btn:active{transform:scale(.985)}
    .au-note{display:flex;align-items:center;gap:7px;margin-top:18px;font-size:11.5px;color:#A889AB}
    .au-foot{margin-top:30px;padding-top:16px;border-top:1px solid #F0E6F1;font-size:11px;color:#BC8BBF;display:flex;align-items:center;gap:6px}
    @media (max-width:760px){.au-card{grid-template-columns:1fr;min-height:0}.au-brand{display:none}.au-form{padding:40px 28px}}
  `;

  function mount() {
    ensureAssets();
    const old = document.getElementById('auth-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <style>${CSS}</style>
      <div class="au-card" id="au-card">
        <aside class="au-brand">
          <div class="au-logo">
            <img src="logo.jpg" alt="CHRISTUS MUGUERZA" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
            <div class="au-logo-fb">CM</div>
          </div>
          <div class="au-dept">Dirección de TI · GSEE</div>
          <div class="au-title">Ecosistema TI</div>
          <div class="au-sub">CHRISTUS MUGUERZA · Sistema de Salud</div>
          <ul class="au-feats">
            <li><i class="ti ti-layout-dashboard"></i>Portafolio de proyectos 2026</li>
            <li><i class="ti ti-calculator"></i>Paramétricos de equipamiento TI</li>
            <li><i class="ti ti-report-money"></i>CAPEX y requisiciones (RPPs)</li>
          </ul>
          <div class="au-ver">v3.0 · 2026</div>
        </aside>
        <section class="au-form">
          <div class="au-form-inner">
            <span class="au-eyebrow"><i class="ti ti-shield-lock"></i> Acceso seguro</span>
            <h1 class="au-h1">Iniciar sesión</h1>
            <p class="au-p">Ingresa la contraseña de acceso proporcionada por la Dirección de TI.</p>
            <label class="au-label" for="auth-input">Contraseña</label>
            <div class="au-field">
              <i class="ti ti-lock"></i>
              <input id="auth-input" type="password" placeholder="••••••••" autocomplete="current-password">
              <button class="au-eye" id="auth-eye" type="button" aria-label="Mostrar contraseña"><i class="ti ti-eye"></i></button>
            </div>
            <div id="auth-err"></div>
            <button id="auth-btn" type="button">Ingresar <i class="ti ti-arrow-right"></i></button>
            <div class="au-note"><i class="ti ti-clock-hour-4"></i> La sesión se cierra tras 20 minutos sin actividad.</div>
            <div class="au-foot"><i class="ti ti-building-hospital"></i> Uso interno · CHRISTUS MUGUERZA</div>
          </div>
        </section>
      </div>`;

    document.body.appendChild(overlay);
    document.documentElement.style.visibility = 'visible';

    const card  = overlay.querySelector('#au-card');
    const input = overlay.querySelector('#auth-input');
    const btn   = overlay.querySelector('#auth-btn');
    const eye   = overlay.querySelector('#auth-eye');
    const err   = overlay.querySelector('#auth-err');
    input.focus();

    eye.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eye.innerHTML = `<i class="ti ${show ? 'ti-eye-off' : 'ti-eye'}"></i>`;
      input.focus();
    });

    input.addEventListener('input', () => { input.classList.remove('err'); err.textContent = ''; });

    function tryAuth() {
      if (input.value.trim() === PASS) {
        startActivityWatcher();
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 350);
        return;
      }
      err.innerHTML = '<i class="ti ti-alert-circle"></i> Contraseña incorrecta. Intenta de nuevo.';
      input.classList.add('err');
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      input.select();
    }

    btn.addEventListener('click', tryAuth);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') tryAuth(); });
  }

  if (isAuthenticated()) {
    whenBody(startActivityWatcher);
    return;
  }
  document.documentElement.style.visibility = 'hidden';
  whenBody(mount);
})();
