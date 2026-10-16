/**
 * 2D Physics Engine & Terrain Generator
 * Hill Climb Racing style spring-damper suspension + chassis physics
 * Multi-vehicle catalog: Cars, Bikes, Buses, Trucks
 * Smooth, easy-to-handle physics & Rocket Boost propulsion for climbing steep hills
 */

const VEHICLE_DEFS = {
  // --- CARS ---
  buggy: {
    id: 'buggy',
    name: 'Hill Buggy',
    category: 'car',
    cost: 0,
    description: 'The iconic classic. Lightweight and agile on all hills.',
    wheelRadius: 22,
    rearWheelRadius: 22,
    frontWheelRadius: 22,
    wheelBaseHalf: 46,
    suspensionRestLength: 32,
    mass: 900,
    width: 100,
    height: 34,
    headOffset: { x: -4, y: -36 },
    headRadius: 11,
    driveForceMul: 1.15,
    maxSpeedMul: 1.05,
    springKMul: 1.0,
    airRotationMul: 1.1,
    weightSagFactor: 1.0,
    stats: { speed: 65, power: 75, suspension: 80, stability: 75 }
  },
  muscle: {
    id: 'muscle',
    name: 'V8 Hot Rod',
    category: 'car',
    cost: 12000,
    description: 'Roaring V8 muscle with supercharger blower & fat rear slicks.',
    wheelRadius: 23,
    rearWheelRadius: 25,
    frontWheelRadius: 19,
    wheelBaseHalf: 52,
    suspensionRestLength: 28,
    mass: 1100,
    width: 112,
    height: 32,
    headOffset: { x: -10, y: -33 },
    headRadius: 11,
    driveForceMul: 1.35,
    maxSpeedMul: 1.25,
    springKMul: 1.15,
    airRotationMul: 1.0,
    weightSagFactor: 1.15,
    stats: { speed: 90, power: 88, suspension: 70, stability: 80 }
  },
  rally: {
    id: 'rally',
    name: 'Turbo Rally',
    category: 'car',
    cost: 30000,
    description: 'Aerodynamic rear wing, turbo all-wheel drive, and sharp cornering.',
    wheelRadius: 22,
    rearWheelRadius: 22,
    frontWheelRadius: 22,
    wheelBaseHalf: 48,
    suspensionRestLength: 30,
    mass: 960,
    width: 106,
    height: 33,
    headOffset: { x: -8, y: -35 },
    headRadius: 11,
    driveForceMul: 1.45,
    maxSpeedMul: 1.35,
    springKMul: 1.25,
    airRotationMul: 1.15,
    weightSagFactor: 1.0,
    stats: { speed: 95, power: 92, suspension: 88, stability: 90 }
  },

  // --- BIKES ---
  dirtbike: {
    id: 'dirtbike',
    name: 'Motocross 250',
    category: 'bike',
    cost: 8000,
    description: 'Ultra-light stunt bike. Crazy air flips, huge jumps, and extreme agility!',
    isBike: true,
    wheelRadius: 21,
    rearWheelRadius: 21,
    frontWheelRadius: 21,
    wheelBaseHalf: 36,
    suspensionRestLength: 36,
    mass: 550,
    width: 82,
    height: 42,
    headOffset: { x: 2, y: -44 },
    headRadius: 11,
    driveForceMul: 1.25,
    maxSpeedMul: 1.15,
    springKMul: 1.2,
    airRotationMul: 1.6, // Extreme air flip stunts
    weightSagFactor: 0.65,
    stats: { speed: 80, power: 80, suspension: 95, stability: 70 }
  },
  chopper: {
    id: 'chopper',
    name: 'V-Twin Chopper',
    category: 'bike',
    cost: 22000,
    description: 'Raked-out chrome fork, fat rear tire, ape-hanger bars, and low leather seat.',
    isBike: true,
    wheelRadius: 22,
    rearWheelRadius: 24,
    frontWheelRadius: 21,
    wheelBaseHalf: 52,
    suspensionRestLength: 28,
    mass: 750,
    width: 110,
    height: 40,
    headOffset: { x: -12, y: -40 },
    headRadius: 11,
    driveForceMul: 1.3,
    maxSpeedMul: 1.2,
    springKMul: 1.0,
    airRotationMul: 1.25,
    weightSagFactor: 0.8,
    stats: { speed: 85, power: 85, suspension: 75, stability: 78 }
  },

  // --- BUSES ---
  schoolbus: {
    id: 'schoolbus',
    name: 'School Bus',
    category: 'bus',
    cost: 18000,
    description: 'Long yellow heavy chassis. Heavy momentum clears the steepest peaks!',
    wheelRadius: 23,
    rearWheelRadius: 23,
    frontWheelRadius: 23,
    wheelBaseHalf: 68,
    suspensionRestLength: 30,
    mass: 1800,
    width: 154,
    height: 52,
    headOffset: { x: 42, y: -38 },
    headRadius: 11,
    driveForceMul: 1.45,
    maxSpeedMul: 1.05,
    springKMul: 1.35,
    airRotationMul: 0.8,
    weightSagFactor: 1.5,
    stats: { speed: 65, power: 90, suspension: 75, stability: 82 }
  },
  doubledecker: {
    id: 'doubledecker',
    name: 'Double Decker',
    category: 'bus',
    cost: 40000,
    description: 'Iconic two-story city bus. Massive torque and climbing momentum!',
    wheelRadius: 24,
    rearWheelRadius: 24,
    frontWheelRadius: 24,
    wheelBaseHalf: 72,
    suspensionRestLength: 32,
    mass: 2200,
    width: 158,
    height: 74,
    headOffset: { x: 44, y: -36 },
    headRadius: 11,
    driveForceMul: 1.55,
    maxSpeedMul: 1.0,
    springKMul: 1.5,
    airRotationMul: 0.7,
    weightSagFactor: 1.8,
    stats: { speed: 60, power: 95, suspension: 70, stability: 75 }
  },

  // --- TRUCKS ---
  pickup: {
    id: 'pickup',
    name: '4x4 Monster',
    category: 'truck',
    cost: 15000,
    description: 'Huge high-lift clearance, massive knobby tires, and raw hill-climbing power.',
    wheelRadius: 27,
    rearWheelRadius: 27,
    frontWheelRadius: 27,
    wheelBaseHalf: 54,
    suspensionRestLength: 36,
    mass: 1400,
    width: 124,
    height: 48,
    headOffset: { x: -6, y: -40 },
    headRadius: 11,
    driveForceMul: 1.45,
    maxSpeedMul: 1.2,
    springKMul: 1.3,
    airRotationMul: 0.95,
    weightSagFactor: 1.3,
    stats: { speed: 80, power: 95, suspension: 92, stability: 88 }
  },
  bigrig: {
    id: 'bigrig',
    name: 'Titan Semi',
    category: 'truck',
    cost: 50000,
    description: 'Giant chrome grille, vertical twin exhausts, unstoppable torque train.',
    wheelRadius: 26,
    rearWheelRadius: 26,
    frontWheelRadius: 26,
    wheelBaseHalf: 76,
    suspensionRestLength: 34,
    mass: 2400,
    width: 168,
    height: 60,
    headOffset: { x: 38, y: -44 },
    headRadius: 11,
    driveForceMul: 1.65,
    maxSpeedMul: 1.12,
    springKMul: 1.6,
    airRotationMul: 0.65,
    weightSagFactor: 1.9,
    stats: { speed: 75, power: 100, suspension: 82, stability: 92 }
  }
};

