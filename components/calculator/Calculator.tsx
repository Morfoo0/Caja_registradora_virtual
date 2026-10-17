"use client";

import { useCalculator } from "./useCalculator";
import { Display } from "./Display";
import { Keypad } from "./Keypad";
import styles from "./Calculator.module.css";

export function Calculator() {
  const { state, dispatch } = useCalculator();

  return (
    <section className={styles.register} aria-label="Caja registradora">
      <Display state={state} />
      <Keypad dispatch={dispatch} />
    </section>
  );
}
