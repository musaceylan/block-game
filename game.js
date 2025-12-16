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

    // Large pieces (rare)
    big_l: { shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], weight: 3 },
    big_square: { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 2 },
};

// Block color classes
const BLOCK_COLORS = ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7'];

// ==================== GAME STATE ====================
class BlockBloom {
    constructor() {
        this.gridSize = 10;
        this.grid = [];
        this.pieces = [null, null, null];
        this.score = 0;
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

        // Drag state
        this.selectedPieceIndex = null;
        this.draggedPiece = null;
        this.draggedPieceIndex = null;
        this.ghostPosition = null;
        this.floatingElement = null;

        // Settings
        this.soundEnabled = true;
        this.hapticEnabled = true;
        this.colorblindMode = false;
        this.zenTheme = false;

        // Tutorial
        this.tutorialStep = 0;
        this.tutorialDone = localStorage.getItem('blockbloom_tutorial_done') === 'true';

        this.init();
    }

    init() {
        this.loadSettings();
        this.loadBestScore();
        this.createGrid();
        this.setupEventListeners();

        // Show menu on start
        this.showModal('menu-modal');

        // Show tutorial for first time users
        if (!this.tutorialDone) {
            setTimeout(() => this.startTutorial(), 500);
        }
    }

    // ==================== GRID MANAGEMENT ====================
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

                // Ghost preview
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

    // ==================== PIECE GENERATION ====================
    generatePieces() {
        const pieceKeys = Object.keys(PIECES);
        const weights = pieceKeys.map(k => PIECES[k].weight);
        const totalWeight = weights.reduce((a, b) => a + b, 0);

        for (let i = 0; i < 3; i++) {
            if (this.pieces[i] === null) {
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
                const colorClass = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];

                this.pieces[i] = {
                    key: selectedKey,
                    shape: pieceData.shape,
                    colorClass: colorClass,
                    cellCount: this.countCells(pieceData.shape)
                };
            }
        }

        this.renderPieces();
        this.checkPiecesPlaceable();
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

            // Add drag listeners
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

