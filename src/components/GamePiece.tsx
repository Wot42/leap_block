import { motion, useMotionValue } from "framer-motion";
import React, { useState } from "react";
import { GamePieceRules } from "../utils/gamePieceRules";
import "./GamePiece.css";
import { PiecePositionData } from "../typesAndInterfaces";

interface props {
  piece: GamePieceRules;
}

const GamePiece = ({ piece }: props) => {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const initialPos: PiecePositionData = {
    left: piece.currentX * piece.trueSize[0],
    top: piece.currentY * piece.trueSize[1],
    relativeX: 0,
    relativeY: 0,
  };
  const [position, setPosition] = useState(initialPos);
  const [blocked, setBlocked] = useState(piece.blocked);

  piece.addPieceComponent(setBlocked);

  const newPosition = (pos: PiecePositionData) => {
    setPosition(pos);
  };
  // if (piece.id === 0) console.log(piece.adjacentPieces);

  // console.log("drawn" + piece.id);

  return (
    <div
      className="game-piece__container"
      style={{
        width: `${piece.spaceSize[0]}px`,
        height: `${piece.spaceSize[1]}px`,
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
    >
      <motion.div
        className="game-piece color__piece"
        drag
        animate={{ x: [position.relativeX, 0], y: [position.relativeY, 0] }}
        whileDrag={{ scale: 0.8 }}
        dragSnapToOrigin
        onDragStart={() => {
          //   //split board check
          piece.space.findMoves();
          piece.hiLight(true);
        }}
        onDragEnd={() => {
          piece.hiLight(false);
          newPosition(piece.draggedTo(dragX.get(), dragY.get()));
        }}
        style={{
          x: dragX,
          y: dragY,
        }}
      >
        {/* {piece.space.row}
        {piece.space.column} */}
        {blocked ? <div className="game-piece__blocked">X</div> : ""}
      </motion.div>
    </div>
  );
};

export default GamePiece;
