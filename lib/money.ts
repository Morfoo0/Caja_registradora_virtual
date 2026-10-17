import type { Cents } from "@/types";

export const CURRENCY = "MXN" as const;
export const LOCALE = "es-MX";
export const FRACTION_DIGITS = 2;
export const CENTS_PER_UNIT = 100;

const formatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: FRACTION_DIGITS,
  maximumFractionDigits: FRACTION_DIGITS,
});

/** Convierte unidades de moneda (flotantes de entrada) a centavos enteros. */
export function toCents(units: number): Cents {
  if (!Number.isFinite(units)) {
    return 0 as Cents;
  }
  return Math.round(units * CENTS_PER_UNIT) as Cents;
}

/** Convierte centavos a unidades de moneda (solo para display/parseo). */
export function fromCents(cents: Cents): number {
  return cents / CENTS_PER_UNIT;
}

/** Formatea centavos como moneda MXN (es-MX). */
export function formatCents(cents: Cents): string {
  return formatter.format(fromCents(cents));
}

/** Parsea la entrada del usuario ("12.34" | "12,34" | "12") a centavos enteros. */
export function parseToCents(raw: string): Cents {
  const normalized = raw.replace(/[^0-9.,]/g, "").replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? toCents(value) : (0 as Cents);
}

/** Total de línea: precio unitario en centavos × cantidad entera (exacto). */
export function lineTotalCents(unitPriceCents: Cents, quantity: number): Cents {
  return Math.round(unitPriceCents * quantity) as Cents;
}

export interface PricedLine {
  unitPriceCents: Cents;
  quantity: number;
}

/** Suma de los totales de línea, en centavos enteros. */
export function subtotalCents(items: ReadonlyArray<PricedLine>): Cents {
  return items.reduce(
    (sum, item) => (sum + lineTotalCents(item.unitPriceCents, item.quantity)) as Cents,
    0 as Cents,
  );
}

/** Cambio a devolver = importe recibido − total, en centavos enteros. */
export function changeCents(amountPaidCents: Cents, totalCents: Cents): Cents {
  return (amountPaidCents - totalCents) as Cents;
}
