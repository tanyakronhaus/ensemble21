import '@fontsource/heebo/300.css';
import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import '@fontsource/heebo/700.css';
import '@fontsource/heebo/800.css';
import '@fontsource/heebo/900.css';
import '@fontsource/frank-ruhl-libre/400.css';
import '@fontsource/frank-ruhl-libre/500.css';
import '@fontsource/noto-music/400.css';
import './styles.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { CONCERTS, MUSICIANS, BOARD, TEAM, VENUE, DAY } from './data.js';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path.js';
import { createIntro } from './intro.js';
import { createStrings } from './strings.js';
import { createAudio } from './audio.js';
import { renderScore, COPIES } from './score.js';
import { initA11y, applyStoredA11y } from './a11y.js';
import { setLang, getLang, getStoredLang, onLangChange, L, t } from './i18n.js';

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

/* ------------------------------------------------------------------ */
/* Render content (structure once, texts per language)                  */
/* ------------------------------------------------------------------ */
const img = (name, alt = '', sizes = '(max-width: 1000px) 92vw, 46vw', eager = false) =>
  `<img src="/media/${name}-700.webp" srcset="/media/${name}-700.webp 700w, /media/${name}-1400.webp 1400w" sizes="${sizes}" alt="${alt}" ${eager ? '' : 'loading="lazy"'} decoding="async" />`;

const isPast = (c) => new Date(c.date).getTime() + 3 * 3600e3 < now.getTime();
const upcoming = CONCERTS.filter((c) => !isPast(c));
const next = upcoming[0] || CONCERTS[CONCERTS.length - 1];
const people = (c) => c.people.map(([r, n]) => `<li><span>${L(r)}</span><b>${L(n)}</b></li>`).join('');

// Season — structure
$('#seasonTrack').innerHTML = CONCERTS.map((c) => `
  <li class="concert" id="concert-${c.id}" style="--c:${c.color};--t:${c.tint}" data-concert="${c.id}">
    <div class="concert__media">
      <div class="concert__float">${img(c.img, '')}</div>
      <span class="concert__dot" aria-hidden="true"></span>
      <span class="concert__ring" aria-hidden="true"></span>
    </div>
    <div class="concert__body">
      <span class="concert__num" aria-hidden="true">0${c.no}</span>
      <p class="concert__disc"></p>
      <h3 class="concert__title"></h3>
      <p class="concert__tag"></p>
      <div class="concert__meta"><span class="concert__date">${c.dateLabel}</span><span class="concert__when"></span></div>
      <ul class="concert__people"></ul>
      <div class="concert__actions"></div>
    </div>
  </li>`).join('');

// Season — texts
function concertTexts() {
  CONCERTS.forEach((c) => {
    const el = $(`#concert-${c.id}`);
    const past = isPast(c);
    $('.concert__disc', el).textContent = `DISCOVERIES ${c.no} · ${c.title.en.toUpperCase()}`;
    $('.concert__title', el).textContent = L(c.title);
    $('.concert__tag', el).textContent = L(c.tagline);
    $('.concert__when', el).textContent = `${L(DAY)} · 20:00 · ${L(VENUE)}`;
    $('.concert__people', el).innerHTML = people(c);
    $('.concert__actions', el).innerHTML = `${past
      ? `<span class="concert__past">${t('past')}</span>`
      : `<a class="btn btn--ink" href="${c.tickets}" target="_blank" rel="noopener"><span>${t('tickets')}</span><span class="sr-only"> — ${L(c.title)} ${t('newWin')}</span></a>`}
      <button class="btn btn--line" type="button" data-open="${c.id}"><span>${t('full')}</span></button>`;
  });
}

function listsTexts() {
  $('#ticketList').innerHTML = CONCERTS.map((c) => {
    const past = isPast(c);
    const inner = `<span class="ticket-row__date">${c.dateLabel}</span>
      <span class="ticket-row__title">${L(c.title)}<span class="sr-only"> — ${past ? t('pastShort') : `${t('tickets')} ${t('newWin')}`}</span></span>
      <span class="ticket-row__go" aria-hidden="true">${past ? t('pastShort') : t('ticketsShort')}</span>`;
    return `<li class="ticket-row ${past ? 'is-past' : ''}" style="--c:${c.color}">
      ${past ? `<div>${inner}</div>` : `<a href="${c.tickets}" target="_blank" rel="noopener">${inner}</a>`}</li>`;
  }).join('');
  const ml = $('#musiciansList');
  if (!ml.children.length) {
    ml.innerHTML = MUSICIANS.map((_, k) => `<li class="musician"><span class="musician__no">${String(k + 1).padStart(2, '0')}</span><span class="musician__name"></span><span class="musician__inst"></span></li>`).join('');
  }
  [...ml.children].forEach((li, k) => {
    li.children[1].textContent = L(MUSICIANS[k][0]);
    li.children[2].textContent = L(MUSICIANS[k][1]);
  });
  $('#teamList').innerHTML = TEAM.map(([n, r]) => `<li>${L(n)}<span>${L(r)}</span></li>`).join('');
  $('#boardList').innerHTML = BOARD.map((n) => `<li>${L(n)}</li>`).join('');
}

