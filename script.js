/*----- constants -----*/
const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

/*----- app's state (variables) -----*/
let flippedCards = [];
let movesCount;
let timer;
let seconds=30;
let badGuessesCount;
let wrongGuessTimeout;
/*----- cached element references -----*/
const gameBoard = document.querySelector('.game-board');
const movesCounter = document.getElementById('moves-counter');
const timerDisplay = document.getElementById('timer');
const badGuessesDisplay = document.getElementById('bad-guesses');
const startButton = document.getElementById('start-btn');

/*----- event listeners -----*/
startButton.addEventListener('click', startGame);
gameBoard.addEventListener('click', showWrongGuess);
gameBoard.addEventListener('click', updateMovesCounter);


/*----- functions -----*/

init();

function init() {
  const shuffledSymbols = shuffle(symbols);

  gameBoard.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    const symbol = shuffledSymbols[i];
    const card = createCard(symbol);
    gameBoard.appendChild(card);
    badGuessesCount = 0;
    incrementMovesCount();
  }

  startTimer();
}

function updateMovesCounter() {
    movesCount++;
    movesCounter.textContent = `Moves: ${movesCount}`;
    if (movesCount === 1) {
        restartTimer();
      }
  }

  function restartTimer() {
    clearInterval(timer);
    seconds = 30;
    timerDisplay.textContent = `Time: ${seconds}s`;
    startTimer();
  }

  function startTimer() {
    timer = setInterval(() => {
      seconds--;
      timerDisplay.textContent = `Time: ${seconds}s`;
  
      if (seconds === 0) {
        clearInterval(timer);
        gameOver(false);
      }
    }, 1000);
  }

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

function showWrongGuess() {
    clearTimeout(wrongGuessTimeout);
    badGuessesDisplay.textContent = 'Wrong Guess!';
    wrongGuessTimeout = setTimeout(() => {
      badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount}`;
    }, 1000);
  }

function updateBadGuessesCount() {
    badGuessesCount++;
    badGuessesDisplay.textContent = `Bad Guesses: ${badGuessesCount}`;
  }

function flipCard() {
  if (!flippedCards.includes(this) && flippedCards.length < 2) {
    this.classList.add("flipped");
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 1000);
      incrementMovesCount();
    }
  }
}

function incrementMovesCount() {
  movesCount++;
  const movesCounter = document.getElementById("moves-counter");
  movesCounter.textContent = `Moves: ${movesCount}`;
}

function checkForMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
  
    if (card1.textContent === card2.textContent) {
      card1.removeEventListener('click', flipCard);
      card2.removeEventListener('click', flipCard);
    } else {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      updateBadGuessesCount();

      if (badGuessesCount >= 10) { 
        gameOver(false);
      }
    }
  
    flippedCards = [];
  }

  function gameOver(hasWon) {
    clearInterval(timer);
    console.log(hasWon ? 'You won!' : 'You lost!');
  }

  function startGame() {
    clearInterval(timer);
    init();
    startTimer();
  }

function render() {
  gameBoard.innerHTML = "";

  init();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

