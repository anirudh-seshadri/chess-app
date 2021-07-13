import OpeningsData from "./openings.json";
export default class Openings {
  constructor() {
    this.resultTree = [];
  }
  createTree() {
    let resultTree = [];
    for (let inputOpening of OpeningsData) {
      const moves = this.movesParse(inputOpening.moves);
      let filter = [];
      for (let resultTreeElement of resultTree) {
        if (resultTreeElement.move === moves[0]) {
          filter.push(resultTreeElement);
        }
      }
      if (filter.length === 0) {
        let resultMove = {
          move: moves[0],
        };
        if (moves.length === 1) {
          resultMove.name = inputOpening.name;
        }
        resultTree.push(resultMove);
      } else {
        let resultMove = filter[0];
        if (moves.length === 1) {
          resultMove.name = inputOpening.name;
        }
      }
    }
    this.resultTree = resultTree;
  }
  movesParse(moves) {
    moves = moves.replace(/[0-9]\./g, "");
    moves = moves.split(" ");
    for (let i = 0; i < moves.length; i++) {
      if (moves[i] === "") {
        moves.splice(i, 1);
      }
    }
    return moves;
  }
  findOpening(moves) {
    let newMovesArr = [];
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves[i].length; j++) {
        newMovesArr.push(moves[i][j]);
      }
    }
    return this._findOpening(newMovesArr, 0, this.resultTree);
  }
  _findOpening(newMovesArr, moveLocation, openings) {
    for (let i = 0; i < openings.length; i++) {
      if (newMovesArr[moveLocation] === openings[i].move) {
        if (
          newMovesArr[moveLocation + 1] === "" ||
          newMovesArr.length === moveLocation + 1
        ) {
          return openings[i].name;
        } else {
          if (openings[i].children && openings[i].children.length !== 0) {
            return this._findOpening(
              newMovesArr,
              moveLocation + 1,
              openings[i].children
            );
          }
        }
      }
    }
    return "";
  }
}