// Hero — next concert
const heroNext = $('#heroNext');
heroNext.style.setProperty('--c', next.color);
heroNext.href = `#concert-${next.id}`;
heroNext.innerHTML = `
  <div class="hero__next-media"><div class="hero__float">${img(next.img, '', '(max-width: 900px) 80vw, 32vw', true)}</div></div>
  <div class="hero__next-badge" aria-hidden="true">
    <svg viewBox="0 0 132 132"><defs><path id="circ" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"/></defs>
      <text><textPath href="#circ" id="ringText"></textPath></text></svg>
    <span><b>0${next.no}</b>${next.dateLabel}</span>
  </div>
  <div class="hero__next-info">
    <div><h2 id="nextTitle"></h2><p id="nextWhen"></p></div>
    <div class="hero__count" aria-hidden="true" id="countdown"></div>
  </div>`;
function heroTexts() {
  heroNext.setAttribute('aria-label', `${t('next')}: ${L(next.title)}, ${next.dateLabel}`);
  $('#ringText').textContent = t('nextRing');
  $('#nextTitle').textContent = L(next.title);
  $('#nextWhen').textContent = `${next.dateLabel} · 20:00 · ${t('hall')}`;
  tickCountdown();
}
function tickCountdown() {
  const el = $('#countdown');
  if (!el) return;
  let diff = Math.max(0, new Date(next.date).getTime() - Date.now());
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4);
  el.innerHTML = `<div><b>${d}</b><span>${t('days')}</span></div><div><b>${String(h).padStart(2, '0')}</b><span>${t('hours')}</span></div><div><b>${String(m).padStart(2, '0')}</b><span>${t('mins')}</span></div>`;
}
setInterval(tickCountdown, 30e3);

/* ------------------------------------------------------------------ */
/* Audio                                                                */
/* ------------------------------------------------------------------ */
const audio = createAudio($('#bgAudio'));
const soundBtn = $('.sound-toggle');
const bars = $$('.sound-toggle__bars i');
soundBtn.addEventListener('click', () => audio.toggle());
const soundLabel = () => soundBtn.setAttribute('aria-label', audio.playing ? t('soundOff') : t('soundOn'));
audio.onChange((p) => {
  soundBtn.setAttribute('aria-pressed', String(p));
  soundBtn.classList.toggle('is-playing', p);
  soundLabel();
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
  gsap.ticker.add((tm) => lenis && lenis.raf(tm * 1000));
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
  history.replaceState(null, '', id === '#main' || id === '#top' ? location.pathname + location.search : id);
});

