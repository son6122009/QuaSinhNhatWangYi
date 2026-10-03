/**
 * ==========================================================================
 * WANG YI'S 3D BIRTHDAY GARDEN 🌷🐰🎮
 * Senior 3D Web Creative Application — 17th Birthday Celestial Edition (2026)
 * Three.js (r128), GSAP, Web Audio API Synthesizer, Procedural Shaders & Particles
 * Birthday: 04/10/2009 (17th Birthday: 04/10/2026)
 * Zero-dependency, 100% file:/// and standalone web compatible.
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SOUND & AUDIO SYNTHESIZER ENGINE
     ========================================================================== */
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.bgAudio = document.getElementById('bg-audio');
      this.isPlayingCustomAudio = false;
      this.synthMusicTimer = null;
      this.synthStep = 0;
      this.initContext();
    }

    initContext() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio not available:', e);
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.2, volume = 0.2) {
      if (this.isMuted || !this.ctx) return;
      this.resume();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playJump() {
      if (this.isMuted || !this.ctx) return;
      this.resume();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch (e) {}
    }

    playCollect(type) {
      if (this.isMuted || !this.ctx) return;
      switch (type) {
        case 'flower': // +1
          this.playTone(523.25, 'triangle', 0.2, 0.2);
          setTimeout(() => this.playTone(659.25, 'sine', 0.22, 0.2), 60);
          break;
        case 'rose': // +5
          this.playTone(587.33, 'triangle', 0.25, 0.25);
          setTimeout(() => this.playTone(783.99, 'sine', 0.3, 0.22), 70);
          setTimeout(() => this.playTone(987.77, 'sine', 0.35, 0.2), 150);
          break;
        case 'star': // +10
        case 'wishStar':
          [659.25, 783.99, 1046.50, 1318.51].forEach((f, idx) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.3, 0.22), idx * 60);
          });
          break;
        case 'heart': // +15
          [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, idx) => {
            setTimeout(() => this.playTone(f, 'sine', 0.35, 0.25), idx * 45);
          });
          break;
        default:
          this.playTone(800, 'sine', 0.15, 0.2);
      }
    }

    playBlow() {
      if (this.isMuted || !this.ctx) return;
      this.resume();
      try {
        const bufferSize = this.ctx.sampleRate * 0.45;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 750;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
      } catch (e) {}
    }

    playFanfare() {
      if (this.isMuted || !this.ctx) return;
      const notes = [
        { f: 523.25, d: 0.18 },
        { f: 523.25, d: 0.18 },
        { f: 523.25, d: 0.18 },
        { f: 659.25, d: 0.35 },
        { f: 783.99, d: 0.5 },
        { f: 1046.50, d: 0.85 }
      ];
      let delay = 0;
      notes.forEach(n => {
        setTimeout(() => this.playTone(n.f, 'triangle', n.d, 0.28), delay);
        delay += n.d * 750;
      });
    }

    playPop() {
      this.playTone(880, 'sine', 0.1, 0.2);
    }

    playChime() {
      [1046.50, 1318.51, 1567.98].forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.4, 0.15), idx * 80);
      });
    }

    playWarp() {
      if (this.isMuted || !this.ctx) return;
      this.resume();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.85);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.85);
      } catch (e) {}
    }

    playHarmonicNote(idx = 0) {
      if (this.isMuted || !this.ctx) return;
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
      const freq = scale[idx % scale.length];
      this.playTone(freq, 'sine', 0.45, 0.22);
    }

    playSecret() {
      if (this.isMuted || !this.ctx) return;
      const secretNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      secretNotes.forEach((f, i) => {
        setTimeout(() => this.playTone(f, 'triangle', 0.25, 0.2), i * 90);
      });
    }

    startSynthBGM() {
      if (this.synthMusicTimer || this.isMuted) return;
      // Pentatonic Dreamy Music Box Theme
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const melody = [0, 2, 4, 3, 2, 0, 1, 3, 2, 4, 5, 4, 3, 1, 2, 0];
      this.synthStep = 0;
      this.synthMusicTimer = setInterval(() => {
        if (this.isMuted || this.isPlayingCustomAudio) return;
        const note = scale[melody[this.synthStep % melody.length]];
        this.playTone(note, 'sine', 0.55, 0.12);
        if (this.synthStep % 4 === 0) {
          this.playTone(note / 2, 'triangle', 0.8, 0.08);
        }
        this.synthStep++;
      }, 520);
    }

    stopSynthBGM() {
      if (this.synthMusicTimer) {
        clearInterval(this.synthMusicTimer);
        this.synthMusicTimer = null;
      }
    }

    playBGM() {
      if (this.isMuted) return;
      this.resume();
      if (this.bgAudio) {
        this.bgAudio.volume = 0.45;
        const p = this.bgAudio.play();
        if (p !== undefined) {
          p.then(() => {
            this.isPlayingCustomAudio = true;
            this.stopSynthBGM();
            const btn = document.getElementById('btn-toggle-music');
            if (btn) btn.classList.add('music-playing');
          }).catch(() => {
            this.isPlayingCustomAudio = false;
            this.startSynthBGM();
            const btn = document.getElementById('btn-toggle-music');
            if (btn) btn.classList.add('music-playing');
          });
        }
      } else {
        this.startSynthBGM();
      }
    }

    toggleMusic() {
      this.isMuted = !this.isMuted;
      const btn = document.getElementById('btn-toggle-music');
      if (this.isMuted) {
        if (this.bgAudio) this.bgAudio.pause();
        this.stopSynthBGM();
        if (btn) btn.classList.remove('music-playing');
        app.showToast('🔇 Đã tắt nhạc nền');
      } else {
        this.playBGM();
        if (btn) btn.classList.add('music-playing');
        app.showToast('🎵 Đã bật nhạc nền chúc mừng sinh nhật');
      }
    }
  }

  /* ==========================================================================
     2. MAIN 3D WORLD APPLICATION
     ========================================================================== */
  class Birthday3DWorld {
    constructor() {
      this.container = document.getElementById('webgl-container');
      this.sounds = new SoundManager();

      // Three.js Core
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.clock = new THREE.Clock();

      // State & Performance
      this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
      this.qualityLevel = this.isMobile ? 'MED' : 'HIGH';
      this.cameraMode = 'follow'; // 'follow' or 'free'
      this.skyMode = 'night'; // 'night', 'sunset', 'day'
      this.score = 0;
      this.targetScore = 50;
      this.isMysteryUnlocked = false;

      // Upgraded Landmark & Quest States (Star Shards & Memory Fragments)
      this.starShards = 0;
      this.memoryFragments = 0;
      this.starTreeAwakened = false;
      this.starTreeCurrentStep = 0;
      this.constellationSolved = false;
      this.constellationClicked = [];
      this.constellationNodes = [];
      this.constellationLines = [];
      this.wishLakeCollected = false;
      this.crystalShardCollected = false;
      this.moonPlatformTriggered = false;
      this.caveOpened = false;
      this.memoryBoxOpened = false;
      this.finalWishUnlocked = false;
      this.shroomSequence = [];
      this.memoryFlowersList = [];
      this.collectedFragments = [false, false, false, false, false];
      this.memoryFragmentsQuotes = [
        "04/10/2009 — Ngày một vì sao nhỏ tuyệt đẹp chào đời trong tình yêu thương.",
        "17 năm khôn lớn, tỏa sáng và trở thành một cô gái Wang Yi thật dịu dàng, kiên cường.",
        "Mỗi bước chân cậu đi qua đều để lại hương thơm hoa tulip và niềm vui cho mọi người.",
        "Tuổi 17 — mong cậu luôn dũng cảm bay xa, rực rỡ và tự do như ngàn vì sao trời.",
        "Dù thế giới ngoài kia có thế nào, nơi đây luôn có một khu vườn bình yên dành riêng cho cậu."
      ];

      // 3D Objects & Collections
      this.worldGroup = new THREE.Group();
      this.bunnyGroup = null;
      this.flowersList = [];
      this.treesList = [];
      this.collectiblesList = [];
      this.butterfliesList = [];
      this.mushroomsList = [];
      this.cakeCandles = [];
      this.fallingPetals = null;
      this.fireflies = null;
      this.fireworksParticles = null;
      this.waterfallMesh = null;

      // Shooting Star System
      this.shootingStars = [];
      this.shootingStarTimer = 0;

      // Zones coordinates for cinematic camera travel
      this.zones = {
        garden: { target: new THREE.Vector3(0, 0, 8), offset: new THREE.Vector3(0, 7, 18) },
        cottage: { target: new THREE.Vector3(-14, 1.5, -8), offset: new THREE.Vector3(-8, 9, 2) },
        starIsland: { target: new THREE.Vector3(0, 18, -26), offset: new THREE.Vector3(0, 14, 18) },
        plaza: { target: new THREE.Vector3(12, 1.2, -6), offset: new THREE.Vector3(12, 8, 5) },
        mystery: { target: new THREE.Vector3(0, 4, -42), offset: new THREE.Vector3(0, 10, 16) }
      };

      // Bunny Movement, Emotion State & AI
      this.bunny = {
        mesh: null,
        head: null,
        leftEar: null,
        rightEar: null,
        tail: null,
        pos: new THREE.Vector3(0, 0.5, 6),
        speed: 7.5,
        isJumping: false,
        jumpProgress: 0,
        rotation: 0,
        idleTimer: 0,
        wanderTimer: 0,
        state: 'IDLE', // 'IDLE', 'HAPPY', 'EXCITED', 'CURIOUS', 'SLEEPING', 'SURPRISED'
        emotionTimer: 0
      };

      this.keys = {};
      this.joystickDelta = { x: 0, y: 0 };
      this.easterEggsFound = { moon: 0, tail: false, flowers100: false, chimney: false, crystal: false, mushroom: false, tree: false };

      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.init();
    }

    /* ------------------------------------------------------------------------
       INITIALIZATION
       ------------------------------------------------------------------------ */
    init() {
      this.setupRenderer();
      this.setupScene();
      this.setupCamera();
      this.setupLighting();
      this.buildFloatingIsland();
      this.buildBunnyCharacter();
      this.buildFlowerGarden();
      this.buildBunnyCottage();
      this.buildStarIsland(); // Upgraded Floating Celestial Island & Star Tree
      this.buildBirthdayPlazaAndCake(); // Upgraded for 17th Birthday
      this.buildSecretIslandAndPortal(); // Upgraded Wang Yi's Secret Island & Magic Portal
      this.buildButterflies();
      this.buildParticleSystems();
      this.spawnInitialCollectibles();

      this.setupControls();
      this.setupEventListeners();
      this.setupUI();

      this.handleLoadingDone();

      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    setupRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: !this.isMobile, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      this.renderer.shadowMap.enabled = this.qualityLevel !== 'LOW';
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.container.appendChild(this.renderer.domElement);
    }

    setupScene() {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x130b29, 0.012);
      this.scene.add(this.worldGroup);
    }

    setupCamera() {
      this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 900);
      this.camera.position.set(0, 85, 95);
      this.camera.lookAt(0, 0, 0);
    }

    setupLighting() {
      // Soft Ambient Lighting
      this.ambientLight = new THREE.AmbientLight(0xd9b3ff, 0.9);
      this.scene.add(this.ambientLight);

      // Main Sun/Moon Directional Light with soft shadows
      this.dirLight = new THREE.DirectionalLight(0xfff3d6, 1.35);
      this.dirLight.position.set(25, 45, 25);
      this.dirLight.castShadow = this.qualityLevel !== 'LOW';
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 5;
      this.dirLight.shadow.camera.far = 130;
      this.dirLight.shadow.camera.left = -35;
      this.dirLight.shadow.camera.right = 35;
      this.dirLight.shadow.camera.top = 35;
      this.dirLight.shadow.camera.bottom = -35;
      this.dirLight.shadow.bias = -0.001;
      this.scene.add(this.dirLight);

      // Hemisphere Light (Celestial lavender / Soft mint)
      this.hemiLight = new THREE.HemisphereLight(0x9bd8ff, 0x5b3c7d, 0.65);
      this.scene.add(this.hemiLight);

      // Accent Warm Point Lights
      this.cakeGlow = new THREE.PointLight(0xffd166, 2.0, 14);
      this.cakeGlow.position.set(12, 3.8, -6);
      this.scene.add(this.cakeGlow);

      this.cottageGlow = new THREE.PointLight(0xffb366, 1.6, 12);
      this.cottageGlow.position.set(-14, 3, -6.5);
      this.scene.add(this.cottageGlow);
    }

    /* ------------------------------------------------------------------------
       WORLD BUILDER METHODS
       ------------------------------------------------------------------------ */
    buildFloatingIsland() {
      const islandGroup = new THREE.Group();

      // Top Meadow
      const topGeo = new THREE.CylinderGeometry(26, 24, 2.5, 42);
      const topMat = new THREE.MeshToonMaterial({ color: 0x76d89b });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.position.y = 0;
      topMesh.receiveShadow = true;
      islandGroup.add(topMesh);

      // Earth Bottom
      const bottomGeo = new THREE.ConeGeometry(24, 16, 32);
      const bottomMat = new THREE.MeshToonMaterial({ color: 0x4a325e });
      const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat);
      bottomMesh.position.y = -9.2;
      bottomMesh.rotation.x = Math.PI;
      islandGroup.add(bottomMesh);

      // Crystal Shards underneath
      for (let i = 0; i < 7; i++) {
        const shardGeo = new THREE.OctahedronGeometry(Math.random() * 1.5 + 0.8, 0);
        const shardMat = new THREE.MeshStandardMaterial({
          color: 0xd6b4fc,
          emissive: 0x8b5cf6,
          emissiveIntensity: 0.55,
          roughness: 0.2
        });
        const shard = new THREE.Mesh(shardGeo, shardMat);
        const angle = (i / 7) * Math.PI * 2;
        shard.position.set(Math.cos(angle) * (Math.random() * 10 + 6), -14 - Math.random() * 6, Math.sin(angle) * (Math.random() * 10 + 6));
        islandGroup.add(shard);
      }

      // Cobblestone Pathways
      const pathMat = new THREE.MeshToonMaterial({ color: 0xe8daf5 });
      for (let i = 0; i < 60; i++) {
        const stoneGeo = new THREE.CylinderGeometry(0.55 + Math.random() * 0.3, 0.65, 0.1, 8);
        const stone = new THREE.Mesh(stoneGeo, pathMat);
        const t = (i / 60) * Math.PI * 2;
        const rad = 4 + Math.sin(i * 0.5) * 8;
        stone.position.set(Math.cos(t) * rad, 1.28, Math.sin(t) * rad);
        stone.rotation.y = Math.random() * Math.PI;
        stone.receiveShadow = true;
        islandGroup.add(stone);
      }

      // Multi-Branch Organic Fantasy Trees (Upgraded Model)
      for (let i = 0; i < 9; i++) {
        const ang = (i / 9) * Math.PI * 2 + 0.2;
        const dist = 18 + Math.random() * 4;
        const tree = this.createStylizedTree();
        tree.position.set(Math.cos(ang) * dist, 1.25, Math.sin(ang) * dist);
        islandGroup.add(tree);
        this.treesList.push(tree);
      }

      this.worldGroup.add(islandGroup);
    }

    // Upgraded Tree with Curved Trunk, Secondary Branches & Multi-Layered Foliage
    createStylizedTree() {
      const tree = new THREE.Group();
      tree.userData = {
        windPhase: Math.random() * Math.PI * 2,
        windSpeed: Math.random() * 0.8 + 1.2,
        windAmp: Math.random() * 0.03 + 0.02
      };

      // Curved Trunk
      const trunkMat = new THREE.MeshToonMaterial({ color: 0x7a4e3f });
      const trunkBaseGeo = new THREE.CylinderGeometry(0.38, 0.6, 2.2, 8);
      trunkBaseGeo.translate(0, 1.1, 0);
      const trunkBase = new THREE.Mesh(trunkBaseGeo, trunkMat);
      trunkBase.castShadow = true;
      tree.add(trunkBase);

      // Curved Branch Upper
      const branchGeo = new THREE.CylinderGeometry(0.24, 0.38, 2.0, 8);
      branchGeo.translate(0, 1.0, 0);
      const branchUpper = new THREE.Mesh(branchGeo, trunkMat);
      branchUpper.position.set(0, 2.0, 0);
      branchUpper.rotation.z = (Math.random() - 0.5) * 0.25;
      branchUpper.castShadow = true;
      tree.add(branchUpper);

      // Foliage Clusters with Subtle Color Gradient (Pastel Mint, Sakura Pink, Lavender)
      const colors = [0x76d89b, 0xffb7d5, 0xd6b4fc, 0x98f5e1, 0xffccd5];
      const folColor = colors[Math.floor(Math.random() * colors.length)];
      const folMat = new THREE.MeshToonMaterial({ color: folColor });

      const clusterOffsets = [
        { x: 0, y: 3.8, z: 0, r: 1.8 },
        { x: -0.8, y: 4.4, z: 0.4, r: 1.4 },
        { x: 0.8, y: 4.5, z: -0.3, r: 1.5 },
        { x: 0.3, y: 5.2, z: 0.5, r: 1.3 },
        { x: -0.4, y: 5.6, z: -0.4, r: 1.2 }
      ];

      clusterOffsets.forEach(c => {
        const folGeo = new THREE.DodecahedronGeometry(c.r, 1);
        const folMesh = new THREE.Mesh(folGeo, folMat);
        folMesh.position.set(c.x, c.y, c.z);
        folMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        folMesh.castShadow = true;
        tree.add(folMesh);
      });

      return tree;
    }

    /* ------------------------------------------------------------------------
       BUNNY CHARACTER & EMOTIONS
       ------------------------------------------------------------------------ */
    buildBunnyCharacter() {
      this.bunnyGroup = new THREE.Group();

      const furMat = new THREE.MeshToonMaterial({ color: 0xffffff });
      const innerEarMat = new THREE.MeshToonMaterial({ color: 0xffb6c7 });
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x22132d, roughness: 0.1 });
      const noseMat = new THREE.MeshToonMaterial({ color: 0xff8da1 });
      const blushMat = new THREE.MeshBasicMaterial({ color: 0xff7096, transparent: true, opacity: 0.65 });

      // Body
      const bodyGeo = new THREE.SphereGeometry(0.85, 20, 20);
      const body = new THREE.Mesh(bodyGeo, furMat);
      body.scale.set(0.95, 1.1, 0.95);
      body.position.y = 0.85;
      body.castShadow = true;
      this.bunnyGroup.add(body);

      // Head Group
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.85, 0.1);

      const headGeo = new THREE.SphereGeometry(0.75, 20, 20);
      const head = new THREE.Mesh(headGeo, furMat);
      head.castShadow = true;
      headGroup.add(head);

      // Eyes
      const eyeGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.28, 0.12, 0.65);
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.28, 0.12, 0.65);
      headGroup.add(leftEye, rightEye);

      // Specular Highlights
      const shineGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const leftShine = new THREE.Mesh(shineGeo, shineMat);
      leftShine.position.set(-0.25, 0.16, 0.74);
      const rightShine = new THREE.Mesh(shineGeo, shineMat);
      rightShine.position.set(0.31, 0.16, 0.74);
      headGroup.add(leftShine, rightShine);

      // Nose
      const noseGeo = new THREE.ConeGeometry(0.07, 0.08, 6);
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0.02, 0.76);
      nose.rotation.x = Math.PI / 2;
      headGroup.add(nose);

      // Cheeks Blush
      const blushGeo = new THREE.CircleGeometry(0.12, 12);
      const leftBlush = new THREE.Mesh(blushGeo, blushMat);
      leftBlush.position.set(-0.42, -0.06, 0.62);
      leftBlush.rotation.y = -0.4;
      const rightBlush = new THREE.Mesh(blushGeo, blushMat);
      rightBlush.position.set(0.42, -0.06, 0.62);
      rightBlush.rotation.y = 0.4;
      headGroup.add(leftBlush, rightBlush);

      // Ears
      const earGeo = new THREE.CylinderGeometry(0.08, 0.18, 1.2, 14);
      earGeo.translate(0, 0.6, 0);

      this.bunny.leftEar = new THREE.Mesh(earGeo, furMat);
      this.bunny.leftEar.position.set(-0.28, 0.6, 0);
      this.bunny.leftEar.rotation.z = 0.15;
      this.bunny.leftEar.castShadow = true;

      const innerEarGeo = new THREE.CylinderGeometry(0.04, 0.1, 0.9, 12);
      innerEarGeo.translate(0, 0.5, 0.05);
      const innerL = new THREE.Mesh(innerEarGeo, innerEarMat);
      this.bunny.leftEar.add(innerL);

      this.bunny.rightEar = new THREE.Mesh(earGeo, furMat);
      this.bunny.rightEar.position.set(0.28, 0.6, 0);
      this.bunny.rightEar.rotation.z = -0.15;
      this.bunny.rightEar.castShadow = true;

      const innerR = new THREE.Mesh(innerEarGeo, innerEarMat);
      this.bunny.rightEar.add(innerR);

      headGroup.add(this.bunny.leftEar, this.bunny.rightEar);
      this.bunnyGroup.add(headGroup);
      this.bunny.head = headGroup;

      // Fluffy Tail
      const tailGeo = new THREE.SphereGeometry(0.3, 14, 14);
      const tail = new THREE.Mesh(tailGeo, furMat);
      tail.position.set(0, 0.6, -0.9);
      tail.name = 'bunnyTail';
      this.bunnyGroup.add(tail);
      this.bunny.tail = tail;

      // Feet
      const footGeo = new THREE.SphereGeometry(0.24, 12, 12);
      footGeo.scale(1, 0.6, 1.6);
      const leftFoot = new THREE.Mesh(footGeo, furMat);
      leftFoot.position.set(-0.45, 0.15, 0.1);
      const rightFoot = new THREE.Mesh(footGeo, furMat);
      rightFoot.position.set(0.45, 0.15, 0.1);
      this.bunnyGroup.add(leftFoot, rightFoot);

      // Flower Basket
      const basketGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.4, 10);
      const basketMat = new THREE.MeshToonMaterial({ color: 0xba7c59 });
      const basket = new THREE.Mesh(basketGeo, basketMat);
      basket.position.set(0.65, 0.9, -0.15);
      basket.rotation.z = -0.2;
      this.bunnyGroup.add(basket);

      this.bunnyGroup.position.copy(this.bunny.pos);
      this.worldGroup.add(this.bunnyGroup);
      this.bunny.mesh = this.bunnyGroup;
    }

    /* ------------------------------------------------------------------------
       UPGRADED FLOWER GARDEN & PROCEDURAL WIND
       ------------------------------------------------------------------------ */
    buildFlowerGarden() {
      const gardenCenter = new THREE.Vector3(0, 1.25, 9);
      const flowerTypes = ['tulip', 'rose', 'daisy', 'sakura', 'fantasy'];

      for (let i = 0; i < 48; i++) {
        const type = flowerTypes[i % flowerTypes.length];
        const flower = this.createFlower(type);
        const radius = Math.random() * 9 + 2;
        const angle = Math.random() * Math.PI * 2;
        flower.position.set(
          gardenCenter.x + Math.cos(angle) * radius,
          gardenCenter.y,
          gardenCenter.z + Math.sin(angle) * radius * 0.7
        );
        flower.rotation.y = Math.random() * Math.PI * 2;
        this.worldGroup.add(flower);
        this.flowersList.push(flower);
      }
    }

    createFlower(type) {
      const flowerGroup = new THREE.Group();
      flowerGroup.userData = {
        type,
        originalScale: 1,
        isBloomed: false,
        windPhase: Math.random() * Math.PI * 2,
        windSpeed: Math.random() * 1.5 + 1.8,
        windAmp: Math.random() * 0.06 + 0.05
      };

      // Stem (Curved spline tube)
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.2, 8);
      stemGeo.translate(0, 0.6, 0);
      const stemMat = new THREE.MeshToonMaterial({ color: 0x48bb78 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      flowerGroup.add(stem);

      // Leaves
      const leafGeo = new THREE.SphereGeometry(0.2, 8, 8);
      leafGeo.scale(0.3, 1, 1.8);
      const leaf1 = new THREE.Mesh(leafGeo, stemMat);
      leaf1.position.set(0.15, 0.4, 0);
      leaf1.rotation.z = 0.5;
      flowerGroup.add(leaf1);

      // Blossom Head
      const headGroup = new THREE.Group();
      headGroup.position.y = 1.2;

      let petalColor = 0xff758c;
      if (type === 'tulip') petalColor = Math.random() > 0.5 ? 0xff70a6 : 0xff9ebb;
      if (type === 'rose') petalColor = 0xe63946;
      if (type === 'daisy') petalColor = 0xffffff;
      if (type === 'sakura') petalColor = 0xffccd5;
      if (type === 'fantasy') petalColor = 0x80ed99;

      const petalMat = new THREE.MeshToonMaterial({
        color: petalColor,
        emissive: type === 'fantasy' ? 0x00f5d4 : 0x000000,
        emissiveIntensity: type === 'fantasy' ? 0.5 : 0
      });

      if (type === 'tulip') {
        const petalGeo = new THREE.ConeGeometry(0.35, 0.65, 6);
        const blossom = new THREE.Mesh(petalGeo, petalMat);
        blossom.rotation.x = Math.PI;
        headGroup.add(blossom);
      } else if (type === 'daisy') {
        const centerGeo = new THREE.SphereGeometry(0.18, 10, 10);
        const centerMat = new THREE.MeshToonMaterial({ color: 0xffd166 });
        headGroup.add(new THREE.Mesh(centerGeo, centerMat));

        for (let p = 0; p < 8; p++) {
          const pGeo = new THREE.SphereGeometry(0.12, 8, 8);
          pGeo.scale(0.6, 0.3, 1.5);
          pGeo.translate(0, 0, 0.28);
          const petal = new THREE.Mesh(pGeo, petalMat);
          petal.rotation.y = (p / 8) * Math.PI * 2;
          headGroup.add(petal);
        }
      } else if (type === 'sakura') {
        for (let s = 0; s < 5; s++) {
          const sGeo = new THREE.SphereGeometry(0.16, 8, 8);
          sGeo.scale(0.8, 0.25, 1.4);
          sGeo.translate(0, 0, 0.2);
          const pet = new THREE.Mesh(sGeo, petalMat);
          pet.rotation.y = (s / 5) * Math.PI * 2;
          headGroup.add(pet);
        }
      } else {
        // Layered Rose / Fantasy Flower
        for (let r = 0; r < 6; r++) {
          const rGeo = new THREE.SphereGeometry(0.24, 8, 8);
          const rMesh = new THREE.Mesh(rGeo, petalMat);
          rMesh.position.set(Math.cos(r) * 0.12, 0, Math.sin(r) * 0.12);
          headGroup.add(rMesh);
        }
      }

      flowerGroup.add(headGroup);
      flowerGroup.head = headGroup;
      return flowerGroup;
    }

    /* ------------------------------------------------------------------------
       BUNNY COTTAGE
       ------------------------------------------------------------------------ */
    buildBunnyCottage() {
      const houseGroup = new THREE.Group();
      houseGroup.position.set(-14, 1.25, -8);

      const baseGeo = new THREE.BoxGeometry(6.5, 4.2, 5.5);
      const baseMat = new THREE.MeshToonMaterial({ color: 0xfff0f5 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 2.1;
      base.castShadow = true;
      houseGroup.add(base);

      const roofGeo = new THREE.ConeGeometry(5.4, 3.2, 4);
      const roofMat = new THREE.MeshToonMaterial({ color: 0x9b5de5 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 5.6;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      houseGroup.add(roof);

      const chimGeo = new THREE.BoxGeometry(0.9, 2.6, 0.9);
      const chimMat = new THREE.MeshToonMaterial({ color: 0x72517d });
      const chimney = new THREE.Mesh(chimGeo, chimMat);
      chimney.position.set(1.8, 5.8, 1);
      chimney.name = 'houseChimney';
      houseGroup.add(chimney);

      const doorGeo = new THREE.BoxGeometry(1.4, 2.2, 0.2);
      const doorMat = new THREE.MeshToonMaterial({ color: 0xb56576 });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, 1.1, 2.8);
      houseGroup.add(door);

      const winGeo = new THREE.BoxGeometry(1.1, 1.1, 0.15);
      const winMat = new THREE.MeshStandardMaterial({ color: 0xffeaa7, emissive: 0xffd166, emissiveIntensity: 0.8 });
      const winL = new THREE.Mesh(winGeo, winMat);
      winL.position.set(-1.8, 2.4, 2.8);
      const winR = new THREE.Mesh(winGeo, winMat);
      winR.position.set(1.8, 2.4, 2.8);
      houseGroup.add(winL, winR);

      this.worldGroup.add(houseGroup);
      this.bunnyHouse = houseGroup;
    }

    /* ------------------------------------------------------------------------
       1. UPGRADED STAR ISLAND: FLOATING CELESTIAL ISLAND, STAR TREE & MOON PLATFORM
       ------------------------------------------------------------------------ */
    buildStarIsland() {
      const starIslandGroup = new THREE.Group();
      starIslandGroup.position.set(0, 18, -26);

      // Celestial Island Rock Base
      const rockGeo = new THREE.CylinderGeometry(9.5, 7.5, 2.8, 32);
      const rockMat = new THREE.MeshToonMaterial({ color: 0x5b3c7d });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      starIslandGroup.add(rock);

      const grassGeo = new THREE.CylinderGeometry(9.8, 9.5, 0.8, 32);
      const grassMat = new THREE.MeshToonMaterial({ color: 0x8ecae6 });
      const grass = new THREE.Mesh(grassGeo, grassMat);
      grass.position.y = 1.4;
      starIslandGroup.add(grass);

      // Floating clouds billowing underneath
      for (let c = 0; c < 5; c++) {
        const puffGeo = new THREE.SphereGeometry(2.2 + Math.random(), 10, 10);
        puffGeo.scale(1.6, 0.6, 1.4);
        const puffMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.82 });
        const puff = new THREE.Mesh(puffGeo, puffMat);
        const ca = (c / 5) * Math.PI * 2;
        puff.position.set(Math.cos(ca) * 6, -1.8, Math.sin(ca) * 6);
        starIslandGroup.add(puff);
      }

      // Star Tree (Cây Sao Khổng Lồ ở trung tâm)
      const starTree = new THREE.Group();
      starTree.position.set(0, 1.8, 0);

      // Curved Fantasy Trunk
      const trunkMat = new THREE.MeshToonMaterial({ color: 0x6d597a });
      const trunkGeo = new THREE.CylinderGeometry(0.55, 0.85, 4.5, 10);
      trunkGeo.translate(0, 2.25, 0);
      const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
      starTree.add(trunkMesh);

      // Spreading Boughs
      const bough1Geo = new THREE.CylinderGeometry(0.3, 0.45, 2.8, 8);
      bough1Geo.translate(0, 1.4, 0);
      const bough1 = new THREE.Mesh(bough1Geo, trunkMat);
      bough1.position.set(0, 3.8, 0);
      bough1.rotation.z = 0.55;
      const bough2 = new THREE.Mesh(bough1Geo, trunkMat);
      bough2.position.set(0, 4.0, 0);
      bough2.rotation.z = -0.55;
      starTree.add(bough1, bough2);

      // Canopy of Glowing Starlight Clusters
      const folMat = new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xffbe0b,
        emissiveIntensity: 0.65,
        roughness: 0.2
      });

      const foliageClusters = [
        { x: 0, y: 5.8, z: 0, r: 2.6 },
        { x: -1.8, y: 5.2, z: 0.6, r: 1.8 },
        { x: 1.8, y: 5.4, z: -0.6, r: 1.8 },
        { x: 0.8, y: 6.8, z: 0.8, r: 1.6 },
        { x: -0.8, y: 7.0, z: -0.6, r: 1.5 }
      ];

      foliageClusters.forEach(fc => {
        const cGeo = new THREE.DodecahedronGeometry(fc.r, 1);
        const cMesh = new THREE.Mesh(cGeo, folMat);
        cMesh.position.set(fc.x, fc.y, fc.z);
        starTree.add(cMesh);
      });

      // Hanging Star Lanterns — INTERACTIVE (named for raycasting)
      this.starLanterns = [];
      this.starTreeSequence = [0, 2, 4, 1, 3]; // correct click order among 6 lanterns
      for (let sl = 0; sl < 6; sl++) {
        const slGeo = new THREE.OctahedronGeometry(0.45, 0);
        const slMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffd166,
          emissiveIntensity: 0.95
        });
        const lantern = new THREE.Mesh(slGeo, slMat);
        const la = (sl / 6) * Math.PI * 2;
        lantern.position.set(Math.cos(la) * 2.2, 4.2 + Math.sin(sl) * 0.6, Math.sin(la) * 2.2);
        lantern.name = 'treeStar_' + sl;
        lantern.userData.lanternIndex = sl;
        starTree.add(lantern);
        this.starLanterns.push(lantern);
      }

      starIslandGroup.add(starTree);
      this.starTree = starTree;

      // Moon Platform (Perched on the cloud edge)
      const moonPlatGroup = new THREE.Group();
      moonPlatGroup.position.set(0, 1.6, 8.5);

      const crescentPlatGeo = new THREE.TorusGeometry(2.4, 0.45, 12, 32, Math.PI);
      const crescentPlatMat = new THREE.MeshStandardMaterial({
        color: 0xfff9e6,
        emissive: 0xffd166,
        emissiveIntensity: 0.6
      });
      const crescentPlat = new THREE.Mesh(crescentPlatGeo, crescentPlatMat);
      crescentPlat.rotation.x = Math.PI / 2;
      moonPlatGroup.add(crescentPlat);

      // Moon Platform base disc
      const moonDiscGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.25, 24);
      const moonDiscMat = new THREE.MeshStandardMaterial({ color: 0xfff9e6, emissive: 0xffd166, emissiveIntensity: 0.35 });
      const moonDisc = new THREE.Mesh(moonDiscGeo, moonDiscMat);
      moonDisc.position.y = -0.3;
      moonDisc.name = 'moonPlatform';
      moonPlatGroup.add(moonDisc);

      starIslandGroup.add(moonPlatGroup);
      this.moonPlatform = moonPlatGroup;

      // ③ WISH LAKE — glowing water plane with ripple mesh
      const lakeGeo = new THREE.CircleGeometry(3.8, 32);
      const lakeMat = new THREE.MeshStandardMaterial({
        color: 0x4ecdc4,
        emissive: 0x1a9e9a,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.82,
        roughness: 0.1,
        metalness: 0.3,
        side: THREE.DoubleSide
      });
      const lake = new THREE.Mesh(lakeGeo, lakeMat);
      lake.rotation.x = -Math.PI / 2;
      lake.position.set(7, 1.85, 2);
      lake.name = 'wishLakeWater';
      starIslandGroup.add(lake);
      this.wishLake = lake;

      // Wish Lake glow ring
      const lakeRingGeo = new THREE.TorusGeometry(3.9, 0.25, 8, 32);
      const lakeRingMat = new THREE.MeshStandardMaterial({ color: 0x80ffe8, emissive: 0x80ffe8, emissiveIntensity: 0.7, transparent: true, opacity: 0.6 });
      const lakeRing = new THREE.Mesh(lakeRingGeo, lakeRingMat);
      lakeRing.rotation.x = -Math.PI / 2;
      lakeRing.position.set(7, 1.9, 2);
      starIslandGroup.add(lakeRing);

      // Lake shard glow spot (hidden, appears when you click right spot)
      const lakeShardSpotGeo = new THREE.SphereGeometry(0.35, 10, 10);
      const lakeShardSpotMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 1.2, transparent: true, opacity: 0.8 });
      const lakeShardSpot = new THREE.Mesh(lakeShardSpotGeo, lakeShardSpotMat);
      lakeShardSpot.position.set(7.4, 2.1, 1.6);
      lakeShardSpot.name = 'wishLakeWater';
      lakeShardSpot.userData.isLakeSpot = true;
      starIslandGroup.add(lakeShardSpot);
      this.lakeShardSpot = lakeShardSpot;

      // ④ CONSTELLATION GARDEN — 7 star marker nodes on ground
      this.constellationNodes = [];
      const constellationPositions = [
        [-6, 2.0, 4], [-4, 2.0, 6.5], [-3, 2.0, 3.5],
        [-6.5, 2.0, 0.5], [-5, 2.0, -1.5], [-3.5, 2.0, 1],
        [-4.5, 2.0, 5]
      ];
      constellationPositions.forEach((pos, idx) => {
        const nodeGeo = new THREE.OctahedronGeometry(0.28, 0);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: 0x9ca3af,
          emissive: 0x6366f1,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.75
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(...pos);
        node.name = 'constellationPoint_' + idx;
        node.userData.nodeIndex = idx;
        starIslandGroup.add(node);
        this.constellationNodes.push(node);
      });

      // ⑤ SHOOTING STAR OBSERVATORY — small fantasy tower
      const obsGroup = new THREE.Group();
      obsGroup.position.set(-7.5, 2.0, -3);
      const obsTowerGeo = new THREE.CylinderGeometry(0.65, 0.85, 2.8, 8);
      const obsTowerMat = new THREE.MeshToonMaterial({ color: 0x4a1f6e });
      const obsTower = new THREE.Mesh(obsTowerGeo, obsTowerMat);
      obsTower.position.y = 1.4;
      obsGroup.add(obsTower);
      const obsDomeGeo = new THREE.SphereGeometry(0.8, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const obsDomeMat = new THREE.MeshToonMaterial({ color: 0x7c3aed });
      const obsDome = new THREE.Mesh(obsDomeGeo, obsDomeMat);
      obsDome.position.y = 2.8;
      obsGroup.add(obsDome);
      const obsLensGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.1, 8);
      const obsLensMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, emissive: 0x93c5fd, emissiveIntensity: 0.8 });
      const obsLens = new THREE.Mesh(obsLensGeo, obsLensMat);
      obsLens.position.set(0.5, 3.2, 0);
      obsLens.rotation.z = -Math.PI / 4;
      obsLens.name = 'observatory';
      obsGroup.add(obsLens);
      starIslandGroup.add(obsGroup);
      this.observatoryGroup = obsGroup;

      // STAR SHARD COLLECTIBLES on Star Island (5 total, collected via quests)
      // These are spawned by quest completion, not placed upfront
      // But we pre-create the crystal rock hidden shard (Shard 4)
      const hiddenRockGeo = new THREE.DodecahedronGeometry(1.1, 0);
      const hiddenRockMat = new THREE.MeshToonMaterial({ color: 0x3d1a6e });
      const hiddenRock = new THREE.Mesh(hiddenRockGeo, hiddenRockMat);
      hiddenRock.position.set(-8.5, 2.2, -6);
      starIslandGroup.add(hiddenRock);
      // Hidden shard behind rock
      const hiddenShardGeo = new THREE.OctahedronGeometry(0.38, 0);
      const hiddenShardMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 1.0, transparent: true, opacity: 0.9 });
      const hiddenShard = new THREE.Mesh(hiddenShardGeo, hiddenShardMat);
      hiddenShard.position.set(-8.2, 2.6, -6.8);
      hiddenShard.name = 'starShard_3';
      hiddenShard.userData.shardIndex = 3;
      starIslandGroup.add(hiddenShard);
      this.hiddenRockShard = hiddenShard;

      // Star Shard near Moon Platform (Shard 2)
      const moonShardGeo = new THREE.OctahedronGeometry(0.38, 0);
      const moonShardMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 1.0, transparent: true, opacity: 0.9 });
      const moonShard = new THREE.Mesh(moonShardGeo, moonShardMat);
      moonShard.position.set(1.5, 3.5, 9.5);
      moonShard.name = 'starShard_2';
      moonShard.userData.shardIndex = 2;
      starIslandGroup.add(moonShard);
      this.moonShard = moonShard;

      // Stepping Cloud Stones leading to Star Island
      for (let s = 0; s < 7; s++) {
        const cloudGeo = new THREE.SphereGeometry(1.3, 10, 10);
        cloudGeo.scale(1.5, 0.5, 1.3);
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
        const step = new THREE.Mesh(cloudGeo, cloudMat);
        const ratio = s / 6;
        step.position.set(Math.sin(ratio * 3) * 7, 2.5 + ratio * 14, -4 - ratio * 20);
        this.worldGroup.add(step);
      }

      this.worldGroup.add(starIslandGroup);
      this.starIsland = starIslandGroup;
    }

    /* ------------------------------------------------------------------------
       2. BIRTHDAY PLAZA & 17TH BIRTHDAY CAKE
       ------------------------------------------------------------------------ */
    buildBirthdayPlazaAndCake() {
      const plazaGroup = new THREE.Group();
      plazaGroup.position.set(12, 1.25, -6);

      const floorGeo = new THREE.CylinderGeometry(7, 7.2, 0.3, 32);
      const floorMat = new THREE.MeshToonMaterial({ color: 0xffe5ec });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.receiveShadow = true;
      plazaGroup.add(floor);

      const cakeGroup = new THREE.Group();
      cakeGroup.position.set(0, 0.15, 0);

      // Bottom Tier
      const t1Geo = new THREE.CylinderGeometry(2.4, 2.5, 1.2, 32);
      const t1Mat = new THREE.MeshToonMaterial({ color: 0xffb3c6 });
      const t1 = new THREE.Mesh(t1Geo, t1Mat);
      t1.position.y = 0.6;
      t1.castShadow = true;
      cakeGroup.add(t1);

      // Top Tier
      const t2Geo = new THREE.CylinderGeometry(1.6, 1.7, 1.0, 32);
      const t2Mat = new THREE.MeshToonMaterial({ color: 0xffd5e2 });
      const t2 = new THREE.Mesh(t2Geo, t2Mat);
      t2.position.y = 1.7;
      t2.castShadow = true;
      cakeGroup.add(t2);

      // Strawberries
      for (let s = 0; s < 8; s++) {
        const berryGeo = new THREE.ConeGeometry(0.18, 0.3, 8);
        const berryMat = new THREE.MeshToonMaterial({ color: 0xe63946 });
        const berry = new THREE.Mesh(berryGeo, berryMat);
        const a = (s / 8) * Math.PI * 2;
        berry.position.set(Math.cos(a) * 1.5, 2.3, Math.sin(a) * 1.5);
        cakeGroup.add(berry);
      }

      // 5 Candles with procedural flames
      this.cakeCandles = [];
      for (let c = 0; c < 5; c++) {
        const candleGroup = new THREE.Group();
        const ang = (c / 5) * Math.PI * 2;
        candleGroup.position.set(Math.cos(ang) * 0.9, 2.2, Math.sin(ang) * 0.9);

        const stickGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8);
        const stickMat = new THREE.MeshToonMaterial({ color: c % 2 === 0 ? 0xffbe0b : 0xf72585 });
        const stick = new THREE.Mesh(stickGeo, stickMat);
        stick.position.y = 0.3;
        candleGroup.add(stick);

        const flameGeo = new THREE.ConeGeometry(0.1, 0.25, 8);
        flameGeo.translate(0, 0.12, 0);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.y = 0.6;
        candleGroup.add(flame);

        candleGroup.flame = flame;
        candleGroup.isLit = true;
        cakeGroup.add(candleGroup);
        this.cakeCandles.push(candleGroup);
      }

      // 17th Birthday Name Banner
      const bannerGeo = new THREE.BoxGeometry(2.4, 0.55, 0.1);
      const bannerMat = new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xffbe0b,
        emissiveIntensity: 0.4
      });
      const banner = new THREE.Mesh(bannerGeo, bannerMat);
      banner.position.set(0, 1.2, 2.45);
      cakeGroup.add(banner);

      plazaGroup.add(cakeGroup);
      this.worldGroup.add(plazaGroup);
      this.birthdayCake = cakeGroup;
    }

    /* ------------------------------------------------------------------------
       3. ✦ WANG YI'S SECRET ISLAND ✦ & SECRET PORTAL
       ------------------------------------------------------------------------ */
    buildSecretIslandAndPortal() {
      // 1. Secret Portal on Main Meadow (at z = -12)
      const portalRingGeo = new THREE.RingGeometry(1.6, 2.4, 32);
      const portalRingMat = new THREE.MeshStandardMaterial({
        color: 0x9b5de5,
        emissive: 0x7209b7,
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide
      });
      this.secretPortal = new THREE.Mesh(portalRingGeo, portalRingMat);
      this.secretPortal.rotation.x = -Math.PI / 2;
      this.secretPortal.position.set(0, 1.28, -12);
      this.secretPortal.name = 'secretPortal';
      this.worldGroup.add(this.secretPortal);

      // 2. ✦ Wang Yi's Secret Island (Positioned at 0, 4, -42)
      const secretIslandGroup = new THREE.Group();
      secretIslandGroup.position.set(0, 4, -42);

      // Fantasy Floating Island Terrain
      const sRockGeo = new THREE.CylinderGeometry(14, 11, 3.5, 32);
      const sRockMat = new THREE.MeshToonMaterial({ color: 0x24143a });
      const sRock = new THREE.Mesh(sRockGeo, sRockMat);
      secretIslandGroup.add(sRock);

      const sGrassGeo = new THREE.CylinderGeometry(14.4, 14, 1.0, 32);
      const sGrassMat = new THREE.MeshToonMaterial({ color: 0x582f7d }); // Dreamy violet meadow
      const sGrass = new THREE.Mesh(sGrassGeo, sGrassMat);
      sGrass.position.y = 1.8;
      secretIslandGroup.add(sGrass);

      // Grand Birthday Treasure Pavilion in center
      const pavGroup = new THREE.Group();
      pavGroup.position.set(0, 1.8, 0);

      // Gazebo Columns
      const colMat = new THREE.MeshToonMaterial({ color: 0xd6b4fc });
      for (let i = 0; i < 6; i++) {
        const colGeo = new THREE.CylinderGeometry(0.25, 0.3, 4.2, 8);
        const col = new THREE.Mesh(colGeo, colMat);
        const ang = (i / 6) * Math.PI * 2;
        col.position.set(Math.cos(ang) * 4.2, 2.1, Math.sin(ang) * 4.2);
        pavGroup.add(col);
      }

      const domeGeo = new THREE.SphereGeometry(4.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshToonMaterial({ color: 0x9b5de5 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 4.2;
      pavGroup.add(dome);

      // Giant Golden Present Box inside
      const giftBoxGroup = new THREE.Group();
      giftBoxGroup.position.set(0, 1.3, 0);

      const boxGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xff70a6, roughness: 0.25 });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      giftBoxGroup.add(boxMesh);

      const ribMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.2 });
      giftBoxGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.45, 2.45, 0.4), ribMat));
      giftBoxGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.45, 2.45), ribMat));

      // MEMORY BOX — replaces regular gift box, interactive when 5 fragments
      this.memoryBoxGroup = giftBoxGroup;
      this.memoryBoxGroup.name = 'memoryBox';
      pavGroup.add(giftBoxGroup);

      // Memory Box lid (separate for opening animation)
      const boxLidGeo = new THREE.BoxGeometry(2.5, 0.35, 2.5);
      const boxLidMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.2 });
      const boxLid = new THREE.Mesh(boxLidGeo, boxLidMat);
      boxLid.position.set(0, 1.4, 0);
      this.memoryBoxGroup.add(boxLid);
      this.memoryBoxLid = boxLid;

      secretIslandGroup.add(pavGroup);
      this.pavGroup = pavGroup;

      // 💐 MEMORY GARDEN — 5 special glowing Memory Flowers
      this.memoryFlowersList = [];
      const memFlowerPositions = [
        [-9, 2.3, 2], [-10, 2.3, -1], [-11, 2.3, 4],
        [-8, 2.3, -4], [-12, 2.3, 0.5]
      ];
      memFlowerPositions.forEach((pos, idx) => {
        const mfGroup = new THREE.Group();
        mfGroup.position.set(...pos);

        // Stem
        const mfStemGeo = new THREE.CylinderGeometry(0.07, 0.1, 0.9, 8);
        const mfStemMat = new THREE.MeshToonMaterial({ color: 0x7fc97f });
        mfGroup.add(new THREE.Mesh(mfStemGeo, mfStemMat));

        // Glowing petal head
        const mfHeadGeo = new THREE.DodecahedronGeometry(0.42, 0);
        const mfHeadMat = new THREE.MeshStandardMaterial({
          color: [0xff70a6, 0xd4bfff, 0x80ffe8, 0xffd166, 0xff9ebb][idx % 5],
          emissive: [0xff70a6, 0x9b5de5, 0x00f5d4, 0xffbe0b, 0xff4d6d][idx % 5],
          emissiveIntensity: 0.85,
          roughness: 0.2
        });
        const mfHead = new THREE.Mesh(mfHeadGeo, mfHeadMat);
        mfHead.position.y = 1.0;
        mfHead.name = 'memoryFlower_' + idx;
        mfHead.userData.flowerIndex = idx;
        mfGroup.add(mfHead);

        secretIslandGroup.add(mfGroup);
        this.memoryFlowersList.push({ group: mfGroup, head: mfHead, collected: false, idx });
      });

      // 🍄 GLOW MUSHROOM FOREST — 5 mushrooms with distinct colors for puzzle
      const mushroomColors = [0x60a5fa, 0xf472b6, 0x4ade80, 0xfbbf24, 0xa855f7];
      const mushroomEmissives = [0x3b82f6, 0xec4899, 0x22c55e, 0xf59e0b, 0x9333ea];
      this.puzzleMushrooms = [];
      this.shroomSequenceTarget = [0, 2, 4, 1, 3]; // Blue→Green→Purple→Pink→Gold
      this.shroomSequence = [];
      for (let m = 0; m < 5; m++) {
        const shroom = new THREE.Group();
        shroom.name = 'puzzleMushroom';
        shroom.userData.mushroomIndex = m;

        const stemGeo = new THREE.CylinderGeometry(0.15, 0.22, 0.9, 8);
        stemGeo.translate(0, 0.45, 0);
        const stemMat = new THREE.MeshToonMaterial({ color: 0xfff0f5 });
        shroom.add(new THREE.Mesh(stemGeo, stemMat));

        const capGeo = new THREE.SphereGeometry(0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const capMat = new THREE.MeshStandardMaterial({
          color: mushroomColors[m],
          emissive: mushroomEmissives[m],
          emissiveIntensity: 0.5,
          roughness: 0.3
        });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.9;
        cap.name = 'puzzleMushroom';
        cap.userData.mushroomIndex = m;
        shroom.add(cap);

        const puzzleAngle = (m / 5) * Math.PI * 2;
        shroom.position.set(Math.cos(puzzleAngle) * 9.5, 2.3, Math.sin(puzzleAngle) * 9.5 - 2);
        secretIslandGroup.add(shroom);
        this.mushroomsList.push(shroom);
        this.puzzleMushrooms.push({ group: shroom, cap, mat: capMat, defaultIntensity: 0.5 });
      }

      // 🌊 CRYSTAL WATERFALL — enhanced with clickable crystal
      const waterGeo = new THREE.PlaneGeometry(2.8, 12, 1, 8);
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x80ed99,
        transparent: true,
        opacity: 0.75,
        roughness: 0.1
      });
      const waterfall = new THREE.Mesh(waterGeo, waterMat);
      waterfall.position.set(0, -3.2, 14.1);
      secretIslandGroup.add(waterfall);
      this.waterfallMesh = waterfall;

      // Clickable Crystal next to waterfall
      const crystalGeo = new THREE.OctahedronGeometry(0.9, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
        roughness: 0.05,
        metalness: 0.8
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(3, 4.2, 13.5);
      crystal.name = 'waterfallCrystal';
      secretIslandGroup.add(crystal);
      this.waterfallCrystal = crystal;

      // Hidden Cave entrance (behind waterfall)
      const caveGeo = new THREE.SphereGeometry(3.5, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const caveMat = new THREE.MeshToonMaterial({ color: 0x0f0621, transparent: true, opacity: 0.0 });
      const cave = new THREE.Mesh(caveGeo, caveMat);
      cave.rotation.x = Math.PI;
      cave.position.set(0, 2.5, 14.5);
      cave.name = 'hiddenCave';
      secretIslandGroup.add(cave);
      this.hiddenCave = cave;

      this.worldGroup.add(secretIslandGroup);
      this.secretIsland = secretIslandGroup;
    }

    createMagicalMushroom() {
      const shroom = new THREE.Group();
      shroom.name = 'magicMushroom';

      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.7, 8);
      stemGeo.translate(0, 0.35, 0);
      const stemMat = new THREE.MeshToonMaterial({ color: 0xfff0f5 });
      shroom.add(new THREE.Mesh(stemGeo, stemMat));

      // Glowing Cap
      const capGeo = new THREE.SphereGeometry(0.45, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xff4d6d,
        emissive: 0xff006e,
        emissiveIntensity: 0.65,
        roughness: 0.3
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 0.7;
      shroom.add(cap);

      return shroom;
    }

    /* ------------------------------------------------------------------------
       4. BUTTERFLIES
       ------------------------------------------------------------------------ */
    buildButterflies() {
      const bColors = [0xff70a6, 0x89f7fe, 0xffd166, 0xd6b4fc];
      for (let b = 0; b < 5; b++) {
        const butterfly = new THREE.Group();
        const wingMat = new THREE.MeshBasicMaterial({
          color: bColors[b % bColors.length],
          side: THREE.DoubleSide
        });

        // Left Wing
        const wingGeo = new THREE.CircleGeometry(0.22, 6);
        const lWing = new THREE.Mesh(wingGeo, wingMat);
        lWing.position.set(-0.15, 0, 0);
        butterfly.add(lWing);

        // Right Wing
        const rWing = new THREE.Mesh(wingGeo, wingMat);
        rWing.position.set(0.15, 0, 0);
        butterfly.add(rWing);

        butterfly.lWing = lWing;
        butterfly.rWing = rWing;
        butterfly.userData = {
          basePos: new THREE.Vector3((Math.random() - 0.5) * 20, 2.5 + Math.random() * 2, (Math.random() - 0.5) * 20),
          orbitRadius: Math.random() * 3 + 1.5,
          speed: Math.random() * 0.8 + 0.6,
          phase: Math.random() * Math.PI * 2
        };

        this.worldGroup.add(butterfly);
        this.butterfliesList.push(butterfly);
      }
    }

    /* ------------------------------------------------------------------------
       PARTICLE SYSTEMS (FIREFLIES, PETALS, FIREWORKS)
       ------------------------------------------------------------------------ */
    buildParticleSystems() {
      // Fireflies
      const fireflyCount = this.qualityLevel === 'LOW' ? 25 : 60;
      const fireflyGeo = new THREE.BufferGeometry();
      const fireflyPos = new Float32Array(fireflyCount * 3);
      this.fireflyVelocities = [];

      for (let i = 0; i < fireflyCount; i++) {
        fireflyPos[i * 3] = (Math.random() - 0.5) * 45;
        fireflyPos[i * 3 + 1] = Math.random() * 8 + 1;
        fireflyPos[i * 3 + 2] = (Math.random() - 0.5) * 45;

        this.fireflyVelocities.push({
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.03,
          vz: (Math.random() - 0.5) * 0.04,
          baseY: fireflyPos[i * 3 + 1]
        });
      }

      fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3));
      const fireflyMat = new THREE.PointsMaterial({
        color: 0xffeaa7,
        size: this.isMobile ? 0.45 : 0.65,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      this.fireflies = new THREE.Points(fireflyGeo, fireflyMat);
      this.scene.add(this.fireflies);

      // Falling Petals
      const petalCount = this.qualityLevel === 'LOW' ? 30 : 70;
      const petalGeo = new THREE.BufferGeometry();
      const petalPos = new Float32Array(petalCount * 3);
      this.petalSpeeds = [];

      for (let i = 0; i < petalCount; i++) {
        petalPos[i * 3] = (Math.random() - 0.5) * 50;
        petalPos[i * 3 + 1] = Math.random() * 25 + 5;
        petalPos[i * 3 + 2] = (Math.random() - 0.5) * 50;

        this.petalSpeeds.push({
          vy: Math.random() * 0.04 + 0.03,
          sway: Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2
        });
      }

      petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
      const petalMat = new THREE.PointsMaterial({
        color: 0xffb7d5,
        size: 0.5,
        transparent: true,
        opacity: 0.8
      });
      this.fallingPetals = new THREE.Points(petalGeo, petalMat);
      this.scene.add(this.fallingPetals);

      // Fireworks Particles Emitter
      const fwCount = 240;
      const fwGeo = new THREE.BufferGeometry();
      const fwPos = new Float32Array(fwCount * 3);
      this.fwVelocities = [];

      for (let i = 0; i < fwCount; i++) {
        fwPos[i * 3] = 0;
        fwPos[i * 3 + 1] = -50;
        fwPos[i * 3 + 2] = 0;
        this.fwVelocities.push({ vx: 0, vy: 0, vz: 0, life: 0 });
      }

      fwGeo.setAttribute('position', new THREE.BufferAttribute(fwPos, 3));
      const fwMat = new THREE.PointsMaterial({
        color: 0xffbe0b,
        size: 0.8,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      this.fireworksParticles = new THREE.Points(fwGeo, fwMat);
      this.scene.add(this.fireworksParticles);
    }

    launchFirework(x = 0, y = 20, z = -10, colorHex = 0xffbe0b) {
      this.fireworksParticles.material.color.setHex(colorHex);
      this.fireworksParticles.material.opacity = 1;
      const pos = this.fireworksParticles.geometry.attributes.position.array;

      for (let i = 0; i < 240; i++) {
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 0.45 + 0.15;

        this.fwVelocities[i] = {
          vx: Math.sin(phi) * Math.cos(theta) * speed,
          vy: Math.cos(phi) * speed,
          vz: Math.sin(phi) * Math.sin(theta) * speed,
          life: 1.0
        };
      }
      this.fireworksParticles.geometry.attributes.position.needsUpdate = true;
      this.sounds.playTone(900, 'triangle', 0.2, 0.15);
    }

    /* ------------------------------------------------------------------------
       COLLECTIBLES SYSTEM
       ------------------------------------------------------------------------ */
    spawnInitialCollectibles() {
      for (let i = 0; i < 14; i++) {
        this.spawnCollectible();
      }
    }

    spawnCollectible() {
      const rand = Math.random();
      let type, color, points, geometry;

      if (rand < 0.55) {
        type = 'flower'; color = 0xff70a6; points = 1;
        geometry = new THREE.ConeGeometry(0.35, 0.55, 6);
      } else if (rand < 0.80) {
        type = 'rose'; color = 0xe63946; points = 5;
        geometry = new THREE.DodecahedronGeometry(0.35);
      } else if (rand < 0.93) {
        type = 'star'; color = 0xffd166; points = 10;
        geometry = new THREE.OctahedronGeometry(0.4, 0);
      } else {
        type = 'heart'; color = 0xff4d6d; points = 15;
        geometry = new THREE.IcosahedronGeometry(0.42, 0);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });

      const mesh = new THREE.Mesh(geometry, mat);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 18 + 3;

      mesh.position.set(Math.cos(angle) * dist, 1.8, Math.sin(angle) * dist);
      mesh.userData = {
        type: type,
        points: points,
        floatBaseY: 1.8,
        floatPhase: Math.random() * Math.PI * 2
      };

      this.worldGroup.add(mesh);
      this.collectiblesList.push(mesh);
    }

    spawnWishStar(pos) {
      const wishGeo = new THREE.OctahedronGeometry(0.55, 0);
      const wishMat = new THREE.MeshStandardMaterial({
        color: 0xffbe0b,
        emissive: 0xffd166,
        emissiveIntensity: 0.9,
        roughness: 0.1
      });
      const wishStar = new THREE.Mesh(wishGeo, wishMat);
      wishStar.position.copy(pos);
      wishStar.position.y = 1.8;
      wishStar.userData = {
        type: 'wishStar',
        points: 25,
        floatBaseY: 1.8,
        floatPhase: 0
      };
      this.worldGroup.add(wishStar);
      this.collectiblesList.push(wishStar);
      this.showToast('⭐ Một Ngôi Sao Ước Nguyện (Wish Star) vừa rơi xuống hòn đảo!');
    }

    /* ------------------------------------------------------------------------
       CONTROLS & EVENT LISTENERS
       ------------------------------------------------------------------------ */
    setupControls() {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
      this.controls.minDistance = 4;
      this.controls.maxDistance = 140;
    }

    setupEventListeners() {
      window.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        this.keys[k] = true;
      });

      window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        this.keys[k] = false;
      });

      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      this.renderer.domElement.addEventListener('pointerdown', (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.handleRaycastClick();
      });

      // Virtual Joystick on Mobile
      const stickBase = document.getElementById('touch-joystick');
      const stickThumb = document.getElementById('joystick-thumb');
      if (stickBase && stickThumb) {
        let isTouching = false;
        const maxR = 36;

        const updateJoystick = (clientX, clientY) => {
          const rect = stickBase.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          let dx = clientX - cx;
          let dy = clientY - cy;
          const dist = Math.hypot(dx, dy);

          if (dist > maxR) {
            dx = (dx / dist) * maxR;
            dy = (dy / dist) * maxR;
          }

          stickThumb.style.transform = `translate(${dx}px, ${dy}px)`;
          this.joystickDelta.x = dx / maxR;
          this.joystickDelta.y = dy / maxR;
        };

        const resetStick = () => {
          isTouching = false;
          stickThumb.style.transform = `translate(0px, 0px)`;
          this.joystickDelta.x = 0;
          this.joystickDelta.y = 0;
        };

        stickBase.addEventListener('pointerdown', (e) => {
          isTouching = true;
          updateJoystick(e.clientX, e.clientY);
        });

        window.addEventListener('pointermove', (e) => {
          if (isTouching) updateJoystick(e.clientX, e.clientY);
        });

        window.addEventListener('pointerup', resetStick);
        window.addEventListener('pointercancel', resetStick);
      }

      const jumpBtn = document.getElementById('btn-touch-jump');
      if (jumpBtn) {
        jumpBtn.addEventListener('click', () => this.triggerBunnyJump());
      }
    }

    handleRaycastClick() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.worldGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;

        if (hit === this.bunny.tail) {
          this.triggerEasterEgg('tail');
          return;
        }

        // Walk up parents to check named interactive objects
        let parent = hit;
        while (parent) {
          // Bunny click
          if (parent === this.bunnyGroup) {
            this.triggerBunnyJump();
            this.showToast('🐰 Wang Yi chạm vào tớ nè! Chúc mừng sinh nhật tuổi 17 rực rỡ!');
            return;
          }

          // Secret portal
          if (parent.name === 'secretPortal') {
            if (this.isMysteryUnlocked) {
              this.triggerPortalWarp();
            } else {
              this.openModal('modal-mystery');
            }
            return;
          }

          // House chimney
          if (parent.name === 'houseChimney') {
            this.triggerEasterEgg('chimney');
            return;
          }

          // ⭐ Star Tree Lanterns (Star Tree Sequence Puzzle)
          if (parent.name && parent.name.startsWith('treeStar_')) {
            const idx = parseInt(parent.name.split('_')[1]);
            this.handleStarTreeClick(idx, parent);
            return;
          }

          // 🌙 Moon Platform
          if (parent.name === 'moonPlatform') {
            this.openModal('modal-moon-wish');
            return;
          }

          // 🌊 Wish Lake
          if (parent.name === 'wishLakeWater') {
            this.handleWishLakeClick(parent);
            return;
          }

          // 🪐 Constellation Points
          if (parent.name && parent.name.startsWith('constellationPoint_')) {
            const idx = parseInt(parent.name.split('_')[1]);
            this.handleConstellationClick(idx, parent);
            return;
          }

          // 🔭 Observatory
          if (parent.name === 'observatory') {
            this.openModal('modal-observatory');
            return;
          }

          // ⭐ Star Shards collectibles
          if (parent.name && parent.name.startsWith('starShard_')) {
            const idx = parseInt(parent.name.split('_')[1]);
            this.collectStarShard(idx, parent);
            return;
          }

          // 💐 Memory Flowers
          if (parent.name && parent.name.startsWith('memoryFlower_')) {
            const idx = parseInt(parent.name.split('_')[1]);
            this.handleMemoryFlowerClick(idx, parent);
            return;
          }

          // 🍄 Puzzle Mushrooms
          if (parent.name === 'puzzleMushroom') {
            const mIdx = parent.userData.mushroomIndex;
            if (mIdx !== undefined) {
              this.handleMushroomPuzzleClick(mIdx);
              return;
            }
          }

          // 🌊 Waterfall Crystal
          if (parent.name === 'waterfallCrystal') {
            this.handleWaterfallCrystalClick();
            return;
          }

          // 🎁 Memory Box
          if (parent.name === 'memoryBox') {
            this.handleMemoryBoxClick();
            return;
          }

          // Generic collectibles
          if (parent.userData && parent.userData.type) {
            gsap.to(parent.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.3, yoyo: true, repeat: 1 });
            this.sounds.playPop();
            return;
          }

          parent = parent.parent;
        }
      }
    }

    triggerBunnyJump() {
      if (this.bunny.isJumping) return;
      this.bunny.isJumping = true;
      this.bunny.jumpProgress = 0;
      this.bunny.state = 'EXCITED';
      this.sounds.playJump();
    }

    /* -----------------------------------------------------------------------
       ⭐ STAR ISLAND INTERACTIONS
    ----------------------------------------------------------------------- */

    handleStarTreeClick(idx, mesh) {
      if (this.starTreeAwakened) return;

      const expectedIdx = this.starTreeSequence[this.starTreeCurrentStep];
      if (idx === expectedIdx) {
        // Correct!
        this.starTreeCurrentStep++;
        const mat = mesh.material;
        const origEmissive = mat.emissiveIntensity;
        gsap.to(mat, { emissiveIntensity: 2.5, duration: 0.25, yoyo: true, repeat: 1, onComplete: () => {
          mat.emissiveIntensity = origEmissive;
        }});
        gsap.to(mesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.2, yoyo: true, repeat: 1 });
        this.sounds.playHarmonicNote(this.starTreeCurrentStep);

        if (this.starTreeCurrentStep >= this.starTreeSequence.length) {
          // All clicked correctly — AWAKEN
          this.awakenStarTree();
        } else {
          // Hint next star
          const nextIdx = this.starTreeSequence[this.starTreeCurrentStep];
          setTimeout(() => {
            const nextLantern = this.starLanterns[nextIdx];
            if (nextLantern) {
              gsap.to(nextLantern.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.4, yoyo: true, repeat: 2 });
            }
          }, 400);
        }
      } else {
        // Wrong — gentle shake, don't reset
        gsap.to(mesh.position, { x: mesh.position.x + 0.15, duration: 0.06, yoyo: true, repeat: 4 });
        this.sounds.playTone(220, 'sine', 0.15, 0.12);
        this.showToast('✨ Thứ tự chưa đúng — thử sao tiếp theo nhé!');
      }
    }

    awakenStarTree() {
      this.starTreeAwakened = true;
      this.showToast('✦ STAR TREE AWAKENED ✦ — Cây Sao đã thức giấc!');
      this.sounds.playFanfare();

      // Light up all lanterns
      this.starLanterns.forEach((l, i) => {
        setTimeout(() => {
          l.material.emissiveIntensity = 3.0;
          gsap.to(l.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 0.5, ease: 'elastic.out' });
        }, i * 120);
      });

      // Elevate foliage glow
      if (this.starTree) {
        this.starTree.traverse(child => {
          if (child.isMesh && child.material && child.material.emissive) {
            gsap.to(child.material, { emissiveIntensity: 1.4, duration: 1.5 });
          }
        });
      }

      // Spawn Star Shard 0 (Star Tree Shard)
      setTimeout(() => {
        if (this.starIsland) {
          const shardGeo = new THREE.OctahedronGeometry(0.42, 0);
          const shardMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 1.2, transparent: true, opacity: 0.9 });
          const shard = new THREE.Mesh(shardGeo, shardMat);
          shard.position.set(0, 9.5, 0);
          shard.name = 'starShard_0';
          shard.userData.shardIndex = 0;
          this.starIsland.add(shard);
        }
      }, 1200);

      this.launchFirework(0, 34, -26, 0xffd166);
      setTimeout(() => this.launchFirework(-4, 36, -22, 0xff70a6), 500);
    }

    handleWishLakeClick(mesh) {
      // Ripple effect
      if (this.wishLake) {
        gsap.to(this.wishLake.scale, { x: 1.12, z: 1.12, duration: 0.4, yoyo: true, repeat: 1 });
      }
      this.sounds.playTone(440, 'sine', 0.3, 0.15);

      if (!this.wishLakeCollected) {
        this.wishLakeCollected = true;
        this.showToast('🌊 Mặt hồ xao động — một Star Shard nổi lên!');
        // Spawn Star Shard 1 (Lake shard)
        setTimeout(() => {
          if (this.starIsland) {
            const shardGeo = new THREE.OctahedronGeometry(0.42, 0);
            const shardMat = new THREE.MeshStandardMaterial({ color: 0x80ffe8, emissive: 0x80ffe8, emissiveIntensity: 1.0, transparent: true, opacity: 0.9 });
            const shard = new THREE.Mesh(shardGeo, shardMat);
            shard.position.set(7.4, 3.5, 2);
            shard.name = 'starShard_1';
            shard.userData.shardIndex = 1;
            this.starIsland.add(shard);
            gsap.from(shard.position, { y: 1.8, duration: 0.8, ease: 'back.out' });
          }
        }, 600);
      } else {
        this.showToast('🌊 Hồ Ước Nguyện thì thầm: "Cứ mơ đi, rồi hoa sẽ nở."');
      }
    }

    handleConstellationClick(idx, mesh) {
      if (this.constellationSolved) return;

      if (!this.constellationClicked.includes(idx)) {
        this.constellationClicked.push(idx);
        mesh.material.emissiveIntensity = 1.8;
        mesh.material.color.setHex(0xffd166);
        gsap.to(mesh.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.3, ease: 'elastic.out' });
        this.sounds.playHarmonicNote(this.constellationClicked.length);

        if (this.constellationClicked.length >= 7) {
          this.solveConstellation();
        } else {
          this.showToast(`✨ ${this.constellationClicked.length}/7 điểm sao — tiếp tục nối nhé!`);
        }
      }
    }

    solveConstellation() {
      this.constellationSolved = true;
      this.sounds.playFanfare();
      this.showToast('🌟 CONSTELLATION SOLVED! Chòm sao Thỏ nhỏ đã hình thành!');

      // Lift all nodes into sky
      this.constellationNodes.forEach((n, i) => {
        setTimeout(() => {
          gsap.to(n.position, { y: n.position.y + 12, duration: 2.0, ease: 'power2.inOut' });
          gsap.to(n.material, { emissiveIntensity: 3.0, duration: 0.5 });
        }, i * 100);
      });

      // Reward
      setTimeout(() => {
        this.score += 10;
        this.updateScoreUI();
        this.showToast('✨ +10 flowers! Chòm sao Thỏ nhỏ đã bay lên bầu trời!');
        this.launchFirework(0, 40, -26, 0xffd166);
      }, 2000);
    }

    collectStarShard(shardIndex, mesh) {
      if (this.collectedStarShards && this.collectedStarShards[shardIndex]) return;
      if (!this.collectedStarShards) this.collectedStarShards = {};
      this.collectedStarShards[shardIndex] = true;

      this.starShards++;
      const shardTxt = document.getElementById('hud-shard-text');
      if (shardTxt) shardTxt.textContent = this.starShards;

      // Collect VFX
      gsap.to(mesh.scale, { x: 2.0, y: 2.0, z: 2.0, duration: 0.3, ease: 'power2.out' });
      gsap.to(mesh.material, { opacity: 0, duration: 0.4, onComplete: () => {
        if (mesh.parent) mesh.parent.remove(mesh);
      }});
      this.sounds.playCollect('star');
      this.showToast(`⭐ Star Shard ${this.starShards}/5 — ${['Cây Sao Thức Giấc', 'Hồ Ước Nguyện', 'Trăng Bạc', 'Đá Pha Lê', 'Sao Băng'][shardIndex] || ''}`);

      if (this.starShards >= 5) {
        setTimeout(() => this.onAllStarShardsCollected(), 1000);
      }
    }

    onAllStarShardsCollected() {
      this.showToast('✦ 5/5 STAR SHARDS! Bầu trời đã nhận ra cậu, Wang Yi!');
      this.sounds.playFanfare();
      this.launchFirework(0, 40, -20, 0xffd166);
      this.checkFinalWishUnlock();
    }

    /* -----------------------------------------------------------------------
       🌙 MOON PLATFORM
    ----------------------------------------------------------------------- */
    setupMoonWishModal() {
      const btnSubmit = document.getElementById('btn-submit-moon-wish');
      if (btnSubmit && !btnSubmit._bound) {
        btnSubmit._bound = true;
        btnSubmit.addEventListener('click', () => {
          const val = document.getElementById('input-moon-wish').value.trim();
          if (!val) { this.showToast('🌙 Wang Yi hãy nhập điều ước nhé!'); return; }
          document.getElementById('input-moon-wish').value = '';
          document.getElementById('moon-wish-sent').classList.remove('hidden');
          this.sounds.playChime();
          // Star particle rising
          this.launchFirework(0, 45, -26, 0xffd166);
          this.showToast('🌠 Điều ước của Wang Yi đã hóa thành sao băng bay về phía trời xa...');
          setTimeout(() => this.closeModal('modal-moon-wish'), 2000);

          // Shard 2 if not yet collected
          if (this.moonShard && this.moonShard.parent) {
            // Already in scene — just remind
          }
        });
      }
    }

    /* -----------------------------------------------------------------------
       🔭 OBSERVATORY
    ----------------------------------------------------------------------- */
    setupObservatoryModal() {
      const constel = document.getElementById('tele-constellation');
      if (constel && !constel._bound) {
        constel._bound = true;
        constel.addEventListener('click', () => {
          this.sounds.playSecret();
          this.showToast(`🔭 Chòm sao bí mật đã được giải mã — "Wang Yi's Constellation: ⭐🌷🐰"`);
          gsap.to(constel, { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 5 });
          this.closeModal('modal-observatory');
          this.collectStarShard(4, this.observatoryGroup); // observatory shard
        });
      }
    }

    /* -----------------------------------------------------------------------
       🌀 PORTAL WARP CINEMATIC
    ----------------------------------------------------------------------- */
    triggerPortalWarp() {
      if (this.isWarping) return;
      this.isWarping = true;
      this.sounds.playWarp();

      // Flash white then fade to black
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:9999;opacity:0;pointer-events:none;transition:opacity 0.4s';
      document.body.appendChild(overlay);

      requestAnimationFrame(() => { overlay.style.opacity = '1'; });
      setTimeout(() => {
        overlay.style.background = '#030109';
        overlay.style.opacity = '1';
        // Move camera to near Secret Island
        this.flyToZone('mystery');
        setTimeout(() => {
          overlay.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(overlay);
            this.isWarping = false;
            this.showToast('✦ WELCOME TO YOUR SECRET PLACE ✦ — Hòn đảo bí mật của Wang Yi');
          }, 500);
        }, 1200);
      }, 500);
    }

    /* -----------------------------------------------------------------------
       💐 MEMORY FLOWERS (SECRET ISLAND)
    ----------------------------------------------------------------------- */
    handleMemoryFlowerClick(idx, mesh) {
      const flower = this.memoryFlowersList[idx];
      if (!flower) return;

      // Show quote
      const quote = this.memoryFragmentsQuotes[idx % this.memoryFragmentsQuotes.length];
      this.showToast('💐 ' + quote);
      gsap.to(mesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.4, yoyo: true, repeat: 1 });
      gsap.to(mesh.material, { emissiveIntensity: 2.5, duration: 0.3, yoyo: true, repeat: 1 });
      this.sounds.playChime();

      if (!flower.collected) {
        flower.collected = true;
        this.memoryFragments++;
        const fragTxt = document.getElementById('hud-frag-text');
        if (fragTxt) fragTxt.textContent = this.memoryFragments;
        this.showToast(`✨ Memory Fragment ${this.memoryFragments}/5 đã được thu thập!`);

        if (this.memoryFragments >= 5) {
          setTimeout(() => this.onAllFragmentsCollected(), 800);
        }
      }
    }

    onAllFragmentsCollected() {
      this.showToast('💐 Memory Garden toàn sáng rực! A MEMORY HAS BEEN UNLOCKED!');
      this.sounds.playFanfare();

      // Glow all memory flowers
      this.memoryFlowersList.forEach((fl, i) => {
        setTimeout(() => {
          if (fl.head && fl.head.material) {
            gsap.to(fl.head.material, { emissiveIntensity: 3.0, duration: 0.5 });
            gsap.to(fl.head.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: 'elastic.out' });
          }
        }, i * 150);
      });

      this.launchFirework(0, 20, -42, 0xd4bfff);
      this.checkFinalWishUnlock();
    }

    /* -----------------------------------------------------------------------
       🍄 MUSHROOM PUZZLE (SECRET ISLAND)
    ----------------------------------------------------------------------- */
    handleMushroomPuzzleClick(mushroomIdx) {
      if (this.shroomPuzzleSolved) {
        this.showToast('🍄 Khu rừng nấm đã được giải — secret path đang mở!');
        return;
      }

      const mushroom = this.puzzleMushrooms[mushroomIdx];
      if (!mushroom) return;

      this.shroomSequence.push(mushroomIdx);
      // Flash the clicked mushroom
      gsap.to(mushroom.mat, { emissiveIntensity: 2.5, duration: 0.3, yoyo: true, repeat: 1 });
      this.sounds.playHarmonicNote(mushroomIdx);
      this.showToast(`🍄 ${['Xanh Lam', 'Hồng', 'Xanh Lá', 'Vàng', 'Tím'][mushroomIdx] || ''} (${this.shroomSequence.length}/5)`);

      const targetStep = this.shroomSequenceTarget[this.shroomSequence.length - 1];
      if (mushroomIdx !== targetStep) {
        // Wrong — reset sequence
        setTimeout(() => {
          this.shroomSequence = [];
          this.puzzleMushrooms.forEach(m => {
            gsap.to(m.mat, { emissiveIntensity: m.defaultIntensity, duration: 0.4 });
          });
          this.showToast('🍄 Thứ tự chưa đúng — thử lại nhé! Gợi ý: Xanh Lam → Xanh Lá → Tím → Hồng → Vàng');
        }, 600);
        return;
      }

      if (this.shroomSequence.length >= 5) {
        this.solveShroomPuzzle();
      }
    }

    solveShroomPuzzle() {
      this.shroomPuzzleSolved = true;
      this.sounds.playFanfare();
      this.showToast('🍄✨ MUSHROOM PUZZLE SOLVED! Secret path đã mở ra!');

      // Pulse all mushrooms
      this.puzzleMushrooms.forEach((m, i) => {
        setTimeout(() => {
          gsap.to(m.mat, { emissiveIntensity: 3.0, duration: 0.5 });
          gsap.to(m.group.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.5, ease: 'elastic.out' });
        }, i * 150);
      });

      // Reveal waterfall crystal path hint
      setTimeout(() => {
        if (this.waterfallCrystal) {
          gsap.to(this.waterfallCrystal.material, { emissiveIntensity: 2.5, duration: 1.0 });
        }
        this.showToast('🌊 Một con đường ánh sáng xuất hiện phía sau thác nước Crystal...');
      }, 1500);

      this.launchFirework(4, 18, -42, 0x4ade80);
    }

    /* -----------------------------------------------------------------------
       🌊 WATERFALL CRYSTAL (SECRET ISLAND)
    ----------------------------------------------------------------------- */
    handleWaterfallCrystalClick() {
      if (this.caveOpened) {
        this.showToast('🌊 Hang Bí Mật đã mở — hãy tiến vào bên trong!');
        return;
      }
      this.caveOpened = true;
      this.sounds.playWarp();
      this.showToast('💎 Crystal Thác Nước chuyển đổi — một con đường huyền bí xuất hiện!');

      // Waterfall turns magical (color shift)
      if (this.waterfallMesh) {
        gsap.to(this.waterfallMesh.material.color, { r: 0.6, g: 0.5, b: 1.0, duration: 1.5 });
        gsap.to(this.waterfallMesh.material, { opacity: 0.5, duration: 1.0 });
      }
      if (this.waterfallCrystal) {
        gsap.to(this.waterfallCrystal.material, { emissiveIntensity: 3.5, duration: 0.6 });
      }

      // Reveal cave
      if (this.hiddenCave) {
        gsap.to(this.hiddenCave.material, { opacity: 0.75, duration: 1.5 });
      }

      setTimeout(() => {
        this.showToast('🏛️ HIDDEN CAVE đã lộ diện — tìm 5 Memory Fragments để mở Memory Box!');
      }, 2000);
    }

    /* -----------------------------------------------------------------------
       🎁 MEMORY BOX (SECRET ISLAND)
    ----------------------------------------------------------------------- */
    handleMemoryBoxClick() {
      if (this.memoryBoxOpened) {
        this.openModal('modal-letter');
        return;
      }
      if (this.memoryFragments < 5) {
        this.showToast(`🎁 Memory Box cần 5 Memory Fragments — hiện tại: ${this.memoryFragments}/5`);
        gsap.to(this.memoryBoxGroup.position, { y: this.memoryBoxGroup.position.y + 0.2, duration: 0.1, yoyo: true, repeat: 4 });
        return;
      }
      this.openMemoryBox();
    }

    openMemoryBox() {
      this.memoryBoxOpened = true;
      this.sounds.playFanfare();
      this.showToast('🎁 MEMORY BOX IS OPENING...');

      // Shake
      gsap.to(this.memoryBoxGroup.rotation, { y: Math.PI * 0.05, duration: 0.15, yoyo: true, repeat: 5 });

      // Golden light leak
      setTimeout(() => {
        if (this.memoryBoxGroup) {
          this.memoryBoxGroup.traverse(child => {
            if (child.isMesh && child.material) {
              gsap.to(child.material, { emissiveIntensity: 1.5, duration: 0.8 });
            }
          });
        }
      }, 600);

      // Lid opens
      if (this.memoryBoxLid) {
        setTimeout(() => {
          gsap.to(this.memoryBoxLid.rotation, { x: -Math.PI / 1.5, duration: 1.2, ease: 'power2.inOut' });
          gsap.to(this.memoryBoxLid.position, { y: 2.5, duration: 1.2, ease: 'power2.inOut' });
        }, 1200);
      }

      // Petals from box
      setTimeout(() => {
        this.launchFirework(0, 14, -42, 0xffd166);
        this.launchFirework(-3, 16, -40, 0xff70a6);
        this.showToast('💌 SECRET MEMORY UNLOCKED — Phong thư bí mật đang xuất hiện...');
      }, 2000);

      // Trigger 6-phase letter after animation
      setTimeout(() => {
        this.openModal('modal-letter');
        // Reset envelope so letter can be opened fresh
        const envBox = document.getElementById('envelope-box');
        const envContainer = document.getElementById('envelope-container');
        const letterPaperWrap = document.getElementById('letter-paper-wrap');
        if (envBox) envBox.classList.remove('opened');
        if (envContainer) envContainer.classList.remove('hidden');
        if (letterPaperWrap) letterPaperWrap.classList.add('hidden');
      }, 3500);

      this.checkFinalWishUnlock();
    }

    /* -----------------------------------------------------------------------
       🌌 SECRET ISLAND FINAL REACTION (triggered at Letter Climax)
    ----------------------------------------------------------------------- */
    triggerSecretIslandFinalReaction() {
      // Light up everything
      if (this.secretIsland) {
        this.secretIsland.traverse(child => {
          if (child.isMesh && child.material && child.material.emissive) {
            gsap.to(child.material, { emissiveIntensity: child.material.emissiveIntensity * 1.8 + 0.5, duration: 1.0 });
          }
        });
      }
      // Memory flowers bloom
      this.memoryFlowersList.forEach((fl, i) => {
        setTimeout(() => {
          if (fl.head) gsap.to(fl.head.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 0.5, ease: 'elastic.out' });
        }, i * 100);
      });
      // Distant fireworks
      setTimeout(() => this.launchFirework(-12, 22, -50, 0xffd166), 0);
      setTimeout(() => this.launchFirework(10, 25, -48, 0xff70a6), 500);
      setTimeout(() => this.launchFirework(0, 30, -44, 0x89f7fe), 1000);
      this.showToast('🌌 "Happy 17th Birthday, Wang Yi." — Toàn bộ Secret Island toả sáng!');
    }

    /* -----------------------------------------------------------------------
       ✦ FINAL WISH CHECK & GRAND ENDING
    ----------------------------------------------------------------------- */
    checkFinalWishUnlock() {
      if (this.finalWishUnlocked) return;
      if (this.starShards >= 5 && this.memoryFragments >= 5 && this.memoryBoxOpened) {
        this.finalWishUnlocked = true;
        const dock = document.getElementById('final-wish-dock');
        if (dock) dock.classList.remove('hidden');
        this.showToast('✦ FINAL WISH UNLOCKED — Make One Last Wish for Wang Yi!');
      }
    }

    triggerGrandEnding() {
      this.closeModal('modal-final-wish');
      this.sounds.playFanfare();

      // Camera dramatic zoom out
      this.cameraMode = 'free';
      gsap.to(this.camera.position, { x: 0, y: 65, z: 55, duration: 5.0, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 0, y: 4, z: -20, duration: 5.0 });

      // Multi-island fireworks
      setTimeout(() => this.launchFirework(0, 35, -26, 0xffd166), 1000);
      setTimeout(() => this.launchFirework(0, 25, -42, 0xff70a6), 1600);
      setTimeout(() => this.launchFirework(8, 30, -34, 0x89f7fe), 2200);
      setTimeout(() => this.launchFirework(-8, 28, -30, 0xd4bfff), 2800);

      // Show grand ending overlay
      setTimeout(() => {
        const overlay = document.getElementById('grand-ending-overlay');
        if (overlay) overlay.classList.add('active');
      }, 4500);
    }


    setupUI() {
      const enterBtn = document.getElementById('btn-enter-world');
      if (enterBtn) {
        enterBtn.addEventListener('click', () => {
          this.sounds.resume();
          this.sounds.playBGM();

          document.getElementById('cinematic-overlay').classList.add('hidden');
          document.getElementById('main-hud').classList.remove('hidden');
          document.getElementById('game-controls-hint').classList.remove('hidden');

          gsap.to(this.camera.position, {
            x: 0,
            y: 7,
            z: 18,
            duration: 3.2,
            ease: 'power3.inOut',
            onComplete: () => {
              this.showToast('🌷 Chào mừng Wang Yi! Hãy khám phá thế giới tuổi 17 của cậu nhé!');
            }
          });
        });
      }

      document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const zoneKey = tab.getAttribute('data-zone');
          this.flyToZone(zoneKey);
        });
      });

      const btnCam = document.getElementById('btn-toggle-cam');
      if (btnCam) {
        btnCam.addEventListener('click', () => {
          this.cameraMode = this.cameraMode === 'follow' ? 'free' : 'follow';
          btnCam.classList.toggle('active', this.cameraMode === 'follow');
          this.showToast(this.cameraMode === 'follow' ? '🎥 Camera đang theo sát Thỏ' : '🌐 Camera tự do xoay vòng');
        });
      }

      const btnSky = document.getElementById('btn-toggle-sky');
      const skyIcon = document.getElementById('sky-mode-icon');
      if (btnSky) {
        btnSky.addEventListener('click', () => {
          this.easterEggsFound.moon++;
          if (this.easterEggsFound.moon === 3) {
            this.showEasterEggModal(
              '🌙 Lời Nhắn Từ Mặt Trăng',
              '“Wang Yi chính là ngôi sao lấp lánh và ấm áp nhất trong dải ngân hà này! Chúc cậu tuổi 17 rực rỡ và luôn mỉm cười thật tươi! ✨”'
            );
            this.launchFirework(0, 30, -10, 0xffd166);
          }

          if (this.skyMode === 'night') {
            this.skyMode = 'sunset';
            skyIcon.textContent = '🌅';
            this.setSkyAtmosphere(0xff8c66, 0.4);
            this.showToast('🌅 Hoàng hôn lãng mạn buông xuống thế giới');
          } else if (this.skyMode === 'sunset') {
            this.skyMode = 'day';
            skyIcon.textContent = '☀️';
            this.setSkyAtmosphere(0x9bd8ff, 1.2);
            this.showToast('☀️ Nắng mai rạng rỡ trên vườn hoa');
          } else {
            this.skyMode = 'night';
            skyIcon.textContent = '🌙';
            this.setSkyAtmosphere(0x130b29, 0.85);
            this.showToast('🌙 Bầu trời đêm ngàn sao lung linh');
          }
        });
      }

      const btnQual = document.getElementById('btn-toggle-quality');
      const qualLabel = document.getElementById('quality-label');
      if (btnQual) {
        btnQual.addEventListener('click', () => {
          if (this.qualityLevel === 'HIGH') {
            this.qualityLevel = 'MED';
            qualLabel.textContent = 'MED';
            this.renderer.setPixelRatio(1.2);
          } else if (this.qualityLevel === 'MED') {
            this.qualityLevel = 'LOW';
            qualLabel.textContent = 'LOW';
            this.renderer.setPixelRatio(1.0);
            this.renderer.shadowMap.enabled = false;
          } else {
            this.qualityLevel = 'HIGH';
            qualLabel.textContent = 'HQ';
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
          }
          this.showToast(`⚙️ Đồ họa: ${this.qualityLevel}`);
        });
      }

      const btnMusic = document.getElementById('btn-toggle-music');
      if (btnMusic) {
        btnMusic.addEventListener('click', () => this.sounds.toggleMusic());
      }

      const cheatBtn = document.getElementById('btn-hint-cheat');
      if (cheatBtn) {
        cheatBtn.addEventListener('click', () => {
          this.score = 50;
          this.updateScoreUI();
          this.unlockSecretIsland();

          // Unlock all quest stages for instant testing & verification
          this.starShards = 5;
          const shardTxt = document.getElementById('hud-shard-text');
          if (shardTxt) shardTxt.textContent = '5';

          this.memoryFragments = 5;
          const fragTxt = document.getElementById('hud-frag-text');
          if (fragTxt) fragTxt.textContent = '5';

          if (!this.starTreeAwakened) this.awakenStarTree();
          if (!this.constellationSolved) this.solveConstellation();
          if (!this.shroomPuzzleSolved) this.solveShroomPuzzle();
          if (!this.caveOpened) this.handleWaterfallCrystalClick();
          this.memoryBoxOpened = true;
          this.checkFinalWishUnlock();

          this.showToast('🎁 Đã mở khóa toàn bộ: 50 Hoa, 5 Mảnh Sao & 5 Ký Ức cho Wang Yi!');
        });
      }

      document.querySelectorAll('.btn-close-modal, [data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
          const modalId = btn.getAttribute('data-close') || btn.closest('.modal-overlay').id;
          this.closeModal(modalId);
        });
      });

      // 6-Phase 3D Letter Opening Sequence Handler
      const btnOpenWax = document.getElementById('btn-open-wax');
      if (btnOpenWax) {
        btnOpenWax.addEventListener('click', () => {
          this.run6PhaseLetterSequence();
        });
      }

      const btnReplay = document.getElementById('btn-replay-typewriter');
      if (btnReplay) {
        btnReplay.addEventListener('click', () => this.startLetterTypewriter());
      }

      const btnLove = document.getElementById('btn-send-love');
      let loves = 0;
      if (btnLove) {
        btnLove.addEventListener('click', () => {
          loves++;
          document.getElementById('love-count').textContent = loves;
          this.sounds.playCollect('heart');
          this.launchFirework(0, 22, -10, 0xff70a6);
          this.showToast('💖 Đã gửi ngàn trái tim yêu thương đến Wang Yi!');
        });
      }

      // Birthday Cake Ceremony
      const btnBlow = document.getElementById('btn-ceremony-blow');
      const btnRelight = document.getElementById('btn-ceremony-relight');
      if (btnBlow) {
        btnBlow.addEventListener('click', () => {
          this.cakeCandles.forEach(c => {
            gsap.to(c.flame.scale, { x: 0, y: 0, z: 0, duration: 0.4 });
            c.isLit = false;
          });
          this.sounds.playBlow();
          btnBlow.classList.add('hidden');
          btnRelight.classList.remove('hidden');
          document.getElementById('ceremony-wish-box').classList.remove('hidden');

          this.setSkyAtmosphere(0x070314, 0.4);
          this.triggerMultiStageFireworks();
        });
      }

      if (btnRelight) {
        btnRelight.addEventListener('click', () => {
          this.cakeCandles.forEach(c => {
            gsap.to(c.flame.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
            c.isLit = true;
          });
          this.sounds.playTone(700, 'sine', 0.2, 0.2);
          btnRelight.classList.add('hidden');
          btnBlow.classList.remove('hidden');
          document.getElementById('ceremony-wish-box').classList.add('hidden');
        });
      }

      const btnLaunchWish = document.getElementById('btn-launch-wish');
      if (btnLaunchWish) {
        btnLaunchWish.addEventListener('click', () => {
          const val = document.getElementById('input-wish-text').value.trim();
          if (!val) {
            this.showToast('🌷 Wang Yi hãy nhập điều ước trước khi thả lên bầu trời nhé!');
            return;
          }
          document.getElementById('wish-sent-indicator').classList.remove('hidden');
          document.getElementById('input-wish-text').value = '';
          this.launchFirework(0, 35, -20, 0xffbe0b);
          this.launchFirework(10, 30, -15, 0xff758c);
          this.showToast('⭐ Điều ước đã hóa thành vì sao bay lên vũ trụ!');
        });
      }

      const btnMysteryLetter = document.getElementById('btn-mystery-letter');
      if (btnMysteryLetter) {
        btnMysteryLetter.addEventListener('click', () => {
          this.closeModal('modal-mystery');
          this.openModal('modal-letter');
        });
      }

      // Final Wish Trigger
      const btnFinalWishTrigger = document.getElementById('btn-final-wish-trigger');
      if (btnFinalWishTrigger) {
        btnFinalWishTrigger.addEventListener('click', () => {
          this.openModal('modal-final-wish');
        });
      }

      // Grand Ending (from final-wish modal)
      const btnGrandEnding = document.getElementById('btn-trigger-grand-ending');
      if (btnGrandEnding) {
        btnGrandEnding.addEventListener('click', () => {
          this.triggerGrandEnding();
        });
      }

      // Return to world from Grand Ending overlay
      const btnReturnWorld = document.getElementById('btn-return-world');
      if (btnReturnWorld) {
        btnReturnWorld.addEventListener('click', () => {
          const overlay = document.getElementById('grand-ending-overlay');
          if (overlay) overlay.classList.remove('active');
          this.flyToZone('garden');
        });
      }

      // Init modal sub-systems
      this.setupMoonWishModal();
      this.setupObservatoryModal();
    }

    setSkyAtmosphere(colorHex, exposure) {
      gsap.to(this.scene.fog.color, {
        r: ((colorHex >> 16) & 255) / 255,
        g: ((colorHex >> 8) & 255) / 255,
        b: (colorHex & 255) / 255,
        duration: 1.5
      });
      gsap.to(this.ambientLight.color, {
        r: ((colorHex >> 16) & 255) / 255,
        g: ((colorHex >> 8) & 255) / 255,
        b: (colorHex & 255) / 255,
        duration: 1.5
      });
      gsap.to(this.renderer, { toneMappingExposure: exposure, duration: 1.5 });
    }

    flyToZone(zoneKey) {
      document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-zone') === zoneKey);
      });

      if (zoneKey === 'mystery') {
        if (!this.isMysteryUnlocked) {
          this.openModal('modal-mystery');
          return;
        }
      }

      const z = this.zones[zoneKey];
      if (!z) return;

      this.cameraMode = 'free';
      const targetCamPos = z.target.clone().add(z.offset);

      gsap.to(this.camera.position, {
        x: targetCamPos.x,
        y: targetCamPos.y,
        z: targetCamPos.z,
        duration: 2.4,
        ease: 'power2.inOut'
      });

      gsap.to(this.controls.target, {
        x: z.target.x,
        y: z.target.y,
        z: z.target.z,
        duration: 2.4,
        ease: 'power2.inOut'
      });

      if (zoneKey === 'plaza') {
        setTimeout(() => this.openModal('modal-cake'), 2500);
      }
    }

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        this.sounds.playPop();
      }
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    }

    /* ------------------------------------------------------------------------
       6-PHASE 3D LETTER OPENING SEQUENCE
       ------------------------------------------------------------------------ */
    run6PhaseLetterSequence() {
      const envBox = document.getElementById('envelope-box');
      const envContainer = document.getElementById('envelope-container');
      const letterPaperWrap = document.getElementById('letter-paper-wrap');

      // Phase 3: Zoom and open flap
      envBox.classList.add('opened');
      this.sounds.playPop();

      // Phase 4: Golden light burst & fanfare
      setTimeout(() => {
        this.sounds.playFanfare();
        this.launchFirework(0, 22, -10, 0xffd166);
      }, 500);

      // Phase 5: Letter paper glides up and faces camera
      setTimeout(() => {
        envContainer.classList.add('hidden');
        letterPaperWrap.classList.remove('hidden');
        this.startLetterTypewriter();
      }, 1000);
    }

    startLetterTypewriter() {
      const container = document.getElementById('typewriter-letter');
      const climaxEl = document.getElementById('letter-climax');
      if (!container) return;

      if (climaxEl) climaxEl.classList.add('hidden');

      const message = `Gửi Wang Yi 🌷\n\nChúc cậu có một sinh nhật thật vui.\n\nMong rằng tuổi mới sẽ mang đến cho cậu thật nhiều niềm vui, những điều bất ngờ thật đẹp và thật nhiều khoảnh khắc đáng nhớ.\n\nDù có bao nhiêu level mới xuất hiện trong cuộc sống, mong cậu luôn tìm được những điều khiến mình vui vẻ và mỉm cười.`;

      container.innerHTML = '<span class="typewriter-cursor"></span>';
      let i = 0;
      if (this.typewriterInterval) clearInterval(this.typewriterInterval);

      this.typewriterInterval = setInterval(() => {
        if (i < message.length) {
          const char = message.charAt(i);
          const cur = container.innerHTML.replace('<span class="typewriter-cursor"></span>', '');
          container.innerHTML = cur + char + '<span class="typewriter-cursor"></span>';
          if (i % 3 === 0 && char !== ' ' && char !== '\n') {
            this.sounds.playTone(820 + (i % 6) * 40, 'sine', 0.04, 0.03);
          }
          i++;
        } else {
          clearInterval(this.typewriterInterval);
          // Phase 6 Climax: "Happy 17th Birthday, Wang Yi."
          setTimeout(() => {
            if (climaxEl) climaxEl.classList.remove('hidden');
            this.launchFirework(0, 25, -10, 0xff70a6);
            setTimeout(() => this.launchFirework(8, 28, -14, 0xffd166), 400);
            // Trigger Secret Island environmental reaction if on Secret Island
            setTimeout(() => this.triggerSecretIslandFinalReaction(), 600);
            // Bunny joy animation
            setTimeout(() => {
              this.triggerBunnyJump();
              setTimeout(() => this.triggerBunnyJump(), 800);
            }, 1000);
            // Final wish check
            setTimeout(() => this.checkFinalWishUnlock(), 2000);
          }, 400);
        }
      }, 40);
    }

    triggerMultiStageFireworks() {
      // Sequence: rockets -> bursts -> constellation 17
      this.sounds.playFanfare();
      this.launchFirework(12, 18, -6, 0xffd166);
      setTimeout(() => this.launchFirework(15, 24, -8, 0xff70a6), 450);
      setTimeout(() => this.launchFirework(9, 22, -4, 0x89f7fe), 900);
      setTimeout(() => {
        this.launchFirework(12, 28, -6, 0xffd166);
        this.showToast('✨ Pháo hoa chào mừng tuổi 17 của Wang Yi nở rực rỡ!');
      }, 1400);
    }

    /* ------------------------------------------------------------------------
       EASTER EGGS
       ------------------------------------------------------------------------ */
    triggerEasterEgg(key) {
      if (key === 'tail') {
        gsap.to(this.bunnyGroup.rotation, { y: this.bunnyGroup.rotation.y + Math.PI * 2, duration: 0.6 });
        this.sounds.playJump();
        this.showEasterEggModal('🐰 Ouch!', 'Wang Yi vừa trêu cù vào đuôi chú thỏ nhỏ! Thỏ con xoay một vòng tít mù nè! 💕');
      } else if (key === 'chimney') {
        this.launchFirework(-14, 10, -8, 0xff70a6);
        this.showEasterEggModal('🏡 Ống Khói Phép Thuật', 'Cậu vừa chạm vào ống khói của ngôi nhà! Một làn khói hình trái tim bay lên chúc Wang Yi ấm áp!');
      } else if (key === 'mushroom') {
        this.launchFirework(this.bunny.pos.x, 8, this.bunny.pos.z, 0x00f5d4);
        this.showEasterEggModal('🍄 Bào Tử Nấm Thần', 'Những đốm sáng dạ quang bùng lên quanh Wang Yi!');
      }
    }

    showEasterEggModal(title, msg) {
      document.getElementById('egg-title').textContent = title;
      document.getElementById('egg-message').textContent = msg;
      this.openModal('modal-easter-egg');
      this.sounds.playFanfare();
    }

    /* ------------------------------------------------------------------------
       ANIMATION LOOP & PROCEDURAL SYSTEMS
       ------------------------------------------------------------------------ */
    animate() {
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // 1. Bunny Movement, Physics & AI
      this.updateBunny(delta, elapsed);

      // 2. Global Wind System on Flowers & Trees
      this.flowersList.forEach((fl) => {
        const sway = Math.sin(elapsed * fl.userData.windSpeed + fl.userData.windPhase) * fl.userData.windAmp;
        fl.head.rotation.z = sway;
      });

      this.treesList.forEach((tr) => {
        const sway = Math.sin(elapsed * tr.userData.windSpeed + tr.userData.windPhase) * tr.userData.windAmp;
        tr.rotation.z = sway;
      });

      // 3. Butterflies flight
      this.butterfliesList.forEach((bf) => {
        bf.userData.phase += delta * bf.userData.speed;
        const ox = bf.userData.basePos.x + Math.sin(bf.userData.phase) * bf.userData.orbitRadius;
        const oz = bf.userData.basePos.z + Math.cos(bf.userData.phase) * bf.userData.orbitRadius;
        const oy = bf.userData.basePos.y + Math.sin(bf.userData.phase * 2) * 0.4;
        bf.position.set(ox, oy, oz);
        bf.lWing.rotation.y = Math.sin(elapsed * 18) * 0.8;
        bf.rWing.rotation.y = -Math.sin(elapsed * 18) * 0.8;
      });

      // 4. Star Tree & Lanterns pulsing
      if (this.starLanterns) {
        this.starLanterns.forEach((sl, idx) => {
          const p = 1.0 + Math.sin(elapsed * 4 + idx) * 0.2;
          sl.scale.set(p, p, p);
        });
      }

      // 5. Star Tree & Moon Platform proximity checks
      this.checkProximities();

      // 6. Shooting Stars Event
      this.updateShootingStars(delta);

      // 7. Collectibles & Collisions
      this.updateCollectibles(elapsed);

      // 8. Particles update
      this.updateParticles(elapsed);

      // 9. Cake Candles flicker
      this.cakeCandles.forEach((c, idx) => {
        if (c.isLit) {
          const flick = 1 + Math.sin(elapsed * 12 + idx) * 0.15;
          c.flame.scale.set(flick, flick * 1.1, flick);
        }
      });

      // 10. Camera Follow Bunny
      if (this.cameraMode === 'follow' && this.bunnyGroup) {
        const targetCam = this.bunny.pos.clone().add(new THREE.Vector3(0, 6, 12));
        this.camera.position.lerp(targetCam, 0.06);
        this.controls.target.lerp(this.bunny.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0.08);
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(this.animate);
    }

    checkProximities() {
      const STAR_ORIGIN = new THREE.Vector3(0, 18, -26);

      // ① Star Tree Proximity
      const treeWorldPos = new THREE.Vector3(0, 19.8, -26);
      if (this.starIsland && !this.easterEggsFound.tree && this.bunny.pos.distanceTo(treeWorldPos) < 7.0) {
        this.easterEggsFound.tree = true;
        this.showToast('✨ “Some stars are meant to be found.” — Click các ngôi sao trên Cây Sao theo thứ tự!');
        this.sounds.playChime();
        if (this.starLanterns && this.starTreeSequence) {
          const firstStar = this.starLanterns[this.starTreeSequence[0]];
          if (firstStar) gsap.to(firstStar.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, yoyo: true, repeat: 4 });
        }
      }

      // ② Moon Platform Proximity
      const moonPos = new THREE.Vector3(0, 19.6, -17.5);
      if (this.moonPlatform && !this.moonPlatformTriggered && this.bunny.pos.distanceTo(moonPos) < 4.5) {
        this.moonPlatformTriggered = true;
        this.showToast('🌙 Moon Platform — Click để gửi gắm điều ước tuổi 17 vào ngân hà!');
        this.sounds.playChime();
        this.launchFirework(0, 32, -26, 0xffd166);
      }

      // ③ Wish Lake Proximity
      if (this.wishLake && !this._wishLakeHinted) {
        const lakeWorldPos = STAR_ORIGIN.clone().add(new THREE.Vector3(7, 1.85, 2));
        if (this.bunny.pos.distanceTo(lakeWorldPos) < 6.0) {
          this._wishLakeHinted = true;
          this.showToast('🌊 Wish Lake — Click mặt hồ ước nguyện để tìm Mảnh Sao!');
          this.sounds.playTone(600, 'sine', 0.3, 0.12);
        }
      }

      // ④ Constellation Garden Proximity
      if (!this.constellationSolved && !this._constellHinted) {
        const constellOrigin = STAR_ORIGIN.clone().add(new THREE.Vector3(-5, 2, 2));
        if (this.bunny.pos.distanceTo(constellOrigin) < 7.0) {
          this._constellHinted = true;
          this.showToast('🌟 Constellation Garden — Nối 7 điểm sao trên cỏ để thắp sáng chòm sao!');
          if (this.constellationNodes) {
            this.constellationNodes.forEach((n, i) => {
              setTimeout(() => gsap.to(n.material, { emissiveIntensity: 1.2, duration: 0.4, yoyo: true, repeat: 1 }), i * 80);
            });
          }
        }
      }

      // ⑤ Observatory Proximity
      if (this.observatoryGroup && !this._obsHinted) {
        const obsWorldPos = STAR_ORIGIN.clone().add(new THREE.Vector3(-7.5, 2, -3));
        if (this.bunny.pos.distanceTo(obsWorldPos) < 5.0) {
          this._obsHinted = true;
          this.showToast('🔭 Observatory — Nhấp vào kính thiên văn để ngắm vũ trụ tuổi 17!');
        }
      }

      // Rotate floating star shards in scene
      if (this.hiddenRockShard && this.hiddenRockShard.parent) {
        this.hiddenRockShard.rotation.y += 0.025;
      }
      if (this.moonShard && this.moonShard.parent) {
        this.moonShard.rotation.y += 0.025;
      }
    }

    updateShootingStars(delta) {
      this.shootingStarTimer += delta;
      if (this.shootingStarTimer > 20.0) {
        this.shootingStarTimer = 0;
        this.triggerShootingStar();
      }
    }

    triggerShootingStar() {
      this.launchFirework((Math.random() - 0.5) * 30, 45, -30 - Math.random() * 20, 0xffbe0b);
      // Spawn wish star on island ground
      const dropPos = new THREE.Vector3((Math.random() - 0.5) * 16, 1.8, 6 + Math.random() * 6);
      this.spawnWishStar(dropPos);
    }

    updateBunny(delta, elapsed) {
      if (!this.bunnyGroup) return;

      let moveX = 0;
      let moveZ = 0;

      if (this.keys['w'] || this.keys['arrowup']) moveZ -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) moveZ += 1;
      if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
      if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

      if (Math.abs(this.joystickDelta.x) > 0.1) moveX = this.joystickDelta.x;
      if (Math.abs(this.joystickDelta.y) > 0.1) moveZ = this.joystickDelta.y;

      const isMoving = moveX !== 0 || moveZ !== 0;

      if (isMoving) {
        this.bunny.idleTimer = 0;
        this.bunny.state = 'EXCITED';
        const moveDir = new THREE.Vector3(moveX, 0, moveZ).normalize();
        this.bunny.pos.addScaledVector(moveDir, this.bunny.speed * delta);

        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        this.bunnyGroup.rotation.y = THREE.MathUtils.lerp(this.bunnyGroup.rotation.y, targetAngle, 0.18);

        const hopY = Math.abs(Math.sin(elapsed * 10)) * 0.65;
        this.bunnyGroup.position.y = 0.5 + hopY;
        this.bunny.head.rotation.x = Math.sin(elapsed * 10) * 0.15;

        this.bunny.leftEar.rotation.x = Math.sin(elapsed * 12) * 0.2;
        this.bunny.rightEar.rotation.x = -Math.sin(elapsed * 12) * 0.2;
      } else {
        this.bunny.idleTimer += delta;
        this.bunnyGroup.position.y = 0.5;

        const breath = Math.sin(elapsed * 2.5) * 0.03;
        this.bunny.mesh.scale.set(1, 1 + breath, 1);

        if (Math.sin(elapsed * 1.5) > 0.8) {
          this.bunny.leftEar.rotation.z = 0.15 + Math.sin(elapsed * 8) * 0.12;
        }

        if (this.bunny.idleTimer > 5.0) {
          this.bunny.wanderTimer += delta;
          if (this.bunny.wanderTimer > 3.0) {
            this.bunny.wanderTimer = 0;
            const targetFlower = this.flowersList[Math.floor(Math.random() * this.flowersList.length)];
            if (targetFlower) {
              this.bunny.pos.lerp(targetFlower.position, 0.05);
            }
          }
        }
      }

      const distFromCenter = Math.hypot(this.bunny.pos.x, this.bunny.pos.z);
      if (distFromCenter > 24) {
        this.bunny.pos.normalize().multiplyScalar(24);
      }

      this.bunnyGroup.position.x = this.bunny.pos.x;
      this.bunnyGroup.position.z = this.bunny.pos.z;
    }

    updateCollectibles(elapsed) {
      for (let i = this.collectiblesList.length - 1; i >= 0; i--) {
        const item = this.collectiblesList[i];
        item.rotation.y += 0.025;
        item.position.y = item.userData.floatBaseY + Math.sin(elapsed * 3 + item.userData.floatPhase) * 0.25;

        const dist = Math.hypot(this.bunny.pos.x - item.position.x, this.bunny.pos.z - item.position.z);
        if (dist < 1.7) {
          this.score += item.userData.points;
          this.updateScoreUI();
          this.sounds.playCollect(item.userData.type);

          if (item.userData.type === 'wishStar') {
            this.collectStarShard(4, item);
            this.showToast('🌠 Wang Yi đã nhặt được Ngôi Sao Ước Nguyện (+25 Hoa & Mảnh Sao)!');
          }

          this.worldGroup.remove(item);
          this.collectiblesList.splice(i, 1);

          setTimeout(() => this.spawnCollectible(), 2200);

          if (this.score >= this.targetScore && !this.isMysteryUnlocked) {
            this.unlockSecretIsland();
          }
        }
      }
    }

    updateScoreUI() {
      const scoreTxt = document.getElementById('hud-score-text');
      if (scoreTxt) scoreTxt.textContent = this.score;
      const mysteryCur = document.getElementById('mystery-score-cur');
      if (mysteryCur) mysteryCur.textContent = this.score;

      if (this.score >= 100 && !this.easterEggsFound.flowers100) {
        this.easterEggsFound.flowers100 = true;
        this.showEasterEggModal('👑 Nữ Hoàng Hoa Wang Yi!', 'Cậu đã thu thập tận 100 đóa hoa! Một vương miện hoàng gia lấp lánh vừa được trao tặng cho Wang Yi!');
      }
    }

    unlockSecretIsland() {
      this.isMysteryUnlocked = true;

      const navLock = document.getElementById('nav-mystery-lock');
      if (navLock) navLock.textContent = '🌟';

      // Secret Portal illuminates
      if (this.secretPortal) {
        this.secretPortal.material.color.setHex(0x00f5d4);
        this.secretPortal.material.emissive.setHex(0x00f5d4);
        gsap.to(this.secretPortal.scale, { x: 1.4, y: 1.4, duration: 1.2, yoyo: true, repeat: 3 });
      }

      document.getElementById('mystery-content-locked').classList.add('hidden');
      document.getElementById('mystery-content-unlocked').classList.remove('hidden');

      this.sounds.playFanfare();
      this.launchFirework(0, 24, -16, 0xffd166);
      setTimeout(() => this.launchFirework(6, 26, -12, 0xff70a6), 400);

      this.showToast('✦ SECRET DISCOVERED: WANG YI\'S SECRET ISLAND ĐÃ MỞ KHÓA! ✦');
      this.openModal('modal-mystery');
    }

    updateParticles(elapsed) {
      if (this.fireflies) {
        const pos = this.fireflies.geometry.attributes.position.array;
        for (let i = 0; i < this.fireflyVelocities.length; i++) {
          const v = this.fireflyVelocities[i];
          pos[i * 3] += v.vx;
          pos[i * 3 + 1] = v.baseY + Math.sin(elapsed * 1.5 + i) * 1.2;
          pos[i * 3 + 2] += v.vz;

          if (Math.abs(pos[i * 3]) > 25) v.vx *= -1;
          if (Math.abs(pos[i * 3 + 2]) > 25) v.vz *= -1;
        }
        this.fireflies.geometry.attributes.position.needsUpdate = true;
      }

      if (this.fallingPetals) {
        const pPos = this.fallingPetals.geometry.attributes.position.array;
        for (let i = 0; i < this.petalSpeeds.length; i++) {
          const spd = this.petalSpeeds[i];
          pPos[i * 3 + 1] -= spd.vy;
          pPos[i * 3] += Math.sin(elapsed * 2 + spd.phase) * spd.sway;

          if (pPos[i * 3 + 1] < 1.0) {
            pPos[i * 3 + 1] = 25;
            pPos[i * 3] = (Math.random() - 0.5) * 45;
          }
        }
        this.fallingPetals.geometry.attributes.position.needsUpdate = true;
      }

      if (this.fireworksParticles && this.fireworksParticles.material.opacity > 0) {
        const fwPos = this.fireworksParticles.geometry.attributes.position.array;
        for (let i = 0; i < this.fwVelocities.length; i++) {
          const v = this.fwVelocities[i];
          if (v.life > 0) {
            fwPos[i * 3] += v.vx;
            fwPos[i * 3 + 1] += v.vy;
            fwPos[i * 3 + 2] += v.vz;
            v.vy -= 0.008;
            v.life -= 0.015;
          }
        }
        this.fireworksParticles.material.opacity -= 0.015;
        this.fireworksParticles.geometry.attributes.position.needsUpdate = true;
      }
    }

    handleLoadingDone() {
      const progressBar = document.getElementById('load-progress-bar');
      const loadScreen = document.getElementById('loading-screen');
      const cinemaOverlay = document.getElementById('cinematic-overlay');

      if (progressBar) progressBar.style.width = '100%';

      setTimeout(() => {
        if (loadScreen) loadScreen.classList.add('fade-out');
        if (cinemaOverlay) cinemaOverlay.classList.remove('hidden');
      }, 700);
    }

    showToast(msg) {
      const c = document.getElementById('toast-container');
      if (!c) return;
      const t = document.createElement('div');
      t.className = 'toast';
      t.innerHTML = msg;
      c.appendChild(t);
      setTimeout(() => {
        if (t.parentElement) t.parentElement.removeChild(t);
      }, 4200);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.app = new Birthday3DWorld();
  });

})();
