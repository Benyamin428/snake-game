const body = document.querySelector("body");
const scoreBoard = document.querySelector("#score");
const resetButton = document.querySelector("#reset");

const gameArea = document.querySelector("#gameArea");

const buttonUp = document.querySelector("#buttonUp");
const buttonRight = document.querySelector("#buttonRight");
const buttonDown = document.querySelector("#buttonDown");
const buttonLeft = document.querySelector("#buttonLeft");

//for setTimeout function
let timeout;

let score = 0;
let orientation = "";
let tail = [{
    positionX: (Math.round(gameArea.getBoundingClientRect().width/16)*16)/2,
    positionY: (Math.round(gameArea.getBoundingClientRect().height/16)*16)/2
}]

let foodPositionX = 0;
let foodPositionY = 0;

//find the width and height of the game area 
const gameAreaHeight = Math.round(gameArea.getBoundingClientRect().height/16)*16;
const gameAreaWidth = Math.round(gameArea.getBoundingClientRect().width/16)*16;

const origin = () => {

    //clear everything
    gameArea.innerHTML = "";

    //head of snake
    gameArea.innerHTML += `<div style="top: ${tail[0].positionY}px; left: ${tail[0].positionX}px" id="snake" class="game__snake"></div>`;
    
    document.getElementById("snake").style.top = `${tail[0].positionY}px`;
    document.getElementById("snake").style.left = `${tail[0].positionX}px`;

    spawnFood();
}

const tailOfSnakeUpdate = () => {

    //each tail element has its co-ordinate switched with its corresponding (n-1) neighbour element
    for (let i=tail.length-1; i>0; i--) {
        tail[i].positionY = tail[i-1].positionY;
        tail[i].positionX = tail[i-1].positionX;
    }

    const bodyOfSnake = document.getElementsByClassName('game__snake-body-part');

    //the new co-ordinates are displayed on screen
    for(let i = 0; i < bodyOfSnake.length; i++){
        bodyOfSnake[i].style.top = `${tail[i+1].positionY}px`;
        bodyOfSnake[i].style.left = `${tail[i+1].positionX}px`;
    }
}

const detectWallCollision = () => {
    //checks if snake head has passed the boundaries of the game area
    if (tail[0].positionY < 0 || tail[0].positionY > gameAreaHeight-16 || tail[0].positionX < 0 || tail[0].positionX > gameAreaWidth-16) {
        gameOver();
    }
} 

const detectSnakeCollisionWithTail = () => {
    //checks if snake head has the same co-ordinate as one of the snake body elements
    for (let i=1; i<tail.length; i++) {
        if (tail[0].positionX == tail[i].positionX && tail[0].positionY == tail[i].positionY) {
            gameOver();
        }
    }
}

const spawnFood = () => {
    //Finds a random coordinate between 0 and the boundary of the game area that is also a multiple of 16
    const randomFoodPositionY = Math.random() * (gameAreaHeight)
    foodPositionY = randomFoodPositionY - (randomFoodPositionY % 16);

    const randomFoodPositionX = Math.random() * (gameAreaWidth)
    foodPositionX = randomFoodPositionX - (randomFoodPositionX % 16);

    gameArea.innerHTML += `<div style="top: ${foodPositionY}px; left: ${foodPositionX}px" id="food" class="game__snake-food"></div>`;
}

const spawnTailAfterFood = () => {
    if (tail[0].positionX != foodPositionX || tail[0].positionY != foodPositionY) {
        return;
    }

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

const reset = () => {
    score = 0;
    orientation = "";
    tail = [{
        positionX: gameAreaWidth/2,
        positionY: gameAreaHeight/2
    }]

    foodPositionX = 0;
    foodPositionY = 0;

    setTimeout(() => {origin()}, 750);
}

const gameOver = () => {

    gameArea.innerHTML = `<h1 class="game__snake-title">Game Over</h1>`;

    reset();

}

const move = () => {

    tailOfSnakeUpdate();

    if (orientation == "N") {
        tail[0].positionY -= 16;
        document.getElementById("snake").style.top = `${tail[0].positionY}px`;
    }
    else if (orientation == "S") {
        tail[0].positionY += 16;
        document.getElementById("snake").style.top = `${tail[0].positionY}px`;
    }
    else if (orientation == "W") {
        tail[0].positionX -= 16;
        document.getElementById("snake").style.left = `${tail[0].positionX}px`;
    }
    else if (orientation == "E") {
        tail[0].positionX += 16;
        document.getElementById("snake").style.left = `${tail[0].positionX}px`;
    }

    spawnTailAfterFood();
    detectWallCollision();
    detectSnakeCollisionWithTail();

    timeout = setTimeout(move, 200);
}


const dealWithRightMovement = () => {
    if (orientation == "W" || orientation == "E") {
        return;
    }
    orientation = "E";
    clearTimeout(timeout);
    move();
}

const dealWithLeftMovement = () => {
    if (orientation == "E" || orientation == "W") {
        return;
    }
    orientation = "W";
    clearTimeout(timeout);
    move();
}

const dealWithUpMovement = () => {
    if (orientation == "S" || orientation == "N") {
        return;
    }
    orientation = "N";
    clearTimeout(timeout);
    move();
}

const dealWithDownMovement = (event) => {
    if (orientation == "N" || orientation == "S") {
        return;
    }
    orientation = "S";
    clearTimeout(timeout);
    move();
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

resetButton.addEventListener("click", reset);

body.addEventListener("keydown", keyHandler);

buttonUp.addEventListener("click", dealWithUpMovement);
buttonRight.addEventListener("click", dealWithRightMovement);
buttonDown.addEventListener("click", dealWithDownMovement);
buttonLeft.addEventListener("click", dealWithLeftMovement);