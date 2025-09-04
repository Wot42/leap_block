import React, { useEffect, useState } from "react";
import { BoardSpace } from "./BoardSpace";
import "./BoardFrame.css";
import { GamePiece } from "./GamePiece";
import { BoardRule } from "../utils/boardRule";

interface props {
  mainBoard: BoardRule;
}

export const BoardFrame = ({ mainBoard }: props) => {
  const defaultList: JSX.Element[] = [];
  const [spacesComponents, setSpacesComponents] = useState(defaultList);
  const [piecesComponents, setPiecesComponents] = useState(defaultList);

  const drawFrameComponent = () => {
    if (mainBoard.real === false) {
      mainBoard.checkZoom();
      const newSpacesComponents: JSX.Element[] = [];
      let newComponent: JSX.Element = <React.Fragment />;
      mainBoard.spaces.forEach((column) => {
        column.forEach((space) => {
          newComponent = <BoardSpace key={"s" + space.id} space={space} />;
          newSpacesComponents.push(newComponent);
        });
      });
      setSpacesComponents(newSpacesComponents);

      const newPiecesComponents: JSX.Element[] = [];
      mainBoard.pieces.forEach((piece) => {
        newComponent = (
          <GamePiece
            key={"p" + mainBoard.pieceCount + "," + piece.id}
            piece={piece}
          />
        );
        newPiecesComponents.push(newComponent);
      });
      setPiecesComponents(newPiecesComponents);

      mainBoard.generateGoal();

      mainBoard.real = true;
    }
  }; // adds pieces and spaces to frame & main board start up, only applies to non real boards and makes them real

  mainBoard.addFrameComponent(
    setSpacesComponents,
    setPiecesComponents,
    drawFrameComponent
  ); // adds states to the main board

  useEffect(() => {
    mainBoard.drawFrameComponent();
  }, [mainBoard]);

  return (
    <div
      className="board-frame"
      style={{
        height: `${mainBoard.frameSize[1]}px`,
        width: `${mainBoard.frameSize[0]}px`,
      }}
    >
      {spacesComponents}
      {piecesComponents}
    </div>
  );
};
