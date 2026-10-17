import type { Cents, PaymentMethod, Sale } from "@/types";

/** Ordena las ventas de la más reciente a la más antigua (sin mutar). */
export function sortSalesByDate(sales: readonly Sale[]): Sale[] {
  return [...sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Clave de fecha local (YYYY-MM-DD) a partir de una fecha ISO. */
export function toLocalDateKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function matchesQuery(sale: Sale, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    sale.id.toLowerCase().includes(q) ||
    String(sale.ticketNumber).includes(q)
  );
}

export interface SalesFilter {
  /** Búsqueda por identificador (id) o número de ticket. */
  query?: string;
  /** Filtro de fecha inicial (YYYY-MM-DD, inclusivo). */
  dateFrom?: string;
  /** Filtro de fecha final (YYYY-MM-DD, inclusivo). */
  dateTo?: string;
}

/** Filtra ventas por identificador y rango de fechas (día local). */
export function filterSales(
  sales: readonly Sale[],
  filter: SalesFilter = {},
): Sale[] {
  const { query = "", dateFrom, dateTo } = filter;
  return sales.filter((sale) => {
    if (!matchesQuery(sale, query)) {
      return false;
    }
    const key = toLocalDateKey(sale.createdAt);
    if (dateFrom && key < dateFrom) {
      return false;
    }
    if (dateTo && key > dateTo) {
      return false;
    }
    return true;
  });
}

export interface MethodBreakdown {
  count: number;
  totalCents: Cents;
}

export interface SaleSummary {
  count: number;
  totalCents: Cents;
  byMethod: Record<PaymentMethod, MethodBreakdown>;
}

/** Resumen de un conjunto de ventas (operaciones y total cobrado por método). */
export function summarizeSales(sales: readonly Sale[]): SaleSummary {
  const summary: SaleSummary = {
    count: sales.length,
    totalCents: 0 as Cents,
    byMethod: {
      cash: { count: 0, totalCents: 0 as Cents },
      card: { count: 0, totalCents: 0 as Cents },
    },
  };

  for (const sale of sales) {
    summary.totalCents = (summary.totalCents + sale.totalCents) as Cents;
    const bucket = summary.byMethod[sale.payment.method];
    bucket.count += 1;
    bucket.totalCents = (bucket.totalCents + sale.totalCents) as Cents;
  }

  return summary;
}

export interface DaySummary {
  date: string;
  count: number;
  totalCents: Cents;
}

/** Resumen por día (fecha local), ordenado de más reciente a más antiguo. */
export function summarizeByDay(sales: readonly Sale[]): DaySummary[] {
  const map = new Map<string, { count: number; totalCents: Cents }>();

  for (const sale of sales) {
    const key = toLocalDateKey(sale.createdAt);
    if (!key) {
      continue;
    }
    const entry = map.get(key) ?? { count: 0, totalCents: 0 as Cents };
    entry.count += 1;
    entry.totalCents = (entry.totalCents + sale.totalCents) as Cents;
    map.set(key, entry);
  }

  return [...map.entries()]
    .map(([date, value]) => ({
      date,
      count: value.count,
      totalCents: value.totalCents,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
