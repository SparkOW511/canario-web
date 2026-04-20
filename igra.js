const wasteItems = [
    { name: 'Jabolčni ogrižek', emoji: '🍎', type: 'mokri' },
    { name: 'Bananin olupek', emoji: '🍌', type: 'mokri' },
    { name: 'Ostanki solate', emoji: '🥬', type: 'mokri' },
    { name: 'Jajčne lupine', emoji: '🥚', type: 'mokri' },
    { name: 'Kavna usedlina', emoji: '☕', type: 'mokri' },
    { name: 'Čajna vrečka', emoji: '🍵', type: 'mokri' },
    { name: 'Pokvarjen jogurt', emoji: '🥛', type: 'mokri' },
    { name: 'Lupine krompirja', emoji: '🥔', type: 'mokri' },
    { name: 'Plesniv kruh', emoji: '🍞', type: 'mokri' },
    { name: 'Ostanki riža', emoji: '🍚', type: 'mokri' },
    { name: 'Časopis', emoji: '📰', type: 'suhi' },
    { name: 'Kartonska škatla', emoji: '📦', type: 'suhi' },
    { name: 'Plastična steklenica', emoji: '🧴', type: 'suhi' },
    { name: 'Steklena kozarec', emoji: '🫙', type: 'suhi' },
    { name: 'Pločevinka', emoji: '🥫', type: 'suhi' },
    { name: 'Aluminijasta folija', emoji: '🔲', type: 'suhi' },
    { name: 'Papirna vrečka', emoji: '🛍️', type: 'suhi' },
    { name: 'Plastična vrečka', emoji: '🛒', type: 'suhi' },
    { name: 'Stara revija', emoji: '📖', type: 'suhi' },
    { name: 'Tetrapak', emoji: '🧃', type: 'suhi' },
];

const TOTAL_ROUNDS = 15;
const START_TIME = 30;

const arena = document.getElementById('arena');
const bins = document.getElementById('bins');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const timerEl = document.getElementById('timer');
const roundEl = document.getElementById('round');
const progressFill = document.getElementById('progressFill');
const startBtn = document.getElementById('startBtn');
const binWet = document.getElementById('binWet');
const binDry = document.getElementById('binDry');

let score = 0;
let streak = 0;
let round = 0;
let timeLeft = START_TIME;
let timerInterval = null;
let currentItem = null;
let isPlaying = false;
let itemQueue = [];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startGame() {
    score = 0;
    streak = 0;
    round = 0;
    timeLeft = START_TIME;
    isPlaying = true;
    itemQueue = shuffle(wasteItems);

    scoreEl.textContent = '0';
    streakEl.textContent = '0';
    roundEl.textContent = '0';
    progressFill.style.width = '0%';
    bins.style.display = 'grid';
    updateTimer();
    nextItem();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function nextItem() {
    if (!isPlaying) return;
    if (round >= TOTAL_ROUNDS) return endGame();

    if (itemQueue.length === 0) itemQueue = shuffle(wasteItems);
    currentItem = itemQueue.pop();
    round++;
    roundEl.textContent = round;
    progressFill.style.width = ((round - 1) / TOTAL_ROUNDS * 100) + '%';

    arena.innerHTML = `
        <div class="game__item">
            <span class="game-emoji">${currentItem.emoji}</span>
            ${currentItem.name}
        </div>
    `;
}

function handleBin(selectedType) {
    if (!isPlaying || !currentItem) return;

    const isCorrect = selectedType === currentItem.type;
    const binEl = selectedType === 'mokri' ? binWet : binDry;

    if (isCorrect) {
        streak++;
        score += 10 + (streak >= 3 ? 5 : 0);
        binEl.classList.add('correct');
    } else {
        streak = 0;
        score = Math.max(0, score - 5);
        binEl.classList.add('wrong');
    }

    scoreEl.textContent = score;
    streakEl.textContent = streak;

    setTimeout(() => {
        binEl.classList.remove('correct', 'wrong');
        nextItem();
    }, 400);
}

function endGameMessage(s) {
    if (s >= 120) return 'Odlično! Ste mojster ločevanja! ♻️';
    if (s >= 80) return 'Zelo dobro! Znanje imate. 👏';
    if (s >= 40) return 'Solidno, a lahko bolje! 💪';
    return 'Potrebujete Canario smetnjak! 😄';
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    bins.style.display = 'none';
    progressFill.style.width = '100%';

    arena.innerHTML = `
        <div class="game__over">
            <i class="fa-solid fa-trophy"></i>
            <h3>Igra končana!</h3>
            <div class="final-score">${score} točk</div>
            <p>${endGameMessage(score)}</p>
            <button class="btn btn--primary" onclick="startGame()">
                <i class="fa-solid fa-rotate-right"></i> Igraj znova
            </button>
        </div>
    `;
}

binWet.addEventListener('click', () => handleBin('mokri'));
binDry.addEventListener('click', () => handleBin('suhi'));
startBtn.addEventListener('click', startGame);
