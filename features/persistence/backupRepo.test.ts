import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import { parseBackup, serializeBackup, buildBackup } from "@/features/backup";
import type { Product, Sale, Settings, StockMovement } from "@/types";
import {
  MemoryStorage,
  applyBackup,
  gatherBackup,
  loadCatalog,
  loadMovements,
  loadSales,
  loadSettings,
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
      quantity: 2,
      lineTotalCents: toCents(16),
    },
  ],
  subtotalCents: toCents(16),
  totalCents: toCents(16),
  payment: { method: "cash", amountPaidCents: toCents(16), changeCents: toCents(0) },
  createdAt: "2026-10-16T20:30:00.000Z",
};

const movement: StockMovement = {
  id: "m1",
  productId: "p1",
  quantity: -2,
  type: "sale",
  reason: "Venta sale-1",
  saleId: "sale-1",
  createdAt: "2026-10-16T20:30:00.000Z",
};

const settings: Settings = { storeName: "Mi Papelería", currency: "MXN", taxRate: 0 };

describe("reunir y aplicar respaldo", () => {
  it("reúne catálogo, configuración, ventas e inventario", () => {
    const storage = new MemoryStorage();
    applyBackup(storage, buildBackup({ catalog: [product], settings, sales: [sale], movements: [movement] }));

    const gathered = gatherBackup(storage);
    expect(gathered.data.catalog).toEqual([product]);
    expect(gathered.data.sales).toEqual([sale]);
    expect(gathered.data.movements).toEqual([movement]);
    expect(gathered.data.settings.storeName).toBe("Mi Papelería");
  });

  it("sobrescribe los datos existentes", () => {
    const storage = new MemoryStorage();
    applyBackup(storage, buildBackup({ catalog: [product], settings, sales: [], movements: [] }));
    applyBackup(storage, buildBackup({ catalog: [], settings, sales: [sale], movements: [movement] }));

    expect(loadCatalog(storage)).toEqual([]);
    expect(loadSales(storage)).toEqual([sale]);
    expect(loadMovements(storage)).toEqual([movement]);
  });

  it("un respaldo inválido no corrompe los datos existentes", () => {
    const storage = new MemoryStorage();
    applyBackup(storage, buildBackup({ catalog: [product], settings, sales: [], movements: [] }));

    const invalid = parseBackup("no es json");
    expect(invalid.ok).toBe(false);

    // No se aplica nada; los datos siguen intactos.
    expect(loadCatalog(storage)).toEqual([product]);
    expect(loadSales(storage)).toEqual([]);
  });
});

describe("roundtrip completo", () => {
  it("exporta e importa sin pérdida", () => {
    const source = new MemoryStorage();
    applyBackup(source, buildBackup({ catalog: [product], settings, sales: [sale], movements: [movement] }));

    const exported = serializeBackup(gatherBackup(source));

    const parsed = parseBackup(exported);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const target = new MemoryStorage();
    applyBackup(target, parsed.backup);

    expect(loadCatalog(target)).toEqual(loadCatalog(source));
    expect(loadSales(target)).toEqual(loadSales(source));
    expect(loadMovements(target)).toEqual(loadMovements(source));
    expect(loadSettings(target)).toEqual(loadSettings(source));
  });
});
