import ChessMove from "./chessmove";
import constants from "./constants";
import knightMove from "./knightmovement.json";
import kingMove from "./kingmovements.json";
import bishopMove from "./bishopmovements.json";
import rookMove from "./rookmovements.json";
import queenMove from "./queenmovemements.json";
import castleMovements from "./castlemovements.json";
let didKingMove = [false, false];
export default class ChessBoard {
  constructor(board) {
    this.board = board;
  }
  /*The following function sets up the different 
  parts of the constant move that are possible to
   set up like what color and the end position of 
   the move depending on the kind of move and 
   using the notation that user inputs.*/
  parseNotation(notation, color) {
    const move = new ChessMove();
    move.color = color;
    if (notation === "O-O" || notation === "O-O-O") {
      if (notation === "O-O") {
        move.castle = 1;
      } else if (notation === "O-O-O") {
        move.castle = 2;
      }
      return move;
    }
    if (notation[notation.length - 2] === "=") {
      move.pawnPromotion[0] = true;
      move.pawnPromotion[1] = notation[notation.length - 1];
      notation = notation.substring(0, notation.length - 2);
    }
    let endString;
    let startString;
    const notationSplit = notation.split("x");
    if (notationSplit.length === 2) {
      move.cross = true;
      endString = notationSplit[1];
      startString = notationSplit[0];
    } else {
      endString = notation.substring(notation.length - 2);
      startString = notation.substring(0, notation.length - 2);
    }
    const first = startString[0];
    if (
      first === constants.KNIGHT ||
      first === constants.BISHOP ||
      first === constants.ROOK ||
      first === constants.QUEEN ||
      first === constants.KING
    ) {
      move.startpiece = first;
      startString = startString.substring(1);
    } else if (
      typeof first === "undefined" ||
      first === "a" ||
      first === "b" ||
      first === "c" ||
      first === "d" ||
      first === "e" ||
      first === "f" ||
      first === "g" ||
      first === "h"
    ) {
      move.startpiece = constants.PAWN;
      if (move.cross === true) {
        move.startLetterVal = this.getLetterValue(startString[0]);
      }
    } else {
      return false;
    }
    move.endLetterVal = this.getLetterValue(endString[0]);
    move.endNumVal = this.getNumberValue(endString[1]);
    this.findStartPosition(move, startString);
    return move;
  }
  /*The following function gets what color the 
  piece is at a certain square of the board. */
  getColor(move) {
    let endPiece = this.board[move.endNumVal][move.endLetterVal];
    return endPiece[0];
  }
  /*The following function checks for the
  validity if a certain move could be made
  or not. If the move is invalid, it will 
  return false to the makeMove() function. 
 */
  isValidMove(move, previousMove) {
    if (move.castle !== 0) {
      if (!this.isValidCastleMove(move)) {
        return false;
      } else {
        return true;
      }
    }
    if (
      isNaN(move.endLetterVal) ||
      isNaN(move.endNumVal) ||
      isNaN(move.startLetterVal) ||
      isNaN(move.startNumVal)
    ) {
      return false;
    }
    if (
      move.startLetterVal < 0 ||
      move.startLetterVal > 7 ||
      move.startNumVal < 0 ||
      move.startNumVal > 7 ||
      move.endLetterVal < 0 ||
      move.endLetterVal > 7 ||
      move.endNumVal < 0 ||
      move.endNumVal > 7
    ) {
      return false;
    }

    if (previousMove === "" && move.cross === true) {
      return false;
    }
    if (move.pawnPromotion[0] && move.pawnPromotion[1] !== "") {
      if (!this.pawnPromotion(move)) {
        return false;
      } else {
        return true;
      }
    }

    if (move.startpiece !== "P" && move.cross === true) {
      if (move.color === 0) {
        if (this.board[move.endNumVal][move.endLetterVal][0] === "l") {
          return false;
        }
      } else {
        if (this.board[move.endNumVal][move.endLetterVal][0] === "d") {
          return false;
        }
      }
    }
    if (move.startpiece === "P") {
      if (move.color === 0) {
        if (this.board[move.startNumVal][move.startLetterVal] !== "lp") {
          return false;
        }
      } else {
        if (this.board[move.startNumVal][move.startLetterVal] !== "dp") {
          return false;
        }
      }
    }
    if (move.startpiece === "P" && move.cross === true) {
      if (
        Math.abs(move.startLetterVal - move.endLetterVal) === 1 &&
        Math.abs(move.startNumVal - move.endNumVal) === 1 &&
        this.board[move.endNumVal][move.endLetterVal] !== ""
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (
      move.startpiece !== "P" &&
      move.cross === false &&
      this.board[move.endNumVal][move.endLetterVal] !== ""
    ) {
      return false;
    } else if (move.cross === true) {
      if (
        (this.board[move.endNumVal][move.endLetterVal] === "" &&
          this.getColor(move) === move.color) ||
        this.board[move.endNumVal][move.endLetterVal] === ""
      ) {
        return false;
      }
    }
    if (move.cross === true) {
      if (move.startpiece === "B") {
        if (!this.isPieceValidMove(move, bishopMove)) {
          return false;
        }
      } else if (move.startpiece === "R") {
        if (!this.isPieceValidMove(move, rookMove)) {
          return false;
        }
      } else if (move.startpiece === "Q") {
        if (!this.isPieceValidMove(move, queenMove)) {
          return false;
        }
      } else if (move.startpiece === "N") {
        if (!this.isKingKnightValidMove(move, knightMove)) {
          return false;
        }
      } else if (move.startpiece === "K") {
        if (!this.isKingKnightValidMove(move, kingMove)) {
          return false;
        }
      }
    }
    return true;
  }
  /*The following function checks for the validity
  of castling. It will return true or false to
  isValidMove() based on if the move is valid
  or not. */
  isValidCastleMove(move) {
    if (
      isNaN(move.endLetterVal) ||
      isNaN(move.endNumVal) ||
      isNaN(move.startLetterVal) ||
      isNaN(move.startNumVal)
    ) {
      return false;
    }
    if (didKingMove[move.color]) {
      return false;
    }
    let notation;
    if (move.castle === 1) {
      notation = "O-O";
    } else if (move.castle === 2) {
      notation = "O-O-O";
    }
    for (let castleMove of castleMovements) {
      if (castleMove.notation === notation && castleMove.color === move.color) {
        for (
          let i = 0;
          i <
          Math.abs(
            castleMove.kingStartPosition.letter -
              castleMove.rookStartPosition.letter
          );
          i++
        ) {
          if (
            this.board[castleMove.kingEndPosition.number][
              castleMove.kingEndPosition.letter
            ] === "" &&
            this.board[castleMove.rookEndPosition.number][
              castleMove.rookEndPosition.letter
            ] === ""
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
  /*The following function checks for the validity
  of a normal king or knight move. It will return 
  true or false to isValidMove() based on if the 
  move is valid or not. */
  isKingKnightValidMove(move, movements) {
    for (let movement of movements) {
      const startNumber = move.startNumVal + movement[0];
      const startLetter = move.startLetterVal + movement[1];

      if (
        startNumber < 0 ||
        startNumber > 7 ||
        startLetter < 0 ||
        startLetter > 7
      ) {
        continue;
      }

      if (this.board[startNumber][startLetter] === "") {
        continue;
      } else if (
        startNumber === move.endNumVal &&
        startLetter === move.endLetterVal
      ) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
  /*The following function checks for the validity
  of bishop, rook, and queen moves. It will return 
  true or false to isValidMove() based on if the 
  move is valid or not. */
  isPieceValidMove(move, fourMovements) {
    for (let movement of fourMovements) {
      let startNumVal = move.startNumVal;
      let startLetterVal = move.startLetterVal;
      while (true) {
        startNumVal += movement[0];
        startLetterVal += movement[1];

        if (
          startNumVal < 0 ||
          startNumVal > 7 ||
          startLetterVal < 0 ||
          startLetterVal > 7
        ) {
          break;
        }
        if (this.board[startNumVal][startLetterVal] === "") {
          continue;
        } else if (
          startNumVal === move.endNumVal &&
          startLetterVal === move.endLetterVal
        ) {
          return true;
        } else {
          break;
        }
      }
    }
    return false;
  }
  /*The following function will make the move
  on the board if isValidMove(), the rule of
  enPassant and Promotion, and check and checkmate
  are valid. It is called in chessgame.js. */
  makeMove(move, previousMove) {
    const copyBoard = JSON.parse(JSON.stringify(this.board));
    if (this.DoEnPassant(move, previousMove)) {
      return true;
    }
    if (this.pawnPromotion(move)) {
      return true;
    }
    if (!this.isValidMove(move, previousMove)) {
      return false;
    }
    if (move.castle !== 0) {
      if (this.isCheck(move.color === 0 ? 1 : 0)) {
        return false;
      } else {
        return this.MakeCastleMove(move);
      }
    }
    this.board[move.startNumVal][move.startLetterVal] = "";
    this.board[move.endNumVal][move.endLetterVal] =
      (move.color === constants.WHITE ? "l" : "d") +
      move.startpiece.toLowerCase();
    if (this.isCheck(move.color === 0 ? 1 : 0)) {
      this.board.splice(0, this.board.length, ...copyBoard);
      return false;
    }
    return true;
  }
  /*The following function will return the
  number value of a piece on the board
  using the number value of the notation.*/
  getNumberValue(numVal) {
    const val = 8 - parseInt(numVal, 10);
    if (typeof val === "undefined" || val < 0 || val > 7) {
      return -1;
    } else {
      return val;
    }
  }
  /*The following function will return the
  letter value of a piece on the board
  using the letter value of the notation.*/
  getLetterValue(letterVal) {
    const value = letterVal.charCodeAt() - "a".charCodeAt();
    if (value < 0 || value > 7) {
      return -1;
    } else {
      return value;
    }
  }
  /*The following function will call 
  the function that finds the start
  position for a certain piece by 
  checking the startpiece of the move.*/
  findStartPosition(move, startString) {
    switch (move.startpiece) {
      case constants.PAWN:
        this.findPawnStartPosition(move);
        break;
      case constants.KNIGHT:
        this.findKnightKingStartPosition(move, startString, knightMove, [
          "ln",
          "dn",
        ]);
        break;
      case constants.BISHOP:
        this.findPieceStartPosition(move, startString, bishopMove, [
          "lb",
          "db",
        ]);
        break;
      case constants.ROOK:
        this.findPieceStartPosition(move, startString, rookMove, ["lr", "dr"]);
        break;
      case constants.QUEEN:
        this.findPieceStartPosition(move, startString, queenMove, ["lq", "dq"]);
        break;
      case constants.KING:
        this.findKnightKingStartPosition(move, startString, kingMove, [
          "lk",
          "dk",
        ]);
        break;
      default:
        this.MakeCastleMove(move);
    }
  }
  /*The following function will find the
  start position of a pawn. */
  findPawnStartPosition(move) {
    if (
      isNaN(move.endLetterVal) ||
      isNaN(move.endNumVal) ||
      isNaN(move.startLetterVal) ||
      isNaN(move.startNumVal)
    ) {
      return false;
    }
    if (
      move.endLetterVal < 0 ||
      move.endNumVal < 0 ||
      move.endLetterVal > 7 ||
      move.endNumVal > 7
    ) {
      return false;
    }
    let startNumber;
    if (move.cross === true) {
      this.findPawnCrossStartPosition(move);
    } else {
      startNumber = 0;
      if (move.color === 0) {
        if (move.endNumVal === 4) {
          if (this.board[move.endNumVal + 1][move.endLetterVal]) {
            startNumber = 5;
          } else {
            startNumber = 6;
          }
        } else {
          if (move.endNumVal + 1 > 7 || move.endNumVal + 1 < 0) {
            return false;
          }
          if (this.board[move.endNumVal + 1][move.endLetterVal]) {
            startNumber = move.endNumVal + 1;
          }
        }
      } else {
        if (move.endNumVal === 3) {
          if (this.board[move.endNumVal - 1][move.endLetterVal]) {
            startNumber = 2;
          } else {
            startNumber = 1;
          }
        } else {
          if (move.endNumVal - 1 > 7 || move.endNumVal - 1 < 0) {
            return false;
          }
          if (this.board[move.endNumVal - 1][move.endLetterVal]) {
            startNumber = move.endNumVal - 1;
          }
        }
      }
      move.startLetterVal = move.endLetterVal;
      move.startNumVal = startNumber;
      if (move.startLetterVal === -1 || move.startNumVal === -1) {
        return false;
      }
    }
  }
  /*The following function will find the
  start position of a pawn that takes 
  another piece. */
  findPawnCrossStartPosition(move) {
    move.startNumVal =
      move.color === 0 ? move.endNumVal + 1 : move.endNumVal - 1;
    if (move.startLetterVal === -1 || move.startNumVal === -1) {
      return false;
    }
  }
  /*The following function will do the
  enPassant move if it's valid and return
  true or false to makeMove() depending
  whether the move is valid or not. */
  DoEnPassant(move, previousMove) {
    if (previousMove === "" && move.cross === true) {
      return false;
    }
    if (move.cross === false) {
      if (move.color === 0) {
        if (move.startNumVal === 6 && move.endNumVal === 4) {
          if (
            this.board[move.startNumVal][move.endLetterVal + 1] === "dp" ||
            this.board[move.startNumVal][move.endLetterVal - 1] === "dp"
          ) {
            previousMove.endNumVal = move.endNumVal;
            previousMove.endLetterVal = move.endLetterVal;
          }
        }
      } else {
        if (move.startNumVal === 1 && move.endNumVal === 3) {
          if (
            this.board[move.startNumVal][move.endLetterVal - 1] === "lp" ||
            this.board[move.startNumVal][move.endLetterVal + 1] === "lp"
          ) {
            previousMove.endNumVal = move.endNumVal;
            previousMove.endLetterVal = move.endLetterVal;
          }
        }
      }
    }
    if (move.cross === true) {
      if (move.color === 0) {
        if (
          (move.startNumVal - 1 === move.endNumVal &&
            move.startLetterVal - 1 === move.endLetterVal) ||
          (move.startNumVal - 1 === move.endNumVal &&
            move.startLetterVal + 1 === move.endLetterVal)
        ) {
          if (this.board[move.endNumVal][move.endLetterVal] === "") {
            this.board[move.endNumVal][move.endLetterVal] = "lp";
            this.board[move.startNumVal][move.startLetterVal] = "";
            this.board[previousMove.endNumVal][previousMove.endLetterVal] = "";
            return true;
          }
        }
      } else {
        if (
          (move.startNumVal + 1 === move.endNumVal &&
            move.startLetterVal + 1 === move.endLetterVal) ||
          (move.startNumVal + 1 === move.endNumVal &&
            move.startLetterVal - 1 === move.endLetterVal)
        ) {
          if (this.board[move.endNumVal][move.endLetterVal] === "") {
            this.board[move.endNumVal][move.endLetterVal] = "dp";
            this.board[move.startNumVal][move.startLetterVal] = "";
            this.board[previousMove.endNumVal][previousMove.endLetterVal] = "";
            return true;
          }
        }
      }
    }
    return false;
  }
  /*The following function will find the
  start position of a king or knight. */
  findKnightKingStartPosition(move, startString, movements, piece) {
    if (
      isNaN(move.endLetterVal) ||
      isNaN(move.endNumVal) ||
      isNaN(move.startLetterVal) ||
      isNaN(move.startNumVal)
    ) {
      return false;
    }
    if (move.endLetterVal === -1 || move.endLetterVal === -1) {
      return false;
    }
    if (startString.length === 2) {
      move.startLetterVal = this.getLetterValue(startString[0]);
      move.startNumVal = this.getNumberValue(startString[1]);
      return;
    } else if (startString.length === 1) {
      if (isNaN(parseInt(startString)))
        move.startLetterVal = this.getLetterValue(startString);
      else {
        move.startNumVal = this.getNumberValue(startString);
      }
    }

    for (let movement of movements) {
      const startNumber = move.endNumVal + movement[0];
      const startLetter = move.endLetterVal + movement[1];

      if (
        startNumber < 0 ||
        startNumber > 7 ||
        startLetter < 0 ||
        startLetter > 7
      ) {
        continue;
      }

      if (
        (startLetter !== move.startLetterVal && move.startLetterVal !== -1) ||
        (startNumber !== move.startNumVal && move.startNumVal !== -1)
      ) {
        continue;
      }

      if (this.board[startNumber][startLetter] === piece[move.color]) {
        if (move.startpiece === "K") {
          didKingMove[move.color] = true;
        }
        move.startLetterVal = startLetter;
        move.startNumVal = startNumber;
        return true;
      }
    }
    if (move.startLetterVal === -1 || move.startNumVal === -1) {
      return false;
    }
  }
  /*The following function will find the
  start position of a bishop, rook, or queen. */
  findPieceStartPosition(move, startString, fourMovements, piece) {
    if (
      isNaN(move.endLetterVal) ||
      isNaN(move.endNumVal) ||
      isNaN(move.startLetterVal) ||
      isNaN(move.startNumVal)
    ) {
      return false;
    }
    if (move.endLetterVal === -1 || move.endLetterVal === -1) {
      return false;
    }
    if (startString.length === 2) {
      move.startLetterVal = this.getLetterValue(startString[0]);
      move.startNumVal = this.getNumberValue(startString[1]);
      return true;
    } else if (startString.length === 1) {
      if (isNaN(startString)) {
        move.startLetterVal = this.getLetterValue(startString);
      } else {
        move.startNumVal = this.getNumberValue(startString);
      }
    }

    for (let movement of fourMovements) {
      let startNumVal = move.endNumVal;
      let startLetterVal = move.endLetterVal;
      while (true) {
        startNumVal += movement[0];
        startLetterVal += movement[1];

        if (
          startNumVal < 0 ||
          startNumVal > 7 ||
          startLetterVal < 0 ||
          startLetterVal > 7
        ) {
          break;
        }
        if (
          (startLetterVal !== move.startLetterVal &&
            move.startLetterVal !== -1) ||
          (startNumVal !== move.startNumVal && move.startNumVal !== -1)
        ) {
          continue;
        }
        if (this.board[startNumVal][startLetterVal] === piece[move.color]) {
          move.startLetterVal = startLetterVal;
          move.startNumVal = startNumVal;
          return true;
        }
        if (this.board[startNumVal][startLetterVal] !== "") {
          break;
        }
      }
    }
    if (move.startLetterVal === -1 || move.startNumVal === -1) {
      return false;
    }
    return true;
  }
  /*The following function will make the
  castle move after isValidCastleMove() is
  checked.  */
  MakeCastleMove(move) {
    const copyBoard = JSON.parse(JSON.stringify(this.board));
    if (
      isNaN(move.endLetterVal) ||
      isNaN(move.endNumVal) ||
      isNaN(move.startLetterVal) ||
      isNaN(move.startNumVal)
    ) {
      return false;
    }
    if (didKingMove[move.color]) {
      return false;
    }
    let notation;
    if (this.isCheck(move.color === 0 ? 1 : 0)) {
      move.castle = 0;
    }
    if (move.castle === 0) {
      return false;
    } else if (move.castle === 1) {
      notation = "O-O";
    } else if (move.castle === 2) {
      notation = "O-O-O";
    }
    for (let castleMove of castleMovements) {
      if (castleMove.notation === notation && castleMove.color === move.color) {
        if (move.color === 0) {
          this.board[castleMove.kingEndPosition.number][
            castleMove.kingEndPosition.letter
          ] = "lk";
          this.board[castleMove.rookEndPosition.number][
            castleMove.rookEndPosition.letter
          ] = "lr";
        } else {
          this.board[castleMove.kingEndPosition.number][
            castleMove.kingEndPosition.letter
          ] = "dk";
          this.board[castleMove.rookEndPosition.number][
            castleMove.rookEndPosition.letter
          ] = "dr";
        }
        this.board[castleMove.kingStartPosition.number][
          castleMove.kingStartPosition.letter
        ] = "";
        this.board[castleMove.rookStartPosition.number][
          castleMove.rookStartPosition.letter
        ] = "";
      } else {
        continue;
      }
    }
    if (this.isCheck(move.color === 0 ? 1 : 0)) {
      this.board.splice(0, this.board.length, ...copyBoard);
      return false;
    }
    return true;
  }
  /*The following function will check 
  if the opposite color king is in check
  using the current move color. */
  isCheck(color) {
    let kingNumPosition;
    let kingLetterPosition;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (color === 0) {
          if (this.board[i][j] === "dk") {
            kingNumPosition = i;
            kingLetterPosition = j;
          }
        } else if (color === 1) {
          if (this.board[i][j] === "lk") {
            kingNumPosition = i;
            kingLetterPosition = j;
          }
        }
      }
    }
    const colorCheck = ["l", "d"];
    for (let k = 0; k < this.board.length; k++) {
      for (let l = 0; l < this.board[k].length; l++) {
        if (this.board[k][l][0] === colorCheck[color]) {
          const tempMove = new ChessMove();
          tempMove.startpiece = this.board[k][l][1].toUpperCase();
          tempMove.startNumVal = k;
          tempMove.startLetterVal = l;
          tempMove.endNumVal = kingNumPosition;
          tempMove.endLetterVal = kingLetterPosition;
          tempMove.cross = true;
          tempMove.endpiece = constants.KING;
          tempMove.color = color;
          if (this.isValidMove(tempMove)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  /*The following function will return
  the outcome of whether the king is
  in checkmate by calling the different
  functions for isPawnCheckmate() and
  isPieceCheckmate(). */
  isCheckmate(move) {
    if (
      this.isPawnCheckmate(move, ["lp", "dp"]) &&
      this.isPieceCheckmate(move, knightMove, ["ln", "dn"]) &&
      this.isPieceCheckmate(move, bishopMove, ["lb", "db"]) &&
      this.isPieceCheckmate(move, rookMove, ["lr", "dr"]) &&
      this.isPieceCheckmate(move, queenMove, ["lq", "dq"]) &&
      this.isPieceCheckmate(move, kingMove, ["lk", "dk"])
    ) {
      return true;
    }
  }
  /*The following function will check whether
  the king is in checkmate by a pawn. */
  isPawnCheckmate(move, colors) {
    let color;
    if (move.color === 0) {
      color = 1;
    } else {
      color = 0;
    }
    let numPosition;
    let letterPosition;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === colors[color]) {
          if (this.board[i][j][0] === colors[color].substring(0, 1)) {
            numPosition = i;
            letterPosition = j;
            if (move.color === 0) {
              for (let i = 1; i < 3; i++) {
                const copyBoard = JSON.parse(JSON.stringify(this.board));
                if (
                  numPosition === 1 &&
                  this.board[numPosition][letterPosition][0] === colors[1][0]
                ) {
                  this.board[numPosition][letterPosition] = "";
                  if (numPosition + i < 0 || numPosition + i > 7) {
                    this.board.splice(0, this.board.length, ...copyBoard);
                    continue;
                  }
                  if (this.board[numPosition + i][letterPosition] === "") {
                    if (i === 2) {
                      if (this.board[numPosition + 1][letterPosition] !== "") {
                        this.board.splice(0, this.board.length, ...copyBoard);
                        continue;
                      }
                    }
                    this.board[numPosition + i][letterPosition] = colors[1];
                    if (this.isCheck(move.color === 0 ? 1 : 0)) {
                      this.board.splice(0, this.board.length, ...copyBoard);
                      continue;
                    }
                  } else {
                    this.board.splice(0, this.board.length, ...copyBoard);
                    continue;
                  }
                  if (!this.isCheck(move.color)) {
                    this.board.splice(0, this.board.length, ...copyBoard);
                    return false;
                  }
                }
                this.board.splice(0, this.board.length, ...copyBoard);
              }

              if (
                numPosition !== 1 &&
                this.board[numPosition][letterPosition][0] === colors[1][0]
              ) {
                const copyBoard = JSON.parse(JSON.stringify(this.board));
                if (this.board[numPosition + 1][letterPosition] === "") {
                  this.board[numPosition + 1][letterPosition] = colors[0];
                  if (this.isCheck(move.color === 0 ? 1 : 0)) {
                    this.board.splice(0, this.board.length, ...copyBoard);
                    continue;
                  }
                } else {
                  this.board.splice(0, this.board.length, ...copyBoard);
                  continue;
                }
                if (!this.isCheck(move.color)) {
                  this.board.splice(0, this.board.length, ...copyBoard);
                  return false;
                }
                this.board.splice(0, this.board.length, ...copyBoard);
              }
            } else {
              for (let i = 1; i < 3; i++) {
                const copyBoard = JSON.parse(JSON.stringify(this.board));
                if (
                  numPosition === 6 &&
                  this.board[numPosition][letterPosition][0] === colors[0][0]
                ) {
                  this.board[numPosition][letterPosition] = "";
                  if (numPosition - i < 0 || numPosition - i > 7) {
                    this.board.splice(0, this.board.length, ...copyBoard);
                  }
                  if (this.board[numPosition - i][letterPosition] === "") {
                    if (i === 2) {
                      if (this.board[numPosition - 1][letterPosition] !== "") {
                        this.board.splice(0, this.board.length, ...copyBoard);
                        continue;
                      }
                    }
                    this.board[numPosition - i][letterPosition] = colors[1];
                    if (this.isCheck(move.color === 0 ? 1 : 0)) {
                      this.board.splice(0, this.board.length, ...copyBoard);
                      continue;
                    }
                  } else {
                    this.board.splice(0, this.board.length, ...copyBoard);
                    continue;
                  }
                  if (!this.isCheck(move.color)) {
                    this.board.splice(0, this.board.length, ...copyBoard);
                    return false;
                  }
                }
                this.board.splice(0, this.board.length, ...copyBoard);
              }

              if (
                numPosition !== 6 &&
                this.board[numPosition][letterPosition][0] === colors[0][0]
              ) {
                const copyBoard = JSON.parse(JSON.stringify(this.board));
                this.board[numPosition][letterPosition] = "";
                if (this.board[numPosition - 1][letterPosition] === "") {
                  this.board[numPosition - 1][letterPosition] = colors[0];
                  if (this.isCheck(move.color === 0 ? 1 : 0)) {
                    this.board.splice(0, this.board.length, ...copyBoard);
                    continue;
                  }
                } else {
                  this.board.splice(0, this.board.length, ...copyBoard);
                }

                if (!this.isCheck(move.color)) {
                  this.board.splice(0, this.board.length, ...copyBoard);
                  return false;
                }
                this.board.splice(0, this.board.length, ...copyBoard);
              }
            }
          }
        }
      }
    }
    return true;
  }
  /*The following function will check
  if the king is in checkmate by any
  piece that is not a pawn and check
  whether the king can itself move, 
  which will result in the king not 
  being in checkmate. */
  isPieceCheckmate(move, movements, colors) {
    const copyBoard = JSON.parse(JSON.stringify(this.board));
    let numPosition;
    let letterPosition;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (move.color === 0) {
          if (this.board[i][j] === colors[1]) {
            numPosition = i;
            letterPosition = j;
          }
        } else if (move.color === 1) {
          if (this.board[i][j] === colors[0]) {
            numPosition = i;
            letterPosition = j;
          }
        }
      }
    }
    this.board[numPosition][letterPosition] = "";
    for (let movement of movements) {
      const np = numPosition + movement[0];
      const lp = letterPosition + movement[1];
      if (np < 0 || np > 7 || lp < 0 || lp > 7) {
        continue;
      }
      if (
        this.board[np][lp] === "" ||
        (move.color === 0
          ? this.board[np][lp][0] === "l"
          : this.board[np][lp][0] === "d")
      ) {
        if (move.color === 0) {
          if (this.board[np][lp][0] === "l" || this.board[np][lp] === "") {
            this.board[np][lp] = colors[1];
            this.board[numPosition][letterPosition] = "";
            if (!this.isCheck(move.color)) {
              this.board.splice(0, this.board.length, ...copyBoard);
              return false;
            }
          }
        } else {
          if (this.board[np][lp][0] === "d" || this.board[np][lp] === "") {
            this.board[np][lp] = colors[0];
            this.board[numPosition][letterPosition] = "";
            if (!this.isCheck(move.color)) {
              this.board.splice(0, this.board.length, ...copyBoard);
              return false;
            }
          }
        }
        this.board.splice(0, this.board.length, ...copyBoard);
        continue;
      }
    }
    this.board.splice(0, this.board.length, ...copyBoard);
    return true;
  }
  /*The following function will check for
  and do pawnPromotion() if all rules
  are valid for the move. */
  pawnPromotion(move) {
    if (
      isNaN(move.endLetterVal) ||
      isNaN(move.endNumVal) ||
      isNaN(move.startLetterVal) ||
      isNaN(move.startNumVal)
    ) {
      return false;
    }
    if (
      move.startLetterVal < 0 ||
      move.startLetterVal > 7 ||
      move.startNumVal < 0 ||
      move.startNumVal > 7 ||
      move.endLetterVal < 0 ||
      move.endLetterVal > 7 ||
      move.endNumVal < 0 ||
      move.endNumVal > 7
    ) {
      return false;
    }
    if (move.startpiece === "P") {
      if (move.color === 0) {
        if (
          this.board[move.endNumVal][move.endLetterVal] === "" ||
          (this.board[move.endNumVal][move.endLetterVal][0] === "d" &&
            this.board[move.endNumVal][move.endLetterVal] !== "dk")
        ) {
          if (move.endNumVal === 0) {
            this.board[move.endNumVal][move.endLetterVal] =
              "l" + move.pawnPromotion[1].toLowerCase();
            this.board[move.startNumVal][move.startLetterVal] = "";
            return true;
          }
        }
      } else {
        if (
          this.board[move.endNumVal][move.endLetterVal] === "" ||
          (this.board[move.endNumVal][move.endLetterVal][0] === "l" &&
            this.board[move.endNumVal][move.endLetterVal] !== "lk")
        ) {
          if (move.endNumVal === 7) {
            this.board[move.endNumVal][move.endLetterVal] =
              "d" + move.pawnPromotion[1].toLowerCase();
            this.board[move.startNumVal][move.startLetterVal] = "";
            return true;
          }
        }
      }
    }
  }
}
