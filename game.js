const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const targetNumberEl = document.getElementById('targetNumber');
const scoreEl = document.getElementById('score');
const roundMessageEl = document.getElementById('roundMessage');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverScoreEl = document.getElementById('gameOverScore');
const playAgainBtn = document.getElementById('playAgainBtn');

const SUCCESS_MESSAGES = ['Amazing!', 'Well Done!', 'Awesome!', 'Fantastic!', 'Brilliant!', 'Super!', 'Great Job!'];
const FAIL_MESSAGES_FN = (lives) => `Try Again!\n${lives} ${lives === 1 ? 'life' : 'lives'} left`;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state
const game = {
    score: 0,
    targetNumber: 0,
    unicorn: null,
    dragonGroups: [],
    particles: [],
    rainbowDust: [],
    lives: 5,
    shotsRemaining: 2,
    timeRemaining: 10,
    lastTime: Date.now(),
    showingRainbow: false,
    rainbowProgress: 0,
    fadeProgress: 0,
    isFading: false,
    gameOver: false,
    roundOver: false
};

// Unicorn (player)
class Unicorn {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.angle = 0;
        this.size = 30;
    }

    update(mouseX, mouseY) {
        // Point towards mouse
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Body (white with gradient)
        const bodyGradient = ctx.createRadialGradient(0, 0, 5, 0, 0, this.size);
        bodyGradient.addColorStop(0, '#FFFFFF');
        bodyGradient.addColorStop(1, '#E8D5F2');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head (horse-like with snout)
        ctx.fillStyle = '#FFFFFF';
        // Upper head
        ctx.beginPath();
        ctx.ellipse(this.size + 8, -5, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Snout/muzzle
        ctx.beginPath();
        ctx.ellipse(this.size + 18, 2, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nostril
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(this.size + 22, 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#4A0E4E';
        ctx.beginPath();
        ctx.arc(this.size + 10, -8, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkle in eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.size + 11, -9, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Ear
        ctx.fillStyle = '#E8D5F2';
        ctx.beginPath();
        ctx.moveTo(this.size + 5, -12);
        ctx.lineTo(this.size + 2, -18);
        ctx.lineTo(this.size + 8, -14);
        ctx.closePath();
        ctx.fill();
        
        // Horn (spiral effect) - angled forward 25 degrees
        ctx.save();
        ctx.translate(this.size + 5, -15);
        ctx.rotate(25 * Math.PI / 180); // Angle forward 25 degrees
        
        const hornGradient = ctx.createLinearGradient(0, 0, 0, -25);
        hornGradient.addColorStop(0, '#FFD700');
        hornGradient.addColorStop(0.5, '#FFA500');
        hornGradient.addColorStop(1, '#FFD700');
        ctx.fillStyle = hornGradient;
        ctx.beginPath();
        ctx.moveTo(-3, 0); // Base left
        ctx.lineTo(3, 0);  // Base right
        ctx.lineTo(0, -25); // Point
        ctx.closePath();
        ctx.fill();
        
        // Horn outline for spiral effect
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-2, -8);
        ctx.lineTo(2, -8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-1.5, -16);
        ctx.lineTo(1.5, -16);
        ctx.stroke();
        
        ctx.restore();
        
        // Mane (rainbow colors)
        const maneColors = ['#FF69B4', '#9B59D6', '#3498DB', '#2ECC71'];
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = maneColors[i];
            ctx.beginPath();
            ctx.arc(-5 - i * 3, -10 + i * 2, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Legs
        ctx.strokeStyle = '#E8D5F2';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, 10);
        ctx.lineTo(-8, 28);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, 10);
        ctx.lineTo(8, 28);
        ctx.stroke();
        
        // Hooves
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(-8, 28, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, 28, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail (flowing)
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.quadraticCurveTo(-this.size - 15, 10, -this.size - 20, 5);
        ctx.stroke();
        ctx.strokeStyle = '#9B59D6';
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.quadraticCurveTo(-this.size - 15, -10, -this.size - 20, -5);
        ctx.stroke();
        
        ctx.restore();
    }
}

// Color palette for dragon groups - each group gets a distinct color
const GROUP_COLORS = [
    { main: '#8B008B', snout: '#9B30FF', dark: '#4B0082', horn: '#6A0DAD' }, // Purple
    { main: '#B22222', snout: '#DC3545', dark: '#8B0000', horn: '#A0001C' }, // Red
    { main: '#006400', snout: '#228B22', dark: '#003300', horn: '#0B6623' }, // Green
    { main: '#00688B', snout: '#1E90FF', dark: '#003F5C', horn: '#005F87' }, // Blue
    { main: '#CC7000', snout: '#FF8C00', dark: '#8B4500', horn: '#B06000' }, // Orange
    { main: '#8B6914', snout: '#DAA520', dark: '#5C4400', horn: '#7B6010' }, // Gold
    { main: '#C71585', snout: '#FF1493', dark: '#8B0A50', horn: '#A91270' }, // Pink
    { main: '#2E8B57', snout: '#3CB371', dark: '#1B5E3B', horn: '#267349' }, // Sea green
    { main: '#4B0082', snout: '#6A5ACD', dark: '#2E004F', horn: '#3D006B' }, // Indigo
    { main: '#708090', snout: '#A9B2BD', dark: '#4A5568', horn: '#5E6D7E' }, // Slate
];

// Dragon Group (moves as a unit)
class DragonGroup {
    constructor(groupId, count) {
        this.groupId = groupId;
        this.count = count;
        this.dragons = [];
        this.centerX = 0;
        this.centerY = 0;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.isHeart = false;
        this.boundingRadius = 0;
        this.color = GROUP_COLORS[groupId % GROUP_COLORS.length];
    }

    initialize(centerX, centerY) {
        this.centerX = centerX;
        this.centerY = centerY;
        
        // Arrange dragons in dice patterns
        const positions = this.getDicePattern(this.count);
        positions.forEach(pos => {
            this.dragons.push(new Dragon(pos.x, pos.y, this.groupId, this.count, this.color));
        });

        // Compute bounding radius (max distance from center to any dragon edge)
        this.boundingRadius = 0;
        this.dragons.forEach(dragon => {
            const dist = Math.sqrt(dragon.offsetX * dragon.offsetX + dragon.offsetY * dragon.offsetY) + dragon.size;
            if (dist > this.boundingRadius) this.boundingRadius = dist;
        });
        // Add padding so groups don't touch right at their edges
        this.boundingRadius += 10;
    }

    getDicePattern(count) {
        const spacing = 50; // Increased spacing so dragons don't touch (dragon size is 20)
        
        // Standard dice patterns for 1-6
        const dicePatterns = {
            1: [{x: 0, y: 0}],
            2: [{x: -spacing/2, y: -spacing/2}, {x: spacing/2, y: spacing/2}],
            3: [{x: -spacing, y: -spacing}, {x: 0, y: 0}, {x: spacing, y: spacing}],
            4: [{x: -spacing/2, y: -spacing/2}, {x: spacing/2, y: -spacing/2}, 
                {x: -spacing/2, y: spacing/2}, {x: spacing/2, y: spacing/2}],
            5: [{x: -spacing/2, y: -spacing/2}, {x: spacing/2, y: -spacing/2}, 
                {x: 0, y: 0},
                {x: -spacing/2, y: spacing/2}, {x: spacing/2, y: spacing/2}],
            6: [{x: -spacing/2, y: -spacing}, {x: spacing/2, y: -spacing},
                {x: -spacing/2, y: 0}, {x: spacing/2, y: 0},
                {x: -spacing/2, y: spacing}, {x: spacing/2, y: spacing}]
        };
        
        if (count <= 6) {
            return dicePatterns[count];
        }
        
        // For 7-10, use two dice side by side
        const diceGap = spacing * 2;
        if (count === 7) {
            // 3 + 4
            const left = dicePatterns[3].map(p => ({x: p.x - diceGap/2, y: p.y}));
            const right = dicePatterns[4].map(p => ({x: p.x + diceGap/2, y: p.y}));
            return [...left, ...right];
        } else if (count === 8) {
            // 4 + 4
            const left = dicePatterns[4].map(p => ({x: p.x - diceGap/2, y: p.y}));
            const right = dicePatterns[4].map(p => ({x: p.x + diceGap/2, y: p.y}));
            return [...left, ...right];
        } else if (count === 9) {
            // 4 + 5
            const left = dicePatterns[4].map(p => ({x: p.x - diceGap/2, y: p.y}));
            const right = dicePatterns[5].map(p => ({x: p.x + diceGap/2, y: p.y}));
            return [...left, ...right];
        } else if (count === 10) {
            // 5 + 5
            const left = dicePatterns[5].map(p => ({x: p.x - diceGap/2, y: p.y}));
            const right = dicePatterns[5].map(p => ({x: p.x + diceGap/2, y: p.y}));
            return [...left, ...right];
        }
        
        return [];
    }

    getGroupBounds() {
        // Calculate the bounding box of the group
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        this.dragons.forEach(dragon => {
            const x = this.centerX + dragon.offsetX;
            const y = this.centerY + dragon.offsetY;
            minX = Math.min(minX, x - dragon.size);
            maxX = Math.max(maxX, x + dragon.size);
            minY = Math.min(minY, y - dragon.size);
            maxY = Math.max(maxY, y + dragon.size);
        });
        
        return { minX, maxX, minY, maxY };
    }

    update() {
        // Move the entire group together
        this.centerX += this.vx;
        this.centerY += this.vy;
        
        // Keep group on screen by checking actual bounds
        const bounds = this.getGroupBounds();
        const margin = 20;
        
        // Bounce off edges to keep entire group on screen
        if (bounds.minX < margin) {
            this.centerX += margin - bounds.minX;
            this.vx = Math.abs(this.vx);
        }
        if (bounds.maxX > canvas.width - margin) {
            this.centerX -= bounds.maxX - (canvas.width - margin);
            this.vx = -Math.abs(this.vx);
        }
        if (bounds.minY < margin) {
            this.centerY += margin - bounds.minY;
            this.vy = Math.abs(this.vy);
        }
        if (bounds.maxY > canvas.height - margin) {
            this.centerY -= bounds.maxY - (canvas.height - margin);
            this.vy = -Math.abs(this.vy);
        }
        
        // Update each dragon's position relative to center
        this.dragons.forEach(dragon => {
            dragon.update(this.centerX, this.centerY, this.isHeart);
        });
    }

    draw() {
        this.dragons.forEach(dragon => dragon.draw());
    }

    checkCollision(dust) {
        return this.dragons.some(dragon => {
            const dx = dust.x - (this.centerX + dragon.offsetX);
            const dy = dust.y - (this.centerY + dragon.offsetY);
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < dragon.size + dust.size;
        });
    }

    turnToHearts() {
        this.isHeart = true;
        this.dragons.forEach(dragon => {
            dragon.isHeart = true;
            for (let i = 0; i < 10; i++) {
                game.particles.push(new Particle(
                    this.centerX + dragon.offsetX,
                    this.centerY + dragon.offsetY,
                    '#FFD700'
                ));
            }
        });
    }
}

// Dragon
class Dragon {
    constructor(offsetX, offsetY, groupId, groupSize, color) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.x = 0;
        this.y = 0;
        this.size = 20;
        this.groupId = groupId;
        this.groupSize = groupSize;
        this.color = color;
        this.isHeart = false;
        this.alpha = 1;
        this.floatOffset = 0;
    }

    update(centerX, centerY, isHeart) {
        this.x = centerX + this.offsetX;
        this.y = centerY + this.offsetY;
        
        // If heart, fade out and drift up
        if (isHeart) {
            this.floatOffset -= 2;
            this.alpha -= 0.015;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        if (this.isHeart) {
            this.drawHeart();
        } else {
            this.drawDragon();
        }
        
        ctx.restore();
    }

    drawDragon() {
        // Main head
        ctx.fillStyle = this.color.main;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = this.color.snout;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size * 0.5, this.size * 0.6, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nostrils
        ctx.fillStyle = this.color.dark;
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y + this.size * 0.5, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y + this.size * 0.5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Fire from nostrils (animated)
        const fireOffset = Math.sin(Date.now() * 0.01 + this.x) * 2;
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y + this.size * 0.5 + 4 + fireOffset, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y + this.size * 0.5 + 4 + fireOffset, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Fire glow
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y + this.size * 0.5 + 5 + fireOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y + this.size * 0.5 + 5 + fireOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes (red and menacing)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.ellipse(this.x - 8, this.y - 3, 4, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 8, this.y - 3, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye pupils (slits)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(this.x - 8, this.y - 3, 1, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 8, this.y - 3, 1, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Horns/Ears (pointed)
        ctx.fillStyle = this.color.horn;
        ctx.beginPath();
        ctx.moveTo(this.x - 12, this.y - 10);
        ctx.lineTo(this.x - 16, this.y - 20);
        ctx.lineTo(this.x - 8, this.y - 12);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y - 10);
        ctx.lineTo(this.x + 16, this.y - 20);
        ctx.lineTo(this.x + 8, this.y - 12);
        ctx.closePath();
        ctx.fill();

        // Scales on forehead
        ctx.strokeStyle = this.color.horn;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y - 8, 3, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 6, 2, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y - 6, 2, 0, Math.PI);
        ctx.stroke();
    }

    drawHeart() {
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        const x = this.x;
        const y = this.y + this.floatOffset;
        const size = this.size;
        
        ctx.moveTo(x, y + size / 4);
        ctx.bezierCurveTo(x, y - size / 4, x - size, y - size / 4, x - size, y + size / 4);
        ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 1.5);
        ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size / 4);
        ctx.bezierCurveTo(x + size, y - size / 4, x, y - size / 4, x, y + size / 4);
        ctx.fill();
    }
}

