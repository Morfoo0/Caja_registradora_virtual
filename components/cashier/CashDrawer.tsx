"use client";

import styles from "./CashDrawer.module.css";

const BILLS = [
  { value: "20", tint: "var(--pink-300)" },
  { value: "50", tint: "var(--pink-500)" },
  { value: "100", tint: "var(--magenta)" },
];

const COINS = ["1", "2", "5", "10"];

export function CashDrawer({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.drawer} aria-label="Cajón de dinero">
      <div className={styles.tray} data-open={open || undefined}>
        <div className={styles.bills}>
          {BILLS.map((bill) => (
            <span
              key={bill.value}
              className={styles.bill}
              style={{ background: bill.tint }}
            >
              ${bill.value}
            </span>
          ))}
        </div>
        <div className={styles.coins}>
          {COINS.map((coin) => (
            <span key={coin} className={styles.coin}>
              ${coin}
            </span>
          ))}
        </div>
      </div>
      <button type="button" className={styles.front} onClick={onToggle}>
        {open ? "Cerrar cajón" : "Abrir cajón"}
      </button>
    </div>
  );
}
