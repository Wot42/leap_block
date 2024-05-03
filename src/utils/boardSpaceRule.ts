import { GamePieceRules } from "./gamePieceRules";

interface BoardSpaceRuleProps {
  row: number;
  column: number;
}

export class BoardSpaceRule {
  piece: GamePieceRules | undefined = undefined;
  setHiLight: React.Dispatch<React.SetStateAction<boolean>> | undefined =
    undefined;
  hiLightList: BoardSpaceRule[] = []; //                                     NOT SET UP
  id: string;
  row: number;
  column: number;
  spaceSize: [number, number] = [0, 0];
  boardScale: number = 1;
  trueSize: [number, number] = [0, 0];
  //neighbours: Array<Array<BoardSpaceRule>> //8 directions // no hilights needed

  constructor(props: BoardSpaceRuleProps) {
    this.row = props.row;
    this.column = props.column;
    this.id = "" + this.row + "," + this.column;
  }

  initialize(otherSpaces: Array<Array<BoardSpaceRule>>): void {
    // make neighbours starting with north
    // maybe store other spaces?
  } // NOT FINISHED

  // updateHiLight = (update: boolean) => {}; // placeholder

  addSpaceComponent(
    setHiLight: React.Dispatch<React.SetStateAction<boolean>>
    // updateHiLight: (update: boolean) => void // might not bee needed
  ) {
    this.setHiLight = setHiLight;
    // this.updateHiLight = updateHiLight;
  }
  addPiece(piece: GamePieceRules) {
    this.piece = piece;
    piece.currentX = this.column;
    piece.currentY = this.row;
  }
  removePiece() {
    this.piece = undefined;
  }

  HiLightStart() {
    this.hiLightList.forEach((space) => {
      if (space.setHiLight) {
        space.setHiLight(true);
      }
    });
  }

  HiLightEnd() {
    this.hiLightList.forEach((space) => {
      if (space.setHiLight) space.setHiLight(false);
    });
  }

  findMoves() {
    const neighbors: Array<Array<BoardSpaceRule>> = [
      [this, this],
      [this, this],
    ]; //placeholder
    const possibleMoves: BoardSpaceRule[] = [];
    neighbors.forEach((direction) => {
      if (direction.length > 1 && direction[0].piece !== undefined) {
        for (let i = 1; i < direction.length; i) {
          if (direction[i].piece === undefined) {
            possibleMoves.push(direction[i]);
            i = direction.length;
          }
        }
      }
    });
    // either return possibleMoves or possibleMoves is directly to this.piece
  } // NOT FINISHED
}
