import "./chessboard.css";
import moves from "./moves.json";
import board from "./board.json";
import pieces from "./pieces.json";
import knightEightMovements from "./knightmovement.json";

function knightMove(notation, color) {
  let letterVal = getLetterValue(notation[1]);
  let numVal = getNumberValue(notation[2]);
  let letterFromWhere = -1;
  if (notation[notation.length - 3] === "x") {
    if (notation.length !== 5) {
      letterFromWhere = -1;
    } else {
      letterFromWhere = getLetterValue(notation[1]);
    }
    letterVal = getLetterValue(notation[notation.length - 2]);
    numVal = getNumberValue(notation[notation.length - 1]);
  } else if (notation.length === 4) {
    letterFromWhere = getLetterValue(notation[1]); //1
    letterVal = getLetterValue(notation[2]); //2
    numVal = getNumberValue(notation[3]); //2
  }
  for (let movement of knightEightMovements) {
    const startNumber = numVal + movement[0];
    const startLetter = letterVal + movement[1];
    if (
      startNumber < 0 ||
      startNumber > 7 ||
      startLetter < 0 ||
      startLetter > 7
    ) {
      continue;
    }
    if (startLetter !== letterFromWhere && letterFromWhere !== -1) {
      continue;
    }
    const knights = ["ln", "dn"];
    if (board[startNumber][startLetter] === knights[color]) {
      console.log(startNumber, startLetter, numVal, letterVal);
      board[startNumber][startLetter] = "";
      board[numVal][letterVal] = knights[color];
      break;
    }
  }
}
function getNumberValue(numVal) {
  return 8 - parseInt(numVal, 10);
}
function getLetterValue(letterVal) {
  return letterVal.charCodeAt() - "a".charCodeAt();
}
function isDarkPiece(piece) {
  if (piece !== "" && piece[0] === "d") {
    return true;
  }
  return false;
}
function isLightPiece(piece) {
  if (piece !== "" && piece[0] === "l") {
    return true;
  }
  return false;
}
function findPawnPosition(targetNum, targetLetter, color) {
  let currentNum = 0;
  if (color === 0) {
    if (targetNum === 4) {
      if (board[targetNum + 1][targetLetter]) {
        currentNum = 5;
      } else {
        currentNum = 6;
      }
    } else {
      if (board[targetNum + 1][targetLetter]) {
        currentNum = targetNum + 1;
      }
    }
  } else {
    if (targetNum === 3) {
      if (board[targetNum - 1][targetLetter]) {
        currentNum = 2;
      } else {
        currentNum = 1;
      }
    } else {
      if (board[targetNum - 1][targetLetter]) {
        currentNum = targetNum - 1;
      }
    }
  }

  return currentNum;
}

function pawnCrossMove(notation, color) {
  const endLetterVal = getLetterValue(notation[2]);
  const endNumberVal = getNumberValue(notation[3]);
  const startLetterVal = getLetterValue(notation[0]);
  const startNumberVal = color === 1 ? endNumberVal - 1 : endNumberVal + 1;
  if (color === 0) {
    if (
      (startLetterVal - endLetterVal === 1 ||
        startLetterVal - endLetterVal === -1) &&
      (startNumberVal - endNumberVal === 1 ||
        startNumberVal - endNumberVal === -1)
    ) {
      if (
        board[startNumberVal][startLetterVal] !== "" &&
        isDarkPiece(board[endNumberVal][endLetterVal])
      ) {
        board[startNumberVal][startLetterVal] = "";
        board[endNumberVal][endLetterVal] = "lp";
      }
    }
  } else {
    if (
      (startLetterVal - endLetterVal === 1 ||
        startLetterVal - endLetterVal === -1) &&
      (startNumberVal - endNumberVal === 1 ||
        startNumberVal - endNumberVal === -1)
    ) {
      if (
        board[startNumberVal][startLetterVal] !== "" &&
        isLightPiece(board[endNumberVal][endLetterVal])
      ) {
        board[startNumberVal][startLetterVal] = "";
        board[endNumberVal][endLetterVal] = "dp";
      }
    }
  }
}
function isEligiblePawn(color, targetNumber, beforeNumber, letterVal) {
  if (board[targetNumber][letterVal] !== "") {
    return false;
  }
  if (color === 0) {
    if (board[beforeNumber][letterVal] !== "lp") {
      return false;
    }
  } else {
    if (board[beforeNumber][letterVal] !== "dp") {
      return false;
    }
  }
  return true;
}
function pawnMove(notation, color) {
  const letterVal = getLetterValue(notation[0]);
  const numVal = getNumberValue(notation[1]);
  const currentNum = findPawnPosition(numVal, letterVal, color);
  if (!isEligiblePawn(color, numVal, currentNum, letterVal)) {
    return;
  }
  if (color === 0) {
    board[numVal][letterVal] = "lp";
  } else {
    board[numVal][letterVal] = "dp";
  }
  board[currentNum][letterVal] = "";
}

function Move(notation, color) {
  if (notation.indexOf("x") !== -1) {
    const first = notation[0];
    if (first === "N") {
      knightMove(notation, color);
    }
    if (
      "a".charCodeAt() <= first.charCodeAt() &&
      first.charCodeAt() <= "h".charCodeAt()
    ) {
      pawnCrossMove(notation, color);
    }
  } else if (notation.length === 2) {
    pawnMove(notation, color);
  } else {
    knightMove(notation, color);
  }
}

function renderColumn(column, keyValue) {
  const isEmpty = column !== "";
  return (
    <span key={keyValue}>
      {isEmpty && (
        <img
          style={{ width: "12.5%" }}
          alt={pieces[column]}
          src={pieces[column]}
        ></img>
      )}
      {!isEmpty && (
        <span style={{ width: "12.5%", display: "inline-block" }}></span>
      )}
    </span>
  );
}

function renderRow(row, rowIndex) {
  let keyValue = (rowIndex + 1) * 8;
  return (
    <div key={rowIndex} style={{ height: "12.5%" }}>
      {row.map((column) => {
        return renderColumn(column, keyValue++);
      })}
    </div>
  );
}
for (let move of moves) {
  Move(move[0], 0);
  Move(move[1], 1);
}

function Chessboard() {
  return (
    <div className="chessboard">
      {board.map((row, index) => {
        return renderRow(row, index);
      })}
    </div>
  );
}

export default Chessboard;