// Rainbow dust particle
class RainbowDust {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * 8;
        this.vy = Math.sin(angle) * 8;
        this.life = 60;
        this.maxLife = 60;
        this.size = 5;
        this.hue = Math.random() * 360;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Particle effect
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.life = 30;
        this.color = color;
        this.size = Math.random() * 3 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 30;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function showRoundMessage(text, isSuccess) {
    roundMessageEl.textContent = text;
    roundMessageEl.className = 'round-message ' + (isSuccess ? 'show-success' : 'show-fail');
}

function hideRoundMessage() {
    roundMessageEl.className = 'round-message hide';
}

function popInTargetNumber() {
    targetNumberEl.className = 'target-number pop-in';
}

function fadeOutTargetNumber() {
    targetNumberEl.className = 'target-number fade-out';
}

// Create dragon groups
function createDragonGroups() {
    game.dragonGroups = [];
    game.shotsRemaining = 2;
    game.timeRemaining = 20;
    game.lastTime = Date.now();
    game.roundOver = false;
    
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const numGroups = Math.min(3 + Math.floor(game.score / 50), 5);
    const selectedNumbers = [];
    
    // Shuffle and pick unique numbers
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    for (let i = 0; i < numGroups; i++) {
        selectedNumbers.push(shuffled[i]);
    }
    
    game.targetNumber = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)];
    targetNumberEl.textContent = game.targetNumber;
    popInTargetNumber();
    hideRoundMessage();
    
    selectedNumbers.forEach((count, groupId) => {
        const angle = (groupId / numGroups) * Math.PI * 2;
        const distance = 250 + Math.random() * 150;
        const centerX = canvas.width / 2 + Math.cos(angle) * distance;
        const centerY = canvas.height / 2 + Math.sin(angle) * distance;
        
        const group = new DragonGroup(groupId, count);
        group.initialize(centerX, centerY);
        game.dragonGroups.push(group);
    });
}

