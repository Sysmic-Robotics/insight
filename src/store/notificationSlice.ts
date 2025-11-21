// Messages coming from the engine, like script started.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LogEntry {
  timestamp: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
}

interface NotificationState {
  messages: LogEntry[];
}

const initialState: NotificationState = {
  messages: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<LogEntry>) => {
      state.messages.push(action.payload);
      if (state.messages.length > 50) {
        state.messages.shift(); // Remove the oldest message
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = notificationSlice.actions;
export default notificationSlice.reducer;
