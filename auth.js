// ─────────────────────────────────────────────────────────────
// auth.js — Protección básica + timeout 20 min · Ecosistema TI CM
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  const SESSION_KEY  = 'cm_auth_ok';
  const PASS         = 'CMti2026';
  const TIMEOUT_MS   = 20 * 60 * 1000; // 20 minutos
  let   _timer       = null;

  // ── Timeout por inactividad ──────────────────────────────
  function resetTimer() {
    clearTimeout(_timer);
    _timer = setTimeout(forceLogout, TIMEOUT_MS);
  }

  function forceLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    // Limpia también el excel guardado para que no auto-cargue al re-login
    // (opcional: comentar esta línea si se quiere conservar el archivo)
    // localStorage.removeItem('cm_excel_cache');
    mount();
    // Ocultar contenido hasta que se autentique de nuevo
    document.documentElement.style.visibility = 'hidden';
  }

  function startActivityWatcher() {
    ['mousemove','mousedown','keydown','touchstart','scroll','click'].forEach(evt => {
      document.addEventListener(evt, resetTimer, { passive: true });
    });
    resetTimer();
  }

  // ── Si ya está autenticado, solo vigilar inactividad ────
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    document.addEventListener('DOMContentLoaded', startActivityWatcher);
    return;
  }

  document.documentElement.style.visibility = 'hidden';

  // ── UI del login ─────────────────────────────────────────
  function mount() {
    // Quitar overlay anterior si existe
    const old = document.getElementById('auth-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <style>
        @keyframes authFadeIn {
          from { opacity:0; transform:translateY(24px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes authShake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        @keyframes orbFloat {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(20px,-15px) scale(1.04)}
          66%{transform:translate(-12px,18px) scale(.97)}
        }
        #auth-overlay {
          position:fixed;inset:0;z-index:99999;
          background:#0f0614;
          display:flex;align-items:center;justify-content:center;
          font-family:'Inter','DM Sans',system-ui,sans-serif;
          overflow:hidden;
        }
        .auth-bg-grid {
          position:absolute;inset:0;pointer-events:none;
          background-image:
            linear-gradient(rgba(128,63,133,.07) 1px,transparent 1px),
            linear-gradient(90deg,rgba(128,63,133,.07) 1px,transparent 1px);
          background-size:52px 52px;
        }
        .auth-orb {
          position:absolute;border-radius:50%;pointer-events:none;
          animation:orbFloat 9s ease-in-out infinite;filter:blur(70px);
        }
        .auth-orb-1{width:480px;height:480px;background:radial-gradient(circle,rgba(92,43,96,.45) 0%,transparent 70%);top:-15%;left:-12%;animation-delay:0s}
        .auth-orb-2{width:360px;height:360px;background:radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%);bottom:-10%;right:-8%;animation-delay:-4s}
        .auth-orb-3{width:240px;height:240px;background:radial-gradient(circle,rgba(26,158,106,.12) 0%,transparent 70%);top:55%;left:35%;animation-delay:-7s}
        #auth-card {
          position:relative;z-index:1;
          width:380px;max-width:calc(100vw - 32px);
          background:rgba(30,12,36,.88);
          border:1px solid rgba(255,255,255,.09);
          border-radius:20px;padding:44px 40px 36px;
          box-shadow:0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.04);
          backdrop-filter:blur(18px);
          animation:authFadeIn .55s cubic-bezier(.22,1,.36,1) forwards;
          text-align:center;
        }
        .auth-brand{display:inline-flex;align-items:center;gap:10px;margin-bottom:28px}
        .auth-logo{width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#7B3F80,#5C2B60);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:900;color:#fff;letter-spacing:-.5px;box-shadow:0 8px 20px rgba(92,43,96,.5);flex-shrink:0}
        .auth-brand-name{font-size:13px;font-weight:800;color:#fff;line-height:1.1;letter-spacing:.01em;text-align:left}
        .auth-brand-sub{font-size:10.5px;color:rgba(255,255,255,.35);letter-spacing:.04em;text-transform:uppercase;text-align:left}
        .auth-divider{height:1px;background:rgba(255,255,255,.07);margin:0 -40px 28px}
        .auth-icon-wrap{width:60px;height:60px;border-radius:16px;background:rgba(92,43,96,.25);border:1px solid rgba(128,63,133,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;color:#B07CC6}
        .auth-title{font-size:18px;font-weight:800;color:#fff;margin-bottom:6px;line-height:1.2}
        .auth-subtitle{font-size:12.5px;color:rgba(255,255,255,.38);margin-bottom:28px}
        .auth-input-wrap{position:relative;margin-bottom:14px}
        #auth-input{width:100%;box-sizing:border-box;padding:13px 44px 13px 16px;border-radius:11px;border:1.5px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#fff;font-size:14px;font-family:inherit;outline:none;letter-spacing:3px;transition:border-color .2s,background .2s}
        #auth-input::placeholder{letter-spacing:0;color:rgba(255,255,255,.25);font-size:13px}
        #auth-input:focus{border-color:rgba(128,63,133,.7);background:rgba(255,255,255,.08)}
        .auth-eye{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);font-size:16px;padding:2px;line-height:1;transition:color .2s}
        .auth-eye:hover{color:rgba(255,255,255,.6)}
        #auth-btn{width:100%;padding:13px;background:linear-gradient(135deg,#7B3F80,#5C2B60);color:#fff;border:none;border-radius:11px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;box-shadow:0 8px 20px rgba(92,43,96,.4);transition:opacity .15s,transform .1s,box-shadow .2s}
        #auth-btn:hover{opacity:.92;box-shadow:0 12px 28px rgba(92,43,96,.5)}
        #auth-btn:active{transform:scale(.98)}
        #auth-err{font-size:11.5px;color:#f87171;margin-top:12px;min-height:16px}
        .auth-err-shake{animation:authShake .35s ease}
        .auth-timeout-note{font-size:11px;color:rgba(255,255,255,.22);margin-top:10px}
        .auth-footer{margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;gap:6px;font-size:10.5px;color:rgba(255,255,255,.18)}
        .auth-footer-dot{width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.18)}
      </style>

      <div class="auth-bg-grid"></div>
      <div class="auth-orb auth-orb-1"></div>
      <div class="auth-orb auth-orb-2"></div>
      <div class="auth-orb auth-orb-3"></div>

      <div id="auth-card">
        <div class="auth-brand">
          <div class="auth-logo">CM</div>
          <div>
            <div class="auth-brand-name">CHRISTUS MUGUERZA</div>
            <div class="auth-brand-sub">Ecosistema TI</div>
          </div>
        </div>
        <div class="auth-divider"></div>
        <div class="auth-icon-wrap">🔒</div>
        <div class="auth-title">Acceso restringido</div>
        <div class="auth-subtitle">Ingresa la contraseña para continuar</div>
        <div class="auth-input-wrap">
          <input id="auth-input" type="password" placeholder="Contraseña de acceso" autocomplete="current-password">
          <button class="auth-eye" id="auth-eye" type="button" title="Mostrar/ocultar">👁</button>
        </div>
        <button id="auth-btn">Ingresar</button>
        <div id="auth-err"></div>
        <div class="auth-timeout-note">⏱ La sesión expira tras 20 min de inactividad</div>
        <div class="auth-footer">
          <span>Uso interno</span>
          <div class="auth-footer-dot"></div>
          <span>Dirección de TI</span>
          <div class="auth-footer-dot"></div>
          <span>2026</span>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.documentElement.style.visibility = 'visible';

    const input = document.getElementById('auth-input');
    const btn   = document.getElementById('auth-btn');
    const eye   = document.getElementById('auth-eye');
    const err   = document.getElementById('auth-err');

    input.focus();

    eye.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eye.textContent = show ? '🙈' : '👁';
    });

    function tryAuth() {
      if (input.value.trim() === PASS) {
        sessionStorage.setItem(SESSION_KEY, '1');
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity .4s ease';
        setTimeout(() => { overlay.remove(); startActivityWatcher(); }, 400);
      } else {
        err.textContent = 'Contraseña incorrecta. Intenta de nuevo.';
        const card = document.getElementById('auth-card');
        card.classList.remove('auth-err-shake');
        void card.offsetWidth;
        card.classList.add('auth-err-shake');
        input.value = '';
        input.focus();
        setTimeout(() => { err.textContent = ''; }, 3000);
      }
    }

    btn.addEventListener('click', tryAuth);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') tryAuth(); });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
