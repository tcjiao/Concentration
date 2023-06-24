/*----- Constants -----*/
const symbols = ['imgs/1.png', 'imgs/1.png', 'imgs/2.png', 'imgs/2.png', 'imgs/3.png', 'imgs/3.png', 'imgs/4.png', 'imgs/4.png', 'imgs/5.png', 'imgs/5.png', 'imgs/6.png', 'imgs/6.png', 'imgs/7.png', 'imgs/7.png', 'imgs/8.png', 'imgs/8.png'];
const flipAudio = new Audio("Audio/flip.ogg");
const wrongAudio = new Audio("Audio/wrong.mp3");
const correctAudio = new Audio("Audio/correct.mp3");
const winAudio = new Audio("Audio/win.mp3")
const loseAudio = new Audio("Audio/lose.mp3")

/*----- App State -----*/
let flippedCards = [];
let movesCount;
let timer;
let seconds = 60;
let badGuessesCount;
let wrongGuessTimeout;
let gameEnded = false;

/*----- Cached Elements -----*/
const gameBoard = document.querySelector('.game-board');
const movesCounter = document.getElementById('moves-counter');
const timerDisplay = document.getElementById('timer');
const badGuessesDisplay = document.getElementById('bad-guesses');
const startButton = document.getElementById('start-btn');

/*----- Event Listeners -----*/
startButton.addEventListener('click', startGame);

/*----- Functions -----*/

// Initialize the game
function startGame() {
  clearInterval(timer);
  clearMessage();
  init();
  startTimer();
  gameEnded = false;
}

// Initialize game state and create game board
function init() {
  movesCount = 0;
  badGuessesCount = 0;
  flippedCards = [];
  startButton.innerText = "Reset";
  seconds = 60;
  badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount} /10`;
  movesCounter.textContent = `Moves: ${movesCount}`;
  badGuessesDisplay.style.color = '';

  const shuffledSymbols = shuffle(symbols);
  gameBoard.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    const symbol = shuffledSymbols[i];
    const card = createCard(symbol);
    gameBoard.appendChild(card);
  }
}

// Create a card element
function createCard(symbol) {
  const card = document.createElement("div");
  card.className = "card";

  const cardFront = document.createElement("div");
  cardFront.className = "card-front";
  cardFront.textContent = symbol;
  cardFront.style.backgroundImage = `url(${symbol})`;


  const cardBack = document.createElement("div");
  cardBack.className = "card-back";

  card.appendChild(cardFront);
  card.appendChild(cardBack);
  card.addEventListener("click", flipCard);

  return card;
}




// Flip a card
function flipCard() {
  if (flippedCards.length >= 2 || gameEnded || this.classList.contains("flipped")) return;

  this.classList.add("flipped");
  flippedCards.push(this);
  flipAudio.currentTime = 0;
  flipAudio.play();

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
    card1.classList.add("paired");
    card2.classList.add("paired");
    showPairedMessage();
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
  const matchedPairs = document.querySelectorAll('.flipped').length / 2;
  const totalPairs = symbols.length / 2;

  if (matchedPairs === totalPairs) {
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
  badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount} /10`;
  showWrongGuess();
}

// Show wrong guess message
function showWrongGuess() {
  badGuessesDisplay.textContent = "Wrong Guess!";
  badGuessesDisplay.style.color = 'red';
  wrongAudio.play();
  setTimeout(() => {
    badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount} /10`;
    if (badGuessesCount >= 5 && badGuessesCount <= 7){
      badGuessesDisplay.style.color = '#cccc00';
    }
    else if (badGuessesCount> 7 && badGuessesCount <= 9){
      badGuessesDisplay.style.color = 'orange';
    }
    else if (badGuessesCount === 10){
      badGuessesDisplay.style.color = 'red';
    }
    else{
      badGuessesDisplay.style.color = '';
    }
  }, 1000);
}

// Show paired card message
function showPairedMessage() {
  badGuessesDisplay.textContent = "Cards Paired!";
  badGuessesDisplay.style.color = 'green';
  correctAudio.play();
  setTimeout(() => {
    badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount} /10`;
    if (badGuessesCount >= 5 && badGuessesCount <= 7){
      badGuessesDisplay.style.color = '#cccc00';
    }
    else if (badGuessesCount> 7 && badGuessesCount <= 9){
      badGuessesDisplay.style.color = 'orange';
    }
    else if (badGuessesCount === 10){
      badGuessesDisplay.style.color = 'red';
    }
    else{
      badGuessesDisplay.style.color = '';
    }
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

// Clear win/lose message
function clearMessage() {
  const resultMessage = document.getElementById("result-message");
  resultMessage.innerText = "";
}

// Game over function
function gameOver(hasWon) {
  clearInterval(timer);
  gameEnded = true;
  startButton.innerText = "Play again!";
  const resultMessage = document.getElementById("result-message");

  if (hasWon) {
    resultMessage.innerText = "Congratulations! You won!";
    resultMessage.style.color = 'green';
    winAudio.play();
  } else {
    resultMessage.innerText = "Game over! You lost!";
    resultMessage.style.color = 'red';
    loseAudio.play();
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