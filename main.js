const body = document.querySelector("body");
const scoreBoard = document.querySelector("#score");
const gameArea = document.querySelector("#gameArea");

const buttonUp = document.querySelector("#buttonUp");
const buttonRight = document.querySelector("#buttonRight");
const buttonDown = document.querySelector("#buttonDown");
const buttonLeft = document.querySelector("#buttonLeft");

let score = 0;
let orientation = "";
let tail = [{
    positionX: (Math.round(gameArea.getBoundingClientRect().width/16)*16)/2,
    positionY: (Math.round(gameArea.getBoundingClientRect().height/16)*16)/2
}]

let foodPositionX = 0;
let foodPositionY = 0;

const gameAreaHeight = Math.round(gameArea.getBoundingClientRect().height/16)*16;
const gameAreaWidth = Math.round(gameArea.getBoundingClientRect().width/16)*16;

origin = () => {

    //clear everything
    gameArea.innerHTML = "";

    //head of snake
    gameArea.innerHTML += `<div style="top: ${tail[0].positionY}px; left: ${tail[0].positionX}px" id="snake" class="game__snake"></div>`;
    
    document.getElementById("snake").style.top = `${tail[0].positionY}px`;
    document.getElementById("snake").style.left = `${tail[0].positionX}px`;

    spawnFood();
}

tailOfSnakeUpdate = () => {
    //tail of snake

    for (let i=tail.length-1; i>0; i--) {
        tail[i].positionY = tail[i-1].positionY;
        tail[i].positionX = tail[i-1].positionX;
    }

    const x = document.getElementsByClassName('game__snake-body-part');

    for(let i = 0; i < x.length; i++){
        x[i].style.top = `${tail[i+1].positionY}px`;
        x[i].style.left = `${tail[i+1].positionX}px`;
    }
}

detectWallCollision = () => {
    if (tail[0].positionY < 0 || tail[0].positionY > gameAreaHeight-16 || tail[0].positionX < 0 || tail[0].positionX > gameAreaWidth-16) {
        gameOver();
    }
} 

detectSnakeCollisionWithTail = () => {
    for (let i=1; i<tail.length; i++) {
        if (tail[0].positionX == tail[i].positionX && tail[0].positionY == tail[i].positionY) {
            gameOver();
        }
    }
}

spawnFood = () => {
    //Finds a random coordinate between 0 and the boundary of the game area that is also a multiple of 16
    const randomFoodPositionY = Math.random() * (gameAreaHeight)
    foodPositionY = randomFoodPositionY - (randomFoodPositionY % 16);

    const randomFoodPositionX = Math.random() * (gameAreaWidth)
    foodPositionX = randomFoodPositionX - (randomFoodPositionX % 16);

    gameArea.innerHTML += `<div style="top: ${foodPositionY}px; left: ${foodPositionX}px" id="food" class="game__snake-food"></div>`;
}

spawnTailAfterFood = () => {
    if (tail[0].positionX == foodPositionX && tail[0].positionY == foodPositionY) {

        //Add a tail item to the snake's body
        //Orientation of snake determines which coordinate the tail should be added
        if (orientation == "N") {
            tail.push({positionX: tail[tail.length-1].positionX, positionY: tail[tail.length-1].positionY+16});
        }
        else if (orientation == "S") {
            tail.push({positionX: tail[tail.length-1].positionX, positionY: tail[tail.length-1].positionY-16});
        }
        else if (orientation == "E") {
            tail.push({positionX: tail[tail.length-1].positionX-16, positionY: tail[tail.length-1].positionY});
        }
        else if (orientation == "W") {
            tail.push({positionX: tail[tail.length-1].positionX+16, positionY: tail[tail.length-1].positionY});
        }

        gameArea.innerHTML += `<div style="top: ${tail[1].positionY}px; left: ${tail[1].positionX}px" class="game__snake-body-part"></div>`;

        //Update the scoreboard
        score = tail.length-1;
        scoreBoard.innerText = `Score: ${score}`;


        //Remove the food from the GUI when snake head eats the food
        const previousFood = document.querySelector("#food");
        previousFood.remove();

        //Add a new food to the screen
        spawnFood();
    }
}

gameOver = () => {
    orientation = "";
    tail = [{
        positionX: gameAreaWidth/2,
        positionY: gameAreaHeight/2
    }]

    foodPositionX = 0;
    foodPositionY = 0;

    gameArea.innerHTML = "";

    gameArea.innerHTML = `<h1 class="game__snake-title">Game Over</h1>`;

    setTimeout(() => {origin()}, 1000);
}

moveUp = () => {
    if (orientation == "N") {

        //move the snake's body along with the head
        tailOfSnakeUpdate();

        //snake's head UP by 16px 
        tail[0].positionY -= 16;

        document.getElementById("snake").style.top = `${tail[0].positionY}px`;

        spawnTailAfterFood();
        detectWallCollision();
        detectSnakeCollisionWithTail();

        setTimeout(() => {moveUp()}, 200);
    }
}

moveDown = () => {
    if (orientation == "S") {

        tailOfSnakeUpdate();

        //snake's head DOWN by 16px 
        tail[0].positionY += 16;

        document.getElementById("snake").style.top = `${tail[0].positionY}px`;

        spawnTailAfterFood();
        detectWallCollision();
        detectSnakeCollisionWithTail();

        setTimeout(() => {moveDown()}, 200);
    }
}

moveLeft = () => {
    if (orientation == "W") {

        tailOfSnakeUpdate();

        //snake's head LEFT by 16px 
        tail[0].positionX -= 16;

        document.getElementById("snake").style.left = `${tail[0].positionX}px`;
        
        spawnTailAfterFood();
        detectWallCollision();
        detectSnakeCollisionWithTail();


        setTimeout(() => {moveLeft()}, 200);
    }
}

moveRight = () => {
    if (orientation == "E") {

        tailOfSnakeUpdate();

        //snake's head RIGHT by 16px 
        tail[0].positionX += 16;

        document.getElementById("snake").style.left = `${tail[0].positionX}px`;

        spawnTailAfterFood();
        detectWallCollision();
        detectSnakeCollisionWithTail();

        setTimeout(() => {moveRight()}, 200);
    }
}

const dealWithRightMovement = (event) => {
    if (orientation == "W" || orientation == "E") {
        return;
    }
    orientation = "E";
    moveRight();
}

const dealWithLeftMovement = (event) => {
    if (orientation == "E" || orientation == "W") {
        return;
    }
    orientation = "W";
    moveLeft();
}

const dealWithUpMovement = (event) => {
    if (orientation == "S" || orientation == "N") {
        return;
    }
    orientation = "N";
    moveUp();
}

const dealWithDownMovement = (event) =>{
    if (orientation == "N" || orientation == "S") {
        return;
    }
    orientation = "S";
    moveDown();
}

const keyHandler = (event) => {

    switch (event.key) {

        case "ArrowRight":
            dealWithRightMovement(event);
            break;
        case "ArrowLeft":
            dealWithLeftMovement(event);
            break;
        case "ArrowUp":
            dealWithUpMovement(event);
            break;
        case "ArrowDown":
            dealWithDownMovement(event);
            break;
        default:
            return;
    }    
}

origin();

body.addEventListener("keydown", keyHandler);

buttonUp.addEventListener("click", dealWithUpMovement);
buttonRight.addEventListener("click", dealWithRightMovement);
buttonDown.addEventListener("click", dealWithDownMovement);
buttonLeft.addEventListener("click", dealWithLeftMovement);