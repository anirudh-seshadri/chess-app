import moves from "./moves.json";
import board from "./board.json";
import { makeAutoObservable } from "mobx";
import Chessboard from "./chessboard";
import Openings from "./openingtree";
export default class ChessGame {
  constructor() {
    this.moves = [];
    this.gameOver = false;
    this.board = board;
    this.openingName = "";
    this.openings = new Openings();
    this.openings.createTree();
    makeAutoObservable(this);
    this.chessboard = new Chessboard(this.board);
  }

  addMove(notation) {
    if (this.moves.length === 0) {
      if (
        this.chessboard.makeMove(this.chessboard.parseNotation(notation, 0))
      ) {
        this.moves = this.moves.concat([[notation, ""]]);
      }
      this.openingName = this.openings.findOpening(this.moves);
      return;
    }
    let finalMoveSet = this.moves[this.moves.length - 1];
    const moveColor = finalMoveSet[1] === "" ? 1 : 0;
    const move = this.chessboard.parseNotation(notation, moveColor);
    if (this.chessboard.makeMove(move)) {
      if (this.chessboard.isCheck(move.color)) {
        notation = notation.concat("+");
        if (this.chessboard.isCheckmate(move)) {
          notation = notation.replace("+", "#");
          this.gameOver = true;
        }
      } else {
        if (this.chessboard.isCheckmate(move)) {
          notation = notation.concat("$");
          this.gameOver = true;
        }
      }

      if (moveColor === 1) {
        finalMoveSet[1] = notation;
        this.moves.push(this.moves.pop());
      } else {
        this.moves = this.moves.concat([[notation, ""]]);
      }
    }
    this.openingName = this.openings.findOpening(this.moves);
    if (this.moves.length >= 6) {
      if (
        (this.moves[this.moves.length - 1][0] ===
          this.moves[this.moves.length - 3][0] &&
          this.moves[this.moves.length - 5][0] ===
            this.moves[this.moves.length - 3][0] &&
          this.moves[this.moves.length - 1][0] ===
            this.moves[this.moves.length - 5][0]) ||
        (this.moves[this.moves.length - 2][0] ===
          this.moves[this.moves.length - 4][0] &&
          this.moves[this.moves.length - 2][0] ===
            this.moves[this.moves.length - 6][0] &&
          this.moves[this.moves.length - 4][0] ===
            this.moves[this.moves.length - 6][0]) ||
        (this.moves[this.moves.length - 1][1] ===
          this.moves[this.moves.length - 3][1] &&
          this.moves[this.moves.length - 5][1] ===
            this.moves[this.moves.length - 3][1] &&
          this.moves[this.moves.length - 1][1] ===
            this.moves[this.moves.length - 5][1]) ||
        (this.moves[this.moves.length - 2][1] ===
          this.moves[this.moves.length - 4][1] &&
          this.moves[this.moves.length - 2][1] ===
            this.moves[this.moves.length - 6][1] &&
          this.moves[this.moves.length - 4][1] ===
            this.moves[this.moves.length - 6][1])
      ) {
        this.gameOver = true;
      }
    }
    return;
  }

  getBoard() {
    return this.board;
  }
  getMoves() {
    return this.moves;
  }
  init() {
    let initMoves = moves;
    initMoves = [];
    for (let move of initMoves) {
      this.addMove(move[0]);
      if (move[1] !== "") {
        this.addMove(move[1]);
      }
    }
  }
}
