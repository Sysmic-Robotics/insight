import React, { useState, useRef } from "react";
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

type Line = { x1: number; y1: number; x2: number; y2: number };
type FreehandStroke = { points: { x: number; y: number }[] };

const FieldVisualization: React.FC<{ robots?: RobotProps[]; ball?: BallProps | null }> = ({
  robots = [],
  ball = null,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseFieldCoords, setMouseFieldCoords] = useState<{ x: number; y: number } | null>(null);

  const [lines, setLines] = useState<Line[]>([]);
  const [lineStart, setLineStart] = useState<{ x: number; y: number } | null>(null);
  const [draftEnd, setDraftEnd] = useState<{ x: number; y: number } | null>(null);
  const [drawMenuOpen, setDrawMenuOpen] = useState(false);
  const [penMode, setPenMode] = useState(false);
  const [freehandMode, setFreehandMode] = useState(false);
  const [freehandStrokes, setFreehandStrokes] = useState<FreehandStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<FreehandStroke | null>(null);

  // Add eraser mode state
  const [eraserMode, setEraserMode] = useState(false);

  // Eraser area state (null if not hovering)
  const [eraserArea, setEraserArea] = useState<{ x: number; y: number } | null>(null);
  const ERASER_RADIUS = 0.2; // field units, adjust as needed

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (penMode) {
      const { x, y } = getFieldCoords(e);
      setLineStart({ x, y });
    } else if (freehandMode) {
      const { x, y } = getFieldCoords(e);
      setCurrentStroke({ points: [{ x, y }] });
    } else {
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && dragStart.current) {
      const dx = (e.clientX - dragStart.current.x) / 100 / zoom;
      const dy = (e.clientY - dragStart.current.y) / 100 / zoom;
      setOffset(prev => ({ x: prev.x - dx, y: prev.y - dy }));
      dragStart.current = { x: e.clientX, y: e.clientY };
    }

    const { x, y } = getFieldCoords(e);
    setMouseFieldCoords({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });

    if (penMode && lineStart) setDraftEnd({ x, y });

    if (freehandMode && currentStroke) {
      setCurrentStroke(stroke => stroke
        ? { points: [...stroke.points, { x, y }] }
        : null
      );
    }

    // Track eraser area position on mouse move
    if (eraserMode) {
      const { x, y } = getFieldCoords(e);
      setEraserArea({ x, y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (penMode && lineStart && draftEnd) {
      setLines(prev => [...prev, { x1: lineStart.x, y1: lineStart.y, x2: draftEnd.x, y2: draftEnd.y }]);
    }
    setLineStart(null);
    setDraftEnd(null);
    setDragging(false);
    dragStart.current = null;

    if (freehandMode && currentStroke && currentStroke.points.length > 1) {
      setFreehandStrokes(strokes => [...strokes, currentStroke]);
    }
    setCurrentStroke(null);
  };

  // Eraser handler: click near a line or stroke to remove it
  const handleEraserClick = (e: React.MouseEvent) => {
    const { x, y } = getFieldCoords(e);

    // Remove all lines within eraser area
    setLines(prev =>
      prev.filter(line =>
        pointToLineDistToSegment(x, y, line.x1, line.y1, line.x2, line.y2) > ERASER_RADIUS
      )
    );

    // Remove all freehand strokes with any point within eraser area
    setFreehandStrokes(prev =>
      prev.filter(stroke =>
        !stroke.points.some(p => Math.hypot(p.x - x, p.y - y) < ERASER_RADIUS)
      )
    );
  };

  // Helper: distance from point to line segment
  function pointToLineDistToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Hide eraser area when mouse leaves SVG
  const handleEraserLeave = () => setEraserArea(null);

  const viewWidth = FIELD_WIDTH / zoom;
  const viewHeight = FIELD_HEIGHT / zoom;
  const viewX = (FIELD_WIDTH - viewWidth) / 2 + offset.x;
  const viewY = (FIELD_HEIGHT - viewHeight) / 2 + offset.y;

  const getFieldCoords = (e: React.MouseEvent) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    const relX = e.clientX - (bounds?.left ?? 0);
    const relY = e.clientY - (bounds?.top ?? 0);
    const svgX = viewX + (relX / (bounds?.width ?? 1)) * viewWidth;
    const svgY = viewY + (relY / (bounds?.height ?? 1)) * viewHeight;
    return {
      x: svgX - FIELD_WIDTH / 2,
      y: svgY - FIELD_HEIGHT / 2,
    };
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };
  const clearLines = () => {
    setLines([]);
    setFreehandStrokes([]);
    setCurrentStroke(null);
  };

  // When switching modes, close menu and disable other mode
  const handlePenMode = () => {
    setPenMode((p) => !p);
    setFreehandMode(false);
    setEraserMode(false);
  };
  const handleFreehandMode = () => {
    setFreehandMode((f) => !f);
    setPenMode(false);
    setEraserMode(false);
  };

  // Add this function to fix the error
  const handleEraserMove = (e: React.MouseEvent) => {
    const { x, y } = getFieldCoords(e);
    setEraserArea({ x, y });
  };

  return (
    <div ref={containerRef}>
      <div
        style={{ width: "100%", height: "100%", position: "relative", userSelect: "none" }}
        onWheel={handleWheel}
        onMouseDown={eraserMode ? handleEraserClick : handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={eraserMode ? handleEraserMove : handleMouseMove}
        onMouseLeave={eraserMode ? handleEraserLeave : undefined}
      >
        <svg
          viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{
            background: "#6D7B8D",
            display: "block",
            cursor: eraserMode
              ? 'url("/eraser-color-icon.svg") 4 4, pointer'
              : penMode || freehandMode
              ? "crosshair"
              : dragging
              ? "grabbing"
              : "default",
          }}
        >
          {/* Field Geometry */}
          <rect x={(FIELD_WIDTH - PLAY_WIDTH) / 2} y={(FIELD_HEIGHT - PLAY_HEIGHT) / 2} width={PLAY_WIDTH} height={PLAY_HEIGHT} fill="none" stroke="white" strokeWidth={LINE_WIDTH} />
          <line x1={FIELD_WIDTH / 2} y1={(FIELD_HEIGHT - PLAY_HEIGHT) / 2} x2={FIELD_WIDTH / 2} y2={(FIELD_HEIGHT + PLAY_HEIGHT) / 2} stroke="white" strokeWidth={LINE_WIDTH} />
          <line x1={(FIELD_WIDTH - PLAY_WIDTH) / 2} y1={FIELD_HEIGHT / 2} x2={(FIELD_WIDTH + PLAY_WIDTH) / 2} y2={FIELD_HEIGHT / 2} stroke="white" strokeWidth={LINE_WIDTH} />
          <circle cx={FIELD_WIDTH / 2} cy={FIELD_HEIGHT / 2} r={CENTER_CIRCLE_RADIUS} stroke="white" strokeWidth={LINE_WIDTH} fill="none" />
          <rect x={(FIELD_WIDTH - PLAY_WIDTH) / 2} y={(FIELD_HEIGHT - DEFENSE_HEIGHT) / 2} width={DEFENSE_WIDTH} height={DEFENSE_HEIGHT} stroke="white" fill="none" strokeWidth={LINE_WIDTH} />
          <rect x={(FIELD_WIDTH + PLAY_WIDTH) / 2 - DEFENSE_WIDTH} y={(FIELD_HEIGHT - DEFENSE_HEIGHT) / 2} width={DEFENSE_WIDTH} height={DEFENSE_HEIGHT} stroke="white" fill="none" strokeWidth={LINE_WIDTH} />
          <rect x={(FIELD_WIDTH - PLAY_WIDTH) / 2 - GOAL_DEPTH} y={(FIELD_HEIGHT - GOAL_WIDTH) / 2} width={GOAL_DEPTH} height={GOAL_WIDTH} fill="none" stroke="white" strokeWidth={LINE_WIDTH} />
          <rect x={(FIELD_WIDTH + PLAY_WIDTH) / 2} y={(FIELD_HEIGHT - GOAL_WIDTH) / 2} width={GOAL_DEPTH} height={GOAL_WIDTH} fill="none" stroke="white" strokeWidth={LINE_WIDTH} />

          {/* Custom Drawn Lines */}
          {lines.map((line, idx) => (
            <line
              key={idx}
              x1={line.x1 + FIELD_WIDTH / 2}
              y1={line.y1 + FIELD_HEIGHT / 2}
              x2={line.x2 + FIELD_WIDTH / 2}
              y2={line.y2 + FIELD_HEIGHT / 2}
              stroke="yellow"
              strokeWidth={0.02}
            />
          ))}

          {/* Freehand Strokes */}
          {freehandStrokes.map((stroke, idx) => (
            <polyline
              key={idx}
              fill="none"
              stroke="orange"
              strokeWidth={0.025}
              points={stroke.points.map(p => `${p.x + FIELD_WIDTH / 2},${p.y + FIELD_HEIGHT / 2}`).join(" ")}
            />
          ))}
          {/* Current Freehand Stroke */}
          {freehandMode && currentStroke && (
            <polyline
              fill="none"
              stroke="orange"
              strokeWidth={0.025}
              strokeDasharray="2"
              points={currentStroke.points.map(p => `${p.x + FIELD_WIDTH / 2},${p.y + FIELD_HEIGHT / 2}`).join(" ")}
            />
          )}

          {/* Draft Line */}
          {lineStart && draftEnd && (
            <line
              x1={lineStart.x + FIELD_WIDTH / 2}
              y1={lineStart.y + FIELD_HEIGHT / 2}
              x2={draftEnd.x + FIELD_WIDTH / 2}
              y2={draftEnd.y + FIELD_HEIGHT / 2}
              stroke="gray"
              strokeDasharray="4"
              strokeWidth={0.02}
            />
          )}

          {/* Robots and Ball */}
          {robots.map((robot) => (
            <Robot key={`${robot.team}-${robot.id}`} {...robot} />
          ))}
          {ball && <BallComponent key="ball" position={ball.position} />}

          {/* Eraser area visualization */}
          {eraserMode && eraserArea && (
            <circle
              cx={eraserArea.x + FIELD_WIDTH / 2}
              cy={eraserArea.y + FIELD_HEIGHT / 2}
              r={ERASER_RADIUS}
              fill="rgba(80,80,80,0.25)" // gray shadow
              stroke="gray"
              strokeWidth={0.03}
              pointerEvents="none"
            />
          )}
        </svg>
      </div>

      {/* Mouse coordinates */}
      {mouseFieldCoords && (
        <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 rounded">
          X: {mouseFieldCoords.x} Y: {-mouseFieldCoords.y}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 items-end">
        <div className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-default-200" onClick={zoomIn}>
          <Icon icon="lucide:zoom-in" />
        </div>
        <div className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-default-200" onClick={zoomOut}>
          <Icon icon="lucide:zoom-out" />
        </div>
        <div className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-default-200" onClick={resetView}>
          <Icon icon="lucide:refresh-cw" />
        </div>
        {/* Pencil button */}
        <div className={`relative`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${drawMenuOpen ? "bg-primary-500 text-white" : "bg-default-100 hover:bg-default-200"}`}
            onClick={() => setDrawMenuOpen((open) => !open)}
            title="Drawing Tools"
          >
            <Icon icon="lucide:pencil" />
          </div>
          {/* Drawing menu - appears above pencil, only when drawMenuOpen is true */}
          {drawMenuOpen && (
            <div className="flex flex-col gap-2 absolute bottom-10 right-0 mb-2 z-10">
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border ${penMode ? "bg-primary-500 text-white" : "bg-default-100 hover:bg-default-200"}`}
                onClick={handlePenMode}
                title="Draw Line"
              >
                <Icon icon="lucide:pen-tool" />
              </button>
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border ${freehandMode ? "bg-primary-500 text-white" : "bg-default-100 hover:bg-default-200"}`}
                onClick={handleFreehandMode}
                title="Freehand Draw"
              >
                <Icon icon="lucide:brush" />
              </button>
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border ${eraserMode ? "bg-primary-500 text-white" : "bg-default-100 hover:bg-default-200"}`}
                onClick={() => {
                  setEraserMode((e) => !e);
                  setPenMode(false);
                  setFreehandMode(false);
                }}
                title="Eraser"
              >
                <Icon icon="lucide:eraser" />
              </button>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border bg-danger-500 text-white hover:bg-danger-600"
                onClick={clearLines}
                title="Clear all lines"
              >
                <Icon icon="lucide:trash" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldVisualization;