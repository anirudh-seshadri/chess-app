
import "./chessboard.css";
const board = [
    ["dr", "dn", "db", "dq", "dk", "db", "dn", "dr"],
    ["dp", "dp", "dp", "dp", "dp", "dp", "dp", "dp"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["lp", "lp", "lp", "lp", "lp", "lp", "lp", "lp"],
    ["lr", "ln", "lb", "lq", "lk", "lb", "ln", "lr"],
];

const pieces = {
    "lp": "./chess_pics/Chess_plt60.png",
    "dp": "./chess_pics/Chess_pdt60.png",
    "lb": "./chess_pics/Chess_blt60.png",
    "db": "./chess_pics/Chess_bdt60.png",
    "ln": "./chess_pics/Chess_nlt60.png",
    "dn": "./chess_pics/Chess_ndt60.png",
    "lq": "./chess_pics/Chess_qlt60.png",
    "dq": "./chess_pics/Chess_qdt60.png",
    "lr": "./chess_pics/Chess_rlt60.png",
    "dr": "./chess_pics/Chess_rdt60.png",
    "lk": "./chess_pics/Chess_klt60.png",
    "dk": "./chess_pics/Chess_kdt60.png",



}
function knightMove(notation, color){
  const knightEightMovements = [
    [2,1],
    [1,2],
    [-1,2],
    [-2,1],
    [-2,-1],
    [-1,-2],
    [1,-2],
    [2,-1]
  ];
  const letterVal = getLetterValue(notation[1]);
  const numVal = getNumberValue(notation[2]);
  for (let movement of knightEightMovements) {
    const startNumber = numVal + movement[0];
    const startLetter = letterVal + movement[1];
    const knights = ["ln","dn"];
      if(board[startNumber][startLetter] === knights[color]){
        board[startNumber][startLetter] = "";
        board[numVal][letterVal] = knights[color];
        break;
      }
  }
}
function getNumberValue(numVal){
  return 8 - parseInt(numVal, 10);
}
function getLetterValue(letterVal){
  return letterVal.charCodeAt() - 'a'.charCodeAt();
}
function isDarkPiece(piece){
  if(piece!=="" && piece[0]==="d"){
    return true;
  }
  return false;
}
function isLightPiece(piece){
  console.log(piece);
  if(piece!=="" && piece[0]==="l"){
    return true;
  }
  return false;
}
function findPawnPosition(targetNum,targetLetter,color){
  let currentNum = 0;
  if(color === 0){
    if(targetNum===4){
      if(board[targetNum+1][targetLetter]){
        currentNum = 5;
      }else{
        currentNum = 6;
      }
    }else{
      if(board[targetNum+1][targetLetter]){
        currentNum = targetNum + 1;
      }
    }
  } else {
    if(targetNum===3){
      if(board[targetNum-1][targetLetter]){
        currentNum = 2;
      }else{
        currentNum = 1;
      }
    }else{
      if(board[targetNum-1][targetLetter]){
        currentNum = targetNum -1;
      }
    }
  }

  return(currentNum);
}

function pawnCrossMove(notation, color){
  const letterEndPos = notation[2];
  const numberEndPos = notation[3];
  const startLetterVal = notation[0].charCodeAt() - 'a'.charCodeAt() ;
  const startNumberVal = parseInt(numberEndPos, 10) - 1;
  const endLetterVal = letterEndPos.charCodeAt() - 'a'.charCodeAt();
  const endNumbVal = parseInt(numberEndPos, 10) ;
  if(color===0){
    if(((startLetterVal-endLetterVal===1) || (startLetterVal-endLetterVal===-1)) && ((startNumberVal-endNumbVal===1)||(startNumberVal-endNumbVal===-1))){
      if(board[startNumberVal][startLetterVal] !== "" && isDarkPiece(board[endNumbVal][endLetterVal])){
        board[startNumberVal][startLetterVal] = "";
        board[endNumbVal][endLetterVal] = "lp";
      }
    }
  }else{
    if(((startLetterVal-endLetterVal===1) || (startLetterVal-endLetterVal===-1)) && ((startNumberVal-endNumbVal===1)||(startNumberVal-endNumbVal===-1))){
      if(board[startNumberVal][startLetterVal] !== "" && isLightPiece(board[endNumbVal][endLetterVal])){
        board[startNumberVal][startLetterVal] = "";
        board[endNumbVal][endLetterVal] = "dp";
      }
    }
  }
}
function isEligiblePawn(color, targetNumber,beforeNumber,letterVal){
  if(board[targetNumber][letterVal]!==""){
    return false;
  }
  if(color===0){
    if(board[beforeNumber][letterVal]!=="lp"){
      return false;
    }
  }else{
    if(board[beforeNumber][letterVal]!=="dp"){
      return false;
    }
  }
  return true;
}
function pawnMove(notation,color){
  const letterVal = getLetterValue(notation[0]);
  const numVal = getNumberValue(notation[1]);
  const currentNum = findPawnPosition(numVal,letterVal,color);
  if(!isEligiblePawn(color,numVal,currentNum,letterVal)){
    return;
  }
  if (color === 0){
    board[numVal][letterVal] = "lp";
  }else{
      board[numVal][letterVal] = "dp";
  }
  board[currentNum][letterVal] = "";
}

function Move (notation,color){
  if(notation.indexOf("x")!==-1){
    const first = notation[0];
    if('a'.charCodeAt()<=first.charCodeAt() && first.charCodeAt()<='h'.charCodeAt()){
      pawnCrossMove(notation,color);
    }

  }
  else if(notation.length===2){
    pawnMove(notation,color);
  }else{
    knightMove(notation,color);
  }
}

function Chessboard() {
  const items = [];
  let keyValue = 0;
    for(let row of board){
      let emptyColCount = 0;
        for(let column of row){
          if(column!==""){
            items.push(<img key={keyValue++} style = {{padding: 10, height: 60}} alt={pieces[column]} src = {pieces[column]}></img>)
          }else{
            emptyColCount++;
            items.push(<span key={keyValue++} style = {{padding: "0 40px"}}></span>)
          }
        }
        if(emptyColCount===8){
          items.push(<div key={keyValue++} style = {{padding: 30}}></div>);
        }else{
          items.push(<div key={keyValue++}></div>);
        }

    }
    Move("e4",0);
    Move("e5",1);
    Move("d3",0);   
    Move("d6",1);   
    Move("Nf3",0);   
    Move("Nf6",1);
    Move("Ng5",0);   
    Move("h6",1);
    Move("Nc3",0);
    Move("hxg5",1);
    return (
      <div className = "chessboard">
        {items}
      </div>
    );
  }

export default Chessboard;
