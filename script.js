const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector("#message").innerText = message;
  };
  return { renderMessage };
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    let boardHTML = "";
    for (let i = 0; i < gameboard.length; i++) {
      boardHTML += `<div class="cell" id="cell-${i}">${gameboard[i]}</div>`;
    }
    document.querySelector("#gameboard").innerHTML = boardHTML;
    const cell = document.querySelectorAll(".cell");
    for (let i = 0; i < cell.length; i++) {
      cell[i].addEventListener("click", Game.handleClick);
    }
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard;

  return { render, update, getGameboard };
})();

const createPlayer = (name, mark) => {
  return { name, mark };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const start = () => {
    let p1 = document.querySelector("#p1");
    let p2 = document.querySelector("#p2");
    players = [
      createPlayer(p1.value == "" ? "Player 1" : p1.value, "X"),
      createPlayer(p2.value == "" ? "Player 2" : p2.value, "O"),
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
    const cell = document.querySelectorAll(".cell");
    for (let i = 0; i < cell.length; i++) {
      cell[i].addEventListener("click", handleClick);
    }
  };

  const handleClick = (event) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;

    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      displayController.renderMessage(
        `${players[currentPlayerIndex].name} wins!!!`,
      );
    } else if (checkTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage(`It's a Tie!!!`);
    }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  function checkForWin(board) {
    const winningCombo = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombo.length; i++) {
      const [a, b, c] = winningCombo[i];
      if (board[a] && board[a] == board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }

  function checkTie(board) {
    return board.every((cell) => cell !== "");
  }

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    Gameboard.render();
    gameOver = false;
    document.querySelector("#message").innerHTML = "";
  };

  return { start, handleClick, restart };
})();

const restartBtn = document.querySelector(".restartBtn");
restartBtn.addEventListener("click", () => {
  Game.restart();
});

const startBtn = document.querySelector(".startBtn");
startBtn.addEventListener("click", () => {
  Game.start();
});
