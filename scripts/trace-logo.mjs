import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'fs';
const src = 'images/פרסום מנויים/מנויים-1.png';
async function trace(region, out) {
  const buf = await sharp(src).extract(region).resize(region.width * 4).grayscale().threshold(120).png().toBuffer();
  return new Promise((res, rej) => potrace.trace(buf, { turdSize: 20, optTolerance: 0.3, color: 'currentColor', background: 'transparent' }, (e, svg) => {
    if (e) return rej(e); fs.writeFileSync(out, svg); res();
  }));
}
await trace({ left: 110, top: 20, width: 280, height: 265 }, 'public/media/logo-mark.svg');
await trace({ left: 90, top: 20, width: 310, height: 345 }, 'public/media/logo-full.svg');
console.log('ok');
