const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restartBtn");
const playerModeBtn = document.getElementById("playerMode");
const computerModeBtn = document.getElementById("computerMode");

const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");
const drawScoreText = document.getElementById("drawScore");

let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";
let gameOver = false;

let computerMode = false;

let xScore = 0;
let oScore = 0;
let drawScore = 0;


// All possible winning combinations
const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


// Handle player click
cells.forEach((cell) => {

    cell.addEventListener("click", () => {

        const index = cell.getAttribute("data-index");

        // Don't allow clicking an already filled box
        if (board[index] !== "" || gameOver) {
            return;
        }

        // In computer mode, don't allow player to play O
        if (computerMode && currentPlayer === "O") {
            return;
        }

        makeMove(index, currentPlayer);

        if (checkGame()) {
            return;
        }

        // Change player
        currentPlayer = currentPlayer === "X" ? "O" : "X";

        updateStatus();

        // Computer's turn
        if (computerMode && currentPlayer === "O" && !gameOver) {
            setTimeout(computerMove, 500);
        }
    });
});


// Put X or O on the board
function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
}


// Check win or draw
function checkGame() {

    for (let pattern of winningPatterns) {

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            gameOver = true;

            // Highlight winning cells
            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            const winner = board[a];

            statusText.textContent = `Player ${winner} Wins!`;

            if (winner === "X") {
                xScore++;
                xScoreText.textContent = xScore;
            } else {
                oScore++;
                oScoreText.textContent = oScore;
            }

            return true;
        }
    }

    // Check draw
    if (!board.includes("")) {

        gameOver = true;
        drawScore++;

        drawScoreText.textContent = drawScore;
        statusText.textContent = "It's a Draw!";

        return true;
    }

    return false;
}


// Update turn message
function updateStatus() {

    if (computerMode && currentPlayer === "O") {
        statusText.textContent = "Computer's Turn";
    } else {
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}


// Computer move
function computerMove() {

    if (gameOver) {
        return;
    }

    // Get empty cells
    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    // Pick a random empty cell
    const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    makeMove(randomIndex, "O");

    if (checkGame()) {
        return;
    }

    currentPlayer = "X";
    updateStatus();
}


// Restart the current game
function restartGame() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";
    gameOver = false;

    cells.forEach((cell) => {
        cell.textContent = "";

        cell.classList.remove("x");
        cell.classList.remove("o");
        cell.classList.remove("winner");
    });

    updateStatus();
}


// Player vs Player mode
playerModeBtn.addEventListener("click", () => {

    computerMode = false;

    playerModeBtn.classList.add("active");
    computerModeBtn.classList.remove("active");

    restartGame();
});


// Player vs Computer mode
computerModeBtn.addEventListener("click", () => {

    computerMode = true;

    computerModeBtn.classList.add("active");
    playerModeBtn.classList.remove("active");

    restartGame();
});


// Restart button
restartBtn.addEventListener("click", restartGame);