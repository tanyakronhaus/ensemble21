import '@fontsource/heebo/400.css';
import '@fontsource/heebo/700.css';
import '@fontsource/heebo/900.css';
import '@fontsource/frank-ruhl-libre/400.css';
import './styles.css';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path.js';
import { initA11y } from './a11y.js';
import { setLang, getLang, getStoredLang, onLangChange, EN } from './i18n.js';

document.querySelectorAll('[data-logo]').forEach((svg) => {
  svg.setAttribute('viewBox', LOGO_VIEWBOX);
  svg.innerHTML = `<path fill="currentColor" fill-rule="evenodd" d="${LOGO_PATH}"/>`;
});
EN['meta.title'] = EN['doc.title'];
onLangChange((lang) => {
  document.querySelectorAll('[data-doc-lang]').forEach((el) => { el.hidden = el.dataset.docLang !== lang; });
});
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-lang-toggle]')) setLang(getLang() === 'he' ? 'en' : 'he');
});
setLang(getStoredLang() || 'he', { persist: false });
initA11y();
