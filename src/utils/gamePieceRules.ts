import { Coordinate, PiecePositionData } from "../typesAndInterfaces";
import { BoardRule } from "./boardRule";
import { BoardSpaceRule } from "./boardSpaceRule";

interface GamePieceRulesProps {
  space: BoardSpaceRule;
  id: number;
  board: BoardRule;
}

export class GamePieceRules {
  id: number;
  space: BoardSpaceRule; //space this piece is on.
  otherPieces: Array<GamePieceRules> = []; // used for triggering block check
  possibleMoves: BoardSpaceRule[] = []; //list of legal moves
  adjacentPieces: GamePieceRules[] = []; //list of adjacent pieces
  blocked: boolean = false; // if true moving this piece would split the board
  board: BoardRule; // the board info

  // currentX current column
  // currentY current row

  setPosition:
    | React.Dispatch<React.SetStateAction<PiecePositionData>>
    | undefined = undefined; // updates components position data

  // setBlocked: React.Dispatch<React.SetStateAction<boolean>> | undefined =
  //   undefined; // updates components blocked toggle

  get currentIndex(): Coordinate {
    return [this.space.column, this.space.row];
  }

  get currentPosition(): Coordinate {
    return [
      this.space.column * this.board.spaceSize[0],
      this.space.row * this.board.spaceSize[1],
    ];
  }

  constructor(props: GamePieceRulesProps) {
    this.space = props.space;
    this.board = props.board;
    this.id = props.id;
    this.space.addPiece(this);
  }

  initialize() {
    this.board.pieces.forEach((piece) => {
      if (piece.id !== this.id) this.otherPieces.push(piece);
    });
  }

  addPieceComponent(
    // setBlocked: React.Dispatch<React.SetStateAction<boolean>>,
    setPosition: React.Dispatch<React.SetStateAction<PiecePositionData>>
  ) {
    // this.setBlocked = setBlocked;
    let updateNeeded = false;
    if (this.setPosition === undefined) updateNeeded = true;
    this.setPosition = setPosition;
    if (updateNeeded) this.updatePosition();
  }

  updatePosition(relativePosition: Coordinate = [0, 0], relativeScale = 1) {
    if (this.setPosition) {
      let pos: PiecePositionData = {
        left: this.currentPosition[0],
        top: this.currentPosition[1],
        relativeX: relativePosition[0],
        relativeY: relativePosition[1],
        relativeScale: relativeScale,
        blocked: this.blocked,
      };
      this.setPosition(pos);
    }
  }

  hiLight(setting: boolean) {
    if (setting) {
      let lightColor = this.blocked ? "blocked" : "light";
      this.possibleMoves.forEach((space) => {
        if (space.setHiLight) space.setHiLight(lightColor);
      });
    } else {
      this.possibleMoves.forEach((space) => {
        if (space.setHiLight) space.setHiLight("");
      });
    }
  }

  moveTo(space: BoardSpaceRule, updateRelativeData = true) {
    this.space.removePiece(updateRelativeData);
    this.space = space;
    space.addPiece(this, updateRelativeData);
    if (updateRelativeData) {
      //false when everything moves in a shift.
      this.otherPieces.forEach((checkPiece) => checkPiece.checkForBlock());
    }
  }

  positionFromShiftData(shiftData: [number, number, number, Coordinate]) {
    const globalPosition = this.convertShiftToGlobalPosition(shiftData);
    const relativePosition =
      this.convertGlobalPositionToRelative(globalPosition);
    this.updatePosition(relativePosition, shiftData[2]);
  } // take coordinate and scale?

  convertShiftToGlobalPosition([
    shiftColumn,
    shiftRow,
    shiftZoomFactor,
    zoomDisplacement,
  ]: [number, number, number, Coordinate]): Coordinate {
    const shiftIndex = [shiftColumn, shiftRow];

    const pastIndex: Coordinate = [
      this.currentIndex[0] - shiftIndex[0],
      this.currentIndex[1] - shiftIndex[1],
    ];

    const pastPosition: Coordinate = [
      pastIndex[0] * shiftZoomFactor * this.board.spaceSize[0] +
        zoomDisplacement[0],
      pastIndex[1] * shiftZoomFactor * this.board.spaceSize[1] +
        zoomDisplacement[1],
    ];

    return pastPosition;
  } //take coordinate and scale?

