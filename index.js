const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//--------------PLAYER MOVEMENTS --------------
let moveDirection = "";
document.addEventListener("keydown",(e)=>{
    if(e.keyCode === 65) {
        moveDirection="left";
    }else if(e.keyCode === 68){
        moveDirection="right";
    }
});
document.addEventListener("keyup",(e)=>{
    if(e.keyCode === 65) {
        moveDirection="left";
    }else if(e.keyCode === 68){
        moveDirection="right";
    }
});



//--------------UPDATE PLAYER ---------
const player = {
    x:300,
    y:615,
    w:100,
    h:75,
    dx:7,
    score:0,
    hp:3,
    bullets:5,
}

const spaceshipImg = new Image();
spaceshipImg.src = 'spaceship/ship.png'



let i = 0;
function updateFrames(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(spaceshipImg, player.x, player.y, player.w, player.h);
}

setInterval(updateFrames, 1000 / 30);

function game(){
    update();
    render();
    requestAnimationFrame(game);
    
    if(player.x >= canvas.width-player.w) player.x = canvas.width-player.w;
    if(player.x <= 0) player.x = 0;
}
requestAnimationFrame(game);
function playerMove(){
    if(moveDirection==="left") player.x -= player.dx;
    if(moveDirection==="right") player.x += player.dx;
}
function update(){
    playerMove();
}
function render(){

}