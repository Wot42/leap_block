import React from "react";
import BoardSpace from "./BoardSpace";
import "./BoardFrame.css";
import { BoardSpaceRule } from "../utils/boardSpaceRule";
import { GamePieceRules } from "../utils/gamePieceRules";
import GamePiece from "./GamePiece";

const BoardFrame = () => {
  // bad set up for tests
  const mainBoard = [
    new BoardSpaceRule(),
    new BoardSpaceRule(),
    new BoardSpaceRule(),
  ];
  mainBoard[0].hiLightList.push(mainBoard[1]);
  mainBoard[0].hiLightList.push(mainBoard[2]);
  mainBoard[1].hiLightList.push(mainBoard[0]);
  mainBoard[1].hiLightList.push(mainBoard[2]);
  mainBoard[2].hiLightList.push(mainBoard[0]);
  mainBoard[2].hiLightList.push(mainBoard[1]);

  mainBoard[0].id = 0;
  mainBoard[1].id = 1;
  mainBoard[2].id = 2;

  const piece = new GamePieceRules({ space: mainBoard[1] });

  return (
    <React.Fragment>
      <div className="board-frame color__board">
        <BoardSpace key="s1" space={mainBoard[0]} />
        <BoardSpace key="s2" space={mainBoard[1]} />
        <BoardSpace key="s3" space={mainBoard[2]} />
        <GamePiece key="p1" piece={piece} />
      </div>
    </React.Fragment>
  );
};

export default BoardFrame;
