import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import type { Product, Sale, Settings } from "@/types";
import {
  DEFAULT_SETTINGS,
  KEYS,
  MemoryStorage,
  SCHEMA_VERSION,
  addSale,
  loadCatalog,
  loadJson,
  loadSales,
  loadSettings,
  migrateData,
  saveCatalog,
  saveSettings,
} from "./index";

const sampleProduct: Product = {
  id: "p1",
  sku: "LAP-001",
  name: "Lápiz HB",
  priceCents: toCents(8),
  categoryId: "lapices",
  unit: "pieza",
  stock: 50,
  active: true,
};

const sampleSale: Sale = {
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
  payment: {
    method: "cash",
    amountPaidCents: toCents(20),
    changeCents: toCents(4),
  },
  createdAt: "2026-10-16T20:30:00.000Z",
};

const sampleSettings: Settings = {
  storeName: "Mi Papelería",
  currency: "MXN",
  taxRate: 0,
};

describe("catálogo", () => {
  it("guarda y recupera el catálogo (reabrir)", () => {
    const storage = new MemoryStorage();
    saveCatalog(storage, [sampleProduct]);
    const reloaded = loadCatalog(storage);
    expect(reloaded).toEqual([sampleProduct]);
  });

  it("devuelve null si no hay datos", () => {
    expect(loadCatalog(new MemoryStorage())).toBeNull();
  });

  it("devuelve null con datos corruptos", () => {
    const storage = new MemoryStorage();
    storage.setItem(KEYS.catalog, "esto no es json");
    expect(loadCatalog(storage)).toBeNull();
  });

  it("devuelve null con forma inválida", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      KEYS.catalog,
      JSON.stringify({ version: SCHEMA_VERSION, data: [{ id: "x" }] }),
    );
    expect(loadCatalog(storage)).toBeNull();
  });

  it("no sobrescribe datos válidos guardados", () => {
    const storage = new MemoryStorage();
    saveCatalog(storage, [sampleProduct]);
    expect(loadCatalog(storage)).not.toBeNull();
    expect(loadCatalog(storage)).toEqual([sampleProduct]);
  });
});

describe("ventas", () => {
  it("añade y recupera ventas (reabrir)", () => {
    const storage = new MemoryStorage();
    addSale(storage, sampleSale);
    expect(loadSales(storage)).toEqual([sampleSale]);
  });

  it("empieza vacío", () => {
    expect(loadSales(new MemoryStorage())).toEqual([]);
  });

  it("es idempotente: no duplica una venta con el mismo id", () => {
    const storage = new MemoryStorage();
    addSale(storage, sampleSale);
    addSale(storage, sampleSale);
    expect(loadSales(storage)).toHaveLength(1);
  });

  it("devuelve vacío con datos corruptos", () => {
    const storage = new MemoryStorage();
    storage.setItem(KEYS.sales, "{oops");
    expect(loadSales(storage)).toEqual([]);
  });

  it("acumula varias ventas", () => {
    const storage = new MemoryStorage();
    addSale(storage, sampleSale);
    addSale(storage, { ...sampleSale, id: "sale-2", ticketNumber: 2 });
    expect(loadSales(storage)).toHaveLength(2);
  });
});

describe("preferencias", () => {
  it("guarda y recupera preferencias", () => {
    const storage = new MemoryStorage();
    saveSettings(storage, sampleSettings);
    expect(loadSettings(storage)).toEqual(sampleSettings);
  });

  it("devuelve null si no hay datos", () => {
    expect(loadSettings(new MemoryStorage())).toBeNull();
  });

  it("tiene valores por defecto", () => {
    expect(DEFAULT_SETTINGS.storeName).toBe("Barbie Cashier");
    expect(DEFAULT_SETTINGS.currency).toBe("MXN");
  });

  it("devuelve null con datos corruptos", () => {
    const storage = new MemoryStorage();
    storage.setItem(KEYS.settings, "no json");
    expect(loadSettings(storage)).toBeNull();
  });
});

describe("versión del esquema y migración", () => {
  it("rechaza datos de una versión incompatible", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      KEYS.catalog,
      JSON.stringify({ version: 99, data: [sampleProduct] }),
    );
    expect(loadCatalog(storage)).toBeNull();
  });

  it("rechaza sobres sin versión", () => {
    const storage = new MemoryStorage();
    storage.setItem(KEYS.settings, JSON.stringify({ data: sampleSettings }));
    expect(loadSettings(storage)).toBeNull();
  });

  it("migrateData devuelve los datos para la versión actual", () => {
    expect(migrateData(SCHEMA_VERSION, { a: 1 })).toEqual({ a: 1 });
  });

  it("migrateData devuelve null sin camino de migración", () => {
    expect(migrateData(0, { a: 1 })).toBeNull();
  });

  it("loadJson devuelve null con JSON corrupto", () => {
    const storage = new MemoryStorage();
    storage.setItem("k", "{invalid");
    expect(loadJson(storage, "k")).toBeNull();
  });
});

describe("seguridad de escritura", () => {
  it("un fallo de escritura no lanza excepción", () => {
    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {},
    };
    expect(() => saveCatalog(failing, [sampleProduct])).not.toThrow();
  });
});
