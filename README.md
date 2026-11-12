# אנסמבל המאה ה־21 — אתר

אתר חדש (גרסה ראשונה, עברית) לאנסמבל המאה ה־21 · Israel Contemporary Players.

## פיתוח
```
npm install
npm run dev      # שרת פיתוח
npm run build    # בנייה לתיקיית dist
```

## מבנה
- `index.html` — עמוד הבית: פתיח, אודות, העונה ה־36, כרטיסים, צור קשר
- `accessibility.html` — הצהרת נגישות
- `src/data.js` — **כל נתוני הקונצרטים, קישורי הכרטיסים, המוזיקאים והצוות** (כאן מעדכנים תוכן)
- `src/intro.js` — אנימציית הפתיח (חלקיקים שמתחברים ללוגו XXI)
- `src/strings.js` — "מיתרים" אינטראקטיביים ברקע ה־hero
- `src/audio.js` — מוזיקת רקע + ניתוח אודיו לוויז׳ואל
- `src/a11y.js` — תפריט נגישות
- `scripts/build-assets.mjs` — ממיר את התמונות מ־`images/` לקבצי webp מותאמים ב־`public/media/`

## Vercel
Framework: Vite · Build: `npm run build` · Output: `dist` (מוגדר ב־`vercel.json`).
