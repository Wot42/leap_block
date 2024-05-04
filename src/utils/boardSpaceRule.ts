import { GamePieceRules } from "./gamePieceRules";

interface BoardSpaceRuleProps {
  row: number;
  column: number;
}

export class BoardSpaceRule {
  piece: GamePieceRules | undefined = undefined;
  setHiLight: React.Dispatch<React.SetStateAction<boolean>> | undefined =
    undefined;
  hiLightList: BoardSpaceRule[] = []; //                                     NOT SET UP
  id: string;
  row: number;
  column: number;
  spaceSize: [number, number] = [0, 0];
  boardScale: number = 1;
  trueSize: [number, number] = [0, 0];
  neighbors: Array<Array<BoardSpaceRule>> = []; //8 directions // no hilights needed

  constructor(props: BoardSpaceRuleProps) {
    this.row = props.row;
    this.column = props.column;
    this.id = "" + this.row + "," + this.column;
  }

  initialize(otherSpaces: Array<Array<BoardSpaceRule>>): void {
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
  }
  removePiece() {
    this.piece = undefined;
  }

  // HiLightStart() {
  //   console.log(this.neighbors);

  //   this.neighbors.forEach((direction) => {
  //     direction.forEach((space) => {
  //       if (space.setHiLight) {
  //         space.setHiLight(true);
  //       }
  //     });
  //   });
  // }

  // HiLightEnd() {
  //   this.neighbors.forEach((direction) => {
  //     direction.forEach((space) => {
  //       if (space.setHiLight) {
  //         space.setHiLight(false);
  //       }
  //     });
  //   });
  // }

  findMoves() {
    console.log("find moves ran");
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
    // either return possibleMoves or possibleMoves is directly to this.piece
  } // NOT FINISHED
}
