"use strict"
/*----- constants -----*/
const DEBUG = true;
const BOARD_LENGTH = 3;

/*----- app's state (variables) -----*/
var boardState; 
var gameOver;
var playerXTurn;

var gamesXWon;
var gamesYWon;
var gamesTied;

/*----- cached element references -----*/
var gameBoard; 
var xTallyMsg;
var oTallyMsg;
var tieTallyMsg;
var statusMsg;
var resetBtn;
var restartBtn;


/*----- functions -----*/
function initDOMReferences() {
    gameBoard = document.getElementById("ttt-grid");;
    xTallyMsg = document.getElementById("x-gameTally");
    oTallyMsg = document.getElementById("o-gameTally");
    tieTallyMsg = document.getElementById("tie-gameTally");
    resetBtn = document.getElementById("reset-btn");
    restartBtn = document.getElementById("restart-btn");
}

function initGameState() {
    playerXTurn = true;
    gameOver = false;
    boardState = [
        [null, null, null],
        [null, null, null], 
        [null, null, null]
    ];

    //remove X/O pictures and textcontent from the squares
    for(let i = 0; i < gameBoard.children.length; i++) {
        if(DEBUG) gameBoard.children[i].textContent = "";
        gameBoard.children[i].classList.remove("x-mark");
        gameBoard.children[i].classList.remove("o-mark");
    }
}


function checkForWin() {
    let winToken = playerXTurn ? true : false;

    //check horizontal 
    if(checkHorizontalWin() || checkVerticalWin() || checkDiagonalWin()) {
        let playerName = playerXTurn ? "X" : "O";
        if(DEBUG) console.log("Player " + playerName + " wins!");
        gameOver = true;
        playerName === "X" ? gamesXWon++ : gamesYWon++;
        unregisterGameBoardListener();
        return true;
    }
    return false;
}

function checkForTie() {
    //If there's a single unmarked square left, the game is not yet over.
    let playableSpaceExists = false;
    for(let i = 0; i < BOARD_LENGTH; i++) {
        for(let j = 0; j < BOARD_LENGTH; j++) {
            if(boardState[i][j] === null) {
                return false;
            }
        }
    }
    if(DEBUG) console.log("Game is tied!");
    gamesTied++;
    gameOver = true;
    return true;
}

function render() {
    xTallyMsg.textContent = "Player X Games Won: " + gamesXWon;
    oTallyMsg.textContent = "Player O Games Won: " + gamesYWon; 
    tieTallyMsg.textContent = "Games Tied: " + gamesTied; 
}

function checkHorizontalWin() {
    for(let i = 0; i < BOARD_LENGTH; i++) {
        if(boardState[i][0] === boardState[i][1] &&
           boardState[i][1] === boardState[i][2] &&
           boardState[i][0] !== null) 
            return true; 
    }
    return false;
}

function checkVerticalWin() {
    for(let i = 0; i < BOARD_LENGTH; i++) {
        if(boardState[0][i] === boardState[1][i] &&
           boardState[1][i] === boardState[2][i] &&
           boardState[0][i] !== null)
           return true;
    }
    return false;
}

function checkDiagonalWin() {
    if(boardState[1][1] === null) return false;

    //check for topleft to botright diagonal
    if(boardState[0][0] === boardState[1][1] &&
       boardState[1][1] === boardState[2][2]) 
       return true;

    //check for topleft to botright diagonal
    if(boardState[0][2] === boardState[1][1] &&
        boardState[1][1] === boardState[2][0]) 
        return true;

    return false;
}


function updateBoardState(squareId) {
    switch(squareId) {
        case("tl"):
            boardState[0][0] = playerXTurn ? "x" : "o";
            break;
        case("tm"):
            boardState[0][1] = playerXTurn ? "x" : "o";
            break;
        case("tr"):
            boardState[0][2] = playerXTurn ? "x" : "o";
            break;
        case("ml"):
            boardState[1][0] = playerXTurn ? "x" : "o";
            break;
        case("mm"):
            boardState[1][1] = playerXTurn ? "x" : "o";
            break;
        case("mr"):
            boardState[1][2] = playerXTurn ? "x" : "o";
            break;
        case("bl"):
            boardState[2][0] = playerXTurn ? "x" : "o";
            break;
        case("bm"):
            boardState[2][1] = playerXTurn ? "x" : "o";
            break;
        case("br"):
            boardState[2][2] = playerXTurn ? "x" : "o";
            break;
        default:
            return -1;
    }
}

/*----- event listeners and callback fns-----*/

//On DOM content load, initialize vars
document.addEventListener("DOMContentLoaded", function() {
    if(DEBUG) console.log("DOM loaded");
    initDOMReferences();
    registerGameBoardListener();
    resetBtn.addEventListener("click", resetScores);
    restartBtn.addEventListener("click", restartGame);
    resetScores();
});

function registerGameBoardListener() {
    gameBoard.addEventListener("click", nextMove);
}
function unregisterGameBoardListener() {
    gameBoard.removeEventListener("click", nextMove);
}

function nextMove(evt) {
    let target = evt.target;
    //ignore clicks on parent div
    if(target.matches("#ttt-grid")) return;
    if(DEBUG) console.log(target.id + " square clicked");

    //ignore clicks on marked squares
    if(target.classList.contains("o-mark") || target.classList.contains("x-mark")) {
        if(DEBUG) console.log("This square is already marked!");
        return;
    } 

    if(playerXTurn) {
        target.classList.add("x-mark");
        updateBoardState(target.id);
        target.textContent = "x";           //remove this later
    } else {
        target.classList.add("o-mark");
        updateBoardState(target.id);
        target.textContent = "o";           //remove this later
    }

    if(!checkForWin()) {
        checkForTie();
    }
    
    render();
    playerXTurn = !playerXTurn;
}

function restartGame(evt) {
    if(gameOver) registerGameBoardListener();
    initGameState();
}

function resetScores(evt) {
    gamesXWon = 0;
    gamesYWon = 0;
    gamesTied = 0;
    render();
    restartGame();    
}