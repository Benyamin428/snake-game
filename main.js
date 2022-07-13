const body = document.querySelector("body");
const scoreBoard = document.querySelector("#score");
const gameArea = document.querySelector("#gameArea");

const buttonUp = document.querySelector("#buttonUp");
const buttonRight = document.querySelector("#buttonRight");
const buttonDown = document.querySelector("#buttonDown");
const buttonLeft = document.querySelector("#buttonLeft");

class Snake {

    score;

    orientation;
    tail;

    gameAreaHeight;
    gameAreaWidth;

    foodPositionX;
    foodPositionY;

    constructor() {
        this.score = 0;
        this.orientation = "";
        this.tail = [{
            positionX: (Math.round(gameArea.getBoundingClientRect().width/16)*16)/2,
            positionY: (Math.round(gameArea.getBoundingClientRect().height/16)*16)/2
        }]

        this.gameAreaHeight = Math.round(gameArea.getBoundingClientRect().height/16)*16;
        this.gameAreaWidth = Math.round(gameArea.getBoundingClientRect().width/16)*16

        this.foodPositionX = 0;
        this.foodPositionY = 0;
    }

    origin = () => {

        //clear everything
        gameArea.innerHTML = "";

        //head of snake
        gameArea.innerHTML += `<div style="top: ${this.tail[0].positionY}px; left: ${this.tail[0].positionX}px" id="snake" class="game__snake"></div>`;
        
        document.getElementById("snake").style.top = `${this.tail[0].positionY}px`;
        document.getElementById("snake").style.left = `${this.tail[0].positionX}px`;

        this.spawnFood();
    }

    tailOfSnakeUpdate = () => {
        //tail of snake

        for (let i=this.tail.length-1; i>0; i--) {
            this.tail[i].positionY = this.tail[i-1].positionY;
            this.tail[i].positionX = this.tail[i-1].positionX;
        }

        const x = document.getElementsByClassName('game__snake-body-part');

        for(let i = 0; i < x.length; i++){
            x[i].style.top = `${this.tail[i+1].positionY}px`;
            x[i].style.left = `${this.tail[i+1].positionX}px`;
        }
    }

    detectWallCollision = () => {
        if (this.tail[0].positionY < 0 || this.tail[0].positionY > this.gameAreaHeight-16 || this.tail[0].positionX < 0 || this.tail[0].positionX > this.gameAreaWidth-16) {
            this.gameOver();
        }
    } 

    detectSnakeCollisionWithTail = () => {
        for (let i=1; i<this.tail.length; i++) {
            if (this.tail[0].positionX == this.tail[i].positionX && this.tail[0].positionY == this.tail[i].positionY) {
                this.gameOver();
            }
        }
    }

    spawnFood = () => {
        //Finds a random coordinate between 0 and the boundary of the game area that is also a multiple of 16
        const randomFoodPositionY = Math.random() * (this.gameAreaHeight)
        this.foodPositionY = randomFoodPositionY - (randomFoodPositionY % 16);

        const randomFoodPositionX = Math.random() * (this.gameAreaWidth)
        this.foodPositionX = randomFoodPositionX - (randomFoodPositionX % 16);

        gameArea.innerHTML += `<div style="top: ${this.foodPositionY}px; left: ${this.foodPositionX}px" id="food" class="game__snake-food"></div>`;
    }

    spawnTailAfterFood = () => {
        if (this.tail[0].positionX == this.foodPositionX && this.tail[0].positionY == this.foodPositionY) {

            //Add a tail item to the snake's body
            //Orientation of snake determines which coordinate the tail should be added
            if (this.orientation == "N") {
                this.tail.push({positionX: this.tail[this.tail.length-1].positionX, positionY: this.tail[this.tail.length-1].positionY+16});
            }
            else if (this.orientation == "S") {
                this.tail.push({positionX: this.tail[this.tail.length-1].positionX, positionY: this.tail[this.tail.length-1].positionY-16});
            }
            else if (this.orientation == "E") {
                this.tail.push({positionX: this.tail[this.tail.length-1].positionX-16, positionY: this.tail[this.tail.length-1].positionY});
            }
            else if (this.orientation == "W") {
                this.tail.push({positionX: this.tail[this.tail.length-1].positionX+16, positionY: this.tail[this.tail.length-1].positionY});
            }

            gameArea.innerHTML += `<div style="top: ${this.tail[1].positionY}px; left: ${this.tail[1].positionX}px" class="game__snake-body-part"></div>`;

            //Update the scoreboard
            this.score = this.tail.length-1;
            scoreBoard.innerText = `Score: ${this.score}`;


            //Remove the food from the GUI when snake head eats the food
            const previousFood = document.querySelector("#food");
            previousFood.remove();

            //Add a new food to the screen
            this.spawnFood();
        }
    }

