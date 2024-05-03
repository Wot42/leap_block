import React from "react";
import "./App.css";
import "./colors.css";
import BoardFrame from "./components/BoardFrame";
import { BoardRule } from "./utils/boardRule";

function App() {
  const mainBoard = new BoardRule({ pieceCount: 2 });
  mainBoard.setFrameSize([800, 800]);

  return (
    <div className="App">
      <BoardFrame key="frame" mainBoard={mainBoard} />
    </div>
  );
}

export default App;
