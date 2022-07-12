const body = document.querySelector("body");
const gameArea = document.querySelector("#gameArea");



class Snake {

    orientation;
    positionX;
    positionY;
    tail;

    lastKey;

    constructor() {
        this.orientation = "";
        this.tail = [{
            positionX: (480/2),
            positionY: (480/2)
        }]

        this.lastKey = 0;
    }


}

const snakeObject = new Snake();

