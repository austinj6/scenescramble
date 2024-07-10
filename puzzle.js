let completionTime;

function startPuzzle(difficulty, currentDate) {
  const validDifficulties = ['easy', 'medium', 'hard', 'extreme'];
  if (!validDifficulties.includes(difficulty)) {
    throw new Error('Invalid difficulty level');
  }

  const puzzleContainer = document.getElementById('puzzle-container');
  const imageSrc = `assets/puzzles/${currentDate}.webp`;
  let gridSize;
  switch (difficulty) {
    case 'easy':
      gridSize = 3;
      break;
    case 'medium':
      gridSize = 4;
      break;
    case 'hard':
      gridSize = 5;
      break;
    case 'extreme':
      gridSize = 6;
      break;
  }

  const correctOrder = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  const firstSong = document.getElementById('puzzle-audio');
  const pieceSize = Math.floor(puzzleContainer.clientWidth / gridSize);

  let startTime;
  let timerInterval;
  let moves = 0;

  function createPiece(index) {
    const piece = document.createElement('div');
    piece.id = index;
    piece.className = 'puzzle-piece';
    piece.style.backgroundImage = `url(${imageSrc})`;
    piece.style.backgroundSize = `${puzzleContainer.clientWidth}px ${puzzleContainer.clientWidth}px`;
    piece.style.backgroundPosition = `-${(index % gridSize) * pieceSize}px -${Math.floor(index / gridSize) * pieceSize}px`;
    piece.style.width = `${pieceSize}px`;
    piece.style.height = `${pieceSize}px`;
    piece.setAttribute('draggable', 'true');
    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('dragover', handleDragOver);
    piece.addEventListener('drop', handleDrop);
    piece.addEventListener('touchstart', handleTouchStart, false);
    piece.addEventListener('touchmove', handleTouchMove, false);
    piece.addEventListener('touchend', handleTouchEnd, false);
    return piece;
  }

  function createPuzzlePieces() {
   const pieces = [];
   for (let i = 0; i < gridSize * gridSize; i++) {
     const piece = createPiece(i);
     pieces.push(piece);
   }
   return pieces;
 }

 function startGame() {
   puzzleContainer.innerHTML = '';
   puzzleContainer.classList.remove('medium', 'hard', 'extreme');
   puzzleContainer.classList.add(difficulty);

   const puzzleWrapper = document.getElementById('puzzle-wrapper');
   const maxSize = Math.min(puzzleWrapper.clientWidth, puzzleWrapper.clientHeight);
   puzzleContainer.style.width = `${maxSize}px`;
   puzzleContainer.style.height = `${maxSize}px`;

   const pieceSize = Math.floor(maxSize / gridSize);
   puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
   puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;

   const pieces = createPuzzlePieces();
   shuffleArray(pieces);
   pieces.forEach(piece => puzzleContainer.appendChild(piece));
   startTimer();

   const timerElement = document.getElementById('timer');
   const movesElement = document.getElementById('moves');

   timerElement.innerHTML = 'Time:<br>00:00';
   movesElement.innerHTML = 'Moves:<br>0';

   const timerMovesContainer = document.getElementById('timer-moves-container');
   timerMovesContainer.style.display = 'none';
 }

 function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [array[i], array[j]] = [array[j], array[i]];
   }
 }

 function startTimer() {
   startTime = Date.now();
   timerInterval = setInterval(updateTimer, 1000);
 }

 function stopTimer() {
   clearInterval(timerInterval);
 }

 function updateTimer() {
   const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
   updateTimerDisplay(elapsedTime);
 }

 function incrementMoves() {
   moves++;
   updateMovesDisplay(moves);
 }

 function setupPuzzleListeners() {
   const puzzlePieces = document.querySelectorAll('.puzzle-piece');
   puzzlePieces.forEach(piece => {
     piece.addEventListener('dragstart', handleDragStart);
     piece.addEventListener('dragover', handleDragOver);
     piece.addEventListener('drop', handleDrop);
     piece.addEventListener('dragend', handleDragEnd);
   });
 }

 function handleDragStart(e) {
   e.dataTransfer.setData('text/plain', e.target.id);
   e.target.style.opacity = '0.5';
 }

 function handleDragOver(e) {
   e.preventDefault();
 }

 function handleDrop(e) {
   e.preventDefault();
   const draggedId = e.dataTransfer.getData('text/plain');
   const draggedElement = document.getElementById(draggedId);
   const targetElement = e.target;
   swapPieces(draggedElement, targetElement);
   incrementMoves();
   checkPuzzleCompletion();
 }

 function handleDragEnd(e) {
   e.target.style.opacity = '1';
 }

 function handleTouchStart(e) {
   const touch = e.touches[0];
   const piece = e.target;
   piece.style.opacity = '0.5';
   piece.setAttribute('data-start-x', touch.pageX);
   piece.setAttribute('data-start-y', touch.pageY);
 }

 function handleTouchMove(e) {
   e.preventDefault();
   const touch = e.touches[0];
   const piece = e.target;
   const startX = parseInt(piece.getAttribute('data-start-x'), 10);
   const startY = parseInt(piece.getAttribute('data-start-y'), 10);
   const dx = touch.pageX - startX;
   const dy = touch.pageY - startY;
   piece.style.transform = `translate(${dx}px, ${dy}px)`;
   piece.style.zIndex = 1000;
 }

 function handleTouchEnd(e) {
  const piece = e.target;
  piece.style.opacity = '1';
  piece.style.zIndex = '';
  piece.style.transform = '';

  const touch = e.changedTouches[0];
  const endX = touch.clientX;
  const endY = touch.clientY;

  const target = document.elementFromPoint(endX, endY);
  if (target && target.classList.contains('puzzle-piece')) {
    swapPieces(target, piece);
    incrementMoves();
    checkPuzzleCompletion();
  } else {
    piece.style.left = '';
    piece.style.top = '';
  }
}

