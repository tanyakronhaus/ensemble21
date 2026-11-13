// Season 36 — "DISCOVERIES / תגליות"
// Hebrew + English texts and ticket links taken from the previous site (ensemble21.org.il)
// and from the new season visuals. Every text field is { he, en }.

export const SUBSCRIPTION_URL = 'https://www.eventer.co.il/f0zff';
export const EVENTER_PAGE = 'https://www.eventer.co.il/user/ensemble21';
export const BOX_OFFICE = '03-6822403';

export const VENUE = { he: 'היכל התרבות תל אביב · אולם צוקר', en: 'Heichal Hatarbut TLV · Zucker Hall' };
export const DAY = { he: 'מוצאי שבת', en: 'Saturday' };

const r = (he, en) => ({ he, en });
const R = {
  conductor: r('מנצח', 'Conductor'),
  conductorF: r('מנצחת', 'Conductor'),
  clarinet: r('קלרינט', 'Clarinet'),
  bass: r('קונטרבס', 'Double bass'),
  soprano: r('סופרן', 'Soprano'),
  alto: r('אלט', 'Alto'),
  tenor: r('טנור', 'Tenor'),
  baritone: r('בריטון', 'Baritone'),
  piano: r('פסנתר', 'Piano'),
  harp: r('נבל', 'Harp'),
  cello: r('צ׳לו', 'Cello'),
  voice: r('קול', 'Voice'),
};