// Shoot rainbow dust (spray of particles)
function shootRainbowDust() {
    // Shoot 3 particles in a small spread for better coverage
    for (let i = -1; i <= 1; i++) {
        const spreadAngle = game.unicorn.angle + (i * 0.1);
        const dust = new RainbowDust(game.unicorn.x, game.unicorn.y, spreadAngle);
        game.rainbowDust.push(dust);
    }
}

// Check if group was hit
function checkGroupHit(group) {
    if (group.isHeart || game.gameOver) return;
    
    game.shotsRemaining--;
    
    if (group.count === game.targetNumber) {
        // Correct! Calculate score with time bonus
        game.roundOver = true;
        const roundScore = Math.ceil(game.timeRemaining) + group.count * 10;
        game.score += roundScore;
        scoreEl.textContent = `Score: ${game.score}`;

        game.dragonGroups.forEach(g => g.turnToHearts());
        fadeOutTargetNumber();
        const msg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
        showRoundMessage(msg, true);

        // Show rainbow animation
        game.showingRainbow = true;
        game.rainbowProgress = 0;

        // After 1 second, start fade
        setTimeout(() => {
            game.showingRainbow = false;
            game.isFading = true;
            game.fadeProgress = 0;
        }, 1000);

        // After 3 seconds total (1s rainbow + 2s fade), start new round
        setTimeout(() => {
            game.isFading = false;
            createDragonGroups();
        }, 3000);
    } else {
        // Wrong!
        group.dragons.forEach(dragon => {
            for (let i = 0; i < 5; i++) {
                game.particles.push(new Particle(
                    group.centerX + dragon.offsetX,
                    group.centerY + dragon.offsetY,
                    '#FF0000'
                ));
            }
        });
        
        // Check if out of shots
        if (game.shotsRemaining <= 0) {
            game.roundOver = true;
            game.lives--;
            updateLivesDisplay();
            fadeOutTargetNumber();

            if (game.lives <= 0) {
                gameOver();
            } else {
                showRoundMessage(FAIL_MESSAGES_FN(game.lives), false);
                setTimeout(() => {
                    createDragonGroups();
                }, 2000);
            }
        }
    }
}

