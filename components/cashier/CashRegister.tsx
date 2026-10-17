"use client";

import { Catalog } from "@/components/catalog/Catalog";
import { CartPanel } from "@/components/cart/CartPanel";
import { Calculator } from "@/components/calculator/Calculator";
import { useCart } from "@/components/cart/useCart";
import styles from "./CashRegister.module.css";

export function CashRegister() {
  const cart = useCart();

  return (
    <div className={styles.shell}>
      <Catalog onAdd={cart.add} />
      <div className={styles.sidebar}>
        <CartPanel cart={cart} />
        <Calculator />
      </div>
    </div>
  );
}
