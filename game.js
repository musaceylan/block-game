/**
 * Block Bloom - Premium Block Puzzle Game
 * Ultimate Edition with Full Juice & Polish
 * iOS Native App Version
 */

// ==================== PIECE DEFINITIONS ====================
const PIECES = {
    dot: { shape: [[1]], weight: 5 },
    domino_h: { shape: [[1, 1]], weight: 8 },
    domino_v: { shape: [[1], [1]], weight: 8 },
    tromino_i_h: { shape: [[1, 1, 1]], weight: 10 },
    tromino_i_v: { shape: [[1], [1], [1]], weight: 10 },
    tromino_l1: { shape: [[1, 0], [1, 1]], weight: 10 },
    tromino_l2: { shape: [[0, 1], [1, 1]], weight: 10 },
    tromino_l3: { shape: [[1, 1], [1, 0]], weight: 10 },
    tromino_l4: { shape: [[1, 1], [0, 1]], weight: 10 },
    tetro_i_h: { shape: [[1, 1, 1, 1]], weight: 12 },
    tetro_i_v: { shape: [[1], [1], [1], [1]], weight: 12 },
    tetro_o: { shape: [[1, 1], [1, 1]], weight: 12 },
    tetro_t1: { shape: [[1, 1, 1], [0, 1, 0]], weight: 12 },
    tetro_t2: { shape: [[0, 1, 0], [1, 1, 1]], weight: 12 },
    tetro_t3: { shape: [[1, 0], [1, 1], [1, 0]], weight: 12 },
    tetro_t4: { shape: [[0, 1], [1, 1], [0, 1]], weight: 12 },
    tetro_s1: { shape: [[0, 1, 1], [1, 1, 0]], weight: 12 },
    tetro_s2: { shape: [[1, 1, 0], [0, 1, 1]], weight: 12 },
    tetro_l1: { shape: [[1, 0, 0], [1, 1, 1]], weight: 12 },
    tetro_l2: { shape: [[0, 0, 1], [1, 1, 1]], weight: 12 },
    tetro_l3: { shape: [[1, 1, 1], [1, 0, 0]], weight: 12 },
    tetro_l4: { shape: [[1, 1, 1], [0, 0, 1]], weight: 12 },
    pento_i_h: { shape: [[1, 1, 1, 1, 1]], weight: 6 },
    pento_i_v: { shape: [[1], [1], [1], [1], [1]], weight: 6 },
    pento_plus: { shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], weight: 6 },
    pento_u: { shape: [[1, 0, 1], [1, 1, 1]], weight: 6 },
    big_l: { shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], weight: 3 },
    big_square: { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 2 },
};

const BLOCK_COLORS = ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7', 'block-8'];
const PARTICLE_COLORS = ['#ff4d6d', '#4d79ff', '#00d68f', '#ffb800', '#a855f7', '#ff6b35', '#00d4ff', '#f472b6'];

// ==================== ACHIEVEMENTS DEFINITIONS ====================
const ACHIEVEMENTS = [
    { id: 'first_line', name: 'First Blood', desc: 'Clear your first line', icon: '🎯', check: (s) => s.totalLinesEver >= 1 },
    { id: 'line_master', name: 'Line Master', desc: 'Clear 100 lines total', icon: '📏', check: (s) => s.totalLinesEver >= 100 },
    { id: 'line_legend', name: 'Line Legend', desc: 'Clear 500 lines total', icon: '🌟', check: (s) => s.totalLinesEver >= 500 },
    { id: 'combo_3', name: 'Combo Starter', desc: 'Get a 3x combo', icon: '⚡', check: (s) => s.bestComboEver >= 3 },
    { id: 'combo_5', name: 'Combo Master', desc: 'Get a 5x combo', icon: '🔥', check: (s) => s.bestComboEver >= 5 },
    { id: 'combo_10', name: 'Combo Legend', desc: 'Get a 10x combo', icon: '💥', check: (s) => s.bestComboEver >= 10 },
    { id: 'score_100', name: 'Century', desc: 'Score 100 points', icon: '💯', check: (s) => s.highScore >= 100 },
    { id: 'score_500', name: 'High Roller', desc: 'Score 500 points', icon: '🎰', check: (s) => s.highScore >= 500 },
    { id: 'score_1000', name: 'Thousand Club', desc: 'Score 1000 points', icon: '🏆', check: (s) => s.highScore >= 1000 },
    { id: 'score_5000', name: 'Block Master', desc: 'Score 5000 points', icon: '👑', check: (s) => s.highScore >= 5000 },
    { id: 'games_10', name: 'Getting Started', desc: 'Play 10 games', icon: '🎮', check: (s) => s.gamesPlayed >= 10 },
    { id: 'games_50', name: 'Dedicated', desc: 'Play 50 games', icon: '🎯', check: (s) => s.gamesPlayed >= 50 },
    { id: 'games_100', name: 'Addicted', desc: 'Play 100 games', icon: '🤩', check: (s) => s.gamesPlayed >= 100 },
    { id: 'pieces_100', name: 'Builder', desc: 'Place 100 pieces total', icon: '🧱', check: (s) => s.totalPiecesEver >= 100 },
    { id: 'pieces_1000', name: 'Architect', desc: 'Place 1000 pieces total', icon: '🏗️', check: (s) => s.totalPiecesEver >= 1000 },
    { id: 'daily_1', name: 'Daily Player', desc: 'Complete a daily challenge', icon: '📅', check: (s) => s.dailiesCompleted >= 1 },
    { id: 'daily_7', name: 'Weekly Warrior', desc: 'Complete 7 daily challenges', icon: '📆', check: (s) => s.dailiesCompleted >= 7 },
];

// ==================== SEEDED RANDOM ====================
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    }

    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

