export type PieceCount = 2 | 4 | 6 | 8;

export interface PiecePositionData {
  top: number;
  left: number;
  relativeX: number;
  relativeY: number;
  relativeScale: number;
  blocked: boolean;
}
export type Coordinate = [number, number];

// Dictionary
// Position noun: refers to the PiecePositionData
// Position suffix: refers to an items location measured in pixels

// Index suffix: refers to an items location measured in rows and columns
// Global prefix: refers to a position relative to the boards origin
// relative prefix: refers to a position relative to its own drawn origin
