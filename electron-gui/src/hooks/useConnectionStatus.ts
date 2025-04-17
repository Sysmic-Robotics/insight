// src/hooks/useConnectionStatus.ts
import { useBackendSocketContext } from "../context/BackendSocketContext";

/**
 * Returns the current WebSocket connection status.
 */
export function useConnectionStatus() {
  const { connected } = useBackendSocketContext();
  return connected;
}
