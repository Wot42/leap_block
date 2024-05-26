import { Coordinate, PieceCount } from "../typesAndInterfaces";
import { BoardSpaceRule } from "./boardSpaceRule";
import { GamePieceRules } from "./gamePieceRules";

interface BoardRuleProps {
  pieceCount: PieceCount;
}

export class BoardRule {
  pieces: GamePieceRules[] = []; // list of pieces
  #piecesSortedByColumn: GamePieceRules[] = []; // same list but reordered
  #piecesSortedByRow: GamePieceRules[] = []; // same list but reordered
  spaces: BoardSpaceRule[][] = []; // list of spaces [column] [row]
  frameSize: Coordinate = [0, 0]; // number of pixels in a frame
  boardSize: number; // number of spaces in a row or column  // currently only used as constructor //is derived in space initialize
  spaceSize: Coordinate = [0, 0]; // number of pixels for a piece to display
  real: boolean = false; // toggle for component set up
  pieceCount: PieceCount; // number of pieces, used for constructor
  zoom: number = 0; // scale in rows/columns

  constructor(props: BoardRuleProps) {
    this.pieceCount = props.pieceCount;
    this.boardSize = this.pieceCount + 2;
    this.createSpaces();
    this.allSpaces((space: BoardSpaceRule) => {
      space.initialize();
    }); //initialize spaces
    this.createPieces();
  }

  noThisDot() {
    return [
      this.pieces,
      this.spaces,
      this.allSpaces,
      this.boardSize,
      this.pieceCount,
    ];
  } //unused

  #updateZoom(newZoom: number) {
    this.zoom = newZoom;
    this.spaceSize = [this.frameSize[0] / newZoom, this.frameSize[1] / newZoom];
  } //TAKE ZOOM OUT OF REQUIREMENTS?

  allSpaces(spaceFunction: (space: BoardSpaceRule) => void) {
    this.spaces.forEach((row) => {
      row.forEach((space) => {
        spaceFunction(space);
      });
    });
  } // (space: BoardSpaceRule) => {space.}

  checkShift(): Coordinate {
    let shiftColumn = 0;
    let shiftRow = 0;
    const piecesSortedByColumn = this.#piecesSortedByColumn;
    const piecesSortedByRow = this.#piecesSortedByRow;
    const spaces = this.spaces;

    this.sortPieces();

    if (piecesSortedByColumn[0].currentIndex[0] !== 1) {
      if (piecesSortedByColumn[0].currentIndex[0] === 0) {
        shiftColumn = 1;
        piecesSortedByColumn.reverse();
        piecesSortedByColumn.forEach((piece) => {
          piece.moveTo(
            spaces[piece.currentIndex[1]][piece.currentIndex[0] + shiftColumn],
            false
          );
        });
        piecesSortedByColumn.reverse();
      } else {
        shiftColumn = -1;
        piecesSortedByColumn.forEach((piece) => {
          piece.moveTo(
            spaces[piece.currentIndex[1]][piece.currentIndex[0] + shiftColumn],
            false
          );
        });
      }
    }
    if (piecesSortedByRow[0].currentIndex[1] !== 1) {
      if (piecesSortedByRow[0].currentIndex[1] === 0) {
        shiftRow = 1;
        piecesSortedByRow.reverse();
        piecesSortedByRow.forEach((piece) => {
          piece.moveTo(
            spaces[piece.currentIndex[1] + shiftRow][piece.currentIndex[0]],
            false
          );
        });
        piecesSortedByRow.reverse();
      } else {
        shiftRow = -1;
        piecesSortedByRow.forEach((piece) => {
          piece.moveTo(
            spaces[piece.currentIndex[1] + shiftRow][piece.currentIndex[0]],
            false
          );
        });
      }
    }

    return [shiftColumn, shiftRow];
  } // reconfigure from  piece getters

  checkZoom(): number {
    let shiftZoom = 1;
    const oldZoom = this.zoom;
    const piecesSortedByColumn = this.#piecesSortedByColumn;
    const piecesSortedByRow = this.#piecesSortedByRow;
    // checkZoom() should only be called after checkShift() has been called so both should be sorted correctly already
    const lasIndex = this.pieceCount - 1;
    let maxValue = piecesSortedByColumn[lasIndex].space.column;

    if (piecesSortedByRow[lasIndex].space.row > maxValue) {
      maxValue = piecesSortedByRow[lasIndex].space.row;
    }

    if (maxValue !== oldZoom - 2) {
      // this.zoom = maxValue + 2;
      this.#updateZoom(maxValue + 2);
      shiftZoom = this.zoom / oldZoom;
    }

    return shiftZoom;
  } // make sure sortPieces() has been called recently // reconfigure from  piece getters

  pieceMovedOnBoard(): [number, number, number] {
    // could check only if oldColumn/Row===1 || newColumn/Row===0
    const [shiftColumn, shiftRow] = this.checkShift();
    // could check only if oldColumn/Row===zoom-2 || newColumn/Row===zoom-1
    const shiftZoom = this.checkZoom();
    return [shiftColumn, shiftRow, shiftZoom];
  }

  initializeFrameSize(frame: Coordinate): void {
    this.frameSize = frame;
    this.sortPieces();
    this.checkZoom();
  }

  sortPieces() {
    this.#piecesSortedByColumn.sort((a, b) => a.space.column - b.space.column);
    this.#piecesSortedByRow.sort((a, b) => a.space.row - b.space.row);
  }

  createSpaces() {
    const boardSize = this.boardSize;
    const spaces = this.spaces;
    for (let row = 0; row < boardSize; row++) {
      spaces.push([]);
      for (let column = 0; column < boardSize; column++) {
        spaces[row].push(
          new BoardSpaceRule({
            row: row,
            column: column,
            board: this,
          })
        );
      }
    }
  }

  createPieces() {
    const pieceCount = this.pieceCount;
    let startPoints: Coordinate[] = [];
    if (pieceCount === 2) {
      startPoints = [
        [1, 1],
        [1, 2],
      ];
    } else if (pieceCount === 4) {
      startPoints = [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
      ];
    } else if (pieceCount === 6) {
      startPoints = [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 2],
        [2, 3],
      ];
    } else {
      startPoints = [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 3],
        [3, 1],
        [3, 2],
        [3, 3],
      ];
    }
    startPoints.forEach((point, index) => {
      this.pieces.push(
        new GamePieceRules({
          space: this.spaces[point[0]][point[1]],
          id: index,
          board: this,
        })
      );
    });
    this.pieces.forEach((piece) => piece.initialize());
    this.#piecesSortedByColumn = [...this.pieces];
    this.#piecesSortedByRow = [...this.pieces];
  }
}

// define=self.define

//HOW TO simplify data
// const testFunction = () => {
//   return [1, 2, 3];
// };
// const [t1, , t3] = testFunction();
