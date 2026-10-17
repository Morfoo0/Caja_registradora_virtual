import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import type { Product, SaleItem } from "@/types";
import {
  buildRestock,
  buildSaleDeduction,
  canFulfill,
  currentStockFromMovements,
  isLowStock,
  isStockQuantity,
} from "./inventory";

function product(id: string, stock: number, active = true): Product {
  return {
    id,
    sku: id.toUpperCase(),
    name: `Producto ${id}`,
    priceCents: toCents(10),
    categoryId: "cat",
    unit: "pieza",
    stock,
    active,
  };
}

const items: SaleItem[] = [
  {
    productId: "p1",
    name: "Producto p1",
    unitPriceCents: toCents(10),
    quantity: 2,
    lineTotalCents: toCents(20),
  },
];

let idCounter = 0;
const makeId = () => `m${++idCounter}`;

describe("validación de cantidades", () => {
  it("acepta enteros no negativos", () => {
    expect(isStockQuantity(0)).toBe(true);
    expect(isStockQuantity(10)).toBe(true);
  });

  it("rechaza negativos y no enteros", () => {
    expect(isStockQuantity(-1)).toBe(false);
    expect(isStockQuantity(1.5)).toBe(false);
  });
});

describe("existencias bajas", () => {
  it("detecta stock bajo entre 1 y el umbral", () => {
    expect(isLowStock(product("a", 3))).toBe(true);
    expect(isLowStock(product("b", 6))).toBe(false);
    expect(isLowStock(product("c", 0))).toBe(false);
    expect(isLowStock(product("d", 3, false))).toBe(false);
  });
});

describe("cumplimiento de venta", () => {
  it("permite vender si hay existencias suficientes", () => {
    expect(canFulfill([product("p1", 5)], items)).toBe(true);
  });

  it("impide vender más de las existencias", () => {
    expect(canFulfill([product("p1", 1)], items)).toBe(false);
  });

  it("impide vender productos inactivos o desconocidos", () => {
    expect(canFulfill([product("p1", 5, false)], items)).toBe(false);
    expect(canFulfill([], items)).toBe(false);
  });
});

describe("descuento por venta", () => {
  it("descuenta las existencias exactamente", () => {
    const result = buildSaleDeduction(
      [product("p1", 5)],
      items,
      "sale-1",
      "2026-01-01T00:00:00.000Z",
      makeId,
    );
    expect(result.products[0].stock).toBe(3);
    expect(result.movements).toHaveLength(1);
    expect(result.movements[0]).toMatchObject({
      productId: "p1",
      quantity: -2,
      type: "sale",
      saleId: "sale-1",
    });
  });

  it("genera un movimiento por línea", () => {
    const multi: SaleItem[] = [
      items[0],
      { ...items[0], productId: "p2", quantity: 1, lineTotalCents: toCents(10) },
    ];
    const result = buildSaleDeduction(
      [product("p1", 5), product("p2", 5)],
      multi,
      "sale-1",
      "2026-01-01T00:00:00.000Z",
      makeId,
    );
    expect(result.movements).toHaveLength(2);
  });
});

describe("reposición", () => {
  it("incrementa las existencias y registra el movimiento", () => {
    const result = buildRestock(
      [product("p1", 3)],
      "p1",
      10,
      "Reposición",
      "2026-01-01T00:00:00.000Z",
      makeId,
    );
    expect(result.products[0].stock).toBe(13);
    expect(result.movements[0]).toMatchObject({
      productId: "p1",
      quantity: 10,
      type: "restock",
    });
  });
});

describe("reconciliación", () => {
  it("el stock coincide con los movimientos registrados", () => {
    const sale = buildSaleDeduction(
      [product("p1", 20)],
      [{ ...items[0], quantity: 5, lineTotalCents: toCents(50) }],
      "sale-1",
      "2026-01-01T00:00:00.000Z",
      makeId,
    );
    const restock = buildRestock(
      sale.products,
      "p1",
      7,
      "Reposición",
      "2026-01-02T00:00:00.000Z",
      makeId,
    );

    const allMovements = [...sale.movements, ...restock.movements];
    expect(restock.products[0].stock).toBe(22);
    expect(currentStockFromMovements(20, allMovements)).toBe(22);
  });
});
