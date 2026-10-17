import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import type { Product, Sale } from "@/types";
import {
  MemoryStorage,
  deductForSale,
  loadCatalog,
  loadMovements,
  restockProduct,
  saveCatalog,
} from "./index";

const product: Product = {
  id: "p1",
  sku: "LAP-001",
  name: "Lápiz HB",
  priceCents: toCents(8),
  categoryId: "lapices",
  unit: "pieza",
  stock: 10,
  active: true,
};

const sale: Sale = {
  id: "sale-1",
  ticketNumber: 1,
  items: [
    {
      productId: "p1",
      name: "Lápiz HB",
      unitPriceCents: toCents(8),
      quantity: 3,
      lineTotalCents: toCents(24),
    },
  ],
  subtotalCents: toCents(24),
  totalCents: toCents(24),
  payment: { method: "cash", amountPaidCents: toCents(24), changeCents: toCents(0) },
  createdAt: "2026-10-16T20:30:00.000Z",
};

function seededStorage() {
  const storage = new MemoryStorage();
  saveCatalog(storage, [product]);
  return storage;
}

describe("descuento por venta (persistencia)", () => {
  it("descuenta existencias una sola vez", () => {
    const storage = seededStorage();
    const result = deductForSale(storage, sale);
    expect(result.applied).toBe(true);
    expect(loadCatalog(storage)?.[0].stock).toBe(7);
    expect(loadMovements(storage)).toHaveLength(1);
  });

  it("no descuenta dos veces la misma venta (idempotente)", () => {
    const storage = seededStorage();
    deductForSale(storage, sale);
    const second = deductForSale(storage, sale);
    expect(second.applied).toBe(false);
    expect(second.reason).toBe("already");
    expect(loadCatalog(storage)?.[0].stock).toBe(7);
    expect(loadMovements(storage)).toHaveLength(1);
  });

  it("no descuenta si no hay existencias suficientes", () => {
    const storage = seededStorage();
    const bigSale: Sale = {
      ...sale,
      items: [{ ...sale.items[0], quantity: 100, lineTotalCents: toCents(800) }],
    };
    const result = deductForSale(storage, bigSale);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe("insufficient");
    expect(loadCatalog(storage)?.[0].stock).toBe(10);
    expect(loadMovements(storage)).toHaveLength(0);
  });

  it("no descuenta si el control de inventario está desactivado", () => {
    const storage = seededStorage();
    const result = deductForSale(storage, sale, false);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe("disabled");
    expect(loadMovements(storage)).toHaveLength(0);
  });
});

describe("reposición (persistencia)", () => {
  it("incrementa existencias y registra movimiento", () => {
    const storage = seededStorage();
    const updated = restockProduct(storage, "p1", 5);
    expect(updated?.[0].stock).toBe(15);
    expect(loadCatalog(storage)?.[0].stock).toBe(15);
    expect(loadMovements(storage)).toHaveLength(1);
  });

  it("rechaza cantidades inválidas", () => {
    const storage = seededStorage();
    expect(restockProduct(storage, "p1", -1)).toBeNull();
    expect(restockProduct(storage, "p1", 1.5)).toBeNull();
    expect(loadMovements(storage)).toHaveLength(0);
  });

  it("rechaza producto desconocido", () => {
    const storage = seededStorage();
    expect(restockProduct(storage, "no-existe", 5)).toBeNull();
  });
});

describe("trazabilidad", () => {
  it("el stock final coincide con los movimientos", () => {
    const storage = seededStorage();
    deductForSale(storage, sale);
    restockProduct(storage, "p1", 2);

    const movements = loadMovements(storage);
    const delta = movements.reduce((sum, m) => sum + m.quantity, 0);
    expect(loadCatalog(storage)?.[0].stock).toBe(10 + delta);
  });
});
