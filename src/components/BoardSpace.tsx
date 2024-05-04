import React, { useState } from "react";
import "./BoardSpace.css";
import { BoardSpaceRule } from "../utils/boardSpaceRule";

interface props {
  space: BoardSpaceRule;
}

const BoardSpace = ({ space }: props) => {
  const [hiLight, setHiLight] = useState(false);

  // const updateHiLight = (update: boolean) => {
  //   //unused
  //   if (hiLight !== update) setHiLight(update);
  // };

  space.addSpaceComponent(setHiLight);
  var hiLightDisplay = <React.Fragment></React.Fragment>;

  if (hiLight) {
    hiLightDisplay = (
      <div className="board-space__hi-light color__hi-light"></div>
    );
  }

  return (
    <div
      className="board-space"
      style={{
        width: `${space.spaceSize[0]}px`,
        height: `${space.spaceSize[1]}px`,
        left: `${space.spaceSize[0] * space.column}px`,
        top: `${space.spaceSize[1] * space.row}px`,
      }}
    >
      {hiLightDisplay}
    </div>
  );
};

export default BoardSpace;