  // convertGlobalPositionToRelative(globalPosition: Coordinate): Coordinate {
  //   const conversionMaths = (a: number, b: number) => {
  //     return a - b;
  //   };
  //   let relativePosition = this.coordinateMaths(
  //     globalPosition,
  //     this.currentPosition,
  //     conversionMaths
  //   );

  //   return relativePosition;
  // }

  convertGlobalPositionToRelative(globalPosition: Coordinate): Coordinate {
    const currentPosition = this.currentPosition;

    const relativePosition: Coordinate = [
      globalPosition[0] - currentPosition[0],
      globalPosition[1] - currentPosition[1],
    ];

    return relativePosition;
  }

  draggedTo(offsetX: number, offsetY: number) {
    if (this.blocked === false) {
      const spaceSize = this.board.spaceSize;
      // const currentPosition = this.currentPosition

      const globalPosition: Coordinate = [
        offsetX + this.currentPosition[0],
        offsetY + this.currentPosition[1],
      ];

      const column =
        this.currentIndex[0] + Math.floor(offsetX / spaceSize[0] + 0.5);
      const row =
        this.currentIndex[1] + Math.floor(offsetY / spaceSize[1] + 0.5);

      this.possibleMoves.forEach((space) => {
        if (row === space.row && column === space.column) {
          this.moveTo(space);

          let shiftData = this.board.pieceMovedOnBoard();
          const zoomDisplacement = shiftData[3];

          this.otherPieces.forEach((piece) => {
            piece.positionFromShiftData(shiftData);
          });

          const droppedZoom = shiftData[2] * 0.8; // 0.8 comes from game piece whileDrag()

          globalPosition[0] += zoomDisplacement[0];
          globalPosition[1] += zoomDisplacement[1];

          this.updatePosition(
            this.convertGlobalPositionToRelative(globalPosition),
            droppedZoom
          );
        }
      });
    }
  } //language check offset to relative?

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
      // if (this.setBlocked) this.setBlocked(blocked);
    }
  }

  copyPiece(copyPiece: GamePieceRules) {
    // space: needs to be moved normally?
    // possibleMoves:  lookup
    // adjacentPieces:  lookup
    // blocked: lookup
    const newSpace = this.board.findSpace(copyPiece.currentIndex);
    this.moveTo(newSpace, false);

    let newSpaceArray: BoardSpaceRule[] = [];
    copyPiece.possibleMoves.forEach((copySpace) => {
      newSpaceArray.push(this.board.spaces[copySpace.column][copySpace.row]);
    });
    this.possibleMoves = newSpaceArray;

    let newPieceArray: GamePieceRules[] = [];
    copyPiece.adjacentPieces.forEach((copyPiece) => {
      newPieceArray.push(this.board.pieces[copyPiece.id]);
    });
    this.adjacentPieces = newPieceArray;

    this.blocked = copyPiece.blocked;
  }

  copyPrep(): Coordinate {
    // find and retun globals
    // remove piece from space. space.removePiece if refactored
    this.space.removePiece(false);
    return this.currentPosition;
  }

  // A Tidy function i Found to be bad for the readability of my code
  // would abrivate to coMaths probably
  // coordinateMaths(
  //   firstCoordinate: Coordinate,
  //   secondCoordinate: Coordinate,
  //   mathsFunction: (a: number, b: number) => number
  // ): Coordinate {
  //   let returnCoordinate: Coordinate = [0, 0];
  //   returnCoordinate[0] = mathsFunction(
  //     firstCoordinate[0],
  //     secondCoordinate[0]
  //   );
  //   returnCoordinate[1] = mathsFunction(
  //     firstCoordinate[1],
  //     secondCoordinate[1]
  //   );
  //   return returnCoordinate;
  // } // (a:number, b:number) => a*b)
}
