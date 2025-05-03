const player = document.getElementById('player');
const gameZone = document.getElementById('gameZone');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const timerElement = document.getElementById('timer');
const step = 30;
const intervals = [];
let score = 0;
let playerLives = 3;
let gameStatus = false;
let playerRect = null;
let gameZoneRect = null;
let gameTimer = 60;
let remainingShots = 30;
const winningScore = 200;

const loadLeaderboard = () => {
    return JSON.parse(localStorage.getItem('spaceInvadersLeaderboard')) || [];
};

const saveLeaderboard = (leaderboard) => {
    localStorage.setItem('spaceInvadersLeaderboard', JSON.stringify(leaderboard));
};

const addScoreToLeaderboard = (playerName, playerScore, timeLeft) => {
    const leaderboard = loadLeaderboard();

    const newRecord = {
        name: playerName,
        score: playerScore,
        timeLeft: timeLeft,
        date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    };

    leaderboard.push(newRecord);

    leaderboard.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score;
        } else {
            return b.timeLeft - a.timeLeft;
        }
    });

    if (leaderboard.length > 10) {
        leaderboard.splice(10);
    }

    saveLeaderboard(leaderboard);
    displayLeaderboard();
};

const displayLeaderboard = () => {
    const leaderboard = loadLeaderboard();
    const leaderboardBody = document.getElementById('leaderboard-body');

    leaderboardBody.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;

        const nameCell = document.createElement('td');
        nameCell.textContent = entry.name;

        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score;

        const timeCell = document.createElement('td');
        timeCell.textContent = entry.timeLeft + ' s';

        const dateCell = document.createElement('td');
        dateCell.textContent = entry.date;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        row.appendChild(timeCell);
        row.appendChild(dateCell);

        leaderboardBody.appendChild(row);
    });
};

