// src/context/BackendSocketContext.tsx
import React, { createContext, useContext } from "react";
import { useBackendSocket } from "../hooks/useBackendSocket";

const BackendSocketContext = createContext<ReturnType<typeof useBackendSocket> | null>(null);

export const BackendSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketState = useBackendSocket();
  return <BackendSocketContext.Provider value={socketState}>{children}</BackendSocketContext.Provider>;
};

export const useBackendSocketContext = () => {
  const ctx = useContext(BackendSocketContext);
  if (!ctx) throw new Error("useBackendSocketContext must be used within BackendSocketProvider");
  return ctx;
};
