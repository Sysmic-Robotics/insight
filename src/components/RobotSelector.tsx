import React from "react";
import { Robot } from "../hooks/useRobotData";
import {
  Box,
  Button,
  Flex,
  Text,
  Separator,
  Card,
  Grid
} from "@radix-ui/themes";

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
    <Box mb="5">
      <Text as="h2" size="3" weight="bold" mb="2">
        Robots
      </Text>

      <Flex wrap="wrap" gap="2">
        {robots.map((robot) => (
          <Button
            key={`${robot.team}-${robot.id}`}
            variant={selectedId === robot.id ? "solid" : "soft"}
            color={selectedId === robot.id ? "blue" : "gray"}
            radius="none"
            onClick={() => onChange(robot.id)}
            size="1"
          >
            #{robot.id}
          </Button>
        ))}
      </Flex>

      <Box mt="4">
        {selectedRobot ? (
          <RobotInfo robot={selectedRobot} />
        ) : (
          <RobotPlaceholder />
        )}
      </Box>
    </Box>
  );
};

function RobotInfo({ robot }: { robot: Robot }) {
  return (
    <Card
      variant="classic"
      size="2"
    >
      <Flex direction="column" gap="3">
        {/* Header */}
        <Flex align="center" justify="between">
          <Text as="h3" size="3" weight="bold">
            🤖 Robot #{robot.id}
          </Text>
          <Text size="1" color="gray">
            Team: <Text as="span">{robot.team}</Text>
          </Text>
        </Flex>

        <Separator size="4" />

        {/* Stat Grid */}
        <Grid columns="2" gap="3">
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Position</Text>
            <Text size="2">
              ({robot.position.x.toFixed(2)}, {robot.position.y.toFixed(2)})
            </Text>
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Velocity</Text>
            <Text size="2">
              ({robot.velocity.x.toFixed(2)}, {robot.velocity.y.toFixed(2)})
            </Text>
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Orientation</Text>
            <Text size="2">{robot.orientation.toFixed(2)}</Text>
          </Flex>
        </Grid>
      </Flex>
    </Card>
  );
}


function RobotPlaceholder() {
  return (
    <Box
      p="3"
      style={{
        border: "1px dashed var(--gray-6)",
        backgroundColor: "var(--gray-3)",
        color: "var(--gray-10)",
        fontStyle: "italic",
        textAlign: "center",
      }}
    >
      No robot selected
    </Box>
  );
}
