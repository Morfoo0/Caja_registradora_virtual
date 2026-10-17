import {
  SCHEMA_VERSION,
  isProductArray,
  isSaleArray,
  isSettings,
  isStockMovementArray,
} from "@/features/persistence";
import type { Cents, Product, Sale, Settings, StockMovement } from "@/types";

export const BACKUP_FORMAT = "barbie-cashier-backup";

export interface BackupData {
  catalog: Product[];
  settings: Settings;
  sales: Sale[];
  movements: StockMovement[];
}

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  data: BackupData;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidDate(value: string): boolean {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

/** Construye un respaldo versionado a partir de los datos de la app. */
export function buildBackup(
  data: BackupData,
  exportedAt = new Date().toISOString(),
): BackupFile {
  return {
    format: BACKUP_FORMAT,
    schemaVersion: SCHEMA_VERSION,
    exportedAt,
    data,
  };
}

/** Serializa el respaldo como JSON legible. */
export function serializeBackup(backup: BackupFile): string {
  return JSON.stringify(backup, null, 2);
}

export type ParseBackupResult =
  | { ok: true; backup: BackupFile }
  | { ok: false; errors: string[] };

/**
 * Parsea y valida un respaldo. Rechaza archivos inválidos sin tocar el
 * almacenamiento actual (la escritura ocurre aparte, tras confirmación).
 */
export function parseBackup(raw: string): ParseBackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, errors: ["El archivo no contiene JSON válido."] };
  }

  if (!isRecord(parsed)) {
    return {
      ok: false,
      errors: ["El archivo no tiene la estructura esperada."],
    };
  }

  if (parsed.format !== BACKUP_FORMAT) {
    return { ok: false, errors: ["Formato de respaldo no reconocido."] };
  }
  if (
    typeof parsed.schemaVersion !== "number" ||
    parsed.schemaVersion !== SCHEMA_VERSION
  ) {
    return { ok: false, errors: ["Versión de esquema incompatible."] };
  }
  if (!isValidDate(String(parsed.exportedAt))) {
    return { ok: false, errors: ["Falta una fecha de exportación válida."] };
  }

  if (!isRecord(parsed.data)) {
    return { ok: false, errors: ["Faltan los datos del respaldo."] };
  }

  const catalog = parsed.data.catalog;
  const settings = parsed.data.settings;
  const sales = parsed.data.sales;
  const movements = parsed.data.movements;

  if (!isProductArray(catalog)) {
    return { ok: false, errors: ["El catálogo del respaldo no es válido."] };
  }
  if (!isSettings(settings)) {
    return {
      ok: false,
      errors: ["La configuración del respaldo no es válida."],
    };
  }
  if (!isSaleArray(sales)) {
    return { ok: false, errors: ["Las ventas del respaldo no son válidas."] };
  }
  if (!isStockMovementArray(movements)) {
    return {
      ok: false,
      errors: ["Los movimientos del respaldo no son válidos."],
    };
  }

  const backup: BackupFile = {
    format: BACKUP_FORMAT,
    schemaVersion: parsed.schemaVersion,
    exportedAt: String(parsed.exportedAt),
    data: { catalog, settings, sales, movements },
  };

  const errors = validateBackupData(backup.data);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, backup };
}

/**
 * Validación cruzada: identificadores únicos, precios, fechas y relaciones
 * entre productos, ventas y movimientos.
 */
export function validateBackupData(data: BackupData): string[] {
  const errors: string[] = [];

  const productIds = new Set<string>();
  const skus = new Set<string>();
  for (const product of data.catalog) {
    if (productIds.has(product.id)) {
      errors.push(`Producto con id duplicado: ${product.id}`);
    }
    productIds.add(product.id);
    if (skus.has(product.sku)) {
      errors.push(`Producto con SKU duplicado: ${product.sku}`);
    }
    skus.add(product.sku);
    if (!Number.isInteger(product.priceCents) || product.priceCents < 0) {
      errors.push(`Precio inválido en el producto ${product.id}`);
    }
    if (!Number.isInteger(product.stock) || product.stock < 0) {
      errors.push(`Existencias inválidas en el producto ${product.id}`);
    }
  }

  const saleIds = new Set<string>();
  for (const sale of data.sales) {
    if (saleIds.has(sale.id)) {
      errors.push(`Venta con id duplicado: ${sale.id}`);
    }
    saleIds.add(sale.id);
    if (!isValidDate(sale.createdAt)) {
      errors.push(`Fecha inválida en la venta ${sale.id}`);
    }

    let lineSum = 0 as Cents;
    for (const item of sale.items) {
      if (!productIds.has(item.productId)) {
        errors.push(
          `La venta ${sale.id} referencia un producto inexistente: ${item.productId}`,
        );
      }
      if (!Number.isInteger(item.unitPriceCents) || item.unitPriceCents < 0) {
        errors.push(`Precio unitario inválido en la venta ${sale.id}`);
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        errors.push(`Cantidad inválida en la venta ${sale.id}`);
      }
      lineSum = (lineSum + item.lineTotalCents) as Cents;
    }
    if (sale.subtotalCents !== lineSum) {
      errors.push(`Subtotal inconsistente en la venta ${sale.id}`);
    }
  }

  const movementIds = new Set<string>();
  for (const movement of data.movements) {
    if (movementIds.has(movement.id)) {
      errors.push(`Movimiento con id duplicado: ${movement.id}`);
    }
    movementIds.add(movement.id);
    if (!productIds.has(movement.productId)) {
      errors.push(
        `El movimiento ${movement.id} referencia un producto inexistente: ${movement.productId}`,
      );
    }
    if (!Number.isInteger(movement.quantity)) {
      errors.push(`Cantidad inválida en el movimiento ${movement.id}`);
    }
    if (!isValidDate(movement.createdAt)) {
      errors.push(`Fecha inválida en el movimiento ${movement.id}`);
    }
  }

  return errors;
}

function escapeCsv(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Exporta las ventas a CSV (una fila por línea vendida). */
export function salesToCsv(sales: readonly Sale[]): string {
  const header = [
    "ticketNumber",
    "saleId",
    "createdAt",
    "paymentMethod",
    "productId",
    "productName",
    "quantity",
    "unitPriceCents",
    "lineTotalCents",
    "saleTotalCents",
  ];

  const rows = sales.flatMap((sale) =>
    sale.items.map((item) => [
      String(sale.ticketNumber),
      sale.id,
      sale.createdAt,
      sale.payment.method,
      item.productId,
      item.name,
      String(item.quantity),
      String(item.unitPriceCents),
      String(item.lineTotalCents),
      String(sale.totalCents),
    ]),
  );

  return [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");
}
