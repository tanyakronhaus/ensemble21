import '@fontsource/heebo/300.css';
import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import '@fontsource/heebo/700.css';
import '@fontsource/heebo/800.css';
import '@fontsource/heebo/900.css';
import '@fontsource/frank-ruhl-libre/400.css';
import '@fontsource/frank-ruhl-libre/500.css';
import './styles.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { CONCERTS, MUSICIANS, BOARD, TEAM, VENUE } from './data.js';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path.js';
import { createIntro } from './intro.js';
import { createStrings } from './strings.js';
import { createAudio } from './audio.js';
import { initA11y, applyStoredA11y } from './a11y.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const a11yState = applyStoredA11y();
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isStill = () => prefersReduced || root.classList.contains('a11y-still');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const now = new Date();

/* ------------------------------------------------------------------ */
/* Logo                                                                 */
/* ------------------------------------------------------------------ */
$$('[data-logo]').forEach((svg) => {
  svg.setAttribute('viewBox', LOGO_VIEWBOX);
  svg.innerHTML = `<path fill="currentColor" fill-rule="evenodd" d="${LOGO_PATH}"/>`;
});
$('#year').textContent = now.getFullYear();

/* ------------------------------------------------------------------ */
/* Render content                                                       */
/* ------------------------------------------------------------------ */
const img = (name, alt = '', sizes = '(max-width: 1000px) 92vw, 46vw', eager = false) =>
  `<img src="/media/${name}-700.webp" srcset="/media/${name}-700.webp 700w, /media/${name}-1400.webp 1400w" sizes="${sizes}" alt="${alt}" ${eager ? '' : 'loading="lazy"'} decoding="async" />`;

const isPast = (c) => new Date(c.date).getTime() + 3 * 3600e3 < now.getTime();
const upcoming = CONCERTS.filter((c) => !isPast(c));
const next = upcoming[0] || CONCERTS[CONCERTS.length - 1];

// Season track
$('#seasonTrack').innerHTML = CONCERTS.map((c) => {
  const past = isPast(c);
  return `
  <li class="concert" id="concert-${c.id}" style="--c:${c.color};--t:${c.tint}" data-concert="${c.id}">
    <div class="concert__media" data-open="${c.id}" data-cursor="לפרטים" role="button" tabindex="0" aria-label="פרטים מלאים: ${c.title}">
      ${img(c.img, '')}
      <span class="concert__dot" aria-hidden="true"></span>
      <span class="concert__ring" aria-hidden="true"></span>
    </div>
    <div class="concert__body">
      <span class="concert__num" aria-hidden="true">0${c.no}</span>
      <p class="concert__disc">DISCOVERIES ${c.no} · ${c.en.toUpperCase()}</p>
      <h3 class="concert__title">${c.title}</h3>
      <p class="concert__tag">${c.tagline}</p>
      <div class="concert__meta">
        <span class="concert__date">${c.dateLabel}</span>
        <span class="concert__when">${c.day} · 20:00 · ${VENUE}</span>
      </div>
      <ul class="concert__people">
        ${c.people.map(([r, n]) => `<li><span>${r}</span><b>${n}</b></li>`).join('')}
      </ul>
      <div class="concert__actions">
        ${past
          ? `<span class="concert__past">✓ הקונצרט התקיים</span>`
          : `<a class="btn btn--ink" href="${c.tickets}" target="_blank" rel="noopener" data-magnetic><span>לרכישת כרטיסים</span><span class="sr-only"> ל${c.title} (נפתח בחלון חדש)</span></a>`}
        <button class="btn btn--line" type="button" data-open="${c.id}"><span>התוכנית המלאה</span></button>
      </div>
    </div>
  </li>`;
}).join('');

