import React, { useEffect, useState } from "react";
import "./PageView.css";
import { BoardRule } from "../utils/boardRule";
import { BoardFrame } from "./BoardFrame";
import { GameMenu } from "./GameMenu";

interface props {
  mainBoard: BoardRule;
}

export const PageView = ({ mainBoard }: props) => {
  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);

  mainBoard.updateSizes(windowSize);
  let pageClass = "page-view__vertical";
  if (mainBoard.screenHorizontal) pageClass = "page-view__horizontal";

  //listen to change screen size
  useEffect(() => {
    const resize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={pageClass}>
      <BoardFrame key="frame" mainBoard={mainBoard} />
      <GameMenu key="menu" mainBoard={mainBoard} />
    </div>
  );
};
