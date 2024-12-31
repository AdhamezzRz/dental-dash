const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 100, y: 100 };
let score = 0;
let playerName = '';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function startGame() {
    playerName = document.getElementById('playerName').value;
    if (!playerName) return alert('Please enter your name');
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('currentPlayer').textContent = `Player: ${playerName}`;
    generateFood();
    draw();
    setInterval(update, 150);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
    };
}

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 20, 20);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(x, y, 20, 20);
}

function drawFood() {
    const img = new Image();
    img.src = 'tooth.png';
    img.onload = () => ctx.drawImage(img, food.x, food.y, 20, 20);
}

function update() {
    const head = { x: snake[0].x + direction.x * 20, y: snake[0].y + direction.y * 20 };

    if (head.x === food.x && head.y === food.y) {
        snake.push({});
        score++;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (
        head.x < 0 || head.y < 0 || 
        head.x >= canvas.width || head.y >= canvas.height || 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        endGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => drawSquare(segment.x, segment.y, 'green'));
    drawFood();
    requestAnimationFrame(draw);
}

function endGame() {
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    document.getElementById('gameContainer').style.display = 'none';
    showLeaderboard();
}

function showLeaderboard() {
    document.getElementById('leaderboard').style.display = 'block';
    const list = document.getElementById('leaderboardList');
    list.innerHTML = leaderboard.map(entry => `<li>${entry.name}: ${entry.score}</li>`).join('');
}

function restartGame() {
    document.location.reload();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
    }
});
