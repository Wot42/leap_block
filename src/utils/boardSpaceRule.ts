import { GamePieceRules } from "./gamePieceRules";

export class BoardSpaceRule {
  piece: GamePieceRules | undefined = undefined;
  setHiLight: React.Dispatch<React.SetStateAction<boolean>> | undefined =
    undefined;
  hiLightList: BoardSpaceRule[] = [];
  id = 3;

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
  }
  removePiece() {
    this.piece = undefined;
  }

  HiLightStart() {
    this.hiLightList.forEach((space) => {
      if (space.setHiLight) {
        space.setHiLight(true);
      }
    });
  }

  HiLightEnd() {
    this.hiLightList.forEach((space) => {
      if (space.setHiLight) space.setHiLight(false);
    });
  }
}
