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
