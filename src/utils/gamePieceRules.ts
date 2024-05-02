import { BoardSpaceRule } from "./boardSpaceRule";

export interface PiecePositionData {
  top: number;
  left: number;
  relativeX: number;
  relativeY: number;
}

interface GamePieceRulesProps {
  space: BoardSpaceRule;
}

export class GamePieceRules {
  space: BoardSpaceRule;
  id = 1;
  currentX = 1;
  spaceSize = 200;
  constructor(props: GamePieceRulesProps) {
    this.space = props.space;
  }

  draggedTo(offsetX: number, offsetY: number) {
    var row = this.currentX + Math.floor(offsetX / this.spaceSize + 0.5);
    var globalX = offsetX + this.currentX * this.spaceSize;
    if (row < 0 || row > 2) {
    } else {
      this.currentX = row;
    }

    let pos: PiecePositionData = {
      top: 0,
      left: this.currentX * this.spaceSize,
      relativeX: globalX - this.currentX * this.spaceSize,
      relativeY: offsetY,
    };

    return pos;
  }
}
