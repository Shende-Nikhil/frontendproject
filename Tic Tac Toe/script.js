// Select all 9 cells and convert NodeList to Array
const cells = Array.from(document.querySelectorAll(".cell")); // array with index
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("modeSelect");

let currentPlayer = "X";            // X always starts first
let board = Array(9).fill(null);    // 9 cells, all empty initially
let gameOver = false;               // flag to track game status
let mode = "pvp";                   // default mode: Player vs Player

// All winning combinations: rows, columns, diagonals
const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// Update the status text and apply style
function updateStatusText() {
  statusText.textContent = gameOver 
    ? statusText.textContent            // if game over, keep the current text
    : `Player ${currentPlayer}'s Turn`; // otherwise show whose turn it is
  statusText.className = currentPlayer.toLowerCase();
}

// Check for a winner or a draw
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // A winning pattern is found
      statusText.textContent = `🎉 Player ${board[a]} Wins!`;
      gameOver = true;

      // Disable all cells
      cells.forEach(cell => cell.classList.add("disabled"));

      // Highlight winning cells
      pattern.forEach(i => cells[i].classList.add("winner"));
      return true;
    }
  }

  // If no empty cells left → Draw
  if (!board.includes(null)) {
    statusText.textContent = "🤝 It's a Draw!";
    gameOver = true;
    return true;
  }
  return false;
}

// Easy CPU: makes a random move
function cpuMove() {
  if (gameOver) return;

  // Find empty cells
  const emptyIndices = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;

  // Pick a random empty cell
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[randomIndex] = "O";

  // Update the UI
  const cell = cells[randomIndex];
  cell.textContent = "O";
  cell.classList.add("o");

  // Check if CPU wins, otherwise switch turn back to player
  if (!checkWinner()) {
    currentPlayer = "X";
    updateStatusText();
  }
}

// Add click event for each cell
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    // Ignore if game is over or cell is already filled
    if (gameOver || board[index]) return;

    // Place current player's symbol
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    // Check for winner/draw, otherwise switch turn
    if (!checkWinner()) {
      if (mode === "pvp") {
        // Player vs Player: alternate between X and O
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatusText();
      } else if (mode === "cpu") {
        // Player vs CPU: CPU makes the next move
        currentPlayer = "O";
        updateStatusText();
        setTimeout(cpuMove, 500); // add delay for CPU move
      }
    }
  });
});

// Reset game when reset button is clicked
resetBtn.addEventListener("click", resetGame);

function resetGame() {
  board.fill(null);

  // Clear all cells and remove classes
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("disabled", "x", "o", "winner");
  });

  currentPlayer = "X";   // reset starting player
  gameOver = false;
  updateStatusText();
}

// Change mode (PvP or CPU) and reset the game
modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  resetGame();
});

// Initialize game status on page load
updateStatusText();
