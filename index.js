const boardSize = document.getElementById("board-size");
const generateBoardBtn = document.getElementsByClassName("generate-board-btn")[0];
const gameBoard = document.getElementById("game-board");
const startBtn = document.getElementsByClassName("start-btn")[0];
const totalScoreDisplay = document.getElementsByClassName("total-score")[0];
const cells = document.getElementsByClassName("cell");
const h2 = document.getElementsByClassName("container")[0].children[2];
const finalScore = document.getElementById("final-score");
const modelMessage = document.getElementById("model-message");
const modelImage = document.getElementById("model-image");
const resultModel = document.getElementsByClassName("result-model")[0];
const restartBtn = document.getElementsByClassName("restart-btn")[0];
const controls = document.getElementsByClassName("controls")[0];
const topBtn = document.getElementsByClassName("arrow-top")[0];
const rightBtn = document.getElementsByClassName("arrow-right")[0];
const bottomBtn = document.getElementsByClassName("arrow-bottom")[0];
const leftBtn = document.getElementsByClassName("arrow-left")[0];
const guideText = document.getElementsByClassName("guide-text")[0];
let boardWidth, boardArea, intervalTime;
let totalScore = 0;
let direction = 1;
let speedIncrease = 0.8;
let appleIndex = 0;
let currentSnake = [0, 1, 2];
let tail = currentSnake[0];
let head = currentSnake[currentSnake.length - 1];
let movingIntervalId;

const inputHide = () => {
  boardSize.style.display = "none";
  generateBoardBtn.style.display = "none";
  guideText.style.display = "none";
};

const boardHide = () => {
  startBtn.style.display = "none";
  h2.style.display = "none";
  controls.style.display = "none";
};
boardHide();

const boardAppear = () => {
  startBtn.style.display = "block";
  h2.style.display = "block";
  const screenSize = window.innerWidth;
  if (screenSize > 500) {
    return (controls.style.display = "none");
  }
  controls.style.display = "grid";
};

const startBtnFade = () => {
  startBtn.style.opacity = 0;
  startBtn.style.pointerEvents = "none";
};
const startBtnAppear = () => {
  startBtn.style.opacity = 1;
  startBtn.style.pointerEvents = "initial";
};

// create grid based on user input.
const generateGridIntoBoard = () => {
  boardWidth = +boardSize.value;
  boardArea = boardWidth * boardWidth;
  gameBoard.style.width = `${boardWidth * 20}px`;
  gameBoard.style.height = `${boardWidth * 20}px`;
  for (let i = 0; i < boardArea; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
  }
  createSnake();
  inputHide();
  boardAppear();
};

// create initial snake.
const createSnake = () => {
  for (let cell of currentSnake) {
    cells[cell].classList.add("snake");
  }
};

//generate an apple
const generateApple = () => {
  do {
    appleIndex = Math.floor(Math.random() * boardArea);
  } while (cells[appleIndex].classList.contains("snake"));
  cells[appleIndex].classList.add("apple");
};

const startGame = () => {
  startBtnFade();
  currentSnake.forEach((index) => cells[index].classList.remove("snake"));
  cells[appleIndex].classList.remove("apple");
  clearInterval(movingIntervalId);
  totalScore = 0;
  totalScoreDisplay.textContent = totalScore;
  direction = 1;
  intervalTime = 500;
  currentSnake = [0, 1, 2];
  createSnake();
  generateApple();
  tail = currentSnake[0];
  head = currentSnake[currentSnake.length - 1];
  movingIntervalId = setInterval(move, intervalTime);
};

const move = () => {
  //check the snake hit the wall, and stop.
  if (
    (head % boardWidth === boardWidth - 1 && direction === 1) ||
    (head % boardWidth === 0 && direction === -1) ||
    (head - boardWidth < 0 && direction === -boardWidth) ||
    (head + boardWidth >= boardArea && direction === boardWidth) ||
    cells[head + direction].classList.contains("snake") // check whether the next move is into itself or not.
  ) {
    finalScore.textContent = totalScore;
    if (totalScore < 10) {
      modelMessage.textContent = "You don't even get 10 points...LMAO";
      modelImage.src = "./assets/lmao.webp";
    }
    if (totalScore >= 10) {
      modelMessage.textContent = "Wow! You've got fast hands...";
      modelImage.src = "./assets/wow.webp";
    }
    boardHide();
    resultModel.classList.add("active");
    return clearInterval(movingIntervalId);
  }

  //remove previous snake
  Array.from(cells).forEach((cell) => {
    cell.classList.remove("snake");
  });

  //update the snake
  tail = currentSnake[0];
  currentSnake.shift();
  head += direction;
  currentSnake.push(head);
  //check if the snake eats apple, and grow.
  if (cells[head].classList.contains("apple")) {
    cells[head].classList.remove("apple");
    cells[tail].classList.add("snake");
    currentSnake.unshift(tail);
    createSnake();
    totalScore++;
    totalScoreDisplay.textContent = totalScore;
    generateApple();
    clearInterval(movingIntervalId);
    intervalTime *= speedIncrease;
    movingIntervalId = setInterval(move, intervalTime);
    return;
  }
  createSnake();
};

//change snake's direction based on arrow that is pressed.
document.addEventListener("keyup", (event) => {
  const code = event.keyCode;
  code === 37 ? (direction = -1) : direction;
  code === 38 ? (direction = -boardWidth) : direction;
  code === 39 ? (direction = 1) : direction;
  code === 40 ? (direction = boardWidth) : direction;
});

controls.addEventListener("click", (event) => {
  event.target.classList.contains("arrow-right") ? (direction = 1) : direction;
  event.target.classList.contains("arrow-top") ? (direction = -boardWidth) : direction;
  event.target.classList.contains("arrow-left") ? (direction = -1) : direction;
  event.target.classList.contains("arrow-bottom") ? (direction = boardWidth) : direction;
});

startBtn.addEventListener("click", startGame);
generateBoardBtn.addEventListener("click", generateGridIntoBoard);
restartBtn.addEventListener("click", () => location.reload());
