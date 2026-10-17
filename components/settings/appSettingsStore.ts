import { useSyncExternalStore } from "react";
import {
  browserStorage,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
} from "@/features/persistence";
import type { Settings } from "@/types";

let settings: Settings = DEFAULT_SETTINGS;
let hydrated = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function hydrateIfNeeded() {
  if (!hydrated) {
    const stored = loadSettings(browserStorage);
    if (stored) {
      settings = stored;
    }
    hydrated = true;
  }
}

function update(patch: Partial<Settings>) {
  settings = { ...settings, ...patch };
  saveSettings(browserStorage, settings);
  emit();
}

export function getSettings(): Settings {
  hydrateIfNeeded();
  return settings;
}

export function getServerSettings(): Settings {
  return DEFAULT_SETTINGS;
}

export function subscribeSettings(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setMutedPreference(muted: boolean): void {
  update({ muted });
}

export function setReduceAnimationsPreference(reduceAnimations: boolean): void {
  update({ reduceAnimations });
}

/** Recarga la configuración desde el almacenamiento (p. ej. tras restaurar). */
export function refreshSettings(): void {
  const stored = loadSettings(browserStorage);
  settings = stored ?? DEFAULT_SETTINGS;
  hydrated = true;
  emit();
}

export function useAppSettings(): Settings {
  return useSyncExternalStore(subscribeSettings, getSettings, getServerSettings);
}
