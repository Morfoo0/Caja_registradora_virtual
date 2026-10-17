"use client";

import { useEffect } from "react";
import { Catalog } from "@/components/catalog/Catalog";
import { CartPanel } from "@/components/cart/CartPanel";
import { Calculator } from "@/components/calculator/Calculator";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { useCart } from "@/components/cart/useCart";
import { useCheckout } from "@/components/checkout/useCheckout";
import { useStoredValue } from "@/components/hooks/useStoredValue";
import { applySaleDeduction } from "@/components/catalog/catalogStore";
import {
  DEFAULT_SETTINGS,
  addSale,
  browserStorage,
  loadSettings,
} from "@/features/persistence";
import styles from "./CashRegister.module.css";

export function CashRegister() {
  const cart = useCart();
  const checkout = useCheckout();

  const settings = useStoredValue(
    "settings",
    () => loadSettings(browserStorage),
    DEFAULT_SETTINGS,
  );

  const { clear, items, totalCents } = cart;
  const status = checkout.state.status;
  const sale = checkout.state.sale;

  useEffect(() => {
    if (status === "approved") {
      clear();
      if (sale) {
        addSale(browserStorage, sale);
        applySaleDeduction(sale, settings.inventoryControl !== false);
      }
    }
  }, [status, clear, sale, settings.inventoryControl]);

  return (
    <>
      <div className={styles.shell}>
        <Catalog onAdd={cart.add} />
        <div className={styles.sidebar}>
          <CartPanel cart={cart} onCheckout={checkout.open} />
          <Calculator />
        </div>
      </div>
      <CheckoutModal
        checkout={checkout}
        items={items}
        totalCents={totalCents}
        storeName={settings.storeName}
      />
    </>
  );
}
