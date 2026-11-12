import '@fontsource/heebo/400.css';
import '@fontsource/heebo/700.css';
import '@fontsource/heebo/900.css';
import '@fontsource/frank-ruhl-libre/400.css';
import './styles.css';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path.js';
import { initA11y } from './a11y.js';

document.querySelectorAll('[data-logo]').forEach((svg) => {
  svg.setAttribute('viewBox', LOGO_VIEWBOX);
  svg.innerHTML = `<path fill="currentColor" fill-rule="evenodd" d="${LOGO_PATH}"/>`;
});
initA11y();