function gameOver() {
    game.gameOver = true;
    fadeOutTargetNumber();
    hideRoundMessage();
    gameOverScoreEl.textContent = `Final Score: ${game.score}`;
    setTimeout(() => {
        gameOverScreen.classList.add('visible');
    }, 500);
}

playAgainBtn.addEventListener('click', () => {
    game.score = 0;
    game.lives = 5;
    game.gameOver = false;
    scoreEl.textContent = 'Score: 0';
    updateLivesDisplay();
    gameOverScreen.classList.remove('visible');
    createDragonGroups();
});

function updateLivesDisplay() {
    const livesEl = document.getElementById('lives');
    livesEl.textContent = '❤️'.repeat(game.lives);
}

function updateTimer() {
    if (game.showingRainbow || game.isFading || game.gameOver) return;
    
    const now = Date.now();
    const delta = (now - game.lastTime) / 1000;
    game.lastTime = now;
    
    game.timeRemaining -= delta;
    
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `Time: ${Math.ceil(Math.max(0, game.timeRemaining))}s`;
    
    if (game.timeRemaining <= 0 && !game.roundOver) {
        // Time's up! Mark round as over so this only fires once
        game.roundOver = true;
        game.lives--;
        updateLivesDisplay();
        fadeOutTargetNumber();

        if (game.lives <= 0) {
            gameOver();
        } else {
            showRoundMessage(FAIL_MESSAGES_FN(game.lives), false);
            setTimeout(() => {
                createDragonGroups();
            }, 2000);
        }
    }
}

