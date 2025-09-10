const cells = Array.from(document.querySelectorAll(".cell")); // array with index
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("modeSelect");

let currentPlayer = "X";
let board = Array(9).fill(null);
let gameOver = false;
let mode = "pvp"; // default mode

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], //Rows
  [0,3,6], [1,4,7], [2,5,8], //columns
  [0,4,8], [2,4,6] //diagonals
];

function updateStatusText() {
  statusText.textContent = gameOver 
    ? statusText.textContent 
    : `Player ${currentPlayer}'s Turn`;
  statusText.className = currentPlayer.toLowerCase();
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `🎉 Player ${board[a]} Wins!`;
      gameOver = true;
      cells.forEach(cell => cell.classList.add("disabled"));
      pattern.forEach(i => cells[i].classList.add("winner"));
      return true;
    }
  }
  if (!board.includes(null)) {
    statusText.textContent = "🤝 It's a Draw!";
    gameOver = true;
    return true;
  }
  return false;
}

// Easy CPU: random move
function cpuMove() {
  if (gameOver) return;
  const emptyIndices = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[randomIndex] = "O";
  const cell = cells[randomIndex];
  cell.textContent = "O";
  cell.classList.add("o");

  if (!checkWinner()) {
    currentPlayer = "X";
    updateStatusText();
  }
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (gameOver || board[index]) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (!checkWinner()) {
      if (mode === "pvp") {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatusText();
      } else if (mode === "cpu") {
        currentPlayer = "O";
        updateStatusText();
        setTimeout(cpuMove, 500); // CPU delay
      }
    }
  });
});

resetBtn.addEventListener("click", resetGame);

function resetGame() {
  board.fill(null);
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("disabled", "x", "o", "winner");
  });
  currentPlayer = "X";
  gameOver = false;
  updateStatusText();
}

modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  resetGame();
});

// Init
updateStatusText();
