const width = 25, height = 25;
var table = document.querySelector("table");
var scoreDiv = document.querySelector("div#score");
var tableBody = document.querySelector("table tbody");

for (let a = 0; a < height; a++) {
    let row = table.insertRow();
    for (let b = 0; b < width; b++) {
        let cell = row.insertCell();
        let inner = document.createElement("div");
        inner.classList.add("inner");
        cell.appendChild(inner);
    }
}


var positions = [[0, 0]];
var inputs = [];
var direction = "d";

positions.forEach(pos => { getTableElement(pos).classList.add("snake"); });
generateApple();
updateScore();

function getTableElement(pos) {
    return tableBody.children[pos[0]].children[pos[1]].children[0];
}

function updateScore() {
    scoreDiv.innerText = `Score: ${positions.length}`;
}

function generateApple() {
    let pos = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
    while (getTableElement(pos).classList.contains("snake") || getTableElement(pos).classList.contains("apple")) {
        pos = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
    }
    getTableElement(pos).classList.add("apple");
}

function moveTo(pos, a = false) {
    positions.push(pos);
    getTableElement(pos).classList.add("snake");
    if (!a) {
        getTableElement(positions.shift()).classList.remove("snake");

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
};

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

    let element = getTableElement(newPos);
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