// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import gamepadReducer from "./gamepadSlice";
import selectedRobotReducer from "./selectedRobotSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    gamepad: gamepadReducer,
    selectedRobot: selectedRobotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
