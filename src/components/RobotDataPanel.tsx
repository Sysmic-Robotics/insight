import React from "react";
import { Select, SelectItem, Card, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Robot {
  id: number;
  battery: number;
  status: "online" | "offline" | "error";
  lastSeen: string;
}

const RobotDataPanel: React.FC = () => {
  // Sample robot data
  const robots: Robot[] = [
    { id: 1, battery: 85, status: "online", lastSeen: "Just now" },
    { id: 2, battery: 62, status: "online", lastSeen: "Just now" },
    { id: 3, battery: 24, status: "error", lastSeen: "5 min ago" },
    { id: 4, battery: 91, status: "online", lastSeen: "Just now" },
    { id: 5, battery: 0, status: "offline", lastSeen: "1 hour ago" },
  ];

  const [selectedRobot, setSelectedRobot] = React.useState<Robot | null>(robots[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "default";
      case "error":
        return "danger";
      default:
        return "default";
    }
  };

  const getBatteryIcon = (level: number) => {
    if (level > 75) return "lucide:battery-full";
    if (level > 50) return "lucide:battery-medium";
    if (level > 15) return "lucide:battery-low";
    return "lucide:battery-warning";
  };

  const handleSelectionChange = (key: React.Key) => {
    const robot = robots.find(r => r.id === Number(key));
    setSelectedRobot(robot || null);
  };

  return (
    <div className="p-2 flex flex-col h-full">
      <Select 
        label="Select Robot" 
        className="mb-4"
        selectedKeys={selectedRobot ? [selectedRobot.id.toString()] : []}
        onSelectionChange={keys => {
          const selectedKey = Array.from(keys)[0];
          handleSelectionChange(selectedKey);
        }}
      >
        {robots.map((robot) => (
          <SelectItem 
            key={robot.id} 
            startContent={
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  robot.status === "online" ? "bg-success-500" : 
                  robot.status === "error" ? "bg-danger-500" : "bg-default-300"
                }`} />
              </div>
            }
          >
            Robot {robot.id}
          </SelectItem>
        ))}
      </Select>
      
      {selectedRobot && (
        <Card className="p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Robot {selectedRobot.id}</h3>
            <Chip
              color={getStatusColor(selectedRobot.status)}
              variant="flat"
              size="sm"
              className="capitalize"
            >
              {selectedRobot.status}
            </Chip>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
              <span className="font-medium">Battery</span>
              <div className="flex items-center">
                <Icon icon={getBatteryIcon(selectedRobot.battery)} className="mr-1" />
                <span>{selectedRobot.battery}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
              <span className="font-medium">Last Seen</span>
              <span>{selectedRobot.lastSeen}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
              <span className="font-medium">Position</span>
              <span>X: 120, Y: 85</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
              <span className="font-medium">Orientation</span>
              <span>45°</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
              <span className="font-medium">Velocity</span>
              <span>0.5 m/s</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RobotDataPanel;