// Explicit, map-specific architectural suspension bridge locations across dramatic chasms
const STAGE_BRIDGES = {
  countryside: [
    { startX: 640, span: 240, name: 'Brook Ravine Bridge' },
    { startX: 2320, span: 280, name: 'Valley Creek Bridge' },
    { startX: 5480, span: 300, name: 'Timber Ridge Bridge' },
    { startX: 8350, span: 340, name: 'Falcon Chasm Bridge' },
    { startX: 12380, span: 380, name: 'Highland Gorge Bridge' }
  ],
  desert: [
    { startX: 1920, span: 250, name: 'Scorpion Gulch Bridge' },
    { startX: 4960, span: 300, name: 'Red Rock Canyon Bridge' },
    { startX: 8380, span: 360, name: 'Mirage Trench Bridge' },
    { startX: 12400, span: 400, name: 'Fossil Ravine Bridge' }
  ],
  arctic: [
    { startX: 1480, span: 220, name: 'Frostbite Crevasse Bridge' },
    { startX: 4920, span: 320, name: 'Icefall Rift Bridge' },
    { startX: 8360, span: 360, name: 'Permafrost Chasm Bridge' },
    { startX: 12380, span: 420, name: 'Boreal Abyss Bridge' }
  ],
  volcano: [
    { startX: 1480, span: 240, name: 'Magma Trench Bridge' },
    { startX: 4950, span: 320, name: 'Obsidian Gorge Bridge' },
    { startX: 8380, span: 380, name: 'Caldera Rift Bridge' },
    { startX: 12400, span: 440, name: 'Inferno Chasm Bridge' }
  ],
  mars: [
    { startX: 1920, span: 240, name: 'Acidalia Canyon Bridge' },
    { startX: 5510, span: 310, name: 'Valles Rift Bridge' },
    { startX: 9650, span: 400, name: 'Olympus Chasm Bridge' }
  ],
  moon: [
    { startX: 2400, span: 280, name: 'Tranquility Rille Bridge' },
    { startX: 6650, span: 320, name: 'Copernicus Fissure Bridge' },
    { startX: 11700, span: 440, name: 'Tycho Trench Bridge' }
  ]
};

class TerrainGenerator {
  constructor() {
    this.stage = 'countryside';
    this.gravity = 1450; // pixels / s^2 - Stable, grounded racing feel
    this.friction = 0.96;
    this.activeVehicleX = 0;
    this.activeVehicleWeight = 1.0;
  }

