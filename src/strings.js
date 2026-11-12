// Interactive "staff lines" behind the hero: five strings you can pluck with the pointer.
// Spring simulation per string; when music plays the strings breathe with it.

export function createStrings(canvas, { getWave = () => null, getLevel = () => 0 } = {}) {
  const ctx = canvas.getContext('2d');
  const N = 64; // points per string
  let w = 0, h = 0, dpr = 1, raf = 0, running = true, visible = true;
  let strings = [];
  const pointer = { x: -1, y: -1, px: -1, py: -1, has: false };

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mobile = w < 760;
    const gap = mobile ? 22 : Math.max(26, h * 0.045);
    const top = h * (mobile ? 0.62 : 0.58);
    strings = Array.from({ length: 5 }, (_, i) => ({
      y: top + i * gap,
      pos: new Float32Array(N),
      vel: new Float32Array(N),
      color: i === 2 ? 'rgba(181,38,47,.55)' : 'rgba(20,17,17,.16)',
      width: i === 2 ? 1.2 : 1,
    }));
  }

  function pluck(px, py, ppx, ppy) {
    for (const s of strings) {
      // crossed the string between frames?
      if ((ppy - s.y) * (py - s.y) <= 0 && ppy !== py) {
        const idx = Math.round((px / w) * (N - 1));
        const force = Math.max(-40, Math.min(40, (py - ppy) * 1.4));
        for (let k = -6; k <= 6; k++) {
          const j = idx + k;
          if (j > 0 && j < N - 1) s.vel[j] += force * (1 - Math.abs(k) / 7);
        }
      }
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible || !running) return;
    const t = now / 1000;
    const wave = getWave();
    const level = getLevel();
    ctx.clearRect(0, 0, w, h);
    strings.forEach((s, si) => {
      const { pos, vel } = s;
      // wave equation-ish relaxation
      for (let i = 1; i < N - 1; i++) {
        const lap = pos[i - 1] + pos[i + 1] - 2 * pos[i];
        vel[i] += lap * 0.28 - pos[i] * 0.004;
        vel[i] *= 0.985;
      }
      for (let i = 1; i < N - 1; i++) pos[i] += vel[i];
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * w;
        let y = s.y + pos[i];
        y += Math.sin(t * 0.8 + i * 0.18 + si) * 1.2; // idle breathing
        if (wave) {
          const wi = Math.floor((i / N) * wave.length);
          y += ((wave[wi] - 128) / 128) * 26 * (0.4 + si * 0.15) * Math.sin((i / (N - 1)) * Math.PI);
        }
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    // a few "note" dots sitting on the staff
    const dots = [[0.18, 1, '#b5262f'], [0.43, 3, '#c39a4e'], [0.71, 0, '#7b2a6e'], [0.86, 4, '#141111']];
    dots.forEach(([fx, si, c]) => {
      const s = strings[si]; if (!s) return;
      const i = Math.round(fx * (N - 1));
      const y = s.y + s.pos[i] + Math.sin(t * 0.8 + i * 0.18 + si) * 1.2;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(fx * w, y, 4 + level * 5, 0, Math.PI * 2); ctx.fill();
    });
  }

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (pointer.has) pluck(x, y, pointer.x, pointer.y);
    pointer.x = x; pointer.y = y; pointer.has = true;
  };
  const onTouch = (e) => onMove(e.touches[0]);

  build();
  window.addEventListener('resize', build);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
  io.observe(canvas);
  raf = requestAnimationFrame(frame);

  return {
    setRunning(v) { running = v; if (!v) ctx.clearRect(0, 0, w, h); },
    strum() { strings.forEach((s, i) => setTimeout(() => { for (let j = 8; j < N - 8; j++) s.vel[j] += Math.sin((j / N) * Math.PI) * 9; }, i * 90)); },
  };
}
