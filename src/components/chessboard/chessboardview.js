import "./chessboardview.css";
import { Container, Row, Col, Nav, Table } from "react-bootstrap";
import ChessGame from "./chessgame";
import pieces from "./pieces.json";
import { useState } from "react";
import { observer } from "mobx-react-lite";
function renderColumn(column, keyValue) {
  const isEmpty = column !== "";
  return (
    <span data-testid={column} key={keyValue}>
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

const LocalChessboardView = observer(({ chessgame }) => {
  const [currentMove, setCurrentMove] = useState("");
  return (
    <Container>
      <Row>
        <Col md={1} className="my-4">
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
            {chessgame.board.map((row, index) => {
              return renderRow(row, index);
            })}
          </div>
        </Col>
        <Col md={2} className="mx-4">
          <div>{chessgame.openingName}</div>
          <Table striped bordered hover className="my-4">
            <tbody>
              {chessgame.moves.map((move, index) => {
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
        <Col md={2} className="my-4">
          <div>
            {!chessgame.gameOver && (
              <input
                onChange={(event) => {
                  setCurrentMove(event.target.value);
                }}
                type="text"
                value={currentMove}
                placeholder="Enter your move..."
                onKeyPress={(event) => {
                  setCurrentMove(event.target.value);
                  if (event.key === "Enter") {
                    chessgame.addMove(currentMove);
                    setCurrentMove("");
                  }
                }}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
});

const chessgame = new ChessGame();
chessgame.init();
function ChessboardView() {
  return <LocalChessboardView chessgame={chessgame} />;
}

export default ChessboardView;
