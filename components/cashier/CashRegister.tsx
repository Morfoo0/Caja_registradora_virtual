"use client";

import { useCallback, useEffect, useState } from "react";
import { Catalog } from "@/components/catalog/Catalog";
import { CartPanel } from "@/components/cart/CartPanel";
import { Calculator } from "@/components/calculator/Calculator";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { HistoryModal } from "@/components/history/HistoryModal";
import { CashDrawer } from "@/components/cashier/CashDrawer";
import { BackupModal } from "@/components/backup/BackupModal";
import { RegisterMenu } from "@/components/cashier/RegisterMenu";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { refreshSales } from "@/components/history/salesStore";
import { useCart } from "@/components/cart/useCart";
import { useCheckout } from "@/components/checkout/useCheckout";
import { applySaleDeduction } from "@/components/catalog/catalogStore";
import {
  useAppSettings,
  setMutedPreference,
  setReduceAnimationsPreference,
  updateSettings,
} from "@/components/settings/appSettingsStore";
import { playAddProduct, playChaChing, setMuted } from "@/features/audio";
import { addSale, browserStorage } from "@/features/persistence";
import type { Product } from "@/types";
import styles from "./CashRegister.module.css";

export function CashRegister() {
  const cart = useCart();
  const checkout = useCheckout();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const settings = useAppSettings();

  const { clear, items, totalCents } = cart;
  const status = checkout.state.status;
  const sale = checkout.state.sale;

  useEffect(() => {
    setMuted(settings.muted === true);
  }, [settings.muted]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      settings.reduceAnimations === true,
    );
  }, [settings.reduceAnimations]);

  const handleApproved = useCallback(() => {
    playChaChing();
    setDrawerOpen(true);
  }, []);

  useEffect(() => {
    if (status === "approved") {
      clear();
      if (sale) {
        addSale(browserStorage, sale);
        applySaleDeduction(sale, settings.inventoryControl !== false);
        refreshSales();
      }
    }
  }, [status, clear, sale, settings.inventoryControl]);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const timer = setTimeout(() => setDrawerOpen(false), 3000);
    return () => clearTimeout(timer);
  }, [drawerOpen]);

  const openHistory = () => {
    refreshSales();
    setHistoryOpen(true);
  };

  const addProduct = (product: Product) => {
    playAddProduct();
    cart.add(product);
  };

  return (
    <>
      <div className={styles.topbar}>
        <RegisterMenu
          muted={settings.muted === true}
          reduceAnimations={settings.reduceAnimations === true}
          onToggleMuted={() => setMutedPreference(!settings.muted)}
          onToggleAnimations={() =>
            setReduceAnimationsPreference(!settings.reduceAnimations)
          }
          onOpenHistory={openHistory}
          onOpenBackup={() => setBackupOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      <div className={styles.shell}>
        <Catalog onAdd={addProduct} />
        <div className={styles.sidebar}>
          <CartPanel cart={cart} onCheckout={checkout.open} />
          <Calculator />
          <CashDrawer open={drawerOpen} onToggle={() => setDrawerOpen((v) => !v)} />
        </div>
      </div>

      <CheckoutModal
        checkout={checkout}
        items={items}
        totalCents={totalCents}
        storeName={settings.storeName}
        onApproved={handleApproved}
      />
      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <BackupModal open={backupOpen} onClose={() => setBackupOpen(false)} />
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={updateSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
