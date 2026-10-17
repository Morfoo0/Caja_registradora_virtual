import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import type { CartItem, Payment } from "@/types";
import {
  buildCardPayment,
  buildCashPayment,
  buildSale,
  canCheckout,
  checkoutReducer,
  initialCheckoutState,
  isSufficientPayment,
  type CheckoutState,
} from "./checkout";

const items: CartItem[] = [
  { productId: "p1", name: "Lápiz HB", unitPriceCents: toCents(8), quantity: 2 },
];
const totalCents = toCents(16);

const input = {
  items,
  totalCents,
  saleId: "sale-1",
  ticketNumber: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
};

function startCash(): CheckoutState {
  return checkoutReducer(
    checkoutReducer(initialCheckoutState, { type: "open" }),
    { type: "start", method: "cash" },
  );
}

describe("pago en efectivo", () => {
  it("detecta pago exacto e insuficiente", () => {
    expect(isSufficientPayment(toCents(16), totalCents)).toBe(true);
    expect(isSufficientPayment(toCents(15.99), totalCents)).toBe(false);
  });

  it("calcula el cambio con centavos enteros", () => {
    const payment = buildCashPayment(toCents(20), totalCents);
    expect(payment.changeCents).toBe(toCents(4));
  });

  it("el pago exacto produce cambio cero", () => {
    const payment = buildCashPayment(toCents(16), totalCents);
    expect(payment.changeCents).toBe(toCents(0));
  });
});

describe("pago con tarjeta (simulado)", () => {
  it("construye un pago con cambio cero", () => {
    const payment = buildCardPayment(totalCents);
    expect(payment.method).toBe("card");
    expect(payment.amountPaidCents).toBe(totalCents);
    expect(payment.changeCents).toBe(toCents(0));
  });
});

describe("construcción de venta", () => {
  it("mapea el carrito a líneas de venta con totales", () => {
    const payment: Payment = buildCashPayment(toCents(20), totalCents);
    const sale = buildSale(items, payment, "sale-1", 1, "2026-01-01T00:00:00.000Z");

    expect(sale.items).toHaveLength(1);
    expect(sale.items[0].lineTotalCents).toBe(toCents(16));
    expect(sale.subtotalCents).toBe(toCents(16));
    expect(sale.totalCents).toBe(toCents(16));
    expect(sale.payment.changeCents).toBe(toCents(4));
  });

  it("no permite cobrar un carrito vacío", () => {
    expect(canCheckout([])).toBe(false);
    expect(canCheckout(items)).toBe(true);
  });
});

describe("máquina de estados del cobro", () => {
  it("abre el cobro y permite elegir método", () => {
    const opened = checkoutReducer(initialCheckoutState, { type: "open" });
    expect(opened.status).toBe("method");
  });

  it("empieza en efectivo o tarjeta solo desde 'method'", () => {
    const opened = checkoutReducer(initialCheckoutState, { type: "open" });
    const cash = checkoutReducer(opened, { type: "start", method: "cash" });
    const card = checkoutReducer(opened, { type: "start", method: "card" });
    expect(cash.status).toBe("cash");
    expect(card.status).toBe("cardProcessing");
  });

  it("no permite empezar sin abrir el cobro", () => {
    const state = checkoutReducer(initialCheckoutState, {
      type: "start",
      method: "cash",
    });
    expect(state.status).toBe("idle");
  });

  it("bloquea confirmar si el importe es insuficiente", () => {
    const cash = startCash();
    const withReceived = checkoutReducer(cash, {
      type: "setReceived",
      receivedCents: toCents(10),
    });
    const confirmed = checkoutReducer(withReceived, {
      type: "confirmCash",
      input,
    });
    expect(confirmed.status).toBe("cash");
    expect(confirmed.error).toBe("insufficient");
    expect(confirmed.sale).toBeNull();
  });

  it("confirma con pago exacto y crea la venta", () => {
    const cash = startCash();
    const withReceived = checkoutReducer(cash, {
      type: "setReceived",
      receivedCents: toCents(16),
    });
    const confirmed = checkoutReducer(withReceived, {
      type: "confirmCash",
      input,
    });
    expect(confirmed.status).toBe("approved");
    expect(confirmed.sale).not.toBeNull();
    expect(confirmed.sale?.payment.changeCents).toBe(toCents(0));
  });

  it("confirma con cambio correcto", () => {
    const cash = startCash();
    const withReceived = checkoutReducer(cash, {
      type: "setReceived",
      receivedCents: toCents(50),
    });
    const confirmed = checkoutReducer(withReceived, {
      type: "confirmCash",
      input,
    });
    expect(confirmed.sale?.payment.changeCents).toBe(toCents(34));
  });

  it("evita venta duplicada por doble confirmación", () => {
    const cash = startCash();
    const withReceived = checkoutReducer(cash, {
      type: "setReceived",
      receivedCents: toCents(50),
    });
    const confirmed = checkoutReducer(withReceived, {
      type: "confirmCash",
      input,
    });
    const duplicated = checkoutReducer(confirmed, { type: "confirmCash", input });
    expect(duplicated).toEqual(confirmed);
  });

  it("aprueba la tarjeta una sola vez (evita doble aprobación)", () => {
    const opened = checkoutReducer(initialCheckoutState, { type: "open" });
    const processing = checkoutReducer(opened, { type: "start", method: "card" });
    const approved = checkoutReducer(processing, { type: "approveCard", input });
    const again = checkoutReducer(approved, { type: "approveCard", input });
    expect(approved.status).toBe("approved");
    expect(approved.sale?.payment.method).toBe("card");
    expect(again).toEqual(approved);
  });

  it("cancelar conserva el estado sin venta y vuelve a 'idle'", () => {
    const cash = startCash();
    const cancelled = checkoutReducer(cash, { type: "cancel" });
    expect(cancelled).toEqual(initialCheckoutState);
  });

  it("no permite cancelar una venta ya aprobada", () => {
    const cash = startCash();
    const withReceived = checkoutReducer(cash, {
      type: "setReceived",
      receivedCents: toCents(50),
    });
    const approved = checkoutReducer(withReceived, { type: "confirmCash", input });
    const cancelled = checkoutReducer(approved, { type: "cancel" });
    expect(cancelled.status).toBe("approved");
    expect(cancelled.sale).not.toBeNull();
  });

  it("reinicia después de aprobar para una nueva venta", () => {
    const cash = startCash();
    const withReceived = checkoutReducer(cash, {
      type: "setReceived",
      receivedCents: toCents(16),
    });
    const approved = checkoutReducer(withReceived, { type: "confirmCash", input });
    const reset = checkoutReducer(approved, { type: "reset" });
    expect(reset).toEqual(initialCheckoutState);
  });
});
