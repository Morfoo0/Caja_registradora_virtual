import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import type { Product, Sale, Settings, StockMovement } from "@/types";
import {
  BACKUP_FORMAT,
  buildBackup,
  parseBackup,
  salesToCsv,
  serializeBackup,
  validateBackupData,
  type BackupData,
} from "./backup";

const product: Product = {
  id: "p1",
  sku: "LAP-001",
  name: "Lápiz HB",
  priceCents: toCents(8),
  categoryId: "lapices",
  unit: "pieza",
  stock: 50,
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
  payment: { method: "cash", amountPaidCents: toCents(20), changeCents: toCents(4) },
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

function data(overrides: Partial<BackupData> = {}): BackupData {
  return {
    catalog: [product],
    settings,
    sales: [sale],
    movements: [movement],
    ...overrides,
  };
}

describe("construcción y serialización", () => {
  it("incluye formato, versión, fecha y datos", () => {
    const backup = buildBackup(data(), "2026-10-16T20:30:00.000Z");
    expect(backup.format).toBe(BACKUP_FORMAT);
    expect(backup.schemaVersion).toBeGreaterThanOrEqual(1);
    expect(backup.exportedAt).toBe("2026-10-16T20:30:00.000Z");
    expect(backup.data.catalog).toHaveLength(1);
  });

  it("serializa y se puede volver a parsear (roundtrip)", () => {
    const backup = buildBackup(data(), "2026-10-16T20:30:00.000Z");
    const raw = serializeBackup(backup);
    const parsed = parseBackup(raw);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.backup.data.catalog).toEqual([product]);
      expect(parsed.backup.data.sales).toEqual([sale]);
    }
  });
});

describe("parseo de respaldo", () => {
  it("rechaza JSON inválido", () => {
    const result = parseBackup("no es json");
    expect(result.ok).toBe(false);
  });

  it("rechaza formato desconocido", () => {
    const raw = JSON.stringify({ format: "otro", schemaVersion: 1, exportedAt: "2026-01-01", data: {} });
    const result = parseBackup(raw);
    expect(result.ok).toBe(false);
  });

  it("rechaza versión de esquema incompatible", () => {
    const backup = buildBackup(data(), "2026-10-16T20:30:00.000Z");
    const raw = JSON.stringify({ ...backup, schemaVersion: 99 });
    const result = parseBackup(raw);
    expect(result.ok).toBe(false);
  });

  it("rechaza datos con referencias rotas", () => {
    const bad = data({ sales: [{ ...sale, items: [{ ...sale.items[0], productId: "no-existe" }] }] });
    const raw = serializeBackup(buildBackup(bad, "2026-10-16T20:30:00.000Z"));
    const result = parseBackup(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join(" ")).toContain("inexistente");
    }
  });
});

describe("validación cruzada", () => {
  it("acepta datos válidos", () => {
    expect(validateBackupData(data())).toEqual([]);
  });

  it("detecta ids de producto duplicados", () => {
    const dup = data({ catalog: [product, { ...product }] });
    expect(validateBackupData(dup).length).toBeGreaterThan(0);
  });

  it("detecta precio negativo", () => {
    const bad = data({ catalog: [{ ...product, priceCents: -1 as never }] });
    expect(validateBackupData(bad).length).toBeGreaterThan(0);
  });

  it("detecta subtotal inconsistente", () => {
    const bad = data({ sales: [{ ...sale, subtotalCents: toCents(999) }] });
    expect(validateBackupData(bad).length).toBeGreaterThan(0);
  });
});

describe("exportación CSV", () => {
  it("genera cabecera y filas", () => {
    const csv = salesToCsv([sale]);
    const lines = csv.split("\r\n");
    expect(lines[0]).toContain("ticketNumber");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("sale-1");
  });

  it("escapa comas y comillas", () => {
    const tricky: Sale = {
      ...sale,
      items: [{ ...sale.items[0], name: 'Lápiz "HB", rojo' }],
    };
    const csv = salesToCsv([tricky]);
    expect(csv).toContain('"Lápiz ""HB"", rojo"');
  });

  it("genera solo la cabecera con ventas vacías", () => {
    const csv = salesToCsv([]);
    expect(csv.split("\r\n")).toHaveLength(1);
  });
});