    // ==================== PLACEMENT LOGIC ====================
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
                    this.grid[gridY][gridX] = { filled: true, colorClass: piece.colorClass };
                }
            }
        }

        // Add placement score
        this.addScore(piece.cellCount);
        this.piecesPlaced++;

        // Remove piece from tray
        this.pieces[pieceIndex] = null;

        // Check and clear lines
        const cleared = this.checkAndClearLines();

        // Update combo
        if (cleared > 0) {
            this.combo++;
            this.comboMultiplier = Math.min(3.0, 1.0 + (this.combo - 1) * 0.2);
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            this.addFlowMeter(cleared * 15);
            this.showComboPopup(cleared);
        } else {
            this.combo = 0;
            this.comboMultiplier = 1.0;
        }

        // Generate new pieces if all empty
        if (this.pieces.every(p => p === null)) {
            this.generatePieces();
        } else {
            this.renderPieces();
        }

        // Check game over
        if (this.checkGameOver()) {
            setTimeout(() => this.endGame(), 500);
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
            this.linesCleared += totalLines;

            // Calculate score
            let lineScore = totalLines * 10;
            if (totalLines >= 2) {
                lineScore += (totalLines - 1) * 25;
            }
            lineScore = Math.floor(lineScore * this.comboMultiplier);
            this.addScore(lineScore);

            // Clear with animation
            this.clearLinesAnimated(rowsToClear, colsToClear);
        }

        return totalLines;
    }

    clearLinesAnimated(rows, cols) {
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

        // Add clearing animation
        const board = document.getElementById('board');
        if (board) {
            const cells = board.querySelectorAll('.cell');
            cellsToClear.forEach(coord => {
                const [x, y] = coord.split(',').map(Number);
                const index = y * this.gridSize + x;
                if (cells[index]) {
                    cells[index].classList.add('clearing');
                }
            });
        }

        // Clear after animation
        setTimeout(() => {
            cellsToClear.forEach(coord => {
                const [x, y] = coord.split(',').map(Number);
                this.grid[y][x] = { filled: false, colorClass: null };
            });
            this.renderGrid();
        }, 350);
    }

    // ==================== SCORING ====================
    addScore(points) {
        this.score += points;
        this.updateScoreDisplay();

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
    }

    updateScoreDisplay() {
        const scoreEl = document.getElementById('score');
        const bestEl = document.getElementById('best-score');

        if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
        if (bestEl) bestEl.textContent = this.bestScore.toLocaleString();

        // Update combo
        const comboValue = document.getElementById('combo-value');
        const comboBar = document.getElementById('combo-bar');

        if (comboValue) comboValue.textContent = `x${this.comboMultiplier.toFixed(1)}`;
        if (comboBar) {
            const comboPercent = Math.min(100, (this.comboMultiplier - 1) / 2 * 100);
            comboBar.style.width = `${comboPercent}%`;
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

        if (flowValue) flowValue.textContent = `${Math.round(this.flowMeter)}%`;
        if (flowBar) flowBar.style.width = `${this.flowMeter}%`;
    }

    // ==================== GAME STATE ====================
    checkGameOver() {
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
        this.gameMode = mode;
        this.score = 0;
        this.combo = 0;
        this.comboMultiplier = 1.0;
        this.maxCombo = 0;
        this.flowMeter = 0;
        this.isGameOver = false;
        this.gameStarted = true;
        this.pieces = [null, null, null];
        this.moveHistory = [];
        this.undosRemaining = 3;
        this.swapsRemaining = 1;
        this.bombsRemaining = 0;
        this.linesCleared = 0;
        this.piecesPlaced = 0;

        this.createGrid();
        this.generatePieces();
        this.render();
        this.updatePowerUpButtons();
        this.startFlowDecay();

        this.hideModal('menu-modal');
        this.hideModal('gameover-modal');

        // Apply theme
        document.body.classList.toggle('theme-zen', mode === 'zen' || this.zenTheme);
    }

    endGame() {
        this.isGameOver = true;
        this.gameStarted = false;

        // Update modal
        const finalScore = document.getElementById('final-score');
        const modalBest = document.getElementById('modal-best');
        const statLines = document.getElementById('stat-lines');
        const statCombo = document.getElementById('stat-combo');
        const statPieces = document.getElementById('stat-pieces');

        if (finalScore) finalScore.textContent = this.score.toLocaleString();
        if (modalBest) modalBest.textContent = this.bestScore.toLocaleString();
        if (statLines) statLines.textContent = this.linesCleared;
        if (statCombo) statCombo.textContent = `x${this.maxCombo}`;
        if (statPieces) statPieces.textContent = this.piecesPlaced;

        this.showModal('gameover-modal');
        localStorage.removeItem('blockbloom_save');
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

        this.saveState();
        this.pieces = [null, null, null];
        this.generatePieces();

        this.swapsRemaining--;
        this.updatePowerUpButtons();
        this.haptic();
        return true;
    }

    activateBomb() {
        if (this.bombsRemaining <= 0) return false;

        this.isBombMode = true;
        document.getElementById('board')?.classList.add('bomb-mode');
        return true;
    }

    useBomb(x, y) {
        if (!this.isBombMode) return false;

        this.saveState();

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize) {
                    this.grid[ny][nx] = { filled: false, colorClass: null };
                }
            }
        }

        this.bombsRemaining--;
        this.isBombMode = false;
        document.getElementById('board')?.classList.remove('bomb-mode');

        this.render();
        this.updatePowerUpButtons();
        this.haptic();
        return true;
    }

    updatePowerUpButtons() {
        const undoCount = document.getElementById('undo-count');
        const swapCount = document.getElementById('swap-count');
        const bombCount = document.getElementById('bomb-count');
        const undoBtn = document.getElementById('undo-btn');
        const swapBtn = document.getElementById('swap-btn');
        const bombBtn = document.getElementById('bomb-btn');

        if (undoCount) undoCount.textContent = this.undosRemaining;
        if (swapCount) swapCount.textContent = this.swapsRemaining;
        if (bombCount) bombCount.textContent = this.bombsRemaining;

        if (undoBtn) undoBtn.disabled = this.undosRemaining <= 0 || this.moveHistory.length === 0;
        if (swapBtn) swapBtn.disabled = this.swapsRemaining <= 0;
        if (bombBtn) bombBtn.disabled = this.bombsRemaining <= 0;
    }

    // ==================== DRAG & DROP ====================
    addPieceDragListeners(slot, index) {
        // Touch events
        slot.addEventListener('touchstart', (e) => this.startDrag(e, index), { passive: false });

        // Mouse events
        slot.addEventListener('mousedown', (e) => this.startDrag(e, index));
    }

    setupEventListeners() {
        // Global drag events
        document.addEventListener('touchmove', (e) => this.moveDrag(e), { passive: false });
        document.addEventListener('touchend', (e) => this.endDrag(e));
        document.addEventListener('mousemove', (e) => this.moveDrag(e));
        document.addEventListener('mouseup', (e) => this.endDrag(e));

        // Board click for bomb
        document.getElementById('board')?.addEventListener('click', (e) => {
            if (this.isBombMode) {
                const cell = e.target.closest('.cell');
                if (cell) {
                    this.useBomb(parseInt(cell.dataset.x), parseInt(cell.dataset.y));
                }
            }
        });

        // Power-up buttons
        document.getElementById('undo-btn')?.addEventListener('click', () => this.undo());
        document.getElementById('swap-btn')?.addEventListener('click', () => this.swapPieces());
        document.getElementById('bomb-btn')?.addEventListener('click', () => this.activateBomb());

        // Menu button
        document.getElementById('menu-btn')?.addEventListener('click', () => {
            this.showModal('menu-modal');
        });

        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.gameMode = btn.dataset.mode;
            });
        });

        // Start game button
        document.getElementById('start-game-btn')?.addEventListener('click', () => {
            const selectedMode = document.querySelector('.mode-btn.selected')?.dataset.mode || 'classic';
            this.startGame(selectedMode);
        });

        // Play again
        document.getElementById('play-again-btn')?.addEventListener('click', () => {
            this.startGame(this.gameMode);
        });

        // Menu from game over
        document.getElementById('menu-from-gameover')?.addEventListener('click', () => {
            this.hideModal('gameover-modal');
            this.showModal('menu-modal');
        });

        // Settings
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.hideModal('menu-modal');
            this.showModal('settings-modal');
        });

        document.getElementById('close-settings-btn')?.addEventListener('click', () => {
            this.hideModal('settings-modal');
            this.showModal('menu-modal');
        });

        // Settings toggles
        document.getElementById('toggle-sound')?.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            this.soundEnabled = e.currentTarget.classList.contains('active');
            this.saveSettings();
        });

        document.getElementById('toggle-haptic')?.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            this.hapticEnabled = e.currentTarget.classList.contains('active');
            this.saveSettings();
        });

        document.getElementById('toggle-colorblind')?.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            this.colorblindMode = e.currentTarget.classList.contains('active');
            document.body.classList.toggle('colorblind-mode', this.colorblindMode);
            this.saveSettings();
        });

        document.getElementById('toggle-zen-theme')?.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            this.zenTheme = e.currentTarget.classList.contains('active');
            document.body.classList.toggle('theme-zen', this.zenTheme);
            this.saveSettings();
        });

        // Tutorial
        document.getElementById('tutorial-next-btn')?.addEventListener('click', () => {
            this.nextTutorialStep();
        });

        document.getElementById('reset-tutorial-btn')?.addEventListener('click', () => {
            localStorage.removeItem('blockbloom_tutorial_done');
            this.tutorialDone = false;
            this.hideModal('settings-modal');
            this.startTutorial();
        });
    }

    startDrag(e, pieceIndex) {
        if (this.isGameOver || !this.gameStarted || this.pieces[pieceIndex] === null) return;

        e.preventDefault();

        this.draggedPiece = this.pieces[pieceIndex];
        this.draggedPieceIndex = pieceIndex;

        const slot = document.querySelector(`.piece-slot[data-index="${pieceIndex}"]`);
        if (slot) slot.classList.add('dragging');

        this.createFloatingPiece(e);
    }

    createFloatingPiece(e) {
        if (this.floatingElement) this.floatingElement.remove();

        const piece = this.draggedPiece;
        const floater = document.createElement('div');
        floater.id = 'floating-piece';
        floater.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 1000;
            display: grid;
            gap: 2px;
            grid-template-columns: repeat(${piece.shape[0].length}, 28px);
            transform: translate(-50%, -100%) translateY(-20px);
        `;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                const cell = document.createElement('div');
                cell.style.cssText = `
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                `;
                if (piece.shape[y][x] === 1) {
                    cell.classList.add(piece.colorClass);
                    cell.style.boxShadow = 'inset 0 2px 4px rgba(255,255,255,0.25)';
                }
                floater.appendChild(cell);
            }
        }

        document.body.appendChild(floater);
        this.floatingElement = floater;
        this.updateFloatingPosition(e);
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

        // Calculate grid position
        const board = document.getElementById('board');
        if (!board) return;

        const rect = board.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const cellSize = rect.width / this.gridSize;
        const x = Math.floor((clientX - rect.left) / cellSize);
        const y = Math.floor((clientY - rect.top - 50) / cellSize); // Offset for finger

        if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
            this.ghostPosition = { x, y };
        } else {
            this.ghostPosition = null;
        }

        this.renderGrid();
    }

    endDrag(e) {
        if (!this.draggedPiece) return;

        if (this.floatingElement) {
            this.floatingElement.remove();
            this.floatingElement = null;
        }

        const slot = document.querySelector(`.piece-slot[data-index="${this.draggedPieceIndex}"]`);
        if (slot) slot.classList.remove('dragging');

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
        this.updateScoreDisplay();
        this.updateFlowDisplay();
        this.updatePowerUpButtons();
    }

    // ==================== MODALS ====================
    showModal(id) {
        document.getElementById(id)?.classList.add('visible');
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
            piecesPlaced: this.piecesPlaced
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
            this.linesCleared = data.linesCleared || 0;
            this.piecesPlaced = data.piecesPlaced || 0;
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
    }

    saveSettings() {
        localStorage.setItem('blockbloom_settings', JSON.stringify({
            soundEnabled: this.soundEnabled,
            hapticEnabled: this.hapticEnabled,
            colorblindMode: this.colorblindMode,
            zenTheme: this.zenTheme
        }));
    }

    loadSettings() {
        const settings = localStorage.getItem('blockbloom_settings');
        if (settings) {
            const data = JSON.parse(settings);
            this.soundEnabled = data.soundEnabled ?? true;
            this.hapticEnabled = data.hapticEnabled ?? true;
            this.colorblindMode = data.colorblindMode ?? false;
            this.zenTheme = data.zenTheme ?? false;

            // Apply to toggles
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

    // ==================== UTILITIES ====================
    haptic() {
        if (this.hapticEnabled && navigator.vibrate) {
            navigator.vibrate(10);
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
            { title: 'Welcome!', text: 'Drag blocks from the tray and drop them onto the 10x10 grid.' },
            { title: 'Clear Lines', text: 'Fill a complete row or column to clear it and score points!' },
            { title: 'Build Combos', text: 'Clear lines consecutively to build your combo multiplier for higher scores!' }
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

// ==================== INITIALIZE ====================
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new BlockBloom();
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
