// ============================================================
//  QUANTCRAFT — SHARED JS UTILITIES
// ============================================================

/* ── LOADER ──────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity .5s';
      setTimeout(() => loader.remove(), 500);
    }
  }, 1800);
});

/* ── NAVBAR SCROLL ────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ── HAMBURGER / MOBILE MENU ─────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
}

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

/* ── FADE-UP OBSERVER ────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── TOAST SYSTEM ────────────────────────────────────────── */
function showToast(msg, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success:'✅', error:'🚨', warning:'⚠️', info:'ℹ️', fire:'🔥', gas:'💨', battery:'🔋' };
  const colors = { success:'var(--green)', error:'var(--red)', warning:'var(--yellow)', info:'var(--cyan)', fire:'var(--red)', gas:'var(--yellow)', battery:'var(--muted)' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderColor = colors[type] || 'var(--border)';
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '📡'}</span>
    <span>${msg}</span>
    <button class="toast-close" onclick="dismissToast(this)">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => dismissToast(toast.querySelector('.toast-close')), duration);
}
function dismissToast(btn) {
  const toast = btn.closest ? btn.closest('.toast') : btn.parentElement;
  if (!toast) return;
  toast.classList.add('hiding');
  setTimeout(() => toast.remove(), 300);
}
window.dismissToast = dismissToast;
window.showToast = showToast;

/* ── ANIMATED COUNTERS ───────────────────────────────────── */
function animateCounter(el, target, suffix = '', duration = 2000) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
window.animateCounter = animateCounter;

/* ── INIT COUNTERS ON SCROLL ─────────────────────────────── */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      const target = parseFloat(e.target.dataset.target);
      const suffix = e.target.dataset.suffix || '';
      animateCounter(e.target, target, suffix);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

/* ── NOTIFICATION SYSTEM ─────────────────────────────────── */
const ALERTS = [
  { icon:'🚨', text:'BIN_204 — Critical capacity reached (94%)', time:'Just now', type:'error' },
  { icon:'🔥', text:'Q-882 — Fire/heat anomaly detected', time:'2m ago', type:'fire' },
  { icon:'💨', text:'UNIT_042 — Methane gas spike detected', time:'5m ago', type:'gas' },
  { icon:'🔋', text:'Q-910 — Battery low (12%)', time:'8m ago', type:'battery' },
  { icon:'🚛', text:'Route R-03 — Collection completed', time:'12m ago', type:'success' },
];

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');
  if (!list) return;
  list.innerHTML = '';
  ALERTS.forEach(a => {
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.innerHTML = `<div class="ni-icon">${a.icon}</div><div><div class="ni-text">${a.text}</div><div class="ni-time">${a.time}</div></div>`;
    list.appendChild(item);
  });
  if (badge) badge.textContent = ALERTS.filter((_, i) => i < 3).length;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNotifications();
  const bell = document.getElementById('notif-btn');
  const dropdown = document.getElementById('notif-dropdown');
  if (bell && dropdown) {
    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
  }

  // Auto-fire toast alerts
  const autoAlerts = [
    { msg:'BIN_204: Critical 94% — Collection Required!', type:'error', delay:3000 },
    { msg:'Q-882: Fire anomaly detected!', type:'fire', delay:7000 },
    { msg:'Route R-04 dispatched successfully', type:'success', delay:12000 },
  ];
  autoAlerts.forEach(a => setTimeout(() => showToast(a.msg, a.type), a.delay));
});

/* ── PASSWORD TOGGLE ─────────────────────────────────────── */
document.querySelectorAll('.eye-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});