function swapPieces(draggedElement, targetElement) {
  const tempBackgroundPosition = draggedElement.style.backgroundPosition;
  draggedElement.style.backgroundPosition = targetElement.style.backgroundPosition;
  targetElement.style.backgroundPosition = tempBackgroundPosition;

  const tempId = draggedElement.id;
  draggedElement.id = targetElement.id;
  targetElement.id = tempId;
}

function checkPuzzleCompletion() {
  const puzzlePieces = document.querySelectorAll('.puzzle-piece');
  const currentOrder = Array.from(puzzlePieces).map(piece => Number(piece.id));
  if (currentOrder.every((value, index) => value === correctOrder[index])) {
    displayYouDidItButton();
    stopTimer();
    completionTime = Date.now();
  }
}

function displayYouDidItButton() {
  const puzzleDescription = document.querySelector('.puzzle-description');
  puzzleDescription.style.display = 'none';

  const youDidItButton = document.getElementById('you-did-it-button');
  youDidItButton.style.display = 'block';
  youDidItButton.classList.add('pulse');
  youDidItButton.addEventListener('click', () => {
    youDidItButton.style.display = 'none';
    puzzleContainer.style.display = 'none';
    handlePuzzleCompletion(currentDate);
  });
}

function handlePuzzleCompletion(currentDate) {
  displayOriginalImage(currentDate, imageSrc);
  displayShareButton();
  displayTimerToggle();
}

function displayOriginalImage(currentDate, imageSrc) {
  const puzzlePieces = document.querySelectorAll('.puzzle-piece');
  puzzlePieces.forEach(piece => {
    piece.removeEventListener('dragstart', handleDragStart);
    piece.removeEventListener('dragover', handleDragOver);
    piece.removeEventListener('drop', handleDrop);
    piece.removeEventListener('dragend', handleDragEnd);
  });

  const puzzleWrapper = document.getElementById('puzzle-wrapper');
  puzzleWrapper.style.display = 'none';

  const originalImage = document.getElementById('original-image');
  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = 'Original Image';
  originalImage.innerHTML = '';
  originalImage.appendChild(img);
  originalImage.style.display = 'block';
  originalImage.classList.add('show');

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  const logoContainer = document.querySelector('.logo-container');
  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.uptv.com/';
  logoLink.innerHTML = logoContainer.innerHTML;
  logoContainer.innerHTML = '';
  logoContainer.appendChild(logoLink);

  const timerElement = document.getElementById('timer');
  const elapsedTime = Math.floor((completionTime - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timerElement.innerHTML = `Time:<br>${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const timerMovesContainer = document.getElementById('timer-moves-container');
  const timerToggle = document.getElementById('timer-toggle');

  if (timerToggle.checked) {
    timerMovesContainer.style.display = 'flex';
    timerMovesContainer.style.justifyContent = 'space-between';
  } else {
    timerMovesContainer.style.display = 'none';
  }
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

function generateResultsMessage() {
  const elapsedTime = Math.floor((completionTime - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return `UPtv Scene Scramble

💡 Difficulty: ${difficulty}

⏰ Time: ${timeString}

🧩 Moves: ${moves}
`;
}

function shareResults() {
 const resultsMessage = generateResultsMessage();
 const shareData = {
   title: 'Scene Scramble - My Results',
   text: resultsMessage,
 };

 if (navigator.share) {
   navigator.share(shareData)
     .then(() => {
       console.log('Results shared successfully');
     })
     .catch((error) => {
       console.error('Error sharing results:', error);
       fallbackSharing(resultsMessage);
     });
 } else {
   fallbackSharing(resultsMessage);
 }
}

function fallbackSharing(resultsMessage) {
 copyToClipboard(resultsMessage);
 alert('Your results have been copied to the clipboard!');
}

function copyToClipboard(text) {
 const tempInput = document.createElement('textarea');
 tempInput.value = text;
 document.body.appendChild(tempInput);
 tempInput.select();
 document.execCommand('copy');
 document.body.removeChild(tempInput);
}

startGame();
setupPuzzleListeners();
}

function updatePuzzleInfo(currentDate) {
const puzzleInfo = document.getElementById('puzzle-info');
if (puzzleInfo) {
  puzzleInfo.innerHTML = 'A UPtv Game';
}
}