import React, { useState } from "react";
import "./GameMenu.css";
import { BoardRule } from "../utils/boardRule";
import { PieceCount } from "../typesAndInterfaces";

interface props {
  mainBoard: BoardRule;
  storedBoard: BoardRule;
}

const GameMenu = ({ mainBoard, storedBoard }: props) => {
  const menuSize = mainBoard.menuSize;
  // states needed / boardSize / gameStarted / colours /
  const [gameStarted, setGameStarted] = useState(mainBoard.startedGame);
  const [difficultyVisible, setDifficultyVisible] = useState(false);
  // VISIBILITY THOUGHTS FOR POLISH
  // to keep instant start mainBoard needs to either change or trigger function here
  // trigger function would allow an animation if needed.
  // menu order needs work once i know the start flow.
  // not sure when puzzles are generated and if a difficulty needs to be selected first.

  //add buttons for setup/ difficulty presets, random setup, moves per round/
  //add buttons for game play/ show ids/ other hints hints

  const clickSave = () => {
    storedBoard.copyBoard(mainBoard);
  };
  const clickReset = () => {
    mainBoard.copyBoard(storedBoard);
  };
  const clickDifficulty = () => {
    if (mainBoard.startedGame === false) {
      setDifficultyVisible(true);
      // ADD PAUSE
    }
  };
  const clickPieces = () => {
    mainBoard.changePieceCount(nextPieceCount);
    storedBoard.changePieceCount(nextPieceCount);

    updateNextPieceCount();
  };
  const clickColors = () => {
    // set colours
  };
  const clickStart = () => {
    mainBoard.startedGame = true;
    setGameStarted(true);
    storedBoard.copyBoard(mainBoard, true); // reset wrong otherwise?
    setDifficultyVisible(false);
  };

  const updateNextPieceCount = () => {
    switch (mainBoard.pieceCount) {
      case 2:
        nextPieceCount = 4;
        break;
      case 4:
        nextPieceCount = 6;
        break;
      case 6:
        nextPieceCount = 8;
        break;
      case 8:
        nextPieceCount = 2;
        break;
    }
  };

  let nextPieceCount: PieceCount = 2; // make a setState if i want it displayed
  updateNextPieceCount();

  let shownMenu = <React.Fragment></React.Fragment>;
  let containerClasses = "game-menu__container-vertical";
  let buttonClasses = "game-menu__button-vertical color__board";
  if (mainBoard.screenHorizontal) {
    containerClasses = "game-menu__container-horizontal";
    buttonClasses = "game-menu__button-horizontal color__board";
  }

  if (difficultyVisible) {
    shownMenu = (
      <React.Fragment>
        <div
          className={containerClasses}
          style={{
            width: `${menuSize[0]}px`,
            height: `${menuSize[1]}px`,
          }}
        >
          Difficulty Menu
          <button className={buttonClasses} onClick={clickStart}>
            Start
          </button>
          <button className={buttonClasses} onClick={clickPieces}>
            Pieces
          </button>
          <button className={buttonClasses} onClick={clickColors}>
            Colours
          </button>
        </div>
      </React.Fragment>
    );
  } else {
    shownMenu = (
      <React.Fragment>
        <div
          className={containerClasses}
          style={{
            width: `${menuSize[0]}px`,
            height: `${menuSize[1]}px`,
          }}
        >
          Game Menu
          <button className={buttonClasses} onClick={clickSave}>
            Save
          </button>
          <button className={buttonClasses} onClick={clickReset}>
            Reset
          </button>
          <button className={buttonClasses} onClick={clickDifficulty}>
            difficulty
          </button>
        </div>
      </React.Fragment>
    );
  }

  return <React.Fragment>{shownMenu}</React.Fragment>;
};

export default GameMenu;
