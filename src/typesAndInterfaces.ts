import { BoardSpaceRule } from "./utils/boardSpaceRule";
import { GamePieceRules } from "./utils/gamePieceRules";

export type PieceCount = 4 | 6 | 8;

export interface PiecePositionData {
  top: number;
  left: number;
  relativeX: number;
  relativeY: number;
  relativeScale: number;
  blocked: boolean;
}
export interface MapPiece {
  id: number;
  index: Coordinate;
  //color: string; // will probably need a PieceColor type
}
export interface MoveLog {
  pieceId: number;
  movedFrom: Coordinate;
  movedTo: Coordinate;
  shift: Coordinate;
  zoomChange: number;
}
export interface PotentialMove {
  piece: GamePieceRules;
  space: BoardSpaceRule;
}
export type Coordinate = [number, number]; // [colum, row] [x,y] [left,top] [width, height]

// Dictionary
// position noun: refers to the PiecePositionData
// position suffix: refers to an items location measured in pixels

// index suffix: refers to an items location measured in rows and columns
// global prefix: refers to a position relative to the boards origin
// relative prefix: refers to a position relative to its own drawn origin
