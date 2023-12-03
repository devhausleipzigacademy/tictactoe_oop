import "./style.css";

type Symbol = "X" | "O" | null;

class Board {
  cells: Symbol[];

  constructor() {
    this.cells = Array(9).fill(null);
  }

  checkWin(symbol: Symbol): boolean {
    const winningCombinations: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return this.cells[index] === symbol;
      });
    });
  }

  isDraw(): boolean {
    return this.cells.every((cell) => cell !== null);
  }

  resetBoard(): void {
    this.cells.fill(null);
  }

  static createBoard(): HTMLElement {
    const board = document.createElement("div");
    board.classList.add("board");
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i.toString();
      board.appendChild(cell);
    }
    return board;
  }
}

class Player {
  name: string;
  symbol: Symbol;

  constructor(name: string, symbol: Symbol) {
    this.name = name;
    this.symbol = symbol;
  }
}

class Game {
  board: Board;
  boardElement: HTMLElement;
  player1: Player;
  player2: Player;
  currentPlayer: Player;
  isGameOver: boolean;

  constructor(boardElement: HTMLElement, player1: Player, player2: Player) {
    this.board = new Board();
    this.boardElement = boardElement;
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
    this.isGameOver = false;
  }

  switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  makeMove(cell: HTMLElement): void {
    const index = parseInt(cell.dataset.index as string);
    if (!this.board.cells[index] && !this.isGameOver) {
      this.board.cells[index] = this.currentPlayer.symbol;
      cell.textContent = this.currentPlayer.symbol;
      this.checkGameStatus();
    }
  }

  checkGameStatus(): void {
    if (this.board.checkWin(this.currentPlayer.symbol)) {
      alert(`${this.currentPlayer.name} wins!`);
      this.isGameOver = true;
    } else if (this.board.isDraw()) {
      alert("Draw!");
      this.isGameOver = true;
    } else {
      this.switchPlayer();
    }
  }

  resetGame(): void {
    this.board.resetBoard();
    this.isGameOver = false;
    this.currentPlayer = this.player1;
    Array.from(this.boardElement.children).forEach(
      (cell) => (cell.textContent = "")
    );
  }
}

class TickTackToe {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  start(): void {
    this.game.boardElement.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("cell")) {
        this.game.makeMove(target);
      }
    });

    // Optional: Implementierung einer Reset-Taste
    const resetButton = document.getElementById(
      "reset-button"
    ) as HTMLButtonElement; // Stellen Sie sicher, dass ein Button mit dieser ID existiert
    resetButton.addEventListener("click", () => this.game.resetGame());
  }
}

const boardElement = Board.createBoard();
document.body.appendChild(boardElement);

const player1 = new Player("Player 1", "X");
const player2 = new Player("Player 2", "O");
const game = new Game(boardElement, player1, player2);
const tickTackToe = new TickTackToe(game);
tickTackToe.start();
