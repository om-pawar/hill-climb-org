/**
 * Hill Climb Rush - Cinematic Splash & Loading Engine
 * Features animated video-grade 3D logo presentation, dynamic neon particle canvas,
 * progress bar ticker with racing tech diagnostics, and seamless transition to Login Screen.
 */

(function () {
  'use strict';

  class LoadingIntroManager {
    constructor() {
      this.screen = document.getElementById('loading-screen');
      this.canvas = document.getElementById('loading-particles-canvas');
      this.barFill = document.getElementById('loading-bar-fill');
      this.percentText = document.getElementById('loading-percent');
      this.subText = document.getElementById('loading-subtext');

      this.progress = 0;
      this.targetProgress = 100;
      this.isFinished = false;
      this.particles = [];
      this.ctx = null;
      this.animFrameId = null;

      this.statusMessages = [
        { at: 0, text: 'INITIALIZING 2D RACING PHYSICS...' },
        { at: 22, text: 'TUNING SUSPENSION & TURBO NITRO...' },
        { at: 48, text: 'PREPARING MOUNTAIN PEAKS & HAZARDS...' },
        { at: 75, text: 'CALIBRATING ANDROID MOBILE RESOLUTION...' },
        { at: 92, text: 'STARTING HIGH-OCTANE ENGINES...' },
        { at: 100, text: 'WELCOME RACER! READY TO CLIMB' }
      ];

      this.init();
    }

    init() {
      if (!this.screen) return;

      // Make sure loading screen is active on launch
      this.screen.classList.add('active');

      // Initialize particles canvas
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initParticles();
        this.startParticleLoop();
      }

      // Fast-forward on user tap/click anywhere on loading screen
      this.screen.addEventListener('click', () => {
        if (!this.isFinished) {
          this.progress = Math.max(this.progress, 90);
        }
      });
      this.screen.addEventListener('touchend', () => {
        if (!this.isFinished) {
          this.progress = Math.max(this.progress, 90);
        }
      });

      // Start progress simulation
      this.startProgressTicker();
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }

    initParticles() {
      const count = Math.min(50, Math.floor(window.innerWidth / 18));
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * (this.canvas ? this.canvas.width : 800),
          y: Math.random() * (this.canvas ? this.canvas.height : 450),
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2.5 + 0.8), // rising embers
          radius: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.7 + 0.3,
          color: Math.random() > 0.4 ? '#ff6b00' : (Math.random() > 0.5 ? '#00e5ff' : '#ffd000')
        });
      }
    }

    startParticleLoop() {
      const render = () => {
        if (this.isFinished || !this.ctx || !this.canvas) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        // Update & draw particles
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.003;

          // Recycle
          if (p.y < -10 || p.alpha <= 0) {
            p.x = Math.random() * w;
            p.y = h + Math.random() * 20;
            p.vy = -(Math.random() * 2.5 + 0.8);
            p.alpha = Math.random() * 0.8 + 0.2;
          }

          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, p.alpha);
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = p.color;
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }

        this.animFrameId = requestAnimationFrame(render);
      };

      this.animFrameId = requestAnimationFrame(render);
    }

    startProgressTicker() {
      const startTime = performance.now();
      const targetDuration = 2400; // ~2.4 seconds for cinematic impact

      const tick = (now) => {
        if (this.isFinished) return;

        const elapsed = now - startTime;
        let p = (elapsed / targetDuration) * 100;

        // Add subtle physics acceleration
        if (p < 30) {
          p = p * 0.9;
        } else if (p > 70 && p < 95) {
          p = 70 + (p - 70) * 1.2;
        }

        this.progress = Math.min(100, Math.max(this.progress, p));
        this.updateUI(Math.floor(this.progress));

        if (this.progress >= 100) {
          this.onComplete();
        } else {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    }

    updateUI(pct) {
      if (this.barFill) {
        this.barFill.style.width = `${pct}%`;
      }
      if (this.percentText) {
        this.percentText.textContent = `${pct}%`;
      }

      // Find matching status message
      if (this.subText) {
        let msg = this.statusMessages[0].text;
        for (let i = 0; i < this.statusMessages.length; i++) {
          if (pct >= this.statusMessages[i].at) {
            msg = this.statusMessages[i].text;
          }
        }
        this.subText.textContent = msg;
      }
    }

    onComplete() {
      if (this.isFinished) return;
      this.isFinished = true;

      if (this.subText) {
        this.subText.textContent = 'READY! LOADING LOGIN...';
        this.subText.style.color = '#4ade80';
      }

      // Small delay for satisfying 100% completion pause
      setTimeout(() => {
        if (this.screen) {
          this.screen.classList.add('fade-out');
        }

        setTimeout(() => {
          if (this.screen) {
            this.screen.classList.remove('active');
            this.screen.classList.remove('fade-out');
            this.screen.style.display = 'none';
          }
          if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
          }

          // Show Login Screen as requested
          if (window.authManager && typeof window.authManager.showAuthScreen === 'function') {
            window.authManager.showAuthScreen();
          } else {
            const auth = document.getElementById('auth-screen');
            if (auth) auth.classList.add('active');
          }
        }, 550);
      }, 400);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.loadingManager = new LoadingIntroManager();
  });
})();
