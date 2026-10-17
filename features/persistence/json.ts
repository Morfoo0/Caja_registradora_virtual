import { SCHEMA_VERSION } from "./schema";
import type { StorageLike } from "./storage";

type Migration = (data: unknown) => unknown;

/**
 * Migraciones por versión. La clave es la versión de origen.
 * Al pasar de la versión 1 a la 2, se añade `1: (data) => ({ ...data, ... })`.
 */
const migrations: Record<number, Migration> = {};

/**
 * Migra `data` desde `version` hasta la versión actual. Devuelve `null` si no
 * existe un camino de migración (datos incompatibles).
 */
export function migrateData(version: number, data: unknown): unknown {
  if (version > SCHEMA_VERSION) {
    return null;
  }
  let current = data;
  for (let v = version; v < SCHEMA_VERSION; v += 1) {
    const migration = migrations[v];
    if (!migration) {
      return null;
    }
    current = migration(current);
  }
  return current;
}

export function saveJson<T>(
  storage: StorageLike,
  key: string,
  data: T,
): void {
  try {
    storage.setItem(key, JSON.stringify({ version: SCHEMA_VERSION, data }));
  } catch {
    // Fallo de almacenamiento: se ignora de forma segura.
  }
}

export function loadJson<T>(storage: StorageLike, key: string): T | null {
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return null;
  }
  if (raw == null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const envelope = parsed as { version?: unknown; data?: unknown };
  const version = typeof envelope.version === "number" ? envelope.version : 0;
  const data = envelope.data;

  if (version === SCHEMA_VERSION) {
    return data as T;
  }

  return migrateData(version, data) as T | null;
}