  setStage(stageName) {
    this.stage = stageName;
    switch (stageName) {
      case 'desert':
        this.gravity = 1420;
        this.friction = 0.92;
        break;
      case 'arctic':
        this.gravity = 1450;
        this.friction = 0.90; // Balanced icy hill traction with authentic snow slip
        break;
      case 'volcano':
        this.gravity = 1480; // Volcanic gravity
        this.friction = 0.94;
        break;
      case 'mars':
        this.gravity = 780; // Extraterrestrial low gravity
        this.friction = 0.90;
        break;
      case 'moon':
        this.gravity = 520; // Low lunar gravity space jumps
        this.friction = 0.88;
        break;
      case 'countryside':
      default:
        this.stage = 'countryside';
        this.gravity = 1450;
        this.friction = 0.96;
        break;
    }
  }

  isSpace() {
    return this.stage === 'moon' || this.stage === 'mars';
  }

  hasAtmosphere() {
    return !this.isSpace();
  }

  getStageBaseHeight(x, stage = this.stage) {
    if (x < 320) return 500;
    const t = x - 320;
    let h = 500;
    const distFactor = Math.min(2.2, 1.0 + (x / 10000) * 0.8);

    switch (stage) {
      case 'desert':
        h += (Math.sin(t * 0.0016) * 120
           + Math.sin(t * 0.0038) * 70
           + Math.cos(t * 0.0008) * 100
           + Math.sin(t * 0.008) * 30) * distFactor;
        break;
      case 'arctic':
        h += (Math.sin(t * 0.0022) * 120
           + Math.sin(t * 0.0048) * 55
           + Math.cos(t * 0.0011) * 110
           + Math.sin(t * 0.0075) * 25) * distFactor;
        break;
      case 'volcano':
        h += (Math.sin(t * 0.0024) * 130
           + Math.sin(t * 0.0052) * 60
           + Math.cos(t * 0.0012) * 120
           + Math.sin(t * 0.008) * 28) * distFactor;
        break;
      case 'mars':
        h += (Math.sin(t * 0.0018) * 150
           + Math.sin(t * 0.0042) * 75
           + Math.cos(t * 0.0007) * 120
           + Math.sin(t * 0.009) * 35) * distFactor;
        break;
      case 'moon':
        h += (Math.sin(t * 0.0012) * 170
           + Math.sin(t * 0.0032) * 85
           + Math.cos(t * 0.0005) * 130) * distFactor;
        break;
      case 'countryside':
      default:
        h += (Math.sin(t * 0.0022) * 105
            + Math.sin(t * 0.0055) * 52
            + Math.cos(t * 0.0009) * 78
            + Math.sin(t * 0.009) * 26) * distFactor;
        break;
    }
    return h;
  }

  getBridges() {
    return STAGE_BRIDGES[this.stage] || STAGE_BRIDGES.countryside;
  }

  getBridgeAt(x) {
    const bridges = this.getBridges();
    for (let i = 0; i < bridges.length; i++) {
      const b = bridges[i];
      if (x >= b.startX && x <= b.startX + b.span) {
        return b;
      }
    }
    return null;
  }

  isBridge(x) {
    return this.getBridgeAt(x) !== null;
  }

  getHeight(x) {
    let h = this.getStageBaseHeight(x);

    // Dramatic Chasm Canyon underneath the bridge: tailored depth to ensure gorge abyss is in full view
    const bridge = this.getBridgeAt(x);
    if (bridge) {
      const t = (x - bridge.startX) / bridge.span;
      const chasmDepth = Math.sin(t * Math.PI) * (120 + Math.min(25, bridge.span * 0.08));
      h += chasmDepth;
    }

    return h;
  }

  getBridgeHeight(x) {
    const bridge = this.getBridgeAt(x);
    if (!bridge) return this.getHeight(x);

    const { startX, span } = bridge;
    const endX = startX + span;
    const h1 = this.getStageBaseHeight(startX);
    const h2 = this.getStageBaseHeight(endX);
    const t = Math.max(0, Math.min(1, (x - startX) / span));

    // Smooth Cosine interpolation bridging across cliff edge heights
    const baseH = h1 + (h2 - h1) * (0.5 - 0.5 * Math.cos(t * Math.PI));

    // Subtle catenary curve sag
    const staticSag = Math.sin(t * Math.PI) * 12;

    // Smooth dynamic weight deflection when vehicle is crossing
    let dynamicSag = 0;
    if (this.activeVehicleX && this.activeVehicleX >= startX && this.activeVehicleX <= endX) {
      const dist = Math.abs(x - this.activeVehicleX);
      if (dist < 90) {
        const factor = 1 - dist / 90;
        dynamicSag = factor * factor * 6 * Math.min(1.3, this.activeVehicleWeight || 1.0);
      }
    }

    return baseH + staticSag + dynamicSag;
  }

  getEffectiveHeight(x) {
    if (this.isBridge(x)) {
      return this.getBridgeHeight(x);
    }
    return this.getHeight(x);
  }

  getSlope(x) {
    const dx = 2.0;
    const h1 = this.getEffectiveHeight(x - dx);
    const h2 = this.getEffectiveHeight(x + dx);
    return (h2 - h1) / (dx * 2);
  }

  getTangent(x) {
    const slope = this.getSlope(x);
    const len = Math.sqrt(1 + slope * slope);
    return {
      x: 1 / len,
      y: slope / len
    };
  }

  getNormal(x) {
    const tangent = this.getTangent(x);
    return {
      x: -tangent.y,
      y: tangent.x
    };
  }
}

