import { PiecePositionData } from "../typesAndInterfaces";
import { BoardSpaceRule } from "./boardSpaceRule";

interface GamePieceRulesProps {
  space: BoardSpaceRule;
  id: number;
  boardSize: number;
}

export class GamePieceRules {
  id: number;
  space: BoardSpaceRule; //space this piece is on.
  // spaces: Array<Array<BoardSpaceRule>>; //needed?
  boardSize: number; //unused
  otherPieces: Array<GamePieceRules> = []; // used for triggering block check
  currentX: number; // current column //might be better getting from space
  currentY: number; // current row  //might be better getting from space
  spaceSize: [number, number] = [0, 0]; //size of space at full room out
  boardScale: number = 1; //zoom
  trueSize: [number, number] = [0, 0]; //current display size with zoom
  possibleMoves: BoardSpaceRule[] = []; //list of legal moves
  adjacentPieces: GamePieceRules[] = []; //list of adjacent pieces
  blocked: boolean = false; // if true moving this piece would split the board
  setBlocked: React.Dispatch<React.SetStateAction<boolean>> | undefined =
    undefined; // updates components blocked toggle

  constructor(props: GamePieceRulesProps) {
    this.space = props.space;
    this.boardSize = props.boardSize;
    this.currentX = this.space.column;
    this.currentY = this.space.row;
    this.id = props.id;
    this.space.addPiece(this);
  }

  initialize(allPieces: GamePieceRules[]) {
    allPieces.forEach((piece) => {
      if (piece.id !== this.id) this.otherPieces.push(piece);
    });
  }

  addPieceComponent(setBlocked: React.Dispatch<React.SetStateAction<boolean>>) {
    this.setBlocked = setBlocked;
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

  moveTo(space: BoardSpaceRule) {
    this.space.removePiece();
    this.space = space;
    space.addPiece(this);
    this.otherPieces.forEach((checkPiece) => checkPiece.checkForBlock());
  }

  draggedTo(offsetX: number, offsetY: number) {
    const trueSize = this.trueSize;

    const globalX = offsetX + this.currentX * trueSize[0];
    const globalY = offsetY + this.currentY * trueSize[1];
    if (this.blocked === false) {
      const column = this.currentX + Math.floor(offsetX / trueSize[0] + 0.5);
      const row = this.currentY + Math.floor(offsetY / trueSize[1] + 0.5);

      this.possibleMoves.forEach((space) => {
        if (row === space.row && column === space.column) {
          this.moveTo(space);
        }
      });
    }

    let pos: PiecePositionData = {
      top: this.currentY * trueSize[1],
      left: this.currentX * trueSize[0],
      relativeX: globalX - this.currentX * trueSize[0],
      relativeY: globalY - this.currentY * trueSize[1],
    };

    return pos;
  }

  checkForBlock() {
    var blocked = false;
    const adjacentPieces = this.adjacentPieces;
    if (adjacentPieces.length > 1) {
      const connected = [this.id, adjacentPieces[0].id];
      const findMe: number[] = [];
      const toTest = [adjacentPieces[0]];
      for (let i = 1; i < adjacentPieces.length; i++) {
        findMe.push(adjacentPieces[i].id);
      }
      while (findMe.length > 0 && toTest.length > 0) {
        toTest[0].adjacentPieces.forEach((linkedPiece) => {
          if (connected.findIndex((x) => x === linkedPiece.id) === -1) {
            connected.push(linkedPiece.id);
            toTest.push(linkedPiece);

            if (findMe.findIndex((x) => x === linkedPiece.id) > -1) {
              findMe.splice(
                findMe.findIndex((x) => x === linkedPiece.id),
                1
              );
            }
          }
        });
        toTest.splice(0, 1);
      }
      if (findMe.length > 0) blocked = true;
    }

    if (this.blocked !== blocked) {
      this.blocked = blocked;
      if (this.setBlocked) this.setBlocked(blocked);
    }
  }
}
