import type { CartItem } from "@/types";

export const CURRENCY = "MXN" as const;
export const LOCALE = "es-MX";
export const DECIMALS = 2;

const formatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: DECIMALS,
  maximumFractionDigits: DECIMALS,
});

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** DECIMALS;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatMoney(value: number): string {
  return formatter.format(roundMoney(value));
}

export function lineTotal(unitPrice: number, quantity: number): number {
  return roundMoney(unitPrice * quantity);
}

export function calculateSubtotal(
  items: ReadonlyArray<Pick<CartItem, "unitPrice" | "quantity">>,
): number {
  return roundMoney(
    items.reduce(
      (sum, item) => sum + lineTotal(item.unitPrice, item.quantity),
      0,
    ),
  );
}

export function calculateChange(amountPaid: number, total: number): number {
  return roundMoney(amountPaid - total);
}

export function parseMoneyInput(raw: string): number {
  const normalized = raw.replace(/[^0-9.,]/g, "").replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? roundMoney(value) : 0;
}
