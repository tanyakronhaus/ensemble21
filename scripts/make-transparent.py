"""Turn the light backgrounds of the concert visuals into real transparency, so the
images sit directly on the site's background (no box, no edge fading).

Each image's own background colour is measured on its border (it is rarely pure white),
then a colour-to-alpha against that colour is applied.

Usage:  python3 scripts/make-transparent.py [name ...]"""
import sys
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
CUTOFF = 0.06  # anything this close to the background becomes fully transparent


def bg_colour(a):
    b = np.concatenate([a[:12].reshape(-1, 3), a[-12:].reshape(-1, 3), a[:, :12].reshape(-1, 3), a[:, -12:].reshape(-1, 3)])
    return np.median(b, axis=0)


def to_alpha(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255.0
    W = bg_colour(a)
    alpha = np.clip((W - a) / np.maximum(W, 1e-3), 0, 1).max(axis=2)
    alpha = np.clip((alpha - CUTOFF) / (1 - CUTOFF), 0, 1)
    safe = np.maximum(alpha, 1e-4)[..., None]
    rgb = np.clip((a - (1 - safe) * W) / safe, 0, 1)
    out = np.dstack([rgb, alpha[..., None]]) * 255
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


only = sys.argv[1:]
for name, src in JOBS.items():
    if only and name not in only:
        continue
    im = to_alpha(Image.open(src))
    for w in (700, 1400):
        ww = min(w, im.width)
        im.resize((ww, round(im.height * ww / im.width)), Image.LANCZOS).save(f'public/media/{name}-{w}.webp', quality=82, method=4)
    print('ok', name, flush=True)
