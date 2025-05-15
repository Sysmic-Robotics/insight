// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import gamepadReducer from "./gamepadSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    gamepad: gamepadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
