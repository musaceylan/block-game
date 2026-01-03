// Extract and test the game over logic

const PIECES = {
    dot: { shape: [[1]], weight: 8 },
    line_2h: { shape: [[1, 1]], weight: 10 },
    line_2v: { shape: [[1], [1]], weight: 10 },
    line_3h: { shape: [[1, 1, 1]], weight: 8 },
    line_3v: { shape: [[1], [1], [1]], weight: 8 },
    line_4h: { shape: [[1, 1, 1, 1]], weight: 5 },
    line_4v: { shape: [[1], [1], [1], [1]], weight: 5 },
    square_2x2: { shape: [[1, 1], [1, 1]], weight: 10 },
    l_small: { shape: [[1, 0], [1, 1]], weight: 10 },
    l_small_r: { shape: [[0, 1], [1, 1]], weight: 10 },
    t_shape: { shape: [[1, 1, 1], [0, 1, 0]], weight: 8 },
    big_square: { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 2 },
};

class TestGame {
    constructor() {
        this.gridSize = 8;
        this.grid = [];
        this.pieces = [null, null, null];
        this.createGrid();
    }

    createGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = { filled: false };
            }
        }
    }

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

    fillGrid() {
        // Fill entire grid
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x].filled = true;
            }
        }
    }

    fillGridExceptCorner() {
        // Fill grid but leave one corner empty
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x].filled = true;
            }
        }
        this.grid[0][0].filled = false;
    }

    fillGridWithSmallGaps() {
        // Fill grid with scattered single empty cells
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x].filled = (x + y) % 3 !== 0;
            }
        }
    }

    printGrid() {
        console.log('Grid state:');
        for (let y = 0; y < this.gridSize; y++) {
            let row = '';
            for (let x = 0; x < this.gridSize; x++) {
                row += this.grid[y][x].filled ? '█' : '·';
            }
            console.log(row);
        }
    }
}

// Test cases
console.log('========== TEST 1: Empty grid with pieces ==========');
let game1 = new TestGame();
game1.pieces = [
    { shape: [[1, 1], [1, 1]], colorClass: 'block-1' },
    { shape: [[1, 1, 1]], colorClass: 'block-2' },
    null
];
game1.printGrid();
console.log('Pieces:', game1.pieces.map((p, i) => p ? `${i}: ${p.shape.length}x${p.shape[0].length}` : `${i}: null`));
console.log('Game Over?', game1.checkGameOver());
console.log('Expected: false (pieces can be placed on empty grid)\n');

console.log('========== TEST 2: Full grid with pieces ==========');
let game2 = new TestGame();
game2.fillGrid();
game2.pieces = [
    { shape: [[1]], colorClass: 'block-1' },
    null,
    null
];
game2.printGrid();
console.log('Pieces:', game2.pieces.map((p, i) => p ? `${i}: ${p.shape.length}x${p.shape[0].length}` : `${i}: null`));
console.log('Game Over?', game2.checkGameOver());
console.log('Expected: true (no space for even 1x1 piece)\n');

console.log('========== TEST 3: Full grid except corner, 1x1 piece ==========');
let game3 = new TestGame();
game3.fillGridExceptCorner();
game3.pieces = [
    { shape: [[1]], colorClass: 'block-1' },
    null,
    null
];
game3.printGrid();
console.log('Pieces:', game3.pieces.map((p, i) => p ? `${i}: ${p.shape.length}x${p.shape[0].length}` : `${i}: null`));
console.log('Game Over?', game3.checkGameOver());
console.log('Expected: false (1x1 can fit in corner)\n');

console.log('========== TEST 4: Full grid except corner, 2x2 piece ==========');
let game4 = new TestGame();
game4.fillGridExceptCorner();
game4.pieces = [
    { shape: [[1, 1], [1, 1]], colorClass: 'block-1' },
    null,
    null
];
game4.printGrid();
console.log('Pieces:', game4.pieces.map((p, i) => p ? `${i}: ${p.shape.length}x${p.shape[0].length}` : `${i}: null`));
console.log('Game Over?', game4.checkGameOver());
console.log('Expected: true (2x2 cannot fit in single empty cell)\n');

console.log('========== TEST 5: Scattered gaps, large piece ==========');
let game5 = new TestGame();
game5.fillGridWithSmallGaps();
game5.pieces = [
    { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], colorClass: 'block-1' },
    null,
    null
];
game5.printGrid();
console.log('Pieces:', game5.pieces.map((p, i) => p ? `${i}: ${p.shape.length}x${p.shape[0].length}` : `${i}: null`));
console.log('Game Over?', game5.checkGameOver());
console.log('Expected: true (3x3 cannot fit in scattered gaps)\n');

console.log('========== TEST 6: All pieces null ==========');
let game6 = new TestGame();
game6.fillGrid();
game6.pieces = [null, null, null];
console.log('Pieces:', game6.pieces);
console.log('Game Over?', game6.checkGameOver());
console.log('Expected: false (all pieces null means new pieces will be generated)\n');

console.log('========== ALL TESTS COMPLETE ==========');
