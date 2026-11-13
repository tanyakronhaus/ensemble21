// Bilingual site (עברית / English).
// Static HTML is written in Hebrew. Elements carry data-i18n="key" (innerHTML) and/or
// data-i18n-attr="attr:key;attr2:key2". Hebrew originals are captured from the DOM on first run,
// English comes from EN below. Dynamic UI strings live in UI.

const KEY = 'e21-lang';

export const EN = {
  'meta.title': 'Israel Contemporary Players | Ensemble 21',
  'meta.desc': 'Israel Contemporary Players — Israel’s leading ensemble for contemporary music. Season 36: Discoveries — six concerts at Zucker Hall, Heichal Hatarbut Tel Aviv.',
  'skip': 'Skip to main content',
  'intro.label': 'Intro',
  'intro.kicker': 'Season 36 · DISCOVERIES',
  'intro.logoAlt': 'Israel Contemporary Players · Ensemble 21',
  'intro.sound': 'Enter with sound',
  'intro.quiet': 'Enter quietly',
  'brand.label': 'Israel Contemporary Players — back to top',
  'nav.label': 'Main navigation',
  'nav.about': 'About',
  'nav.season': 'Season 36',
  'nav.tickets': 'Tickets',
  'nav.contact': 'Contact',
  'nav.a11y': 'Accessibility',
  'menu.label': 'Mobile menu',
  'sound.label': 'Sound',
  'hero.eyebrow': 'Israel Contemporary Players · since 1991',
  'hero.l1': 'Israel',
  'hero.l2': 'Contemporary',
  'hero.l3': 'Players',
  'hero.lead': 'The new generation of classical music. <br class="br-desk" />Season 36: <strong>Discoveries</strong> — six concerts at Zucker Hall, Heichal Hatarbut Tel Aviv.',
  'hero.cta1': '<span>Season 36</span>',
  'hero.cta2': '<span>6-concert subscription · ₪570</span>',
  'hero.cursor': 'Concert',
  'hero.scroll': 'Scroll',
  'score.label': 'Running score: Erik Satie, Gymnopédie No. 1',
  'score.caption': 'Erik Satie — <em>Gymnopédie No. 1</em> (1888)',
  'about.title': 'About',
  'about.statement': 'Founded in 1991, the Israel Contemporary Players are widely regarded as the best ensemble of its kind in Israel — an ensemble that has shaped the country’s musical life and its love of contemporary music.',
  'about.p1': 'The ensemble regularly commissions, performs and records works by Israeli composers and has so far premiered over 100 Israeli compositions, alongside an international repertoire from the 20th and 21st centuries.',
  'about.p2': 'The ICP collaborates with the finest European and Israeli conductors and soloists, including Michel Tabatchnik, Peter Rundel, Jonathan Nott, Ilan Volkov, Fabian Panisello, Christian Eggen, Dietrich Henschel, Irvine Arditti, Boris Berman and George Benjamin. Awarded the National Lottery Foundation prize for excellence, the ensemble is internationally renowned and frequently invited to the most prestigious venues and festivals in Europe and Asia. The <strong>“Discoveries”</strong> concert series is performed regularly at Heichal Hatarbut Tel Aviv.',
  'about.p3': 'The Israel Contemporary Players are supported by the Ministry of Culture and Sport and the Tel Aviv-Yafo Municipality.',
  'about.statsLabel': 'In numbers',
  'stat.founded': 'Founded',
  'stat.seasons': 'Concert seasons',
  'stat.players': 'Players',
  'stat.concerts': 'Concerts a season',
  'dir.eyebrow': 'Founder & Artistic Director',
  'dir.name': 'Dan Yuhas',
  'dir.p1': 'Dan Yuhas, born in 1947, studied piano and composition at the Rubin Academy in Tel Aviv, with further studies at the Guildhall School in London and in Paris. Among many other prizes and awards, he received the Acum Prize (1987), the Prime Minister’s Prize for Composers (1988), the Lieberson Prize for Orchestral Composition (1998) and the Tel Aviv Municipality Prize for Composition (2007).',
  'dir.p2': 'In 2008 he received the Koussevitzky Award from the Koussevitzky Foundation and the Library of Congress, and in 2009 the National Lottery Prize for Composition. Yuhas is the founder and director of the Israel Contemporary Players and of Hateiva – The Center for Electronic Music in Tel Aviv. He teaches counterpoint and composition at the Buchmann-Mehta School of Music at Tel Aviv University.',
  'mus.title': 'The Players',
  'mus.sub': 'The ensemble’s permanent members — soloists and chamber musicians among the finest in Israel.',
  'ppl.guest': 'Guest Conductor',
  'ppl.guestText': '<strong>Zsolt Nagy</strong> — born in Gyula, Hungary, in 1957. He has worked with the RAI orchestras in Milan and Turin, the Jerusalem SO, the BBC SO, Ensemble InterContemporain, Klangforum Wien, London Sinfonietta and many more, with over 500 first performances to his credit. He received a special award for the promotion of new Israeli music.',
  'ppl.team': 'Ensemble Team',
  'ppl.board': 'Board of Directors',
  'season.title': 'Season 36',
  'season.big': '<span class="season__disc">DISCOVERIES</span>New discoveries<br />in contemporary music',
  'season.desc': 'Works by the great composers of our time — Steve Reich’s video opera “The Cave”, Elliott Carter, George Benjamin, Kaija Saariaho and many more — alongside Israeli composers in premiere performances. All concerts on Saturday nights at 20:00, Zucker Hall.',
  'season.list': 'Season 36 concerts',
  'tix.title': 'Tickets & Subscriptions',
  'subs.eyebrow': 'Season 36 subscription',
  'subs.title': 'Discoveries<br /><span>A journey of six concerts</span>',
  'subs.note': 'For new subscribers · discounts for students, composers and senior citizens',
  'price.regular': 'Regular subscription',
  'price.senior': 'Senior citizen / student',
  'price.continuing': 'Continuing subscription',
  'price.composers': 'Composers subscription',
  'subs.buy': '<span>Buy a subscription</span><span class="sr-only"> (opens in a new window)</span>',
  'singles.eyebrow': 'Single tickets',
  'singles.regular': 'Regular ticket',
  'singles.senior': 'Senior citizen / student',
  'singles.box': 'Heichal Hatarbut box office: <a href="tel:036822403" dir="ltr">03-6822403</a>',
  'pol.incl': 'What the subscription includes',
  'pol.incl1': 'One seat at each of the six concerts of the “Discoveries” series.',
  'pol.incl2': 'Concerts are held at Zucker Hall, Heichal Hatarbut Tel Aviv.',
  'pol.incl3': 'Concerts are filmed and made available to watch and listen to.',
  'pol.exch': 'Ticket exchange & cancellation policy',
  'pol.exch1': 'Subscribers and single-ticket holders who cannot attend should e-mail us up to 24 hours before the concert.',
  'pol.exch2': 'Only subscribers who notified us of a cancellation can use the ticket for another concert — <a href="mailto:info.ens21@gmail.com">info.ens21@gmail.com</a>.',
  'pol.exch3': 'Unused tickets can be credited towards the next season, provided the holder buys a subscription for that season.',
  'pol.exch4': 'Options for exchanging unused tickets will be e-mailed to you during the season.',
  'contact.title': 'Contact',
  'contact.big': 'Let’s<br />talk.',
  'contact.wa': 'WhatsApp',
  'contact.mail': 'Send an e-mail',
  'contact.box': 'Box office',
  'form.intro': 'Leave a message and we’ll get back to you as soon as we can.',
  'form.name': 'Full name',
  'form.email': 'E-mail',
  'form.phone': 'Phone (optional)',
  'form.msg': 'Your message',
  'form.news': 'I’d like to join the mailing list for concerts and offers',
  'form.send': '<span>Send</span>',
  'footer.nav': 'Footer navigation',
  'footer.support': 'Supported by',
  'footer.culture': 'Ministry of Culture and Sport',
  'footer.tlv': 'Tel Aviv-Yafo Municipality',
  'footer.rights': '© <span id="year">2026</span> Israel Contemporary Players. All rights reserved.',
  'footer.top': 'Back to top ↑',
  'dlg.close': 'Close',
  'a11y.fab': 'Accessibility menu',
  'a11y.panel': 'Accessibility options',
  'a11y.title': 'Accessibility',
  'a11y.closeLbl': 'Close accessibility menu',
  'a11y.size': 'Text size',
  'a11y.smaller': 'Smaller text',
  'a11y.bigger': 'Larger text',
  'a11y.contrast': 'High contrast',
  'a11y.dark': 'Dark background',
  'a11y.grayscale': 'Grayscale',
  'a11y.links': 'Highlight links',
  'a11y.readable': 'Readable font',
  'a11y.still': 'Stop animations',
  'a11y.spacing': 'Text spacing',
  'a11y.cursor': 'Large cursor',
  'a11y.reset': 'Reset settings',
  'a11y.statement': 'Accessibility statement',
  'doc.home': 'Israel Contemporary Players — home page',
  'doc.back': 'Back to the site',
  'doc.rights': '© 2026 Israel Contemporary Players. All rights reserved.',
  'doc.homeLink': 'Home page',
  'doc.title': 'Accessibility Statement | Israel Contemporary Players',
  'lang.switch': 'עברית',
  'lang.switchLabel': 'החלפת שפה לעברית',
};

