import React from "react";

export type RobotProps = {
  id: number;
  team: "blue" | "yellow";
  position: { x: number; y: number };
  orientation: number; // radians
};

const FIELD_WIDTH = 10.4;
const FIELD_HEIGHT = 7.4;

export const Robot: React.FC<RobotProps> = ({ id, team, position, orientation }) => {
  const fieldCenter = { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2 };

  const radius = 0.09; // robot radius in meters
  const arrowLength = radius;

  const x = fieldCenter.x + position.x;
  const y = fieldCenter.y - position.y; // Y axis is flipped in SVG

  const endX = x + arrowLength * Math.cos(orientation);
  const endY = y - arrowLength * Math.sin(orientation); // flip Y again

  return (
    <g>
      {/* Robot body */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={team === "blue" ? "#4848f2" : "#f6edc3"}
        stroke="black"
        strokeWidth={0.02}
      />

      {/* Orientation arrow */}
      <line
        x1={x}
        y1={y}
        x2={endX}
        y2={endY}
        stroke="black"
        strokeWidth={0.02}
      />

      {/* Optional: ID label */}
      <text
        x={x}
        y={y + 0.05}
        textAnchor="middle"
        fill="black"
        fontSize={0.2}
        pointerEvents="none"
      >
        {id}
      </text>
    </g>
  );
};
