import { changeCents, lineTotalCents, subtotalCents } from "@/lib/money";
import type {
  CartItem,
  Cents,
  Payment,
  PaymentMethod,
  Sale,
  SaleItem,
} from "@/types";

export type CheckoutStatus =
  | "idle"
  | "method"
  | "cash"
  | "cardProcessing"
  | "approved";

export type CheckoutError = "insufficient" | null;

export interface CheckoutState {
  status: CheckoutStatus;
  method: PaymentMethod | null;
  receivedCents: Cents | null;
  sale: Sale | null;
  error: CheckoutError;
}

export const initialCheckoutState: CheckoutState = {
  status: "idle",
  method: null,
  receivedCents: null,
  sale: null,
  error: null,
};

/** Un carrito puede cobrarse solo si tiene al menos un artículo. */
export function canCheckout(items: readonly CartItem[]): boolean {
  return items.length > 0;
}

/** El importe recibido cubre el total (permite pago exacto). */
export function isSufficientPayment(
  receivedCents: Cents,
  totalCents: Cents,
): boolean {
  return receivedCents >= totalCents;
}

export function buildCashPayment(
  receivedCents: Cents,
  totalCents: Cents,
): Payment {
  return {
    method: "cash",
    amountPaidCents: receivedCents,
    changeCents: changeCents(receivedCents, totalCents),
  };
}

export function buildCardPayment(totalCents: Cents): Payment {
  return {
    method: "card",
    amountPaidCents: totalCents,
    changeCents: 0 as Cents,
  };
}

/** Construye una venta inmutable a partir del carrito y el pago. */
export function buildSale(
  items: readonly CartItem[],
  payment: Payment,
  id: string,
  ticketNumber: number,
  createdAt: string,
): Sale {
  const saleItems: SaleItem[] = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    unitPriceCents: item.unitPriceCents,
    quantity: item.quantity,
    lineTotalCents: lineTotalCents(item.unitPriceCents, item.quantity),
  }));

  return {
    id,
    ticketNumber,
    items: saleItems,
    subtotalCents: subtotalCents(items),
    totalCents: subtotalCents(items),
    payment,
    createdAt,
  };
}

export interface ConfirmInput {
  items: CartItem[];
  totalCents: Cents;
  saleId: string;
  ticketNumber: number;
  createdAt: string;
}

export type CheckoutAction =
  | { type: "open" }
  | { type: "start"; method: PaymentMethod }
  | { type: "setReceived"; receivedCents: Cents }
  | { type: "confirmCash"; input: ConfirmInput }
  | { type: "approveCard"; input: ConfirmInput }
  | { type: "cancel" }
  | { type: "reset" };

/**
 * Máquina de estados del cobro. Solo permite transiciones válidas y, por
 * tanto, evita ventas duplicadas (un "confirmar" fuera de estado es un no-op).
 */
export function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction,
): CheckoutState {
  switch (action.type) {
    case "open": {
      if (state.status !== "idle") {
        return state;
      }
      return {
        status: "method",
        method: null,
        receivedCents: null,
        sale: null,
        error: null,
      };
    }

    case "start": {
      if (state.status !== "method") {
        return state;
      }
      if (action.method === "cash") {
        return {
          status: "cash",
          method: "cash",
          receivedCents: null,
          sale: null,
          error: null,
        };
      }
      return {
        status: "cardProcessing",
        method: "card",
        receivedCents: null,
        sale: null,
        error: null,
      };
    }

    case "setReceived": {
      if (state.status !== "cash") {
        return state;
      }
      const receivedCents =
        action.receivedCents < 0 ? (0 as Cents) : action.receivedCents;
      return { ...state, receivedCents, error: null };
    }

    case "confirmCash": {
      if (state.status !== "cash" || state.receivedCents === null) {
        return state;
      }
      const totalCents = action.input.totalCents;
      if (!isSufficientPayment(state.receivedCents, totalCents)) {
        return { ...state, error: "insufficient" };
      }
      const payment = buildCashPayment(state.receivedCents, totalCents);
      const sale = buildSale(
        action.input.items,
        payment,
        action.input.saleId,
        action.input.ticketNumber,
        action.input.createdAt,
      );
      return {
        status: "approved",
        method: "cash",
        receivedCents: state.receivedCents,
        sale,
        error: null,
      };
    }

    case "approveCard": {
      if (state.status !== "cardProcessing") {
        return state;
      }
      const totalCents = action.input.totalCents;
      const sale = buildSale(
        action.input.items,
        buildCardPayment(totalCents),
        action.input.saleId,
        action.input.ticketNumber,
        action.input.createdAt,
      );
      return {
        status: "approved",
        method: "card",
        receivedCents: null,
        sale,
        error: null,
      };
    }

    case "cancel": {
      if (state.status === "approved" || state.status === "idle") {
        return state;
      }
      return { ...initialCheckoutState };
    }

    case "reset": {
      return { ...initialCheckoutState };
    }

    default:
      return state;
  }
}
