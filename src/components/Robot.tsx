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

  const robotSize = 0.18; // size of image in meters (same as diameter of circle)
  const halfSize = robotSize / 2;

  const x = fieldCenter.x + position.x;
  const y = fieldCenter.y - position.y; // flip Y for SVG

  const imageHref = `/robots/robot_${id}_${team}.png`;

  return (
    <g transform={`rotate(${-orientation * (180 / Math.PI)}, ${x}, ${y})`}>
      <image
        href={imageHref}
        x={x - halfSize}
        y={y - halfSize}
        width={robotSize}
        height={robotSize}
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  );
};
