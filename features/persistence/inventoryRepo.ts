import { generateId } from "@/lib/ids";
import {
  buildRestock,
  buildSaleDeduction,
  canFulfill,
  isStockQuantity,
} from "@/features/inventory";
import type { Product, Sale, StockMovement } from "@/types";
import { loadCatalog, saveCatalog } from "./catalogRepo";
import { isStockMovementArray } from "./guards";
import { loadJson, saveJson } from "./json";
import { KEYS } from "./schema";
import { browserStorage, type StorageLike } from "./storage";

/** Carga el historial de movimientos de inventario (vacío si no hay datos válidos). */
export function loadMovements(
  storage: StorageLike = browserStorage,
): StockMovement[] {
  const data = loadJson<unknown>(storage, KEYS.movements);
  return isStockMovementArray(data) ? data : [];
}

/** Guarda el historial de movimientos (append-only). */
export function saveMovements(
  storage: StorageLike = browserStorage,
  movements: StockMovement[],
): void {
  saveJson(storage, KEYS.movements, movements);
}

export type DeductReason =
  | "already"
  | "no-catalog"
  | "insufficient"
  | "disabled";

export interface DeductResult {
  applied: boolean;
  reason?: DeductReason;
  /** Nuevo catálogo si se aplicó el descuento; `null` en otro caso. */
  products: Product[] | null;
}

/**
 * Descuenta las existencias de una venta confirmada, una sola vez y de forma
 * trazable (registra un movimiento por línea). Es idempotente por `sale.id`.
 */
export function deductForSale(
  storage: StorageLike = browserStorage,
  sale: Sale,
  inventoryControl = true,
): DeductResult {
  if (!inventoryControl) {
    return { applied: false, reason: "disabled", products: null };
  }

  const movements = loadMovements(storage);
  if (movements.some((movement) => movement.saleId === sale.id)) {
    return { applied: false, reason: "already", products: null };
  }

  const products = loadCatalog(storage);
  if (!products) {
    return { applied: false, reason: "no-catalog", products: null };
  }

  if (!canFulfill(products, sale.items)) {
    return { applied: false, reason: "insufficient", products: null };
  }

  const result = buildSaleDeduction(
    products,
    sale.items,
    sale.id,
    sale.createdAt,
    generateId,
  );

  saveCatalog(storage, result.products);
  saveMovements(storage, [...movements, ...result.movements]);

  return { applied: true, products: result.products };
}

/**
 * Acción administrativa de reposición: incrementa las existencias de un
 * producto y registra un movimiento trazable. Devuelve el catálogo actualizado.
 */
export function restockProduct(
  storage: StorageLike = browserStorage,
  productId: string,
  quantity: number,
  reason = "Reposición",
): Product[] | null {
  if (!isStockQuantity(quantity) || quantity === 0) {
    return null;
  }

  const products = loadCatalog(storage);
  if (!products) {
    return null;
  }
  if (!products.some((product) => product.id === productId)) {
    return null;
  }

  const movements = loadMovements(storage);
  const result = buildRestock(
    products,
    productId,
    quantity,
    reason,
    new Date().toISOString(),
    generateId,
  );

  saveCatalog(storage, result.products);
  saveMovements(storage, [...movements, ...result.movements]);

  return result.products;
}