const showNameInputModal = () => {
    const modal = document.createElement('div');
    modal.classList.add('name-modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('name-modal-content');

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'You won!';

    const scoreInfo = document.createElement('p');
    scoreInfo.textContent = `Score: ${score} - Time left: ${gameTimer}s`;

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Enter your name';
    nameInput.maxLength = 15;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Save Score';
    submitButton.addEventListener('click', () => {
        const playerName = nameInput.value.trim() || 'Anonymous';
        addScoreToLeaderboard(playerName, score, gameTimer);
        modal.remove();
        window.location.reload();
    });

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(scoreInfo);
    modalContent.appendChild(nameInput);
    modalContent.appendChild(submitButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    nameInput.focus();
};

// Create shots display element
const createShotsDisplay = () => {
    const shotsElement = document.createElement('div');
    shotsElement.id = 'shots';
    shotsElement.classList.add('shots-display');
    shotsElement.textContent = `Shots: ${remainingShots}`;
    gameZone.appendChild(shotsElement);
};

// Update shots display
const updateShotsDisplay = () => {
    const shotsElement = document.getElementById('shots');
    if (shotsElement) {
        shotsElement.textContent = `Shots: ${remainingShots}`;
    }
};

// Creating player lives
const createLivesDisplay = () => {
    const livesContainer = document.createElement('div');
    livesContainer.classList.add('lives-container');

    for (let i = 0; i < 3; i++) {
        const life = document.createElement('div');
        life.classList.add('life');
        life.id = `life-${i}`;
        livesContainer.appendChild(life);
    }

    gameZone.appendChild(livesContainer);
};

// Update life display
const updateLivesDisplay = () => {
    for (let i = 0; i < 3; i++) {
        const life = document.getElementById(`life-${i}`);
        if (i >= playerLives) {
            life.classList.add('lost');
        }
    }
};

// Start and update countdown timer
const startTimer = () => {
    timerElement.classList.remove('hidden');

    const timerInterval = setInterval(() => {
        if (!gameStatus) {
            clearInterval(timerInterval);
            return;
        }

        gameTimer--;
        timerElement.textContent = `Time: ${gameTimer} s`;

        if (gameTimer <= 0) {
            clearInterval(timerInterval);
            endGame('noTime');
        }
    }, 1000);

    intervals.push(timerInterval);
};

// Generic function for ending the game with different types of endings
const endGame = (endType) => {
    gameStatus = false;
    stopAllIntervals();

    const mainText = document.createElement('div');
    mainText.classList.add('gameOverText');

    switch (endType) {
        case 'collision':
            playerLives = 0;
            updateLivesDisplay();
            player.style.backgroundImage = "url('assets/images/explosion.png')";
            mainText.textContent = 'Game Over';
            break;
        case 'noTime':
            mainText.textContent = 'Time is Over!';
            break;
        case 'noShots':
            mainText.textContent = 'No More Shots!';
            mainText.style.fontSize = '60px';
            break;
        case 'victory':
            // Pour la victoire, on affiche le modal de saisie du nom
            showNameInputModal();
            return;
    }

    const scoreText = document.createElement('div');
    scoreText.classList.add('victorySubtitle');
    scoreText.style.color = 'white';
    scoreText.style.marginTop = '20px';
    scoreText.textContent = `Your score: ${score}`;

    const retryButton = document.createElement('button');
    retryButton.classList.add('retryButton');
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => {
        window.location.reload();
    });

    gameZone.appendChild(mainText);
    gameZone.appendChild(scoreText);
    gameZone.appendChild(retryButton);
};

//Initializes the game by setting up necessary events (start button, player movement) and starts collision checking.
const initGame = () => {
    updateRects();
    startButton.addEventListener('click', startGame);
    document.addEventListener('keydown', handlePlayerMovement);
    startCollisionCheck();
    displayLeaderboard(); // Charger le leaderboard au démarrage
};

//Updates the dimensions and positions of the player and the game zone.
const updateRects = () => {
    playerRect = player.getBoundingClientRect();
    gameZoneRect = gameZone.getBoundingClientRect();
};

//Starts the game by hiding the start screen, showing the game zone, and initiating enemy spawning.
const startGame = () => {
    const gameImage = document.getElementById('gameImage');
    const leaderboardContainer = document.getElementById('leaderboard-container');

    gameImage.classList.add('hidden');
    leaderboardContainer.classList.add('hidden');
    startButton.classList.add('hidden');
    gameZone.classList.remove('hidden');
    gameStatus = true;
    playerLives = 3;
    gameTimer = 60;
    remainingShots = 30;

    createLivesDisplay();
    createShotsDisplay();
    startTimer();
    startCollisionCheck();
    const spawnEnemiesInterval = setInterval(() => {
        if (!gameStatus) {
            clearInterval(spawnEnemiesInterval);
            return;
        }
        let speed = getRandomInt(1, 15);
        spawnEnemy(speed);
    }, 3000);

    intervals.push(spawnEnemiesInterval);
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Updates the player's score and checks if the score reaches the victory threshold.
const updateScore = (points) => {
    score += points;
    scoreElement.textContent = 'Score: ' + score;
    if (score >= winningScore) {
        endGame('victory');
    }
};

const stopAllIntervals = () => {
    intervals.forEach(clearInterval);
    intervals.length = 0;
};

const checkCollision = (rect1, rect2) => {
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
};

const checkPlayerCollision = () => {
    const enemies = document.querySelectorAll('.enemy');
    for (const enemy of enemies) {
        const enemyRect = enemy.getBoundingClientRect();
        if (checkCollision(playerRect, enemyRect)) {
            enemy.remove();
            endGame('collision');
            break;
        }
    }
};

//Starts an interval to regularly check for collisions between the player and enemies.
const startCollisionCheck = () => {
    const collisionInterval = setInterval(() => {
        if (!gameStatus) {
            clearInterval(collisionInterval);
            return;
        }
        updateRects();
        checkPlayerCollision();
    }, 30);
    intervals.push(collisionInterval);
};

//Handles player movement based on key presses (arrow keys or z, q, s, d) and allows firing missiles.
const handlePlayerMovement = (event) => {
    if (!gameStatus) return;
    switch (event.key) {
        case 'ArrowUp':
        case 'z':
            if (playerRect.top > gameZoneRect.top) {
                player.style.top = player.offsetTop - step + 'px';
            }
            break;
        case 'ArrowLeft':
        case 'q':
            if (playerRect.left > gameZoneRect.left) {
                player.style.left = player.offsetLeft - step + 'px';
            }
            break;
        case 'ArrowDown':
        case 's':
            if (playerRect.bottom < gameZoneRect.bottom) {
                player.style.top = player.offsetTop + step + 'px';
            }
            break;
        case 'ArrowRight':
        case 'd':
            if (playerRect.right < gameZoneRect.right) {
                player.style.left = player.offsetLeft + step + 'px';
            }
            break;
        case ' ':
            if (remainingShots > 0) {
                createMissile();
                remainingShots--;
                updateShotsDisplay();

                if (remainingShots === 0) {
                    endGame('noShots');
                }
            }
            break;
    }
    updateRects();
};

//Creates a missile fired by the player and manages its movement and collisions with enemies.
const createMissile = () => {
    const missile = document.createElement('div');
    missile.classList.add('missile');
    gameZone.appendChild(missile);
    missile.style.left = playerRect.left + playerRect.width / 2 - 5 + 'px';
    missile.style.top = playerRect.top - 10 + 'px';

    const missileInterval = setInterval(() => {
        const missileRect = missile.getBoundingClientRect();
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {
            const enemyRect = enemy.getBoundingClientRect();
            if (checkCollision(missileRect, enemyRect)) {
                const points = parseInt(enemy.dataset.points, 10);
                updateScore(points);
                enemy.remove();
                missile.remove();
                clearInterval(missileInterval);
            }
        });
        if (missileRect.top <= gameZoneRect.top) {
            missile.remove();
            clearInterval(missileInterval);
        } else {
            missile.style.top = missile.offsetTop - 20 + 'px';
        }
    }, 30);
    intervals.push(missileInterval);
};

//Spawns a random enemy in the game zone and manages its downward movement.
const spawnEnemy = (speed) => {
    const enemy = document.createElement('img');

    const randomValue = Math.random();
    let selectedEnemy;

    if (randomValue < 0.15) {
        selectedEnemy = {
            imagePath: 'assets/images/deathStars.png',
            points: 20
        };
    } else {
        const chasserType = Math.random() < 0.5 ? 'chasser1.png' : 'chasser2.png';
        selectedEnemy = {
            imagePath: `assets/images/${chasserType}`,
            points: 10
        };
    }

    enemy.src = selectedEnemy.imagePath;
    enemy.dataset.points = selectedEnemy.points;
    enemy.classList.add('enemy');
    gameZone.appendChild(enemy);

    const startX = Math.random() * (gameZoneRect.width - 50);
    enemy.style.left = startX + 'px';
    enemy.style.top = '0px';

    const moveInterval = setInterval(() => {
        if (!gameStatus) {
            clearInterval(moveInterval);
            return;
        }
        const enemyRect = enemy.getBoundingClientRect();
        const currentTop = enemy.offsetTop;
        const randomHorizontalShift = (Math.random() - 0.5) * 10;

        if (enemyRect.bottom >= gameZoneRect.bottom) {
            enemy.remove();
            clearInterval(moveInterval);
            playerLives--;
            updateLivesDisplay();
            if (playerLives <= 0) {
                endGame('collision');
            }
        } else {
            enemy.style.top = currentTop + speed + 'px';
            enemy.style.left = enemy.offsetLeft + randomHorizontalShift + 'px';
        }
    }, 30);
    intervals.push(moveInterval);
};

initGame();