// strings used from JS (both languages)
export const UI = {
  he: {
    tickets: 'לרכישת כרטיסים', full: 'התוכנית המלאה', past: '✓ הקונצרט התקיים', pastShort: 'התקיים', ticketsShort: 'כרטיסים',
    newWin: '(נפתח בחלון חדש)', details: 'פרטים מלאים', next: 'הקונצרט הבא', nextRing: 'NEXT CONCERT · הקונצרט הבא · NEXT CONCERT · ',
    hall: 'אולם צוקר', days: 'ימים', hours: 'שעות', mins: 'דקות', program: 'בתוכנית', season: 'העונה ה־36',
    more: 'קראו עוד', less: 'סגירה', soundOn: 'הפעלת מוזיקה ברקע', soundOff: 'השתקת המוזיקה',
    menuOpen: 'פתיחת תפריט', menuClose: 'סגירת תפריט', posterAlt: 'פוסטר הקונצרט', cursorDetails: 'לפרטים',
    formErr: 'נא למלא שם, אימייל תקין והודעה.', formOk: 'תודה! תוכנת הדואר שלכם נפתחת עם ההודעה — נותר רק ללחוץ ״שליחה״.',
    mailSubject: 'פנייה מהאתר', mailNews: 'מבקש/ת להצטרף לרשימת התפוצה.',
    scoreCaption: 'אריק סאטי — <em>ג׳ימנופדיה מס׳ 1</em> (1888)',
  },
  en: {
    tickets: 'Buy tickets', full: 'Full programme', past: '✓ This concert has taken place', pastShort: 'Past', ticketsShort: 'Tickets',
    newWin: '(opens in a new window)', details: 'Full details', next: 'Next concert', nextRing: 'NEXT CONCERT · NEXT CONCERT · NEXT CONCERT · ',
    hall: 'Zucker Hall', days: 'days', hours: 'hrs', mins: 'min', program: 'Programme', season: 'Season 36',
    more: 'Read more', less: 'Close', soundOn: 'Play background music', soundOff: 'Mute the music',
    menuOpen: 'Open menu', menuClose: 'Close menu', posterAlt: 'Concert poster', cursorDetails: 'Details',
    formErr: 'Please fill in your name, a valid e-mail and a message.', formOk: 'Thank you! Your e-mail app is opening with the message — just press “Send”.',
    mailSubject: 'Message from the website', mailNews: 'Please add me to the mailing list.',
    scoreCaption: 'Erik Satie — <em>Gymnopédie No. 1</em> (1888)',
  },
};