    gameOver = () => {
        this.orientation = "";
        this.tail = [{
            positionX: this.gameAreaWidth/2,
            positionY: this.gameAreaHeight/2
        }]

        this.foodPositionX = 0;
        this.foodPositionY = 0;

        gameArea.innerHTML = "";

        gameArea.innerHTML = `<h1 class="game__snake-title">Game Over</h1>`;

        setTimeout(() => {this.origin()}, 1000);
    }

    moveUp = () => {
        if (this.orientation == "N") {

            //move the snake's body along with the head
            this.tailOfSnakeUpdate();

            //snake's head UP by 16px 
            this.tail[0].positionY -= 16;

            document.getElementById("snake").style.top = `${this.tail[0].positionY}px`;

            this.spawnTailAfterFood();
            this.detectWallCollision();
            this.detectSnakeCollisionWithTail();

            setTimeout(() => {this.moveUp()}, 200);
        }
    }

    moveDown = () => {
        if (this.orientation == "S") {

            this.tailOfSnakeUpdate();

            //snake's head DOWN by 16px 
            this.tail[0].positionY += 16;

            document.getElementById("snake").style.top = `${this.tail[0].positionY}px`;

            this.spawnTailAfterFood();
            this.detectWallCollision();
            this.detectSnakeCollisionWithTail();

            setTimeout(() => {this.moveDown()}, 200);
        }
    }

    moveLeft = () => {
        if (this.orientation == "W") {

            this.tailOfSnakeUpdate();

            //snake's head LEFT by 16px 
            this.tail[0].positionX -= 16;

            document.getElementById("snake").style.left = `${this.tail[0].positionX}px`;
            
            this.spawnTailAfterFood();
            this.detectWallCollision();
            this.detectSnakeCollisionWithTail();


            setTimeout(() => {this.moveLeft()}, 200);
        }
    }

    moveRight = () => {
        if (this.orientation == "E") {

            this.tailOfSnakeUpdate();

            //snake's head RIGHT by 16px 
            this.tail[0].positionX += 16;

            document.getElementById("snake").style.left = `${this.tail[0].positionX}px`;

            this.spawnTailAfterFood();
            this.detectWallCollision();
            this.detectSnakeCollisionWithTail();

            setTimeout(() => {this.moveRight()}, 200);
        }
    }


}

const snakeObject = new Snake();

snakeObject.origin();

const dealWithRightMovement = (event) => {
    if (snakeObject.orientation == "W" || snakeObject.orientation == "E") {
        return;
    }
    snakeObject.orientation = "E";
    snakeObject.moveRight();
}

const dealWithLeftMovement = (event) => {
    if (snakeObject.orientation == "E" || snakeObject.orientation == "W") {
        return;
    }
    snakeObject.orientation = "W";
    snakeObject.moveLeft();
}

const dealWithUpMovement = (event) => {
    if (snakeObject.orientation == "S" || snakeObject.orientation == "N") {
        return;
    }
    snakeObject.orientation = "N";
    snakeObject.moveUp();
}

const dealWithDownMovement = (event) =>{
    if (snakeObject.orientation == "N" || snakeObject.orientation == "S") {
        return;
    }
    snakeObject.orientation = "S";
    snakeObject.moveDown();
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

body.addEventListener("keydown", keyHandler);

buttonUp.addEventListener("click", dealWithUpMovement);
buttonRight.addEventListener("click", dealWithRightMovement);
buttonDown.addEventListener("click", dealWithDownMovement);
buttonLeft.addEventListener("click", dealWithLeftMovement);