class Vehicle {
  constructor(upgrades = { engine: 1, suspension: 1, tires: 1, fourwd: 1 }, terrain = null, vehicleType = 'buggy') {
    this.reset(upgrades, 220, terrain, vehicleType);
  }

  reset(upgrades = { engine: 1, suspension: 1, tires: 1, fourwd: 1 }, startX = 220, terrain = null, vehicleType = 'buggy') {
    this.upgrades = upgrades;
    this.vehicleType = vehicleType;
    this.vehicleDef = VEHICLE_DEFS[vehicleType] || VEHICLE_DEFS.buggy;

    this.wheelBaseHalf = this.vehicleDef.wheelBaseHalf;
    this.wheelRadius = this.vehicleDef.wheelRadius;
    this.rearWheelRadius = this.vehicleDef.rearWheelRadius || this.wheelRadius;
    this.frontWheelRadius = this.vehicleDef.frontWheelRadius || this.wheelRadius;
    this.suspensionRestLength = this.vehicleDef.suspensionRestLength;
    this.width = this.vehicleDef.width;
    this.height = this.vehicleDef.height;

    this.x = startX;

    if (terrain) {
      // 1. Calculate local terrain slope at startX
      const startTangent = terrain.getTangent(startX);
      const initAngle = Math.atan2(startTangent.y, startTangent.x);
      const cos = Math.cos(initAngle);

      // 2. Wheel contact X positions
      const rmX = startX - this.wheelBaseHalf * cos;
      const fmX = startX + this.wheelBaseHalf * cos;

      // 3. Exact ground height under each wheel
      const rwGround = terrain.getEffectiveHeight(rmX);
      const fwGround = terrain.getEffectiveHeight(fmX);

      // 4. Exact resting wheel centers
      const rwCenterY = rwGround - this.rearWheelRadius;
      const fwCenterY = fwGround - this.frontWheelRadius;

      // 5. Accurate vehicle angle spanning both resting wheels
      this.angle = Math.atan2(fwCenterY - rwCenterY, fmX - rmX);
      const curCos = Math.cos(this.angle);
      const downY = curCos;

      // 6. Natural static suspension compression under vehicle weight (~4px)
      const staticSag = 4;
      const effRestLen = this.suspensionRestLength - staticSag;

      // Mount point heights
      const rmY = rwCenterY - downY * effRestLen;
      const fmY = fwCenterY - downY * effRestLen;

      this.y = (rmY + fmY) * 0.5;

      this.rearWheel = {
        x: rmX,
        y: rwCenterY,
        radius: this.rearWheelRadius,
        grounded: true,
        rot: 0,
        rotVel: 0
      };

      this.frontWheel = {
        x: fmX,
        y: fwCenterY,
        radius: this.frontWheelRadius,
        grounded: true,
        rot: 0,
        rotVel: 0
      };
    } else {
      this.y = 450;
      this.angle = 0;
      this.rearWheel = {
        x: this.x - this.wheelBaseHalf,
        y: this.y + this.suspensionRestLength,
        radius: this.rearWheelRadius,
        grounded: true,
        rot: 0,
        rotVel: 0
      };
      this.frontWheel = {
        x: this.x + this.wheelBaseHalf,
        y: this.y + this.suspensionRestLength,
        radius: this.frontWheelRadius,
        grounded: true,
        rot: 0,
        rotVel: 0
      };
    }

    this.vx = 0;
    this.vy = 0;
    this.angularVel = 0;

    // Driver head relative offset
    this.headOffset = { x: this.vehicleDef.headOffset.x, y: this.vehicleDef.headOffset.y };
    this.headRadius = this.vehicleDef.headRadius || 11;
    this.isDead = false;
    this.deadTime = 0;
    this.roofScraping = false;
    this.scrapeIntensity = 0;
    this.driverNeckAngle = 0;
    this.driverNeckVel = 0;
    this.lastGas = false;
    this.lastBrake = false;

    // Reverse limit & invisible wall (stops reversing after 200m)
    this.reverseOriginX = startX;
    this.reverseLimitMeters = 200;
    this.reverseLimitPx = 200 / 0.28; // 200m in game physics coordinates (~714.28px)
    this.atReverseWall = false;
    this.wallImpactTime = 0;

    // Ground state tracking for dynamic launch kicks
    this.wasGrounded = true;

    // Air flips & stunts
    this.midAir = false;
    this.airTime = 0;
    this.totalRotation = 0;
    this.lastAngle = 0;

    this.updateStats();
  }

  updateStats() {
    const def = this.vehicleDef;
    const engineLvl = this.upgrades.engine || 1;
    this.driveForce = (820 + (engineLvl - 1) * 125) * (def.driveForceMul || 1.0);
    this.maxSpeed = (560 + (engineLvl - 1) * 65) * (def.maxSpeedMul || 1.0);

    const suspLvl = this.upgrades.suspension || 1;
    this.springK = (480 + (suspLvl - 1) * 40) * (def.springKMul || 1.0);
    this.springDamp = 20 + (suspLvl - 1) * 2.5;

    const tiresLvl = this.upgrades.tires || 1;
    this.tireGrip = 1.1 + (tiresLvl - 1) * 0.14;

    const fourwdLvl = this.upgrades.fourwd || 1;
    this.fourwdBonus = 1.05 + (fourwdLvl - 1) * 0.15;
  }

