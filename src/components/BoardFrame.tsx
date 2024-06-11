import React, { useEffect, useState } from "react";
import BoardSpace from "./BoardSpace";
import "./BoardFrame.css";
import GamePiece from "./GamePiece";
import { BoardRule } from "../utils/boardRule";

interface props {
  mainBoard: BoardRule;
}

const BoardFrame = ({ mainBoard }: props) => {
  // real content

  const defaultList: JSX.Element[] = [];
  const [spacesComponents, setSpacesComponents] = useState(defaultList);
  const [piecesComponents, setPiecesComponents] = useState(defaultList);

  console.log("frame rendered");

  const drawFrameComponent = () => {
    if (mainBoard.real === false) {
      mainBoard.checkZoom();
      const newSpacesComponents: JSX.Element[] = [];
      let newComponent: JSX.Element = <React.Fragment />;
      mainBoard.spaces.forEach((row) => {
        row.forEach((space) => {
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

      mainBoard.real = true;
      // mainBoard.pieces.forEach((piece) => {
      //   piece.updatePosition();
      // });
    }
    console.log("draw triggered");
  };

  mainBoard.addFrameComponent(
    setSpacesComponents,
    setPiecesComponents,
    drawFrameComponent
  );

  useEffect(() => {
    // drawFrameComponent();
    mainBoard.drawFrameComponent();
  }, [mainBoard]);

  return (
    <React.Fragment>
      <div
        className="board-frame color__board"
        style={{
          height: `${mainBoard.frameSize[1]}px`,
          width: `${mainBoard.frameSize[0]}px`,
        }}
      >
        {spacesComponents}
        {piecesComponents}
      </div>
    </React.Fragment>
  );
};

export default BoardFrame;
