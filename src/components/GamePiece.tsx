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
    left: piece.space.column * piece.board.spaceSize[0],
    top: piece.space.row * piece.board.spaceSize[1],
    relativeX: 0,
    relativeY: 0,
    relativeScale: 1,
    blocked: piece.blocked,
  };
  const [position, setPosition] = useState(initialPos);
  // const [blocked, setBlocked] = useState(piece.blocked);

  // piece.addPieceComponent(setBlocked, setPosition);
  piece.addPieceComponent(setPosition);

  // console.log("drawn" + piece.id);
  // if (piece.id === 4) console.log(piece);

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
        className="game-piece color__piece"
        drag
        animate={{
          x: [position.relativeX, 0],
          y: [position.relativeY, 0],
          scale: [position.relativeScale, 1],
          // x: [position.relativeX],
          // y: [position.relativeY],
          // scale: [position.relativeScale],
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
        {/* {piece.space.row}
        {piece.space.column} */}
        {position.blocked ? (
          <div className="game-piece__blocked">X</div>
        ) : (
          piece.id
        )}
      </motion.div>
    </div>
  );
};

export default GamePiece;
