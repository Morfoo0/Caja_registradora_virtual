"use client";

import { useEffect } from "react";
import { Catalog } from "@/components/catalog/Catalog";
import { CartPanel } from "@/components/cart/CartPanel";
import { Calculator } from "@/components/calculator/Calculator";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { useCart } from "@/components/cart/useCart";
import { useCheckout } from "@/components/checkout/useCheckout";
import styles from "./CashRegister.module.css";

export function CashRegister() {
  const cart = useCart();
  const checkout = useCheckout();

  const { clear, items, totalCents } = cart;
  const status = checkout.state.status;

  useEffect(() => {
    if (status === "approved") {
      clear();
    }
  }, [status, clear]);

  return (
    <>
      <div className={styles.shell}>
        <Catalog onAdd={cart.add} />
        <div className={styles.sidebar}>
          <CartPanel cart={cart} onCheckout={checkout.open} />
          <Calculator />
        </div>
      </div>
      <CheckoutModal checkout={checkout} items={items} totalCents={totalCents} />
    </>
  );
}
