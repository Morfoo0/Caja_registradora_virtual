"use client";

import { useEffect, useRef, useState } from "react";
import { playChaChing } from "@/features/audio";
import { useEscapeKey } from "@/components/hooks/useEscapeKey";
import styles from "./RegisterMenu.module.css";

interface RegisterMenuProps {
  muted: boolean;
  reduceAnimations: boolean;
  onToggleMuted: () => void;
  onToggleAnimations: () => void;
  onOpenHistory: () => void;
  onOpenBackup: () => void;
  onOpenSettings: () => void;
}

export function RegisterMenu({
  muted,
  reduceAnimations,
  onToggleMuted,
  onToggleAnimations,
  onOpenHistory,
  onOpenBackup,
  onOpenSettings,
}: RegisterMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEscapeKey(() => setOpen(false), open);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onDown(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const closeThen = (action?: () => void) => () => {
    setOpen(false);
    action?.();
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (!open) {
            playChaChing();
          }
          setOpen((value) => !value);
        }}
      >
        <span aria-hidden="true">☰</span> Menú
      </button>

      {open && (
        <ul className={styles.menu} role="menu">
          <li role="none">
            <button type="button" role="menuitem" onClick={closeThen(onOpenSettings)}>
              Configuración
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" onClick={closeThen(onOpenHistory)}>
              Historial
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" onClick={closeThen(onOpenBackup)}>
              Respaldo
            </button>
          </li>
          <li role="none" className={styles.separator} />
          <li role="none">
            <button type="button" role="menuitem" onClick={onToggleMuted}>
              Sonido: {muted ? "Off" : "On"}
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" onClick={onToggleAnimations}>
              Animaciones: {reduceAnimations ? "Off" : "On"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
