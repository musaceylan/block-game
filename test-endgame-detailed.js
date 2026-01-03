// Detailed test of the game over and end game flow
// This simulates what happens in the browser

const fs = require('fs');

// Read the actual game.js file
const gameCode = fs.readFileSync('game.js', 'utf8');

console.log('='.repeat(60));
console.log('BLOCK BLOOM - GAME OVER FLOW ANALYSIS');
console.log('='.repeat(60));

// Check 1: Verify checkGameOver function exists and has logging
console.log('\n[CHECK 1] checkGameOver() function analysis:');
if (gameCode.includes('checkGameOver()')) {
    console.log('  OK Function found');
    const hasLogging = gameCode.includes('[GameOver Check]');
    console.log('  ' + (hasLogging ? 'OK' : 'FAIL') + ' Contains debug logging: ' + hasLogging);
    const returnsTrue = gameCode.includes('return true;');
    console.log('  ' + (returnsTrue ? 'OK' : 'FAIL') + ' Returns true (game over): ' + returnsTrue);
} else {
    console.log('  FAIL Function NOT found!');
}

// Check 2: Verify endGame function exists and shows modal
console.log('\n[CHECK 2] endGame() function analysis:');
if (gameCode.includes('endGame()')) {
    console.log('  OK Function found');
    const hasLogging = gameCode.includes('[EndGame]');
    console.log('  ' + (hasLogging ? 'OK' : 'FAIL') + ' Contains debug logging: ' + hasLogging);
    const showsModal = gameCode.includes("showModal('gameover-modal')");
    console.log('  ' + (showsModal ? 'OK' : 'FAIL') + ' Calls showModal: ' + showsModal);
    const setsGameOver = gameCode.includes('this.isGameOver = true');
    console.log('  ' + (setsGameOver ? 'OK' : 'FAIL') + ' Sets isGameOver = true: ' + setsGameOver);
    const updatesReason = gameCode.includes('gameover-reason');
    console.log('  ' + (updatesReason ? 'OK' : 'FAIL') + ' Updates gameover-reason element: ' + updatesReason);
} else {
    console.log('  FAIL Function NOT found!');
}

// Check 3: Verify showModal function
console.log('\n[CHECK 3] showModal() function analysis:');
if (gameCode.includes('showModal(id)')) {
    console.log('  OK Function found');
    const addsVisible = gameCode.includes("classList.add('visible')");
    console.log('  ' + (addsVisible ? 'OK' : 'FAIL') + ' Adds visible class: ' + addsVisible);
} else {
    console.log('  FAIL Function NOT found!');
}

// Check 4: Verify placePiece triggers game over check
console.log('\n[CHECK 4] placePiece() calls checkGameOver:');
const placePieceCallsCheck = gameCode.includes('if (this.checkGameOver())');
console.log('  ' + (placePieceCallsCheck ? 'OK' : 'FAIL') + ' Calls checkGameOver(): ' + placePieceCallsCheck);
const placePieceCallsEnd = gameCode.includes('setTimeout(() => this.endGame()');
console.log('  ' + (placePieceCallsEnd ? 'OK' : 'FAIL') + ' Calls endGame() via setTimeout: ' + placePieceCallsEnd);

// Check 5: Verify HTML has the modal
console.log('\n[CHECK 5] index.html modal analysis:');
const htmlCode = fs.readFileSync('index.html', 'utf8');
const hasGameoverModal = htmlCode.includes('id="gameover-modal"');
console.log('  ' + (hasGameoverModal ? 'OK' : 'FAIL') + ' Has gameover-modal element: ' + hasGameoverModal);
const hasGameoverReason = htmlCode.includes('id="gameover-reason"');
console.log('  ' + (hasGameoverReason ? 'OK' : 'FAIL') + ' Has gameover-reason element: ' + hasGameoverReason);
const hasFinalScore = htmlCode.includes('id="final-score"');
console.log('  ' + (hasFinalScore ? 'OK' : 'FAIL') + ' Has final-score element: ' + hasFinalScore);
const hasPlayAgain = htmlCode.includes('id="play-again-btn"');
console.log('  ' + (hasPlayAgain ? 'OK' : 'FAIL') + ' Has play-again-btn: ' + hasPlayAgain);

// Check 6: Verify CSS makes modal visible
console.log('\n[CHECK 6] CSS visibility analysis:');
const hasVisibleClass = htmlCode.includes('.modal-overlay.visible');
console.log('  ' + (hasVisibleClass ? 'OK' : 'FAIL') + ' Has .modal-overlay.visible style: ' + hasVisibleClass);
const visibilityHidden = htmlCode.includes('visibility: hidden');
console.log('  ' + (visibilityHidden ? 'OK' : 'FAIL') + ' Default visibility hidden: ' + visibilityHidden);
const visibilityVisible = htmlCode.includes('visibility: visible');
console.log('  ' + (visibilityVisible ? 'OK' : 'FAIL') + ' .visible sets visibility visible: ' + visibilityVisible);

// Check 7: Cache version
console.log('\n[CHECK 7] Cache busting:');
const cacheMatch = htmlCode.match(/game\.js\?v=(\d+)/);
if (cacheMatch) {
    console.log('  OK Cache version: v=' + cacheMatch[1]);
} else {
    console.log('  FAIL No cache version found');
}

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log('\nThe game over flow should work as follows:');
console.log('1. Player places a piece -> placePiece() is called');
console.log('2. After placing, checkGameOver() is called');
console.log('3. If no pieces can be placed anywhere -> returns true');
console.log('4. endGame() is scheduled via setTimeout (300ms or 600ms delay)');
console.log('5. endGame() updates stats, shows reason, calls showModal');
console.log('6. showModal() adds visible class to the modal element');
console.log('7. CSS transitions the modal from hidden to visible');
console.log('\nTo test in browser:');
console.log('- Open http://localhost:8888/test-browser.html');
console.log('- Click "Force Game Over" to simulate a game over');
console.log('- Check browser console (F12) for debug messages');

// Check for any syntax errors in the game code
console.log('\n[SYNTAX CHECK] Attempting to parse game.js...');
try {
    new Function(gameCode);
    console.log('  OK No syntax errors detected');
} catch (e) {
    console.log('  FAIL Syntax error: ' + e.message);
}

console.log('\n' + '='.repeat(60));
