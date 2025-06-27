import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useBackendSocketContext } from "../context/BackendSocketContext";
import { useRobotData } from "../hooks/useRobotData";

const JoystickCommandSender: React.FC = () => {
    const DEADZONE = 0.08; // adjust as needed (0.03–0.08 is common)
    const applyDeadzone = (value: number, threshold: number): number => {
        return Math.abs(value) < threshold ? 0 : value;
    };
    const { robots } = useRobotData();
    const { socket } = useBackendSocketContext();
    const {
        axes,
        buttons,
        connected,
        enabled,
        vxScale,
        vyScale,
        omegaScale,
    } = useSelector((state: RootState) => state.gamepad);

    // Get selected robot key from Redux
    const selectedKey = useSelector((state: RootState) => state.selectedRobot.key);

    const sendSocketMessage = (message: object) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    };

    useEffect(() => {
        if (!connected || !enabled) return;

        // Parse selected robot id and team from key
        let id = 0;
        let team = "blue";
        if (selectedKey) {
            const [teamStr, idStr] = selectedKey.split("-");
            id = Number(idStr);
            team = teamStr as "blue" | "yellow";
        }

        let [lx = 0, ly = 0, rx = 0] = axes;
        lx = applyDeadzone(lx, DEADZONE);
        ly = applyDeadzone(ly, DEADZONE);
        rx = applyDeadzone(rx, DEADZONE);

        const bPressed = buttons[1] ?? false;

        const robot = robots.find((r) => r.id === id && r.team === team);
        const theta = robot?.orientation ?? 0;

        const vxGlobal = lx * vxScale;
        const vyGlobal = -ly * vyScale;

        const cosT = Math.cos(-theta);
        const sinT = Math.sin(-theta);

        const vxLocal = vxGlobal * cosT - vyGlobal * sinT;
        const vyLocal = vxGlobal * sinT + vyGlobal * cosT;

        const message = {
            id: id,
            team: team === "blue" ? 0 : 1,
            type: "joystickCommand",
            vx: vxLocal,
            vy: vyLocal,
            omega: -rx * omegaScale,
            kick: bPressed,
            dribbler: buttons[6] ? 5.0 : 0.0,
        };

        sendSocketMessage(message);

    }, [axes, buttons, connected, enabled, vxScale, vyScale, omegaScale, robots, selectedKey]);

    return null;
};

export default JoystickCommandSender;
