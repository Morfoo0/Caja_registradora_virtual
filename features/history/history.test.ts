import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import type { Sale } from "@/types";
import {
  filterSales,
  sortSalesByDate,
  summarizeByDay,
  summarizeSales,
  toLocalDateKey,
} from "./history";

function sale(
  id: string,
  ticketNumber: number,
  createdAt: string,
  totalCents: number,
  method: "cash" | "card" = "cash",
): Sale {
  return {
    id,
    ticketNumber,
    items: [
      {
        productId: "p1",
        name: "Lápiz HB",
        unitPriceCents: totalCents as never,
        quantity: 1,
        lineTotalCents: totalCents as never,
      },
    ],
    subtotalCents: totalCents as never,
    totalCents: totalCents as never,
    payment: {
      method,
      amountPaidCents: totalCents as never,
      changeCents: 0 as never,
    },
    createdAt,
  };
}

const day1 = new Date(2026, 9, 16, 10, 0, 0).toISOString();
const day2 = new Date(2026, 9, 17, 10, 0, 0).toISOString();
const day3 = new Date(2026, 9, 18, 10, 0, 0).toISOString();

const sales: Sale[] = [
  sale("s-3", 3, day3, toCents(30), "card"),
  sale("s-1", 1, day1, toCents(10), "cash"),
  sale("s-2", 2, day2, toCents(20), "cash"),
];

describe("ordenación", () => {
  it("ordena de más reciente a más antigua", () => {
    const sorted = sortSalesByDate(sales);
    expect(sorted.map((s) => s.id)).toEqual(["s-3", "s-2", "s-1"]);
  });

  it("no muta el arreglo original", () => {
    const original = [...sales];
    sortSalesByDate(sales);
    expect(sales).toEqual(original);
  });
});

describe("filtros", () => {
  it("filtra por identificador (id o número de ticket)", () => {
    expect(filterSales(sales, { query: "s-1" }).map((s) => s.id)).toEqual([
      "s-1",
    ]);
    expect(filterSales(sales, { query: "2" }).map((s) => s.id)).toEqual([
      "s-2",
    ]);
  });

  it("filtra por rango de fechas", () => {
    const result = filterSales(sales, {
      dateFrom: "2026-10-17",
      dateTo: "2026-10-17",
    });
    expect(result.map((s) => s.id)).toEqual(["s-2"]);
  });

  it("filtra por fecha inicial", () => {
    const sorted = sortSalesByDate(sales);
    const result = filterSales(sorted, { dateFrom: "2026-10-17" });
    expect(result.map((s) => s.id)).toEqual(["s-3", "s-2"]);
  });

  it("devuelve vacío cuando no hay coincidencias", () => {
    expect(filterSales(sales, { query: "zzz" })).toEqual([]);
  });
});

describe("resumen", () => {
  it("cuenta operaciones y total cobrado", () => {
    const summary = summarizeSales(sales);
    expect(summary.count).toBe(3);
    expect(summary.totalCents).toBe(toCents(60));
  });

  it("desglosa por método de pago", () => {
    const summary = summarizeSales(sales);
    expect(summary.byMethod.cash).toEqual({
      count: 2,
      totalCents: toCents(30),
    });
    expect(summary.byMethod.card).toEqual({
      count: 1,
      totalCents: toCents(30),
    });
  });

  it("resumen vacío para lista vacía", () => {
    const summary = summarizeSales([]);
    expect(summary.count).toBe(0);
    expect(summary.totalCents).toBe(toCents(0));
  });
});

describe("resumen por día", () => {
  it("agrupa por día local y ordena descendente", () => {
    const daily = summarizeByDay(sales);
    expect(daily.map((d) => d.date)).toEqual([
      "2026-10-18",
      "2026-10-17",
      "2026-10-16",
    ]);
    expect(daily[0].count).toBe(1);
    expect(daily[0].totalCents).toBe(toCents(30));
  });
});

describe("fecha local", () => {
  it("devuelve la clave YYYY-MM-DD local", () => {
    expect(toLocalDateKey(day1)).toBe("2026-10-16");
  });

  it("devuelve vacío para fecha inválida", () => {
    expect(toLocalDateKey("no-es-fecha")).toBe("");
  });
});

describe("muchos registros", () => {
  it("resume correctamente miles de ventas", () => {
    const many: Sale[] = Array.from({ length: 5000 }, (_, i) =>
      sale(`s-${i}`, i + 1, day1, toCents(1), i % 2 === 0 ? "cash" : "card"),
    );
    const summary = summarizeSales(many);
    expect(summary.count).toBe(5000);
    expect(summary.totalCents).toBe(toCents(5000));
    expect(summary.byMethod.cash.count).toBe(2500);
    expect(summary.byMethod.card.count).toBe(2500);

    const filtered = filterSales(many, { query: "s-4242" });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("s-4242");
  });
});
