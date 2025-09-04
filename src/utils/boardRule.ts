import {
  Coordinate,
  MoveLog,
  PieceCount,
  PotentialMove,
} from "../typesAndInterfaces";
import { BoardMap } from "./boardMap";
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
  goalMap: BoardMap = new BoardMap(); //the current goal
  resetPointBoard: BoardRule | undefined = undefined; //stored copy for reset. has to start as undefined otherwise will infante loop.
  frameSize: Coordinate = [0, 0]; // number of pixels in a frame
  menuSize: Coordinate = [0, 0]; // number of pixels in menu
  screenHorizontal: boolean = true; // screen orientation is horizontal
  spaceSize: Coordinate = [0, 0]; // number of pixels for a piece to display
  pieceCount: PieceCount = 6; // number of pieces, used for constructor
  zoom: number = 0; // scale in rows/columns
  stepsMax: number = 3; // maximum number of steps to make goal
  #stepsCurrent: number = 0; // steps taken so far
  real: boolean = false; // toggle for to know if calculations for animations are needed.
  startedGame: boolean = false; // stops you changing the difficulty mid game

  get stepsCurrent(): number {
    return this.#stepsCurrent;
  }
  set stepsCurrent(increment: number) {
    if (increment < 1) {
      this.#stepsCurrent = increment;
    } else {
      this.#stepsCurrent += increment;
    }
    if (this.setStepsTakenComponent) {
      this.setStepsTakenComponent(this.stepsCurrent);
    }
  }

  #setSpacesComponents:
    | React.Dispatch<React.SetStateAction<JSX.Element[]>>
    | undefined = undefined;

  #setPiecesComponents:
    | React.Dispatch<React.SetStateAction<JSX.Element[]>>
    | undefined = undefined;

  drawFrameComponent = () => {}; //placeholder
  setStepsTakenComponent:
    | React.Dispatch<React.SetStateAction<number>>
    | undefined = undefined;

  constructor({ pieceCount }: BoardRuleProps) {
    this.#generateBoard(pieceCount);
  }

  addFrameComponent(
    setSpacesComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    setPiecesComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    drawFrameComponent: () => void
  ) {
    this.#setSpacesComponents = setSpacesComponents;
    this.#setPiecesComponents = setPiecesComponents;
    this.drawFrameComponent = drawFrameComponent;
  } // is called by frame to add states to this BoardRule

  #generateBoard(newCount: PieceCount) {
    this.pieceCount = newCount;
    this.createSpaces();
    this.allSpaces((space: BoardSpaceRule) => {
      space.initialize();
    }); //initialize spaces once all are made.
    this.createPieces();

    this.real = false; //resets to false as will need to relink to components.
  }

  changePieceCount(newCount: PieceCount) {
    if (newCount !== this.pieceCount) {
      this.pieces = [];
      this.spaces = [];
      this.#generateBoard(newCount);
      this.drawFrameComponent();

      switch (newCount) {
        case 4:
          this.stepsMax = 2;
          break;
        case 6:
          this.stepsMax = 3;
          break;
        case 8:
          this.stepsMax = 5;
      }
      this.stepsCurrent = -1;
    }
  }

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
  } // (space: BoardSpaceRule) => {space.thing()}

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
            spaces[piece.currentIndex[0] + shiftColumn][piece.currentIndex[1]],
            false
          );
        });
        piecesSortedByColumn.reverse();
      } else {
        shiftColumn = -1;
        piecesSortedByColumn.forEach((piece) => {
          piece.moveTo(
            spaces[piece.currentIndex[0] + shiftColumn][piece.currentIndex[1]],
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
            spaces[piece.currentIndex[0]][piece.currentIndex[1] + shiftRow],
            false
          );
        });
        piecesSortedByRow.reverse();
      } else {
        shiftRow = -1;
        piecesSortedByRow.forEach((piece) => {
          piece.moveTo(
            spaces[piece.currentIndex[0]][piece.currentIndex[1] + shiftRow],
            false
          );
        });
      }
    }

    return [shiftColumn, shiftRow];
  } //works out if pieces need to move to ensure that row 0 and column 0 are empty and row 1 and column 1 are occupied. updates pieces

  checkZoom(reorder = false): [number, Coordinate] {
    const oldSpaceSize = this.spaceSize;
    let zoomDisplacement: Coordinate = [0, 0];
    let shiftZoom = 1;
    const oldZoom = this.zoom;
    if (reorder) this.sortPieces();
    // checkZoom() is mainly called after checkShift() has been called sort should have already been called
    const piecesSortedByColumn = this.#piecesSortedByColumn;
    const piecesSortedByRow = this.#piecesSortedByRow;
    const lastIndex = this.pieceCount - 1;
    let maxValue = piecesSortedByColumn[lastIndex].space.column;

    if (piecesSortedByRow[lastIndex].space.row > maxValue) {
      maxValue = piecesSortedByRow[lastIndex].space.row;
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
  } // reorder is true if sortPieces() hasn't been called recently

  pieceMovedOnBoard(): [number, number, number, Coordinate] {
    // could check only if oldColumn/Row===1 || newColumn/Row===0
    const [shiftColumn, shiftRow] = this.checkShift();
    // could check only if oldColumn/Row===zoom-2 || newColumn/Row===zoom-1
    const [shiftZoom, zoomDisplacement] = this.checkZoom();
    this.startedGame = true;
    return [shiftColumn, shiftRow, shiftZoom, zoomDisplacement];
  }

  updateSizes(window: Coordinate): void {
    const frameToButtonRatio = 0.85;

    if (window[0] * frameToButtonRatio > window[1]) {
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
    // leftmost first, then highest.

    const sortRowThenColumn = (a: GamePieceRules, b: GamePieceRules) => {
      if (a.space.row === b.space.row) {
        return a.space.column - b.space.column;
      }

      return a.space.row - b.space.row;
    };
    // highest first, then leftmost.

    this.#piecesSortedByColumn.sort(sortColumnThenRow);
    this.#piecesSortedByRow.sort(sortRowThenColumn);
  }

  createSpaces() {
    const boardSize = this.pieceCount + 2;
    const spaces = this.spaces;
    for (let column = 0; column < boardSize; column++) {
      spaces.push([]);
      for (let row = 0; row < boardSize; row++) {
        spaces[column].push(
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
    if (pieceCount === 4) {
      startPoints = [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
      ];
    } else if (pieceCount === 6) {
      startPoints = [
        [1, 1],
        [2, 1],
        [3, 1],
        [1, 2],
        [2, 2],
        [3, 2],
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

    this.sortPieces();

    if (this.real) {
      const zoomData = this.checkZoom();
      // loop3: draw board and adds displacement to stored global
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
    } else {
      this.zoom = copyBoard.zoom;
    }
  }

  findSpace(spaceIndex: number[]): BoardSpaceRule {
    return this.spaces[spaceIndex[0]][spaceIndex[1]];
  }

  generateGoal() {
    //reset start position
    if (this.resetPointBoard) {
      this.resetPointBoard.copyBoard(this, true);
    } else {
      this.resetPointBoard = new BoardRule({ pieceCount: this.pieceCount });
      this.resetPointBoard.copyBoard(this, true);
    }

    this.makeSteppedMoveForGoal();

    this.stepsCurrent = -1;
    console.log("movelog:", this.goalMap.moveLog);
  }

  convertToMap(moveLog: MoveLog[], goalMap: BoardMap) {
    goalMap.moveLog = moveLog;

    goalMap.pieces = []; // clear to start
    this.#piecesSortedByColumn.forEach((piece) => {
      let mapPiece = { id: piece.id, index: piece.currentIndex };
      goalMap.pieces.push(mapPiece);
    });
  }

  checkSolved() {
    if (this.goalMap.checkSolved(this.#piecesSortedByColumn)) {
      this.generateGoal();
    }
  }

  reset() {
    if (this.resetPointBoard) {
      this.copyBoard(this.resetPointBoard);
      this.stepsCurrent = -1;
    }
  }
  makeSteppedMoveForGoal(
    stepsDown: number = 0,
    boardToCopy: BoardRule = this,
    moveLog: MoveLog[] = [],
    mapLog: BoardMap[] = []
  ) {
    if (mapLog.length === 0) {
      let firstMap = new BoardMap();
      this.convertToMap([], firstMap);
      firstMap.initialize();
      mapLog.push(firstMap);
    }

    let newCopyBoard = new BoardRule({ pieceCount: boardToCopy.pieceCount });
    newCopyBoard.copyBoard(boardToCopy);

    //make list
    let allPossibleMoves: PotentialMove[] = [];
    newCopyBoard.pieces.forEach((piece) => {
      if (!piece.blocked) {
        piece.space.findMoves();
        piece.possibleMoves.forEach((space) =>
          allPossibleMoves.push({ piece: piece, space: space })
        );
      }
    });

    // randomize list
    let randomizedPosableMoves: PotentialMove[] = [];
    while (allPossibleMoves.length > 0) {
      randomizedPosableMoves.push(
        ...allPossibleMoves.splice(
          Math.floor(Math.random() * allPossibleMoves.length),
          1
        )
      );
    }

    let pathFound = false;
    let rPMI = 0; // abbreviation of randomizedPosableMovesIndex

    while (rPMI < randomizedPosableMoves.length) {
      //find and test a possible move
      const consideredMove = randomizedPosableMoves[rPMI];
      const consideredId = consideredMove.piece.id;

      // apply to newCopyBoard
      consideredMove.piece.moveTo(consideredMove.space);
      let shiftData = newCopyBoard.checkShift();
      let [zoomShift] = newCopyBoard.checkZoom();

      // maths functions for later
      const addCoordinate = (co1: Coordinate, co2: Coordinate): Coordinate => {
        return [co1[0] + co2[0], co1[1] + co2[1]];
      };
      const subtractCoordinate = (
        co1: Coordinate,
        co2: Coordinate
      ): Coordinate => {
        return [co1[0] - co2[0], co1[1] - co2[1]];
      };

      let tempMoveLog: MoveLog = {
        pieceId: consideredId,
        movedFrom: boardToCopy.pieces[consideredId].currentIndex,
        movedTo: subtractCoordinate(
          consideredMove.piece.currentIndex,
          shiftData
        ),
        shift: shiftData,
        zoomChange: zoomShift,
      };

      // tests to see if a piece is backtracking a move
      let isDuplicate = false;
      let trackedShift: Coordinate = [0, 0];
      moveLog.forEach((log) => {
        trackedShift = addCoordinate(trackedShift, log.shift);
      }); //stats at all the shift from beginning to now

      moveLog.forEach((log) => {
        if (log.pieceId === tempMoveLog.pieceId) {
          let forbiddenSpot = addCoordinate(log.movedFrom, trackedShift);
          if (
            forbiddenSpot[0] === tempMoveLog.movedTo[0] &&
            forbiddenSpot[1] === tempMoveLog.movedTo[1]
          ) {
            isDuplicate = true;
          }
        }
        trackedShift = subtractCoordinate(trackedShift, log.shift); //moves shift for next move
      });

      // test current board against maps to make sure it hasn't looped to a similar shape.
      if (!isDuplicate) {
        mapLog.forEach((map) => {
          if (map.checkSolved(newCopyBoard.pieces)) {
            isDuplicate = true;
          }
        });
      }

      // if passed both tests, progress, otherwise will loop through to next possible move.
      if (!isDuplicate) {
        let newMoveLog = [...moveLog, tempMoveLog];

        // if final move in chain update this goal and end loop.
        if (stepsDown === this.stepsMax - 1) {
          newCopyBoard.convertToMap(newMoveLog, this.goalMap);
          this.goalMap.initialize();
          pathFound = true;
          break;
        }

        // otherwise try a loop lower and see if you can get a sucsessful next loop
        let newMap = new BoardMap();
        newCopyBoard.convertToMap(newMoveLog, newMap);
        newMap.initialize();
        let newMapLog = [...mapLog, newMap];

        if (
          this.makeSteppedMoveForGoal(
            stepsDown + 1,
            newCopyBoard,
            newMoveLog,
            newMapLog
          )
        ) {
          pathFound = true;
          break;
        }
      }

      //if fail reset and loop
      newCopyBoard.copyBoard(boardToCopy);
      rPMI++;
    }

    return pathFound;
  } // run on mainBoard as this.makeSteppedMoveForGoal() to start. will call self after.
}
