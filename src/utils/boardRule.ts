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
  menuSize: Coordinate = [0, 0]; // number of pixels in menu
  //screenSize: Coordinate = [0, 0]; // total screen size
  screenHorizontal: boolean = true; // screen orientation is horizontal
  boardSize: number = 0; // number of spaces in a row or column  // currently only used as constructor //is derived in space initialize
  spaceSize: Coordinate = [0, 0]; // number of pixels for a piece to display
  real: boolean = false; // toggle for component has set t up to show and needs to animate
  pieceCount: PieceCount = 2; // number of pieces, used for constructor
  zoom: number = 0; // scale in rows/columns
  startedGame: boolean = false; //stops you changing the difficulty mid game

  #setSpacesComponents:
    | React.Dispatch<React.SetStateAction<JSX.Element[]>>
    | undefined = undefined;

  #setPiecesComponents:
    | React.Dispatch<React.SetStateAction<JSX.Element[]>>
    | undefined = undefined;

  drawFrameComponent = () => {}; //placeholder //private?

  constructor(props: BoardRuleProps) {
    this.#generateBoard(props.pieceCount);
  }

  addFrameComponent(
    setSpacesComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    setPiecesComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    drawFrameComponent: () => void
  ) {
    this.#setSpacesComponents = setSpacesComponents;
    this.#setPiecesComponents = setPiecesComponents;
    this.drawFrameComponent = drawFrameComponent;
  }

  #generateBoard(newCount: PieceCount) {
    this.pieceCount = newCount;
    this.boardSize = this.pieceCount + 2;
    this.createSpaces(); // needs check
    this.allSpaces((space: BoardSpaceRule) => {
      space.initialize(); // needs check
    }); //initialize spaces
    this.createPieces(); //needs check
    this.real = false;
  } // private?

  changePieceCount(newCount: PieceCount) {
    if (newCount !== this.pieceCount) {
      this.pieces = [];
      this.spaces = [];
      this.#generateBoard(newCount);
      console.log(this.pieces);
      this.drawFrameComponent();
    }
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
  }

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
  }

  checkZoom(reorder = false): [number, Coordinate] {
    const oldSpaceSize = this.spaceSize;
    let zoomDisplacement: Coordinate = [0, 0];
    let shiftZoom = 1;
    const oldZoom = this.zoom;
    if (reorder) this.sortPieces();
    // checkZoom() is mainly called after checkShift() has been called sort should have already been called
    const piecesSortedByColumn = this.#piecesSortedByColumn;
    const piecesSortedByRow = this.#piecesSortedByRow;
    const lasIndex = this.pieceCount - 1;
    let maxValue = piecesSortedByColumn[lasIndex].space.column;

    if (piecesSortedByRow[lasIndex].space.row > maxValue) {
      maxValue = piecesSortedByRow[lasIndex].space.row;
    }

    if (maxValue !== oldZoom - 2) {
      // this.zoom = maxValue + 2;
      this.#updateZoom(maxValue + 2);
      shiftZoom = this.zoom / oldZoom;
      zoomDisplacement = [
        (oldSpaceSize[0] - this.spaceSize[0]) / 2,
        (oldSpaceSize[1] - this.spaceSize[1]) / 2,
      ];
    }

    return [shiftZoom, zoomDisplacement];
  } // reorder is true if sortPieces() hasn't been called recently // REFACTOR from piece getters?

  pieceMovedOnBoard(): [number, number, number, Coordinate] {
    // could check only if oldColumn/Row===1 || newColumn/Row===0
    const [shiftColumn, shiftRow] = this.checkShift();
    // could check only if oldColumn/Row===zoom-2 || newColumn/Row===zoom-1
    const [shiftZoom, zoomDisplacement] = this.checkZoom();
    this.startedGame = true;
    return [shiftColumn, shiftRow, shiftZoom, zoomDisplacement];
  }

  updateSizes(window: Coordinate): void {
    const frameToButtonRatio = 0.9;

    if (window[0] > window[1]) {
      this.screenHorizontal = true;
      this.frameSize[0] = window[0] * frameToButtonRatio;
      this.frameSize[1] = window[1];

      //avoid stretch
      if (this.frameSize[0] > this.frameSize[1] * 2) {
        this.frameSize[0] = window[1] * 2;
      }

      this.menuSize[0] = window[0] - this.frameSize[0];
      this.menuSize[1] = window[1];
    } else {
      this.screenHorizontal = false;
      this.frameSize[0] = window[0];
      this.frameSize[1] = window[1] * frameToButtonRatio;

      //avoid stretch
      if (this.frameSize[1] > this.frameSize[0] * 2) {
        this.frameSize[1] = window[0] * 2;
      }

      this.menuSize[0] = window[0];
      this.menuSize[1] = window[1] - this.frameSize[1];
    }

    // this.sortPieces();
    if (this.real) {
      this.#updateZoom(this.zoom);
      this.pieces.forEach((piece) => {
        piece.updatePosition();
      });
    }
  }

  sortPieces() {
    const sortColumnThenRow = (a: GamePieceRules, b: GamePieceRules) => {
      if (a.space.column === b.space.column) {
        return a.space.row - b.space.row;
      }

      return a.space.column - b.space.column;
    };
    // left first, then highest.
    this.#piecesSortedByColumn.sort(sortColumnThenRow);
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
          space: this.findSpace(point),
          id: index,
          board: this,
        })
      );
    });
    this.pieces.forEach((piece) => piece.initialize());
    this.#piecesSortedByColumn = [...this.pieces];
    this.#piecesSortedByRow = [...this.pieces];
  }

  copyBoard(copyBoard: BoardRule, resizable: boolean = false) {
    if (copyBoard === this) return; //for safety
    if (resizable && copyBoard.pieceCount !== this.pieceCount) {
      this.changePieceCount(copyBoard.pieceCount);
    }

    if (copyBoard.pieceCount !== this.pieceCount) return; //for safety
    const pieces = this.pieces;

    // loop1: get global positions and size and remove all pieces from spaces copyPrep / an if/else for real?
    const storedGlobals: Coordinate[] = [];
    if (this.real) {
      pieces.forEach((piece) => {
        storedGlobals.push(piece.copyPrep());
      });
    } else {
      pieces.forEach((piece) => {
        piece.space.piece = undefined;
      });
    }

    // loop2: use piece copy
    pieces.forEach((piece, index) => {
      piece.copyPiece(copyBoard.pieces[index]);
    });

    if (this.real) {
      const zoomData = this.checkZoom(true);
      // loop3: draw?(is not in draw in 2 as needs zoom) / add displacement to stored global
      let newGlobal: Coordinate = [0, 0];
      pieces.forEach((piece, index) => {
        newGlobal = storedGlobals[index];
        newGlobal[0] += zoomData[1][0];
        newGlobal[1] += zoomData[1][1];
        piece.updatePosition(
          piece.convertGlobalPositionToRelative(newGlobal),
          zoomData[0]
        );
      });
    }
  }

  findSpace(spaceIndex: number[]): BoardSpaceRule {
    return this.spaces[spaceIndex[0]][spaceIndex[1]];
  } // can take number[] and convert to coordinate after. // DITCH coordinate?
}

// define=self.define

//HOW TO simplify data
// const testFunction = () => {
//   return [1, 2, 3];
// };
// const [t1, , t3] = testFunction();
