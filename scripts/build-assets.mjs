// Converts the raw visual materials in /images into optimized web assets in /public/media
import sharp from 'sharp';
import fs from 'fs';
const I = 'images/';
const jobs = {
  'love-alt': I + 'ככה נשמעת אהבה/ChatGPT Image Jul 30, 2026 at 12_26_03 PM.png',
  'love-poster': I + 'ככה נשמעת אהבה/ככה נשמעת אהבה-3.png',
  'ravel-alt': I + 'שירים של ראוול/ChatGPT Image Jul 30, 2026 at 01_52_58 PM.png',
  'ravel-poster': I + 'שירים של ראוול/שירים של ראוול-3.png',
  'light-poster': I + 'עם אור ראשון/עם אור ראשון-3.png',
  'mosaic-wide': I + 'פסיפס/ChatGPT Image Aug 2, 2026 at 05_12_45 PM.png',
  'mosaic-poster': I + 'פסיפס/פסיפס-3.png',
  'cave-poster': I + 'המערה/המערה-3.png',
  'paint-poster': I + 'ציור בצלילים/ציור בצלילים ורגשות-3.png',
  'subs-red': I + 'פרסום מנויים/ChatGPT Image Aug 24, 2026 at 12_48_24 PM.png',
  'subs-purple': I + 'פרסום מנויים/ChatGPT Image Aug 24, 2026 at 01_00_26 PM.png',
  'subs-poster': I + 'פרסום מנויים/מנויים-1.png',
  'og': I + 'באנרים/1200_800_כללי.png',
};
fs.mkdirSync('public/media', { recursive: true });
for (const [name, src] of Object.entries(jobs)) {
  for (const w of [700, 1400]) {
    const meta = await sharp(src).metadata();
    await sharp(src).resize({ width: Math.min(w, meta.width) }).webp({ quality: 80 }).toFile(`public/media/${name}-${w}.webp`);
  }
}
await sharp(jobs.og).jpeg({ quality: 85 }).toFile('public/media/og.jpg');
const partners = {
  'p-culture': I + 'ככה נשמעת אהבה/תוכניה/לוגו משרד התרבות.png',
  'p-tlv': I + 'ככה נשמעת אהבה/תוכניה/Tel_Aviv_New_Logo.svg.webp',
  'p-evs': I + 'ככה נשמעת אהבה/תוכניה/EvS_Foerderlogo_sw.jpg',
};
for (const [name, src] of Object.entries(partners)) await sharp(src).resize({ height: 160, withoutEnlargement: true }).webp({ quality: 85 }).toFile(`public/media/${name}.webp`);
console.log('done');
