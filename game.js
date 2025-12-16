/**
 * Block Bloom - A 10x10 Block Puzzle Game
 * Premium puzzle experience with combos, flow meter, and multiple modes
 */

// ==================== PIECE DEFINITIONS ====================
const PIECES = {
    // Single (1 cell)
    dot: { shape: [[1]], weight: 5 },

    // Domino (2 cells)
    domino_h: { shape: [[1, 1]], weight: 8 },
    domino_v: { shape: [[1], [1]], weight: 8 },

    // Trominoes (3 cells)
    tromino_i_h: { shape: [[1, 1, 1]], weight: 10 },
    tromino_i_v: { shape: [[1], [1], [1]], weight: 10 },
    tromino_l1: { shape: [[1, 0], [1, 1]], weight: 10 },
    tromino_l2: { shape: [[0, 1], [1, 1]], weight: 10 },
    tromino_l3: { shape: [[1, 1], [1, 0]], weight: 10 },
    tromino_l4: { shape: [[1, 1], [0, 1]], weight: 10 },

    // Tetrominoes (4 cells)
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

    // Pentominoes (5 cells)
    pento_i_h: { shape: [[1, 1, 1, 1, 1]], weight: 6 },
    pento_i_v: { shape: [[1], [1], [1], [1], [1]], weight: 6 },
    pento_plus: { shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], weight: 6 },
    pento_u: { shape: [[1, 0, 1], [1, 1, 1]], weight: 6 },
    pento_l1: { shape: [[1, 0, 0, 0], [1, 1, 1, 1]], weight: 6 },
    pento_l2: { shape: [[0, 0, 0, 1], [1, 1, 1, 1]], weight: 6 },

    // Large pieces (rare)
    big_l: { shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], weight: 3 },
    big_square: { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 2 },
};

// Piece colors
const PIECE_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Gold
    '#BB8FCE', // Purple
    '#85C1E9', // Sky
];

// ==================== GAME STATE ====================
class BlockBloom {
    constructor() {
        this.gridSize = 10;
        this.grid = [];
        this.pieces = [null, null, null];
        this.score = 0;
        this.highScore = 0;
        this.combo = 0;
        this.comboMultiplier = 1.0;
        this.flowMeter = 0;
        this.flowDecayTimer = null;
        this.gameMode = 'classic'; // classic, daily, zen
        this.isGameOver = false;
        this.moveHistory = [];
        this.maxUndo = 3;
        this.undosRemaining = 3;
        this.swapsRemaining = 1;
        this.bombsRemaining = 1;
        this.tutorialStep = 0;
        this.isTutorial = false;
        this.theme = 'default';
        this.soundEnabled = true;
        this.hapticEnabled = true;
        this.draggedPiece = null;
        this.draggedPieceIndex = null;
        this.ghostPosition = null;

        // Stats
        this.stats = this.loadStats();

        this.init();
    }

    init() {
        this.loadSettings();
        this.loadHighScore();
        this.setupEventListeners();
        this.createGrid();
        this.generatePieces();
        this.render();
        this.startFlowDecay();

        // Check for saved game
        const savedGame = localStorage.getItem('blockbloom_save');
        if (savedGame && this.gameMode === 'classic') {
            this.showResumeDialog();
        }
    }

