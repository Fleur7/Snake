const width = 25, height = 25;
var table = document.querySelector("table");
var scoreDiv = document.querySelector("div#score");
var tableBody = document.querySelector("table tbody");

for (let a = 0; a < height; a++) {
    let row = table.insertRow();
    for (let b = 0; b < width; b++) {
        row.insertCell();
    }
}


var positions = [[0, 0]];
var inputs = [];
var direction = "d";

positions.forEach(pos => { tableBody.children[pos[0]].children[pos[1]].classList.add("snake"); });
generateApple();
updateScore();

function updateScore() {
    scoreDiv.innerText = `Score: ${positions.length}`;
}

function generateApple() {
    let pos = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
    while (tableBody.children[pos[0]].children[pos[1]].classList.contains("snake")) {
        pos = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
    }
    tableBody.children[pos[0]].children[pos[1]].classList.add("apple");
}

function moveTo(pos, a = false) {
    positions.push(pos);
    tableBody.children[pos[0]].children[pos[1]].classList.add("snake");
    if (!a) {
        let oldPos = positions.shift();
        tableBody.children[oldPos[0]].children[oldPos[1]].classList.remove("snake");

    }
}

function move(x, y, a = false) {
    let currentPos = positions[positions.length - 1];
    moveTo([currentPos[0] + x, currentPos[1] + y], a);
}

function gameOver() {
    table.style.borderColor = "#FF0000";
}

document.body.onkeydown = event => {
    if (!["w", "d", "s", "a"].includes(event.key)) {
        return;
    }
    if (event.key != inputs[inputs.length - 1] && event.key != direction) {
        inputs.push(event.key);
    }
}

var interval = setInterval(() => {
    direction = inputs.length ? inputs.shift() : direction;

    let currentPos = positions[positions.length - 1];
    let newPos;
    switch (direction) {
        case "w":
            newPos = [currentPos[0] - 1, currentPos[1]];
            break;
        case "d":
            newPos = [currentPos[0], currentPos[1] + 1];
            break;
        case "s":
            newPos = [currentPos[0] + 1, currentPos[1]];
            break;
        case "a":
            newPos = [currentPos[0], currentPos[1] - 1];
            break;
    }
    if (newPos[0] < 0 || newPos[0] >= height || newPos[1] < 0 || newPos[1] >= width) {
        gameOver();
        clearInterval(interval);
        return;
    }

    let element = tableBody.children[newPos[0]].children[newPos[1]];
    if (element.classList.contains("snake")) {
        gameOver();
        clearInterval(interval);
        return;
    }
    if (element.classList.contains("apple")) {
        element.classList.remove("apple");
        moveTo(newPos, true);
        generateApple();
        updateScore();
    } else {
        moveTo(newPos);
    }
}, 100);