function drawRainbow() {
    if (!game.showingRainbow) return;
    
    game.rainbowProgress += 0.02; // Full brightness for 1 second
    
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    const arcWidth = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height + 100;
    
    ctx.save();
    ctx.globalAlpha = 1; // Full brightness
    
    for (let i = 0; i < colors.length; i++) {
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = arcWidth;
        ctx.beginPath();
        const radius = 300 + i * arcWidth;
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawFade() {
    if (!game.isFading) return;
    
    game.fadeProgress += 0.01; // 2 second fade
    
    ctx.save();
    ctx.fillStyle = '#0a0a0a';
    ctx.globalAlpha = Math.min(1, game.fadeProgress);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// Resolve collisions between dragon groups so they bounce off each other
function resolveGroupCollisions() {
    const groups = game.dragonGroups;
    for (let i = 0; i < groups.length; i++) {
        for (let j = i + 1; j < groups.length; j++) {
            const a = groups[i];
            const b = groups[j];
            if (a.isHeart || b.isHeart) continue;

            const dx = b.centerX - a.centerX;
            const dy = b.centerY - a.centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = a.boundingRadius + b.boundingRadius;

            if (dist < minDist && dist > 0) {
                // Normalize collision axis
                const nx = dx / dist;
                const ny = dy / dist;

                // Push groups apart so they no longer overlap
                const overlap = minDist - dist;
                a.centerX -= nx * overlap / 2;
                a.centerY -= ny * overlap / 2;
                b.centerX += nx * overlap / 2;
                b.centerY += ny * overlap / 2;

                // Reflect velocities along the collision axis
                const relVx = a.vx - b.vx;
                const relVy = a.vy - b.vy;
                const dot = relVx * nx + relVy * ny;

                // Only resolve if groups are moving toward each other
                if (dot > 0) {
                    a.vx -= dot * nx;
                    a.vy -= dot * ny;
                    b.vx += dot * nx;
                    b.vy += dot * ny;
                }
            }
        }
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update timer
    updateTimer();
    
    // Handle shooting
    handleShooting();
    
    // Update and draw unicorn
    if (!game.gameOver) {
        game.unicorn.draw();
    }
    
    // Bounce dragon groups off each other
    resolveGroupCollisions();

    // Update and draw dragon groups
    game.dragonGroups = game.dragonGroups.filter(group => {
        group.update();
        group.draw();
        return group.dragons[0].alpha > 0;
    });
    
    // Update and draw rainbow dust
    game.rainbowDust = game.rainbowDust.filter(dust => {
        dust.update();
        dust.draw();
        
        // Check collisions with groups
        if (!game.showingRainbow && !game.isFading) {
            game.dragonGroups.forEach(group => {
                if (!group.isHeart && group.checkCollision(dust)) {
                    checkGroupHit(group);
                    dust.life = 0;
                }
            });
        }
        
        return dust.life > 0;
    });
    
    // Update and draw particles
    game.particles = game.particles.filter(particle => {
        particle.update();
        particle.draw();
        return particle.life > 0;
    });
    
    // Draw rainbow animation
    drawRainbow();
    
    // Draw fade overlay
    drawFade();
    
    requestAnimationFrame(gameLoop);
}

// Mouse tracking
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    game.unicorn.update(mouseX, mouseY);
});

// Shooting controls
let isMouseDown = false;
let shootCooldown = 0;

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    game.unicorn.update(mouseX, mouseY);
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Touch controls for mobile - tap to select a cluster directly
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (game.showingRainbow || game.isFading || game.gameOver || game.roundOver) return;

    const touch = e.touches[0];
    const tapX = touch.clientX;
    const tapY = touch.clientY;

    // Update unicorn to face tap position
    mouseX = tapX;
    mouseY = tapY;
    game.unicorn.update(mouseX, mouseY);

    // Check if tap landed on a dragon group
    for (const group of game.dragonGroups) {
        if (group.isHeart) continue;
        const dx = tapX - group.centerX;
        const dy = tapY - group.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < group.boundingRadius) {
            checkGroupHit(group);
            return;
        }
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
});

// Auto-shoot when mouse/touch is held down
function handleShooting() {
    if (isMouseDown && shootCooldown <= 0) {
        shootRainbowDust();
        shootCooldown = 10; // Cooldown frames between shots
    }
    if (shootCooldown > 0) {
        shootCooldown--;
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Initialize game
game.unicorn = new Unicorn();
updateLivesDisplay();
createDragonGroups();
gameLoop();
