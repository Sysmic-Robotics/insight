// hooks/useGamepadPolling.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGamepad } from "../store/gamepadSlice";
import { RootState } from "../store/store"; // adjust path to where RootState is exported

export const useGamepadPolling = () => {
    const dispatch = useDispatch();
    const { enabled } = useSelector((state: RootState) => state.gamepad);

    useEffect(() => {
    if (!enabled) return;

    const poll = () => {
        const pads = navigator.getGamepads();
        const gp = pads[0];
        dispatch(
        updateGamepad({
            connected: !!gp,
            axes: gp ? gp.axes.slice(0, 4) : [],
            buttons: gp ? gp.buttons.map((b) => b.pressed) : [],
        })
        );
    };

    const interval = setInterval(poll, 16);
    return () => clearInterval(interval);
    }, [enabled, dispatch]);
};
