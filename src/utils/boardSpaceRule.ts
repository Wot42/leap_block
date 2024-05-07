import { GamePieceRules } from "./gamePieceRules";

interface BoardSpaceRuleProps {
  row: number;
  column: number;
}

export class BoardSpaceRule {
  id: string;
  row: number;
  column: number;
  piece: GamePieceRules | undefined = undefined; //piece on this space
  setHiLight: React.Dispatch<React.SetStateAction<boolean>> | undefined =
    undefined; //space components hi-light toggle
  spaceSize: [number, number] = [0, 0]; //size of space at full room out
  boardScale: number = 1; //zoom
  trueSize: [number, number] = [0, 0]; //current display size with zoom
  neighbors: Array<Array<BoardSpaceRule>> = []; //8 directions, each direction list spaces in order moving away from piece
  adjacentSpaces: BoardSpaceRule[] = []; // all spaces next to this one

  constructor(props: BoardSpaceRuleProps) {
    this.row = props.row;
    this.column = props.column;
    this.id = "" + this.row + "," + this.column;
  }

  initialize(otherSpaces: Array<Array<BoardSpaceRule>>): void {
    //set neighbours
    const neighbors = this.neighbors;
    const boardSize = otherSpaces.length;
    const row = this.row;
    const column = this.column;

    for (let i = 0; i < 8; i++) {
      neighbors.push([]);
    }

    let north = true;
    let south = true;
    let east = true;
    let west = true;

    for (let offset = 1; offset < boardSize; offset++) {
      north = row - offset >= 0 ? true : false;
      south = row + offset < boardSize ? true : false;
      east = column + offset < boardSize ? true : false;
      west = column - offset >= 0 ? true : false;

      if (north) {
        //n
        neighbors[0].push(otherSpaces[row - offset][column]);
        if (east) {
          //ne
          neighbors[1].push(otherSpaces[row - offset][column + offset]);
        }
      }
      if (east) {
        //e
        neighbors[2].push(otherSpaces[row][column + offset]);
        if (south) {
          //se
          neighbors[3].push(otherSpaces[row + offset][column + offset]);
        }
      }
      if (south) {
        //s
        neighbors[4].push(otherSpaces[row + offset][column]);
        if (west) {
          //sw
          neighbors[5].push(otherSpaces[row + offset][column - offset]);
        }
      }
      if (west) {
        //w
        neighbors[6].push(otherSpaces[row][column - offset]);
        if (north) {
          //nw
          neighbors[7].push(otherSpaces[row - offset][column - offset]);
        }
      }
    }

    // set adjacentSpaces
    neighbors.forEach((direction) => {
      if (direction[0]) this.adjacentSpaces.push(direction[0]);
    });
  } // if otherSpaces[] is needed get here

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
    piece.adjacentPieces = [];
    this.adjacentSpaces.forEach((space) => {
      if (space.piece) piece.adjacentPieces.push(space.piece);
    });
    piece.adjacentPieces.forEach((adjacentPiece) => {
      adjacentPiece.adjacentPieces.push(piece);
    });
  }

  removePiece() {
    const piece = this.piece;
    if (piece) {
      var index = 0;
      piece.adjacentPieces.forEach((adjacentPiece) => {
        index = adjacentPiece.adjacentPieces.findIndex(
          (p) => p.id === piece.id
        );
        adjacentPiece.adjacentPieces.splice(index, 1);
      });
    }
    this.piece = undefined;
  }

  findMoves() {
    const neighbors = this.neighbors;
    const possibleMoves = this.piece ? this.piece.possibleMoves : [];
    possibleMoves.splice(0, possibleMoves.length); // clear array from last results

    neighbors.forEach((direction) => {
      if (direction.length > 1 && direction[0].piece !== undefined) {
        for (let i = 1; i < direction.length; i++) {
          if (direction[i].piece === undefined) {
            possibleMoves.push(direction[i]);
            i = direction.length;
          }
        }
      }
    });
  }
}
