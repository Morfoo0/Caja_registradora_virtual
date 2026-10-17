import type {
  Payment,
  Product,
  Sale,
  SaleItem,
  Settings,
  StockMovement,
} from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.sku === "string" &&
    typeof value.name === "string" &&
    typeof value.priceCents === "number" &&
    Number.isInteger(value.priceCents) &&
    typeof value.categoryId === "string" &&
    typeof value.unit === "string" &&
    typeof value.stock === "number" &&
    Number.isInteger(value.stock) &&
    typeof value.active === "boolean"
  );
}

export function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

function isPayment(value: unknown): value is Payment {
  return (
    isRecord(value) &&
    (value.method === "cash" || value.method === "card") &&
    typeof value.amountPaidCents === "number" &&
    Number.isInteger(value.amountPaidCents) &&
    typeof value.changeCents === "number" &&
    Number.isInteger(value.changeCents)
  );
}

function isSaleItem(value: unknown): value is SaleItem {
  return (
    isRecord(value) &&
    typeof value.productId === "string" &&
    typeof value.name === "string" &&
    typeof value.unitPriceCents === "number" &&
    Number.isInteger(value.unitPriceCents) &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    typeof value.lineTotalCents === "number" &&
    Number.isInteger(value.lineTotalCents)
  );
}

export function isSale(value: unknown): value is Sale {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.ticketNumber === "number" &&
    Array.isArray(value.items) &&
    value.items.every(isSaleItem) &&
    typeof value.subtotalCents === "number" &&
    typeof value.totalCents === "number" &&
    isPayment(value.payment) &&
    typeof value.createdAt === "string"
  );
}

export function isSaleArray(value: unknown): value is Sale[] {
  return Array.isArray(value) && value.every(isSale);
}

export function isSettings(value: unknown): value is Settings {
  return (
    isRecord(value) &&
    typeof value.storeName === "string" &&
    typeof value.currency === "string" &&
    typeof value.taxRate === "number" &&
    (value.cashierName === undefined || typeof value.cashierName === "string") &&
    (value.inventoryControl === undefined ||
      typeof value.inventoryControl === "boolean") &&
    (value.muted === undefined || typeof value.muted === "boolean") &&
    (value.reduceAnimations === undefined ||
      typeof value.reduceAnimations === "boolean")
  );
}

export function isStockMovement(value: unknown): value is StockMovement {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.productId === "string" &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    (value.type === "sale" ||
      value.type === "restock" ||
      value.type === "adjustment") &&
    typeof value.reason === "string" &&
    (value.saleId === undefined || typeof value.saleId === "string") &&
    typeof value.createdAt === "string"
  );
}

export function isStockMovementArray(value: unknown): value is StockMovement[] {
  return Array.isArray(value) && value.every(isStockMovement);
}
