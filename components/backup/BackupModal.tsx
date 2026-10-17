"use client";

import { useRef, useState } from "react";
import {
  parseBackup,
  salesToCsv,
  serializeBackup,
  type BackupFile,
} from "@/features/backup";
import {
  applyBackup,
  browserStorage,
  gatherBackup,
  loadSales,
} from "@/features/persistence";
import { downloadTextFile } from "@/lib/download";
import { refreshCatalog } from "@/components/catalog/catalogStore";
import { refreshSales } from "@/components/history/salesStore";
import { refreshSettings } from "@/components/settings/appSettingsStore";
import { useEscapeKey } from "@/components/hooks/useEscapeKey";
import styles from "./BackupModal.module.css";

interface BackupModalProps {
  open: boolean;
  onClose: () => void;
}

export function BackupModal({ open, onClose }: BackupModalProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<BackupFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEscapeKey(onClose, open);

  if (!open) {
    return null;
  }

  const date = new Date().toISOString().slice(0, 10);

  const exportCsv = () => {
    try {
      const csv = salesToCsv(loadSales(browserStorage));
      downloadTextFile(
        `barbie-cashier-ventas-${date}.csv`,
        csv,
        "text/csv;charset=utf-8",
      );
      setMessage("Ventas exportadas a CSV.");
      setErrors([]);
    } catch {
      setErrors(["No se pudo exportar el CSV."]);
    }
  };

  const exportJson = () => {
    try {
      const backup = gatherBackup(browserStorage);
      const raw = serializeBackup(backup);
      downloadTextFile(
        `barbie-cashier-respaldo-${date}.json`,
        raw,
        "application/json",
      );
      setMessage("Respaldo exportado a JSON.");
      setErrors([]);
    } catch {
      setErrors(["No se pudo exportar el respaldo."]);
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      const result = parseBackup(text);
      if (result.ok) {
        setPending(result.backup);
        setErrors([]);
        setMessage("");
      } else {
        setPending(null);
        setErrors(result.errors);
        setMessage("");
      }
    } catch {
      setPending(null);
      setErrors(["No se pudo leer el archivo."]);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const confirmRestore = () => {
    if (!pending) {
      return;
    }
    try {
      applyBackup(browserStorage, pending);
      refreshCatalog();
      refreshSales();
      refreshSettings();
      setMessage("Datos restaurados correctamente.");
      setErrors([]);
      setPending(null);
    } catch {
      setErrors(["No se pudo restaurar el respaldo."]);
    }
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Respaldo y exportación"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Respaldo y exportación</h2>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <p className={styles.note}>
          El respaldo incluye catálogo, configuración, inventario (movimientos)
          y ventas. No se exportan claves ni información innecesaria.
        </p>
        <p className={styles.note}>
          Un archivo descargado en tu dispositivo no es una copia de seguridad
          automática: guárdalo fuera de la aplicación si quieres conservarlo.
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={exportCsv}>
            Exportar ventas (CSV)
          </button>
          <button type="button" className={styles.primaryBtn} onClick={exportJson}>
            Exportar respaldo (JSON)
          </button>
          <label className={styles.importBtn}>
            Importar respaldo
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label="Seleccionar archivo de respaldo"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </label>
        </div>

        {pending && (
          <div className={styles.confirm}>
            <p className={styles.confirmText}>
              Restaurar sobrescribirá el catálogo, la configuración, el
              inventario y las ventas actuales. ¿Continuar?
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={confirmRestore}
              >
                Restaurar
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setPending(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <ul className={styles.errors} role="alert">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