  update(dt, input, terrain) {
    if (this.isDead) {
      // In crash mode: disable player throttle/brakes, but keep simulating physics
      // so car tumbles, rolls, skids on its roof, and sparks like in Hill Climb Racing!
      input = { gas: false, brake: false, boost: false };
      this.deadTime += dt;
    }

    this.lastGas = input ? input.gas : false;
    this.lastBrake = input ? input.brake : false;

    // Update active position for dynamic bridge deflection
    terrain.activeVehicleX = this.x;
    terrain.activeVehicleWeight = this.vehicleDef.weightSagFactor || 1.0;

    // Substep integration for high stability & smooth physics
    const subSteps = 3;
    const subDt = dt / subSteps;

    for (let i = 0; i < subSteps; i++) {
      this.stepPhysics(subDt, input, terrain);
    }

    this.updateNeck(dt);
    this.checkStunts(dt);
  }

  stepPhysics(dt, input, terrain) {
    // Update reverse origin: whenever vehicle moves or accelerates forward, advance anchor
    if (this.vx > 10 || (input.gas && this.vx >= -2)) {
      if (this.x > this.reverseOriginX) {
        this.reverseOriginX = this.x;
      }
    }

    // Gravity pulls chassis
    this.vy += terrain.gravity * dt;

    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    const downX = -sin;
    const downY = cos;

    // Chassis suspension mount points
    const rmX = this.x - this.wheelBaseHalf * cos;
    const rmY = this.y - this.wheelBaseHalf * sin;
    const fmX = this.x + this.wheelBaseHalf * cos;
    const fmY = this.y + this.wheelBaseHalf * sin;

    // Ground height at each wheel
    const rwGround = terrain.getEffectiveHeight(rmX);
    const fwGround = terrain.getEffectiveHeight(fmX);

    // Target wheel positions
    const rwTargetY = rmY + downY * this.suspensionRestLength;
    const fwTargetY = fmY + downY * this.suspensionRestLength;

    // Compression amounts
    const rwComp = Math.max(0, (rwTargetY + this.rearWheelRadius) - rwGround);
    const fwComp = Math.max(0, (fwTargetY + this.frontWheelRadius) - fwGround);

    this.rearWheel.grounded = rwComp > 0;
    this.frontWheel.grounded = fwComp > 0;
    const isGrounded = this.rearWheel.grounded || this.frontWheel.grounded;

    // Update actual wheel positions for rendering
    this.rearWheel.x = rmX + downX * (this.suspensionRestLength - rwComp * 0.55);
    this.rearWheel.y = rwTargetY - rwComp;
    this.frontWheel.x = fmX + downX * (this.suspensionRestLength - fwComp * 0.55);
    this.frontWheel.y = fwTargetY - fwComp;

    // ABSOLUTE GROUND / BRIDGE DECK CLAMPING:
    // Guarantees tires NEVER clip below the terrain or bridge deck planks!
    if (this.rearWheel.y + this.rearWheelRadius > rwGround) {
      this.rearWheel.y = rwGround - this.rearWheelRadius;
    }
    if (this.frontWheel.y + this.frontWheelRadius > fwGround) {
      this.frontWheel.y = fwGround - this.frontWheelRadius;
    }

    // Suspension upward push on chassis
    let f_net_susp = 0;
    if (rwComp > 0 || fwComp > 0) {
      const f_spring = (rwComp + fwComp) * this.springK * 0.5;
      const verticalCompSpeed = (this.vy * downY + this.vx * downX);
      
      // CRITICAL SOFT LANDING DAMPING:
      // High compression damping on impact to absorb shocks without bouncing
      // Strong rebound damping on expansion so spring cannot launch vehicle upward into air!
      const dampCoeff = verticalCompSpeed > 0 ? (this.springDamp * 1.8) : (this.springDamp * 1.25);
      const f_damp = verticalCompSpeed * dampCoeff;
      f_net_susp = Math.max(0, f_spring + f_damp);
    }

    this.vy -= f_net_susp * downY * dt;
    this.vx -= f_net_susp * downX * dt;

    // PLUSH SOFT LANDING ON TOUCHDOWN:
    // When vehicle lands from air, absorb downward velocity smoothly without bouncing
    if (!this.wasGrounded && isGrounded) {
      if (this.vy > 50) {
        this.vy *= 0.25; // Dissipate 75% of downward velocity into shock absorbers
        this.angularVel *= 0.45; // Dampen rotational impact slap
        if (this.vy > 140) {
          soundEngine.playLandingThud();
        }
      }
    }

    // Aerodynamic Downforce: keeps vehicle planted to hills when driving fast
    if (isGrounded) {
      const speed = Math.abs(this.vx);
      this.vy += Math.min(280, speed * 0.32) * dt;
    }

    // Restorative rotational torque from difference in wheel compression
    const torque = (rwComp - fwComp) * 24.0;
    const torque_damp = this.angularVel * 12.0;
    this.angularVel += (torque - torque_damp) * dt;

    // Ground Propulsion & Traction
    if (isGrounded) {
      const tangent = terrain.getTangent(this.x);
      const grip = terrain.friction * this.tireGrip * this.fourwdBonus;

      // Realistic Hill Climb Ground Dynamics:
      // Only apply gentle terrain following when BOTH wheels are firmly grounded and relatively flat.
      // If only one wheel touches (e.g. rear wheel during wheelie), gravity naturally tips vehicle!
      const terrainAngle = Math.atan2(tangent.y, tangent.x);
      let angleDiff = this.angle - terrainAngle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      const speed = Math.abs(this.vx);
      const bothGrounded = this.rearWheel.grounded && this.frontWheel.grounded;

      if (bothGrounded && Math.abs(angleDiff) < 0.45) {
        const groundStability = Math.max(0.1, 1.0 - Math.min(1.0, (speed - 140) / 320));
        this.angularVel -= angleDiff * (2.8 * groundStability) * dt;
      } else if (!bothGrounded) {
        // Tipping dynamics on single-wheel pivot:
        if (this.rearWheel.grounded && !this.frontWheel.grounded) {
          // Front wheel up (wheelie): if center of mass passes rear wheel, gravity pulls vehicle onto its back!
          if (angleDiff < -0.18) {
            this.angularVel -= (this.vehicleDef.isBike ? 4.5 : 3.0) * dt;
          }
        } else if (this.frontWheel.grounded && !this.rearWheel.grounded) {
          // Rear wheel up (stoppie / nose-dive): gravity pulls vehicle forward onto its nose!
          if (angleDiff > 0.18) {
            this.angularVel += (this.vehicleDef.isBike ? 4.5 : 3.0) * dt;
          }
        }
      }

      if (input.gas) {
        // Accelerate along terrain slope
        const currentSpeed = this.vx * tangent.x + this.vy * tangent.y;
        if (currentSpeed < this.maxSpeed) {
          this.vx += tangent.x * this.driveForce * grip * dt;
          this.vy += tangent.y * this.driveForce * grip * dt;
        }

        // ==============================================================
        // DRIVE TORQUE REACTION (WHEELIE):
        // In Hill Climb Racing: Floor the throttle on a hill or bump,
        // and the front wheels pop up! If held too long, the car flips backward!
        // ==============================================================
        const wheeliePower = (this.vehicleDef.isBike ? 4.8 : 2.6) * (this.driveForce / 820);
        this.angularVel -= wheeliePower * dt;

        // Wheel spin
        this.rearWheel.rotVel = Math.min(55, this.rearWheel.rotVel + 50 * dt);
        this.frontWheel.rotVel = Math.min(55, this.frontWheel.rotVel + 40 * dt);
      } else if (input.brake) {
        if (!this.atReverseWall) {
          // Active braking / reversing
          this.vx -= tangent.x * this.driveForce * 0.9 * dt;
          this.vy -= tangent.y * this.driveForce * 0.9 * dt;

          // Braking reaction torque: compresses front suspension (pushes nose down)
          this.angularVel += (this.vehicleDef.isBike ? 3.2 : 1.8) * dt;

          this.rearWheel.rotVel *= 0.82;
          this.frontWheel.rotVel *= 0.82;
        } else {
          // Blocked by invisible wall: cut off backward torque
          if (this.vx < 0) this.vx = 0;
          this.rearWheel.rotVel = 0;
          this.frontWheel.rotVel = 0;
        }
      } else {
        // Natural rolling
        const groundSpeed = (this.vx * tangent.x + this.vy * tangent.y) / this.wheelRadius;
        this.rearWheel.rotVel += (groundSpeed - this.rearWheel.rotVel) * 0.25;
        this.frontWheel.rotVel += (groundSpeed - this.frontWheel.rotVel) * 0.25;
      }

      // Rolling friction
      this.vx *= Math.pow(0.992, dt * 60);
      this.vy *= Math.pow(0.992, dt * 60);
    } else {
      // =========================================================================
      // AUTHENTIC HILL CLIMB RACING AIR CONTROLS & UNBALANCING DYNAMICS:
      // In Hill Climb Racing:
      // - GAS pedal: spins wheels forward -> reaction torque rotates chassis BACKWARDS (raises nose / backflip)!
      // - BRAKE pedal: stops wheels -> reaction torque rotates chassis FORWARDS (lowers nose / frontflip)!
      // =========================================================================

      const airMult = this.vehicleDef.airRotationMul || 1.0;
      const speed = Math.abs(this.vx);

      // Launch kick when transitioning from ground to air over crests
      if (this.wasGrounded && speed > 150) {
        const slope = terrain.getSlope(this.x);
        const speedRatio = Math.min(2.0, speed / 280);
        const launchKick = (slope > 0.05 ? -1.6 : 1.4) * speedRatio;
        this.angularVel += launchKick;
      }

      // Aerodynamic rotational unbalance at high speed
      if (speed > 130) {
        const speedRatio = Math.min(2.2, speed / 250);
        const unbalanceTorque = Math.sin(this.angle) * (2.4 * speedRatio);
        this.angularVel += unbalanceTorque * dt;
        this.vy += Math.min(160, speed * 0.14) * dt;
      }

      // Dynamic Player Air Balance Controls
      const controlTorque = 12.2 * airMult;

      if (input.gas) {
        // GAS (THROTTLE): Rotates BACKWARDS / NOSE UP (counter-clockwise)
        this.angularVel -= controlTorque * dt;
        this.rearWheel.rotVel = Math.min(58, this.rearWheel.rotVel + 52 * dt);
        this.frontWheel.rotVel = Math.min(58, this.frontWheel.rotVel + 42 * dt);
      }

      if (input.brake) {
        // BRAKE: Rotates FORWARDS / NOSE DOWN (clockwise)
        this.angularVel += controlTorque * dt;
        this.rearWheel.rotVel *= 0.85;
        this.frontWheel.rotVel *= 0.85;
      }

      // Air angular damping
      this.angularVel *= Math.pow(0.986, dt * 60);

      // Idle air wheel spin decay
      if (!input.gas && !input.brake) {
        this.rearWheel.rotVel *= 0.98;
        this.frontWheel.rotVel *= 0.98;
      }
    }

    this.wasGrounded = isGrounded;

    // ==========================================
    // ROCKET BOOSTER PROPULSION
    // ==========================================
    if (input.boost) {
      const tangent = terrain.getTangent(this.x);
      const boostForward = 1450 * dt;
      const boostLift = 320 * dt;

      this.vx += (tangent.x * 0.6 + cos * 0.4) * boostForward;
      this.vy += (tangent.y * 0.6 + sin * 0.4) * boostForward - boostLift;

      if (isGrounded) {
        const terrainAngle = Math.atan2(tangent.y, tangent.x);
        let angleDiff = this.angle - terrainAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angularVel -= angleDiff * 12.0 * dt;
      }

      this.rearWheel.rotVel = Math.min(60, this.rearWheel.rotVel + 80 * dt);
      this.frontWheel.rotVel = Math.min(60, this.frontWheel.rotVel + 70 * dt);
    }

    // Angular damping & integration
    this.angularVel *= Math.pow(isGrounded ? 0.94 : 0.986, dt * 60);
    this.angle += this.angularVel * dt;

    // Integrate wheel rotation
    this.rearWheel.rot += this.rearWheel.rotVel * dt;
    this.frontWheel.rot += this.frontWheel.rotVel * dt;

    // Translation integration
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Invisible wall collision
    const wallX = this.reverseOriginX - this.reverseLimitPx;
    const rearMargin = (this.width ? this.width * 0.48 : (this.wheelBaseHalf + this.rearWheelRadius));
    const minVehicleX = wallX + rearMargin;

    if (this.x <= minVehicleX) {
      this.x = minVehicleX;
      if (this.vx < 0) {
        this.vx = 0;
      }
      this.atReverseWall = true;
      this.wallImpactTime = performance.now();
      if (this.rearWheel.rotVel < 0) this.rearWheel.rotVel = 0;
      if (this.frontWheel.rotVel < 0) this.frontWheel.rotVel = 0;
    } else {
      this.atReverseWall = false;
    }

    if (this.rearWheel.x < wallX + this.rearWheelRadius) {
      this.rearWheel.x = wallX + this.rearWheelRadius;
    }
    if (this.frontWheel.x < wallX + this.frontWheelRadius) {
      this.frontWheel.x = wallX + this.frontWheelRadius;
    }

    // ==============================================================
    // MULTI-POINT BODY, ROOF, BUMPER & HEAD COLLISION SYSTEM
    // Allows vehicle to tumble, roll, and scrape upside down like Hill Climb Racing!
    // ==============================================================
    this.checkChassisCollisions(terrain, dt);
  }

