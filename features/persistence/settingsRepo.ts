import { DEFAULT_STORE_NAME } from "@/lib/constants";
import type { Settings } from "@/types";
import { isSettings } from "./guards";
import { loadJson, saveJson } from "./json";
import { KEYS } from "./schema";
import { browserStorage, type StorageLike } from "./storage";

export const DEFAULT_SETTINGS: Settings = {
  storeName: DEFAULT_STORE_NAME,
  currency: "MXN",
  taxRate: 0,
  inventoryControl: true,
  muted: false,
  reduceAnimations: false,
};

/** Carga las preferencias persistidas, o `null` si no hay datos válidos. */
export function loadSettings(
  storage: StorageLike = browserStorage,
): Settings | null {
  const data = loadJson<unknown>(storage, KEYS.settings);
  return isSettings(data) ? data : null;
}

/** Guarda las preferencias de la aplicación. */
export function saveSettings(
  storage: StorageLike = browserStorage,
  settings: Settings,
): void {
  saveJson(storage, KEYS.settings, settings);
}
