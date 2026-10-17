import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

const snapshotCache = new Map<string, unknown>();

/**
 * Lee un valor del almacenamiento una sola vez en el cliente, usando un
 * `fallback` como snapshot del servidor para hidratar sin errores ni parpadeos.
 */
export function useStoredValue<T>(
  key: string,
  read: () => T | null,
  fallback: T,
): T {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      if (!snapshotCache.has(key)) {
        snapshotCache.set(key, read() ?? fallback);
      }
      return snapshotCache.get(key) as T;
    },
    () => fallback,
  );
}
