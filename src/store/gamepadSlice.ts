import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GamepadState {
  connected: boolean;
  axes: number[];
  buttons: boolean[];
  enabled: boolean;
  vxScale: number;
  vyScale: number;
  omegaScale: number;
}

const initialState: GamepadState = {
  connected: false,
  axes: [],
  buttons: [],
  enabled: true,
  vxScale: 1,
  vyScale: 1,
  omegaScale: 1,
};

const gamepadSlice = createSlice({
  name: "gamepad",
  initialState,
  reducers: {
    updateGamepad(state, action: PayloadAction<Omit<GamepadState, "enabled" | "vxScale" | "vyScale" | "omegaScale">>) {
      if (!state.enabled) return;
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
    setVxScale(state, action: PayloadAction<number>) {
      state.vxScale = action.payload;
    },
    setVyScale(state, action: PayloadAction<number>) {
      state.vyScale = action.payload;
    },
    setOmegaScale(state, action: PayloadAction<number>) {
      state.omegaScale = action.payload;
    },
  },
});

export const {
  updateGamepad,
  setGamepadEnabled,
  setVxScale,
  setVyScale,
  setOmegaScale,
} = gamepadSlice.actions;

export default gamepadSlice.reducer;
