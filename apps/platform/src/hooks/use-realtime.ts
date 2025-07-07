import { useCallback, useEffect, useRef } from "react";

interface UseRealtimeOptions {
  interval?: number;
  enabled?: boolean;
}

export function useRealtime<T>(
  fetchFn: () => Promise<T>,
  options: UseRealtimeOptions = {}
) {
  const { interval = 5000, enabled = true } = options;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const startPolling = useCallback(() => {
    if (!enabled || intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      if (isMountedRef.current) {
        try {
          await fetchFn();
        } catch (error) {
          console.error("Realtime update failed:", error);
        }
      }
    }, interval);
  }, [fetchFn, interval, enabled]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    if (enabled) {
      startPolling();
    }

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return { startPolling, stopPolling };
}
