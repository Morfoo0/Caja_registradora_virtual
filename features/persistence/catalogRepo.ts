import type { Product } from "@/types";
import { isProductArray } from "./guards";
import { loadJson, saveJson } from "./json";
import { KEYS } from "./schema";
import { browserStorage, type StorageLike } from "./storage";

/** Carga el catálogo persistido, o `null` si no hay datos válidos. */
export function loadCatalog(
  storage: StorageLike = browserStorage,
): Product[] | null {
  const data = loadJson<unknown>(storage, KEYS.catalog);
  return isProductArray(data) ? data : null;
}

/** Guarda el catálogo (incluye sus modificaciones permitidas). */
export function saveCatalog(
  storage: StorageLike = browserStorage,
  products: Product[],
): void {
  saveJson(storage, KEYS.catalog, products);
}
