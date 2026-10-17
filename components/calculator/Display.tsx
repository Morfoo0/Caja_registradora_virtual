import { formatCents } from "@/lib/money";
import {
  displayAmount,
  entryDisplayText,
  type CalculatorState,
} from "@/features/calculator";
import styles from "./Display.module.css";

export function Display({ state }: { state: CalculatorState }) {
  const isTotaled = state.phase === "totaled";
  const text = isTotaled
    ? formatCents(displayAmount(state))
    : entryDisplayText(state.entry);

  return (
    <div className={styles.display} data-totaled={isTotaled || undefined}>
      <span className={styles.label}>{isTotaled ? "Total" : "Importe"}</span>
      <span className={styles.value} aria-live="polite">
        {text}
      </span>
    </div>
  );
}
