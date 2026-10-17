import type { Sale } from "@/types";
import { isSaleArray } from "./guards";
import { loadJson, saveJson } from "./json";
import { KEYS } from "./schema";
import { browserStorage, type StorageLike } from "./storage";

/** Carga las ventas finalizadas (vacío si no hay datos válidos). */
export function loadSales(storage: StorageLike = browserStorage): Sale[] {
  const data = loadJson<unknown>(storage, KEYS.sales);
  return isSaleArray(data) ? data : [];
}

/** Guarda la lista completa de ventas. */
export function saveSales(
  storage: StorageLike = browserStorage,
  sales: Sale[],
): void {
  saveJson(storage, KEYS.sales, sales);
}

/**
 * Añade una venta al historial de forma idempotente (no duplica por id) y
 * devuelve la lista actualizada.
 */
export function addSale(
  storage: StorageLike = browserStorage,
  sale: Sale,
): Sale[] {
  const sales = loadSales(storage);
  if (sales.some((existing) => existing.id === sale.id)) {
    return sales;
  }
  const next = [...sales, sale];
  saveSales(storage, next);
  return next;
}
