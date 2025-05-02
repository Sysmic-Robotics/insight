import React, { useState, useRef } from "react";
import { Robot, RobotProps } from "./Robot";
import { Ball as BallComponent } from "./Ball";



const FIELD_WIDTH = 10.4;
const FIELD_HEIGHT = 7.4;
const PLAY_WIDTH = 9.0;
const PLAY_HEIGHT = 6.0;
const DEFENSE_WIDTH = 1.0;
const DEFENSE_HEIGHT = 2.0;
const GOAL_WIDTH = 1.0;
const GOAL_DEPTH = 0.18;
const LINE_WIDTH = 0.01;
const CENTER_CIRCLE_RADIUS = 0.5;

export const Field: React.FC<{ robots: RobotProps[]; ball: BallComponent | null }> = ({ robots, ball }) => {


  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    setZoom((prev) => Math.min(Math.max(prev + delta * 0.01, 0.2), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setDragging(false);
    dragStart.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;

    const dx = (e.clientX - dragStart.current.x) / 100 / zoom;
    const dy = (e.clientY - dragStart.current.y) / 100 / zoom;

    setOffset((prev) => ({
      x: prev.x - dx,
      y: prev.y - dy,
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const viewWidth = FIELD_WIDTH / zoom;
  const viewHeight = FIELD_HEIGHT / zoom;
  const viewX = (FIELD_WIDTH - viewWidth) / 2 + offset.x;
  const viewY = (FIELD_HEIGHT - viewHeight) / 2 + offset.y;

  const isModifiedView = zoom !== 1 || offset.x !== 0 || offset.y !== 0;

  return (
    <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      userSelect: "none", // ✅ disables text selection
    }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >

      
      {isModifiedView && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#333",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            zIndex: 10,
            fontSize: "0.85rem",
            userSelect: "none",
          }}
          onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
        >
          Reset View
        </div>
      )}

      <svg
        viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ background: "#808080", display: "block", cursor: dragging ? "grabbing" : "grab" }}
      >
        {/* Play area */}
        <rect
          x={(FIELD_WIDTH - PLAY_WIDTH) / 2}
          y={(FIELD_HEIGHT - PLAY_HEIGHT) / 2}
          width={PLAY_WIDTH}
          height={PLAY_HEIGHT}
          fill="none"
          stroke="white"
          strokeWidth={LINE_WIDTH}
        />

        {/* Halfway Line */}
        <line
          x1={FIELD_WIDTH / 2}
          y1={(FIELD_HEIGHT - PLAY_HEIGHT) / 2}
          x2={FIELD_WIDTH / 2}
          y2={(FIELD_HEIGHT + PLAY_HEIGHT) / 2}
          stroke="white"
          strokeWidth={LINE_WIDTH}
        />

        {/* Goal-to-goal Line */}
        <line
          x1={(FIELD_WIDTH - PLAY_WIDTH) / 2}
          y1={FIELD_HEIGHT / 2}
          x2={(FIELD_WIDTH + PLAY_WIDTH) / 2}
          y2={FIELD_HEIGHT / 2}
          stroke="white"
          strokeWidth={LINE_WIDTH}
        />

        {/* Center Circle */}
        <circle
          cx={FIELD_WIDTH / 2}
          cy={FIELD_HEIGHT / 2}
          r={CENTER_CIRCLE_RADIUS}
          stroke="white"
          strokeWidth={LINE_WIDTH}
          fill="none"
        />

        {/* Defense Areas */}
        <rect
          x={(FIELD_WIDTH - PLAY_WIDTH) / 2}
          y={(FIELD_HEIGHT - DEFENSE_HEIGHT) / 2}
          width={DEFENSE_WIDTH}
          height={DEFENSE_HEIGHT}
          stroke="white"
          fill="none"
          strokeWidth={LINE_WIDTH}
        />
        <rect
          x={(FIELD_WIDTH + PLAY_WIDTH) / 2 - DEFENSE_WIDTH}
          y={(FIELD_HEIGHT - DEFENSE_HEIGHT) / 2}
          width={DEFENSE_WIDTH}
          height={DEFENSE_HEIGHT}
          stroke="white"
          fill="none"
          strokeWidth={LINE_WIDTH}
        />

        {/* Goals */}
        <rect
          x={(FIELD_WIDTH - PLAY_WIDTH) / 2 - GOAL_DEPTH}
          y={(FIELD_HEIGHT - GOAL_WIDTH) / 2}
          width={GOAL_DEPTH}
          height={GOAL_WIDTH}
          fill="none"
          stroke="white"
          strokeWidth={LINE_WIDTH}
        />
        <rect
          x={(FIELD_WIDTH + PLAY_WIDTH) / 2}
          y={(FIELD_HEIGHT - GOAL_WIDTH) / 2}
          width={GOAL_DEPTH}
          height={GOAL_WIDTH}
          fill="none"
          stroke="white"
          strokeWidth={LINE_WIDTH}
        />
        {/* Robots */}
  {robots.map((robot) => (
    <Robot key={`${robot.team}-${robot.id}`} {...robot} />
  ))}
  {/* Ball */}
  {ball && <BallComponent key="ball" position={ball.position} />}



</svg>
</div>
  );
};
