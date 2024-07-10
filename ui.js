// ui.js
function initializeUI() {
  const titleScreen = document.getElementById('title-screen');
  const puzzleScreen = document.getElementById('puzzle-screen');
  const toggleCrtButton = document.getElementById('toggle-crt');

  titleScreen.style.display = 'none';
  puzzleScreen.style.display = 'flex';
}

function updateTimerDisplay(timer) {
  const timerElement = document.getElementById('timer');
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerElement.innerHTML = `Time:<br>${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateMovesDisplay(moves) {
  const movesElement = document.getElementById('moves');
  movesElement.innerHTML = `Moves:<br>${moves}`;
}

function displayCongratulations() {
  const congratsMessage = document.createElement('div');
  congratsMessage.innerHTML = "You unscrambled the scene!";
  congratsMessage.classList.add('congrats-message');

  const originalImage = document.getElementById('original-image');
  originalImage.insertAdjacentElement('afterend', congratsMessage);
}

function displayShareButton() {
  const shareButton = document.getElementById('share-button');
  shareButton.style.display = 'block';
  shareButton.classList.add('pulse');
  shareButton.addEventListener('click', shareResults);

  const originalImage = document.getElementById('original-image');
  originalImage.insertAdjacentElement('beforebegin', shareButton);
}

function displayTimerToggle() {
  const timerToggleContainer = document.getElementById('timer-toggle-container');
  const originalImage = document.getElementById('original-image');
  originalImage.insertAdjacentElement('afterend', timerToggleContainer);
  timerToggleContainer.style.display = 'flex';
}

function showGameStart() {
  const titleScreen = document.getElementById('title-screen');
  const puzzleScreen = document.getElementById('puzzle-screen');
  const toggleCrtButton = document.getElementById('toggle-crt');

  titleScreen.style.display = 'none';
  puzzleScreen.style.display = 'flex';
  document.getElementById('puzzle-info').style.display = 'block';

  toggleCrtButton.style.display = 'none';
}