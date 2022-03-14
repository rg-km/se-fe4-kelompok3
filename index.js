const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 200;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
const MOVE_INTERVAL = 200;

let ground = new Image();
ground.src = "img/ground1.png";

let appleImage = new Image();
appleImage.src = "img/food.png";

let KepalaUlar = new Image();
KepalaUlar.src = "img/Head-Snake-bawah.png";

let BadanUlar = new Image();
BadanUlar.src = "img/Body-Snake.png";

let Health = new Image();
Health.src = "img/heart.png";

var gameover = new Audio('audio/dead.mp3');
var makan = new Audio("audio/eat.mp3");
var up = new Audio("audio/up.mp3");
var right = new Audio("audio/right.mp3");
var left = new Audio("audio/left.mp3");
var down = new Audio("audio/down.mp3");
var play = new Audio("audio/play.mp3");

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        hp: 0,
        level: 0,
    }
}
let snake1 = initSnake("purple");
let snake2 = initSnake("blue");

let apple1 = {
    position: initPosition(),
}

let apple2 = {
    position: initPosition(),
}

let nyawa = {
    position: initPosition(),
}

let obstacles = []

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas = document.getElementById("score1Board");
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLevel(snake) {
    let levelCanvas = document.getElementById("level");
    let scoreCtx = levelCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.level, 10, levelCanvas.scrollHeight / 2);
}



function drawapple(image, ctx, x, y) {
    ctx.drawImage(image, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
}

function drawNyawa(snake) {
    let canvasNyawa = document.getElementById("nyawaBoard");
    let ctx = canvasNyawa.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.font = "30px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(snake.hp, 10, canvasNyawa.scrollHeight / 2);
}


function drawLine(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x1 * CELL_SIZE, y1 * CELL_SIZE);
    ctx.lineTo(x2 * CELL_SIZE, y2 * CELL_SIZE);
    ctx.stroke();
}



function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawapple(KepalaUlar, ctx, snake1.head.x, snake1.head.y);
        for (let i = 1; i < snake1.body.length; i++) {
            drawapple(BadanUlar, ctx, snake1.body[i].x, snake1.body[i].y);
        }

        drawapple(appleImage, ctx, apple1.position.x, apple1.position.y);
        drawapple(appleImage, ctx, apple2.position.x, apple2.position.y);
        for (let i = 0; i < obstacles.length; i++) {
            for (let j = 0; j < obstacles[i].length; j++) {
                drawCell(ctx, obstacles[i][j].x, obstacles[i][j].y, 'red')
                console.log('s')
            }
        }
        drawScore(snake1);
        drawLevel(snake1);



        if (isPrime(snake1.score)) {
            drawapple(Health, ctx, nyawa.position.x, nyawa.position.y);
        }
        drawNyawa(snake1);
    }, REDRAW_INTERVAL);
}



function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function update(snake1) {
    const row = []
    for (let i = 0; i < WIDTH * 0.8; i++) {
        row.push({
            x: i,
            y: obstacles.length ?
                obstacles[obstacles.length - 1][0].y + 2 : HEIGHT / 2,
        })
    }

    obstacles.push(row)
    snake1.hp = snake1.hp + 1
    console.log(obstacles)
}


function eat(snake, apple) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();

        makan.play();
        snake.score++;
        snake.level++;
        snake.body.push({ x: snake.head.x, y: snake.head.y });
        update(snake);
        if (snake.score % 5 === 0) {}
    } else if (
        snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition()
        snake.score++
            snake.body.push({ x: snake.head.x, y: snake.head.y })
        update(snake)
        if (snake.score % 5 === 0) {}
    }

}

function eatNyawa(snake, nyawa) {
    if (snake.head.x == nyawa.position.x && snake.head.y == nyawa.position.y) {
        nyawa.position = initPosition();
        snake.hp++;

        makan.play();

    }
}

const isPrime = num => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
}


function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2);
    eatNyawa(snake, nyawa);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2);
    eatNyawa(snake, nyawa);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2);
    eatNyawa(snake, nyawa);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2);
    eatNyawa(snake, nyawa);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        for (let j = 0; j < obstacles[i].length; j++) {
            if (
                obstacles[i][j].x === snakes[0].head.x &&
                obstacles[i][j].y === snakes[0].head.y
            )
                isCollide = true
        }
    }


    if (isCollide) {
        alert("Game over", gameover.play());

        snake1 = initSnake("purple");

        obstacles = []

    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}


if (snake1.level > 1) {
    for (i = 0; i < snake1.level - 1; i++) {
        drawLine(ctx, walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
    }
}

drawScore(snake1);



function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
        left.play();
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
        right.play();
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
        up.play();
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
        down.play();
    }

    play.play();

})

function initGame() {
    move(snake1);
}

initGame();