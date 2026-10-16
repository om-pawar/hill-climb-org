/**
 * Game Loop, Visual Rendering, Entities, and Camera Management
 * Multi-Vehicle Rendering & 3rd Person Character
 * Reconstructed Dynamic Architectural Suspension Bridges across all maps
 */

function safeRoundRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    // Robust arcTo fallback for older WebViews / browsers
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }
}

// 25 Distinct Starting Gates for every stage (Countryside, Desert, Arctic, Moon, Mars, Volcano)
const STAGE_START_POINTS = {
  countryside: [
    { x: 220, name: 'Meadow Start Gate', dist: 0 },
    { x: 480, name: 'Clover Ridge', dist: 73 },
    { x: 920, name: 'Windmill Meadow', dist: 196 },
    { x: 1260, name: 'Brook Crossing', dist: 291 },
    { x: 1800, name: 'Hayfield Crest', dist: 442 },
    { x: 2150, name: 'Orchard Rise', dist: 540 },
    { x: 2650, name: 'Greenway Overlook', dist: 680 },
    { x: 3120, name: 'Valley Brook', dist: 812 },
    { x: 3680, name: 'Pine Summit', dist: 969 },
    { x: 4240, name: 'Highland Meadow', dist: 1125 },
    { x: 4720, name: 'Sunny Knoll', dist: 1260 },
    { x: 5280, name: 'Timber Ridge', dist: 1417 },
    { x: 5820, name: 'Stonebridge Hill', dist: 1568 },
    { x: 6380, name: 'Falcon Ridge', dist: 1725 },
    { x: 6920, name: 'High Pasture', dist: 1876 },
    { x: 7500, name: 'Golden Valley', dist: 2038 },
    { x: 8120, name: 'Alpine Knoll', dist: 2212 },
    { x: 8760, name: 'Forest Border', dist: 2391 },
    { x: 9380, name: 'Three-Kilo Pass', dist: 2565 },
    { x: 10050, name: 'Skyview Summit', dist: 2752 },
    { x: 10720, name: 'Eagles Nest', dist: 2940 },
    { x: 11420, name: 'Wildflower Descent', dist: 3136 },
    { x: 12150, name: 'High Meadow Plateau', dist: 3340 },
    { x: 12900, name: 'Horizon Ridge', dist: 3550 },
    { x: 13750, name: 'Endless Highlands', dist: 3788 }
  ],
  desert: [
    { x: 220, name: 'Dune Basin Start', dist: 0 },
    { x: 540, name: 'Sandy Crest', dist: 90 },
    { x: 960, name: 'Oasis Approach', dist: 207 },
    { x: 1320, name: 'Sahara Ridge', dist: 308 },
    { x: 1740, name: 'Golden Dune Peak', dist: 426 },
    { x: 2280, name: 'Dust Devil Valley', dist: 577 },
    { x: 2700, name: 'Mirage Plateau', dist: 694 },
    { x: 3180, name: 'Sunken Sands', dist: 829 },
    { x: 3720, name: 'Sandstorm Ridge', dist: 980 },
    { x: 4280, name: 'Canyon Approach', dist: 1137 },
    { x: 4760, name: 'Red Rock Crest', dist: 1271 },
    { x: 5320, name: 'Scorpion Valley', dist: 1428 },
    { x: 5860, name: 'High Dune Summit', dist: 1579 },
    { x: 6420, name: 'Sunbaked Plateau', dist: 1736 },
    { x: 6980, name: 'Desert Highway', dist: 1893 },
    { x: 7540, name: 'Endless Dunes', dist: 2050 },
    { x: 8160, name: 'Cactus Ridge', dist: 2223 },
    { x: 8800, name: 'Mirage Basin', dist: 2402 },
    { x: 9420, name: 'Fossil Valley', dist: 2576 },
    { x: 10100, name: 'Solar Ridge', dist: 2766 },
    { x: 10760, name: 'Dune Sea Summit', dist: 2951 },
    { x: 11460, name: 'Dry Canyon Run', dist: 3147 },
    { x: 12180, name: 'Red Mesa Plateau', dist: 3349 },
    { x: 12940, name: 'Dune Overlook', dist: 3562 },
    { x: 13780, name: 'Infinite Sahara', dist: 3797 }
  ],
  arctic: [
    { x: 220, name: 'Glacier Base Start', dist: 0 },
    { x: 520, name: 'Frost Knoll', dist: 84 },
    { x: 940, name: 'Frozen Pond Pass', dist: 202 },
    { x: 1300, name: 'Snowdrift Ridge', dist: 302 },
    { x: 1820, name: 'Icefall Lookout', dist: 448 },
    { x: 2180, name: 'Blizzard Basin', dist: 549 },
    { x: 2680, name: 'Tundra Plateau', dist: 689 },
    { x: 3150, name: 'Glacial Dip', dist: 820 },
    { x: 3700, name: 'Boreal Peak', dist: 974 },
    { x: 4260, name: 'Frozen Ridge', dist: 1131 },
    { x: 4740, name: 'Avalanche Path', dist: 1266 },
    { x: 5300, name: 'Pack Ice Crossing', dist: 1422 },
    { x: 5840, name: 'Whiteout Summit', dist: 1574 },
    { x: 6400, name: 'Polar Overlook', dist: 1730 },
    { x: 6950, name: 'Ice Sheet Valley', dist: 1884 },
    { x: 7520, name: 'Permafrost Rise', dist: 2044 },
    { x: 8140, name: 'Glacial Horn', dist: 2218 },
    { x: 8780, name: 'Arctic Circle Run', dist: 2397 },
    { x: 9400, name: 'Snowcap Peak', dist: 2570 },
    { x: 10080, name: 'Frostbite Ridge', dist: 2761 },
    { x: 10740, name: 'Summit Glacier', dist: 2946 },
    { x: 11440, name: 'Northern Lights Pass', dist: 3142 },
    { x: 12160, name: 'Polar Highway', dist: 3343 },
    { x: 12920, name: 'Endless Ice Fields', dist: 3556 },
    { x: 13760, name: 'Crown of the World', dist: 3791 }
  ],
  moon: [
    { x: 220, name: 'Apollo Lander Start', dist: 0 },
    { x: 550, name: 'Sea of Tranquility', dist: 92 },
    { x: 970, name: 'Low-G Crater Edge', dist: 210 },
    { x: 1340, name: 'Lunar Dune Crest', dist: 314 },
    { x: 1760, name: 'Tycho Ridge', dist: 431 },
    { x: 2220, name: 'Basalt Basin', dist: 560 },
    { x: 2780, name: 'Earthrise Plateau', dist: 717 },
    { x: 3200, name: 'Impact Crater Rim', dist: 834 },
    { x: 3740, name: 'Regolith Valley', dist: 986 },
    { x: 4300, name: 'Armstrong Peak', dist: 1142 },
    { x: 4780, name: 'Orbital Lookout', dist: 1277 },
    { x: 5340, name: 'Dark Side Basin', dist: 1434 },
    { x: 5880, name: 'Lunar Foothills', dist: 1585 },
    { x: 6440, name: 'Solar Wind Ridge', dist: 1742 },
    { x: 7000, name: 'Zero-G Approach', dist: 1898 },
    { x: 7560, name: 'Copernicus Crater', dist: 2055 },
    { x: 8180, name: 'Deep Space Pass', dist: 2229 },
    { x: 8820, name: 'Apollo Track Run', dist: 2408 },
    { x: 9440, name: 'Far Side Summit', dist: 2582 },
    { x: 10120, name: 'Stardust Plateau', dist: 2772 },
    { x: 10780, name: 'Crater Chain Peak', dist: 2957 },
    { x: 11480, name: 'Lunar Crest', dist: 3153 },
    { x: 12200, name: 'Moonbase Trail', dist: 3354 },
    { x: 12960, name: 'Endless Grey Sea', dist: 3567 },
    { x: 13800, name: 'Cosmic Frontier', dist: 3802 }
  ],
  mars: [
    { x: 220, name: 'Rover Landing Start', dist: 0 },
    { x: 530, name: 'Red Dust Knoll', dist: 87 },
    { x: 950, name: 'Rust Valley', dist: 204 },
    { x: 1310, name: 'Olympus Foothills', dist: 305 },
    { x: 1730, name: 'Cydonia Ridge', dist: 423 },
    { x: 2280, name: 'Valles Marineris Approach', dist: 577 },
    { x: 2690, name: 'Martian Plateau', dist: 692 },
    { x: 3160, name: 'Iron Sand Basin', dist: 823 },
    { x: 3710, name: 'Crater Gale Edge', dist: 977 },
    { x: 4270, name: 'Acidalia Crest', dist: 1134 },
    { x: 4750, name: 'Red Planet Overlook', dist: 1268 },
    { x: 5310, name: 'Solar Array Valley', dist: 1425 },
    { x: 5850, name: 'Curiosity Trail', dist: 1576 },
    { x: 6410, name: 'Martian Canyon Rim', dist: 1733 },
    { x: 6960, name: 'Perseverance Ridge', dist: 1887 },
    { x: 7530, name: 'Red Rock Ledge', dist: 2047 },
    { x: 8150, name: 'Tharsis Bulge', dist: 2220 },
    { x: 8790, name: 'Dust Storm Highway', dist: 2400 },
    { x: 9410, name: 'Alien Butte', dist: 2573 },
    { x: 10090, name: 'Elysium Summit', dist: 2764 },
    { x: 10750, name: 'Martian Highlands', dist: 2948 },
    { x: 11450, name: 'Olympus Slopes', dist: 3144 },
    { x: 12170, name: 'Hellas Basin View', dist: 3346 },
    { x: 12930, name: 'Red Horizon Edge', dist: 3559 },
    { x: 13770, name: 'Olympus Mons Peak', dist: 3794 }
  ],
  volcano: [
    { x: 220, name: 'Magma Caldera Start', dist: 0 },
    { x: 540, name: 'Obsidian Knoll', dist: 90 },
    { x: 960, name: 'Sulfur Valley', dist: 207 },
    { x: 1320, name: 'Lava River Edge', dist: 308 },
    { x: 1840, name: 'Basalt Ridge', dist: 454 },
    { x: 2200, name: 'Ash Cloud Approach', dist: 554 },
    { x: 2700, name: 'Inferno Plateau', dist: 694 },
    { x: 3180, name: 'Smoldering Dip', dist: 829 },
    { x: 3720, name: 'Magma Crest', dist: 980 },
    { x: 4280, name: 'Volcanic Cone', dist: 1137 },
    { x: 4760, name: 'Pumice Ridge', dist: 1271 },
    { x: 5320, name: 'Brimstone Basin', dist: 1428 },
    { x: 5860, name: 'Molten Peak', dist: 1579 },
    { x: 6420, name: 'Crater Rim Lookout', dist: 1736 },
    { x: 6980, name: 'Pyroclastic Trail', dist: 1893 },
    { x: 7540, name: 'Geyser Ridge', dist: 2050 },
    { x: 8160, name: 'Lava Lake Pass', dist: 2223 },
    { x: 8800, name: 'Obsidian Spine', dist: 2402 },
    { x: 9420, name: 'Ashfield Summit', dist: 2576 },
    { x: 10100, name: 'Dragon Throat Peak', dist: 2766 },
    { x: 10760, name: 'Cinder Summit', dist: 2951 },
    { x: 11460, name: 'Molten Cascades', dist: 3147 },
    { x: 12180, name: 'Volcano Highway', dist: 3349 },
    { x: 12940, name: 'Inferno Overlook', dist: 3562 },
    { x: 13780, name: 'Heart of the Volcano', dist: 3797 }
  ]
};

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.terrain = new TerrainGenerator();
    this.vehicle = new Vehicle({ engine: 1, suspension: 1, tires: 1, fourwd: 1 }, this.terrain, 'buggy');

    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;

    // Camera & Screen Shake
    this.camera = { x: 0, y: 0 };
    this.cameraShake = 0;

    // Crash sequence & Out state
    this.crashSequence = {
      active: false,
      timer: 0,
      maxDuration: 2.2,
      reason: 'DRIVER DOWN!'
    };
    this.fuelOutSequence = false;
    this.fuelOutTimer = 0;
    this.stagePlayCount = 0;

    // Input state
    this.input = {
      gas: false,
      brake: false,
      boost: false
    };

    // Game stats
    this.fuel = 100;
    this.coinsEarned = 0;
    this.stuntsEarned = 0;
    this.distance = 0;
    this.startCarX = 220;

    // Visual particles & pickups
    this.particles = [];
    this.pickups = [];
    this.nextSpawnX = 420;
    this.nextFuelX = 750; // Challenging fuel spacing
    this.backflipsCount = 0;
    this.topSpeedReached = 0;
    this.coinsThisRun = 0;
    this.hazardAlertCooldown = 0;

    // Atmospheric Birds & Space Entities
    this.birds = [];
    this.spaceShips = [];
    this.aliens = [];

    // UI elements cache
    this.initUI();
    this.bindControls();
    this.bindResizeEvents();
  }

  initUI() {
    this.uiDistance = document.getElementById('hud-distance');
    this.uiSpeed = document.getElementById('gauge-speed-val');
    this.uiSpeedDigital = document.getElementById('hud-speed-digital');
    this.uiCoins = document.getElementById('hud-coins');
    this.uiFuelBar = document.getElementById('hud-fuel-fill');
    this.uiSpeedNeedle = document.getElementById('gauge-speed-needle');
    this.uiRPMNeedle = document.getElementById('gauge-rpm-needle');
    this.uiRPMVal = document.getElementById('gauge-rpm-val');

    // Pause Modal
    this.screenPause = document.getElementById('pause-modal');
    this.pauseDistance = document.getElementById('pause-distance');
    this.pauseCoins = document.getElementById('pause-coins');
    this.btnResume = document.getElementById('btn-resume-game');
    this.btnRestart = document.getElementById('btn-restart-game');
    this.btnQuit = document.getElementById('btn-pause-to-garage');

    // Game Over Modal
    this.screenGameOver = document.getElementById('game-over-modal');
    this.gameoverReason = document.getElementById('game-over-reason');
    this.gameoverDist = document.getElementById('result-distance');
    this.gameoverCoins = document.getElementById('result-coins');
    this.gameoverStunts = document.getElementById('result-stunts');
    this.gameoverRecord = document.getElementById('result-best-record');

    // In-game Banners & Overlays
    this.hazardAlert = document.getElementById('hud-hazard-banner');
    this.hazardAlertText = document.getElementById('hud-hazard-text');
    this.crashBanner = document.getElementById('hud-crash-banner');
    this.crashBannerTitle = document.getElementById('crash-banner-title');
    this.crashBannerSub = document.getElementById('crash-banner-sub');
    this.crashVignette = document.getElementById('crash-vignette');
    this.startGateBanner = document.getElementById('hud-start-gate-banner');
    this.startGateName = document.getElementById('hud-start-gate-name');

    // Stunt Banner
    this.stuntBanner = document.getElementById('hud-stunt-banner');
    this.stuntTitle = this.stuntBanner ? this.stuntBanner.querySelector('.stunt-title') : null;
    this.stuntReward = this.stuntBanner ? this.stuntBanner.querySelector('.stunt-reward') : null;

    // Challenge Banner
    this.challengeBanner = document.getElementById('hud-challenge-banner');
    this.challengeText = document.getElementById('hud-challenge-text');
    this.challengeReward = document.getElementById('hud-challenge-reward');

    // Mobile touch pedals & Nitro Booster
    this.pedalGas = document.getElementById('btn-pedal-gas');
    this.pedalBrake = document.getElementById('btn-pedal-brake');
    this.pedalBoost = document.getElementById('btn-pedal-boost');
    this.btnPause = document.getElementById('btn-pause-game');
  }

  bindResizeEvents() {
    window.addEventListener('resize', () => {
      if (this.isRunning) {
        this.resizeCanvas();
      }
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (this.isRunning) this.resizeCanvas();
      }, 100);
    });
  }

  bindControls() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.input.gas = true;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.input.brake = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.input.boost = true;
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.input.gas = false;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.input.brake = false;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.input.boost = false;
      }
    });

    // High-responsiveness multi-touch & pointer handlers
    const bindTouch = (el, onDown, onUp) => {
      if (!el) return;
      const handleDown = (e) => {
        if (e.cancelable) e.preventDefault();
        soundEngine.ensureContext();
        onDown();
      };
      const handleUp = (e) => {
        if (e.cancelable) e.preventDefault();
        onUp();
      };

      el.addEventListener('pointerdown', handleDown, { passive: false });
      el.addEventListener('pointerup', handleUp, { passive: false });
      el.addEventListener('pointercancel', handleUp, { passive: false });
      el.addEventListener('touchstart', handleDown, { passive: false });
      el.addEventListener('touchend', handleUp, { passive: false });
      el.addEventListener('touchcancel', handleUp, { passive: false });
      el.addEventListener('mousedown', handleDown);
      el.addEventListener('mouseup', handleUp);
      el.addEventListener('mouseleave', handleUp);
    };

    bindTouch(
      this.pedalGas,
      () => { this.input.gas = true; if (this.pedalGas) this.pedalGas.classList.add('active'); },
      () => { this.input.gas = false; if (this.pedalGas) this.pedalGas.classList.remove('active'); }
    );

    bindTouch(
      this.pedalBrake,
      () => { this.input.brake = true; if (this.pedalBrake) this.pedalBrake.classList.add('active'); },
      () => { this.input.brake = false; if (this.pedalBrake) this.pedalBrake.classList.remove('active'); }
    );

    bindTouch(
      this.pedalBoost,
      () => { this.input.boost = true; if (this.pedalBoost) this.pedalBoost.classList.add('active'); },
      () => { this.input.boost = false; if (this.pedalBoost) this.pedalBoost.classList.remove('active'); }
    );

    // Pause / Resume / Quit / Restart
    if (this.btnPause) this.btnPause.addEventListener('click', () => this.togglePause());
    if (this.btnResume) this.btnResume.addEventListener('click', () => this.togglePause());
    if (this.btnRestart) this.btnRestart.addEventListener('click', () => this.restartGame());
    if (this.btnQuit) this.btnQuit.addEventListener('click', () => this.returnToGarage());

    // Game over buttons
    const btnRetry = document.getElementById('btn-gameover-retry');
    const btnGoGarage = document.getElementById('btn-gameover-garage');

    if (btnRetry) btnRetry.addEventListener('click', () => this.restartGame());
    if (btnGoGarage) btnGoGarage.addEventListener('click', () => this.returnToGarage());
  }

  start(stageName = 'countryside', upgrades = { engine: 1, suspension: 1, tires: 1, fourwd: 1 }, vehicleType = null) {
    if (!vehicleType && authManager.currentPlayer) {
      vehicleType = authManager.currentPlayer.selectedVehicle || 'buggy';
    }
    vehicleType = vehicleType || 'buggy';

    // Cycle through 25+ distinct starting points per stage
    this.stagePlayCount++;
    const stagePoints = STAGE_START_POINTS[stageName] || STAGE_START_POINTS.countryside;
    const selectedStart = stagePoints[(this.stagePlayCount - 1) % stagePoints.length];
    const startX = selectedStart.x;

    this.terrain.setStage(stageName);
    this.vehicle.reset(upgrades, startX, this.terrain, vehicleType);

    this.fuel = 100;
    this.coinsEarned = 0;
    this.stuntsEarned = 0;
    this.distance = 0;
    this.startCarX = startX;
    this.particles = [];
    this.pickups = [];
    this.nextSpawnX = startX + 200;
    this.nextFuelX = startX + 1800; // First petrol canister spaced challenging distance ahead (~500m)
    this.backflipsCount = 0;
    this.topSpeedReached = 0;
    this.coinsThisRun = 0;
    this.hazardAlertCooldown = 0;
    this.outOfFuelTimer = 0;
    this.fuelOutSequence = false;
    this.fuelOutTimer = 0;
    this.crashSequence = {
      active: false,
      timer: 0,
      maxDuration: 2.2,
      reason: 'DRIVER DOWN!'
    };
    this.cameraShake = 0;
    this.camera.x = startX;
    this.camera.y = this.vehicle.y - 20;

    this.input.gas = false;
    this.input.brake = false;
    this.input.boost = false;

    // Ensure canvas is accurately scaled for mobile / Android viewport
    this.resizeCanvas();

    // Birds in atmospheric stages, UFOs and Aliens in space stages
    this.birds = [];
    this.spaceShips = [];
    this.aliens = [];

    if (this.terrain.hasAtmosphere()) {
      for (let i = 0; i < 6; i++) {
        this.birds.push({
          x: this.vehicle.x + 100 + i * 220 + Math.random() * 60,
          y: 70 + Math.random() * 120,
          vx: 130 + Math.random() * 70,
          flapPhase: Math.random() * Math.PI * 2,
          size: 11 + Math.random() * 5
        });
      }
    } else {
      // Space stages: Flying UFOs
      for (let i = 0; i < 4; i++) {
        this.spaceShips.push({
          x: this.vehicle.x + 200 + i * 480,
          baseY: 90 + Math.random() * 80,
          vx: 90 + Math.random() * 60,
          beamPhase: Math.random() * Math.PI * 2,
          lightPhase: Math.random() * Math.PI * 2
        });
      }
      // Space Aliens on crater rocks
      for (let i = 0; i < 7; i++) {
        this.aliens.push({
          x: this.vehicle.x + 400 + i * 420 + Math.random() * 120,
          wavePhase: Math.random() * Math.PI * 2
        });
      }
    }

    // Pre-populate initial coins & fuel around start position
    for (let i = 0; i < 8; i++) {
      this.spawnPickups();
    }

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();

    this.hideModals();
    soundEngine.startEngine();
    soundEngine.startBGM();

    // Flash the starting gate checkpoint milestone
    this.triggerStartGateBanner(`START: ${selectedStart.name} (${selectedStart.dist}m)`);

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  restartGame() {
    soundEngine.stopBoost();
    this.hideModals();
    const stage = authManager.currentPlayer ? authManager.currentPlayer.selectedStage : 'countryside';
    const upgrades = authManager.currentPlayer ? authManager.currentPlayer.upgrades : { engine: 1, suspension: 1, tires: 1, fourwd: 1 };
    const veh = authManager.currentPlayer ? authManager.currentPlayer.selectedVehicle : 'buggy';
    this.start(stage, upgrades, veh);
  }

  returnToGarage() {
    this.isRunning = false;
    this.isPaused = false;
    soundEngine.stopEngine();
    soundEngine.stopBoost();
    soundEngine.stopBGM();
    this.hideModals();

    const gameScreen = document.getElementById('game-screen');
    const menuScreen = document.getElementById('menu-screen');
    if (gameScreen) gameScreen.classList.remove('active');
    if (menuScreen) menuScreen.classList.add('active');

    if (window.menuManager) {
      window.menuManager.refreshUI();
    }
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      if (this.pauseDistance) this.pauseDistance.textContent = `${this.distance} m`;
      if (this.pauseCoins) this.pauseCoins.textContent = `${this.coinsEarned + this.stuntsEarned} 🪙`;
      if (this.screenPause) this.screenPause.classList.add('active');
      soundEngine.stopEngine();
      soundEngine.stopBoost();
      soundEngine.pauseBGM();
    } else {
      if (this.screenPause) this.screenPause.classList.remove('active');
      soundEngine.startEngine();
      soundEngine.resumeBGM();
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  hideModals() {
    if (this.screenPause) this.screenPause.classList.remove('active');
    if (this.screenGameOver) this.screenGameOver.classList.remove('active');
    if (this.crashBanner) this.crashBanner.classList.remove('active');
    if (this.crashVignette) this.crashVignette.classList.remove('active');
  }

  triggerStartGateBanner(msg) {
    if (this.startGateBanner) {
      if (this.startGateName) this.startGateName.textContent = msg;
      this.startGateBanner.classList.add('active');
      setTimeout(() => {
        if (this.startGateBanner) this.startGateBanner.classList.remove('active');
      }, 2500);
    }
  }

  spawnPickups() {
    const x = this.nextSpawnX;

    // Challenging Fuel canister interval: 2500px to 3150px apart (~700m - 900m)
    if (x >= this.nextFuelX) {
      const y = this.terrain.getEffectiveHeight(x) - 44;
      this.pickups.push({
        type: 'fuel',
        x: x,
        y: y,
        radius: 20,
        collected: false
      });
      this.nextFuelX = x + 2500 + Math.random() * 650;
      this.nextSpawnX += 130;
      return;
    }

    // Gem pickup occasionally
    if (Math.random() < 0.12) {
      const y = this.terrain.getEffectiveHeight(x) - 34;
      this.pickups.push({
        type: 'gem',
        x: x,
        y: y,
        radius: 16,
        collected: false
      });
      this.nextSpawnX += 95;
      return;
    }

    // Coin arcs along the terrain
    const coinCount = 3 + Math.floor(Math.random() * 4);
    for (let c = 0; c < coinCount; c++) {
      const cx = x + c * 28;
      const cy = this.terrain.getEffectiveHeight(cx) - 32;
      this.pickups.push({
        type: 'coin',
        x: cx,
        y: cy,
        radius: 12,
        collected: false
      });
    }

    this.nextSpawnX += coinCount * 28 + (55 + Math.random() * 90);
  }

  triggerHazardAlert(msg) {
    if (this.hazardAlertCooldown > 0) return;
    this.hazardAlertCooldown = 3.5;
    if (this.hazardAlert) {
      if (this.hazardAlertText) {
        this.hazardAlertText.textContent = msg;
      }
      this.hazardAlert.classList.add('active');
      setTimeout(() => {
        this.hazardAlert.classList.remove('active');
      }, 2000);
    }
  }

  gameLoop(currentTime) {
    if (!this.isRunning || this.isPaused) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05); // Clamp dt to prevent tunneling
    this.lastTime = currentTime;

    try {
      this.updatePhysics(dt);
      this.updateCamera();
      this.render();
      this.updateHUD();
    } catch (err) {
      console.error("Game loop step error:", err);
    }

    // 1. Crash Sequence: Driver Down / Overturned
    if (this.vehicle.isDead) {
      if (!this.crashSequence.active) {
        this.startCrashSequence('DRIVER DOWN!');
      } else {
        this.crashSequence.timer += dt;
        const speed = Math.hypot(this.vehicle.vx, this.vehicle.vy);
        // Continue simulation for up to 2.2s OR if stopped after 1.2s of tumble
        if (this.crashSequence.timer >= this.crashSequence.maxDuration || (this.crashSequence.timer >= 1.2 && speed < 14)) {
          this.handleGameOver('DRIVER DOWN!');
          return;
        }
      }
      requestAnimationFrame((t) => this.gameLoop(t));
      return;
    }

    // 2. Out of Fuel Coasting Sequence
    if (this.fuel <= 0) {
      if (!this.fuelOutSequence) {
        this.startFuelOutSequence();
      } else {
        this.fuelOutTimer += dt;
        const speed = Math.abs(this.vehicle.vx);
        if (speed < 10 || this.fuelOutTimer > 3.2) {
          this.handleGameOver('OUT OF PETROL!');
          return;
        }
      }
      requestAnimationFrame((t) => this.gameLoop(t));
      return;
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  startCrashSequence(reasonText) {
    this.crashSequence.active = true;
    this.crashSequence.timer = 0;
    this.crashSequence.reason = reasonText;
    this.cameraShake = 24;

    // Cut engine loop
    soundEngine.stopEngine();
    soundEngine.stopBoost();

    // Trigger visual crash impact vignette
    if (this.crashVignette) {
      this.crashVignette.classList.add('active');
    }

    // Show big bold in-game DRIVER DOWN banner
    if (this.crashBanner) {
      if (this.crashBannerTitle) this.crashBannerTitle.textContent = reasonText;
      if (this.crashBannerSub) this.crashBannerSub.textContent = 'VEHICLE OVERTURNED';
      this.crashBanner.classList.add('active');
    }
  }

  startFuelOutSequence() {
    this.fuelOutSequence = true;
    this.fuelOutTimer = 0;
    soundEngine.stopEngine();
    soundEngine.stopBoost();

    if (this.crashBanner) {
      if (this.crashBannerTitle) this.crashBannerTitle.textContent = 'OUT OF PETROL!';
      if (this.crashBannerSub) this.crashBannerSub.textContent = 'COASTING TO A STOP';
      this.crashBanner.classList.add('active');
    }
  }

  updatePhysics(dt) {
    // 1. Vehicle Physics
    this.vehicle.update(dt, this.input, this.terrain);

    // Dynamic sparks & friction sound when roof scrapes along terrain upside down
    if (this.vehicle.roofScraping) {
      soundEngine.playRoofScrape();
      const sparkCount = Math.floor(2 + (this.vehicle.scrapeIntensity || 0.5) * 4);
      for (let s = 0; s < sparkCount; s++) {
        this.particles.push({
          x: this.vehicle.x + (Math.random() - 0.5) * (this.vehicle.width * 0.7),
          y: this.vehicle.y + (Math.random() - 0.5) * 14,
          vx: -this.vehicle.vx * 0.45 + (Math.random() - 0.5) * 140,
          vy: -Math.random() * 80 - 20,
          life: 0.18 + Math.random() * 0.22,
          maxLife: 0.4,
          size: 2.2 + Math.random() * 2.8,
          color: Math.random() < 0.65 ? '#f97316' : '#facc15'
        });
      }
    }

    // Track Distance
    const currentDist = Math.max(0, Math.floor((this.vehicle.x - this.startCarX) * 0.28));
    if (currentDist > this.distance) {
      this.distance = currentDist;
    }

    // Speed Tracking
    const kmh = this.vehicle.getSpeedKmh();
    if (kmh > this.topSpeedReached) {
      this.topSpeedReached = kmh;
    }

    // Check Challenges
    if (this.distance >= 500) authManager.completeChallenge('dist500');
    if (this.backflipsCount >= 2) authManager.completeChallenge('flips2');
    if (this.topSpeedReached >= 75) authManager.completeChallenge('speed75');
    if (this.coinsThisRun >= 25) authManager.completeChallenge('coins25');
    if (this.terrain.isBridge(this.vehicle.x)) authManager.completeChallenge('bridge1');

    // Check Invisible Reverse Wall Collision Alert
    if (this.vehicle.atReverseWall) {
      this.triggerHazardAlert('REVERSE LIMIT (200m) - BLOCKED BY WALL!');
      if (Math.random() < 0.45) {
        const wallX = this.vehicle.reverseOriginX - this.vehicle.reverseLimitPx;
        this.particles.push({
          x: wallX,
          y: this.vehicle.y + (Math.random() - 0.5) * 30,
          vx: 30 + Math.random() * 80,
          vy: (Math.random() - 0.5) * 60,
          life: 0.3 + Math.random() * 0.25,
          maxLife: 0.55,
          size: 2.5 + Math.random() * 3,
          color: Math.random() < 0.5 ? '#22d3ee' : '#ffffff'
        });
      }
    }

    // 2. Fuel Consumption, Nitro Booster & Coasting
    const engineLvl = this.vehicle.upgrades.engine || 1;
    const baseDrain = 0.95;
    const gasDrain = (this.input.gas && this.fuel > 0) ? (2.5 + engineLvl * 0.1) : 0;
    
    // Nitro Boost Fuel Drain: exactly 10% total fuel consumed per second of active boost
    const isBoosting = this.input.boost && this.fuel > 0;
    const boostDrain = isBoosting ? 10.0 : 0; // Consumes 10% fuel / sec

    this.fuel = Math.max(0, this.fuel - (baseDrain + gasDrain + boostDrain) * dt);

    if (this.fuel <= 0) {
      this.outOfFuelTimer += dt;
      // Vehicle has run out of fuel: cut throttle power & boost
      this.input.gas = false;
      this.input.boost = false;
      soundEngine.stopBoost();
    } else if (this.fuel < 20) {
      soundEngine.playFuelLow();
    }

    // 3. Audio Modulation & Rocket Boost Sound
    const isGas = this.input.gas && this.fuel > 0;
    soundEngine.updateEngine(kmh, isGas);

    if (isBoosting) {
      soundEngine.startBoost();
    } else {
      soundEngine.stopBoost();
    }

    // 4. Exhaust Particles, Dirt & Nitro Flame Trails
    if (this.vehicle.rearWheel.grounded && isGas && !isBoosting) {
      this.particles.push({
        x: this.vehicle.rearWheel.x - 12,
        y: this.vehicle.rearWheel.y + 4,
        vx: -120 - Math.random() * 80,
        vy: -40 - Math.random() * 60,
        life: 0.35,
        maxLife: 0.35,
        size: 4 + Math.random() * 5,
        color: this.terrain.stage === 'arctic' ? '#e2e8f0' : (this.terrain.stage === 'volcano' ? '#ea580c' : '#78350f')
      });
    }

    // Intense Rocket Booster Flames
    if (isBoosting) {
      const cos = Math.cos(this.vehicle.angle);
      const sin = Math.sin(this.vehicle.angle);
      const tailX = this.vehicle.x - this.vehicle.wheelBaseHalf * cos;
      const tailY = this.vehicle.y - this.vehicle.wheelBaseHalf * sin;

      for (let k = 0; k < 3; k++) {
        const flameSpeed = 340 + Math.random() * 200;
        this.particles.push({
          x: tailX - cos * 12 + (Math.random() * 6 - 3),
          y: tailY - sin * 12 + (Math.random() * 6 - 3),
          vx: -cos * flameSpeed + (Math.random() * 50 - 25),
          vy: -sin * flameSpeed + (Math.random() * 50 - 25),
          life: 0.26,
          maxLife: 0.26,
          size: 6 + Math.random() * 7,
          color: k === 0 ? '#00e5ff' : (k === 1 ? '#ff6b00' : '#ffd000')
        });
      }
    }

    // 5. Pickups Generation & Collection
    if (this.vehicle.x + 1200 > this.nextSpawnX) {
      this.spawnPickups();
    }

    const collRadius = Math.max(52, (this.vehicle.width || 100) * 0.45);
    this.pickups.forEach((p) => {
      if (p.collected) return;
      const dx = this.vehicle.x - p.x;
      const dy = this.vehicle.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < p.radius + collRadius) {
        p.collected = true;
        if (p.type === 'coin') {
          this.coinsEarned += 25;
          this.coinsThisRun++;
          authManager.addCoins(25);
          soundEngine.playCoin();
        } else if (p.type === 'gem') {
          authManager.currentPlayer.gems += 2;
          authManager.saveData(authManager.currentPlayer);
          authManager.updateHUD();
          soundEngine.playGem();
        } else if (p.type === 'fuel') {
          this.fuel = Math.min(100, this.fuel + 65);
          this.outOfFuelTimer = 0;
          soundEngine.playFuelRefill();

          // Celebratory green/emerald fuel spray particles
          for (let k = 0; k < 14; k++) {
            this.particles.push({
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 200,
              vy: -70 - Math.random() * 160,
              life: 0.5 + Math.random() * 0.4,
              maxLife: 0.9,
              size: 4 + Math.random() * 5,
              color: k % 2 === 0 ? '#22c55e' : '#4ade80'
            });
          }
        }
      }
    });

    // Clean old pickups behind camera
    this.pickups = this.pickups.filter((p) => !p.collected && p.x > this.vehicle.x - 900);

    // 6. Update Visual Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 7. Update Birds / Space Ships / Aliens
    if (this.terrain.hasAtmosphere()) {
      this.birds.forEach((b) => {
        b.x += b.vx * dt;
        b.flapPhase += dt * 14;
        if (b.x > this.vehicle.x + 1200) {
          b.x = this.vehicle.x - 400 - Math.random() * 200;
          b.y = 60 + Math.random() * 140;
        }
      });
    } else {
      this.spaceShips.forEach((s) => {
        s.x += s.vx * dt;
        s.beamPhase += dt * 3;
        s.lightPhase += dt * 6;
        if (s.x > this.vehicle.x + 1400) {
          s.x = this.vehicle.x - 500 - Math.random() * 300;
        }
      });
      this.aliens.forEach((a) => {
        a.wavePhase += dt * 4;
        if (a.x < this.vehicle.x - 800) {
          a.x = this.vehicle.x + 1200 + Math.random() * 400;
        }
      });
    }

    if (this.hazardAlertCooldown > 0) {
      this.hazardAlertCooldown -= dt;
    }
  }

  triggerStunt(name, reward) {
    soundEngine.playFanfare();
    if (name.includes('BACKFLIP')) this.backflipsCount++;
    this.stuntsEarned += reward;
    authManager.addCoins(reward);

    if (this.stuntBanner) {
      this.stuntTitle.textContent = name;
      this.stuntReward.textContent = `+${reward} COINS`;
      this.stuntBanner.classList.add('active');
      setTimeout(() => {
        this.stuntBanner.classList.remove('active');
      }, 1600);
    }
  }

  handleGameOver(reasonOverride = null) {
    this.isRunning = false;
    soundEngine.stopEngine();
    soundEngine.stopBoost();
    soundEngine.stopBGM();

    if (this.crashBanner) this.crashBanner.classList.remove('active');
    if (this.crashVignette) this.crashVignette.classList.remove('active');

    const isFlipped = this.vehicle.isDead;
    const reasonText = reasonOverride || (isFlipped ? 'DRIVER INJURY - DRIVER FLIPPED!' : 'OUT OF PETROL!');
    if (this.gameoverReason) this.gameoverReason.textContent = reasonText;
    if (this.gameoverDist) this.gameoverDist.textContent = `${this.distance} m`;
    if (this.gameoverCoins) this.gameoverCoins.textContent = `+${this.coinsEarned} 🪙`;
    if (this.gameoverStunts) this.gameoverStunts.textContent = `+${this.stuntsEarned} 🪙`;

    // Update records
    const stage = this.terrain.stage;
    const isNewRecord = authManager.updateRecord(stage, this.distance);
    const bestRecord = (authManager.currentPlayer && authManager.currentPlayer.records && authManager.currentPlayer.records[stage]) || this.distance;
    if (this.gameoverRecord) this.gameoverRecord.textContent = `${bestRecord} m`;

    if (isNewRecord && this.gameoverReason) {
      this.gameoverReason.textContent += ' (NEW RECORD!)';
    }

    if (this.screenGameOver) {
      this.screenGameOver.classList.add('active');
    }
  }

  updateCamera() {
    const vx = this.vehicle.vx;
    const vy = this.vehicle.vy;

    if (this.vehicle.isDead) {
      // Authentic Hill Climb Racing Crash Tracking:
      // Smoothly focus directly on the wrecked vehicle and knocked-out driver
      const targetX = this.vehicle.x;
      const targetY = this.vehicle.y - 12;
      this.camera.x += (targetX - this.camera.x) * 0.24;
      this.camera.y += (targetY - this.camera.y) * 0.24;
    } else {
      // Horizontal look-ahead: leads camera ahead so player sees upcoming hills
      const leadX = Math.min(260, Math.max(-60, vx * 0.38));
      const targetX = this.vehicle.x + leadX;

      // Vertical look-ahead:
      // When plunging downward off a steep hill (vy > 0), lead camera DOWNWARD so vehicle stays perfectly in view!
      // When near or on a bridge, elevate camera slightly so the gorge abyss below the bridge is in panoramic view!
      const isNearBridge = this.terrain.isBridge(this.vehicle.x) || this.terrain.isBridge(this.vehicle.x + 180) || this.terrain.isBridge(this.vehicle.x - 180);
      const leadY = Math.min(180, Math.max(-130, vy * 0.36));
      const bridgeLift = isNearBridge ? -45 : -20;
      const targetY = this.vehicle.y + leadY + bridgeLift;

      // Fast, responsive vertical tracking:
      // When descending fast, track immediately without sluggish lag
      const trackSpeedY = vy > 60 ? 0.32 : (isNearBridge ? 0.22 : 0.20);
      const trackSpeedX = 0.20;

      this.camera.x += (targetX - this.camera.x) * trackSpeedX;
      this.camera.y += (targetY - this.camera.y) * trackSpeedY;
    }

    // HARD SCREEN BOUNDARY CLAMPING:
    // Guarantees vehicle NEVER drops below bottom of screen during steepest downhill descents!
    const h = this.displayHeight || 400;
    const screenAnchorY = h * 0.54;
    const currentScreenY = screenAnchorY + (this.vehicle.y - this.camera.y);

    // If vehicle is dropping below 70% of screen height, immediately pull camera down!
    if (currentScreenY > h * 0.70) {
      this.camera.y = this.vehicle.y - (h * 0.70 - screenAnchorY);
    }
    // If vehicle launches high above 24% of screen height, immediately pull camera up!
    if (currentScreenY < h * 0.24) {
      this.camera.y = this.vehicle.y - (h * 0.24 - screenAnchorY);
    }

    // Impact / crash camera shake
    if (this.cameraShake > 0.15) {
      const shakeX = (Math.random() - 0.5) * this.cameraShake;
      const shakeY = (Math.random() - 0.5) * this.cameraShake;
      this.camera.x += shakeX;
      this.camera.y += shakeY;
      this.cameraShake *= 0.88;
    }
  }

  updateHUD() {
    if (this.uiDistance) this.uiDistance.textContent = `${this.distance} m`;
    const kmh = this.vehicle.getSpeedKmh();
    if (this.uiSpeed) this.uiSpeed.textContent = `${kmh}`;
    if (this.uiSpeedDigital) this.uiSpeedDigital.textContent = `${kmh}`;
    if (this.uiCoins) this.uiCoins.textContent = `${this.coinsEarned + this.stuntsEarned}`;

    // Fuel bar width
    if (this.uiFuelBar) {
      this.uiFuelBar.style.width = `${Math.max(0, Math.min(100, this.fuel))}%`;
      if (this.fuel < 20) {
        this.uiFuelBar.classList.add('low');
        this.uiFuelBar.classList.add('critical');
      } else {
        this.uiFuelBar.classList.remove('low');
        this.uiFuelBar.classList.remove('critical');
      }
    }

    // Speedometer needle (-120deg to +120deg)
    if (this.uiSpeedNeedle) {
      const speedRatio = Math.min(1.0, kmh / 120);
      const angle = -120 + speedRatio * 240;
      this.uiSpeedNeedle.style.transform = `rotate(${angle}deg)`;
    }

    // RPM needle & RPM digital val
    const rpm = this.vehicle.getRPM(this.input.gas && this.fuel > 0);
    if (this.uiRPMNeedle) {
      const rpmRatio = Math.min(1.0, rpm / 90);
      const angle = -120 + rpmRatio * 240;
      this.uiRPMNeedle.style.transform = `rotate(${angle}deg)`;
    }
    if (this.uiRPMVal) {
      this.uiRPMVal.textContent = `${Math.floor(rpm * 80)}`;
    }

    // In-air tilt balance pedal indicator hints:
    // Tilts right -> suggest BREAK to stabilize; Tilts left -> suggest FORWARD to balance
    const inAir = !this.vehicle.rearWheel.grounded && !this.vehicle.frontWheel.grounded;
    if (inAir) {
      if (this.vehicle.angle > 0.22) {
        if (this.pedalBrake) this.pedalBrake.classList.add('suggest');
        if (this.pedalGas) this.pedalGas.classList.remove('suggest');
      } else if (this.vehicle.angle < -0.22) {
        if (this.pedalGas) this.pedalGas.classList.add('suggest');
        if (this.pedalBrake) this.pedalBrake.classList.remove('suggest');
      } else {
        if (this.pedalBrake) this.pedalBrake.classList.remove('suggest');
        if (this.pedalGas) this.pedalGas.classList.remove('suggest');
      }
    } else {
      if (this.pedalBrake) this.pedalBrake.classList.remove('suggest');
      if (this.pedalGas) this.pedalGas.classList.remove('suggest');
    }
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;
  }

  render() {
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;

    ctx.clearRect(0, 0, w, h);

    // 1. Background Layers
    this.renderBackground(w, h);

    // Apply Camera Transform (Centered at 54% height for perfect downhill visibility)
    ctx.save();
    ctx.translate(w * 0.30 - this.camera.x, h * 0.54 - this.camera.y);

    // 2. Atmospheric Birds or Space Entities
    if (this.terrain.hasAtmosphere()) {
      this.renderBirds();
    } else {
      this.renderSpaceEntities();
    }

    // 3. Render Main Terrain (gorge chasms carved out beneath bridges)
    this.renderTerrain();

    // 4. Render Reconstructed Architectural Bridges (Towers, cables, road deck planks)
    try {
      this.renderBridges();
    } catch (e) {
      console.error('Error rendering bridges:', e);
    }

    // 5. Render Pickups (Coins, Gems, Petrol Beacons)
    try {
      this.renderPickups();
    } catch (e) {
      console.error('Error rendering pickups:', e);
    }

    // 6. Render Particles
    try {
      this.renderParticles();
    } catch (e) {
      console.error('Error rendering particles:', e);
    }

    // 7. Render Invisible Barrier Wall (blocks reversing past 200m)
    try {
      this.renderInvisibleWall();
    } catch (e) {
      console.error('Error rendering invisible wall:', e);
    }

    // 8. Render Multi-Vehicle with 3rd Person Character
    try {
      this.renderVehicle();
    } catch (e) {
      console.error('Error rendering vehicle:', e);
    }

    ctx.restore();
  }

  renderBirds() {
    const ctx = this.ctx;
    ctx.save();
    for (let b of this.birds) {
      ctx.save();
      ctx.translate(b.x, b.y);
      const flap = Math.sin(b.flapPhase);
      const wingY = flap * (b.size * 0.7);

      ctx.fillStyle = this.terrain.stage === 'volcano' ? '#fed7aa' : '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-b.size, wingY);
      ctx.quadraticCurveTo(-b.size * 0.4, -b.size * 0.3, 0, 0);
      ctx.quadraticCurveTo(b.size * 0.4, -b.size * 0.3, b.size, wingY);
      ctx.quadraticCurveTo(b.size * 0.2, 2, 0, 3);
      ctx.quadraticCurveTo(-b.size * 0.2, 2, -b.size, wingY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  renderSpaceEntities() {
    const ctx = this.ctx;
    const time = performance.now() * 0.001;

    // 1. Cruising UFO Flying Saucers with Tractor Beams
    for (let ship of this.spaceShips) {
      ctx.save();
      const hoverY = ship.baseY + Math.sin(time * 3 + ship.x * 0.01) * 14;
      ctx.translate(ship.x, hoverY);

      // Glowing Tractor Beam
      const beamAlpha = 0.16 + Math.sin(time * 4 + ship.beamPhase) * 0.08;
      ctx.fillStyle = `rgba(6, 182, 212, ${beamAlpha})`;
      ctx.beginPath();
      ctx.moveTo(-12, 8);
      ctx.lineTo(12, 8);
      ctx.lineTo(46, 320);
      ctx.lineTo(-46, 320);
      ctx.closePath();
      ctx.fill();

      // Saucer Outer Rim
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(0, 4, 34, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Saucer Glass Cockpit Dome
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.beginPath();
      ctx.arc(0, -2, 14, Math.PI, 0);
      ctx.fill();

      // Pulsing Lights on Saucer Rim
      for (let i = -3; i <= 3; i++) {
        const lx = i * 8;
        const ly = 5 + Math.abs(i) * 0.5;
        const glowPulse = Math.sin(time * 8 + i);
        ctx.fillStyle = glowPulse > 0 ? '#38bdf8' : '#e0e7ff';
        ctx.beginPath();
        ctx.arc(lx, ly, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Little Alien Pilot inside Dome
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. Space Aliens perched on crater rocks
    for (let alien of this.aliens) {
      const gy = this.terrain.getEffectiveHeight(alien.x);
      ctx.save();
      ctx.translate(alien.x, gy - 20);

      // Alien Body
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(0, 4, 9, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Big Alien Head
      ctx.beginPath();
      ctx.ellipse(0, -8, 12, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#4ade80';
      ctx.fill();

      // Antennae with glowing orbs
      const antWiggle = Math.sin(alien.wavePhase) * 3;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -16);
      ctx.quadraticCurveTo(-10 + antWiggle, -24, -12 + antWiggle, -28);
      ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(-12 + antWiggle, -28, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(5, -16);
      ctx.quadraticCurveTo(10 - antWiggle, -24, 12 - antWiggle, -28);
      ctx.stroke();
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(12 - antWiggle, -28, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Big Black Shiny Eyes
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.ellipse(-4, -8, 3, 5, -0.3, 0, Math.PI * 2);
      ctx.ellipse(4, -8, 3, 5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3.5, -9.5, 1.2, 0, Math.PI * 2);
      ctx.arc(4.5, -9.5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Waving Arm
      const armAngle = -0.5 + Math.sin(alien.wavePhase) * 0.7;
      ctx.save();
      ctx.translate(8, 0);
      ctx.rotate(armAngle);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(8, -10);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }
  }

  /**
   * RECONSTRUCTED ARCHITECTURAL SUSPENSION BRIDGES ACROSS ALL MAPS
   * Includes deep gorge chasms, high entrance/exit anchor towers, arched main suspension cables,
   * vertical dropper suspenders, articulated road deck planks, and dynamic weight sag!
   */
  renderBridges() {
    const ctx = this.ctx;
    const stage = this.terrain.stage;
    const bridges = this.terrain.getBridges();
    const viewStart = this.camera.x - this.displayWidth * 0.7;
    const viewEnd = this.camera.x + this.displayWidth * 0.9;

    for (let i = 0; i < bridges.length; i++) {
      const bridge = bridges[i];
      const startX = bridge.startX;
      const span = bridge.span;
      const endX = startX + span;
      if (endX < viewStart || startX > viewEnd) continue;

      const h1 = this.terrain.getStageBaseHeight(startX);
      const h2 = this.terrain.getStageBaseHeight(endX);
      const towerHeight = 92;
      const topY1 = h1 - towerHeight;
      const topY2 = h2 - towerHeight;

      // 1. Deep Themed Gorge Abyss below the bridge (100% road-curved, zero square outlines!)
      ctx.save();

      const midX = (startX + endX) * 0.5;
      const midH = (h1 + h2) * 0.5;
      const time = performance.now() * 0.0025;

      // Helper to trace a fluid/ice layer that conforms 100% to the curved road underneath the bridge
      const traceCurvedAbyssPath = (waveAmp = 3.5, waveFreq = 0.05, speed = 3.5, maxThick = 40) => {
        ctx.beginPath();
        // 1. Trace the upper fluid/ice surface conforming to the road curve
        for (let x = startX; x <= endX; x += 6) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(x);
          const wave = Math.sin(time * speed + x * waveFreq) * (waveAmp * depthT);
          const surfaceY = roadY - depthT * maxThick + wave;
          if (x === startX) ctx.moveTo(x, surfaceY);
          else ctx.lineTo(x, surfaceY);
        }
        // 2. Trace the bottom along the road floor bedrock
        for (let x = endX; x >= startX; x -= 6) {
          const roadY = this.terrain.getHeight(x);
          ctx.lineTo(x, roadY + 8);
        }
        ctx.closePath();
      };

      if (stage === 'volcano') {
        // --- VOLCANO: GLOWING BOILING MAGMA RIVER (100% CURVED TO ROAD, ZERO SQUARE OUTLINES) ---
        // 1. Curved molten ambient radiance hugging the canyon road (No square outline!)
        ctx.save();
        ctx.beginPath();
        for (let x = startX; x <= endX; x += 10) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const gy = this.terrain.getHeight(x) - depthT * 18;
          if (x === startX) ctx.moveTo(x, gy);
          else ctx.lineTo(x, gy);
        }
        ctx.strokeStyle = 'rgba(255, 69, 0, 0.40)';
        ctx.lineWidth = 44;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 28;
        ctx.stroke();
        ctx.restore();

        // 2. Molten lava basin fill conforming to road curves
        traceCurvedAbyssPath(3.5, 0.05, 3.8, 42);
        const magmaGrad = ctx.createLinearGradient(0, midH, 0, midH + 140);
        magmaGrad.addColorStop(0, '#fef08a'); // Hot yellow molten surface crest
        magmaGrad.addColorStop(0.25, '#f97316'); // Blazing incandescent orange
        magmaGrad.addColorStop(0.65, '#dc2626'); // Rich molten magma red
        magmaGrad.addColorStop(1, '#450a0a'); // Basalt magma trench
        ctx.fillStyle = magmaGrad;
        ctx.fill();

        // 3. Glowing Surface Foam / Heat Ripple Line along road curve
        ctx.beginPath();
        for (let x = startX + 4; x <= endX - 4; x += 6) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(x);
          const wave = Math.sin(time * 3.8 + x * 0.05) * (3.5 * depthT);
          const surfaceY = roadY - depthT * 42 + wave;
          if (x === startX + 4) ctx.moveTo(x, surfaceY);
          else ctx.lineTo(x, surfaceY);
        }
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 4. Boiling Molten Bubbles riding curved magma surface
        const numBubbles = Math.max(5, Math.floor(span / 48));
        for (let b = 0; b < numBubbles; b++) {
          const bx = startX + 28 + b * 46 + Math.sin(time * 2.5 + b * 2) * 14;
          if (bx < startX + 15 || bx > endX - 15) continue;
          const t = (bx - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(bx);
          const wave = Math.sin(time * 3.8 + bx * 0.05) * (3.5 * depthT);
          const by = roadY - depthT * 40 + wave + 4;
          const bRad = (4.0 + Math.sin(time * 4 + b) * 1.5) * Math.min(1.0, depthT * 1.4);
          if (bRad <= 0.6) continue;

          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(bx, by, bRad, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bx - bRad * 0.25, by - bRad * 0.25, bRad * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. Rising Fire Embers / Sparks
        for (let e = 0; e < 8; e++) {
          const ex = startX + 28 + e * 44 + Math.sin(time * 3 + e * 3) * 18;
          if (ex < startX + 10 || ex > endX - 10) continue;
          const t = (ex - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const baseGroundY = this.terrain.getHeight(ex) - depthT * 38;
          const ey = baseGroundY - ((time * 45 + e * 16) % 55);

          ctx.fillStyle = e % 2 === 0 ? '#facc15' : '#f97316';
          ctx.beginPath();
          ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (stage === 'arctic') {
        // --- ARCTIC: GLACIAL CREVASSE, ICE SPIKES & FROZEN LAKE (100% ROAD-CURVED, ZERO SQUARE OUTLINES) ---
        // 1. Curved cyan glacial ambient glow hugging the canyon road (No square outline!)
        ctx.save();
        ctx.beginPath();
        for (let x = startX; x <= endX; x += 10) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const gy = this.terrain.getHeight(x) - depthT * 18;
          if (x === startX) ctx.moveTo(x, gy);
          else ctx.lineTo(x, gy);
        }
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = 44;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 28;
        ctx.stroke();
        ctx.restore();

        // 2. Radiant Glacial Turquoise Ice Pool basin conforming to road curves
        traceCurvedAbyssPath(1.5, 0.04, 1.8, 38);
        const iceGrad = ctx.createLinearGradient(0, midH, 0, midH + 130);
        iceGrad.addColorStop(0, '#cffafe'); // Frost shimmer surface
        iceGrad.addColorStop(0.3, '#22d3ee'); // Vivid turquoise ice
        iceGrad.addColorStop(0.7, '#0284c7'); // Deep glacial blue
        iceGrad.addColorStop(1, '#0f172a'); // Abyssal bedrock
        ctx.fillStyle = iceGrad;
        ctx.fill();

        // 3. Shimmering Ice Surface Frost Line along road curve
        ctx.beginPath();
        for (let x = startX + 4; x <= endX - 4; x += 6) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(x);
          const wave = Math.sin(time * 1.8 + x * 0.04) * (1.5 * depthT);
          const surfaceY = roadY - depthT * 38 + wave;
          if (x === startX + 4) ctx.moveTo(x, surfaceY);
          else ctx.lineTo(x, surfaceY);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 4. Natural Crystalline Ice Peaks emerging from curved canyon road (NO square outline!)
        const spikeCount = Math.max(6, Math.floor(span / 42));
        for (let s = 0; s < spikeCount; s++) {
          const sx = startX + 24 + s * 38;
          if (sx > endX - 24) continue;
          const t = (sx - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          if (depthT < 0.15) continue; // Seamlessly blend into the abutments

          const baseGroundY = this.terrain.getHeight(sx);
          const spireH = (22 + (s % 4) * 9) * depthT;
          const halfW = (7 + (s % 3) * 2) * depthT;

          ctx.save();
          // Primary crystal body with translucent ice gradient
          const crystalGrad = ctx.createLinearGradient(sx, baseGroundY - spireH, sx, baseGroundY);
          crystalGrad.addColorStop(0, '#ffffff'); // Glinting peak tip
          crystalGrad.addColorStop(0.35, s % 2 === 0 ? 'rgba(56, 189, 248, 0.90)' : 'rgba(125, 211, 252, 0.92)');
          crystalGrad.addColorStop(1, 'rgba(2, 132, 199, 0.85)');

          ctx.beginPath();
          ctx.moveTo(sx - halfW, baseGroundY + 4);
          ctx.lineTo(sx, baseGroundY - spireH);
          ctx.lineTo(sx + halfW, baseGroundY + 4);
          ctx.closePath();
          ctx.fillStyle = crystalGrad;
          ctx.fill();

          // Soft crystalline facet highlight (no harsh geometric outline)
          ctx.beginPath();
          ctx.moveTo(sx, baseGroundY - spireH);
          ctx.lineTo(sx + halfW * 0.35, baseGroundY + 4);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.restore();
        }

        // 5. Hanging Stalactite Icicles directly beneath the bridge road deck
        for (let ic = startX + 18; ic <= endX - 18; ic += 24) {
          const by = this.terrain.getBridgeHeight(ic);
          const icH = 12 + (ic % 4) * 6;
          ctx.fillStyle = 'rgba(224, 242, 254, 0.95)';
          ctx.beginPath();
          ctx.moveTo(ic - 3.5, by + 8);
          ctx.lineTo(ic + 3.5, by + 8);
          ctx.lineTo(ic, by + 8 + icH);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      } else if (stage === 'countryside') {
        // --- COUNTRYSIDE: SPARKLING RIVER RAPIDS (100% ROAD-CURVED) ---
        traceCurvedAbyssPath(3.5, 0.05, 4.0, 36);
        const riverGrad = ctx.createLinearGradient(0, midH, 0, midH + 120);
        riverGrad.addColorStop(0, '#38bdf8'); // Sky reflection
        riverGrad.addColorStop(0.35, '#0284c7'); // Fresh stream blue
        riverGrad.addColorStop(0.8, '#0369a1'); // Deep riverbed
        riverGrad.addColorStop(1, '#075985');
        ctx.fillStyle = riverGrad;
        ctx.fill();

        // White Water Foaming Wave Crests along road curve
        ctx.beginPath();
        for (let x = startX + 4; x <= endX - 4; x += 6) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(x);
          const w = Math.sin(time * 4.0 + x * 0.05) * (3.5 * depthT);
          const y = roadY - depthT * 36 + w;
          if (x === startX + 4) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Riverbed Boulders resting on the curved road bed
        const boulderCount = Math.max(4, Math.floor(span / 55));
        for (let r = 0; r < boulderCount; r++) {
          const rx = startX + 32 + r * 54;
          if (rx > endX - 25) continue;
          const t = (rx - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          if (depthT < 0.2) continue;
          const ry = this.terrain.getHeight(rx) - depthT * 12;

          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(rx, ry, 12 * depthT, 7 * depthT, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Water splashing over boulder
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.ellipse(rx, ry - 3, 9 * depthT, 3 * depthT, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (stage === 'desert') {
        // --- DESERT: SWIRLING QUICKSAND CANYON (100% ROAD-CURVED) ---
        traceCurvedAbyssPath(2.2, 0.04, 2.5, 34);
        const sandGrad = ctx.createLinearGradient(0, midH, 0, midH + 120);
        sandGrad.addColorStop(0, '#fde047'); // Bright sand rim
        sandGrad.addColorStop(0.3, '#f59e0b'); // Golden quicksand
        sandGrad.addColorStop(0.7, '#d97706'); // Deep terracotta clay
        sandGrad.addColorStop(1, '#78350f'); // Canyon bottom
        ctx.fillStyle = sandGrad;
        ctx.fill();

        // Quicksand surface wave
        ctx.beginPath();
        for (let x = startX + 4; x <= endX - 4; x += 6) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(x);
          const w = Math.sin(time * 2.5 + x * 0.04) * (2.2 * depthT);
          const y = roadY - depthT * 34 + w;
          if (x === startX + 4) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Ancient Dinosaur Fossil Ribs rising from curved quicksand bed
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        const ribCount = Math.max(4, Math.floor(span / 52));
        for (let f = 0; f < ribCount; f++) {
          const fx = startX + 32 + f * 48;
          if (fx > endX - 25) continue;
          const t = (fx - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          if (depthT < 0.2) continue;
          const fy = this.terrain.getHeight(fx) - depthT * 10;

          ctx.beginPath();
          ctx.arc(fx, fy, 15 * depthT, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        }
      } else if (stage === 'mars') {
        // --- MARS: GLOWING RADIOACTIVE EMERALD ALIEN ACID RIVER (100% ROAD-CURVED) ---
        // Curved emerald ambient glow (No square outline!)
        ctx.save();
        ctx.beginPath();
        for (let x = startX; x <= endX; x += 10) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const gy = this.terrain.getHeight(x) - depthT * 16;
          if (x === startX) ctx.moveTo(x, gy);
          else ctx.lineTo(x, gy);
        }
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
        ctx.lineWidth = 42;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 28;
        ctx.stroke();
        ctx.restore();

        traceCurvedAbyssPath(3.0, 0.05, 3.2, 38);
        const acidGrad = ctx.createLinearGradient(0, midH, 0, midH + 120);
        acidGrad.addColorStop(0, '#86efac'); // Neon lime surface
        acidGrad.addColorStop(0.3, '#22c55e'); // Radioactive emerald
        acidGrad.addColorStop(0.7, '#15803d'); // Deep toxic sludge
        acidGrad.addColorStop(1, '#450a0a'); // Red rock basin
        ctx.fillStyle = acidGrad;
        ctx.fill();

        // Glowing toxic crest line along road curve
        ctx.beginPath();
        for (let x = startX + 4; x <= endX - 4; x += 6) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(x);
          const w = Math.sin(time * 3.2 + x * 0.05) * (3.0 * depthT);
          const y = roadY - depthT * 38 + w;
          if (x === startX + 4) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Glowing Emerald Alien Crystals rooted on curved road bed
        const cryCount = Math.max(4, Math.floor(span / 48));
        for (let c = 0; c < cryCount; c++) {
          const cx = startX + 28 + c * 45;
          if (cx > endX - 25) continue;
          const t = (cx - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          if (depthT < 0.2) continue;

          const baseGroundY = this.terrain.getHeight(cx);
          const cH = (20 + (c % 3) * 8) * depthT;
          const cW = (6 + (c % 2) * 2) * depthT;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cx - cW, baseGroundY + 4);
          ctx.lineTo(cx, baseGroundY - cH);
          ctx.lineTo(cx + cW, baseGroundY + 4);
          ctx.closePath();
          ctx.fillStyle = '#4ade80';
          ctx.fill();
          ctx.strokeStyle = '#bbf7d0';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }
      } else if (stage === 'moon') {
        // --- MOON: DEEP CELESTIAL NEBULA RIFT & CYAN LASER GRID (100% ROAD-CURVED) ---
        traceCurvedAbyssPath(1.8, 0.03, 1.2, 36);
        const moonGrad = ctx.createLinearGradient(0, midH, 0, midH + 120);
        moonGrad.addColorStop(0, 'rgba(6, 182, 212, 0.50)');
        moonGrad.addColorStop(0.4, 'rgba(88, 28, 135, 0.60)');
        moonGrad.addColorStop(1, '#020617');
        ctx.fillStyle = moonGrad;
        ctx.fill();

        // Pulsing Neon Laser Barrier Line following road curve
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        for (let x = startX + 6; x <= endX - 6; x += 8) {
          const t = (x - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          const roadY = this.terrain.getHeight(x);
          const y = roadY - depthT * 28;
          if (x === startX + 6) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Floating Zero-G Asteroid Rocks relative to curved canyon bed
        const astCount = Math.max(4, Math.floor(span / 52));
        for (let a = 0; a < astCount; a++) {
          const ax = startX + 28 + a * 48;
          if (ax > endX - 25) continue;
          const t = (ax - startX) / span;
          const depthT = Math.sin(t * Math.PI);
          if (depthT < 0.2) continue;
          const roadY = this.terrain.getHeight(ax);
          const ay = roadY - depthT * 32 + Math.cos(time * 2 + a) * 8;

          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(ax, ay, 5.0 * depthT, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
      ctx.restore();

      // 2. High Architectural Entrance & Exit Towers / Pylons
      const drawPylon = (px, py, isLeft) => {
        ctx.save();
        ctx.translate(px, py);

        if (stage === 'volcano') {
          // Dark obsidian basalt columns with glowing magma veins
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-10, -towerHeight, 20, towerHeight + 15);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.strokeRect(-10, -towerHeight, 20, towerHeight + 15);
          // Molten crack in tower
          ctx.beginPath();
          ctx.moveTo(-5, -towerHeight + 20);
          ctx.lineTo(2, -towerHeight + 45);
          ctx.lineTo(-4, -towerHeight + 70);
          ctx.strokeStyle = '#fdba74';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else if (stage === 'arctic') {
          // Frosted steel lattice truss tower
          ctx.fillStyle = '#475569';
          ctx.fillRect(-9, -towerHeight, 18, towerHeight + 15);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.strokeRect(-9, -towerHeight, 18, towerHeight + 15);
          // Snow Cap on Top
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, -towerHeight - 2, 14, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (stage === 'mars') {
          // Sci-Fi Titanium gantry tower with hazard chevrons
          ctx.fillStyle = '#334155';
          ctx.fillRect(-11, -towerHeight, 22, towerHeight + 15);
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-11, -towerHeight, 22, towerHeight + 15);
          // Amber Beacon on Top
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, -towerHeight - 6, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (stage === 'moon') {
          // Sleek white & carbon space elevator pylon with cyan laser conduit
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(-8, -towerHeight, 16, towerHeight + 15);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-8, -towerHeight, 16, towerHeight + 15);
          // Neon Cyan Core
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(-2, -towerHeight + 10, 4, towerHeight - 15);
        } else if (stage === 'desert') {
          // Carved sandstone obelisk pillar
          ctx.fillStyle = '#b45309';
          ctx.fillRect(-12, -towerHeight, 24, towerHeight + 15);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-12, -towerHeight, 24, towerHeight + 15);
          // Pyramid Cap
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(-12, -towerHeight);
          ctx.lineTo(0, -towerHeight - 14);
          ctx.lineTo(12, -towerHeight);
          ctx.closePath();
          ctx.fill();
        } else {
          // Countryside: Heavy timber log A-frame pylon with bolted steel braces
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(-11, -towerHeight, 22, towerHeight + 15);
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 3;
          ctx.strokeRect(-11, -towerHeight, 22, towerHeight + 15);
          // Cross-braces
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-11, -towerHeight + 15);
          ctx.lineTo(11, -towerHeight + 55);
          ctx.moveTo(11, -towerHeight + 15);
          ctx.lineTo(-11, -towerHeight + 55);
          ctx.stroke();
        }
        ctx.restore();
      };

      drawPylon(startX, h1, true);
      drawPylon(endX, h2, false);

      // 3. Arched Main Suspension Cable / Chain Curve
      const midY = (this.terrain.getBridgeHeight(midX)) - 28;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(startX, topY1 + 10);
      ctx.quadraticCurveTo(midX, midY + 15, endX, topY2 + 10);

      if (stage === 'volcano') {
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else if (stage === 'moon' || stage === 'mars') {
        const glowCol = stage === 'moon' ? '#06b6d4' : '#f97316';
        ctx.strokeStyle = glowCol;
        ctx.lineWidth = 4;
        ctx.shadowColor = glowCol;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = stage === 'arctic' ? '#e2e8f0' : '#475569';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      ctx.restore();

      // 4. Vertical Suspender Droppers & Articulated Deck Planks
      // Planks are rendered with the top surface flush at y=by (the exact tire contact height)
      const plankStep = 22;
      for (let x = startX + 10; x <= endX - 10; x += plankStep) {
        const by = this.terrain.getBridgeHeight(x);
        const t = (x - startX) / span;

        // Quadratic bezier cable height at this x
        const cableY = (1 - t) * (1 - t) * (topY1 + 10) + 2 * (1 - t) * t * (midY + 15) + t * t * (topY2 + 10);

        // Vertical Dropper Wire
        ctx.strokeStyle = (stage === 'volcano' ? '#f97316' : (stage === 'moon' ? '#22d3ee' : '#94a3b8'));
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, cableY);
        ctx.lineTo(x, by);
        ctx.stroke();

        // Articulated Deck Plank (y=0 is deck top, thickness extends down)
        ctx.save();
        ctx.translate(x, by);
        const slope = this.terrain.getSlope(x);
        ctx.rotate(Math.atan(slope));

        if (stage === 'volcano') {
          // Scorched heavy iron deck plate with magma seam
          ctx.fillStyle = '#27272a';
          ctx.fillRect(-11, 0, 22, 10);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-11, 0, 22, 10);
          ctx.fillStyle = '#fdba74';
          ctx.fillRect(-8, 3, 2, 2);
          ctx.fillRect(6, 3, 2, 2);
        } else if (stage === 'arctic') {
          // Diamond-mesh steel grate plank
          ctx.fillStyle = '#64748b';
          ctx.fillRect(-11, 0, 22, 9);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-11, 0, 22, 9);
        } else if (stage === 'mars') {
          // Titanium hexagon armor plate with amber LED border
          ctx.fillStyle = '#334155';
          ctx.fillRect(-11, 0, 22, 9);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-11, 0, 22, 9);
        } else if (stage === 'moon') {
          // Neon anti-gravity floating magnetic pad
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-11, 0, 22, 9);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.strokeRect(-11, 0, 22, 9);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(-4, 3, 8, 2);
        } else {
          // Countryside & Desert: Rustic oak timber planks
          ctx.fillStyle = stage === 'desert' ? '#b45309' : '#854d0e';
          ctx.fillRect(-11, 0, 22, 9);
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-11, 0, 22, 9);
          // Metal bolts
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(-7, 3, 2, 2);
          ctx.fillRect(5, 3, 2, 2);
        }

        // Safety Railing Post
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -18);
        ctx.stroke();

        ctx.restore();

        // Upper Handrail Wire connecting adjacent posts
        if (x + plankStep <= endX - 10) {
          const nextBy = this.terrain.getBridgeHeight(x + plankStep);
          ctx.strokeStyle = (stage === 'volcano' ? '#ea580c' : (stage === 'moon' ? '#06b6d4' : '#94a3b8'));
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, by - 18);
          ctx.lineTo(x + plankStep, nextBy - 18);
          ctx.stroke();
        }
      }
    }
  }

  renderBackground(w, h) {
    const ctx = this.ctx;
    const stage = this.terrain.stage;

    // Gradient Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (stage === 'desert') {
      skyGrad.addColorStop(0, '#f97316');
      skyGrad.addColorStop(0.5, '#fde047');
      skyGrad.addColorStop(1, '#fed7aa');
    } else if (stage === 'arctic') {
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.6, '#bae6fd');
      skyGrad.addColorStop(1, '#f0f9ff');
    } else if (stage === 'volcano') {
      skyGrad.addColorStop(0, '#18181b');
      skyGrad.addColorStop(0.45, '#7f1d1d');
      skyGrad.addColorStop(0.8, '#c2410c');
      skyGrad.addColorStop(1, '#451a03');
    } else if (stage === 'mars') {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.5, '#450a0a');
      skyGrad.addColorStop(0.85, '#991b1b');
      skyGrad.addColorStop(1, '#dc2626');
    } else if (stage === 'moon') {
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(0.65, '#0f172a');
      skyGrad.addColorStop(1, '#1e1b4b');
    } else {
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.55, '#38bdf8');
      skyGrad.addColorStop(1, '#bae6fd');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Celestial Bodies & Atmosphere
    if (stage === 'moon') {
      // Blue Planet Earth
      ctx.save();
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.22, 54, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 32;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(w * 0.76, h * 0.20, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (stage === 'mars') {
      // Ringed Giant Planet
      ctx.save();
      const px = w * 0.72;
      const py = h * 0.20;
      ctx.beginPath();
      ctx.ellipse(px, py, 72, 14, -0.3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.75)';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#ea580c';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    } else if (stage === 'volcano') {
      // Volcanic Ember specks
      const time = performance.now() * 0.001;
      ctx.fillStyle = 'rgba(254, 215, 170, 0.75)';
      for (let i = 0; i < 28; i++) {
        const ex = (Math.sin(i * 99 + time) * 0.5 + 0.5) * w;
        const ey = h - ((time * (35 + i * 4) + i * 28) % h);
        ctx.beginPath();
        ctx.arc(ex, ey, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Parallax Distant Mountains
    const p1 = this.camera.x * 0.12;
    ctx.save();
    ctx.fillStyle = stage === 'volcano' ? 'rgba(69, 10, 10, 0.7)' : (stage === 'mars' ? 'rgba(127, 29, 29, 0.5)' : (stage === 'moon' ? 'rgba(30, 27, 75, 0.7)' : 'rgba(15, 23, 42, 0.2)'));
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 40) {
      const peakY = h * 0.62 + Math.sin((x + p1) * 0.003) * 60 + Math.cos((x + p1) * 0.007) * 25;
      ctx.lineTo(x, peakY);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  renderTerrain() {
    const ctx = this.ctx;
    const startX = this.camera.x - this.displayWidth * 0.6;
    const endX = this.camera.x + this.displayWidth * 0.8;
    const step = 20;

    const stage = this.terrain.stage;
    let surfaceColor = '#15803d';
    let groundBaseColor = '#78350f';

    if (stage === 'desert') {
      surfaceColor = '#f59e0b';
      groundBaseColor = '#b45309';
    } else if (stage === 'arctic') {
      surfaceColor = '#f8fafc';
      groundBaseColor = '#64748b';
    } else if (stage === 'volcano') {
      surfaceColor = '#ff5722';
      groundBaseColor = '#18181b';
    } else if (stage === 'mars') {
      surfaceColor = '#ef4444';
      groundBaseColor = '#450a0a';
    } else if (stage === 'moon') {
      surfaceColor = '#94a3b8';
      groundBaseColor = '#334155';
    }

    // Ground fill
    const bottomY = Math.max(2500, this.camera.y + (this.displayHeight || 500) * 2);
    ctx.beginPath();
    ctx.moveTo(startX, bottomY);

    for (let x = startX; x <= endX; x += step) {
      const y = this.terrain.getHeight(x);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(endX, bottomY);
    ctx.closePath();

    ctx.fillStyle = groundBaseColor;
    ctx.fill();

    // Top surface line
    ctx.beginPath();
    for (let x = startX; x <= endX; x += step) {
      const y = this.terrain.getHeight(x);
      if (x === startX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = surfaceColor;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Top highlight rim
    ctx.beginPath();
    for (let x = startX; x <= endX; x += step) {
      const y = this.terrain.getHeight(x);
      if (x === startX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
  }

  renderPickups() {
    const ctx = this.ctx;
    const visibleStart = this.camera.x - 300;
    const visibleEnd = this.camera.x + 900;

    this.pickups.forEach((p) => {
      if (p.collected || p.x < visibleStart || p.x > visibleEnd) return;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 'coin') {
        // Gold Coin with edge rim & symbol
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 1);
      } else if (p.type === 'gem') {
        // Red Ruby Gem
        ctx.beginPath();
        ctx.moveTo(0, -p.radius);
        ctx.lineTo(p.radius, 0);
        ctx.lineTo(0, p.radius);
        ctx.lineTo(-p.radius, 0);
        ctx.closePath();
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#fb7185';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (p.type === 'fuel') {
        // Tall Beacon Ray Shooting into the Sky
        ctx.save();
        const beamGrad = ctx.createLinearGradient(0, 0, 0, -420);
        beamGrad.addColorStop(0, 'rgba(34, 197, 94, 0.55)');
        beamGrad.addColorStop(0.7, 'rgba(74, 222, 128, 0.25)');
        beamGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(-12, -420, 24, 420);
        ctx.restore();

        // Petrol Jerrycan
        ctx.beginPath();
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 18;
        safeRoundRect(ctx, -14, -20, 28, 38, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Jerrycan handle
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(-10, -26, 20, 6);

        // White 'GAS' text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAS', 0, -2);
      }

      ctx.restore();
    });
  }

  renderParticles() {
    const ctx = this.ctx;
    this.particles.forEach((pt) => {
      const progress = pt.maxLife > 0 ? pt.life / pt.maxLife : 0;
      const radius = Math.max(0.1, pt.size * Math.max(0, progress));
      if (!isFinite(radius) || !isFinite(pt.x) || !isFinite(pt.y)) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = pt.color || '#f59e0b';
      ctx.globalAlpha = Math.max(0, Math.min(1, progress));
      ctx.fill();
      ctx.restore();
    });
  }

  /**
   * RENDER INVISIBLE BARRIER WALL
   * Enforces 200m reverse limit: shimmers into view as vehicle nears/contacts it
   */
  renderInvisibleWall() {
    const ctx = this.ctx;
    const v = this.vehicle;
    if (!v.reverseOriginX || !v.reverseLimitPx) return;

    const wallX = v.reverseOriginX - v.reverseLimitPx;
    const visibleStart = this.camera.x - this.displayWidth * 0.6;
    const visibleEnd = this.camera.x + this.displayWidth * 0.8;

    if (wallX < visibleStart || wallX > visibleEnd) return;

    const distToWall = Math.max(0, v.x - wallX);
    // Barrier glows into view within 320px or when colliding with it
    const proximity = Math.max(0, Math.min(1, 1 - (distToWall / 320)));
    if (proximity <= 0.02 && !v.atReverseWall) return;

    const groundY = this.terrain.getHeight(wallX);
    const wallHeight = 460;
    const pulse = Math.sin(performance.now() * 0.008) * 0.2 + 0.8;
    const isTouching = v.atReverseWall;
    const alpha = (isTouching ? 0.85 : proximity * 0.55) * pulse;

    ctx.save();
    ctx.beginPath();

    // 1. Vertical Energy Beam Wall
    const grad = ctx.createLinearGradient(wallX - 18, 0, wallX + 18, 0);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
    grad.addColorStop(0.5, `rgba(34, 211, 238, ${alpha})`);
    grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(wallX - 18, groundY - wallHeight, 36, wallHeight + 60);

    // 2. Core Laser Line
    ctx.beginPath();
    ctx.moveTo(wallX, groundY - wallHeight);
    ctx.lineTo(wallX, groundY + 15);
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
    ctx.lineWidth = isTouching ? 3.5 : 2;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = isTouching ? 18 : 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Holographic Grid Rungs
    ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.45})`;
    ctx.lineWidth = 1.5;
    for (let y = groundY - wallHeight + 35; y < groundY; y += 45) {
      ctx.beginPath();
      ctx.moveTo(wallX - 15, y);
      ctx.lineTo(wallX + 15, y);
      ctx.stroke();
    }

    // 4. Ground Emitter Beacon
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(wallX, groundY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 5. '200m REVERSE LIMIT' Hologram Text
    if (proximity > 0.35 || isTouching) {
      ctx.save();
      ctx.translate(wallX - 22, groundY - 140);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('REVERSE LIMIT 200M', 0, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.restore();
  }

  /**
   * MULTI-VEHICLE RENDERING & 3RD PERSON DRIVER/RIDER CHARACTER
   */
  renderVehicle() {
    const ctx = this.ctx;
    const v = this.vehicle;
    const def = v.vehicleDef || VEHICLE_DEFS.buggy;

    // Suspension struts
    this.drawSuspensionStrut(v.rearWheel, def);
    this.drawSuspensionStrut(v.frontWheel, def);

    // Wheels
    this.drawWheel(v.rearWheel, def, false);
    this.drawWheel(v.frontWheel, def, true);

    // Chassis & 3rd Person Character
    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.rotate(v.angle);

    // 3rd Person Driver / Rider Character
    this.drawDriver(v, def);

    // Detailed Vehicle Bodywork
    this.drawVehicleBody(v, def);

    ctx.restore();
  }

  /**
   * 3RD PERSON DRIVER / RIDER CHARACTER
   * Features full anatomy: helmet with shaded visor & neck inertia, racing suit/jacket,
   * arms gripping steering wheel or handlebars, legs & boots resting on pedals/pegs.
   */
  drawDriver(v, def, customCtx = null) {
    const ctx = customCtx || this.ctx;
    const isGas = this.input ? this.input.gas : false;
    const isBrake = this.input ? this.input.brake : false;

    const headX = def.headOffset.x;
    const headY = def.headOffset.y;

    // Dynamic Neck & Body Inertia Tilt (utilizes broken neck ragdoll when vehicle crashes)
    const tilt = (v.driverNeckAngle !== undefined && v.driverNeckAngle !== 0)
      ? v.driverNeckAngle
      : (-v.angularVel * 0.12 - (isGas ? 0.18 : 0) + (isBrake ? 0.22 : 0) + (v.isDead ? 1.1 : 0));

    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate(tilt);

    if (def.isBike) {
      // --- BIKER ANATOMY (Motocross / Chopper) ---
      // Driver Torso (Leaning forward over gas tank)
      ctx.fillStyle = def.id === 'dirtbike' ? '#16a34a' : '#1e1b4b'; // Green racing jersey or dark leather vest
      ctx.beginPath();
      ctx.ellipse(-4, 18, 9, 14, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Biker Legs & Boots (Resting on footpegs)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6, 26);
      ctx.lineTo(2, 38);
      ctx.lineTo(14, 42); // Boot on peg
      ctx.stroke();

      // Boots
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(10, 38, 12, 6);

      // Arms reaching forward to handlebars
      ctx.strokeStyle = def.id === 'dirtbike' ? '#22c55e' : '#334155';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-4, 12);
      ctx.lineTo(12, 16);
      ctx.lineTo(26, 12); // Gripping bars
      ctx.stroke();

      // Motorcycle Handlebars
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(22, 6);
      ctx.lineTo(26, 14);
      ctx.stroke();

      // Hands with gloves
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(26, 12, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // --- CAR / BUS / TRUCK DRIVER ANATOMY ---
      // Driver Torso seated in cockpit
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(-6, 16, 9, 13, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Safety harness straps
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(-2, 24);
      ctx.stroke();

      // Steering Wheel & Column
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(6, 26);
      ctx.lineTo(15, 14);
      ctx.stroke();

      // Steering wheel rim
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(15, 14, 4, 10, -0.3, 0, Math.PI * 2);
      ctx.stroke();

      // Driver Arms gripping wheel
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, 12);
      ctx.lineTo(6, 14);
      ctx.lineTo(15, 14);
      ctx.stroke();

      // Driver Racing Gloves
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(15, 14, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Legs bent to pedals
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-6, 24);
      ctx.lineTo(8, 28);
      ctx.lineTo(18, 30);
      ctx.stroke();
    }

    // Full 3D Racing Helmet
    ctx.beginPath();
    ctx.arc(0, 0, v.headRadius, 0, Math.PI * 2);
    ctx.fillStyle = def.id === 'dirtbike' ? '#22c55e' : (def.id === 'muscle' ? '#ef4444' : '#ffffff');
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Helmet racing stripe
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, v.headRadius - 1.5, Math.PI * 0.7, Math.PI * 1.3);
    ctx.stroke();

    // Motocross visor peak on dirtbike
    if (def.id === 'dirtbike') {
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(16, -14);
      ctx.lineTo(14, -8);
      ctx.closePath();
      ctx.fill();
    }

    // High-gloss tinted aerodynamic visor
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    safeRoundRect(ctx, 1, -5, 12, 10, 4);
    ctx.fill();

    if (v.isDead) {
      // Visor cracked fracture lines & knocked-out X X eyes (Hill Climb Racing crash style)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(2, -4);
      ctx.lineTo(6, -1);
      ctx.lineTo(4, 2);
      ctx.lineTo(10, 1);
      ctx.stroke();

      // Dizzy knocked-out X eye
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(4, -3); ctx.lineTo(8, 1);
      ctx.moveTo(8, -3); ctx.lineTo(4, 1);
      ctx.stroke();
    } else {
      // Visor reflective highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(3, -3, 8, 2.5);
    }

    ctx.restore();
  }

  /**
   * DETAILED 2D BODYWORK FOR ALL 9 VEHICLES
   */
  drawVehicleBody(v, def, customCtx = null) {
    const ctx = customCtx || this.ctx;
    const id = def.id;

    if (id === 'muscle') {
      // --- V8 HOT ROD MUSCLE ---
      // Chopped coupe roof
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.moveTo(-28, -8);
      ctx.lineTo(-14, -28);
      ctx.lineTo(18, -28);
      ctx.lineTo(28, -8);
      ctx.closePath();
      ctx.fill();

      // Tinted cabin window
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-22, -9);
      ctx.lineTo(-12, -25);
      ctx.lineTo(14, -25);
      ctx.lineTo(22, -9);
      ctx.closePath();
      ctx.fill();

      // Red Muscle Body
      const mGrad = ctx.createLinearGradient(-56, 0, 56, 0);
      mGrad.addColorStop(0, '#dc2626');
      mGrad.addColorStop(0.5, '#ef4444');
      mGrad.addColorStop(1, '#b91c1c');
      ctx.fillStyle = mGrad;
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-56, 6);
      ctx.lineTo(-52, -10);
      ctx.lineTo(-24, -10);
      ctx.lineTo(36, -10);
      ctx.lineTo(56, 2);
      ctx.lineTo(50, 12);
      ctx.lineTo(-52, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Chrome 3-Hole Supercharger Blower Scoop
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(18, -20, 16, 11);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(18, -20, 16, 11);
      ctx.fillStyle = '#ef4444'; // Red butterflies
      ctx.beginPath();
      ctx.arc(22, -15, 2.5, 0, Math.PI * 2);
      ctx.arc(26, -15, 2.5, 0, Math.PI * 2);
      ctx.arc(30, -15, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Chrome side exhaust header pipes
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-24, 6, 32, 5);
    } else if (id === 'rally') {
      // --- TURBO RALLY ---
      // Blue Aerodynamic Body
      ctx.fillStyle = '#2563eb';
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-53, 6);
      ctx.lineTo(-44, -14);
      ctx.lineTo(-12, -26);
      ctx.lineTo(24, -26);
      ctx.lineTo(44, -8);
      ctx.lineTo(53, 4);
      ctx.lineTo(48, 12);
      ctx.lineTo(-49, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cabin Windows
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-10, -24);
      ctx.lineTo(20, -24);
      ctx.lineTo(36, -9);
      ctx.lineTo(-10, -9);
      ctx.closePath();
      ctx.fill();

      // Large Downforce Rear Wing
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(-52, -28, 16, 4);
      ctx.fillRect(-48, -24, 4, 12);

      // Yellow Rally Stars
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(6, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      // Front Quad Fog Lamp Bar
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(49, -4, 5, 8);
    } else if (id === 'dirtbike') {
      // --- MOTOCROSS DIRT BIKE ---
      // High front green fender
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(18, 2);
      ctx.lineTo(40, -4);
      ctx.lineTo(34, 4);
      ctx.closePath();
      ctx.fill();

      // Green Side Number Plates & Gas Tank
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-2, -10);
      ctx.lineTo(16, -2);
      ctx.lineTo(12, 10);
      ctx.lineTo(-16, 10);
      ctx.closePath();
      ctx.fill();

      // Tubular perimeter frame
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-26, 12);
      ctx.lineTo(0, 4);
      ctx.lineTo(22, 12);
      ctx.stroke();

      // Exposed chrome engine cylinder
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-6, 2, 14, 10);

      // Upswept exhaust pipe
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(6, 8);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-28, -6);
      ctx.stroke();
    } else if (id === 'chopper') {
      // --- HIGHWAY CHOPPER ---
      // Stretched 45° chrome front fork
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(12, 4);
      ctx.lineTo(48, 16);
      ctx.stroke();

      // High Ape-Hanger handlebars
      ctx.beginPath();
      ctx.moveTo(12, 4);
      ctx.lineTo(18, -12);
      ctx.stroke();

      // Teardrop purple tank
      ctx.fillStyle = '#6b21a8';
      ctx.beginPath();
      ctx.ellipse(-2, -2, 16, 7, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Low black leather solo seat
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(-28, 4);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 8);
      ctx.closePath();
      ctx.fill();

      // Chrome V-Twin engine block & dual exhaust pipes
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-10, 2, 18, 12);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-8, 8);
      ctx.lineTo(-38, 10);
      ctx.moveTo(-8, 12);
      ctx.lineTo(-44, 14);
      ctx.stroke();
    } else if (id === 'schoolbus') {
      // --- CLASSIC SCHOOL BUS ---
      // Yellow Bus Body
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      safeRoundRect(ctx, -77, -34, 154, 44, 6);
      ctx.fill();
      ctx.stroke();

      // Black horizontal beltline rub rails
      ctx.fillStyle = '#18181b';
      ctx.fillRect(-77, -12, 154, 4);
      ctx.fillRect(-77, 2, 154, 3);

      // Passenger Windows
      ctx.fillStyle = '#0f172a';
      for (let w = 0; w < 7; w++) {
        ctx.fillRect(-68 + w * 18, -30, 14, 14);
      }

      // Front Driver Windshield
      ctx.fillRect(60, -30, 13, 16);

      // Black front bumper
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(72, 2, 8, 8);
    } else if (id === 'doubledecker') {
      // --- CITY DOUBLE DECKER BUS ---
      // Crimson Two-Story Bus Body
      ctx.fillStyle = '#b91c1c';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      safeRoundRect(ctx, -79, -58, 158, 68, 6);
      ctx.fill();
      ctx.stroke();

      // Cream dividing stripe
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-79, -28, 158, 4);

      // Top-tier windows
      ctx.fillStyle = '#0f172a';
      for (let w = 0; w < 7; w++) {
        ctx.fillRect(-72 + w * 19, -52, 15, 18);
      }

      // Bottom-tier windows
      for (let w = 0; w < 6; w++) {
        ctx.fillRect(-72 + w * 19, -22, 15, 18);
      }

      // Front destination banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(48, -52, 26, 10);
    } else if (id === 'pickup') {
      // --- 4X4 MONSTER PICKUP ---
      // Lifted truck cab & bed
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-62, 6);
      ctx.lineTo(-62, -10);
      ctx.lineTo(-14, -10); // Bed line
      ctx.lineTo(-8, -26); // Cab rear
      ctx.lineTo(26, -26); // Cab roof
      ctx.lineTo(44, -8); // Windshield
      ctx.lineTo(62, -4); // Hood
      ctx.lineTo(62, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tinted cabin window
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-4, -24);
      ctx.lineTo(22, -24);
      ctx.lineTo(38, -9);
      ctx.lineTo(-4, -9);
      ctx.closePath();
      ctx.fill();

      // Truck bed roll-bar with quad spotlights
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, -10);
      ctx.lineTo(-12, -32);
      ctx.lineTo(-4, -32);
      ctx.stroke();

      // Spotlights
      ctx.fillStyle = '#fef08a';
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        ctx.arc(-14 + s * 6, -34, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Front Bull Bar
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.strokeRect(58, -6, 6, 12);
    } else if (id === 'bigrig') {
      // --- TITAN SEMI BIG RIG ---
      // Big Rig Sleeper Cab
      ctx.fillStyle = '#1e3a8a';
      ctx.strokeStyle = '#172554';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-82, 6);
      ctx.lineTo(-82, -40);
      ctx.lineTo(34, -40);
      ctx.lineTo(44, -18);
      ctx.lineTo(78, -18);
      ctx.lineTo(82, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Giant vertical chrome front grille
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(72, -18, 12, 24);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(72, -18, 12, 24);

      // Cabin Windows
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, -36, 26, 15);

      // Dual towering vertical chrome exhaust smoke stacks
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-2, -56, 5, 48);
      ctx.fillRect(10, -56, 5, 48);
    } else {
      // --- CLASSIC HILL BUGGY ---
      // Roll cage
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-35, -5);
      ctx.lineTo(-15, -34);
      ctx.lineTo(20, -34);
      ctx.lineTo(35, -8);
      ctx.stroke();

      // Body Panels
      const bodyGrad = ctx.createLinearGradient(-50, 0, 50, 0);
      bodyGrad.addColorStop(0, '#ea580c');
      bodyGrad.addColorStop(0.5, '#f97316');
      bodyGrad.addColorStop(1, '#ea580c');

      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#9a3412';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(-50, 6);
      ctx.lineTo(-42, -14);
      ctx.lineTo(-10, -18);
      ctx.lineTo(38, -12);
      ctx.lineTo(50, 4);
      ctx.lineTo(44, 12);
      ctx.lineTo(-46, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Racing Stripe
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(-36, 0);
      ctx.lineTo(32, 0);
      ctx.lineTo(28, 5);
      ctx.lineTo(-38, 5);
      ctx.closePath();
      ctx.fill();

      // Headlight
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(47, -2, 6, 8);

      // Exhaust Pipe
      ctx.fillStyle = '#334155';
      ctx.fillRect(-54, 2, 8, 5);
    }
  }

  drawSuspensionStrut(wheel, def, customCtx = null) {
    const ctx = customCtx || this.ctx;
    const v = this.vehicle;

    ctx.save();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(wheel.x, wheel.y);
    ctx.stroke();

    // Shock spring coil
    ctx.strokeStyle = def.id === 'muscle' ? '#ef4444' : (def.id === 'dirtbike' ? '#22c55e' : '#f97316');
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const sx = v.x + (wheel.x - v.x) * t + (i % 2 === 0 ? -4 : 4);
      const sy = v.y + (wheel.y - v.y) * t;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    ctx.restore();
  }

  drawWheel(wheel, def, isFront, customCtx = null) {
    const ctx = customCtx || this.ctx;
    ctx.save();
    ctx.translate(wheel.x, wheel.y);
    ctx.rotate(wheel.rot);

    const rad = wheel.radius;

    // Tire Rubber
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.stroke();

    if (def.isBike) {
      // Wire Spokes on Motorcycle
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;
      const spokes = 12;
      for (let s = 0; s < spokes; s++) {
        const a = (s / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * (rad - 4), Math.sin(a) * (rad - 4));
        ctx.stroke();
      }
      // Aluminum Rim
      ctx.beginPath();
      ctx.arc(0, 0, rad * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      // Heavy Treads
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = def.id === 'pickup' ? 4.5 : 3;
      const treads = def.id === 'pickup' ? 10 : 8;
      for (let t = 0; t < treads; t++) {
        const a = (t / treads) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (rad - 5), Math.sin(a) * (rad - 5));
        ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        ctx.stroke();
      }

      // Rim
      ctx.beginPath();
      ctx.arc(0, 0, rad * 0.58, 0, Math.PI * 2);
      ctx.fillStyle = def.id === 'bigrig' || def.id === 'schoolbus' ? '#cbd5e1' : (def.id === 'muscle' ? '#e2e8f0' : '#f97316');
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lug bolts
      ctx.fillStyle = '#0f172a';
      for (let b = 0; b < 5; b++) {
        const ba = (b / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(ba) * 6, Math.sin(ba) * 6, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Center Hubcap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * GARAGE PREVIEW SHOWCASE METHOD
   * Renders any vehicle with wheels, animated idle bounce, and 3rd person driver
   */
  renderVehicleShowcase(ctx, cx, cy, vehicleId, time) {
    const def = VEHICLE_DEFS[vehicleId] || VEHICLE_DEFS.buggy;
    const bounce = Math.sin(time * 3) * 2.5;

    ctx.save();
    ctx.translate(cx, cy + bounce);

    // Platform Shadow
    ctx.beginPath();
    ctx.ellipse(0, 50 - bounce, def.width * 0.9, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // Wheels
    const rwRadius = def.rearWheelRadius || def.wheelRadius;
    const fwRadius = def.frontWheelRadius || def.wheelRadius;
    const wheelY = 32;

    const dummyRear = { x: -def.wheelBaseHalf, y: wheelY, radius: rwRadius, rot: time * 2 };
    const dummyFront = { x: def.wheelBaseHalf, y: wheelY, radius: fwRadius, rot: time * 2 };

    // Struts
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-def.wheelBaseHalf, 0);
    ctx.lineTo(-def.wheelBaseHalf, wheelY);
    ctx.moveTo(def.wheelBaseHalf, 0);
    ctx.lineTo(def.wheelBaseHalf, wheelY);
    ctx.stroke();

    this.drawWheel(dummyRear, def, false, ctx);
    this.drawWheel(dummyFront, def, true, ctx);

    // Chassis & 3rd Person Character
    const dummyVehicle = {
      angularVel: 0,
      isDead: false,
      headRadius: def.headRadius || 13,
      rearWheel: dummyRear,
      frontWheel: dummyFront
    };

    this.drawDriver(dummyVehicle, def, ctx);
    this.drawVehicleBody(dummyVehicle, def, ctx);

    ctx.restore();
  }
}

function hexToRgba(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},`;
  }
  return 'rgba(255,255,255,';
}

// Global game instance
window.gameInstance = new GameEngine();
