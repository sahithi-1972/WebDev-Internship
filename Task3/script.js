const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restart");
const resetScoresBtn = document.getElementById("resetScores");

const xScoreElement = document.getElementById("xScore");
const oScoreElement = document.getElementById("oScore");
const drawScoreElement = document.getElementById("drawScore");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;

let scores = JSON.parse(
    localStorage.getItem("tttScores")
) || {
    x:0,
    o:0,
    draw:0
};

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function updateScoreboard(){

    xScoreElement.textContent = scores.x;
    oScoreElement.textContent = scores.o;
    drawScoreElement.textContent = scores.draw;

    localStorage.setItem(
        "tttScores",
        JSON.stringify(scores)
    );
}

function checkWinner(){

    for(const combo of winningCombinations){

        const [a,b,c] = combo;

        if(
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ){

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            statusText.textContent =
                `Player ${board[a]} Wins!`;

            gameActive = false;

            if(board[a] === "X"){
                scores.x++;
            }else{
                scores.o++;
            }

            updateScoreboard();

            return;
        }
    }

    if(!board.includes("")){

        statusText.textContent =
            "It's a Draw!";

        gameActive = false;

        scores.draw++;

        updateScoreboard();

        return;
    }

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";

    statusText.textContent =
        `Player ${currentPlayer}'s Turn`;
}

function handleClick(event){

    const cell = event.target;

    const index =
        cell.getAttribute("data-index");

    if(
        board[index] !== "" ||
        !gameActive
    ){
        return;
    }

    board[index] = currentPlayer;

    cell.textContent = currentPlayer;

    cell.classList.add(
        currentPlayer.toLowerCase()
    );

    checkWinner();
}

function restartGame(){

    board =
        ["","","","","","","","",""];

    currentPlayer = "X";

    gameActive = true;

    statusText.textContent =
        "Player X's Turn";

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "winner",
            "x",
            "o"
        );
    });
}

function resetScores(){

    scores = {
        x:0,
        o:0,
        draw:0
    };

    updateScoreboard();
}

cells.forEach(cell => {
    cell.addEventListener(
        "click",
        handleClick
    );
});

restartBtn.addEventListener(
    "click",
    restartGame
);

resetScoresBtn.addEventListener(
    "click",
    resetScores
);

document.addEventListener(
    "keydown",
    (event) => {

        if(
            event.key.toLowerCase() === "r"
        ){
            restartGame();
        }
    }
);

updateScoreboard();