import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedRobotState {
  key: string | null;
}

const initialState: SelectedRobotState = {
  key: null,
};

const selectedRobotSlice = createSlice({
  name: "selectedRobot",
  initialState,
  reducers: {
    setSelectedRobot(state, action: PayloadAction<string>) {
      state.key = action.payload;
    },
    clearSelectedRobot(state) {
      state.key = null;
    },
  },
});

export const { setSelectedRobot, clearSelectedRobot } = selectedRobotSlice.actions;
export default selectedRobotSlice.reducer;