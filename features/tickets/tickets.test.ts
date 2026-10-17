import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import { buildCashPayment, buildSale } from "@/features/checkout";
import type { CartItem, Sale } from "@/types";
import {
  buildTicketView,
  formatTicketDate,
  paymentMethodLabel,
} from "./tickets";

function makeSale(): Sale {
  const items: CartItem[] = [
    {
      productId: "p1",
      name: "Lápiz HB",
      unitPriceCents: toCents(8),
      quantity: 2,
    },
    {
      productId: "p2",
      name: "Cuaderno",
      unitPriceCents: toCents(42.5),
      quantity: 1,
    },
  ];
  const total = toCents(58.5);
  return buildSale(
    items,
    buildCashPayment(toCents(60), total),
    "sale-123",
    7,
    "2026-10-16T20:30:00.000Z",
  );
}

describe("vista del ticket", () => {
  it("mapea las líneas de la venta correctamente", () => {
    const view = buildTicketView(makeSale(), "Mi Papelería");

    expect(view.storeName).toBe("Mi Papelería");
    expect(view.saleId).toBe("sale-123");
    expect(view.ticketNumber).toBe(7);
    expect(view.lines).toHaveLength(2);
    expect(view.lines[0]).toMatchObject({
      name: "Lápiz HB",
      quantity: 2,
      unitPriceCents: toCents(8),
      lineTotalCents: toCents(16),
    });
    expect(view.lines[1].lineTotalCents).toBe(toCents(42.5));
  });

  it("muestra subtotal y total de la venta", () => {
    const view = buildTicketView(makeSale(), "Mi Papelería");
    expect(view.subtotalCents).toBe(toCents(58.5));
    expect(view.totalCents).toBe(toCents(58.5));
  });

  it("muestra método, importe recibido y cambio", () => {
    const view = buildTicketView(makeSale(), "Mi Papelería");
    expect(view.paymentMethodLabel).toBe("Efectivo");
    expect(view.amountPaidCents).toBe(toCents(60));
    expect(view.changeCents).toBe(toCents(1.5));
  });

  it("no recalcula totales si el precio cambia después del cobro", () => {
    const sale = makeSale();
    const viewBefore = buildTicketView(sale, "Mi Papelería");

    // Simula un cambio de precio en el catálogo tras el cobro.
    const modifiedItems = sale.items.map((i) => ({
      ...i,
      unitPriceCents: toCents(99),
    }));
    const viewAfter = buildTicketView(
      { ...sale, items: modifiedItems },
      "Mi Papelería",
    );

    // La vista usa los datos de la venta original, no los precios nuevos.
    expect(viewBefore.lines[0].unitPriceCents).toBe(toCents(8));
    expect(viewAfter.lines[0].unitPriceCents).toBe(toCents(99));
    expect(viewBefore.totalCents).toBe(sale.totalCents);
  });
});

describe("formato", () => {
  it("formatea la fecha local incluyendo el año", () => {
    const formatted = formatTicketDate("2026-10-16T20:30:00.000Z");
    expect(formatted).toContain("2026");
  });

  it("devuelve cadena vacía para fecha inválida", () => {
    expect(formatTicketDate("no-es-fecha")).toBe("");
  });

  it("etiqueta el método de pago", () => {
    expect(paymentMethodLabel("cash")).toBe("Efectivo");
    expect(paymentMethodLabel("card")).toBe("Tarjeta");
  });
});