export const CONCERTS = [
  {
    id: 'love', no: 1,
    title: r('ככה נשמעת אהבה.', 'Layers of Love'),
    date: '2026-10-31T20:00:00+02:00', dateLabel: '31.10.26',
    color: '#c8202f', tint: '#f7e3e1',
    img: 'love-cut', poster: 'love-poster',
    tickets: 'https://www.eventer.co.il/tag1',
    tagline: r('קונצ׳רטו לקלרינט, שכבות של אהבה ובכורה עולמית', 'A clarinet concerto, layers of love and a world premiere'),
    people: [
      [R.conductor, r('כריסטיאן קרלסן', 'Christian Karlsen')],
      [R.clarinet, r('טיבי צייגר', 'Tibi Cziger')],
    ],
    program: [
      [r('יאיר קלרטג', 'Yair Klartag'), r('קריסה', 'New Work'), r('בכורה עולמית · הוזמנה ע״י אנסמבל המאה ה־21 במסגרת קול קורא להזמנת יצירות ישראליות במימון משרד התרבות והספורט', 'World premiere · commissioned by the ICP with the support of the Ministry of Culture and Sport')],
      [r('אליוט קרטר', 'Elliott Carter'), r('קונצ׳רטו לקלרינט', 'Clarinet Concerto')],
      [r('כריסטיאן מאסון', 'Christian Mason'), r('שכבות של אהבה', 'Layers of Love')],
      [r('ג׳רג׳ ליגטי', 'György Ligeti'), r('מלודיות', 'Melodien')],
    ],
  },
  {
    id: 'ravel', no: 2,
    title: r('שירים של ראוול וריגושים נוספים.', 'Equinox'),
    date: '2026-12-26T20:00:00+02:00', dateLabel: '26.12.26',
    color: '#7b2a6e', tint: '#efe2ee',
    img: 'ravel-cut', poster: 'ravel-poster',
    tickets: 'https://www.eventer.co.il/tag2',
    tagline: r('השנסונים המדגסקריים של ראוול, סאריהו והקטור פארה', 'Ravel’s Chansons madécasses, Saariaho and Hèctor Parra'),
    people: [
      [R.conductorF, r('מעיין פרנקו', 'Maayan Franco')],
      [R.bass, r('ערן בורוביץ׳', 'Eran Borovich')],
      [R.soprano, r('עינת ארונשטיין', 'Einat Aronstein')],
    ],
    program: [
      [r('קאיה סאריהו', 'Kaija Saariaho'), r('סמאפור', 'Semafor')],
      [r('איתן שטיינברג', 'Eitan Steinberg'), r('אחרי', 'After')],
      [r('מוריס ראוול', 'Maurice Ravel'), r('שנסונים מדגסקריים', 'Chansons madécasses')],
      [r('הקטור פארה', 'Hèctor Parra'), r('אקווינוקס', 'Equinox')],
    ],
  },
  {
    id: 'light', no: 3,
    title: r('עם אור ראשון', 'At First Light'),
    date: '2027-02-27T20:00:00+02:00', dateLabel: '27.2.27',
    color: '#d9a21b', tint: '#faf0d4',
    img: 'light-cut', poster: 'light-poster',
    tickets: 'https://www.eventer.co.il/tag3',
    tagline: r('ג׳ורג׳ בנג׳מין, אלבן ברג ובכורה של יוסף ברדנשווילי', 'George Benjamin, Alban Berg and a premiere by Joseph Bardanashvili'),
    people: [
      [R.conductor, r('קלארק רנדל', 'Clark Rundell')],
      [R.piano, r('אמרי טלגם', 'Imri Talgam')],
    ],
    program: [
      [r('יוסף ברדנשווילי', 'Joseph Bardanashvili'), r('יצירה חדשה', 'New Work'), r('בכורה', 'Premiere')],
      [r('טנזי דייוויס', 'Tansy Davies'), r('Nature (טבע)', 'Nature')],
      [r('אלבן ברג', 'Alban Berg'), r('אדג׳ו (1935) לכינור, קלרינט ופסנתר', 'Adagio (1935) for violin, clarinet and piano')],
      [r('ג׳ורג׳ בנג׳מין', 'George Benjamin'), r('At First Light (״עם אור ראשון״)', 'At First Light')],
    ],
  },
  {
    id: 'mosaic', no: 4,
    title: r('פסיפס', 'Mosaic'),
    date: '2027-03-20T20:00:00+02:00', dateLabel: '20.3.27',
    color: '#a8784a', tint: '#f3e9de',
    img: 'mosaic-cut', poster: 'mosaic-poster',
    tickets: 'https://www.eventer.co.il/tag4',
    tagline: r('הנבל במרכז: ראוול, אליוט קרטר ובכורה של כרמל קוריאל', 'The harp takes centre stage: Ravel, Elliott Carter and a premiere by Carmel Curiel'),
    people: [
      [R.conductor, r('ז׳ולט נאג׳', 'Zsolt Nagy')],
      [R.harp, r('סיון מגן', 'Sivan Magen')],
    ],
    program: [
      [r('כרמל קוריאל', 'Carmel Curiel'), r('יצירה חדשה', 'New Work'), r('בכורה', 'Premiere')],
      [r('מוריס ראוול', 'Maurice Ravel'), r('מבוא ואלגרו לנבל, חליל, קלרינט ורביעיית מיתרים', 'Introduction and Allegro for harp, flute, clarinet and string quartet')],
      [r('מרטון אילש', 'Márton Illés'), r('Three Watercolors (״שלושה צבעי מים״)', 'Three Watercolors for ensemble')],
      [r('אליוט קרטר', 'Elliott Carter'), r('Mosaic (״פסיפס״) לנבל ולאנסמבל', 'Mosaic for harp and ensemble')],
    ],
  },
  {
    id: 'cave', no: 5,
    title: r('המערה', 'The Cave'),
    date: '2027-05-22T20:00:00+03:00', dateLabel: '22.5.27',
    color: '#c19a3e', tint: '#f6efdc',
    img: 'cave-cut', poster: 'cave-poster',
    tickets: 'https://www.eventer.co.il/tag5',
    tagline: r('אופרת וידאו עוצרת נשימה מאת סטיב רייך', 'Steve Reich’s breathtaking video opera'),
    people: [
      [R.conductor, r('כריסטיאן קרלסן', 'Christian Karlsen')],
      [R.soprano, r('קרן מוצרי', 'Keren Motseri')],
      [R.alto, r('אנה מולנר', 'Anna Molnar')],
      [R.tenor, r('ג׳ורג׳י סטוז׳נוב', 'Georgi Sztojanov')],
      [R.baritone, r('ג׳ורג׳ קלארק', 'George Clark')],
    ],
    program: [[r('סטיב רייך', 'Steve Reich'), r('המערה — אופרת וידאו', 'The Cave — video opera')]],
  },
  {
    id: 'paint', no: 6,
    title: r('ציור בצלילים ורגשות', 'Echoes'),
    date: '2027-06-26T20:00:00+03:00', dateLabel: '26.6.27',
    color: '#8c5a3c', tint: '#f1e6dc',
    img: 'paint-cut', poster: 'paint-poster',
    tickets: 'https://www.eventer.co.il/tag6',
    tagline: r('קונצ׳רטו לצ׳לו ופרוזה לירית של דביסי', 'A cello concerto and Debussy’s Proses lyriques'),
    people: [
      [R.conductor, r('פרנק אולו', 'Franck Ollu')],
      [R.cello, r('מיכל קורמן', 'Michal Korman')],
      [R.voice, r('יפורסם בהמשך', 'TBA')],
    ],
    program: [
      [r('הד בהק', 'Hed Bahack'), r('יצירה חדשה', 'New Work')],
      [r('דאי פוג׳יקורה', 'Dai Fujikura'), r('קונצ׳רטו לצ׳לו', 'Cello Concerto')],
      [r('קלוד דביסי', 'Claude Debussy'), r('פרוזה לירית לקול ואנסמבל', 'Proses lyriques for voice and ensemble'), r('בעיבוד פרנק אולו', 'Arranged by Franck Ollu')],
    ],
  },
];

