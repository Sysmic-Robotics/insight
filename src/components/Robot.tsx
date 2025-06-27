import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedRobot } from "../store/selectedRobotSlice";

export type RobotProps = {
  id: number;
  team: "blue" | "yellow";
  position: { x: number; y: number };
  orientation: number; // radians
};

const FIELD_WIDTH = 10.4;
const FIELD_HEIGHT = 7.4;

const makeKey = (id: number, team: "blue" | "yellow") => `${team}-${id}`;

export const Robot: React.FC<RobotProps> = ({
  id,
  team,
  position,
  orientation,
}) => {
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();
  const selectedKey = useSelector((state: RootState) => state.selectedRobot.key);

  const fieldCenter = { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2 };

  const robotSize = 0.18; // size of image in meters (same as diameter of circle)
  const halfSize = robotSize / 2;

  const x = fieldCenter.x + position.x;
  const y = fieldCenter.y - position.y; // flip Y for SVG

  const imageHref = `/robots/robot_${id}_${team}.png`;

  const robotKey = makeKey(id, team);
  const highlighted = selectedKey === robotKey;

  return (
    <g
      transform={`rotate(${-orientation * (180 / Math.PI)}, ${x}, ${y})`}
      style={{
        cursor: hovered ? "pointer" : "default",
        transition: "cursor 0.2s",
      }}
      onClick={() => dispatch(setSelectedRobot(robotKey))}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {highlighted && (
        <circle
          cx={x}
          cy={y}
          r={halfSize + 0.05}
          fill="yellow"
          opacity={0.4}
        />
      )}
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
