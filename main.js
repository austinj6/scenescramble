// main.js
document.addEventListener('DOMContentLoaded', documentReadyHandler);

function documentReadyHandler() {
  initializeApp();
}

function initializeApp() {
  const titleScreen = document.getElementById('title-screen');
  const difficultyButtons = document.querySelectorAll('.difficulty-button');
  const startButton = document.getElementById('start-button');
  const timerToggle = document.getElementById('timer-toggle');
  const staticFooter = document.getElementById('puzzle-info');

  if (staticFooter) {
    staticFooter.style.display = 'none';
  }

  window.addEventListener('visibilitychange', handleVisibilityChange);

  function handleVisibilityChange() {
    const puzzleAudio = document.getElementById('puzzle-audio');
    const youGotItAudio = document.getElementById('yougotit-audio');
    const puzzleScreen = document.getElementById('puzzle-screen');
    const originalImage = document.getElementById('original-image');

    if (document.visibilityState === 'hidden') {
      puzzleAudio.pause();
      youGotItAudio.pause();
    } else {
      if (puzzleScreen.style.display !== 'none' && originalImage.style.display === 'none') {
        puzzleAudio.play();
      } else if (originalImage.style.display !== 'none') {
        youGotItAudio.play();
      }
    }
  }

  difficultyButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      difficultyButtons.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      startButton.disabled = false;
      startButton.classList.add('show', 'pulse');
    });
  });

  startButton.addEventListener('click', () => {
    const selectedDifficulty = document.querySelector('.difficulty-button.active').getAttribute('data-difficulty');
    startGame(selectedDifficulty);
  });

  if (timerToggle) {
    timerToggle.addEventListener('change', function() {
      const timerMovesContainer = document.getElementById('timer-moves-container');
      if (this.checked) {
        timerMovesContainer.style.display = 'flex';
        timerMovesContainer.style.justifyContent = 'space-between';
      } else {
        timerMovesContainer.style.display = 'none';
      }
    });
  }

  preloadPuzzleImage();
}

function preloadPuzzleImage() {
  fetch('https://worldtimeapi.org/api/ip')
    .then(response => response.json())
    .then(data => {
      const currentDate = data.datetime.slice(0, 10);
      const imageSrc = `assets/puzzles/${currentDate}.webp`;
      const img = new Image();
      img.src = imageSrc;
    })
    .catch(error => {
      console.log('Failed to fetch current date:', error);
    });
}

function startGame(difficulty) {
  const titleScreen = document.getElementById('title-screen');
  const puzzleScreen = document.getElementById('puzzle-screen');
  const puzzleInfo = document.getElementById('puzzle-info');

  titleScreen.style.display = 'none';
  puzzleScreen.style.display = 'flex';
  
  if (puzzleInfo) {
    puzzleInfo.style.display = 'block';
  }

  fetch('https://worldtimeapi.org/api/ip')
    .then(response => response.json())
    .then(data => {
      const currentDate = data.datetime.slice(0, 10);
      startPuzzle(difficulty, currentDate);
    })
    .catch(error => {
      console.log('Failed to fetch current date:', error);
    });

  initializeUI();
}