import "./chessboard.css";
import { Container, Row, Col, Nav, Table, tr, td } from "react-bootstrap";
import moves from "./moves.json";
import board from "./board.json";
import pieces from "./pieces.json";
import knightEightMovements from "./knightmovement.json";
let didKingMove = [false, false];
const castleMoves = [
  {
    notation: "O-O",
    color: 0,
    kingStartPosition: { number: 7, letter: 4 },
    rookStartPosition: { number: 7, letter: 7 },
    kingEndPosition: { number: 7, letter: 6 },
    rookEndPosition: { number: 7, letter: 5 },
  },
  {
    notation: "O-O",
    color: 1,
    kingStartPosition: { number: 0, letter: 4 },
    rookStartPosition: { number: 0, letter: 7 },
    kingEndPosition: { number: 0, letter: 6 },
    rookEndPosition: { number: 0, letter: 5 },
  },
  {
    notation: "O-O-O",
    color: 0,
    kingStartPosition: { number: 7, letter: 4 },
    rookStartPosition: { number: 7, letter: 0 },
    kingEndPosition: { number: 7, letter: 2 },
    rookEndPosition: { number: 7, letter: 3 },
  },
  {
    notation: "O-O-O",
    color: 1,
    kingStartPosition: { number: 0, letter: 4 },
    rookStartPosition: { number: 0, letter: 0 },
    kingEndPosition: { number: 0, letter: 2 },
    rookEndPosition: { number: 0, letter: 3 },
  },
];
function castleMove(notation, color) {
  if (didKingMove[color]) {
    return;
  }
  for (let castleMove of castleMoves) {
    if (castleMove.notation === notation && castleMove.color === color) {
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
          board[castleMove.kingEndPosition.number][
            castleMove.kingEndPosition.letter
          ] === "" &&
          board[castleMove.rookEndPosition.number][
            castleMove.rookEndPosition.letter
          ] === ""
        ) {
          board[castleMove.kingEndPosition.number][
            castleMove.kingEndPosition.letter
          ] =
            board[castleMove.kingStartPosition.number][
              castleMove.kingStartPosition.letter
            ];
          board[castleMove.kingStartPosition.number][
            castleMove.kingStartPosition.letter
          ] = "";
          board[castleMove.rookEndPosition.number][
            castleMove.rookEndPosition.letter
          ] =
            board[castleMove.rookStartPosition.number][
              castleMove.rookStartPosition.letter
            ];
          board[castleMove.rookStartPosition.number][
            castleMove.rookStartPosition.letter
          ] = "";
        }
      }
    }
  }
}
function kingMove(notation, color) {
  const kings = ["lk", "dk"];
  let letterVal = getLetterValue(notation[1]);
  let numVal = getNumberValue(notation[2]);
  if (notation[notation.length - 3] === "x") {
    letterVal = getLetterValue(notation[notation.length - 2]);
    numVal = getNumberValue(notation[notation.length - 1]);
  }
  let kingEightMovements = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 1],
    [-1, 0],
    [-1, 1],
  ];
  for (let movement of kingEightMovements) {
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
    if (board[startNumber][startLetter] === kings[color]) {
      didKingMove[color] = true;
      board[startNumber][startLetter] = "";
      board[numVal][letterVal] = kings[color];
      break;
    }
  }
}
function pieceMove(notation, color, fourMovements, piece) {
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
    if (board[numVal][letterVal] !== "") {
      return;
    }
    letterFromWhere = getLetterValue(notation[1]);
    letterVal = getLetterValue(notation[2]);
    numVal = getNumberValue(notation[3]);
  } else if (board[numVal][letterVal] !== "") {
    return;
  }

  for (let movement of fourMovements) {
    let startNumVal = numVal;
    let startLetterVal = letterVal;
    while (true) {
      startNumVal += movement[0];
      startLetterVal += movement[1];

      if (
        startNumVal > 7 ||
        startLetterVal > 7 ||
        startNumVal < 0 ||
        startLetterVal < 0
      ) {
        break;
      }
      if (startLetterVal !== letterFromWhere && letterFromWhere !== -1) {
        continue;
      }
      if (board[startNumVal][startLetterVal] === piece[color]) {
        board[startNumVal][startLetterVal] = "";
        board[numVal][letterVal] = piece[color];
      }
      if (board[startNumVal][startLetterVal] !== "") {
        break;
      }
    }
  }
}
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
    letterFromWhere = getLetterValue(notation[1]);
    letterVal = getLetterValue(notation[2]);
    numVal = getNumberValue(notation[3]);
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
    } else if (first === "B") {
      pieceMove(
        notation,
        color,
        [
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, -1],
        ],
        ["lb", "db"]
      );
    } else if (first === "R") {
      pieceMove(
        notation,
        color,
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ],
        ["lr", "dr"]
      );
    } else if (first === "Q") {
      pieceMove(
        notation,
        color,
        [
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, -1],
        ],
        ["lq", "dq"]
      );
      pieceMove(
        notation,
        color,
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ],
        ["lq", "dq"]
      );
    } else if (first === "K") {
      kingMove(notation, color);
    }
    if (
      "a".charCodeAt() <= first.charCodeAt() &&
      first.charCodeAt() <= "h".charCodeAt()
    ) {
      pawnCrossMove(notation, color);
    }
  } else if (notation.length === 2) {
    pawnMove(notation, color);
  } else if (
    notation[0] === "N" &&
    (notation.length === 3 || notation.length === 4)
  ) {
    knightMove(notation, color);
  } else if (notation[0] === "K") {
    kingMove(notation, color);
  } else {
    if (notation[0] === "B") {
      pieceMove(
        notation,
        color,
        [
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, -1],
        ],
        ["lb", "db"]
      );
    } else if (notation[0] === "R") {
      pieceMove(
        notation,
        color,
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ],
        ["lr", "dr"]
      );
    } else if (notation[0] === "Q") {
      pieceMove(
        notation,
        color,
        [
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, -1],
        ],
        ["lq", "dq"]
      );
      pieceMove(
        notation,
        color,
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ],
        ["lq", "dq"]
      );
    }
    castleMove(notation, color);
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
    <Container>
      <Row>
        <Col md={2} className="my-4">
          <div className="wrapper">
            <Nav
              defaultActiveKey="/home"
              className="sidebar flex-column bg-light"
            >
              <Nav.Link className="l home" href="/home">
                <p
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 30,
                  }}
                >
                  Home
                </p>
              </Nav.Link>
              <Nav.Link className="l play" eventKey="link-1">
                <p
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 30,
                  }}
                >
                  Play
                </p>
              </Nav.Link>
              <Nav.Link className="l puzzles" eventKey="link-2">
                <p
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 30,
                  }}
                >
                  Puzzles
                </p>
              </Nav.Link>
              <Nav.Link className="l learn" eventKey="disabled">
                <p
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 30,
                  }}
                >
                  Learn
                </p>
              </Nav.Link>
            </Nav>
          </div>
        </Col>
        <Col md={6}>
          <div className="chessboard">
            {board.map((row, index) => {
              return renderRow(row, index);
            })}
          </div>
        </Col>
        <Col md={2} className="mx-4">
          <Table striped bordered hover className="my-4">
            <tbody>
              {moves.map((move, index) => {
                return (
                  <tr key={index}>
                    <td key={0} className="count">
                      .
                    </td>
                    <td key={1}>{move[0]}</td>
                    <td key={2}> {move[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Chessboard;
