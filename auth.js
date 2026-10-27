// ─────────────────────────────────────────────────────────────
// auth.js — Protección básica de acceso
// Incluir como primer script en Dashboard.html y parametrico.html
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  const SESSION_KEY = 'cm_auth_ok';
  const PASS_HASH   = '7e3f2a1d9b'; // hash simple de "CMti2026"

  function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h).toString(16).slice(0, 10);
  }

  if (sessionStorage.getItem(SESSION_KEY) === '1') return; // ya autenticado

  // Ocultar el body hasta autenticar
  document.documentElement.style.visibility = 'hidden';

  function mount() {
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <style>
        #auth-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: #1a0a1e;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
        }
        #auth-box {
          background: #2a0f30;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          padding: 40px 36px 32px;
          width: 340px;
          text-align: center;
          box-shadow: 0 24px 60px rgba(0,0,0,.5);
        }
        #auth-logo {
          width: 52px; height: 52px;
          background: #5C2B60;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          font-size: 22px; font-weight: 900; color: #fff;
        }
        #auth-title {
          font-size: 15px; font-weight: 700;
          color: #fff; margin-bottom: 4px;
        }
        #auth-sub {
          font-size: 12px; color: rgba(255,255,255,.45);
          margin-bottom: 24px;
        }
        #auth-input {
          width: 100%; box-sizing: border-box;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,.15);
          background: rgba(255,255,255,.06);
          color: #fff; font-size: 14px;
          font-family: inherit;
          outline: none;
          margin-bottom: 12px;
          text-align: center;
          letter-spacing: 2px;
          transition: border-color .2s;
        }
        #auth-input:focus { border-color: #9B59B6; }
        #auth-input::placeholder { letter-spacing: 0; color: rgba(255,255,255,.3); }
        #auth-btn {
          width: 100%; padding: 11px;
          background: #5C2B60; color: #fff;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: background .2s;
        }
        #auth-btn:hover { background: #7B3F80; }
        #auth-err {
          font-size: 11.5px; color: #f87171;
          margin-top: 10px; min-height: 16px;
        }
        #auth-footer {
          margin-top: 28px;
          font-size: 10.5px; color: rgba(255,255,255,.2);
        }
      </style>
      <div id="auth-box">
        <div id="auth-logo">CM</div>
        <div id="auth-title">Ecosistema TI · CHRISTUS MUGUERZA</div>
        <div id="auth-sub">Ingresa la contraseña para continuar</div>
        <input id="auth-input" type="password" placeholder="Contraseña" autocomplete="current-password">
        <button id="auth-btn">Ingresar</button>
        <div id="auth-err"></div>
        <div id="auth-footer">Uso interno · Dirección de TI</div>
      </div>`;

    document.body.appendChild(overlay);
    document.documentElement.style.visibility = 'visible';

    const input = document.getElementById('auth-input');
    const btn   = document.getElementById('auth-btn');
    const err   = document.getElementById('auth-err');

    input.focus();

    function tryAuth() {
      const val = input.value.trim();
      if (simpleHash(val) === PASS_HASH) {
        sessionStorage.setItem(SESSION_KEY, '1');
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity .3s';
        setTimeout(() => overlay.remove(), 300);
      } else {
        err.textContent = 'Contraseña incorrecta. Intenta de nuevo.';
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
