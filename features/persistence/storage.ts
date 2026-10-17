/** Abstracción mínima de almacenamiento clave-valor. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Almacenamiento en memoria para pruebas. */
export class MemoryStorage implements StorageLike {
  private readonly map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

/**
 * Acceso a `localStorage` del navegador, con manejo seguro de errores
 * (cuota llena, modo privado o falta de `window` durante SSR).
 */
export function createBrowserStorage(): StorageLike {
  return {
    getItem(key: string): string | null {
      if (typeof window === "undefined") {
        return null;
      }
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string): void {
      if (typeof window === "undefined") {
        return;
      }
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Fallo de almacenamiento: se ignora de forma segura.
      }
    },
    removeItem(key: string): void {
      if (typeof window === "undefined") {
        return;
      }
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Fallo de almacenamiento: se ignora de forma segura.
      }
    },
  };
}

export const browserStorage: StorageLike = createBrowserStorage();
