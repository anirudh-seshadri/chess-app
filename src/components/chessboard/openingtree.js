import OpeningsData from "./openings.json";
export default class Openings {
  constructor() {
    this.resultTree = { move: "", name: "_root", children: [] };
  }

  createTree() {
    for (let inputOpening of OpeningsData) {
      const moves = this.movesParse(inputOpening.moves);
      let opening = this.findOpening(moves, 0, this.resultTree);
      for (const move of moves) {
        let openingName = "";
        if (moves[moves.length - 1] === move) {
          openingName = inputOpening.name;
        }
        opening = this.addMove(move, openingName, opening);
      }
    }
  }
  findOpening(newMovesArr, moveLocation, openings) {
    for (let i = 0; i < openings.length; i++) {
      if (newMovesArr[moveLocation] === openings.children[i].move) {
        if (
          openings.children[i].children &&
          openings.children[i].children.length !== 0
        ) {
          return this.findOpening(
            newMovesArr,
            moveLocation + 1,
            openings.children[i]
          );
        }
        return openings.children[i];
      }
    }
    return openings;
  }
  getOpeningName(moves) {
    let newMovesArr = [];
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves[i].length; j++) {
        newMovesArr.push(moves[i][j]);
      }
    }
    const opening = this.findOpening(newMovesArr, 0, this.resultTree);
    return opening.name;
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
  addMove(move, name, opening) {
    const moveObject = { move, name, children: [] };
    opening.children.push(moveObject);
    return moveObject;
  }
}
