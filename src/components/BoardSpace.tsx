import React, { useState } from "react";
import "./BoardSpace.css";
import { BoardSpaceRule } from "../utils/boardSpaceRule";

interface props {
  space: BoardSpaceRule;
}

const BoardSpace = ({ space }: props) => {
  const [hiLight, setHiLight] = useState("");

  // const updateHiLight = (update: boolean) => {
  //   //unused
  //   if (hiLight !== update) setHiLight(update);
  // };

  space.addSpaceComponent(setHiLight);
  let hiLightDisplay = <React.Fragment></React.Fragment>;

  // if (hiLight) {
  //   hiLightDisplay = (
  //     <div className="board-space__hi-light color__hi-light"></div>
  //   );
  // }
  let hiLightClassNames = "";
  if (hiLight === "blocked") {
    hiLightClassNames = "board-space__hi-light color__hi-block";
  } else {
    hiLightClassNames = "board-space__hi-light color__hi-light";
  }

  // console.log(hiLightClassNames);

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

  return <React.Fragment>{hiLightDisplay}</React.Fragment>;
};

export default BoardSpace;
