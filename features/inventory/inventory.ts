import type { Product, SaleItem, StockMovement } from "@/types";

/** Umbral para considerar un producto con "existencias bajas". */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Reglas de inventario del proyecto:
 * - Las ventas canceladas antes de confirmar NO descuentan existencias.
 * - El descuento ocurre una sola vez, al confirmarse la venta.
 * - Las ventas históricas son inmutables: para reponer stock se usa la acción
 *   administrativa de reposición (movimiento "restock"), sin reescribir la venta.
 */

/** Una cantidad de stock es válida si es un entero no negativo. */
export function isStockQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 0;
}

/** Producto activo con existencias bajas (mayores que cero y bajo el umbral). */
export function isLowStock(product: Product, threshold = LOW_STOCK_THRESHOLD): boolean {
  return product.active && product.stock > 0 && product.stock <= threshold;
}

export interface FulfillableItem {
  productId: string;
  quantity: number;
}

/** Verifica que todos los artículos puedan servirse con las existencias actuales. */
export function canFulfill(
  products: readonly Product[],
  items: readonly FulfillableItem[],
): boolean {
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.active) {
      return false;
    }
    if (product.stock < item.quantity) {
      return false;
    }
  }
  return true;
}

export interface StockChangeResult {
  products: Product[];
  movements: StockMovement[];
}

/** Calcula el descuento de existencias de una venta (un movimiento por línea). */
export function buildSaleDeduction(
  products: readonly Product[],
  items: readonly SaleItem[],
  saleId: string,
  createdAt: string,
  makeId: () => string,
): StockChangeResult {
  const movements: StockMovement[] = [];
  const nextProducts = products.map((product) => {
    const line = items.find((item) => item.productId === product.id);
    if (!line) {
      return product;
    }
    movements.push({
      id: makeId(),
      productId: product.id,
      quantity: -line.quantity,
      type: "sale",
      reason: `Venta ${saleId}`,
      saleId,
      createdAt,
    });
    return { ...product, stock: product.stock - line.quantity };
  });
  return { products: nextProducts, movements };
}

/** Calcula la reposición de existencias de un producto (acción administrativa). */
export function buildRestock(
  products: readonly Product[],
  productId: string,
  quantity: number,
  reason: string,
  createdAt: string,
  makeId: () => string,
): StockChangeResult {
  const movements: StockMovement[] = [];
  const nextProducts = products.map((product) => {
    if (product.id !== productId) {
      return product;
    }
    movements.push({
      id: makeId(),
      productId,
      quantity,
      type: "restock",
      reason,
      createdAt,
    });
    return { ...product, stock: product.stock + quantity };
  });
  return { products: nextProducts, movements };
}

/** Reconstruye el stock actual a partir del stock inicial y los movimientos. */
export function currentStockFromMovements(
  initialStock: number,
  movements: readonly StockMovement[],
): number {
  return movements.reduce((sum, movement) => sum + movement.quantity, initialStock);
}
