import React from "react";
import "./App.css";
import "./colors.css";
import { BoardRule } from "./utils/boardRule";
import { PageView } from "./components/PageView";

function App() {
  const mainBoard = new BoardRule({ pieceCount: 6 });

  return (
    <div className="app">
      <PageView key="page" mainBoard={mainBoard} />
    </div>
  );
}

export default App;
