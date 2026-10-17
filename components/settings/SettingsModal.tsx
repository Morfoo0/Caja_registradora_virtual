"use client";

import { useState } from "react";
import type { Settings } from "@/types";
import { useEscapeKey } from "@/components/hooks/useEscapeKey";
import styles from "./SettingsModal.module.css";

interface SettingsModalProps {
  settings: Settings;
  onSave: (patch: Partial<Settings>) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [cashierName, setCashierName] = useState(settings.cashierName ?? "");
  const [inventoryControl, setInventoryControl] = useState(
    settings.inventoryControl !== false,
  );

  useEscapeKey(onClose);

  const valid = storeName.trim().length > 0;

  const handleSave = () => {
    if (!valid) {
      return;
    }
    onSave({
      storeName: storeName.trim(),
      cashierName: cashierName.trim() || undefined,
      inventoryControl,
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Configuración de la tienda"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Configuración</h2>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Cerrar configuración"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <label className={styles.field}>
          Nombre de la tienda
          <input
            type="text"
            className={styles.input}
            value={storeName}
            onChange={(event) => setStoreName(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          Nombre del cajero (opcional)
          <input
            type="text"
            className={styles.input}
            value={cashierName}
            onChange={(event) => setCashierName(event.target.value)}
          />
        </label>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={inventoryControl}
            onChange={(event) => setInventoryControl(event.target.checked)}
          />
          <span>Control de inventario (descontar existencias al vender)</span>
        </label>

        {!valid && (
          <p className={styles.error} role="alert">
            El nombre de la tienda no puede estar vacío.
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={!valid}
            onClick={handleSave}
          >
            Guardar
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
