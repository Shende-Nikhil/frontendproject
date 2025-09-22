const board = document.querySelector('.game-board');
const movesCounter = document.getElementById('moves');
const restartBtn = document.getElementById('restart');

// Names instead of emojis
let names = ['Apple','Banana','Apple','Banana','Cherry','Cherry','Grapes','Grapes'];
let flipped = [];
let matched = [];
let moves = 0;

// Start game
function startGame() {
  board.innerHTML = "";
  flipped = [];
  matched = [];
  moves = 0;
  movesCounter.textContent = moves;

  // Shuffle names
  names = names.sort(() => 0.5 - Math.random());//har time game name change hoge

  // Create cards
  names.forEach((name, index) => {
    let card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-name', name); //stored card name
    card.setAttribute('data-id', index); 
    card.textContent = "?";
    board.appendChild(card);

    card.addEventListener('click', () => flipCard(card));
  });
}

// Flip card
function flipCard(card) {
  if (flipped.length < 2 && !flipped.includes(card) && !matched.includes(card)) {
    card.textContent = card.getAttribute('data-name');
    card.classList.add('flipped');
    flipped.push(card);
  }

  if (flipped.length === 2) {
    moves++;
    movesCounter.textContent = moves;
    checkMatch();
  }
}

// Check match
function checkMatch() {
  let [card1, card2] = flipped;
  if (card1.getAttribute('data-name') === card2.getAttribute('data-name')) {
    matched.push(card1, card2);
    flipped = [];

    // Pair matched alert
    alert(" Pair Matched: " + card1.getAttribute('data-name'));

    // All pairs matched
    if (matched.length === names.length) {
      setTimeout(() => {
        alert(" You Win! All Pairs Matched!");
        startGame();
      }, 300);
    }

  } else {
    setTimeout(() => {
      card1.textContent = "?";
      card2.textContent = "?";
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flipped = [];
    }, 1000);
  }
}

// Restart button
restartBtn.addEventListener('click', startGame);

// First load
startGame();