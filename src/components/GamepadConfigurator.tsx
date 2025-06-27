import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setGamepadEnabled,
  setVxScale,
  setVyScale,
  setOmegaScale,
} from "../store/gamepadSlice";

interface GamepadConfiguratorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const GamepadConfigurator: React.FC<GamepadConfiguratorProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const dispatch = useDispatch();
  const { connected, axes, buttons, enabled, vxScale, vyScale, omegaScale } = useSelector(
    (state: RootState) => state.gamepad
  );

  const [isSending, setIsSending] = React.useState(false);

  const toggleEnabled = () => {
    dispatch(setGamepadEnabled(!enabled));
  };

  // Detect if joystick is being moved (axes not near zero)
  React.useEffect(() => {
    const threshold = 0.05;
    if (
      enabled &&
      (
        Math.abs(axes[0] || 0) > threshold ||
        Math.abs(axes[1] || 0) > threshold ||
        Math.abs(axes[2] || 0) > threshold ||
        Math.abs(axes[3] || 0) > threshold
      )
    ) {
      setIsSending(true);
      const timeout = setTimeout(() => setIsSending(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setIsSending(false);
    }
  }, [axes, enabled]);

  const renderJoystick = (x: number, y: number, label: string) => {
    const cx = 25 + x * 25;
    const cy = 25 + y * 25;

    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium">{label}</p>
        <svg width="60" height="60">
          <circle cx="30" cy="30" r="25" fill="#f3f3f3" stroke="#ccc" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="6" fill="#3b82f6" />
        </svg>
        <p className="text-xs text-muted">{`X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`}</p>
      </div>
    );
  };

  const renderButton = (index: number, label: string, color: string) => (
    <div
      className={`px-3 py-1 text-sm rounded font-semibold border ${
        buttons[index]
          ? `${color} border-black scale-105`
          : "bg-gray-100 border-gray-300"
      } transition-transform`}
    >
      {label}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Gamepad Configuration</ModalHeader>
            <ModalBody>
              {!connected && enabled && (
                <p className="text-sm text-muted mb-4">
                  No gamepad detected. Press a button on the controller.
                </p>
              )}

              <div
                className={`space-y-6 transition-all ${
                  !enabled ? "opacity-40 grayscale pointer-events-none" : ""
                }`}
              >
                {/* Joysticks */}
                <div className="flex justify-around">
                  {renderJoystick(axes[0] || 0, axes[1] || 0, "Left Stick")}
                  {renderJoystick(axes[2] || 0, axes[3] || 0, "Right Stick")}
                </div>

                {/* Face Buttons */}
                <div className="flex justify-center gap-4 flex-wrap">
                  {renderButton(2, "X", "bg-blue-400")}
                  {renderButton(0, "A", "bg-green-400")}
                  {renderButton(3, "Y", "bg-yellow-400")}
                  {renderButton(1, "B", "bg-red-400")}
                </div>

                {/* Scale Controls */}
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium">Vx Scale:</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="-?[0-9]*\.?[0-9]*"
                      value={
                        vxScale === 0 && (typeof vxScale === "number" || vxScale === 0) ? "" : String(vxScale)
                      }
                      placeholder="1.00"
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow empty or just minus sign for typing negative numbers
                        if (val === "" || val === "-") {
                          dispatch(setVxScale(val));
                        } else {
                          const num = Number(val);
                          if (!isNaN(num)) {
                            dispatch(setVxScale(num));
                          }
                        }
                      }}
                      className="w-24 ml-2 border rounded px-2 py-1"
                    />
                    <span className="ml-1 text-gray-500">&times;</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Vy Scale:</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="-?[0-9]*\.?[0-9]*"
                      value={
                        vyScale === 0 && (typeof vyScale === "number" || vyScale === 0) ? "" : String(vyScale)
                      }
                      placeholder="1.00"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || val === "-") {
                          dispatch(setVyScale(val));
                        } else {
                          const num = Number(val);
                          if (!isNaN(num)) {
                            dispatch(setVyScale(num));
                          }
                        }
                      }}
                      className="w-24 ml-2 border rounded px-2 py-1"
                    />
                    <span className="ml-1 text-gray-500">&times;</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Theta Scale:</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="-?[0-9]*\.?[0-9]*"
                      value={
                        omegaScale === 0 && (typeof omegaScale === "number" || omegaScale === 0) ? "" : String(omegaScale)
                      }
                      placeholder="1.00"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || val === "-") {
                          dispatch(setOmegaScale(val));
                        } else {
                          const num = Number(val);
                          if (!isNaN(num)) {
                            dispatch(setOmegaScale(num));
                          }
                        }
                      }}
                      className="w-24 ml-2 border rounded px-2 py-1"
                    />
                    <span className="ml-1 text-gray-500">&times;</span>
                  </div>
                  {isSending && (
                    <div className="text-xs text-gray-400 pt-2">
                      Sending joystick commands...
                      <span className="ml-2">
                        Vx={(axes[0] * vxScale).toFixed(2)}, Vy={(axes[1] * vyScale).toFixed(2)}, Ω={(axes[2] * omegaScale).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={toggleEnabled}>
                {enabled ? "Disable Gamepad" : "Enable Gamepad"}
              </Button>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GamepadConfigurator;
