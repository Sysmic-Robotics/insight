// store/gamepadSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GamepadState {
  connected: boolean;
  axes: number[];
  buttons: boolean[];
  enabled: boolean; // ← new flag
}

const initialState: GamepadState = {
  connected: false,
  axes: [],
  buttons: [],
  enabled: true,
};

const gamepadSlice = createSlice({
  name: "gamepad",
  initialState,
  reducers: {
    updateGamepad(state, action: PayloadAction<Omit<GamepadState, "enabled">>) {
      if (!state.enabled) return; // ignore updates if disabled
      state.connected = action.payload.connected;
      state.axes = action.payload.axes;
      state.buttons = action.payload.buttons;
    },
    setGamepadEnabled(state, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
      if (!action.payload) {
        state.connected = false;
        state.axes = [];
        state.buttons = [];
      }
    },
  },
});

export const { updateGamepad, setGamepadEnabled } = gamepadSlice.actions;
export default gamepadSlice.reducer;
