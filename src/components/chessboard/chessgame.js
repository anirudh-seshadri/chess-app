import moves from "./moves.json";
import board from "./board.json";
import { makeAutoObservable } from "mobx";
import Chessboard from "./chessboard";
import Openings from "./openingtree";

export default class ChessGame {
  constructor() {
    makeAutoObservable(this);
    this.moves = moves;
    this.board = board;
    this.openingName = "";
    this.chessboard = new Chessboard(this.board);
    this.openings = new Openings();
    this.openings.createTree();
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
          console.log("checkmate");
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
    return;
  }

  getBoard() {
    return this.board;
  }
  getMoves() {
    return this.moves;
  }
  init() {
    for (let move of this.moves) {
      this.Move(move[0], 0);
      this.Move(move[1], 1);
    }
  }
}
