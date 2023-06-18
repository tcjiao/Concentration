/*----- Constants -----*/
const symbols = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];

/*----- App State -----*/
let flippedCards = [];
let movesCount;
let timer;
let seconds = 60;
let badGuessesCount;
let wrongGuessTimeout;

/*----- Cached Elements -----*/
const gameBoard = document.querySelector('.game-board');
const movesCounter = document.getElementById('moves-counter');
const timerDisplay = document.getElementById('timer');
const badGuessesDisplay = document.getElementById('bad-guesses');
const startButton = document.getElementById('start-btn');

/*----- Event Listeners -----*/
startButton.addEventListener('click', startGame);
gameBoard.addEventListener('click', handleCardClick);

/*----- Functions -----*/

// Initialize the game
function startGame() {
  init();
  startTimer();
}

// Initialize game state and create game board
function init() {
  movesCount = 0;
  badGuessesCount = 0;
  flippedCards = [];

  const shuffledSymbols = shuffle(symbols);
  gameBoard.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    const symbol = shuffledSymbols[i];
    const card = createCard(symbol);
    gameBoard.appendChild(card);
  }

  updateMovesCounter();
}

// Create a card element
function createCard(symbol) {
  const card = document.createElement("div");
  card.className = "card";

  const cardFront = document.createElement("div");
  cardFront.className = "card-front";
  cardFront.textContent = symbol;

  const cardBack = document.createElement("div");
  cardBack.className = "card-back";

  card.appendChild(cardFront);
  card.appendChild(cardBack);
  card.addEventListener("click", flipCard);

  return card;
}

// Flip a card
function flipCard() {
  if (flippedCards.length >= 2) return;

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    setTimeout(checkForMatch, 1000);
    incrementMovesCount();
  }
}

// Check if flipped cards are a match
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.textContent === card2.textContent) {
    card1.removeEventListener("click", flipCard);
    card2.removeEventListener("click", flipCard);
    checkForWin();
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    updateBadGuessesCount();

    if (badGuessesCount >= 10) {
      gameOver(false);
    }
  }

  flippedCards = [];
}

// Check for win condition
function checkForWin() {
  const allCards = document.querySelectorAll(".card");
  const isGameWon = [...allCards].every((card) => {
    return !card.classList.contains("flipped");
  });

  if (isGameWon) {
    gameOver(true);
  }
}

// Increment moves count and update moves counter display
function incrementMovesCount() {
  movesCount++;
  movesCounter.textContent = `Moves: ${movesCount}`;

  if (movesCount === 1) {
    restartTimer();
  }
}

// Update bad guesses count and display wrong guess message
function updateBadGuessesCount() {
  badGuessesCount++;
  badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount}`;
  showWrongGuess();
}

// Show wrong guess message
function showWrongGuess() {
  clearTimeout(wrongGuessTimeout);
  badGuessesDisplay.textContent = "Wrong Guess!";
  wrongGuessTimeout = setTimeout(() => {
    badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount}`;
  }, 1000);
}

// Start the countdown timer
function startTimer() {
  timer = setInterval(() => {
    seconds--;

    if (seconds === 0) {
      gameOver(false);
    }

    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);
}

// Restart the countdown timer
function restartTimer() {
  clearInterval(timer);
  seconds = 60;
  timerDisplay.textContent = `Time: ${seconds}s`;
  startTimer();
}

// Game over function
function gameOver(hasWon) {
  clearInterval(timer);

  const resultMessage = document.getElementById("result-message");

  if (hasWon) {
    resultMessage.innerText = "Congratulations! You won!";
  } else {
    resultMessage.innerText = "Game over! You lost!";
  }
}

// Helper function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}