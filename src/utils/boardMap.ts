import { Coordinate, MapPiece, MoveLog } from "../typesAndInterfaces";
import { GamePieceRules } from "./gamePieceRules";

export class BoardMap {
  pieces: MapPiece[] = []; // simplified piece data
  zoom = 0; // size of the board stored on this map
  relativeIndexes: Coordinate[] = []; // the relative indexes to the pieces in respects to the first piece after sortColumnThenRow
  moveLog: MoveLog[] = []; // for debug but also hints.

  addPiece([id, index]: [number, Coordinate]) {
    let newPiece = { id: id, index: index };
    this.pieces.push(newPiece);
  }

  initialize() {
    this.findZoom();
    this.calculateRelativeIndexes();
  } // call after all pieces have been added

  findZoom() {
    let maxValue = 0;

    this.pieces.forEach((piece) => {
      if (piece.index[0] > maxValue) maxValue = piece.index[0];
      if (piece.index[1] > maxValue) maxValue = piece.index[1];
    });
    maxValue += 2; // one to add spacing at end and one as zoom starts at 1 not 0
    this.zoom = maxValue;
  }

  calculateRelativeIndexes() {
    let pieces = this.pieces;
    pieces.sort(this.sortColumnThenRowMap);
    this.relativeIndexes = [[0, 0]];

    let origin = pieces[0].index;
    let relativeIndex = [0, 0];
    for (let i = 1; i < pieces.length; i++) {
      relativeIndex[0] = pieces[i].index[0] - origin[0];
      relativeIndex[1] = pieces[i].index[1] - origin[1];
      this.relativeIndexes.push([relativeIndex[0], relativeIndex[1]]);
    }
  }

  sortColumnThenRowMap(a: MapPiece, b: MapPiece) {
    if (a.index[0] === b.index[0]) {
      return a.index[1] - b.index[1];
    }
    return a.index[0] - b.index[0];
  }

  checkSolved(pieces: GamePieceRules[]) {
    let solved = true;
    const coordinatesOfPieces: Coordinate[] = [];
    for (let p = 0; p < pieces.length; p++) {
      coordinatesOfPieces.push([
        pieces[p].currentIndex[0],
        pieces[p].currentIndex[1],
      ]);
    }

    const sortColumnThenRow = (a: Coordinate, b: Coordinate) => {
      if (a[0] === b[0]) {
        return a[1] - b[1];
      }

      return a[0] - b[0];
    };
    coordinatesOfPieces.sort(sortColumnThenRow);

    const origin = coordinatesOfPieces[0];

    for (let i = 1; i < coordinatesOfPieces.length; i++) {
      if (
        coordinatesOfPieces[i][0] !==
        this.relativeIndexes[i][0] + origin[0]
      ) {
        solved = false;
        i = coordinatesOfPieces.length;
      } else if (
        coordinatesOfPieces[i][1] !==
        this.relativeIndexes[i][1] + origin[1]
      ) {
        solved = false;
        i = coordinatesOfPieces.length;
      }
    }

    return solved;
  }
}
