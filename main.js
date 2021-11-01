class Game {
    constructor(width, height, delay, table, tableBody, scoreDiv) {
        this.width = width;
        this.height = height;
        this.delay = delay;
        this.table = table;
        this.tableBody = tableBody;
        this.scoreDiv = scoreDiv;
        this.inputs = [];
        this.positions = [[0, 0]];
        this.direction = "d";
    }

    moveTo(pos, apple = false) {
        this.positions.push(pos);
        this.getCell(pos).classList.add("snake");
        if (!apple) {
            this.getCell(this.positions.shift()).classList.remove("snake");
        }
    };

    makeTable() {
        for (let y = 0; y < this.height; y++) {
            let row = table.insertRow();
            for (let x = 0; x < this.width; x++) {
                let cell = row.insertCell();
                let inner = document.createElement("div");
                inner.classList.add("inner");
                cell.appendChild(inner);
            }
        }
        this.positions.forEach(pos => {
            this.getCell(pos).classList.add("snake");
        });
    }

    gameOver() {
        clearInterval(this.interval);
        this.table.style.borderColor = "#FF0000";
    }

    getCell(pos) {
        console.log(pos);
        return this.tableBody.children[pos[0]].children[pos[1]].children[0];
    }

    generateApple() {
        let pos = [Math.floor(Math.random() * this.height), Math.floor(Math.random() * this.width)];
        while (this.getCell(pos).classList.contains("snake") || this.getCell(pos).classList.contains("apple")) {
            pos = [Math.floor(Math.random() * this.height), Math.floor(Math.random() * this.width)];
        }
        this.getCell(pos).classList.add("apple");
    }

    updateScore() {
        this.scoreDiv.innerText = `Score: ${this.positions.length}`;
    }

    loop() {
        this.direction = this.inputs ? this.inputs.shift() : this.direction;
        console.log(this.positions);
        let currentPos = this.positions[this.positions.length - 1];
        let newPos;
        switch (this.direction) {
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

        if (newPos[0] < 0 || newPos[0] >= this.height || newPos[1] < 0 || newPos[1] >= this.width) {
            this.gameOver();
            return;
        }

        let cell = this.getCell(newPos);
        if (cell.classList.contains("snake")) {
            this.gameOver();
            return;
        }
        if (cell.classList.contains("apple")) {
            cell.classList.remove("apple");
            this.moveTo(newPos, true);
            this.generateApple();
            this.updateScore();
        } else {
            this.moveTo(newPos);
        }
    }

    run() {
        this.makeTable();
        this.generateApple();
        this.updateScore();
        this.interval = setInterval(this.loop.bind(this), this.delay);
    }
}

const table = document.querySelector("table");
const tableBody = document.querySelector("table tbody");
const score = document.querySelector("div#score");
const game = new Game(25, 25, 100, table, tableBody, score);

onkeydown = event => {
    if (!["w", "d", "s", "a"].includes(event.key)) {
        return;
    }
    if (event.key !== game.inputs[game.inputs.length - 1] && event.key !== game.direction) {
        game.inputs.push(event.key);
    }
};

game.run();
