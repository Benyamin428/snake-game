const body = document.querySelector("body");
const gameArea = document.querySelector("#gameArea");

class Snake {

    orientation;
    tail;
    foodPositionX;
    foodPositionY;

    lastKey;

    constructor() {
        this.orientation = "";
        this.tail = [{
            positionX: (480/2),
            positionY: (480/2)
        }]

        this.foodPositionX = 0;
        this.foodPositionY = 0;

        this.lastKey = 0;
    }

    origin = () => {

        //head of snake
        gameArea.innerHTML += `<div style="top: ${this.tail[0].positionY}px; left: ${this.tail[0].positionX}px" id="snake" class="game__snake"></div>`;
        
        document.getElementById("snake").style.top = `${this.tail[0].positionX}px`;
        document.getElementById("snake").style.left = `${this.tail[0].positionY}px`;

        this.spawnFood();
    }

    spawnFood = () => {
        //Finds a random coordinate between 0 and 464 that is a multiple of 16
        const randomFoodPositionY = Math.random() * (464 + 16)
        this.foodPositionY = randomFoodPositionY - (randomFoodPositionY % 16);

        const randomFoodPositionX = Math.random() * (464 + 16)
        this.foodPositionX = randomFoodPositionX - (randomFoodPositionX % 16);

        gameArea.innerHTML += `<div style="top: ${this.foodPositionY}px; left: ${this.foodPositionX}px" id="food" class="game__snake-food"></div>`;
    }

    moveUp = () => {
        if (this.orientation == "N") {


            //snake's head UP by 16px 
            this.tail[0].positionY -= 16;

            document.getElementById("snake").style.top = `${this.tail[0].positionY}px`;

            setTimeout(() => {this.moveUp()}, 500);
        }
    }

    moveDown = () => {
        if (this.orientation == "S") {


            //snake's head DOWN by 16px 
            this.tail[0].positionY += 16;


            document.getElementById("snake").style.top = `${this.tail[0].positionY}px`;

            setTimeout(() => {this.moveDown()}, 500);
        }
    }

    moveLeft = () => {
        if (this.orientation == "W") {


            //snake's head LEFT by 16px 
            this.tail[0].positionX -= 16;


            document.getElementById("snake").style.left = `${this.tail[0].positionX}px`;
            
            setTimeout(() => {this.moveLeft()}, 500);
        }
    }

    moveRight = () => {
        if (this.orientation == "E") {

            //snake's head RIGHT by 16px 
            this.tail[0].positionX += 16;


            document.getElementById("snake").style.left = `${this.tail[0].positionX}px`;

            setTimeout(() => {this.moveRight()}, 500);
        }
    }


}

const snakeObject = new Snake();

snakeObject.origin();

const keyHandler = (event) => {

    console.log(event.which)

    if (event.which == snakeObject.lastKey) return;

    switch (event.key) {

        case "ArrowRight":
            if (snakeObject.orientation == "W") {
                return;
            }
            snakeObject.orientation = "E";
            snakeObject.lastKey = event.which;
            snakeObject.moveRight();
            break;
        case "ArrowLeft":
            if (snakeObject.orientation == "E") {
                return;
            }
            snakeObject.orientation = "W";
            snakeObject.lastKey = event.which;
            snakeObject.moveLeft();
            break;
        case "ArrowUp":
            if (snakeObject.orientation == "S") {
                return;
            }
            snakeObject.orientation = "N";
            snakeObject.lastKey = event.which;
            snakeObject.moveUp();
            break;
        case "ArrowDown":
            if (snakeObject.orientation == "N") {
                return;
            }
            snakeObject.orientation = "S";
            snakeObject.lastKey = event.which;
            snakeObject.moveDown();
            break;
        default:
            return;
    }    
}

body.addEventListener("keydown", keyHandler);