import constants from "./constants";
export default class ChessMove {
  constructor() {
    this.startNumVal = -1;
    this.endNumVal = -1;
    this.startLetterVal = -1;
    this.endLetterVal = -1;
    this.cross = false;
    this.startpiece = "";
    this.endpiece = "";
    this.color = constants.WHITE;
    this.castle = 0;
  }
}