let lang = 'he';
const HE = {};
const listeners = new Set();

export function getStoredLang() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'he') return q;
    return localStorage.getItem(KEY) || null;
  } catch { return null; }
}

export const getLang = () => lang;
export const L = (v) => (v && typeof v === 'object' && 'he' in v ? v[lang] : v);
export const t = (k) => UI[lang][k] ?? k;
export const onLangChange = (fn) => listeners.add(fn);

function captureHebrew() {
  if (HE.__done) return;
  document.querySelectorAll('[data-i18n]').forEach((el) => { HE[el.dataset.i18n] = el.innerHTML; });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      HE[key] = el.getAttribute(attr);
    });
  });
  HE['meta.title'] = document.title;
  HE['meta.desc'] = document.querySelector('meta[name="description"]')?.content;
  HE['lang.switch'] = 'EN';
  HE['lang.switchLabel'] = 'Switch language to English';
  HE.__done = true;
}

export function setLang(next, { persist = true } = {}) {
  captureHebrew();
  lang = next === 'en' ? 'en' : 'he';
  const dict = lang === 'en' ? EN : HE;
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'en' ? 'ltr' : 'rtl';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = dict[el.dataset.i18n];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      if (dict[key] != null) el.setAttribute(attr, dict[key]);
    });
  });
  document.title = dict['meta.title'];
  const md = document.querySelector('meta[name="description"]');
  if (md) md.content = dict['meta.desc'];
  if (persist) { try { localStorage.setItem(KEY, lang); } catch { /* ignore */ } }
  listeners.forEach((fn) => fn(lang));
}
