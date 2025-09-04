import React, { useState } from "react";
import "./BoardSpace.css";
import { BoardSpaceRule } from "../utils/boardSpaceRule";

interface props {
  space: BoardSpaceRule;
}

export const BoardSpace = ({ space }: props) => {
  const [hiLight, setHiLight] = useState("");
  space.addSpaceComponent(setHiLight);

  let hiLightDisplay = <React.Fragment />;
  let hiLightClassNames = "";
  if (hiLight === "blocked") {
    hiLightClassNames = "board-space__hi-light board-space__blocked";
  } else {
    hiLightClassNames = "board-space__hi-light";
  }

  if (hiLight) {
    hiLightDisplay = (
      <div
        className="board-space"
        style={{
          width: `${space.board.spaceSize[0]}px`,
          height: `${space.board.spaceSize[1]}px`,
          left: `${space.board.spaceSize[0] * space.column}px`,
          top: `${space.board.spaceSize[1] * space.row}px`,
        }}
      >
        <div className={hiLightClassNames}></div>
      </div>
    );
  }

  return hiLightDisplay;
};
