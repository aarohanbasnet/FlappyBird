//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //Width/height ratio =408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8; //position of bird in the board
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;   //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipe's moving left speed
let velocityY = 0; // bird is not jumping, jumps in key press
let gravity = 0.1;

let gameOver = false;
 

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
     
    //drawing flappy bird
    context.fillStyle = "green";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);


    //load images
    birdImg = new Image();
    birdImg.src = "images/flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "images/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "images/bottompipe.png";


    requestAnimationFrame(update);
    setInterval(placePipes,1500);  //every 1.5 seconds
    document.addEventListener("keydown",moveBird);
}  

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height);
    if(gameOver){
        return;
    }

 // bird
    velocityY += gravity;
    //bird.Y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0) //apply gravity to bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x,bird.y,bird.width,bird.height);
 //pipes
 for(let i=0;i<pipeArray.length;i++){
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

    if (detectCollision(bird,pipe)){
        gameOver = true;

    }
 }

}

function placePipes() {
    if(gameOver){
        return;
    }
  //(0-1)*pipeHeight/2;
  //0 -> -128(pipeHeight/4);
  //1 -> -128-256(pipeHeight/4-pipeHeight/2) = -3/4 pipeHeight
  // ranges from -1/4 to -3/4 of pipeHeight
    let randomPipeY = pipeY - pipeHeight / 4 -Math.random()*(pipeHeight/2); //generating random heights
    let openingSpace = board.height/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);


    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        velocityY = -4;
    }

}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;

}