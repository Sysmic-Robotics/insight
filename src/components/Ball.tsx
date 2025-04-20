// src/components/Ball.tsx
import React from "react";

export type BallProps = {
  position: { x: number; y: number };
};

const FIELD_WIDTH = 10.4;
const FIELD_HEIGHT = 7.4;

export const Ball: React.FC<BallProps> = ({ position }) => {
  const x = FIELD_WIDTH / 2 + position.x;
  const y = FIELD_HEIGHT / 2 - position.y;

  return (
    <circle
      cx={x}
      cy={y}
      r={0.03} // ~5cm radius
      fill="orange"
      stroke="black"
      strokeWidth={0.005}
    />
  );
};
