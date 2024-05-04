import React from "react";
import "./App.css";
import "./colors.css";
import BoardFrame from "./components/BoardFrame";
import { BoardRule } from "./utils/boardRule";

function App() {
  const mainBoard = new BoardRule({ pieceCount: 6 });
  mainBoard.setFrameSize([window.innerWidth, window.innerHeight]);

  return (
    <div className="App">
      <BoardFrame key="frame" mainBoard={mainBoard} />
    </div>
  );
}

export default App;
