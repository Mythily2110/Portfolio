/* ── site.js — shared portfolio logic ── */

// ── Year ──────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Nav active + hamburger ────────────────────────────────────
const here = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navlinks a, .mobile-menu a').forEach(a => {
  if (a.getAttribute('href') === here) a.classList.add('active');
});
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
if (ham) ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
});

// ── Scroll reveal (.reveal) ───────────────────────────────────
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show') });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

// ── AOS init ──────────────────────────────────────────────────
if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 680, once: true, offset: 55, easing: 'ease-out-cubic' });
}

// ── Dark / Light Mode Toggle ──────────────────────────────────
const html   = document.documentElement;
const toggle = document.getElementById('theme-toggle');

// Apply saved preference immediately (also applied inline in <head> to avoid flash)
if (localStorage.getItem('theme') === 'dark') html.classList.add('dark');

function syncToggleIcon() {
  if (!toggle) return;
  toggle.textContent = html.classList.contains('dark') ? '☀️' : '🌙';
  toggle.setAttribute('aria-label', html.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode');
}
syncToggleIcon();

if (toggle) {
  toggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    syncToggleIcon();
  });
}