export const MUSICIANS = [
  [r('דני ארדמן', 'Danny Erdman'), r('קלרינט', 'Clarinet')],
  [r('ערן בורוביץ׳', 'Eran Borovich'), r('קונטרבס', 'Double Bass')],
  [r('יעל ברולסקי', 'Yael Barolsky'), r('כינור', 'Violin')],
  [r('רונה ברוש', 'Rhona Brosh'), r('חצוצרה', 'Trumpet')],
  [r('עודד גייצהאלס', 'Oded Geizhals'), r('כלי הקשה', 'Percussion')],
  [r('אנדריאה האלם', 'Andrea Hallam'), r('כינור', 'Violin')],
  [r('אלה טובי', 'Ella Toovy'), r('צ׳לו', 'Cello')],
  [r('אמרי טלגם', 'Imri Talgam'), r('פסנתר', 'Piano')],
  [r('דפנה יצחקי', 'Daphna Itzhaky'), r('חליל', 'Flute')],
  [r('עמית לנדאו', 'Amit Landau'), r('ויולה', 'Viola')],
  [r('אלון סטולר', 'Alon Stoler'), r('טרומבון', 'Trombone')],
  [r('בני סלוחין', 'Benny Sluchin'), r('טרומבון', 'Trombone')],
  [r('ריצ׳רד פלאי', 'Richard Paley'), r('בסון', 'Bassoon')],
  [r('הילה צברי־פלג', 'Hila Zabari-Peleg'), r('אבוב', 'Oboe')],
  [r('טיבי צייגר', 'Tibi Cziger'), r('קלרינט', 'Clarinet')],
  [r('איילה רוזנבאום', 'Ayala Rosenbaum'), r('פסנתר', 'Piano')],
  [r('רות רון', 'Ruth Ron'), r('חליל', 'Flute')],
];

export const BOARD = [
  r('נאוה דיסנצ׳יק', 'Nava Dissenchik'), r('יוסי מר־חיים', 'Yossi Mar-Chaim'), r('אתי אלעד', 'Etti Elaad'),
  r('ז׳אק אלעד', 'Jack Elaad'), r('הד סלע', 'Hed Sella'), r('סטיב רוזנברג', 'Steve Rosenberg'), r('יוני רכטר', 'Yoni Rechter'),
];

export const TEAM = [
  [r('אורלי פלדמן בן אז״ר', 'Orly Feldman Ben Azar'), r('מנהלת התיבה ושיווק', 'Manager of Hateiva & Marketing')],
  [r('דניאל וויליאמסון', 'Dani Williamson'), r('מנהלת הפקה ומתאמת אמנותית', 'Production Manager & Artistic Coordinator')],
  [r('דויד לוריא', 'David Louria'), r('טכנאי קול והקלטה', 'Sound & Recording Engineer')],
  [r('אנטון זצ׳סוב', 'Anton Zachesov'), r('מנהל במה', 'Stage Manager')],
  [r('ויק שרון', 'Vic Sharon'), r('מנהלת במה', 'Stage Manager')],
];
