import React from "react";
import "./App.css";
import "./colors.css";
import BoardFrame from "./components/BoardFrame";
import { BoardRule } from "./utils/boardRule";

function App() {
  const mainBoard = new BoardRule({ pieceCount: 6 });
  const frameSize: [number, number] = [window.innerWidth, window.innerHeight];

  mainBoard.initializeFrameSize(frameSize);

  return (
    <div className="App">
      <BoardFrame key="frame" mainBoard={mainBoard} />
    </div>
  );
}

export default App;
