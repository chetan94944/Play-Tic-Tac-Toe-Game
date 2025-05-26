document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.game-board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const pvpButton = document.getElementById('pvp');
    const pvcButton = document.getElementById('pvc');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scoreTie = document.getElementById('score-tie');

    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameMode = 'pvp'; // Default mode
    let scores = { x: 0, o: 0, tie: 0 };

    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Initialize the game
    function initGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x-symbol', 'o-symbol', 'winning-cell');
        });
    }

    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // If cell already filled or game not active, ignore click
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;

        // Update game state and UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'x-symbol' : 'o-symbol');

        // Check for win or draw
        checkResult();
    }

    // Check for win or draw
    function checkResult() {
        let roundWon = false;

        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;

            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                // Highlight winning cells
                document.querySelector(`[data-index="${a}"]`).classList.add('winning-cell');
                document.querySelector(`[data-index="${b}"]`).classList.add('winning-cell');
                document.querySelector(`[data-index="${c}"]`).classList.add('winning-cell');
                break;
            }
        }

        // If won
        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            updateScore(currentPlayer);
            gameActive = false;
            return;
        }

        // If draw
        if (!gameState.includes('')) {
            status.textContent = "Game ended in a draw!";
            updateScore('tie');
            gameActive = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;

        // If playing against computer and it's computer's turn
        if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 500);
        }
    }

    // Computer's move (simple AI)
    function computerMove() {
        // Try to win first
        let move = findWinningMove('O');
        if (move === null) {
            // Block player's winning move
            move = findWinningMove('X');
            if (move === null) {
                // Take center if available
                if (gameState[4] === '') {
                    move = 4;
                } else {
                    // Take a random available corner
                    const corners = [0, 2, 6, 8];
                    const availableCorners = corners.filter(index => gameState[index] === '');
                    if (availableCorners.length > 0) {
                        move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
                    } else {
                        // Take any available cell
                        const availableCells = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
                        if (availableCells.length > 0) {
                            move = availableCells[Math.floor(Math.random() * availableCells.length)];
                        }
                    }
                }
            }
        }

        if (move !== null) {
            gameState[move] = 'O';
            const cell = document.querySelector(`[data-index="${move}"]`);
            cell.textContent = 'O';
            cell.classList.add('o-symbol');
            checkResult();
        }
    }

    // Helper function to find winning move
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const cells = [gameState[a], gameState[b], gameState[c]];
            
            // If two cells are player's and one is empty
            if (cells.filter(val => val === player).length === 2 && cells.includes('')) {
                const emptyIndex = winningConditions[i][cells.indexOf('')];
                if (gameState[emptyIndex] === '') {
                    return emptyIndex;
                }
            }
        }
        return null;
    }

    // Update score
    function updateScore(winner) {
        if (winner === 'X') {
            scores.x++;
            scoreX.textContent = scores.x;
        } else if (winner === 'O') {
            scores.o++;
            scoreO.textContent = scores.o;
        } else {
            scores.tie++;
            scoreTie.textContent = scores.tie;
        }
    }

    // Set game mode
    function setGameMode(mode) {
        gameMode = mode;
        if (mode === 'pvp') {
            pvpButton.disabled = true;
            pvcButton.disabled = false;
            status.textContent = `Player ${currentPlayer}'s turn`;
        } else {
            pvpButton.disabled = false;
            pvcButton.disabled = true;
            status.textContent = `Player ${currentPlayer}'s turn`;
        }
        initGame();
    }

    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', initGame);
    pvpButton.addEventListener('click', () => setGameMode('pvp'));
    pvcButton.addEventListener('click', () => setGameMode('pvc'));

    // Initialize the game
    initGame();
    setGameMode('pvp');
});