function getDailySeed() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// ==================== SOUND ENGINE (Web Audio API) ====================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initialized = false;
        this.masterGain = null;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.3;
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio not supported');
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Soft pop for piece pickup
    playPickup() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // Satisfying thud for placement
    playPlace() {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        // Low thud
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc1.start();
        osc1.stop(this.ctx.currentTime + 0.15);

        // Click overlay
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'square';
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.frequency.setValueAtTime(1200, this.ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);
        osc2.start();
        osc2.stop(this.ctx.currentTime + 0.03);
    }

    // Bright chime for line clear
    playLineClear(lineCount = 1) {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const baseFreqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const delay = 0.05;

        for (let i = 0; i < Math.min(lineCount + 2, 4); i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(this.masterGain);

            const startTime = this.ctx.currentTime + i * delay;
            osc.frequency.setValueAtTime(baseFreqs[i], startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        }

        // Whoosh sound
        this.playWhoosh();
    }

    playWhoosh() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }

        const noise = this.ctx.createBufferSource();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        noise.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.2);
        filter.Q.value = 1;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        noise.start();
    }

    // Combo sound - escalating
    playCombo(comboLevel) {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const baseFreq = 400 + comboLevel * 100;

        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(this.masterGain);

            const startTime = this.ctx.currentTime + i * 0.08;
            osc.frequency.setValueAtTime(baseFreq + i * 200, startTime);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
        }
    }

    // Error buzz for invalid placement
    playError() {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    // Game over sound
    playGameOver() {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const notes = [392, 349.23, 329.63, 261.63]; // G4, F4, E4, C4

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(this.masterGain);

            const startTime = this.ctx.currentTime + i * 0.2;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    // New high score fanfare
    playNewBest() {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 to G6

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(this.masterGain);

            const startTime = this.ctx.currentTime + i * 0.1;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    // Milestone celebration
    playMilestone() {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        // Sparkle sound
        for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(this.masterGain);

            const startTime = this.ctx.currentTime + i * 0.05;
            const freq = 1000 + Math.random() * 2000;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            osc.start(startTime);
            osc.stop(startTime + 0.2);
        }
    }

    // UI click
    playClick() {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
}

// ==================== GAME CLASS ====================
class BlockBloom {
    constructor() {
        this.gridSize = 10;
        this.grid = [];
        this.pieces = [null, null, null];
        this.score = 0;
        this.displayScore = 0;
        this.bestScore = 0;
        this.combo = 0;
        this.comboMultiplier = 1.0;
        this.maxCombo = 0;
        this.flowMeter = 0;
        this.flowDecayTimer = null;
        this.gameMode = 'classic';
        this.isGameOver = false;
        this.gameStarted = false;
        this.moveHistory = [];
        this.maxUndo = 3;
        this.undosRemaining = 3;
        this.swapsRemaining = 1;
        this.bombsRemaining = 0;
        this.isBombMode = false;
        this.linesCleared = 0;
        this.piecesPlaced = 0;
        this.isNewBest = false;
        this.previousBest = 0;
        this.totalLinesCleared = 0;
        this.lastMilestone = 0;

        this.draggedPiece = null;
        this.draggedPieceIndex = null;
        this.ghostPosition = null;
        this.floatingElement = null;
        this.dragTrail = [];
        this.trailTimer = null;

        this.soundEnabled = true;
        this.hapticEnabled = true;
        this.colorblindMode = false;
        this.zenTheme = false;

        this.tutorialStep = 0;
        this.tutorialDone = localStorage.getItem('blockbloom_tutorial_done') === 'true';

        // Animation state
        this.scoreAnimationId = null;
        this.isPaused = false;

        // Sound engine
        this.sound = new SoundEngine();

        // Statistics (persistent)
        this.stats = {
            gamesPlayed: 0,
            highScore: 0,
            totalLinesEver: 0,
            totalPiecesEver: 0,
            bestComboEver: 0,
            totalScore: 0,
            dailiesCompleted: 0,
            lastDailyDate: null
        };

        // Achievements
        this.unlockedAchievements = new Set();
        this.pendingAchievements = [];

        // Daily challenge
        this.dailyRng = null;
        this.dailySeed = getDailySeed();

        this.init();
    }

    init() {
        this.loadSettings();
        this.loadBestScore();
        this.loadStats();
        this.loadAchievements();
        this.createGrid();
        this.setupEventListeners();
        this.showModal('menu-modal');
        this.startIdleAnimations();

        if (!this.tutorialDone) {
            setTimeout(() => this.startTutorial(), 500);
        }
    }

    // ==================== IDLE ANIMATIONS ====================
    startIdleAnimations() {
        // Breathing animation for piece slots
        setInterval(() => {
            if (!this.gameStarted || this.isGameOver) return;
            const slots = document.querySelectorAll('.piece-slot:not(.used):not(.dragging)');
            slots.forEach((slot, i) => {
                setTimeout(() => {
                    slot.classList.add('breathing');
                    setTimeout(() => slot.classList.remove('breathing'), 1000);
                }, i * 200);
            });
        }, 3000);
    }

    // ==================== GRID ====================
    createGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = { filled: false, colorClass: null };
            }
        }
    }

    renderGrid() {
        const board = document.getElementById('board');
        if (!board) return;

        board.innerHTML = '';

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (this.grid[y][x].filled) {
                    cell.classList.add('filled', this.grid[y][x].colorClass);
                }

                if (this.ghostPosition && this.draggedPiece) {
                    const shape = this.draggedPiece.shape;
                    const canPlace = this.canPlacePiece(this.draggedPiece, this.ghostPosition.x, this.ghostPosition.y);

                    for (let py = 0; py < shape.length; py++) {
                        for (let px = 0; px < shape[py].length; px++) {
                            if (shape[py][px] === 1) {
                                const gx = this.ghostPosition.x + px;
                                const gy = this.ghostPosition.y + py;
                                if (gx === x && gy === y && !this.grid[y][x].filled) {
                                    cell.classList.add(canPlace ? 'preview-valid' : 'preview-invalid');
                                }
                            }
                        }
                    }
                }

                board.appendChild(cell);
            }
        }
    }

    // ==================== PIECES ====================
    generatePieces() {
        const pieceKeys = Object.keys(PIECES);
        const weights = pieceKeys.map(k => PIECES[k].weight);
        const totalWeight = weights.reduce((a, b) => a + b, 0);

        for (let i = 0; i < 3; i++) {
            if (this.pieces[i] === null) {
                let random;

                // Use seeded random for daily challenge
                if (this.gameMode === 'daily' && this.dailyRng) {
                    random = this.dailyRng.next() * totalWeight;
                } else {
                    random = Math.random() * totalWeight;
                }

                let selectedKey = pieceKeys[0];

                for (let j = 0; j < pieceKeys.length; j++) {
                    random -= weights[j];
                    if (random <= 0) {
                        selectedKey = pieceKeys[j];
                        break;
                    }
                }

                const pieceData = PIECES[selectedKey];
                const colorIndex = this.gameMode === 'daily' && this.dailyRng
                    ? this.dailyRng.nextInt(0, BLOCK_COLORS.length - 1)
                    : Math.floor(Math.random() * BLOCK_COLORS.length);
                const colorClass = BLOCK_COLORS[colorIndex];

                this.pieces[i] = {
                    key: selectedKey,
                    shape: pieceData.shape,
                    colorClass: colorClass,
                    cellCount: this.countCells(pieceData.shape),
                    isNew: true
                };
            }
        }

        this.renderPieces();
        this.checkPiecesPlaceable();
    }

    countCells(shape) {
        return shape.flat().filter(c => c === 1).length;
    }

    renderPieces() {
        const tray = document.getElementById('pieces-tray');
        if (!tray) return;

        tray.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'piece-slot';
            slot.dataset.index = i;

            const piece = this.pieces[i];
            if (!piece) {
                slot.classList.add('used');
                tray.appendChild(slot);
                continue;
            }

            // Entrance animation for new pieces
            if (piece.isNew) {
                slot.classList.add('entering');
                piece.isNew = false;
                setTimeout(() => slot.classList.remove('entering'), 500);
            }

            const pieceGrid = document.createElement('div');
            pieceGrid.className = 'piece-grid';
            pieceGrid.style.gridTemplateColumns = `repeat(${piece.shape[0].length}, 1fr)`;

            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'piece-cell';
                    if (piece.shape[y][x] === 1) {
                        cell.classList.add('filled', piece.colorClass);
                    }
                    pieceGrid.appendChild(cell);
                }
            }

            slot.appendChild(pieceGrid);
            tray.appendChild(slot);
            this.addPieceDragListeners(slot, i);
        }
    }

    checkPiecesPlaceable() {
        const slots = document.querySelectorAll('.piece-slot');

        this.pieces.forEach((piece, index) => {
            if (!piece) return;

            let canPlace = false;
            for (let y = 0; y < this.gridSize && !canPlace; y++) {
                for (let x = 0; x < this.gridSize && !canPlace; x++) {
                    if (this.canPlacePiece(piece, x, y)) {
                        canPlace = true;
                    }
                }
            }

            if (!canPlace && slots[index]) {
                slots[index].classList.add('cannot-place');
            }
        });
    }

    // ==================== PLACEMENT ====================
    canPlacePiece(piece, startX, startY) {
        if (!piece) return false;

        const shape = piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    const gridX = startX + x;
                    const gridY = startY + y;

                    if (gridX < 0 || gridX >= this.gridSize || gridY < 0 || gridY >= this.gridSize) {
                        return false;
                    }

                    if (this.grid[gridY] && this.grid[gridY][gridX] && this.grid[gridY][gridX].filled) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece(pieceIndex, startX, startY) {
        const piece = this.pieces[pieceIndex];
        if (!piece || !this.canPlacePiece(piece, startX, startY)) {
            this.sound.playError();
            this.haptic('error');
            return false;
        }

        this.saveState();

        const shape = piece.shape;
        const placedCells = [];

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    const gridX = startX + x;
                    const gridY = startY + y;
                    this.grid[gridY][gridX] = { filled: true, colorClass: piece.colorClass };
                    placedCells.push({ x: gridX, y: gridY });
                }
            }
        }

        // Play placement sound
        this.sound.playPlace();
        this.haptic('place');

        const pointsEarned = piece.cellCount;
        this.piecesPlaced++;
        this.pieces[pieceIndex] = null;

        // Show floating score for placement
        this.showFloatingScore(pointsEarned, placedCells[0]);

        // Animate placed cells with squash effect
        this.animatePlacedCells(placedCells);

        // Check and clear lines with hit pause
        const cleared = this.checkAndClearLines();

        if (cleared > 0) {
            this.combo++;
            this.comboMultiplier = Math.min(3.0, 1.0 + (this.combo - 1) * 0.2);
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            this.addFlowMeter(cleared * 15);
            this.showComboPopup(cleared);

            // Play sounds
            this.sound.playLineClear(cleared);
            if (this.combo > 1) {
                setTimeout(() => this.sound.playCombo(this.combo), 200);
            }

            // Screen shake for big clears
            if (cleared >= 2) {
                this.shakeScreen(cleared);
            }

            // Background reaction
            this.pulseBackground(cleared);

            // Check milestones
            this.checkMilestones();
        } else {
            this.combo = 0;
            this.comboMultiplier = 1.0;
        }

        // Add score with animation
        const totalPoints = pointsEarned + (cleared > 0 ? this.calculateLineScore(cleared) : 0);
        this.addScore(totalPoints);

        if (this.pieces.every(p => p === null)) {
            setTimeout(() => {
                this.generatePieces();
                if (this.checkGameOver()) {
                    setTimeout(() => this.endGame(), 300);
                }
            }, 200);
        } else {
            this.renderPieces();
            if (this.checkGameOver()) {
                setTimeout(() => this.endGame(), 600);
            }
        }

        this.render();
        this.saveGame();

        return true;
    }

    calculateLineScore(lineCount) {
        let lineScore = lineCount * 10;
        if (lineCount >= 2) lineScore += (lineCount - 1) * 25;
        return Math.floor(lineScore * this.comboMultiplier);
    }

    animatePlacedCells(cells) {
        const board = document.getElementById('board');
        if (!board) return;

        cells.forEach((cell, i) => {
            const index = cell.y * this.gridSize + cell.x;
            const cellEl = board.children[index];
            if (cellEl) {
                // Initial squash state
                cellEl.style.transform = 'scale(0) rotate(-10deg)';
                cellEl.style.opacity = '0';

                setTimeout(() => {
                    cellEl.classList.add('placing');
                    cellEl.style.transform = '';
                    cellEl.style.opacity = '';

                    // Create ripple effect
                    this.createPlacementRipple(cellEl);

                    // Spawn small particles
                    this.spawnParticles(cellEl, 3);

                    setTimeout(() => cellEl.classList.remove('placing'), 400);
                }, i * 40);
            }
        });
    }

    createPlacementRipple(element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'placement-ripple';
        ripple.style.left = `${rect.left + rect.width / 2}px`;
        ripple.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // ==================== FLOATING SCORE POPUP ====================
    showFloatingScore(points, cell) {
        const board = document.getElementById('board');
        if (!board || !cell) return;

        const rect = board.getBoundingClientRect();
        const cellSize = rect.width / this.gridSize;

        const popup = document.createElement('div');
        popup.className = 'floating-score';
        popup.textContent = `+${points}`;
        popup.style.left = `${rect.left + cell.x * cellSize + cellSize / 2}px`;
        popup.style.top = `${rect.top + cell.y * cellSize}px`;

        document.body.appendChild(popup);

        // Trigger animation
        requestAnimationFrame(() => {
            popup.classList.add('animate');
        });

        setTimeout(() => popup.remove(), 1000);
    }

    // ==================== LINE CLEARING ====================
    checkAndClearLines() {
        const rowsToClear = [];
        const colsToClear = [];

        for (let y = 0; y < this.gridSize; y++) {
            if (this.grid[y].every(cell => cell.filled)) {
                rowsToClear.push(y);
            }
        }

        for (let x = 0; x < this.gridSize; x++) {
            let full = true;
            for (let y = 0; y < this.gridSize; y++) {
                if (!this.grid[y][x].filled) {
                    full = false;
                    break;
                }
            }
            if (full) colsToClear.push(x);
        }

        const totalLines = rowsToClear.length + colsToClear.length;

        if (totalLines > 0) {
            this.linesCleared += totalLines;
            this.totalLinesCleared += totalLines;

            // HIT PAUSE - freeze before animation
            this.hitPause(50 + totalLines * 20);

            this.clearLinesAnimated(rowsToClear, colsToClear);
        }

        return totalLines;
    }

    hitPause(duration) {
        this.isPaused = true;
        document.body.classList.add('hit-pause');
        setTimeout(() => {
            this.isPaused = false;
            document.body.classList.remove('hit-pause');
        }, duration);
    }

    clearLinesAnimated(rows, cols) {
        const cellsToClear = new Set();
        const cellsWithDelay = [];

        for (let y of rows) {
            for (let x = 0; x < this.gridSize; x++) {
                const key = `${x},${y}`;
                if (!cellsToClear.has(key)) {
                    cellsToClear.add(key);
                    cellsWithDelay.push({ x, y, delay: x * 25 });
                }
            }
        }

        for (let x of cols) {
            for (let y = 0; y < this.gridSize; y++) {
                const key = `${x},${y}`;
                if (!cellsToClear.has(key)) {
                    cellsToClear.add(key);
                    cellsWithDelay.push({ x, y, delay: y * 25 });
                }
            }
        }

        const board = document.getElementById('board');
        if (board) {
            board.classList.add('line-clearing');
            setTimeout(() => board.classList.remove('line-clearing'), 500);

            const cells = board.querySelectorAll('.cell');

            // Create anticipation glow
            cellsWithDelay.forEach(({ x, y }) => {
                const index = y * this.gridSize + x;
                if (cells[index]) {
                    cells[index].classList.add('anticipation');
                }
            });

            // After anticipation, start clearing
            setTimeout(() => {
                this.createLineFlash(rows, cols);

                cellsWithDelay.forEach(({ x, y, delay }) => {
                    const index = y * this.gridSize + x;
                    if (cells[index]) {
                        setTimeout(() => {
                            cells[index].classList.remove('anticipation');
                            cells[index].classList.add('clearing');
                            this.spawnParticles(cells[index], 8);
                            this.createExplosionRing(cells[index]);
                        }, delay);
                    }
                });
            }, 80);
        }

        setTimeout(() => {
            cellsToClear.forEach(coord => {
                const [x, y] = coord.split(',').map(Number);
                this.grid[y][x] = { filled: false, colorClass: null };
            });
            this.renderGrid();
        }, 700);
    }

    createLineFlash(rows, cols) {
        const board = document.getElementById('board');
        if (!board) return;

        const rect = board.getBoundingClientRect();
        const cellSize = rect.width / this.gridSize;
        const padding = 8;

        rows.forEach(y => {
            const flash = document.createElement('div');
            flash.className = 'line-flash horizontal';
            flash.style.left = `${rect.left + padding}px`;
            flash.style.top = `${rect.top + padding + y * cellSize}px`;
            flash.style.width = `${rect.width - padding * 2}px`;
            flash.style.height = `${cellSize}px`;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 600);
        });

        cols.forEach(x => {
            const flash = document.createElement('div');
            flash.className = 'line-flash vertical';
            flash.style.left = `${rect.left + padding + x * cellSize}px`;
            flash.style.top = `${rect.top + padding}px`;
            flash.style.width = `${cellSize}px`;
            flash.style.height = `${rect.height - padding * 2}px`;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 600);
        });
    }

    createExplosionRing(element) {
        const rect = element.getBoundingClientRect();
        const ring = document.createElement('div');
        ring.className = 'explosion-ring';
        ring.style.left = `${rect.left + rect.width / 2}px`;
        ring.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 500);
    }

    // ==================== SCREEN EFFECTS ====================
    shakeScreen(intensity = 1) {
        const board = document.getElementById('board');
        if (board) {
            board.style.setProperty('--shake-intensity', intensity);
            board.classList.add('shake');
            setTimeout(() => board.classList.remove('shake'), 300);
        }
    }

    pulseBackground(intensity = 1) {
        const container = document.querySelector('.game-container');
        if (container) {
            container.style.setProperty('--pulse-intensity', intensity);
            container.classList.add('bg-pulse');
            setTimeout(() => container.classList.remove('bg-pulse'), 500);
        }
    }

    // ==================== MILESTONES ====================
    checkMilestones() {
        const milestones = [10, 25, 50, 100, 150, 200];

        for (const milestone of milestones) {
            if (this.totalLinesCleared >= milestone && this.lastMilestone < milestone) {
                this.lastMilestone = milestone;
                this.showMilestoneCelebration(milestone);
                this.sound.playMilestone();
                break;
            }
        }

        // Check for combo milestones
        if (this.combo === 5 || this.combo === 10) {
            this.showMilestoneCelebration(`${this.combo}x COMBO!`);
            this.sound.playMilestone();
        }
    }

    showMilestoneCelebration(milestone) {
        const celebration = document.createElement('div');
        celebration.className = 'milestone-celebration';
        celebration.innerHTML = `
            <div class="milestone-icon">🎉</div>
            <div class="milestone-text">${typeof milestone === 'number' ? milestone + ' LINES!' : milestone}</div>
        `;
        document.body.appendChild(celebration);

        // Spawn lots of particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                this.spawnConfetti(x, y);
            }, i * 50);
        }

        setTimeout(() => celebration.remove(), 2000);
    }

    spawnConfetti(x, y) {
        const container = document.getElementById('particles');
        if (!container) return;

        for (let i = 0; i < 3; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 100;

            confetti.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                background: ${PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]};
                --tx: ${tx}px;
                --ty: ${ty}px;
                --rotation: ${Math.random() * 720 - 360}deg;
            `;

            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 1500);
        }
    }

    // ==================== PARTICLES ====================
    spawnParticles(element, count) {
        const container = document.getElementById('particles');
        if (!container) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const distance = 50 + Math.random() * 80;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                background: ${PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]};
                --tx: ${tx}px;
                --ty: ${ty}px;
            `;

            container.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    // ==================== SCORING ====================
    addScore(points) {
        const oldScore = this.score;
        this.score += points;

        // Animate score counting up
        this.animateScoreCounter(oldScore, this.score);

        // Check for new best
        if (this.score > this.bestScore) {
            if (!this.isNewBest && oldScore <= this.previousBest) {
                this.isNewBest = true;
                this.sound.playNewBest();
                this.showNewBestNotification();
            }
            this.bestScore = this.score;
            this.saveBestScore();
        }
    }

    animateScoreCounter(from, to) {
        if (this.scoreAnimationId) {
            cancelAnimationFrame(this.scoreAnimationId);
        }

        const scoreEl = document.getElementById('score');
        if (!scoreEl) return;

        const duration = 300;
        const startTime = performance.now();
        const diff = to - from;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            this.displayScore = Math.round(from + diff * eased);
            scoreEl.textContent = this.displayScore.toLocaleString();

            if (progress < 1) {
                this.scoreAnimationId = requestAnimationFrame(animate);
            } else {
                scoreEl.classList.add('pop');
                setTimeout(() => scoreEl.classList.remove('pop'), 300);
            }
        };

        this.scoreAnimationId = requestAnimationFrame(animate);
    }

    showNewBestNotification() {
        const notification = document.createElement('div');
        notification.className = 'new-best-notification';
        notification.innerHTML = '🏆 NEW BEST!';
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 2000);
    }

    updateScoreDisplay() {
        const bestEl = document.getElementById('best-score');
        if (bestEl) bestEl.textContent = this.bestScore.toLocaleString();

        const comboValue = document.getElementById('combo-value');
        const comboBar = document.getElementById('combo-bar');
        const comboMeter = document.getElementById('combo-meter');

        if (comboValue) comboValue.textContent = `x${this.comboMultiplier.toFixed(1)}`;
        if (comboBar) {
            const comboPercent = Math.min(100, (this.comboMultiplier - 1) / 2 * 100);
            comboBar.style.width = `${comboPercent}%`;
        }
        if (comboMeter) {
            comboMeter.classList.toggle('active', this.comboMultiplier > 1);
        }
    }

    showComboPopup(lines) {
        const popup = document.getElementById('combo-popup');
        if (!popup) return;

        let text = '';
        if (lines >= 4) text = 'INCREDIBLE!';
        else if (lines >= 3) text = 'AMAZING!';
        else if (lines >= 2) text = 'GREAT!';
        else if (this.combo >= 3) text = `${this.combo}x COMBO!`;
        else if (lines === 1 && this.combo === 1) text = 'NICE!';
        else return;

        popup.textContent = text;
        popup.classList.remove('show');
        void popup.offsetWidth;
        popup.classList.add('show');
    }

    // ==================== FLOW METER ====================
    addFlowMeter(amount) {
        this.flowMeter = Math.min(100, this.flowMeter + amount);
        this.updateFlowDisplay();
    }

    startFlowDecay() {
        if (this.flowDecayTimer) clearInterval(this.flowDecayTimer);

        this.flowDecayTimer = setInterval(() => {
            if (this.flowMeter > 0 && !this.isGameOver && this.gameStarted) {
                this.flowMeter = Math.max(0, this.flowMeter - 1);
                this.updateFlowDisplay();
            }
        }, 500);
    }

    updateFlowDisplay() {
        const flowValue = document.getElementById('flow-value');
        const flowBar = document.getElementById('flow-bar');
        const flowMeter = document.getElementById('flow-meter');

        if (flowValue) flowValue.textContent = `${Math.round(this.flowMeter)}%`;
        if (flowBar) {
            flowBar.style.width = `${this.flowMeter}%`;

            let level = 0;
            if (this.flowMeter >= 100) level = 4;
            else if (this.flowMeter >= 75) level = 3;
            else if (this.flowMeter >= 50) level = 2;
            else if (this.flowMeter >= 25) level = 1;

            flowBar.setAttribute('data-level', level);
        }
        if (flowMeter) {
            flowMeter.classList.toggle('active', this.flowMeter > 0);
        }
    }

    // ==================== GAME STATE ====================
    checkGameOver() {
        if (this.pieces.every(p => p === null)) {
            return false;
        }

        for (let piece of this.pieces) {
            if (piece === null) continue;

            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    if (this.canPlacePiece(piece, x, y)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    startGame(mode = 'classic') {
        // Initialize sound on user interaction
        this.sound.init();
        this.sound.playClick();

        this.gameMode = mode;
        this.score = 0;
        this.displayScore = 0;
        this.combo = 0;
        this.comboMultiplier = 1.0;
        this.maxCombo = 0;
        this.flowMeter = 0;
        this.isGameOver = false;
        this.gameStarted = true;
        this.isNewBest = false;
        this.previousBest = this.bestScore;
        this.pieces = [null, null, null];
        this.moveHistory = [];
        this.undosRemaining = 3;
        this.swapsRemaining = 1;
        this.bombsRemaining = 0;
        this.linesCleared = 0;
        this.piecesPlaced = 0;
        this.totalLinesCleared = 0;
        this.lastMilestone = 0;

        // Initialize daily challenge RNG
        if (mode === 'daily') {
            this.dailySeed = getDailySeed();
            this.dailyRng = new SeededRandom(this.dailySeed);
        } else {
            this.dailyRng = null;
        }

        this.createGrid();
        this.generatePieces();
        this.render();
        this.updatePowerUpButtons();
        this.startFlowDecay();

        // Update score display
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = '0';

        this.hideModal('menu-modal');
        this.hideModal('gameover-modal');

        document.body.classList.toggle('theme-zen', mode === 'zen' || this.zenTheme);
    }

    endGame() {
        this.isGameOver = true;
        this.gameStarted = false;

        this.sound.playGameOver();
        this.haptic('gameOver');

        // Update persistent statistics
        this.stats.gamesPlayed++;
        this.stats.totalLinesEver += this.linesCleared;
        this.stats.totalPiecesEver += this.piecesPlaced;
        this.stats.totalScore += this.score;
        if (this.score > this.stats.highScore) {
            this.stats.highScore = this.score;
        }
        if (this.maxCombo > this.stats.bestComboEver) {
            this.stats.bestComboEver = this.maxCombo;
        }

        // Track daily challenge completion
        if (this.gameMode === 'daily') {
            const today = new Date().toDateString();
            if (this.stats.lastDailyDate !== today) {
                this.stats.dailiesCompleted++;
                this.stats.lastDailyDate = today;
            }
        }

        this.saveStats();

        // Check achievements
        this.checkAchievements();

        const finalScore = document.getElementById('final-score');
        const statLines = document.getElementById('stat-lines');
        const statCombo = document.getElementById('stat-combo');
        const statPieces = document.getElementById('stat-pieces');
        const newBestBadge = document.getElementById('new-best-badge');

        if (finalScore) finalScore.textContent = this.score.toLocaleString();
        if (statLines) statLines.textContent = this.linesCleared;
        if (statCombo) statCombo.textContent = `x${this.maxCombo}`;
        if (statPieces) statPieces.textContent = this.piecesPlaced;

        if (newBestBadge) {
            newBestBadge.classList.toggle('hidden', !this.isNewBest);
        }

        this.showModal('gameover-modal');
        localStorage.removeItem('blockbloom_save');

        // Show pending achievements after modal
        setTimeout(() => this.showPendingAchievements(), 500);
    }

    // ==================== POWER-UPS ====================
    saveState() {
        if (this.moveHistory.length >= this.maxUndo) {
            this.moveHistory.shift();
        }

        this.moveHistory.push({
            grid: JSON.parse(JSON.stringify(this.grid)),
            pieces: JSON.parse(JSON.stringify(this.pieces)),
            score: this.score,
            combo: this.combo,
            comboMultiplier: this.comboMultiplier
        });
    }

    undo() {
        if (this.undosRemaining <= 0 || this.moveHistory.length === 0) return false;

        this.sound.playClick();

        const state = this.moveHistory.pop();
        this.grid = state.grid;
        this.pieces = state.pieces;
        this.score = state.score;
        this.displayScore = state.score;
        this.combo = state.combo;
        this.comboMultiplier = state.comboMultiplier;

        this.undosRemaining--;
        this.render();
        this.renderPieces();
        this.updatePowerUpButtons();
        this.haptic('click');

        // Update score display immediately
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = this.score.toLocaleString();

        return true;
    }

    swapPieces() {
        if (this.swapsRemaining <= 0) return false;

        this.sound.playClick();
        this.saveState();
        this.pieces = [null, null, null];
        this.generatePieces();

        this.swapsRemaining--;
        this.updatePowerUpButtons();
        this.haptic('click');
        return true;
    }

    activateBomb() {
        if (this.bombsRemaining <= 0) return false;

        this.sound.playClick();
        this.isBombMode = true;
        document.getElementById('board')?.classList.add('bomb-mode');
        return true;
    }

    useBomb(x, y) {
        if (!this.isBombMode) return false;

        this.saveState();

        const clearedCells = [];
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize) {
                    if (this.grid[ny][nx].filled) {
                        clearedCells.push({ x: nx, y: ny });
                    }
                    this.grid[ny][nx] = { filled: false, colorClass: null };
                }
            }
        }

        const board = document.getElementById('board');
        if (board) {
            clearedCells.forEach(cell => {
                const index = cell.y * this.gridSize + cell.x;
                if (board.children[index]) {
                    this.spawnParticles(board.children[index], 5);
                }
            });
        }

        this.bombsRemaining--;
        this.isBombMode = false;
        document.getElementById('board')?.classList.remove('bomb-mode');

        this.render();
        this.updatePowerUpButtons();
        this.haptic('place');
        return true;
    }

    updatePowerUpButtons() {
        const undoCount = document.getElementById('undo-count');
        const swapCount = document.getElementById('swap-count');
        const bombCount = document.getElementById('bomb-count');
        const undoBtn = document.getElementById('undo-btn');
        const swapBtn = document.getElementById('swap-btn');
        const bombBtn = document.getElementById('bomb-btn');

        if (undoCount) {
            undoCount.textContent = this.undosRemaining;
            undoCount.classList.toggle('zero', this.undosRemaining === 0);
        }
        if (swapCount) {
            swapCount.textContent = this.swapsRemaining;
            swapCount.classList.toggle('zero', this.swapsRemaining === 0);
        }
        if (bombCount) {
            bombCount.textContent = this.bombsRemaining;
            bombCount.classList.toggle('zero', this.bombsRemaining === 0);
        }

        if (undoBtn) undoBtn.disabled = this.undosRemaining <= 0 || this.moveHistory.length === 0;
        if (swapBtn) swapBtn.disabled = this.swapsRemaining <= 0;
        if (bombBtn) bombBtn.disabled = this.bombsRemaining <= 0;
    }

    // ==================== HAPTICS ====================
    haptic(type = 'light') {
        if (!this.hapticEnabled || !navigator.vibrate) return;

        const patterns = {
            light: [10],
            click: [15],
            place: [20, 30, 10],
            lineClear: [30, 50, 30],
            combo: [10, 20, 10, 20, 10, 20],
            error: [50, 30, 50],
            gameOver: [100, 50, 100, 50, 200],
            milestone: [20, 40, 20, 40, 20, 40, 100]
        };

        navigator.vibrate(patterns[type] || patterns.light);
    }

    // ==================== DRAG & DROP ====================
    addPieceDragListeners(slot, index) {
        slot.addEventListener('touchstart', (e) => this.startDrag(e, index), { passive: false });
        slot.addEventListener('mousedown', (e) => this.startDrag(e, index));
    }

    setupEventListeners() {
        document.addEventListener('touchmove', (e) => this.moveDrag(e), { passive: false });
        document.addEventListener('touchend', (e) => this.endDrag(e));
        document.addEventListener('mousemove', (e) => this.moveDrag(e));
        document.addEventListener('mouseup', (e) => this.endDrag(e));

        document.getElementById('board')?.addEventListener('click', (e) => {
            if (this.isBombMode) {
                const cell = e.target.closest('.cell');
                if (cell) {
                    this.useBomb(parseInt(cell.dataset.x), parseInt(cell.dataset.y));
                }
            }
        });

        document.getElementById('undo-btn')?.addEventListener('click', () => this.undo());
        document.getElementById('swap-btn')?.addEventListener('click', () => this.swapPieces());
        document.getElementById('bomb-btn')?.addEventListener('click', () => this.activateBomb());

        document.getElementById('menu-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.showModal('menu-modal');
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.init();
                this.sound.playClick();
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.gameMode = btn.dataset.mode;
            });
        });

        document.getElementById('start-game-btn')?.addEventListener('click', () => {
            const selectedMode = document.querySelector('.mode-btn.selected')?.dataset.mode || 'classic';
            this.startGame(selectedMode);
        });

        document.getElementById('play-again-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.startGame(this.gameMode);
        });

        document.getElementById('menu-from-gameover')?.addEventListener('click', () => {
            this.sound.playClick();
            this.hideModal('gameover-modal');
            this.showModal('menu-modal');
        });

        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.hideModal('menu-modal');
            this.showModal('settings-modal');
        });

        document.getElementById('close-settings-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.hideModal('settings-modal');
            this.showModal('menu-modal');
        });

        document.getElementById('toggle-sound')?.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            this.soundEnabled = e.currentTarget.classList.contains('active');
            this.sound.enabled = this.soundEnabled;
            if (this.soundEnabled) {
                this.sound.init();
                this.sound.playClick();
            }
            this.saveSettings();
        });

        document.getElementById('toggle-haptic')?.addEventListener('click', (e) => {
            this.sound.playClick();
            e.currentTarget.classList.toggle('active');
            this.hapticEnabled = e.currentTarget.classList.contains('active');
            this.saveSettings();
        });

        document.getElementById('toggle-colorblind')?.addEventListener('click', (e) => {
            this.sound.playClick();
            e.currentTarget.classList.toggle('active');
            this.colorblindMode = e.currentTarget.classList.contains('active');
            document.body.classList.toggle('colorblind-mode', this.colorblindMode);
            this.saveSettings();
        });

        document.getElementById('toggle-zen-theme')?.addEventListener('click', (e) => {
            this.sound.playClick();
            e.currentTarget.classList.toggle('active');
            this.zenTheme = e.currentTarget.classList.contains('active');
            document.body.classList.toggle('theme-zen', this.zenTheme);
            this.saveSettings();
        });

        document.getElementById('tutorial-next-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.nextTutorialStep();
        });

        document.getElementById('reset-tutorial-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            localStorage.removeItem('blockbloom_tutorial_done');
            this.tutorialDone = false;
            this.hideModal('settings-modal');
            this.startTutorial();
        });

        // Statistics & Achievements buttons
        document.getElementById('stats-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.showStatsModal();
        });

        document.getElementById('close-stats-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.hideModal('stats-modal');
        });

        document.getElementById('achievements-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.showAchievementsModal();
        });

        document.getElementById('close-achievements-btn')?.addEventListener('click', () => {
            this.sound.playClick();
            this.hideModal('achievements-modal');
        });
    }

    startDrag(e, pieceIndex) {
        if (this.isGameOver || !this.gameStarted || this.pieces[pieceIndex] === null) return;

        e.preventDefault();

        // Initialize sound on first interaction
        this.sound.init();
        this.sound.playPickup();
        this.haptic('light');

        this.draggedPiece = this.pieces[pieceIndex];
        this.draggedPieceIndex = pieceIndex;

        const slot = document.querySelector(`.piece-slot[data-index="${pieceIndex}"]`);
        if (slot) {
            slot.classList.add('dragging');
            // Squash effect on pickup
            slot.classList.add('squash-pickup');
            setTimeout(() => slot.classList.remove('squash-pickup'), 150);
        }

        this.createFloatingPiece(e);
        this.startDragTrail();
    }

    createFloatingPiece(e) {
        if (this.floatingElement) this.floatingElement.remove();

        const piece = this.draggedPiece;
        const isTouch = !!e.touches;
        const floater = document.createElement('div');
        floater.id = 'floating-piece';
        floater.dataset.isTouch = isTouch;

        const yOffset = isTouch ? '-100% - 20px' : '-50%';

        floater.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 1000;
            display: grid;
            gap: 3px;
            grid-template-columns: repeat(${piece.shape[0].length}, 30px);
            transform: translate(-50%, calc(${yOffset})) scale(1.1);
            filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
            opacity: 0.95;
            transition: transform 0.1s ease-out;
        `;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                const cell = document.createElement('div');
                cell.style.cssText = `
                    width: 30px;
                    height: 30px;
                    border-radius: 5px;
                `;
                if (piece.shape[y][x] === 1) {
                    cell.classList.add(piece.colorClass);
                    cell.style.boxShadow = 'inset 0 2px 4px rgba(255,255,255,0.35)';
                }
                floater.appendChild(cell);
            }
        }

        document.body.appendChild(floater);
        this.floatingElement = floater;
        this.updateFloatingPosition(e);
    }

    startDragTrail() {
        this.dragTrail = [];
        this.trailTimer = setInterval(() => {
            if (this.floatingElement && this.draggedPiece) {
                const rect = this.floatingElement.getBoundingClientRect();
                this.createTrailParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        }, 50);
    }

    createTrailParticle(x, y) {
        const container = document.getElementById('particles');
        if (!container) return;

        const trail = document.createElement('div');
        trail.className = 'drag-trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        container.appendChild(trail);

        setTimeout(() => trail.remove(), 300);
    }

    updateFloatingPosition(e) {
        if (!this.floatingElement) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        this.floatingElement.style.left = `${clientX}px`;
        this.floatingElement.style.top = `${clientY}px`;
    }

    moveDrag(e) {
        if (!this.draggedPiece) return;

        e.preventDefault();
        this.updateFloatingPosition(e);

        const board = document.getElementById('board');
        if (!board) return;

        const rect = board.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const cellSize = rect.width / this.gridSize;
        const pieceWidth = this.draggedPiece.shape[0].length;
        const pieceHeight = this.draggedPiece.shape.length;

        const floatingCellSize = 30;
        const floatingPieceHeight = pieceHeight * floatingCellSize;
        const touchOffset = e.touches ? (20 + floatingPieceHeight / 2) : 0;

        const centerX = clientX - rect.left;
        const centerY = clientY - rect.top - touchOffset;

        const x = Math.round(centerX / cellSize - pieceWidth / 2);
        const y = Math.round(centerY / cellSize - pieceHeight / 2);

        const oldGhost = this.ghostPosition;

        if (x >= -pieceWidth + 1 && x < this.gridSize && y >= -pieceHeight + 1 && y < this.gridSize) {
            this.ghostPosition = { x, y };

            // Haptic feedback when ghost position changes
            if (!oldGhost || oldGhost.x !== x || oldGhost.y !== y) {
                if (this.canPlacePiece(this.draggedPiece, x, y)) {
                    this.haptic('light');
                }
            }
        } else {
            this.ghostPosition = null;
        }

        this.renderGrid();
    }

    endDrag(e) {
        if (!this.draggedPiece) return;

        // Stop trail
        if (this.trailTimer) {
            clearInterval(this.trailTimer);
            this.trailTimer = null;
        }

        if (this.floatingElement) {
            this.floatingElement.remove();
            this.floatingElement = null;
        }

        const slot = document.querySelector(`.piece-slot[data-index="${this.draggedPieceIndex}"]`);
        if (slot) slot.classList.remove('dragging');

        if (this.ghostPosition) {
            const success = this.placePiece(this.draggedPieceIndex, this.ghostPosition.x, this.ghostPosition.y);
            if (!success && slot) {
                // Bounce back animation
                slot.classList.add('bounce-back');
                setTimeout(() => slot.classList.remove('bounce-back'), 300);
            }
        }

        this.draggedPiece = null;
        this.draggedPieceIndex = null;
        this.ghostPosition = null;
        this.renderGrid();
    }

    // ==================== RENDERING ====================
    render() {
        this.renderGrid();
        this.updateScoreDisplay();
        this.updateFlowDisplay();
        this.updatePowerUpButtons();
    }

    // ==================== MODALS ====================
    showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('visible');
        }
    }

    hideModal(id) {
        document.getElementById(id)?.classList.remove('visible');
    }

    // ==================== SAVE/LOAD ====================
    saveGame() {
        if (this.gameMode !== 'classic' || !this.gameStarted) return;

        const save = {
            grid: this.grid,
            pieces: this.pieces,
            score: this.score,
            combo: this.combo,
            comboMultiplier: this.comboMultiplier,
            flowMeter: this.flowMeter,
            undosRemaining: this.undosRemaining,
            swapsRemaining: this.swapsRemaining,
            bombsRemaining: this.bombsRemaining,
            linesCleared: this.linesCleared,
            piecesPlaced: this.piecesPlaced,
            totalLinesCleared: this.totalLinesCleared,
            lastMilestone: this.lastMilestone
        };

        localStorage.setItem('blockbloom_save', JSON.stringify(save));
    }

    loadGame() {
        const save = localStorage.getItem('blockbloom_save');
        if (!save) return false;

        try {
            const data = JSON.parse(save);
            this.grid = data.grid;
            this.pieces = data.pieces;
            this.score = data.score;
            this.displayScore = data.score;
            this.combo = data.combo;
            this.comboMultiplier = data.comboMultiplier;
            this.flowMeter = data.flowMeter;
            this.undosRemaining = data.undosRemaining;
            this.swapsRemaining = data.swapsRemaining;
            this.bombsRemaining = data.bombsRemaining;
            this.linesCleared = data.linesCleared || 0;
            this.piecesPlaced = data.piecesPlaced || 0;
            this.totalLinesCleared = data.totalLinesCleared || 0;
            this.lastMilestone = data.lastMilestone || 0;
            this.gameStarted = true;

            this.render();
            this.renderPieces();
            return true;
        } catch (e) {
            return false;
        }
    }

    saveBestScore() {
        localStorage.setItem('blockbloom_best', this.bestScore.toString());
    }

    loadBestScore() {
        this.bestScore = parseInt(localStorage.getItem('blockbloom_best') || '0');
        this.previousBest = this.bestScore;
    }

    saveSettings() {
        localStorage.setItem('blockbloom_settings', JSON.stringify({
            soundEnabled: this.soundEnabled,
            hapticEnabled: this.hapticEnabled,
            colorblindMode: this.colorblindMode,
            zenTheme: this.zenTheme
        }));
    }

    // ==================== STATISTICS ====================
    saveStats() {
        localStorage.setItem('blockbloom_stats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('blockbloom_stats');
        if (saved) {
            try {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            } catch (e) {
                console.log('Failed to load stats');
            }
        }
    }

    showStatsModal() {
        const avgScore = this.stats.gamesPlayed > 0
            ? Math.round(this.stats.totalScore / this.stats.gamesPlayed)
            : 0;

        const el = (id) => document.getElementById(id);
        if (el('stats-games-played')) el('stats-games-played').textContent = this.stats.gamesPlayed.toLocaleString();
        if (el('stats-high-score')) el('stats-high-score').textContent = this.stats.highScore.toLocaleString();
        if (el('stats-total-lines')) el('stats-total-lines').textContent = this.stats.totalLinesEver.toLocaleString();
        if (el('stats-total-pieces')) el('stats-total-pieces').textContent = this.stats.totalPiecesEver.toLocaleString();
        if (el('stats-best-combo')) el('stats-best-combo').textContent = `x${this.stats.bestComboEver}`;
        if (el('stats-avg-score')) el('stats-avg-score').textContent = avgScore.toLocaleString();

        this.showModal('stats-modal');
    }

    // ==================== ACHIEVEMENTS ====================
    loadAchievements() {
        const saved = localStorage.getItem('blockbloom_achievements');
        if (saved) {
            try {
                this.unlockedAchievements = new Set(JSON.parse(saved));
            } catch (e) {
                this.unlockedAchievements = new Set();
            }
        }
    }

    saveAchievements() {
        localStorage.setItem('blockbloom_achievements', JSON.stringify([...this.unlockedAchievements]));
    }

    checkAchievements() {
        for (const achievement of ACHIEVEMENTS) {
            if (!this.unlockedAchievements.has(achievement.id)) {
                if (achievement.check(this.stats)) {
                    this.unlockedAchievements.add(achievement.id);
                    this.pendingAchievements.push(achievement);
                }
            }
        }
        this.saveAchievements();
    }

    showPendingAchievements() {
        if (this.pendingAchievements.length === 0) return;

        const showNext = () => {
            if (this.pendingAchievements.length === 0) return;

            const achievement = this.pendingAchievements.shift();
            this.showAchievementNotification(achievement);

            if (this.pendingAchievements.length > 0) {
                setTimeout(showNext, 3500);
            }
        };

        showNext();
    }

    showAchievementNotification(achievement) {
        const notification = document.getElementById('achievement-notification');
        const nameEl = document.getElementById('achievement-unlock-name');

        if (notification && nameEl) {
            nameEl.textContent = achievement.name;
            notification.classList.add('show');

            this.sound.playMilestone();
            this.haptic('milestone');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    showAchievementsModal() {
        const list = document.getElementById('achievements-list');
        if (!list) return;

        list.innerHTML = '';

        for (const achievement of ACHIEVEMENTS) {
            const unlocked = this.unlockedAchievements.has(achievement.id);
            const item = document.createElement('div');
            item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
            item.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
                ${unlocked ? '<div class="achievement-check">✓</div>' : ''}
            `;
            list.appendChild(item);
        }

        this.showModal('achievements-modal');
    }

    loadSettings() {
        const settings = localStorage.getItem('blockbloom_settings');
        if (settings) {
            const data = JSON.parse(settings);
            this.soundEnabled = data.soundEnabled ?? true;
            this.hapticEnabled = data.hapticEnabled ?? true;
            this.colorblindMode = data.colorblindMode ?? false;
            this.zenTheme = data.zenTheme ?? false;

            this.sound.enabled = this.soundEnabled;

            if (this.soundEnabled) document.getElementById('toggle-sound')?.classList.add('active');
            else document.getElementById('toggle-sound')?.classList.remove('active');

            if (this.hapticEnabled) document.getElementById('toggle-haptic')?.classList.add('active');
            else document.getElementById('toggle-haptic')?.classList.remove('active');

            if (this.colorblindMode) {
                document.getElementById('toggle-colorblind')?.classList.add('active');
                document.body.classList.add('colorblind-mode');
            }

            if (this.zenTheme) {
                document.getElementById('toggle-zen-theme')?.classList.add('active');
                document.body.classList.add('theme-zen');
            }
        }
    }

    // ==================== TUTORIAL ====================
    startTutorial() {
        this.tutorialStep = 0;
        this.updateTutorialStep();
        this.showModal('tutorial-overlay');
    }

    updateTutorialStep() {
        const steps = [
            { title: 'Welcome!', text: 'Drag blocks from the tray and drop them onto the 10×10 grid.' },
            { title: 'Clear Lines', text: 'Fill a complete row or column to clear it and score points!' },
            { title: 'Build Combos', text: 'Clear lines consecutively to build your combo multiplier!' }
        ];

        const step = steps[this.tutorialStep];
        const stepEl = document.getElementById('tutorial-step');
        const titleEl = document.getElementById('tutorial-title');
        const textEl = document.getElementById('tutorial-text');
        const nextBtn = document.getElementById('tutorial-next-btn');

        if (stepEl) stepEl.textContent = `Step ${this.tutorialStep + 1} of ${steps.length}`;
        if (titleEl) titleEl.textContent = step.title;
        if (textEl) textEl.textContent = step.text;
        if (nextBtn) nextBtn.textContent = this.tutorialStep === steps.length - 1 ? 'Got it!' : 'Next';
    }

    nextTutorialStep() {
        this.tutorialStep++;

        if (this.tutorialStep >= 3) {
            this.hideModal('tutorial-overlay');
            this.tutorialDone = true;
            localStorage.setItem('blockbloom_tutorial_done', 'true');
        } else {
            this.updateTutorialStep();
        }
    }
}

// ==================== INIT ====================
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new BlockBloom();
});

// Unregister any existing service worker for clean debugging
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => {
            reg.unregister();
        });
    });
}
