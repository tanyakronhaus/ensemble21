"""Turn the white backgrounds of the concert visuals into real transparency
(colour-to-alpha against white), so the images melt into the site's paper background.
Run after `npm run assets`:  python3 scripts/make-transparent.py"""
import numpy as np
from PIL import Image

I = 'images/'
JOBS = {
    'love-cut': I + 'ככה נשמעת אהבה/ChatGPT Image Jul 30, 2026 at 12_31_55 PM.png',
    'ravel-cut': I + 'שירים של ראוול/ChatGPT Image Jul 30, 2026 at 01_38_30 PM.png',
    'light-cut': I + 'עם אור ראשון/ChatGPT Image Aug 2, 2026 at 05_25_58 PM.png',
    'mosaic-cut': I + 'פסיפס/ChatGPT Image Aug 2, 2026 at 05_04_32 PM.png',
    'cave-cut': I + 'המערה/ChatGPT Image Aug 4, 2026 at 04_28_57 PM.png',
    'paint-cut': I + 'ציור בצלילים/ChatGPT Image Aug 4, 2026 at 04_46_10 PM.png',
}

def white_to_alpha(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255.0
    alpha = (1.0 - a).max(axis=2)
    alpha = np.clip((alpha - 0.025) / 0.975, 0, 1)          # clean off near-white noise
    safe = np.maximum(alpha, 1e-4)[..., None]
    rgb = 1.0 - (1.0 - a) / safe                              # un-premultiply against white
    rgb = np.clip(rgb, 0, 1)
    out = np.dstack([rgb, alpha[..., None]]) * 255
    return Image.fromarray(out.astype(np.uint8), 'RGBA')

import sys
only = sys.argv[1:]
for name, src in JOBS.items():
    if only and name not in only: continue
    im = white_to_alpha(Image.open(src))
    for w in (700, 1400):
        ww = min(w, im.width)
        im.resize((ww, round(im.height * ww / im.width)), Image.LANCZOS).save(f'public/media/{name}-{w}.webp', quality=82, method=6)
    print('ok', name)
