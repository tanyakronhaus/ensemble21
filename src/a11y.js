// Accessibility toolbar (תפריט נגישות) — settings persist per visitor.
const KEY = 'e21-a11y';
const FLAGS = ['contrast', 'dark', 'grayscale', 'links', 'readable', 'still', 'spacing', 'cursor'];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function save(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function applyStoredA11y() {
  const s = load();
  const root = document.documentElement;
  FLAGS.forEach((f) => root.classList.toggle(`a11y-${f}`, !!s[f]));
  root.style.setProperty('--fs-scale', s.size || 1);
  return s;
}

export function initA11y({ onChange = () => {} } = {}) {
  const fab = document.querySelector('.a11y-fab');
  const panel = document.getElementById('a11yPanel');
  if (!fab || !panel) return;
  const out = document.getElementById('a11ySizeOut');
  let state = applyStoredA11y();

  const sync = () => {
    panel.querySelectorAll('[data-a11y]').forEach((b) => b.setAttribute('aria-pressed', String(!!state[b.dataset.a11y])));
    out.textContent = `${Math.round((state.size || 1) * 100)}%`;
  };
  const commit = () => { save(state); applyStoredA11y(); sync(); onChange(state); };

  const open = (v) => {
    panel.hidden = !v;
    fab.setAttribute('aria-expanded', String(v));
    if (v) panel.querySelector('button')?.focus();
  };
  fab.addEventListener('click', () => open(panel.hidden));
  panel.querySelector('[data-a11y-close]').addEventListener('click', () => { open(false); fab.focus(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { open(false); fab.focus(); } });

  panel.querySelectorAll('[data-a11y]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.a11y;
    state[f] = !state[f];
    if (f === 'contrast' && state.contrast) state.dark = false;
    if (f === 'dark' && state.dark) state.contrast = false;
    commit();
  }));
  panel.querySelectorAll('[data-a11y-size]').forEach((b) => b.addEventListener('click', () => {
    const next = Math.round(((state.size || 1) + Number(b.dataset.a11ySize) * 0.1) * 10) / 10;
    state.size = Math.min(1.6, Math.max(0.9, next));
    commit();
  }));
  panel.querySelector('[data-a11y-reset]').addEventListener('click', () => { state = {}; commit(); });
  sync();
}
