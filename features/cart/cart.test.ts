import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import type { CartItem, Product } from "@/types";
import {
  addItem,
  cartLineTotal,
  cartSubtotal,
  cartTotal,
  clearCart,
  decrementItem,
  incrementItem,
  itemCount,
  removeItem,
  setQuantity,
} from "./cart";

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    sku: "SKU-1",
    name: "Lápiz HB",
    priceCents: toCents(8),
    categoryId: "lapices",
    unit: "pieza",
    stock: 50,
    active: true,
    ...overrides,
  };
}

describe("añadir al carrito", () => {
  it("añade un producto como una sola línea", () => {
    const items = addItem([], product());
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ productId: "p1", quantity: 1 });
  });

  it("acumula la cantidad al añadir dos veces el mismo producto", () => {
    const once = addItem([], product());
    const twice = addItem(once, product());
    expect(twice).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
  });

  it("mantiene líneas separadas para productos distintos", () => {
    const items = addItem([], product());
    const all = addItem(items, product({ id: "p2", name: "Cuaderno" }));
    expect(all).toHaveLength(2);
  });

  it("no añade productos no disponibles (sin stock)", () => {
    const items = addItem([], product({ stock: 0 }));
    expect(items).toHaveLength(0);
  });

  it("no añade productos inactivos", () => {
    const items = addItem([], product({ active: false }));
    expect(items).toHaveLength(0);
  });

  it("limita la cantidad a las existencias disponibles", () => {
    const items = addItem([], product({ stock: 3 }), 10);
    expect(items[0].quantity).toBe(3);
  });

  it("ignora cantidad inválida (0 o no entera)", () => {
    expect(addItem([], product(), 0)).toHaveLength(0);
    expect(addItem([], product(), 1.5)).toHaveLength(0);
  });
});

describe("cantidades", () => {
  it("fija la cantidad de una línea", () => {
    const items = addItem([], product());
    const updated = setQuantity(items, "p1", 4);
    expect(updated[0].quantity).toBe(4);
  });

  it("elimina la línea al fijar cantidad 0", () => {
    const items = addItem([], product());
    const updated = setQuantity(items, "p1", 0);
    expect(updated).toHaveLength(0);
  });

  it("ignora cantidad negativa o no entera", () => {
    const items = addItem([], product());
    expect(setQuantity(items, "p1", -1)[0].quantity).toBe(1);
    expect(setQuantity(items, "p1", 2.5)[0].quantity).toBe(1);
  });

  it("incrementa y decrementa la cantidad", () => {
    const items = addItem([], product());
    const incremented = incrementItem(items, "p1");
    expect(incremented[0].quantity).toBe(2);
    const decremented = decrementItem(incremented, "p1");
    expect(decremented[0].quantity).toBe(1);
  });

  it("decrementar hasta cero elimina la línea", () => {
    const items = addItem([], product());
    const result = decrementItem(items, "p1");
    expect(result).toHaveLength(0);
  });
});

describe("eliminar y vaciar", () => {
  it("elimina un artículo concreto", () => {
    const items = addItem([], product());
    const all = addItem(items, product({ id: "p2", name: "Cuaderno" }));
    expect(removeItem(all, "p1").map((i) => i.productId)).toEqual(["p2"]);
  });

  it("vacía el carrito con una acción explícita", () => {
    const items = addItem(addItem([], product()), product({ id: "p2" }));
    expect(clearCart()).toHaveLength(0);
    expect(items).toHaveLength(2);
  });
});

describe("totales", () => {
  it("calcula subtotal y total de forma consistente", () => {
    const items: CartItem[] = addItem([], product({ id: "p2", priceCents: toCents(42.5), name: "Cuaderno" }), 2);
    const withLapiz = addItem(items, product());

    // 2 cuadernos (42.50) + 1 lápiz (8.00) = 93.00
    expect(cartSubtotal(withLapiz)).toBe(toCents(93));
    expect(cartTotal(withLapiz)).toBe(toCents(93));
  });

  it("calcula el total de línea", () => {
    const items = addItem([], product(), 3);
    expect(cartLineTotal(items[0])).toBe(toCents(24));
  });

  it("cuenta las unidades totales", () => {
    const items = addItem(addItem([], product(), 2), product({ id: "p2", name: "Cuaderno" }), 3);
    expect(itemCount(items)).toBe(5);
  });

  it("el carrito vacío totaliza cero", () => {
    expect(cartTotal([])).toBe(toCents(0));
    expect(cartSubtotal([])).toBe(toCents(0));
    expect(itemCount([])).toBe(0);
  });
});

describe("inmutabilidad", () => {
  it("no muta el arreglo original al añadir", () => {
    const original: CartItem[] = [];
    const result = addItem(original, product());
    expect(original).toHaveLength(0);
    expect(result).not.toBe(original);
  });

  it("no muta las líneas originales al modificar", () => {
    const items = addItem([], product());
    const updated = setQuantity(items, "p1", 5);
    expect(items[0].quantity).toBe(1);
    expect(updated[0].quantity).toBe(5);
    expect(updated[0]).not.toBe(items[0]);
  });
});
