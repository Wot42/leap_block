import { motion, useMotionValue } from "framer-motion";
import React, { useState } from "react";
import { GamePieceRules, PiecePositionData } from "../utils/gamePieceRules";
import "./GamePiece.css";

interface props {
  piece: GamePieceRules;
}

const GamePiece = ({ piece }: props) => {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const initialPos: PiecePositionData = {
    top: 0,
    left: 200,
    relativeX: 0,
    relativeY: 0,
  };
  const [position, setPosition] = useState(initialPos);

  const newPosition = (pos: PiecePositionData) => {
    setPosition(pos);
  };

  return (
    <div
      className="game-piece__container"
      style={{ left: `${position.left}px` }}
    >
      <motion.div
        className="game-piece color__piece"
        drag
        animate={{ x: [position.relativeX, 0], y: [position.relativeY, 0] }}
        whileDrag={{ scale: 0.8 }}
        dragSnapToOrigin
        onDragStart={() => {
          piece.space.HiLightStart();
        }}
        onDragEnd={(e) => {
          piece.space.HiLightEnd();
          newPosition(piece.draggedTo(dragX.get(), dragY.get()));
        }}
        style={{
          x: dragX,
          y: dragY,
        }}
      ></motion.div>
    </div>
  );
};

export default GamePiece;