  checkChassisCollisions(terrain, dt) {
    this.roofScraping = false;
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);

    // Key contact perimeter points on the vehicle chassis:
    const points = [
      { name: 'frontBumper', x: this.wheelBaseHalf + (this.frontWheelRadius || 22) * 0.8, y: -this.height * 0.1, isRoof: false, radius: 9 },
      { name: 'rearBumper',  x: -this.wheelBaseHalf - (this.rearWheelRadius || 22) * 0.8, y: -this.height * 0.1, isRoof: false, radius: 9 },
      { name: 'frontRoof',   x: this.wheelBaseHalf * 0.35, y: -this.height * 1.15, isRoof: true, radius: 12 },
      { name: 'rearRoof',    x: -this.wheelBaseHalf * 0.4, y: -this.height * 1.15, isRoof: true, radius: 12 },
      { name: 'driverHead',  x: this.headOffset.x, y: this.headOffset.y, isRoof: true, isHead: true, radius: this.headRadius }
    ];

    for (const pt of points) {
      const wx = this.x + (pt.x * cos - pt.y * sin);
      const wy = this.y + (pt.x * sin + pt.y * cos);

      const groundY = terrain.getEffectiveHeight(wx);
      const pen = (wy + pt.radius) - groundY;

      if (pen > 0) {
        // Upward normal pushback preventing chassis from falling through terrain
        const pushFrac = Math.min(pen, 18);
        this.y -= pushFrac * 0.55;

        // ZERO ELASTIC REBOUND - SOFT LANDING:
        // Chassis landing absorbs downward velocity directly into terrain with no bouncing
        if (this.vy > 0) {
          this.vy = 0;
        }

        // Contact lever arm torque creates tumbling and rolling over
        const armX = wx - this.x;
        const normalTorque = -(armX / (this.wheelBaseHalf || 50)) * (pen * 1.8);
        this.angularVel += normalTorque * dt;

        // Ground sliding friction
        const frictionRate = pt.isRoof ? 0.94 : 0.97;
        this.vx *= Math.pow(frictionRate, dt * 60);

        // DRIVER HEAD IMPACT - 1:1 AUTHENTIC HILL CLIMB RACING:
        // Any direct collision of driver head with terrain or obstacle immediately breaks neck ("OUT")
        if (pt.isHead && pen > 0) {
          if (!this.isDead) {
            this.isDead = true;
            soundEngine.playNeckSnap();
            soundEngine.playDriverOof();
            soundEngine.playCrash();
          }
        }

        if (pt.isRoof) {
          this.roofScraping = true;
          this.scrapeIntensity = Math.min(1.0, Math.abs(this.vx) / 100);

          // Tumbling roll torque from roof friction
          if (wy > this.y) {
            this.angularVel -= Math.sign(this.vx || 1) * 3.8 * dt;
          }

          // DRIVER DOWN ("OUT") DETECTION:
          // In Hill Climb Racing: If vehicle is overturned and roof strikes ground
          const tangent = terrain.getTangent(wx);
          const terrainAngle = Math.atan2(tangent.y, tangent.x);
          let relativeAngle = this.angle - terrainAngle;
          while (relativeAngle > Math.PI) relativeAngle -= Math.PI * 2;
          while (relativeAngle < -Math.PI) relativeAngle += Math.PI * 2;

          // Inverted or severely tilted (relative angle > ~65 degrees)
          const isOverturned = Math.abs(relativeAngle) > 1.15 || cos < 0.25;

          if (isOverturned) {
            if (!this.isDead) {
              this.isDead = true;
              soundEngine.playNeckSnap();
              soundEngine.playDriverOof();
              soundEngine.playCrash();
            }
          }
        }
      }
    }

