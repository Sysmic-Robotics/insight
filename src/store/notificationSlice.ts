// notificationSlice.ts
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
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = notificationSlice.actions;
export default notificationSlice.reducer;
