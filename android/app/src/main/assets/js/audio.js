/**
 * Audio Engine for Hill Climb Rush
 * Procedural Web Audio API sound synthesis (100% offline, zero external MP3 assets)
 * Soft Hill Climb Countryside Background Music (BGM) & Thrilling Nitro Rocket Boost SFX
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;

    // Engine synth nodes
    this.engineOsc = null;
    this.engineSubOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.isEngineRunning = false;

    // Rocket Boost synth nodes
    this.boostNoise = null;
    this.boostOsc = null;
    this.boostGain = null;
    this.isBoosting = false;

    // Procedural BGM Engine
    this.bgmTimer = null;
    this.bgmGain = null;
    this.isBgmPlaying = false;
    this.bgmStep = 0;
    this.bgmTempo = 130; // Upbeat, iconic Hill Climb bluegrass country racing tempo

    // Music volume (0.0 to 1.0)
    const savedVol = localStorage.getItem('hill_climb_music_volume');
    this.musicVolume = savedVol !== null ? Math.max(0, Math.min(1, parseFloat(savedVol) / 100)) : 0.7;

    this.initAudioContext();
    this.bindUnlockEvents();
  }

  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !this.ctx) {
      this.ctx = new AudioContextClass();
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  bindUnlockEvents() {
    const unlock = () => {
      this.ensureContext();
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('touchend', unlock);
      document.removeEventListener('mousedown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('touchstart', unlock, { passive: true, once: true });
    document.addEventListener('touchend', unlock, { passive: true, once: true });
    document.addEventListener('mousedown', unlock, { passive: true, once: true });
    document.addEventListener('keydown', unlock, { passive: true, once: true });
  }

  // ==========================================
  // 1. PROCEDURAL BACKGROUND MUSIC (BGM)
  // Iconic Hill Climb Racing country bluegrass soundtrack (In-Race Only)
  // ==========================================
  startBGM() {
    if (!this.musicEnabled || this.isBgmPlaying) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      this.isBgmPlaying = true;
      this.bgmStep = 0;

      const baseGain = (this.musicVolume !== undefined ? this.musicVolume : 0.7) * 0.22;
      if (!this.bgmGain) {
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(baseGain, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);
      } else {
        this.bgmGain.gain.setTargetAtTime(baseGain, this.ctx.currentTime, 0.08);
      }

      this.scheduleBgmLoop();
    } catch (e) {
      console.warn('BGM start error:', e);
    }
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
      } catch (e) {}
    }
  }

  scheduleBgmLoop() {
    if (!this.isBgmPlaying || !this.musicEnabled || !this.ctx) return;

    // 32-step musical sequence (4/4 time, 8 bars total, 16th/8th shuffle)
    // Scale: C Major / G Major bouncy country ragtime
    const melodySeq = [
      // Bar 1 (C Major signature bounce)
      { note: 523.25, dur: 0.16, type: 'triangle' }, // C5
      { note: 659.25, dur: 0.14, type: 'triangle' }, // E5
      { note: 783.99, dur: 0.16, type: 'triangle' }, // G5
      { note: 880.00, dur: 0.14, type: 'triangle' }, // A5
      { note: 783.99, dur: 0.16, type: 'triangle' }, // G5
      { note: 659.25, dur: 0.14, type: 'triangle' }, // E5
      { note: 523.25, dur: 0.18, type: 'triangle' }, // C5
      { note: 659.25, dur: 0.14, type: 'triangle' }, // E5
      // Bar 2 (F Major walk)
      { note: 587.33, dur: 0.16, type: 'triangle' }, // D5
      { note: 659.25, dur: 0.14, type: 'triangle' }, // E5
      { note: 698.46, dur: 0.16, type: 'triangle' }, // F5
      { note: 880.00, dur: 0.14, type: 'triangle' }, // A5
      { note: 783.99, dur: 0.16, type: 'triangle' }, // G5
      { note: 698.46, dur: 0.14, type: 'triangle' }, // F5
      { note: 587.33, dur: 0.18, type: 'triangle' }, // D5
      { note: 493.88, dur: 0.14, type: 'triangle' }, // B4
      // Bar 3 (High cheerful arc to C6)
      { note: 523.25, dur: 0.16, type: 'triangle' }, // C5
      { note: 659.25, dur: 0.14, type: 'triangle' }, // E5
      { note: 783.99, dur: 0.16, type: 'triangle' }, // G5
      { note: 1046.50, dur: 0.22, type: 'triangle' },// C6 peak!
      { note: 987.77, dur: 0.14, type: 'triangle' }, // B5
      { note: 880.00, dur: 0.14, type: 'triangle' }, // A5
      { note: 783.99, dur: 0.16, type: 'triangle' }, // G5
      { note: 659.25, dur: 0.14, type: 'triangle' }, // E5
      // Bar 4 (Turnaround cadence)
      { note: 587.33, dur: 0.14, type: 'triangle' }, // D5
      { note: 698.46, dur: 0.14, type: 'triangle' }, // F5
      { note: 659.25, dur: 0.14, type: 'triangle' }, // E5
      { note: 587.33, dur: 0.14, type: 'triangle' }, // D5
      { note: 523.25, dur: 0.24, type: 'triangle' }, // C5
      { note: null, dur: 0.1 },                      // Rest
      { note: 392.00, dur: 0.14, type: 'triangle' }, // G4
      { note: 493.88, dur: 0.16, type: 'triangle' }  // B4
    ];

    // Slap Bass alternating root-fifth groove
    const bassSeq = [
      // Bars 1-2 (C - F)
      130.81, 130.81, 98.00, 130.81, 130.81, 130.81, 98.00, 130.81, // C3 / G2
      87.31, 174.61, 87.31, 174.61, 130.81, 130.81, 98.00, 130.81,  // F2 / C3
      // Bars 3-4 (G - C)
      98.00, 196.00, 98.00, 196.00, 73.42, 146.83, 98.00, 196.00,   // G2 / D2
      130.81, 130.81, 98.00, 130.81, 130.81, 98.00, 65.41, 130.81   // C3 / C2
    ];

    // Acoustic Guitar / Banjo offbeat chops on beats 2 & 4
    const chords = [
      [261.63, 329.63, 392.00], // C maj
      [261.63, 329.63, 392.00],
      [261.63, 349.23, 440.00], // F maj
      [261.63, 349.23, 440.00],
      [246.94, 293.66, 392.00], // G maj
      [246.94, 293.66, 392.00],
      [261.63, 329.63, 392.00], // C maj
      [261.63, 329.63, 392.00]
    ];

    const stepTime = (60 / this.bgmTempo) * 0.5; // ~0.230s step
    const idx = this.bgmStep % 32;
    const now = this.ctx.currentTime;

    // 1. Play Lead Melody
    const m = melodySeq[idx];
    if (m && m.note) {
      this.playSynthNote(m.note, m.dur, m.type || 'triangle', 0.15, now);
    }

    // 2. Play Bouncy Bass
    const bNote = bassSeq[idx % 32];
    if (bNote) {
      this.playBassNote(bNote, 0.16, now);
    }

    // 3. Play Crisp Offbeat Banjo/Guitar Chops
    if (idx % 2 === 1) {
      const chordIdx = Math.floor((idx % 16) / 2);
      const chord = chords[chordIdx];
      if (chord) {
        this.playChordStab(chord, 0.12, now);
      }
    }

    // 4. Percussion Woodblock & Hi-hat shuffle
    this.playSoftPercussion(idx, now);

    this.bgmStep++;

    // Schedule next step
    this.bgmTimer = setTimeout(() => {
      this.scheduleBgmLoop();
    }, stepTime * 1000);
  }

  playSynthNote(freq, dur, type = 'sine', vol = 0.12, startTime) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, startTime);
      filter.Q.setValueAtTime(1.5, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.05);
    } catch (e) {}
  }

  playBassNote(freq, dur, startTime) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.05);
    } catch (e) {}
  }

  playChordStab(notes, dur, startTime) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.045, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.04);
      });
    } catch (e) {}
  }

  playSoftPercussion(stepIdx, startTime) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      // Soft brush / shaker noise
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(stepIdx % 4 === 2 ? 3800 : 6200, startTime);
      filter.Q.setValueAtTime(3.0, startTime);

      const gain = this.ctx.createGain();
      const vol = stepIdx % 4 === 2 ? 0.06 : 0.035; // Snare brush accent on beats 2 and 4
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noise.start(startTime);
      noise.stop(startTime + 0.05);
    } catch (e) {}
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      } catch (e) {}
    }
  }

  pauseBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  resumeBGM() {
    if (this.musicEnabled && !this.isBgmPlaying) {
      this.startBGM();
    }
  }

  // ==========================================
  // 2. NITRO ROCKET BOOST SOUND EFFECT
  // Powerful thruster roar + high frequency jet stream
  // ==========================================
  startBoost() {
    if (!this.sfxEnabled || this.isBoosting || !this.ctx) return;
    this.ensureContext();

    try {
      const now = this.ctx.currentTime;

      // Rocket whoosh noise
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.boostNoise = this.ctx.createBufferSource();
      this.boostNoise.buffer = buffer;
      this.boostNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.linearRampToValueAtTime(1400, now + 0.3);
      noiseFilter.Q.setValueAtTime(2.0, now);

      // Rocket sub-oscillator for raw thruster power
      this.boostOsc = this.ctx.createOscillator();
      this.boostOsc.type = 'sawtooth';
      this.boostOsc.frequency.setValueAtTime(95, now);
      this.boostOsc.frequency.linearRampToValueAtTime(160, now + 0.4);

      const oscFilter = this.ctx.createBiquadFilter();
      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(320, now);

      this.boostGain = this.ctx.createGain();
      this.boostGain.gain.setValueAtTime(0.01, now);
      this.boostGain.gain.linearRampToValueAtTime(0.25, now + 0.08);

      this.boostNoise.connect(noiseFilter);
      noiseFilter.connect(this.boostGain);

      this.boostOsc.connect(oscFilter);
      oscFilter.connect(this.boostGain);

      this.boostGain.connect(this.ctx.destination);

      this.boostNoise.start(now);
      this.boostOsc.start(now);
      this.isBoosting = true;
    } catch (e) {
      console.warn('Boost sound start failed:', e);
    }
  }

  stopBoost() {
    if (!this.isBoosting) return;
    try {
      const now = this.ctx ? this.ctx.currentTime : 0;
      if (this.boostGain && this.ctx) {
        this.boostGain.gain.setTargetAtTime(0.001, now, 0.06);
      }
      setTimeout(() => {
        if (this.boostNoise) {
          try { this.boostNoise.stop(); this.boostNoise.disconnect(); } catch (e) {}
          this.boostNoise = null;
        }
        if (this.boostOsc) {
          try { this.boostOsc.stop(); this.boostOsc.disconnect(); } catch (e) {}
          this.boostOsc = null;
        }
        this.isBoosting = false;
      }, 70);
    } catch (e) {
      this.isBoosting = false;
    }
  }

  // ==========================================
  // 3. ENGINE SOUND & VEHICLE AUDIO
  // ==========================================
  startEngine() {
    if (!this.sfxEnabled || this.isEngineRunning || !this.ctx) return;
    this.ensureContext();

    try {
      const now = this.ctx.currentTime;

      // Engine oscillator 1: Sawtooth for rich engine purr
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(55, now); // Idle rumble (~55Hz)

      // Sub oscillator 2: Triangle for deep chassis vibration
      this.engineSubOsc = this.ctx.createOscillator();
      this.engineSubOsc.type = 'triangle';
      this.engineSubOsc.frequency.setValueAtTime(27.5, now);

      // Filter: Low-pass to shape harsh high frequencies
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(320, now);
      this.engineFilter.Q.setValueAtTime(3, now);

      // Engine gain
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.08, now);

      // Connect
      this.engineOsc.connect(this.engineFilter);
      this.engineSubOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start(now);
      this.engineSubOsc.start(now);
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Audio engine start failed:', e);
    }
  }

  stopEngine() {
    if (!this.isEngineRunning) return;
    try {
      const now = this.ctx ? this.ctx.currentTime : 0;
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setTargetAtTime(0, now, 0.05);
      }
      setTimeout(() => {
        if (this.engineOsc) {
          try { this.engineOsc.stop(); this.engineOsc.disconnect(); } catch (e) {}
          this.engineOsc = null;
        }
        if (this.engineSubOsc) {
          try { this.engineSubOsc.stop(); this.engineSubOsc.disconnect(); } catch (e) {}
          this.engineSubOsc = null;
        }
        this.isEngineRunning = false;
      }, 80);
    } catch (e) {
      this.isEngineRunning = false;
    }
  }

  updateEngine(speed, throttle, maxSpeed = 30) {
    if (!this.isEngineRunning || !this.engineOsc || !this.ctx) return;

    const normSpeed = Math.min(Math.abs(speed) / maxSpeed, 1.2);
    const targetFreq = 50 + (normSpeed * 110) + (throttle ? 70 : 0);
    const targetFilter = 280 + (normSpeed * 600) + (throttle ? 400 : 0);
    const targetGain = this.sfxEnabled ? (0.05 + (normSpeed * 0.08) + (throttle ? 0.07 : 0)) : 0;

    const now = this.ctx.currentTime;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.06);
    if (this.engineSubOsc) {
      this.engineSubOsc.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.06);
    }
    if (this.engineFilter) {
      this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.06);
    }
    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(targetGain, now, 0.06);
    }
  }

  playCoin() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playGem() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 sparkle
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.4);
      });
    } catch (e) {}
  }

  playFuelRefill() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  playFuelLow() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(750, now);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  playCrash() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);

      // Noise burst for crunch
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 triumph
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch (e) {}
  }

  playNeckSnap() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      // High-frequency crisp bone fracture snap
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1450, now);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      gain1.gain.setValueAtTime(0.75, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.07);

      // Second fracture pop slightly delayed (dual-crack crunch)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(820, now + 0.018);
      osc2.frequency.exponentialRampToValueAtTime(160, now + 0.08);

      gain2.gain.setValueAtTime(0.6, now + 0.018);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.018);
      osc2.stop(now + 0.1);

      // Noise crunch burst
      const bufSize = Math.floor(this.ctx.sampleRate * 0.14);
      const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const bq = this.ctx.createBiquadFilter();
      bq.type = 'bandpass';
      bq.frequency.setValueAtTime(1900, now);
      bq.Q.setValueAtTime(2.0, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.55, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(bq);
      bq.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  playDriverOof() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime + 0.03;
      // Synthesize deep vocal throat grunt ("Oof!")
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.24);

      // Formant filter for vocal tract
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(460, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.24);
      filter.Q.setValueAtTime(3.4, now);

      gain.gain.setValueAtTime(0.48, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.27);
    } catch (e) {}
  }

  playRoofScrape() {
    if (!this.sfxEnabled) return;
    const now = performance.now();
    if (this._lastRoofScrape && now - this._lastRoofScrape < 110) return;
    this._lastRoofScrape = now;
    this.ensureContext();
    try {
      const audioNow = this.ctx.currentTime;
      const bufSize = Math.floor(this.ctx.sampleRate * 0.09);
      const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const bq = this.ctx.createBiquadFilter();
      bq.type = 'bandpass';
      bq.frequency.setValueAtTime(2600, audioNow);
      bq.Q.setValueAtTime(2.2, audioNow);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, audioNow);
      gain.gain.exponentialRampToValueAtTime(0.001, audioNow + 0.08);

      noise.connect(bq);
      bq.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(audioNow);
    } catch (e) {}
  }

  playLandingThud() {
    if (!this.sfxEnabled) return;
    const now = performance.now();
    if (this._lastLandingThud && now - this._lastLandingThud < 220) return;
    this._lastLandingThud = now;
    this.ensureContext();
    try {
      const audioNow = this.ctx.currentTime;
      // Soft low-frequency suspension impact thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, audioNow);
      osc.frequency.exponentialRampToValueAtTime(32, audioNow + 0.14);

      gain.gain.setValueAtTime(0.24, audioNow);
      gain.gain.exponentialRampToValueAtTime(0.001, audioNow + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(audioNow);
      osc.stop(audioNow + 0.18);
    } catch (e) {}
  }

  setSfxEnabled(val) {
    this.sfxEnabled = val;
    if (!val) {
      this.stopEngine();
      this.stopBoost();
    }
  }

  setMusicEnabled(val) {
    this.musicEnabled = val;
    if (!val) {
      this.stopBGM();
    } else if (this.isEngineRunning) {
      this.startBGM();
    }
  }

  setMusicVolume(vol) {
    // vol is 0 to 100
    this.musicVolume = Math.max(0, Math.min(1, parseFloat(vol) / 100));
    try {
      localStorage.setItem('hill_climb_music_volume', vol);
    } catch (e) {}

    if (this.bgmGain && this.ctx) {
      const targetGain = this.musicEnabled ? this.musicVolume * 0.22 : 0;
      try {
        this.bgmGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
      } catch (e) {}
    }
  }
}

// Global audio singleton
const soundEngine = new SoundEngine();
