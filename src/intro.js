// Generative intro: a field of particles ("notes") that assemble into the XXI mark,
// surrounded by the season's dotted orbits. Reacts to the pointer and to the music.
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path.js';

const COLORS = ['#c8202f', '#7b2a6e', '#e2ac25', '#c08a57', '#d4b06a', '#a86a45'];

export function createIntro(canvas, { getLevel = () => 0, reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let particles = [];
  let targets = [];
  let raf = 0;
  let start = performance.now();
  let mode = 'form'; // form -> burst
  let burstT = 0;
  const pointer = { x: -9999, y: -9999, active: false };
  const [vx, vy, vw, vh] = LOGO_VIEWBOX.split(' ').map(Number);

  function sampleLogo() {
    const isMobile = w < 700;
    const logoH = Math.min(h * (isMobile ? 0.34 : 0.44), w * 0.62);
    const scale = logoH / vh;
    const logoW = vw * scale;
    const off = document.createElement('canvas');
    off.width = Math.ceil(logoW);
    off.height = Math.ceil(logoH);
    const o = off.getContext('2d');
    o.setTransform(scale, 0, 0, scale, -vx * scale, -vy * scale);
    o.fill(new Path2D(LOGO_PATH), 'evenodd');
    const data = o.getImageData(0, 0, off.width, off.height).data;
    const pts = [];
    const step = isMobile ? 3 : 3.2;
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        const i = (Math.floor(y) * off.width + Math.floor(x)) * 4 + 3;
        if (data[i] > 128) pts.push([x + (w - logoW) / 2, y + (h - logoH) / 2 - h * (isMobile ? 0.08 : 0.06)]);
      }
    }
    // shuffle
    for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
    const max = isMobile ? 1500 : 2800;
    return pts.slice(0, max);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    targets = sampleLogo();
    const old = particles;
    particles = targets.map((t, i) => {
      const p = old[i] || {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0, vy: 0,
        delay: Math.random() * 1.1,
        size: Math.random() < 0.06 ? 2.4 : 1 + Math.random() * 0.9,
        color: Math.random() < 0.045 ? COLORS[(Math.random() * COLORS.length) | 0] : null,
        seed: Math.random() * 1000,
      };
      p.tx = t[0]; p.ty = t[1];
      return p;
    });
    // ambient dust (never forms the logo)
    const dust = w < 700 ? 90 : 180;
    for (let i = 0; i < dust; i++) particles.push({
      x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, dust: true,
      size: Math.random() * 1.2 + .3, seed: Math.random() * 1000, color: Math.random() < .1 ? COLORS[i % 6] : null,
    });
  }

  function drawOrbits(t, level) {
    const cx = w / 2, cy = h / 2 - h * 0.06;
    const base = Math.min(w, h);
    ctx.save();
    ctx.translate(cx, cy);
    const rings = [
      { r: base * 0.36, dash: [2, 7], color: 'rgba(200,32,47,.55)', speed: 0.05 },
      { r: base * 0.47, dash: [1, 10], color: 'rgba(195,154,78,.45)', speed: -0.03 },
      { r: base * 0.25, dash: [], color: 'rgba(243,238,230,.10)', speed: 0.02 },
    ];
    rings.forEach((ring, k) => {
      ctx.save();
      ctx.rotate(t * ring.speed);
      ctx.setLineDash(ring.dash);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, ring.r * (1 + level * 0.08 * (k + 1)), 0, Math.PI * 2);
      ctx.stroke();
      // orbiting dot
      ctx.setLineDash([]);
      ctx.fillStyle = COLORS[k * 2];
      const a = t * (0.25 + k * 0.12) + k * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 4 + level * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    // thin vertical "score" lines
    ctx.strokeStyle = 'rgba(243,238,230,.12)';
    ctx.beginPath();
    ctx.moveTo(-base * 0.02, -h); ctx.lineTo(-base * 0.02, h);
    ctx.moveTo(base * 0.012, -h); ctx.lineTo(base * 0.012, h);
    ctx.stroke();
    ctx.restore();
  }

  function frame(now) {
    const t = (now - start) / 1000;
    const level = getLevel();
    ctx.clearRect(0, 0, w, h);
    drawOrbits(t, level);

    const formP = Math.min(1, Math.max(0, (t - 0.4) / 2.2));
    for (const p of particles) {
      if (p.dust) {
        p.x += Math.sin(t * 0.3 + p.seed) * 0.15;
        p.y -= 0.12 + level * 0.8;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      } else if (mode === 'form') {
        const local = Math.min(1, Math.max(0, (formP * 1.6 - p.delay * 0.5)));
        const k = 0.02 + local * 0.09;
        const wobble = (1 - local) * 30;
        const jitter = level * 6;
        const tx = p.tx + Math.sin(t * 2 + p.seed) * (wobble * 0.3 + jitter);
        const ty = p.ty + Math.cos(t * 1.7 + p.seed) * (wobble * 0.3 + jitter);
        p.vx += (tx - p.x) * k * local;
        p.vy += (ty - p.y) * k * local;
        if (local < 1) { p.vx += Math.sin(p.seed + t) * 0.05; p.vy += Math.cos(p.seed + t * 0.8) * 0.05; }
        // pointer repel
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9000) { const f = (9000 - d2) / 9000; p.vx += dx * f * 0.09; p.vy += dy * f * 0.09; }
        }
        p.vx *= 0.82; p.vy *= 0.82;
        p.x += p.vx; p.y += p.vy;
      } else {
        // burst outward
        p.vx *= 1.04; p.vy *= 1.04;
        p.vy += 0.05;
        p.x += p.vx; p.y += p.vy;
      }
      ctx.fillStyle = p.color || 'rgba(243,238,230,.9)';
      const s = p.size * (1 + level * 0.6);
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    raf = requestAnimationFrame(frame);
  }

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const pt = e.touches ? e.touches[0] : e;
    pointer.x = pt.clientX - r.left; pointer.y = pt.clientY - r.top; pointer.active = true;
  };
  const onLeave = () => { pointer.active = false; };

  resize();
  if (reduced) {
    // static: jump to formed logo
    particles.forEach((p) => { if (!p.dust) { p.x = p.tx; p.y = p.ty; } });
    start -= 4000;
  }
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);
  raf = requestAnimationFrame(frame);

  return {
    burst() {
      mode = 'burst';
      const cx = w / 2, cy = h / 2;
      particles.forEach((p) => {
        const a = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 0.6;
        const sp = 3 + Math.random() * 9;
        p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp;
      });
      burstT = performance.now();
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    },
  };
}
