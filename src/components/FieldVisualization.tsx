import React, {useState, useRef} from "react";
import { Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Robot, RobotProps } from "./Robot";
import { Ball as BallComponent, BallProps } from "./Ball";

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

const FieldVisualization: React.FC<{ robots?: RobotProps[]; ball?: BallProps | null }> = ({
  robots = [],
  ball = null,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseFieldCoords, setMouseFieldCoords] = useState<{x: number, y: number} | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 5));
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
    if (dragging && dragStart.current) {
      const dx = (e.clientX - dragStart.current.x) / 100 / zoom;
      const dy = (e.clientY - dragStart.current.y) / 100 / zoom;
      setOffset(prev => ({ x: prev.x - dx, y: prev.y - dy }));
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const relX = e.clientX - bounds.left;
    const relY = e.clientY - bounds.top;
    const svgX = viewX + (relX / bounds.width) * viewWidth;
    const svgY = viewY + (relY / bounds.height) * viewHeight;
    const fieldX = svgX - FIELD_WIDTH / 2;
    const fieldY = svgY - FIELD_HEIGHT / 2;
    setMouseFieldCoords({ x: parseFloat(fieldX.toFixed(2)), y: parseFloat(fieldY.toFixed(2)) });
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const viewWidth = FIELD_WIDTH / zoom;
  const viewHeight = FIELD_HEIGHT / zoom;
  const viewX = (FIELD_WIDTH - viewWidth) / 2 + offset.x;
  const viewY = (FIELD_HEIGHT - viewHeight) / 2 + offset.y;

  return (
    <div ref={containerRef}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          userSelect: "none",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <svg
          viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{
            background: "#6D7B8D",
            display: "block",
            cursor: dragging ? "grabbing" : "default",
          }}
        >
          <rect
            x={(FIELD_WIDTH - PLAY_WIDTH) / 2}
            y={(FIELD_HEIGHT - PLAY_HEIGHT) / 2}
            width={PLAY_WIDTH}
            height={PLAY_HEIGHT}
            fill="none"
            stroke="white"
            strokeWidth={LINE_WIDTH}
          />
          <line
            x1={FIELD_WIDTH / 2}
            y1={(FIELD_HEIGHT - PLAY_HEIGHT) / 2}
            x2={FIELD_WIDTH / 2}
            y2={(FIELD_HEIGHT + PLAY_HEIGHT) / 2}
            stroke="white"
            strokeWidth={LINE_WIDTH}
          />
          <line
            x1={(FIELD_WIDTH - PLAY_WIDTH) / 2}
            y1={FIELD_HEIGHT / 2}
            x2={(FIELD_WIDTH + PLAY_WIDTH) / 2}
            y2={FIELD_HEIGHT / 2}
            stroke="white"
            strokeWidth={LINE_WIDTH}
          />
          <circle
            cx={FIELD_WIDTH / 2}
            cy={FIELD_HEIGHT / 2}
            r={CENTER_CIRCLE_RADIUS}
            stroke="white"
            strokeWidth={LINE_WIDTH}
            fill="none"
          />
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
          {robots.map((robot) => (
            <Robot key={`${robot.team}-${robot.id}`} {...robot} />
          ))}
          {ball && <BallComponent key="ball" position={ball.position} />}
        </svg>
      </div>

      {mouseFieldCoords && (
        <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 rounded">
          X: {mouseFieldCoords.x} Y: {mouseFieldCoords.y}
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        <div
          className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-default-200"
          onClick={zoomIn}
        >
          <Icon icon="lucide:zoom-in" />
        </div>
        <div
          className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-default-200"
          onClick={zoomOut}
        >
          <Icon icon="lucide:zoom-out" />
        </div>
        <div
          className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-default-200"
          onClick={resetView}
        >
          <Icon icon="lucide:refresh-cw" />
        </div>
      </div>
    </div>
  );
};

export default FieldVisualization;
