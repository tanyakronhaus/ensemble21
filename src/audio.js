// Background music with a WebAudio analyser for the audio-reactive visuals.
export function createAudio(el) {
  let actx, analyser, gain, freq, wave, started = false, playing = false;
  const listeners = new Set();

  function setup() {
    if (actx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    const src = actx.createMediaElementSource(el);
    analyser = actx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.82;
    gain = actx.createGain();
    gain.gain.value = 0;
    src.connect(analyser).connect(gain).connect(actx.destination);
    freq = new Uint8Array(analyser.frequencyBinCount);
    wave = new Uint8Array(analyser.fftSize);
  }

  function fade(to, dur = 1.6) {
    if (!gain) { el.volume = to; return; }
    const now = actx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(to, now + dur);
  }

  const emit = () => listeners.forEach((fn) => fn(playing));

  return {
    async play() {
      try {
        setup();
        if (actx && actx.state === 'suspended') await actx.resume();
        if (!started) { el.currentTime = 0; started = true; }
        el.preload = 'auto';
        await el.play();
        fade(0.85, 2.4);
        playing = true; emit();
      } catch (e) { playing = false; emit(); }
    },
    pause() {
      fade(0, 0.6);
      playing = false; emit();
      setTimeout(() => { if (!playing) el.pause(); }, 650);
    },
    toggle() { return playing ? this.pause() : this.play(); },
    get playing() { return playing; },
    level() {
      if (!analyser || !playing) return 0;
      analyser.getByteFrequencyData(freq);
      let sum = 0;
      for (let i = 2; i < 60; i++) sum += freq[i];
      return Math.min(1, sum / (58 * 255) * 1.6);
    },
    bands(n = 4) {
      if (!analyser || !playing) return null;
      analyser.getByteFrequencyData(freq);
      const out = [];
      const per = Math.floor(80 / n);
      for (let b = 0; b < n; b++) {
        let s = 0; for (let i = b * per + 1; i < (b + 1) * per + 1; i++) s += freq[i];
        out.push(s / (per * 255));
      }
      return out;
    },
    wave() {
      if (!analyser || !playing) return null;
      analyser.getByteTimeDomainData(wave);
      return wave;
    },
    onChange(fn) { listeners.add(fn); },
  };
}