    // ==================== GRID MANAGEMENT ====================
    createGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = { filled: false, color: null };
            }
        }
    }

    renderGrid() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (this.grid[y][x].filled) {
                    cell.classList.add('filled');
                    cell.style.backgroundColor = this.grid[y][x].color;
                }

                // Ghost preview
                if (this.ghostPosition && this.draggedPiece) {
                    const shape = this.draggedPiece.shape;
                    for (let py = 0; py < shape.length; py++) {
                        for (let px = 0; px < shape[py].length; px++) {
                            if (shape[py][px] === 1) {
                                const gx = this.ghostPosition.x + px;
                                const gy = this.ghostPosition.y + py;
                                if (gx === x && gy === y) {
                                    const canPlace = this.canPlacePiece(this.draggedPiece, this.ghostPosition.x, this.ghostPosition.y);
                                    cell.classList.add('ghost');
                                    if (!canPlace) {
                                        cell.classList.add('invalid');
                                    }
                                }
                            }
                        }
                    }
                }

                board.appendChild(cell);
            }
        }
    }

    // ==================== PIECE GENERATION ====================
    generatePieces() {
        const pieceKeys = Object.keys(PIECES);
        const weights = pieceKeys.map(k => PIECES[k].weight);
        const totalWeight = weights.reduce((a, b) => a + b, 0);

        for (let i = 0; i < 3; i++) {
            if (this.pieces[i] === null) {
                // Weighted random selection
                let random = Math.random() * totalWeight;
                let selectedKey = pieceKeys[0];

                for (let j = 0; j < pieceKeys.length; j++) {
                    random -= weights[j];
                    if (random <= 0) {
                        selectedKey = pieceKeys[j];
                        break;
                    }
                }

                const pieceData = PIECES[selectedKey];
                const color = PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)];

                this.pieces[i] = {
                    key: selectedKey,
                    shape: pieceData.shape,
                    color: color,
                    cellCount: this.countCells(pieceData.shape)
                };
            }
        }

        this.renderPieces();
    }

    countCells(shape) {
        let count = 0;
        for (let row of shape) {
            for (let cell of row) {
                if (cell === 1) count++;
            }
        }
        return count;
    }

    renderPieces() {
        for (let i = 0; i < 3; i++) {
            const tray = document.getElementById(`piece-${i}`);
            tray.innerHTML = '';

            const piece = this.pieces[i];
            if (!piece) {
                tray.classList.add('empty');
                continue;
            }

            tray.classList.remove('empty');

            const pieceEl = document.createElement('div');
            pieceEl.className = 'piece-preview';
            pieceEl.style.gridTemplateColumns = `repeat(${piece.shape[0].length}, 1fr)`;
            pieceEl.style.gridTemplateRows = `repeat(${piece.shape.length}, 1fr)`;

            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'piece-cell';
                    if (piece.shape[y][x] === 1) {
                        cell.classList.add('filled');
                        cell.style.backgroundColor = piece.color;
                    }
                    pieceEl.appendChild(cell);
                }
            }

            tray.appendChild(pieceEl);
        }
    }

    // ==================== PLACEMENT LOGIC ====================
    canPlacePiece(piece, startX, startY) {
        if (!piece) return false;

        const shape = piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    const gridX = startX + x;
                    const gridY = startY + y;

                    // Out of bounds
                    if (gridX < 0 || gridX >= this.gridSize || gridY < 0 || gridY >= this.gridSize) {
                        return false;
                    }

                    // Cell already filled
                    if (this.grid[gridY][gridX].filled) {
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
            return false;
        }

        // Save state for undo
        this.saveState();

        // Place the piece
        const shape = piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    const gridX = startX + x;
                    const gridY = startY + y;
                    this.grid[gridY][gridX] = { filled: true, color: piece.color };
                }
            }
        }

        // Add placement score
        this.addScore(piece.cellCount);

        // Remove piece from tray
        this.pieces[pieceIndex] = null;

        // Check and clear lines
        const linesCleared = this.checkAndClearLines();

        // Update combo
        if (linesCleared > 0) {
            this.combo++;
            this.comboMultiplier = Math.min(3.0, 1.0 + (this.combo - 1) * 0.1);
            this.addFlowMeter(linesCleared * 10);
        } else {
            this.combo = 0;
            this.comboMultiplier = 1.0;
        }

        // Generate new pieces if all empty
        if (this.pieces.every(p => p === null)) {
            this.generatePieces();
        }

        // Check game over
        if (this.checkGameOver()) {
            this.endGame();
        }

        this.render();
        this.saveGame();
        this.haptic();

        return true;
    }

    // ==================== LINE CLEARING ====================
    checkAndClearLines() {
        const rowsToClear = [];
        const colsToClear = [];

        // Check rows
        for (let y = 0; y < this.gridSize; y++) {
            let full = true;
            for (let x = 0; x < this.gridSize; x++) {
                if (!this.grid[y][x].filled) {
                    full = false;
                    break;
                }
            }
            if (full) rowsToClear.push(y);
        }

        // Check columns
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
            // Calculate score
            let lineScore = totalLines * 10;

            // Multi-line bonus
            if (totalLines >= 2) {
                lineScore += (totalLines - 1) * 20;
            }

            // Apply combo multiplier
            lineScore = Math.floor(lineScore * this.comboMultiplier);

            this.addScore(lineScore);

            // Clear with animation
            this.clearLinesAnimated(rowsToClear, colsToClear);
        }

        return totalLines;
    }

    clearLinesAnimated(rows, cols) {
        // Mark cells for animation
        const cellsToClear = new Set();

        for (let y of rows) {
            for (let x = 0; x < this.gridSize; x++) {
                cellsToClear.add(`${x},${y}`);
            }
        }

        for (let x of cols) {
            for (let y = 0; y < this.gridSize; y++) {
                cellsToClear.add(`${x},${y}`);
            }
        }

        // Add clearing class to cells
        const board = document.getElementById('game-board');
        const cells = board.querySelectorAll('.cell');

        cellsToClear.forEach(coord => {
            const [x, y] = coord.split(',').map(Number);
            const index = y * this.gridSize + x;
            if (cells[index]) {
                cells[index].classList.add('clearing');
            }
        });

        // Clear after animation
        setTimeout(() => {
            cellsToClear.forEach(coord => {
                const [x, y] = coord.split(',').map(Number);
                this.grid[y][x] = { filled: false, color: null };
            });
            this.renderGrid();
        }, 300);
    }

    // ==================== SCORING ====================
    addScore(points) {
        this.score += points;
        this.updateScoreDisplay();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('high-score').textContent = this.highScore.toLocaleString();

        // Update combo display
        const comboEl = document.getElementById('combo-value');
        comboEl.textContent = `x${this.comboMultiplier.toFixed(1)}`;

        const comboFill = document.getElementById('combo-fill');
        const comboPercent = Math.min(100, (this.comboMultiplier - 1) / 2 * 100);
        comboFill.style.width = `${comboPercent}%`;
    }

    // ==================== FLOW METER ====================
    addFlowMeter(amount) {
        this.flowMeter = Math.min(100, this.flowMeter + amount);
        this.updateFlowDisplay();
    }

    startFlowDecay() {
        if (this.flowDecayTimer) clearInterval(this.flowDecayTimer);

        this.flowDecayTimer = setInterval(() => {
            if (this.flowMeter > 0 && !this.isGameOver) {
                this.flowMeter = Math.max(0, this.flowMeter - 2);
                this.updateFlowDisplay();
            }
        }, 1000);
    }

    updateFlowDisplay() {
        const flowFill = document.getElementById('flow-fill');
        flowFill.style.width = `${this.flowMeter}%`;

        // Update color based on level
        if (this.flowMeter >= 75) {
            flowFill.style.background = 'linear-gradient(90deg, #4ECDC4, #2ECC71)';
        } else if (this.flowMeter >= 50) {
            flowFill.style.background = 'linear-gradient(90deg, #F39C12, #4ECDC4)';
        } else {
            flowFill.style.background = 'linear-gradient(90deg, #E74C3C, #F39C12)';
        }
    }

    // ==================== GAME STATE ====================
    checkGameOver() {
        // Check if any piece can be placed anywhere
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

    endGame() {
        this.isGameOver = true;

        // Update stats
        this.stats.gamesPlayed = (this.stats.gamesPlayed || 0) + 1;
        this.stats.totalScore = (this.stats.totalScore || 0) + this.score;
        if (this.score > (this.stats.bestScore || 0)) {
            this.stats.bestScore = this.score;
        }
        this.saveStats();

        // Show game over modal
        document.getElementById('final-score').textContent = this.score.toLocaleString();
        document.getElementById('final-high-score').textContent = this.highScore.toLocaleString();
        document.getElementById('game-over-modal').classList.remove('hidden');

        // Clear saved game
        localStorage.removeItem('blockbloom_save');
    }

    restart() {
        this.score = 0;
        this.combo = 0;
        this.comboMultiplier = 1.0;
        this.flowMeter = 0;
        this.isGameOver = false;
        this.pieces = [null, null, null];
        this.moveHistory = [];
        this.undosRemaining = 3;
        this.swapsRemaining = 1;
        this.bombsRemaining = 1;

        this.createGrid();
        this.generatePieces();
        this.render();
        this.updatePowerUpButtons();

        document.getElementById('game-over-modal').classList.add('hidden');
        document.getElementById('menu-modal').classList.add('hidden');
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
        if (this.undosRemaining <= 0 || this.moveHistory.length === 0) {
            return false;
        }

        const state = this.moveHistory.pop();
        this.grid = state.grid;
        this.pieces = state.pieces;
        this.score = state.score;
        this.combo = state.combo;
        this.comboMultiplier = state.comboMultiplier;

        this.undosRemaining--;
        this.render();
        this.updatePowerUpButtons();
        this.haptic();

        return true;
    }

    swapPieces() {
        if (this.swapsRemaining <= 0) return false;

        // Save current pieces
        this.saveState();

        // Generate new pieces
        this.pieces = [null, null, null];
        this.generatePieces();

        this.swapsRemaining--;
        this.updatePowerUpButtons();
        this.haptic();

        return true;
    }

    activateBomb() {
        if (this.bombsRemaining <= 0) return false;

        // Enter bomb mode
        document.getElementById('game-board').classList.add('bomb-mode');
        this.isBombMode = true;

        return true;
    }

    useBomb(x, y) {
        if (!this.isBombMode) return false;

        this.saveState();

        // Clear 3x3 area around click
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize) {
                    this.grid[ny][nx] = { filled: false, color: null };
                }
            }
        }

        this.bombsRemaining--;
        this.isBombMode = false;
        document.getElementById('game-board').classList.remove('bomb-mode');

        this.render();
        this.updatePowerUpButtons();
        this.haptic();

        return true;
    }

    updatePowerUpButtons() {
        document.getElementById('undo-count').textContent = this.undosRemaining;
        document.getElementById('swap-count').textContent = this.swapsRemaining;
        document.getElementById('bomb-count').textContent = this.bombsRemaining;

        document.getElementById('undo-btn').disabled = this.undosRemaining <= 0 || this.moveHistory.length === 0;
        document.getElementById('swap-btn').disabled = this.swapsRemaining <= 0;
        document.getElementById('bomb-btn').disabled = this.bombsRemaining <= 0;
    }

    // ==================== DRAG & DROP ====================
    setupEventListeners() {
        const board = document.getElementById('game-board');

        // Board events for placement
        board.addEventListener('click', (e) => {
            if (this.isBombMode) {
                const cell = e.target.closest('.cell');
                if (cell) {
                    const x = parseInt(cell.dataset.x);
                    const y = parseInt(cell.dataset.y);
                    this.useBomb(x, y);
                }
            }
        });

        // Piece drag events
        for (let i = 0; i < 3; i++) {
            const tray = document.getElementById(`piece-${i}`);

            // Touch events
            tray.addEventListener('touchstart', (e) => this.startDrag(e, i), { passive: false });
            document.addEventListener('touchmove', (e) => this.moveDrag(e), { passive: false });
            document.addEventListener('touchend', (e) => this.endDrag(e));

            // Mouse events
            tray.addEventListener('mousedown', (e) => this.startDrag(e, i));
            document.addEventListener('mousemove', (e) => this.moveDrag(e));
            document.addEventListener('mouseup', (e) => this.endDrag(e));
        }

        // Power-up buttons
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('swap-btn').addEventListener('click', () => this.swapPieces());
        document.getElementById('bomb-btn').addEventListener('click', () => this.activateBomb());

        // Menu button
        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('menu-modal').classList.remove('hidden');
        });

        // Modal buttons
        document.getElementById('resume-btn').addEventListener('click', () => {
            document.getElementById('menu-modal').classList.add('hidden');
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('menu-modal').classList.add('hidden');
            document.getElementById('settings-modal').classList.remove('hidden');
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareScore();
        });

        // Settings modal
        document.getElementById('close-settings').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
        });

        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('haptic-toggle').addEventListener('change', (e) => {
            this.hapticEnabled = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // Tutorial
        document.getElementById('close-tutorial').addEventListener('click', () => {
            document.getElementById('tutorial-modal').classList.add('hidden');
            this.isTutorial = false;
        });

        document.getElementById('tutorial-next').addEventListener('click', () => {
            this.nextTutorialStep();
        });
    }

    startDrag(e, pieceIndex) {
        if (this.isGameOver || this.pieces[pieceIndex] === null) return;

        e.preventDefault();

        this.draggedPiece = this.pieces[pieceIndex];
        this.draggedPieceIndex = pieceIndex;

        const tray = document.getElementById(`piece-${pieceIndex}`);
        tray.classList.add('dragging');

        // Create floating piece
        this.createFloatingPiece(e);
    }

    createFloatingPiece(e) {
        const existing = document.getElementById('floating-piece');
        if (existing) existing.remove();

        const piece = this.draggedPiece;
        const floater = document.createElement('div');
        floater.id = 'floating-piece';
        floater.className = 'floating-piece';
        floater.style.gridTemplateColumns = `repeat(${piece.shape[0].length}, 28px)`;
        floater.style.gridTemplateRows = `repeat(${piece.shape.length}, 28px)`;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'floating-cell';
                if (piece.shape[y][x] === 1) {
                    cell.classList.add('filled');
                    cell.style.backgroundColor = piece.color;
                }
                floater.appendChild(cell);
            }
        }

        document.body.appendChild(floater);
        this.updateFloatingPosition(e);
    }

    updateFloatingPosition(e) {
        const floater = document.getElementById('floating-piece');
        if (!floater) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        floater.style.left = `${clientX - floater.offsetWidth / 2}px`;
        floater.style.top = `${clientY - floater.offsetHeight - 40}px`;
    }

    moveDrag(e) {
        if (!this.draggedPiece) return;

        e.preventDefault();

        this.updateFloatingPosition(e);

        // Calculate grid position
        const board = document.getElementById('game-board');
        const rect = board.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const cellSize = rect.width / this.gridSize;
        const x = Math.floor((clientX - rect.left) / cellSize);
        const y = Math.floor((clientY - rect.top) / cellSize);

        // Update ghost position
        if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
            this.ghostPosition = { x, y };
        } else {
            this.ghostPosition = null;
        }

        this.renderGrid();
    }

    endDrag(e) {
        if (!this.draggedPiece) return;

        const floater = document.getElementById('floating-piece');
        if (floater) floater.remove();

        const tray = document.getElementById(`piece-${this.draggedPieceIndex}`);
        if (tray) tray.classList.remove('dragging');

        // Try to place piece
        if (this.ghostPosition) {
            this.placePiece(this.draggedPieceIndex, this.ghostPosition.x, this.ghostPosition.y);
        }

        this.draggedPiece = null;
        this.draggedPieceIndex = null;
        this.ghostPosition = null;
        this.renderGrid();
    }

    // ==================== RENDERING ====================
    render() {
        this.renderGrid();
        this.renderPieces();
        this.updateScoreDisplay();
        this.updateFlowDisplay();
        this.updatePowerUpButtons();
    }

    // ==================== SAVE/LOAD ====================
    saveGame() {
        if (this.gameMode !== 'classic') return;

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
            moveHistory: this.moveHistory
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
            this.combo = data.combo;
            this.comboMultiplier = data.comboMultiplier;
            this.flowMeter = data.flowMeter;
            this.undosRemaining = data.undosRemaining;
            this.swapsRemaining = data.swapsRemaining;
            this.bombsRemaining = data.bombsRemaining;
            this.moveHistory = data.moveHistory || [];

            this.render();
            return true;
        } catch (e) {
            return false;
        }
    }

    showResumeDialog() {
        // Simple confirm for now
        if (confirm('Continue previous game?')) {
            this.loadGame();
        } else {
            localStorage.removeItem('blockbloom_save');
        }
    }

    saveHighScore() {
        localStorage.setItem('blockbloom_highscore', this.highScore.toString());
    }

    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('blockbloom_highscore') || '0');
    }

    saveSettings() {
        const settings = {
            soundEnabled: this.soundEnabled,
            hapticEnabled: this.hapticEnabled,
            theme: this.theme
        };
        localStorage.setItem('blockbloom_settings', JSON.stringify(settings));
    }

    loadSettings() {
        const settings = localStorage.getItem('blockbloom_settings');
        if (settings) {
            const data = JSON.parse(settings);
            this.soundEnabled = data.soundEnabled ?? true;
            this.hapticEnabled = data.hapticEnabled ?? true;
            this.theme = data.theme || 'default';

            document.getElementById('sound-toggle').checked = this.soundEnabled;
            document.getElementById('haptic-toggle').checked = this.hapticEnabled;
            document.getElementById('theme-select').value = this.theme;

            this.setTheme(this.theme);
        }
    }

    loadStats() {
        const stats = localStorage.getItem('blockbloom_stats');
        return stats ? JSON.parse(stats) : {};
    }

    saveStats() {
        localStorage.setItem('blockbloom_stats', JSON.stringify(this.stats));
    }

    // ==================== THEME ====================
    setTheme(theme) {
        this.theme = theme;
        document.body.setAttribute('data-theme', theme);
        this.saveSettings();
    }

    // ==================== UTILITIES ====================
    haptic() {
        if (this.hapticEnabled && navigator.vibrate) {
            navigator.vibrate(10);
        }
    }

    shareScore() {
        const text = `I scored ${this.score.toLocaleString()} in Block Bloom! Can you beat it?`;

        if (navigator.share) {
            navigator.share({
                title: 'Block Bloom',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            alert('Score copied to clipboard!');
        }
    }

    // ==================== TUTORIAL ====================
    startTutorial() {
        this.isTutorial = true;
        this.tutorialStep = 0;
        document.getElementById('tutorial-modal').classList.remove('hidden');
        this.updateTutorialStep();
    }

    updateTutorialStep() {
        const steps = [
            {
                title: 'Welcome to Block Bloom!',
                content: 'Drag and drop blocks onto the 10x10 grid. Fill complete rows or columns to clear them!'
            },
            {
                title: 'Scoring',
                content: 'Earn points for placing blocks and clearing lines. Clear multiple lines at once for bonus points!'
            },
            {
                title: 'Combo System',
                content: 'Clear lines consecutively to build your combo multiplier. Keep the flow going for higher scores!'
            },
            {
                title: 'Power-ups',
                content: 'Use Undo to reverse moves, Swap to get new pieces, or Bomb to clear a 3x3 area!'
            },
            {
                title: "You're Ready!",
                content: 'Place blocks strategically and aim for the high score. Good luck!'
            }
        ];

        const step = steps[this.tutorialStep];
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-content').textContent = step.content;

        const nextBtn = document.getElementById('tutorial-next');
        nextBtn.textContent = this.tutorialStep === steps.length - 1 ? 'Start Playing' : 'Next';
    }

    nextTutorialStep() {
        this.tutorialStep++;

        if (this.tutorialStep >= 5) {
            document.getElementById('tutorial-modal').classList.add('hidden');
            this.isTutorial = false;
            localStorage.setItem('blockbloom_tutorial_done', 'true');
        } else {
            this.updateTutorialStep();
        }
    }
}

// ==================== INITIALIZE ====================
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new BlockBloom();

    // Show tutorial for first-time users
    if (!localStorage.getItem('blockbloom_tutorial_done')) {
        game.startTutorial();
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
