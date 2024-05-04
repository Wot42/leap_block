import { PiecePositionData } from "../typesAndInterfaces";
import { BoardSpaceRule } from "./boardSpaceRule";

interface GamePieceRulesProps {
  space: BoardSpaceRule;
  spaces: Array<Array<BoardSpaceRule>>;
  id: number;
}

export class GamePieceRules {
  space: BoardSpaceRule;
  spaces: Array<Array<BoardSpaceRule>>;
  boardSize: number;
  id: number; //                                                     SET UP
  currentX: number; //                                                 SET UP
  currentY: number; //                                                 SET UP
  spaceSize: [number, number] = [0, 0]; //                                 SET UP
  boardScale: number = 1; //                                           NOT SET UP (might stay one, not updated)
  trueSize: [number, number] = [0, 0]; //                                   SET UP (updates with scale)
  possibleMoves: BoardSpaceRule[] = [];

  constructor(props: GamePieceRulesProps) {
    this.space = props.space;
    this.spaces = props.spaces;
    this.boardSize = this.spaces.length;
    this.currentX = this.space.column; //might be other way round
    this.currentY = this.space.row; //might be other way round
    this.id = props.id;
    this.space.addPiece(this);
  }

  setScale(scale: number) {
    this.boardScale = scale;
    this.trueSize = [this.spaceSize[0] * scale, this.spaceSize[1] * scale];
  } //currently UNUSED

  hiLight(setting: boolean) {
    this.possibleMoves.forEach((space) => {
      if (space.setHiLight) space.setHiLight(setting);
    });
  }

  draggedTo(offsetX: number, offsetY: number) {
    const trueSize = this.trueSize;

    const column = this.currentX + Math.floor(offsetX / trueSize[0] + 0.5);
    const row = this.currentY + Math.floor(offsetY / trueSize[1] + 0.5);

    const globalX = offsetX + this.currentX * trueSize[0];
    const globalY = offsetY + this.currentY * trueSize[1];

    this.possibleMoves.forEach((space) => {
      if (row === space.row && column === space.column) {
        this.space.removePiece();
        this.space = space;
        space.addPiece(this);
      }
    });

    let pos: PiecePositionData = {
      top: this.currentY * trueSize[1],
      left: this.currentX * trueSize[0],
      relativeX: globalX - this.currentX * trueSize[0],
      relativeY: globalY - this.currentY * trueSize[1],
    };

    return pos;
  }
}
