import { useCallback, useReducer } from "react";
import {
  checkoutReducer,
  initialCheckoutState,
  type CheckoutState,
  type ConfirmInput,
} from "@/features/checkout";
import { generateId } from "@/lib/ids";
import type { CartItem, Cents, PaymentMethod } from "@/types";

export interface CheckoutController {
  state: CheckoutState;
  open: () => void;
  start: (method: PaymentMethod) => void;
  setReceived: (receivedCents: Cents) => void;
  confirmCash: (items: CartItem[], totalCents: Cents) => void;
  approveCard: (items: CartItem[], totalCents: Cents) => void;
  cancel: () => void;
  reset: () => void;
}

function buildInput(items: CartItem[], totalCents: Cents): ConfirmInput {
  return {
    items,
    totalCents,
    saleId: generateId(),
    ticketNumber: Date.now(),
    createdAt: new Date().toISOString(),
  };
}

export function useCheckout(): CheckoutController {
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);

  const open = useCallback(() => dispatch({ type: "open" }), []);
  const start = useCallback(
    (method: PaymentMethod) => dispatch({ type: "start", method }),
    [],
  );
  const setReceived = useCallback(
    (receivedCents: Cents) => dispatch({ type: "setReceived", receivedCents }),
    [],
  );
  const confirmCash = useCallback(
    (items: CartItem[], totalCents: Cents) =>
      dispatch({ type: "confirmCash", input: buildInput(items, totalCents) }),
    [],
  );
  const approveCard = useCallback(
    (items: CartItem[], totalCents: Cents) =>
      dispatch({ type: "approveCard", input: buildInput(items, totalCents) }),
    [],
  );
  const cancel = useCallback(() => dispatch({ type: "cancel" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return {
    state,
    open,
    start,
    setReceived,
    confirmCash,
    approveCard,
    cancel,
    reset,
  };
}