    // Chassis belly collision safety net
    const centerGround = terrain.getEffectiveHeight(this.x);
    const bellyMargin = Math.min(12, (this.rearWheelRadius || 22) * 0.45);
    if (this.y + bellyMargin > centerGround && cos > 0) {
      this.y = centerGround - bellyMargin;
      if (this.vy > 0) this.vy = 0;
      this.vx *= 0.985;
    }
  }

  updateNeck(dt) {
    if (this.isDead) {
      // Authentic Hill Climb Racing broken neck limp ragdoll:
      // Gravity pulls head downwards toward world +Y with loose oscillation
      const worldGravityNeck = Math.sin(this.angle) * 1.6 - 1.1;
      const targetNeckAngle = Math.max(-2.2, Math.min(2.2, worldGravityNeck));
      const diff = targetNeckAngle - this.driverNeckAngle;
      this.driverNeckVel += diff * 38 * dt;
      this.driverNeckVel *= Math.pow(0.78, dt * 60);
      this.driverNeckAngle += this.driverNeckVel * dt;
    } else {
      // Living driver: reacts to acceleration, bumps, and controls
      const targetNeckAngle = -this.angularVel * 0.14 - (this.lastGas ? 0.22 : 0) + (this.lastBrake ? 0.25 : 0);
      this.driverNeckAngle += (targetNeckAngle - this.driverNeckAngle) * Math.min(1, dt * 14);
    }
  }

  checkStunts(dt) {
    const isAir = !this.rearWheel.grounded && !this.frontWheel.grounded;
    if (isAir) {
      if (!this.midAir) {
        this.midAir = true;
        this.airTime = 0;
        this.totalRotation = 0;
        this.lastAngle = this.angle;
      }
      this.airTime += dt;

      let deltaAngle = this.angle - this.lastAngle;
      while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

      this.totalRotation += deltaAngle;
      this.lastAngle = this.angle;

      // 360 degree flip check
      if (Math.abs(this.totalRotation) >= Math.PI * 1.88) {
        const isBackflip = this.totalRotation < 0;
        this.totalRotation = 0;
        if (window.gameInstance) {
          window.gameInstance.triggerStunt(isBackflip ? 'BACKFLIP!' : 'FRONTFLIP!', 1000);
        }
      }
    } else {
      if (this.midAir) {
        if (this.airTime >= 1.3) {
          const reward = Math.floor(this.airTime * 350);
          if (window.gameInstance) {
            window.gameInstance.triggerStunt('AIR TIME!', reward);
          }
        }
        this.midAir = false;
        this.airTime = 0;
        this.totalRotation = 0;
      }
    }
  }

  getSpeedKmh() {
    const speedPix = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    return Math.floor(speedPix * 0.16);
  }

  getRPM(isGas) {
    const kmh = this.getSpeedKmh();
    if (isGas) {
      return Math.min(85, 25 + Math.floor(kmh * 1.2) + Math.floor(Math.random() * 5));
    }
    return Math.max(12, Math.floor(kmh * 0.7));
  }
}
