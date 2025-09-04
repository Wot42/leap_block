import React from "react";
import "./DrawMap.css";
import { BoardMap } from "../utils/boardMap";
// ColumnsOfSpaces is in this file below DrawMap
// MapSpace is in this file below ColumnsOfSpaces

interface props {
  map: BoardMap;
  id: string;
}

export const DrawMap = ({ map, id }: props) => {
  const mapSize = map.zoom - 2; // map doesn't need the boarder

  const generateEmptyNumberMap = () => {
    let newNumberMap: number[][] = [];
    for (let column = 0; column < mapSize; column++) {
      newNumberMap.push([]);
      for (let row = 0; row < mapSize; row++) {
        newNumberMap[column].push(-1);
      }
    }
    return newNumberMap;
  };

  const addPiecesToNumberMap = (numberMap: number[][]) => {
    for (let i = 0; i < map.pieces.length; i++) {
      let piece = map.pieces[i];
      numberMap[piece.index[0] - 1][piece.index[1] - 1] = piece.id;
    }
  };

  const drawMap = (numberMap: number[][]) => {
    let mapSpaces: JSX.Element[][] = [];
    for (let c = 0; c < mapSize; c++) {
      mapSpaces.push([]);
      for (let r = 0; r < mapSize; r++) {
        mapSpaces[c].push(
          <MapSpace
            key={id + " column" + c + "row" + r}
            mapNum={numberMap[c][r]}
          />
        );
      }
    }

    let columnsOfSpaces: JSX.Element[] = [];
    for (let c = 0; c < mapSize; c++) {
      columnsOfSpaces.push(
        <ColumnsOfSpaces key={id + " column" + c} spaces={mapSpaces[c]} />
      );
    }

    return columnsOfSpaces;
  };

  let numberMap = generateEmptyNumberMap();
  addPiecesToNumberMap(numberMap);
  let columnsOfSpaces = drawMap(numberMap);
  return <div className="draw-map__frame">{columnsOfSpaces}</div>;
};

interface columnsOfSpacesProps {
  spaces: JSX.Element[];
}
const ColumnsOfSpaces = ({ spaces }: columnsOfSpacesProps) => {
  return <div className="draw-map__column">{spaces}</div>;
};

interface spacesProps {
  mapNum: number;
}
const MapSpace = ({ mapNum }: spacesProps) => {
  if (mapNum < 0) {
    return <div className="draw-map__space-empty" />;
  } else {
    return <div className="draw-map__space-full" />;
  }
};
