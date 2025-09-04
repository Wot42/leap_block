import React, { useState } from "react";
import "./GameMenu.css";
import { BoardRule } from "../utils/boardRule";
import { PieceCount } from "../typesAndInterfaces";
import { DrawMap } from "./DrawMap";

interface props {
  mainBoard: BoardRule;
}

export const GameMenu = ({ mainBoard }: props) => {
  const menuSize = mainBoard.menuSize;
  const [difficultyVisible, setDifficultyVisible] = useState(false);
  const [stepsTaken, setStepsTaken] = useState(0);
  mainBoard.setStepsTakenComponent = setStepsTaken;

  if (stepsTaken < 0) {
    mainBoard.stepsCurrent = 0;
  }

  const clickReset = () => mainBoard.reset();

  const clickDifficulty = () => {
    if (mainBoard.startedGame === false) {
      setDifficultyVisible(true);
    }
  };

  const clickPieces = () => {
    mainBoard.changePieceCount(updateNextPieceCount());
    updateNextPieceCount();
  };

  const clickStart = () => {
    mainBoard.startedGame = true;
    setDifficultyVisible(false);
  };

  const updateNextPieceCount: () => PieceCount = () => {
    switch (mainBoard.pieceCount) {
      case 4:
        return 6;
      case 6:
        return 8;
      case 8:
        return 4;
    }
  };

  let shownMenu = <React.Fragment />;
  let containerClasses = "game-menu__container-vertical";
  let buttonClasses = "game-menu__button game-menu__button-vertical";
  let stepsClass = "game-menu__steps-vertical";
  if (mainBoard.screenHorizontal) {
    containerClasses = "game-menu__container-horizontal";
    buttonClasses = "game-menu__button game-menu__button-horizontal";
    stepsClass = "game-menu__steps-horizontal";
  }
  if (stepsTaken === mainBoard.stepsMax) {
    stepsClass += " game-menu__steps-blocked";
  }

  const whichMainButton = () => {
    if (mainBoard.startedGame) {
      return (
        <button className={buttonClasses} onClick={clickReset}>
          Reset
        </button>
      );
    } else {
      return (
        <button className={buttonClasses} onClick={clickDifficulty}>
          Difficulty
        </button>
      );
    }
  };

  if (difficultyVisible) {
    shownMenu = (
      <div
        className={containerClasses}
        style={{
          width: `${menuSize[0]}px`,
          height: `${menuSize[1]}px`,
        }}
      >
        <div className={stepsClass}>{"" + mainBoard.stepsMax}</div>
        <button className={buttonClasses} onClick={clickPieces}>
          Pieces
        </button>
        <button className={buttonClasses} onClick={clickStart}>
          Start
        </button>
      </div>
    );
  } else {
    shownMenu = (
      <div
        className={containerClasses}
        style={{
          width: `${menuSize[0]}px`,
          height: `${menuSize[1]}px`,
        }}
      >
        <div className={stepsClass}>
          {"" + stepsTaken + "/" + mainBoard.stepsMax}
        </div>
        <DrawMap key="goalMap" map={mainBoard.goalMap} id="goalMap" />
        {whichMainButton()}
      </div>
    );
  }

  return shownMenu;
};