// Ticket list
$('#ticketList').innerHTML = CONCERTS.map((c) => {
  const past = isPast(c);
  const inner = `<span class="ticket-row__date">${c.dateLabel}</span>
      <span class="ticket-row__title">${c.title}<span class="sr-only"> — ${past ? 'התקיים' : 'לרכישת כרטיסים, נפתח בחלון חדש'}</span></span>
      <span class="ticket-row__go" aria-hidden="true">${past ? 'התקיים' : 'כרטיסים'}</span>`;
  return `<li class="ticket-row ${past ? 'is-past' : ''}" style="--c:${c.color}">
    ${past ? `<div>${inner}</div>` : `<a href="${c.tickets}" target="_blank" rel="noopener">${inner}</a>`}
  </li>`;
}).join('');

// Musicians / team / board
$('#musiciansList').innerHTML = MUSICIANS.map(([n, i], k) => `
  <li class="musician"><span class="musician__no">${String(k + 1).padStart(2, '0')}</span><span class="musician__name">${n}</span><span class="musician__inst">${i}</span></li>`).join('');
$('#teamList').innerHTML = TEAM.map(([n, r]) => `<li>${n}<span>${r}</span></li>`).join('');
$('#boardList').innerHTML = BOARD.map((n) => `<li>${n}</li>`).join('');

// Hero — next concert
const heroNext = $('#heroNext');
heroNext.style.setProperty('--c', next.color);
heroNext.href = `#concert-${next.id}`;
heroNext.setAttribute('aria-label', `הקונצרט הבא: ${next.title}, ${next.dateLabel}`);
heroNext.innerHTML = `
  <div class="hero__next-media">${img(next.img, '', '(max-width: 900px) 80vw, 32vw', true)}</div>
  <div class="hero__next-badge" aria-hidden="true">
    <svg viewBox="0 0 132 132"><defs><path id="circ" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"/></defs>
      <text><textPath href="#circ">NEXT CONCERT · הקונצרט הבא · NEXT CONCERT · </textPath></text></svg>
    <span><b>0${next.no}</b>${next.dateLabel}</span>
  </div>
  <div class="hero__next-info">
    <div><h2>${next.title}</h2><p>${next.dateLabel} · 20:00 · אולם צוקר</p></div>
    <div class="hero__count" aria-hidden="true" id="countdown"></div>
  </div>`;

function tickCountdown() {
  const el = $('#countdown');
  if (!el) return;
  let diff = Math.max(0, new Date(next.date).getTime() - Date.now());
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4);
  el.innerHTML = `<div><b>${d}</b><span>ימים</span></div><div><b>${String(h).padStart(2, '0')}</b><span>שעות</span></div><div><b>${String(m).padStart(2, '0')}</b><span>דקות</span></div>`;
}
tickCountdown();
setInterval(tickCountdown, 30e3);

/* ------------------------------------------------------------------ */
/* Audio                                                                */
/* ------------------------------------------------------------------ */
const audio = createAudio($('#bgAudio'));
const soundBtn = $('.sound-toggle');
const bars = $$('.sound-toggle__bars i');
soundBtn.addEventListener('click', () => audio.toggle());
audio.onChange((p) => {
  soundBtn.setAttribute('aria-pressed', String(p));
  soundBtn.setAttribute('aria-label', p ? 'השתקת המוזיקה' : 'הפעלת מוזיקה ברקע');
});
(function meter() {
  const b = audio.bands(4);
  bars.forEach((bar, i) => { bar.style.height = `${b ? 3 + b[i] * 13 : 3}px`; });
  requestAnimationFrame(meter);
})();

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                        */
/* ------------------------------------------------------------------ */
let lenis = null;
function startLenis() {
  if (isStill() || lenis) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis && lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function scrollToTarget(target) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: isStill() ? 'auto' : 'smooth' });
  if (el.id === 'main' || el.matches('section')) { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const el = $(id);
  if (!el) return;
  e.preventDefault();
  closeMenu();
  scrollToTarget(el);
  history.replaceState(null, '', id === '#main' || id === '#top' ? location.pathname : id);
});

