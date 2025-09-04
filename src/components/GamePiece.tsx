import { motion, useMotionValue } from "framer-motion";
import React, { useState } from "react";
import { GamePieceRules } from "../utils/gamePieceRules";
import "./GamePiece.css";
import { PiecePositionData } from "../typesAndInterfaces";

interface props {
  piece: GamePieceRules;
}

export const GamePiece = ({ piece }: props) => {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const initialPos: PiecePositionData = {
    left: piece.space.column * piece.board.spaceSize[0],
    top: piece.space.row * piece.board.spaceSize[1],
    relativeX: 0,
    relativeY: 0,
    relativeScale: 1,
    blocked: piece.blocked,
  };
  const [position, setPosition] = useState(initialPos);
  piece.addPieceComponent(setPosition);

  return (
    <div
      className="game-piece__container"
      style={{
        width: `${piece.board.spaceSize[0]}px`,
        height: `${piece.board.spaceSize[1]}px`,
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
    >
      <motion.div
        className="game-piece"
        drag
        animate={{
          x: [position.relativeX, 0],
          y: [position.relativeY, 0],
          scale: [position.relativeScale, 1],
        }}
        whileDrag={{ scale: 0.8 }}
        dragSnapToOrigin
        onDragStart={() => {
          piece.space.findMoves();
          piece.hiLight(true);
        }}
        onDragEnd={() => {
          piece.hiLight(false);
          piece.draggedTo(dragX.get(), dragY.get());
        }}
        style={{
          x: dragX,
          y: dragY,
        }}
      >
        {position.blocked ? (
          <div className="game-piece__blocked">X</div>
        ) : (
          "" // piece.id
        )}
      </motion.div>
    </div>
  );
};
