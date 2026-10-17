import { lineTotalCents, subtotalCents } from "@/lib/money";
import type { CartItem, Cents, Product } from "@/types";

/** Cantidad máxima por línea para evitar valores absurdos. */
export const MAX_ITEM_QUANTITY = 999;

/** Un producto se puede añadir si está activo y tiene existencias. */
export function isAddable(product: Product): boolean {
  return product.active && product.stock > 0;
}

function normalizedQuantity(quantity: number): number {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return 0;
  }
  return Math.min(quantity, MAX_ITEM_QUANTITY);
}

/**
 * Añade un producto al carrito. Si ya existe, acumula la cantidad en la misma
 * línea (nunca duplica). La cantidad queda limitada a las existencias.
 */
export function addItem(
  items: readonly CartItem[],
  product: Product,
  quantity = 1,
): CartItem[] {
  if (!isAddable(product)) {
    return [...items];
  }
  const qty = normalizedQuantity(quantity);
  if (qty === 0) {
    return [...items];
  }
  const maxQty = Math.min(product.stock, MAX_ITEM_QUANTITY);
  const existing = items.find((item) => item.productId === product.id);

  if (existing) {
    const next = Math.min(existing.quantity + qty, maxQty);
    return items.map((item) =>
      item.productId === product.id ? { ...item, quantity: next } : item,
    );
  }

  return [
    ...items,
    {
      productId: product.id,
      name: product.name,
      unitPriceCents: product.priceCents,
      quantity: Math.min(qty, maxQty),
    },
  ];
}

/** Fija la cantidad de una línea. Cantidad 0 la elimina; negativa se ignora. */
export function setQuantity(
  items: readonly CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  if (!Number.isInteger(quantity) || quantity < 0) {
    return [...items];
  }
  if (quantity === 0) {
    return removeItem(items, productId);
  }
  const qty = Math.min(quantity, MAX_ITEM_QUANTITY);
  return items.map((item) =>
    item.productId === productId ? { ...item, quantity: qty } : item,
  );
}

/** Incrementa la cantidad de una línea. */
export function incrementItem(
  items: readonly CartItem[],
  productId: string,
  by = 1,
): CartItem[] {
  return items.map((item) =>
    item.productId === productId
      ? { ...item, quantity: Math.min(item.quantity + by, MAX_ITEM_QUANTITY) }
      : item,
  );
}

/** Disminuye la cantidad de una línea; si llega a cero, la elimina. */
export function decrementItem(
  items: readonly CartItem[],
  productId: string,
  by = 1,
): CartItem[] {
  return items
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity - by }
        : item,
    )
    .filter((item) => item.quantity > 0);
}

/** Elimina una línea del carrito. */
export function removeItem(
  items: readonly CartItem[],
  productId: string,
): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

/** Vacía el carrito. */
export function clearCart(): CartItem[] {
  return [];
}

/** Total de una línea, en centavos. */
export function cartLineTotal(item: CartItem): Cents {
  return lineTotalCents(item.unitPriceCents, item.quantity);
}

/** Subtotal del carrito (suma de líneas), en centavos. */
export function cartSubtotal(items: readonly CartItem[]): Cents {
  return subtotalCents(items);
}

/** Total del carrito. Igual al subtotal hasta que se añadan impuestos. */
export function cartTotal(items: readonly CartItem[]): Cents {
  return subtotalCents(items);
}

/** Cantidad total de unidades en el carrito. */
export function itemCount(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