/* ------------------------------------------------------------------ */
/* Intro                                                                */
/* ------------------------------------------------------------------ */
const intro = $('#intro');
let introFx = null;

function runIntro() {
  const skip = isStill();
  introFx = createIntro($('.intro__canvas'), { getLevel: () => audio.level(), reduced: isStill() });
  const counter = $('#introCount');
  const tl = gsap.timeline();
  tl.to('[data-intro-reveal]', { opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power2.out' }, 0.3);
  const obj = { v: 1991 };
  tl.to(obj, { v: 2026, duration: 2.6, ease: 'power3.inOut', onUpdate: () => (counter.textContent = Math.round(obj.v)) }, 0.4);
  tl.add(() => (counter.textContent = 'XXXVI'));
  tl.to('[data-intro-actions]', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, skip ? 0.2 : 2.2);
  tl.add(() => $('[data-enter="sound"]').focus({ preventScroll: true }), '>-0.4');

  $$('[data-enter]').forEach((b) => b.addEventListener('click', () => exitIntro(b.dataset.enter === 'sound')));
  intro.addEventListener('keydown', (e) => { if (e.key === 'Escape') exitIntro(false); });
}

let exiting = false;
function exitIntro(withSound) {
  if (exiting) return;
  exiting = true;
  if (withSound) audio.play();
  try { sessionStorage.setItem('e21-intro', 'seen'); } catch { /* ignore */ }
  introFx?.burst();
  const tl = gsap.timeline({
    onComplete: () => {
      intro.remove();
      introFx?.destroy();
      document.body.classList.remove('is-loading');
      startLenis();
      ScrollTrigger.refresh();
      $('#main').focus({ preventScroll: true });
    },
  });
  tl.to('.intro__ui', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0)
    .to(intro, { clipPath: 'circle(0% at 50% 50%)', duration: isStill() ? 0.01 : 1.3, ease: 'expo.inOut' }, 0.35)
    .add(heroIn, 0.75);
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
const strings = createStrings($('.hero__strings'), { getWave: () => audio.wave(), getLevel: () => audio.level() });

gsap.set('.hero__title .split', { yPercent: 115 });
gsap.set('.hero [data-reveal], .hero__next', { autoAlpha: 0, y: 30 });
gsap.set('.hero__circle', { scale: 0.6, autoAlpha: 0 });
function heroIn() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to('.hero__title .split', { yPercent: 0, duration: 1.5, stagger: 0.12 })
    .to('.hero [data-reveal]', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.3)
    .to('.hero__next', { autoAlpha: 1, y: 0, duration: 1.4 }, 0.2)
    .fromTo('.hero__next-media', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut' }, 0.2)
    .to('.hero__next-media img', { scale: 1, duration: 2.2 }, 0.2)
    .to('.hero__circle', { scale: 1, autoAlpha: 1, duration: 2, stagger: 0.2 }, 0.1)
    .add(() => strings.strum(), 0.4);
}

/* ------------------------------------------------------------------ */
/* Scroll animations                                                    */
/* ------------------------------------------------------------------ */
function setupScroll() {
  const mm = gsap.matchMedia();

  // Generic reveals (outside hero)
  $$('[data-reveal]').filter((el) => !el.closest('.hero')).forEach((el) => {
    gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  // Section heads
  $$('.section-head').forEach((h) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 85%' } });
    tl.from(h.querySelector('.section-head__title'), { yPercent: 100, autoAlpha: 0, duration: 1.1, ease: 'expo.out' })
      .from(h.querySelector('.section-head__line'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.1)
      .from(h.querySelector('.section-head__no'), { autoAlpha: 0, x: 20, duration: 0.8 }, 0.2);
  });

  // About statement — words light up while scrolling
  const st = $('[data-words]');
  if (st) {
    st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    gsap.to(st.querySelectorAll('.w'), {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  }

  // Count-up numbers
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const from = end > 1000 ? end - 60 : 0;
    const o = { v: from };
    gsap.to(o, {
      v: end, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = Math.round(o.v)),
    });
  });

  // Musicians stagger
  gsap.from('.musician', {
    y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05,
    scrollTrigger: { trigger: '#musiciansList', start: 'top 85%' },
  });

  // Hero parallax
  gsap.to('.hero__next', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__circle--a', { rotate: 90, yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Marquee — speeds up with scroll velocity, direction follows scroll
  const track = $('.marquee__track');
  track.innerHTML += track.innerHTML;
  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity() / 300;
      gsap.to(loop, { timeScale: Math.max(-6, Math.min(6, 1 + v)) * (v < 0 ? -1 : 1) || 1, duration: 0.2, overwrite: true });
      gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.25, overwrite: false });
    },
  });

  // Season — horizontal on desktop, stacked on mobile
  mm.add('(min-width: 1000px)', () => {
    const season = $('.season');
    season.classList.add('season--h');
    const trackEl = $('#seasonTrack');
    const dist = () => (trackEl.children.length - 1) * window.innerWidth;
    const tween = gsap.to(trackEl, {
      x: () => dist(), // RTL: content overflows to the left, so we move right
      ease: 'none',
      scrollTrigger: {
        trigger: '.season__pin', pin: true, start: 'top top', end: () => `+=${dist()}`,
        scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        snap: { snapTo: 1 / (CONCERTS.length - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut', delay: 0.05 },
        onUpdate: (self) => gsap.set('.season__progress span', { scaleX: self.progress }),
      },
    });
    $$('.concert').forEach((c) => {
      const st = { trigger: c, containerAnimation: tween, start: 'left 85%', end: 'right 15%', scrub: true };
      gsap.fromTo(c.querySelector('.concert__media img'), { scale: 1.25, xPercent: 8 }, { scale: 1.05, xPercent: -8, ease: 'none', scrollTrigger: st });
      gsap.fromTo(c.querySelector('.concert__num'), { xPercent: -40 }, { xPercent: 40, ease: 'none', scrollTrigger: st });
      gsap.from(c.querySelectorAll('.concert__disc, .concert__title, .concert__tag, .concert__meta, .concert__people, .concert__actions'), {
        y: 40, autoAlpha: 0, stagger: 0.07, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 60%' },
      });
      gsap.from(c.querySelector('.concert__ring'), { rotate: -120, scale: 0.4, autoAlpha: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 70%' } });
    });
    // keyboard users: bring the focused concert panel into view
    const onFocus = (e) => {
      const c = e.target.closest('.concert');
      if (!c) return;
      const i = [...trackEl.children].indexOf(c);
      const st = tween.scrollTrigger;
      const y = st.start + (st.end - st.start) * (i / (CONCERTS.length - 1));
      if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
    };
    trackEl.addEventListener('focusin', onFocus);
    return () => { season.classList.remove('season--h'); trackEl.removeEventListener('focusin', onFocus); };
  });
  mm.add('(max-width: 999px)', () => {
    $$('.concert').forEach((c) => {
      gsap.fromTo(c.querySelector('.concert__media'), { clipPath: 'inset(18% 10% 18% 10%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: c, start: 'top 95%', end: 'top 35%', scrub: true },
      });
      gsap.fromTo(c.querySelector('.concert__media img'), { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from(c.querySelectorAll('.concert__disc, .concert__title, .concert__tag, .concert__meta, .concert__people, .concert__actions'), {
        y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c.querySelector('.concert__body'), start: 'top 88%' },
      });
    });
  });

  // Tickets visual parallax
  gsap.fromTo('.subs__visual img', { yPercent: -8, scale: 1.15 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.subs', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Contact big words
  gsap.from('.contact__big', { letterSpacing: '0.12em', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 90%', end: 'top 30%', scrub: true } });

  // Active nav
  ['about', 'season', 'tickets', 'contact'].forEach((id) => {
    ScrollTrigger.create({
      trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => $$(`[data-nav][href="#${id}"]`).forEach((a) => {
        a.classList.toggle('is-active', self.isActive);
        if (self.isActive) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      }),
    });
  });
}

/* ------------------------------------------------------------------ */
/* Header: hide on scroll down, solid after hero                        */
/* ------------------------------------------------------------------ */
const header = $('.site-header');
let lastY = 0;
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 40);
  const hide = y > lastY && y > 400 && !document.body.classList.contains('menu-open');
  header.classList.toggle('is-hidden', hide);
  lastY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

/* ------------------------------------------------------------------ */
/* Mobile menu                                                          */
/* ------------------------------------------------------------------ */
const burger = $('.burger');
const menu = $('#mobileMenu');
function openMenu() {
  menu.hidden = false;
  document.body.classList.add('menu-open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'סגירת תפריט');
  lenis?.stop();
  gsap.fromTo(menu, { clipPath: 'circle(0px at 40px 38px)' }, { clipPath: 'circle(160% at 40px 38px)', duration: isStill() ? 0 : 0.9, ease: 'expo.inOut' });
  gsap.fromTo('.mobile-menu li a', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.25 });
}
function closeMenu() {
  if (menu.hidden) return;
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'פתיחת תפריט');
  lenis?.start();
  gsap.to(menu, { clipPath: 'circle(0px at 40px 38px)', duration: isStill() ? 0 : 0.6, ease: 'expo.inOut', onComplete: () => (menu.hidden = true) });
}
burger.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ------------------------------------------------------------------ */
/* Director "read more"                                                 */
/* ------------------------------------------------------------------ */
$('[data-more]').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const more = $('#directorMore');
  const open = more.hidden;
  more.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? 'סגירה' : 'קראו עוד';
  if (open) gsap.from(more, { autoAlpha: 0, y: 20, duration: 0.8, ease: 'expo.out' });
  ScrollTrigger.refresh();
});

/* ------------------------------------------------------------------ */
/* Concert dialog                                                       */
/* ------------------------------------------------------------------ */
const dlg = $('#concertDialog');
let lastFocus = null;
function openConcert(id) {
  const c = CONCERTS.find((x) => x.id === id);
  if (!c) return;
  lastFocus = document.activeElement;
  dlg.style.setProperty('--c', c.color);
  const im = $('#dlgImg');
  im.src = `/media/${c.poster}-1400.webp`;
  im.alt = `פוסטר הקונצרט ${c.title}`;
  const past = isPast(c);
  $('#dlgBody').innerHTML = `
    <p class="concert__disc">DISCOVERIES ${c.no} · העונה ה־36</p>
    <h2 class="concert__title" id="dlgTitle">${c.title}</h2>
    <div class="concert__meta"><span class="concert__date">${c.dateLabel}</span><span class="concert__when">${c.day} · 20:00 · ${VENUE}</span></div>
    <ul class="concert__people">${c.people.map(([r, n]) => `<li><span>${r}</span><b>${n}</b></li>`).join('')}</ul>
    <p class="eyebrow">בתוכנית</p>
    <ol class="dlg-program">${c.program.map(([comp, work, note]) => `<li><b>${comp}</b><span>${work}</span>${note ? `<small>${note}</small>` : ''}</li>`).join('')}</ol>
    ${past ? '<span class="concert__past">✓ הקונצרט התקיים</span>' : `<a class="btn btn--ink btn--lg" style="--hover-bg:${c.color}" href="${c.tickets}" target="_blank" rel="noopener"><span>לרכישת כרטיסים</span><span class="sr-only"> (נפתח בחלון חדש)</span></a>`}`;
  dlg.showModal();
  lenis?.stop();
  gsap.from('#dlgBody > *', { y: 24, autoAlpha: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out', delay: 0.1 });
}
function closeConcert() { dlg.close(); }
dlg.addEventListener('close', () => { lenis?.start(); lastFocus?.focus({ preventScroll: true }); });
dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) closeConcert(); });
document.addEventListener('click', (e) => { const t = e.target.closest('[data-open]'); if (t) openConcert(t.dataset.open); });
document.addEventListener('keydown', (e) => {
  const t = e.target.closest?.('[data-open][role="button"]');
  if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openConcert(t.dataset.open); }
});

/* ------------------------------------------------------------------ */
/* Contact form (opens the visitor's mail client)                       */
/* ------------------------------------------------------------------ */
$('#contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const status = f.querySelector('.form__status');
  let ok = true;
  ['name', 'email', 'message'].forEach((n) => {
    const field = f.elements[n];
    const bad = !field.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(field.value));
    field.closest('.field').classList.toggle('is-invalid', bad);
    field.setAttribute('aria-invalid', String(bad));
    if (bad && ok) { field.focus(); ok = false; }
  });
  if (!ok) { status.textContent = 'נא למלא שם, אימייל תקין והודעה.'; return; }
  const d = Object.fromEntries(new FormData(f));
  const body = `${d.message}\n\n— ${d.name}\n${d.email}${d.phone ? `\n${d.phone}` : ''}${d.newsletter ? '\n\nמבקש/ת להצטרף לרשימת התפוצה.' : ''}`;
  window.location.href = `mailto:info.ens21@gmail.com?subject=${encodeURIComponent(`פנייה מהאתר — ${d.name}`)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'תודה! תוכנת הדואר שלכם נפתחת עם ההודעה — נותר רק ללחוץ ״שליחה״.';
});

/* ------------------------------------------------------------------ */
/* Cursor + magnetic buttons (desktop only)                             */
/* ------------------------------------------------------------------ */
if (finePointer) {
  root.classList.add('has-cursor');
  const cur = $('.cursor');
  const label = $('.cursor__label');
  const dot = $('.cursor__dot');
  const ring = $('.cursor__ring');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...pos };
  window.addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.18; ringPos.y += (pos.y - ringPos.y) * 0.18;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
  });
  document.addEventListener('pointerover', (e) => {
    const lab = e.target.closest('[data-cursor]');
    const hov = e.target.closest('a, button, summary, [role="button"], label');
    cur.classList.toggle('is-label', !!lab);
    cur.classList.toggle('is-hover', !lab && !!hov);
    label.textContent = lab ? lab.dataset.cursor : '';
  });

  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (isStill()) return;
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
  });

  // concert media tilt
  $$('.concert__media, .hero__next').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (isStill()) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * 6, rotateX: -py * 6, transformPerspective: 900, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1, ease: 'power3.out' }));
  });
}

/* ------------------------------------------------------------------ */
/* Accessibility                                                        */
/* ------------------------------------------------------------------ */
initA11y({
  onChange: (s) => {
    strings.setRunning(!s.still);
    if (s.still && lenis) { lenis.destroy(); lenis = null; }
    if (!s.still && !lenis && !document.body.classList.contains('is-loading')) startLenis();
    gsap.globalTimeline.timeScale(s.still ? 20 : 1);
    ScrollTrigger.refresh();
  },
});
if (a11yState.still) strings.setRunning(false);

/* ------------------------------------------------------------------ */
/* Boot                                                                 */
/* ------------------------------------------------------------------ */
setupScroll();
if (location.hash && location.hash.length > 1 && $(location.hash)) {
  // deep link: skip the intro and jump straight to the section
  intro.remove();
  document.body.classList.remove('is-loading');
  heroIn();
  startLenis();
  requestAnimationFrame(() => setTimeout(() => { ScrollTrigger.refresh(); scrollToTarget(location.hash); }, 100));
} else {
  runIntro();
}