/* ------------------------------------------------------------------ */
/* Language                                                             */
/* ------------------------------------------------------------------ */
let wordsTween = null;
function splitStatement() {
  const st = $('[data-words]');
  if (!st) return;
  wordsTween?.scrollTrigger?.kill();
  wordsTween?.kill();
  st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  wordsTween = gsap.to(st.querySelectorAll('.w'), {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
}
function moreBtnText() {
  const btn = $('[data-more]');
  btn.textContent = btn.getAttribute('aria-expanded') === 'true' ? t('less') : t('more');
}
function applyLangTexts() {
  concertTexts();
  listsTexts();
  heroTexts();
  moreBtnText();
  soundLabel();
  burger.setAttribute('aria-label', menu.hidden ? t('menuOpen') : t('menuClose'));
  $$('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === getLang())));
}
onLangChange(() => {
  applyLangTexts();
  if (setupDone) { splitStatement(); ScrollTrigger.refresh(); }
});
document.addEventListener('click', (e) => {
  const tog = e.target.closest('[data-lang-toggle]');
  const set = e.target.closest('[data-set-lang]');
  if (!tog && !set) return;
  const nextLang = set ? set.dataset.setLang : getLang() === 'he' ? 'en' : 'he';
  if (nextLang === getLang()) return;
  closeMenu();
  const swap = () => setLang(nextLang);
  if (isStill() || set) swap();
  else gsap.to('main, .site-header, .footer', { autoAlpha: 0, duration: 0.25, onComplete: () => { swap(); gsap.to('main, .site-header, .footer', { autoAlpha: 1, duration: 0.45 }); } });
});

/* ------------------------------------------------------------------ */
/* Intro                                                                */
/* ------------------------------------------------------------------ */
const intro = $('#intro');
let introFx = null;

function runIntro() {
  const skip = isStill();
  introFx = createIntro($('.intro__canvas'), {
    getLevel: () => audio.level(),
    reduced: isStill(),
    // the logo lives between the top bar and the kicker line
    getArea: () => ({ top: $('.intro__top').getBoundingClientRect().bottom + 12, bottom: $('.intro__kicker').getBoundingClientRect().top - 18 }),
  });
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
    .to('.hero__circle', { scale: 1, autoAlpha: 1, duration: 2, stagger: 0.2 }, 0.1)
    .add(() => strings.strum(), 0.4);
}

/* ------------------------------------------------------------------ */
/* Images that breathe: slow float + sway, independent per image        */
/* ------------------------------------------------------------------ */
function aliveImages() {
  $$('.concert__float, .hero__float').forEach((el, i) => {
    const d = 5 + (i % 3) * 0.9;
    gsap.to(el, { y: -14, duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -i * 0.7 });
    gsap.to(el, { rotation: i % 2 ? 1.4 : -1.4, duration: d * 1.35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -i * 0.4 });
    gsap.to(el, { scale: 1.03, duration: d * 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -i });
  });
  $$('.concert__ring').forEach((el, i) => gsap.to(el, { rotation: i % 2 ? -360 : 360, duration: 60 + i * 6, ease: 'none', repeat: -1 }));
  $$('.concert__dot').forEach((el, i) => gsap.to(el, { x: i % 2 ? 10 : -10, y: 8, duration: 3.2 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
}

/* ------------------------------------------------------------------ */
/* Scroll animations                                                    */
/* ------------------------------------------------------------------ */
let setupDone = false;
function setupScroll() {
  // Generic reveals (outside hero)
  $$('[data-reveal]').filter((el) => !el.closest('.hero')).forEach((el) => {
    gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Section heads
  $$('.section-head').forEach((h) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    tl.from(h.querySelector('.section-head__title'), { yPercent: 100, autoAlpha: 0, duration: 1.1, ease: 'expo.out' })
      .from(h.querySelector('.section-head__line'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.1)
      .from(h.querySelector('.section-head__no'), { autoAlpha: 0, duration: 0.8 }, 0.2);
  });

  splitStatement();

  // Count-up numbers
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const o = { v: end > 1000 ? end - 60 : 0 };
    gsap.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => (el.textContent = Math.round(o.v)) });
  });

  gsap.from('.musician', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '#musiciansList', start: 'top 85%', once: true } });

  // Hero parallax
  gsap.to('.hero__next', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__circle--a', { rotate: 90, yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Running score — notes glide past a playhead; scrolling pushes the tempo
  const scoreTrack = $('#scoreTrack');
  const { width: scoreW } = renderScore(scoreTrack);
  const allNotes = $$('.n', scoreTrack);
  const perCopy = allNotes.length / COPIES;
  const notes = allNotes.map((el, i) => ({ el, x: Number(el.dataset.x) + Math.floor(i / perCopy) * scoreW, lit: false }));
  const viewport = $('.score__viewport');
  let offset = 0, boost = 0, scoreVisible = false;
  new IntersectionObserver(([e]) => (scoreVisible = e.isIntersecting)).observe(viewport);
  ScrollTrigger.create({ trigger: '.score', start: 'top bottom', end: 'bottom top', onUpdate: (self) => { boost = Math.max(-400, Math.min(900, self.getVelocity() * 0.6)); } });
  gsap.ticker.add((time, dt) => {
    if (!scoreVisible) return;
    const speed = isStill() ? 0 : 70 + boost;
    boost *= 0.94;
    const scale = scoreTrack.firstElementChild.getBoundingClientRect().width / scoreW;
    const loopPx = scoreW * scale;
    offset = (offset + (speed * dt) / 1000) % loopPx;
    if (offset < 0) offset += loopPx;
    scoreTrack.style.transform = `translate3d(${-offset}px,0,0)`;
    const play = viewport.clientWidth / 2;
    for (const n of notes) {
      const lit = Math.abs(n.x * scale - offset - play) < 34 * scale;
      if (lit !== n.lit) { n.el.classList.toggle('is-lit', lit); n.lit = lit; }
    }
  });

  // Season — one concert after another, on normal vertical scroll
  $$('.concert').forEach((c) => {
    const parts = c.querySelectorAll('.concert__disc, .concert__title, .concert__tag, .concert__meta, .concert__people, .concert__actions');
    gsap.from(parts, { y: 36, autoAlpha: 0, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 80%', once: true } });
    gsap.from(c.querySelector('.concert__media'), { y: 60, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%', once: true } });
    gsap.fromTo(c.querySelector('.concert__media'), { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo(c.querySelector('.concert__num'), { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  gsap.fromTo('.subs__visual img', { yPercent: -8, scale: 1.15 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.subs', start: 'top bottom', end: 'bottom top', scrub: true } });

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
  if (!isStill()) aliveImages();
  setupDone = true;
}

/* ------------------------------------------------------------------ */
/* Header: hide on scroll down, solid after hero                        */
/* ------------------------------------------------------------------ */
const header = $('.site-header');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 40);
  header.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
  lastY = y;
}, { passive: true });
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

/* ------------------------------------------------------------------ */
/* Mobile menu                                                          */
/* ------------------------------------------------------------------ */
const burger = $('.burger');
const menu = $('#mobileMenu');
const menuOrigin = () => (getLang() === 'en' ? '38px 32px' : 'calc(100% - 38px) 32px');
function openMenu() {
  menu.hidden = false;
  document.body.classList.add('menu-open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', t('menuClose'));
  lenis?.stop();
  gsap.fromTo(menu, { clipPath: `circle(0px at ${menuOrigin()})` }, { clipPath: `circle(160% at ${menuOrigin()})`, duration: isStill() ? 0 : 0.9, ease: 'expo.inOut' });
  gsap.fromTo('.mobile-menu li a', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.25 });
}
function closeMenu() {
  if (menu.hidden) return;
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', t('menuOpen'));
  lenis?.start();
  gsap.to(menu, { clipPath: `circle(0px at ${menuOrigin()})`, duration: isStill() ? 0 : 0.6, ease: 'expo.inOut', onComplete: () => (menu.hidden = true) });
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
  moreBtnText();
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
  im.alt = `${t('posterAlt')} ${L(c.title)}`;
  const past = isPast(c);
  $('#dlgBody').innerHTML = `
    <p class="concert__disc">DISCOVERIES ${c.no} · ${t('season')}</p>
    <h2 class="concert__title" id="dlgTitle">${L(c.title)}</h2>
    <div class="concert__meta"><span class="concert__date">${c.dateLabel}</span><span class="concert__when">${L(DAY)} · 20:00 · ${L(VENUE)}</span></div>
    <ul class="concert__people">${people(c)}</ul>
    <p class="eyebrow">${t('program')}</p>
    <ol class="dlg-program">${c.program.map(([comp, work, note]) => `<li><b>${L(comp)}</b><span>${L(work)}</span>${note ? `<small>${L(note)}</small>` : ''}</li>`).join('')}</ol>
    ${past ? `<span class="concert__past">${t('past')}</span>` : `<a class="btn btn--ink btn--lg" style="--hover-bg:${c.color}" href="${c.tickets}" target="_blank" rel="noopener"><span>${t('tickets')}</span><span class="sr-only"> ${t('newWin')}</span></a>`}`;
  dlg.showModal();
  lenis?.stop();
  gsap.from('#dlgBody > *', { y: 24, autoAlpha: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out', delay: 0.1 });
}
dlg.addEventListener('close', () => { lenis?.start(); lastFocus?.focus({ preventScroll: true }); });
dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
document.addEventListener('click', (e) => { const o = e.target.closest('[data-open]'); if (o) openConcert(o.dataset.open); });
document.addEventListener('keydown', (e) => {
  const o = e.target.closest?.('[data-open][role="button"]');
  if (o && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openConcert(o.dataset.open); }
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
  if (!ok) { status.textContent = t('formErr'); return; }
  const d = Object.fromEntries(new FormData(f));
  const body = `${d.message}\n\n— ${d.name}\n${d.email}${d.phone ? `\n${d.phone}` : ''}${d.newsletter ? `\n\n${t('mailNews')}` : ''}`;
  window.location.href = `mailto:info.ens21@gmail.com?subject=${encodeURIComponent(`${t('mailSubject')} — ${d.name}`)}&body=${encodeURIComponent(body)}`;
  status.textContent = t('formOk');
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

  // image tilt follows the pointer
  $$('.concert__float, .hero__next-media').forEach((el) => {
    const host = el.closest('.concert__media, .hero__next');
    host.addEventListener('pointermove', (e) => {
      if (isStill()) return;
      const r = host.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(host, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 900, duration: 0.6, ease: 'power3.out' });
    });
    host.addEventListener('pointerleave', () => gsap.to(host, { rotateY: 0, rotateX: 0, duration: 1, ease: 'power3.out' }));
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
setLang(getStoredLang() || 'he', { persist: false });
setupScroll();
if (location.hash && location.hash.length > 1 && $(location.hash)) {
  intro.remove();
  document.body.classList.remove('is-loading');
  heroIn();
  startLenis();
  requestAnimationFrame(() => setTimeout(() => { ScrollTrigger.refresh(); scrollToTarget(location.hash); }, 100));
} else {
  runIntro();
}
