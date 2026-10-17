import { useCallback, useMemo, useState } from "react";
import {
  addItem,
  cartSubtotal,
  cartTotal,
  clearCart,
  decrementItem,
  incrementItem,
  itemCount,
  removeItem,
  setQuantity,
} from "@/features/cart";
import type { CartItem, Cents, Product } from "@/types";

export interface CartState {
  items: CartItem[];
  subtotalCents: Cents;
  totalCents: Cents;
  count: number;
  add: (product: Product) => void;
  setQty: (productId: string, quantity: number) => void;
  inc: (productId: string) => void;
  dec: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

/** Única fuente de verdad de los artículos de la venta en curso. */
export function useCart(): CartState {
  const [items, setItems] = useState<CartItem[]>([]);

  const subtotalCents = useMemo(() => cartSubtotal(items), [items]);
  const totalCents = useMemo(() => cartTotal(items), [items]);
  const count = useMemo(() => itemCount(items), [items]);

  const add = useCallback(
    (product: Product) => setItems((prev) => addItem(prev, product)),
    [],
  );
  const setQty = useCallback(
    (productId: string, quantity: number) =>
      setItems((prev) => setQuantity(prev, productId, quantity)),
    [],
  );
  const inc = useCallback(
    (productId: string) => setItems((prev) => incrementItem(prev, productId)),
    [],
  );
  const dec = useCallback(
    (productId: string) => setItems((prev) => decrementItem(prev, productId)),
    [],
  );
  const remove = useCallback(
    (productId: string) => setItems((prev) => removeItem(prev, productId)),
    [],
  );
  const clear = useCallback(() => setItems(clearCart()), []);

  return {
    items,
    subtotalCents,
    totalCents,
    count,
    add,
    setQty,
    inc,
    dec,
    remove,
    clear,
  };
}
