import { PieceCount } from "../typesAndInterfaces";
import { BoardSpaceRule } from "./boardSpaceRule";
import { GamePieceRules } from "./gamePieceRules";

interface BoardRuleProps {
  pieceCount: PieceCount;
}

export class BoardRule {
  pieces: GamePieceRules[] = []; // list of pieces                             SET UP
  spaces: Array<Array<BoardSpaceRule>> = []; // list of spaces in rows           SET UP
  frameSize: [number, number] = [0, 0]; // number of pixels in a frame           SET UP
  boardSize: number; // number of spaces in a row or column                  SET UP
  spaceSize: [number, number] = [0, 0]; // number of pixels for a base piece       SET UP
  real = false; // toggle for component set up //is real                       SET UP
  pieceCount: PieceCount; // number of pieces, used for constructor               SET UP
  boardScale = 1; //                                                  NOT SET UP

  constructor(props: BoardRuleProps) {
    this.pieceCount = props.pieceCount;
    this.boardSize = this.pieceCount + 2;
    this.createSpaces();
    this.allSpaces((space: BoardSpaceRule) => {
      space.initialize(this.spaces);
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
  }

  allSpaces(spaceFunction: (space: BoardSpaceRule) => void) {
    this.spaces.forEach((row) => {
      row.forEach((space) => {
        spaceFunction(space);
      });
    });
  } // (space: BoardSpaceRule) => {space.}

  setFrameSize(frame: [number, number]): void {
    this.frameSize = frame;
    this.spaceSize = [frame[0] / this.boardSize, frame[1] / this.boardSize];
    var spaceSize = this.spaceSize;
    this.allSpaces((space: BoardSpaceRule) => {
      space.spaceSize = spaceSize;
      space.trueSize = spaceSize;
    });
    this.pieces.forEach((piece) => {
      piece.spaceSize = spaceSize;
      piece.trueSize = spaceSize;
    });
  }

  // initialize(): {
  // }

  createSpaces() {
    const boardSize = this.boardSize;
    const spaces = this.spaces;
    for (let row = 0; row < boardSize; row++) {
      spaces.push([]);
      for (let column = 0; column < boardSize; column++) {
        spaces[row].push(new BoardSpaceRule({ row: row, column: column }));
      }
    }
  }

  createPieces() {
    var pieceCount = this.pieceCount;
    var startPoints: Array<[number, number]> = [];
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
          boardSize: this.boardSize,
        })
      );
    });
    this.pieces.forEach((piece) => piece.initialize(this.pieces));
  }
}

// define=self.define

//HOW TO siplify data
// const testFunction = () => {
//   return [1, 2, 3];
// };
// const [t1, , t3] = testFunction();
