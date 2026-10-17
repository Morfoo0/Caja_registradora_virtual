"use client";

import { useEffect, useState } from "react";
import { changeCents, formatCents, parseToCents } from "@/lib/money";
import { isSufficientPayment } from "@/features/checkout";
import { DEFAULT_STORE_NAME } from "@/features/tickets";
import { Ticket } from "@/components/ticket/Ticket";
import type { CartItem, Cents } from "@/types";
import type { CheckoutController } from "./useCheckout";
import styles from "./CheckoutModal.module.css";

interface CheckoutModalProps {
  checkout: CheckoutController;
  items: CartItem[];
  totalCents: Cents;
}

export function CheckoutModal({
  checkout,
  items,
  totalCents,
}: CheckoutModalProps) {
  const { state } = checkout;
  const [cashText, setCashText] = useState("");

  useEffect(() => {
    if (state.status !== "cardProcessing") {
      return;
    }
    const timer = setTimeout(() => {
      checkout.approveCard(items, totalCents);
    }, 1500);
    return () => clearTimeout(timer);
  }, [state.status, items, totalCents, checkout]);

  if (state.status === "idle") {
    return null;
  }

  const receivedCents = state.receivedCents;
  const sufficient =
    receivedCents !== null && isSufficientPayment(receivedCents, totalCents);
  const changeDue =
    receivedCents !== null && sufficient ? changeCents(receivedCents, totalCents) : null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Cobro"
      >
        {state.status === "method" && (
          <>
            <h2 className={styles.title}>Cobrar</h2>
            <p className={styles.total}>
              Total pendiente:{" "}
              <strong>{formatCents(totalCents)}</strong>
            </p>
            <div className={styles.methods}>
              <button
                type="button"
                className={styles.cashBtn}
                onClick={() => {
                  setCashText("");
                  checkout.start("cash");
                }}
              >
                Efectivo
              </button>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => checkout.start("card")}
              >
                Tarjeta
              </button>
            </div>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={checkout.cancel}
            >
              Cancelar
            </button>
          </>
        )}

        {state.status === "cash" && (
          <>
            <h2 className={styles.title}>Pago en efectivo</h2>
            <p className={styles.total}>
              Total pendiente:{" "}
              <strong>{formatCents(totalCents)}</strong>
            </p>
            <label className={styles.field}>
              Importe recibido
              <input
                type="text"
                inputMode="decimal"
                className={styles.input}
                value={cashText}
                placeholder="0.00"
                aria-label="Importe recibido"
                onChange={(event) => {
                  setCashText(event.target.value);
                  checkout.setReceived(parseToCents(event.target.value));
                }}
              />
            </label>

            {receivedCents !== null && !sufficient && (
              <p className={styles.error}>Importe insuficiente.</p>
            )}
            {changeDue !== null && (
              <p className={styles.change}>
                Cambio: <strong>{formatCents(changeDue)}</strong>
              </p>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.confirmBtn}
                disabled={!sufficient}
                onClick={() => checkout.confirmCash(items, totalCents)}
              >
                Confirmar pago
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={checkout.cancel}
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {state.status === "cardProcessing" && (
          <>
            <h2 className={styles.title}>Pago con tarjeta</h2>
            <div className={styles.spinner} aria-hidden="true" />
            <p className={styles.processing}>Procesando pago…</p>
            <p className={styles.demo}>
              Simulación demostrativa: no se realiza ningún cobro real ni se
              almacenan datos de tarjeta.
            </p>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={checkout.cancel}
            >
              Cancelar
            </button>
          </>
        )}

        {state.status === "approved" && state.sale && (
          <>
            <h2 className={`${styles.title} no-print`}>Venta completada</h2>
            <Ticket sale={state.sale} storeName={DEFAULT_STORE_NAME} />
            <div className={`${styles.actions} no-print`}>
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={() => window.print()}
              >
                Imprimir ticket
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={checkout.reset}
              >
                Nueva venta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
