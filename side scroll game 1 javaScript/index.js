import playerSprite from "./js/classes/playerSprite.js";
import Sprite from "./js/classes/Sprite.js";
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const keys = {
    // LATERAL MOVEMENTS
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    // VERTICAL MOVEMENTS
    w:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    }
};

canvasContext.fillRect(0,0, canvas.width, canvas.height);

const background = new Sprite({
    position:{x:0, y:0}, 
    imgSrc:'./imgs/background_layer_1.jpeg'}
);

const backgroundAnimation = new Sprite({
    position:{x:600, y:208}, 
    imgSrc:'./imgs/shop_anim.png',
    scale: 2.5,
    totalFrames: 6
});

const player1 = new playerSprite({
    position:{
        x:0,
        y:0
    },
    offset:{
        x: 0,
        y: 0
    },
    velocity:{
        x:0,
        y:0
    }
});

const player2 = new playerSprite({
    position:{
        x:400,
        y:100
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x: -50,
        y: 0
    },
    color: 'yellow'
});
var time = 99;

function showGameOverMessage(player1, player2, timerId){
    clearTimeout(timerId);
    let message = document.querySelector('#gameOverMessage');
    message.style.display = 'flex';
    if(player1.currentHealth() === player2.currentHealth()){
        message.innerText = 'Tie';
    }else if(player1.currentHealth() > player2.currentHealth()){
        message.innerText = 'Player 1 wins';
    }else{
        message.innerText = 'Player 2 wins';
    }
}
let timerId = 0;
function countDown(){
    if(time > 0){
        timerId = setTimeout(countDown, 1000);
        time--;
        document.querySelector('#timer').innerText = time;
    }else{
        showGameOverMessage(player1, player2, timerId);
    }
}
countDown();
function animate(){
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0,0,canvas.width, canvas.height);
    
    background.update(canvasContext);
    backgroundAnimation.update(canvasContext);
    player1.update(canvasContext, canvas.height);
    player2.update(canvasContext, canvas.height);
    player1.stop();
    player2.stop();
    if(keys.a.pressed && player1.lastKeyPressed == 'a'){
        player1.velocity.x = -5;
    }else if(keys.d.pressed && player1.lastKeyPressed == 'd'){
        player1.velocity.x = 5;
    }

    if(keys.ArrowLeft.pressed && player2.lastKeyPressed == 'ArrowLeft'){
        player2.velocity.x = -5;
    }else if(keys.ArrowRight.pressed && player2.lastKeyPressed == 'ArrowRight'){
        player2.velocity.x = 5;
    }

    if(player1.canAttack(player2) && player1.isAttacking()){
        player1.stopAttack();
        player2.health -= 10;
        document.querySelector('#player2Health').style.width = player2.currentHealth() + '%';
    }

    if(player2.canAttack(player1) && player2.isAttacking()){
        player2.stopAttack();
        player1.health -= 10;
        document.querySelector('#player1Health').style.width = player1.currentHealth() + '%';
    }

    if(player1.isDead() || player2.isDead()){
        showGameOverMessage(player1, player2, timerId);
    }
}

animate();

window.addEventListener('keydown', (event)=>{
    
    switch(event.key){
        case 'd':
            keys.d.pressed = true;
            player1.lastKeyPressed = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player1.lastKeyPressed = 'a';
            break;
        case 'w':
            player1.jump();
            break;
        case ' ':
            player1.attack();
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            player2.lastKeyPressed = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            player2.lastKeyPressed = 'ArrowLeft';
            break;
        case 'ArrowUp':
            player2.jump();
            break;
        case '0':
            player2.attack();
            break;
    }
});

window.addEventListener('keyup', (event)=>{
    
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});