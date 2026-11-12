// A running grand staff: Erik Satie — Gymnopédie No. 1 (1888, public domain), bars 1–12.
// Melody in the treble, the famous alternating G / D bass + major‑seventh chords in the bass.
// Notes light up as they cross the red "playhead".

const LS = 12;            // staff line spacing
const ST = 6;             // one diatonic step
const T_BOTTOM = 96;      // E4 (bottom line of treble staff)
const B_BOTTOM = 210;     // G2 (bottom line of bass staff)
const BEAT = 50;
const BAR = BEAT * 3 + 26;
const HEAD = 150;         // width of clef + key + time signature

const LETTERS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const dia = (n) => LETTERS[n[0]] + 7 * (Number(n.at(-1)) - 4); // C4 = 0
const yTreble = (n) => T_BOTTOM - (dia(n) - 2) * ST;
const yBass = (n) => B_BOTTOM - (dia(n) + 10) * ST;

// Bars 1–12. Melody: [note|null(rest), beats]
const MELODY = [
  [], [], [], [],
  [[null, 1], ['F5', 1], ['A5', 1]],
  [['G5', 1], ['F5', 1], ['C5', 1]],
  [['B4', 1], ['C5', 1], ['D5', 1]],
  [['A4', 3]],
  [['F4', 3, 'tie']],
  [['F4', 3, 'tie']],
  [['F4', 3, 'tie']],
  [['F4', 3]],
];
// sharps are implied by the key signature (D major: F#, C#)
const BASS = (i) => (i % 2 === 0 ? { low: 'G2', chord: ['B3', 'D4', 'F4'] } : { low: 'D2', chord: ['A3', 'C4', 'F4'] });

function staffLines(y0, w) {
  let s = '';
  for (let i = 0; i < 5; i++) s += `<line class="sl" x1="0" x2="${w}" y1="${y0 - i * LS}" y2="${y0 - i * LS}"/>`;
  return s;
}

function ledgers(x, y, bottom) {
  // draw ledger lines for notes above/below a staff whose bottom line is `bottom`
  let s = '';
  const top = bottom - 4 * LS;
  for (let ly = top - LS; ly >= y - 1; ly -= LS) s += `<line class="ll" x1="${x - 11}" x2="${x + 11}" y1="${ly}" y2="${ly}"/>`;
  for (let ly = bottom + LS; ly <= y + 1; ly += LS) s += `<line class="ll" x1="${x - 11}" x2="${x + 11}" y1="${ly}" y2="${ly}"/>`;
  return s;
}

function head(x, y, filled) {
  return `<ellipse cx="${x}" cy="${y}" rx="7.2" ry="5" transform="rotate(-22 ${x} ${y})" class="${filled ? 'nh' : 'nh nh--open'}"/>`;
}

function note({ x, ys, filled, dotted, stemUp, bottom }) {
  const top = Math.min(...ys), bot = Math.max(...ys);
  let s = '';
  ys.forEach((y) => { s += ledgers(x, y, bottom); });
  ys.forEach((y) => { s += head(x, y, filled); });
  s += stemUp
    ? `<line class="stem" x1="${x + 6.6}" x2="${x + 6.6}" y1="${bot - 2}" y2="${top - 36}"/>`
    : `<line class="stem" x1="${x - 6.6}" x2="${x - 6.6}" y1="${top + 2}" y2="${bot + 36}"/>`;
  if (dotted) ys.forEach((y) => { const dy = ((bottom - y) / ST) % 2 === 0 ? -ST : 0; s += `<circle class="dot" cx="${x + 15}" cy="${y + dy}" r="2.2"/>`; });
  return s;
}

function system(offsetBars = 0) {
  const width = HEAD + BAR * MELODY.length;
  let s = '';
  s += staffLines(T_BOTTOM, width) + staffLines(B_BOTTOM, width);
  // brace-ish system line + clefs, key signature (F#, C#) and 3/4
  s += `<line class="bar" x1="1" x2="1" y1="${T_BOTTOM - 4 * LS}" y2="${B_BOTTOM}"/>`;
  s += `<text class="glyph clef" x="12" y="${T_BOTTOM - LS}">𝄞</text>`;
  s += `<text class="glyph clef clef--f" x="12" y="${B_BOTTOM - 3 * LS}">𝄢</text>`;
  const sharp = (x, y) => `<text class="glyph acc" x="${x}" y="${y + 8}">♯</text>`;
  s += sharp(56, yTreble('F5')) + sharp(72, yTreble('C5')) + sharp(56, yBass('F3')) + sharp(72, yBass('C3'));
  s += `<text class="glyph time" x="98" y="${T_BOTTOM - 2 * LS - 2}">3</text><text class="glyph time" x="98" y="${T_BOTTOM + 2}">4</text>`;
  s += `<text class="glyph time" x="98" y="${B_BOTTOM - 2 * LS - 2}">3</text><text class="glyph time" x="98" y="${B_BOTTOM + 2}">4</text>`;

  MELODY.forEach((bar, i) => {
    const bx = HEAD + i * BAR;
    const n = offsetBars + i + 1;
    s += `<line class="bar" x1="${bx + BAR}" x2="${bx + BAR}" y1="${T_BOTTOM - 4 * LS}" y2="${T_BOTTOM}"/>`;
    s += `<line class="bar" x1="${bx + BAR}" x2="${bx + BAR}" y1="${B_BOTTOM - 4 * LS}" y2="${B_BOTTOM}"/>`;
    s += `<text class="barno" x="${bx + 6}" y="${T_BOTTOM - 4 * LS - 14}">${n}</text>`;

    // bass: low note (dotted half, stem down) on beat 1, chord (half, stem up) on beat 2
    const b = BASS(i);
    const x1 = bx + 22, x2 = bx + 22 + BEAT;
    s += `<g class="n" data-x="${x1}">${note({ x: x1, ys: [yBass(b.low)], filled: false, dotted: true, stemUp: false, bottom: B_BOTTOM })}</g>`;
    s += `<g class="n" data-x="${x2}">${note({ x: x2, ys: b.chord.map(yBass), filled: false, dotted: false, stemUp: true, bottom: B_BOTTOM })}</g>`;

    // melody
    let beat = 0;
    if (!bar.length) {
      s += `<text class="glyph rest" x="${bx + BAR / 2 - 6}" y="${T_BOTTOM - 2 * LS + 4}">𝄼</text>`;
    }
    bar.forEach(([p, len, tie]) => {
      const x = bx + 22 + beat * BEAT;
      if (!p) {
        s += `<text class="glyph rest" x="${x - 6}" y="${T_BOTTOM - 2 * LS + 12}">𝄽</text>`;
      } else {
        const y = yTreble(p);
        const up = y > T_BOTTOM - 2 * LS;
        s += `<g class="n n--mel" data-x="${x}">${note({ x, ys: [y], filled: len === 1, dotted: len === 3, stemUp: up, bottom: T_BOTTOM })}</g>`;
        if (tie) s += `<path class="tie" d="M${x + 6} ${y + 8} Q${x + BAR / 2} ${y + 22} ${x + BAR - 6} ${y + 8}"/>`;
      }
      beat += len;
    });
  });
  return { svg: s, width };
}

export const COPIES = 6;

export function renderScore(container) {
  const a = system(0);
  const H = 285;
  const one = `<svg class="score__svg" viewBox="0 -10 ${a.width} ${H}" width="${a.width}" height="${H}" aria-hidden="true" focusable="false">${a.svg}</svg>`;
  container.innerHTML = one.repeat(COPIES); // repeated so the strip always fills the screen
  return { width: a.width };
}
