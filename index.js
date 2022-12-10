const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//-----------------UPDATE PLAYER---------------

let moveDiraction = "";
document.addEventListener("keydown", (e) => {
    if(e.keyCode === 65) {
        moveDiraction = "left";

    } else if(e.keyCode === 68) {
        moveDiraction = "right";
    }
})

document.addEventListener("keyup", (e) => {
    if(e.keyCode === 65) {
        moveDiraction = "";
    } else if(e.keyCode === 68) {
        moveDiraction = "";
    }
})

const player = {
    x: 200,
    y: 650,
    w: 115,
    h: 85,
    dx: 6,
    score: 0,
    hp: 3,
    bullets: 5,
}


const spaceshipImg = new Image();
spaceshipImg.src = 'spaceship/ship.png'




function updateFrames(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(spaceshipImg, player.x, player.y, player.w, player.h);
}

setInterval(updateFrames, 1000 / 30);
//-----------------BULLET---------------

const bulletImg = new Image();
bulletImg.src = "bullets/bullet1.png";

let bulletsArr = [];
document.addEventListener("keypress", (e) => {
    if(e.keyCode === 32 && player.bullets > 0) {
        bulletsArr.push({
            x: player.x + 50,
            y: player.y,
            w: 20,
            h: 50,
        })
        player.bullets--;
    }
})

function moveBullets() {
    for(let i in bulletsArr) {
        bulletsArr[i].y -= 20;
    }
}

function deleteBullets() {
    for(let i in bulletsArr) {
        if(bulletsArr[i].y <= -50) {
            bulletsArr.splice(i, 1);
        }        
    }
}

function bulletsCollision() {
    if(bulletsArr.length > 0) {
        checkBulletsCollision();
    }
}

function checkBulletsCollision() {
    for(let i in bulletsArr) {
        for(let k in asteroidsArr) {
            if(bulletsArr[i].x + 20 >= asteroidsArr[k].x - 20
                && bulletsArr[i].x + 20 <= asteroidsArr[k].x + asteroidsArr[k].w
                && bulletsArr[i].y <= asteroidsArr[k].y + 20) {
                    asteroidsArr.splice(k, 1);
                }
        }
    }
}

function renderBullets() {
    for(let i in bulletsArr) {
        ctx.drawImage(bulletImg, bulletsArr[i].x, bulletsArr[i].y, bulletsArr[i].w, bulletsArr[i].h);
    }

    moveBullets();
    deleteBullets();
    bulletsCollision();
}

//-----------------BONUS BULLETS---------------

let bonusBulletImg = new Image();
bonusBulletImg.src = 'bullets/bonusBullet.png';

bulletSpawnTimer = 0;
const bullet = {
    x: getRandomInt(50, 650),
    y: 50,
    w: 50,
    h: 50,
    dy: 3,
}

function respawnBonusBullet() {
    bullet.y = getRandomInt(-1000, -1500);
    bullet.x = getRandomInt(50, 650);
}

function moveBonusBullet() {
    bullet.y += bullet.dy;
    if(bullet.y >= 750) {
        respawnBonusBullet();
    }
}

function collisionBonusBullet() {
    if(player.x <= bullet.x 
        && player.x + player.w >= bullet.x
        && player.y <= bullet.y) {
            respawnBonusBullet();
            player.bullets++;
        }
}


function renderBonusBullet() {
    ctx.drawImage(bonusBulletImg, bullet.x, bullet.y, bullet.w, bullet.h);
    moveBonusBullet();
    collisionBonusBullet();
}

//-----------------PLAYER INFO---------------

const scoreValue = document.querySelector('.scoreValue');
const hpValue = document.querySelector('.hpValue');
const bulletsValue = document.querySelector('.bulletsValue');

function updatePlayerInfo() {
    scoreValue.innerText = player.score;
    hpValue.innerText = player.hp;
    bulletsValue.innerText = player.bullets;
}

//-----------------RANDOM NUMBER---------------

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

//-----------------DELETE ASTEROIDS---------------

function deleteAsteroid() {
    for(let i in asteroidsArr) {
        if(asteroidsArr[i].y >= 770) {
            asteroidsArr.splice(i, 1);
            player.score++;
        }

        if(player.x <= asteroidsArr[i].x 
            && player.x + player.w >= asteroidsArr[i].x
            && player.y <= asteroidsArr[i].y) {
                player.hp--;
                asteroidsArr.splice(i, 1);
            }
    }
}
  
//-----------------RENDER ASTEROIDS---------------
const asteroidImg = new Image();
asteroidImg.src = 'asteroids/asteroid1.png';

let asteroidsArr = [];
let timer = 0;
  
function movement(asteroid) {
    asteroid.rotate += 0.05;
    asteroid.y += asteroid.dy;
}

function renderAsteroid() {
    timer++;
    if(timer % 40 === 0) {
        asteroidsArr.push({
            x: getRandomInt(50, canvas.width),
            y: -20,
            w: 50,
            h: 50,
            dy: getRandomInt(3, 7),
            rotate: 0,
        })
    }
    
    for(let i in asteroidsArr) {
        movement(asteroidsArr[i]);
        ctx.save();
        ctx.translate(asteroidsArr[i].x, asteroidsArr[i].y);
        ctx.rotate(asteroidsArr[i].rotate);
        ctx.drawImage(asteroidImg, -asteroidsArr[i].w/2, -asteroidsArr[i].h/2, asteroidsArr[i].w, asteroidsArr[i].h);
        ctx.restore();
    }

    deleteAsteroid();
}
  
//-----------------GAME---------------

function game() {
    update();
    render();
    requestAnimationFrame(game);
}
requestAnimationFrame(game);

function playerMove() {
    if(moveDiraction === "left") player.x -= player.dx;
    if(moveDiraction === "right") player.x += player.dx;

    if(player.x >= canvas.width - player.w) player.x = canvas.width - player.w;
    if(player.x <= 0) player.x = 0;
}

function gameOver() {
    if(player.hp === 1) {
        location.reload();
    }
}

function update() {
    playerMove();
    updatePlayerInfo();
    gameOver();
    
}

function render() {
    ctx.beginPath();
    renderAsteroid();
    renderBullets();
    renderBonusBullet();
    ctx.closePath();
}
