import React, { useRef } from "react";
import { useButton } from "react-aria";
import { Robot } from "../hooks/useRobotData";

type RobotSelectorProps = {
  robots: Robot[];
  selectedId: number | null;
  onChange: (id: number) => void;
};

export const RobotSelector: React.FC<RobotSelectorProps> = ({
  robots,
  selectedId,
  onChange,
}) => {
  const selectedRobot = robots.find((r) => r.id === selectedId);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Robots</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {robots.map((robot) => (
          <RobotButton
            key={robot.id}
            robot={robot}
            selected={selectedId === robot.id}
            onSelect={() => onChange(robot.id)}
          />
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        {selectedRobot ? (
          <RobotInfo robot={selectedRobot} />
        ) : (
          <RobotPlaceholder />
        )}
      </div>
    </div>
  );
};

function RobotButton({
  robot,
  selected,
  onSelect,
}: {
  robot: Robot;
  selected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef(null);
  const { buttonProps } = useButton({ onPress: onSelect }, ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      style={{
        padding: "0.4rem 0.75rem",
        borderRadius: "6px",
        border: "1px solid #444",
        backgroundColor: selected ? "#3f51b5" : "#2a2a2a",
        color: selected ? "#fff" : "#ccc",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.85rem",
        transition: "all 0.2s ease",
      }}
    >
      #{robot.id}
    </button>
  );
}

function RobotInfo({ robot }: { robot: Robot }) {
  return (
    <div
      style={{
        padding: "0.75rem",
        border: "1px solid #444",
        borderRadius: "6px",
        backgroundColor: "#111",
        lineHeight: "1.3", // 🔽 tighter vertical spacing
        fontSize: "0.85rem", // optional: slight text shrink
      }}
    >
      <h3 style={{ marginBottom: "0.25rem", lineHeight: "1.2" }}>Robot #{robot.id}</h3>
      <p style={{ margin: 0 }}>Team: {robot.team}</p>
      <p style={{ margin: 0 }}>
        Pos: ({robot.position.x.toFixed(2)}, {robot.position.y.toFixed(2)})
      </p>
      <p style={{ margin: 0 }}>
        Vel: ({robot.velocity.x.toFixed(2)}, {robot.velocity.y.toFixed(2)})
      </p>
      <p style={{ margin: 0 }}>Ori: {robot.orientation.toFixed(2)}</p>
    </div>
  );
}


function RobotPlaceholder() {
  return (
    <div
      style={{
        padding: "0.75rem",
        border: "1px dashed #555",
        borderRadius: "6px",
        backgroundColor: "#1c1c1c",
        color: "#888",
        textAlign: "center",
        fontStyle: "italic",
      }}
    >
      No robot selected
    </div>
  );
}
