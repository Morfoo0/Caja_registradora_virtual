import type { Dispatch } from "react";
import { playKeyClick } from "@/features/audio";
import type { CalculatorAction, Digit } from "@/features/calculator";
import styles from "./Keypad.module.css";

interface KeyProps {
  label: string;
  ariaLabel?: string;
  tone?: "clear" | "add" | "total";
  wide?: boolean;
  onPress: () => void;
}

function Key({ label, ariaLabel, tone, wide, onPress }: KeyProps) {
  return (
    <button
      type="button"
      className={styles.key}
      data-tone={tone}
      data-wide={wide || undefined}
      aria-label={ariaLabel}
      onClick={() => {
        playKeyClick();
        onPress();
      }}
    >
      {label}
    </button>
  );
}

export function Keypad({ dispatch }: { dispatch: Dispatch<CalculatorAction> }) {
  const pressDigit = (digit: Digit) => () => dispatch({ type: "digit", digit });

  return (
    <div className={styles.keypad}>
      {(["7", "8", "9"] as Digit[]).map((d) => (
        <Key key={d} label={d} onPress={pressDigit(d)} />
      ))}
      <Key label="⌫" ariaLabel="Borrar último dígito" onPress={() => dispatch({ type: "backspace" })} />

      {(["4", "5", "6"] as Digit[]).map((d) => (
        <Key key={d} label={d} onPress={pressDigit(d)} />
      ))}
      <Key label="C" ariaLabel="Limpiar" tone="clear" onPress={() => dispatch({ type: "clear" })} />

      {(["1", "2", "3"] as Digit[]).map((d) => (
        <Key key={d} label={d} onPress={pressDigit(d)} />
      ))}
      <Key label="+" ariaLabel="Sumar importe" tone="add" onPress={() => dispatch({ type: "add" })} />

      <Key label="0" onPress={pressDigit("0")} />
      <Key label="·" ariaLabel="Punto decimal" onPress={() => dispatch({ type: "decimal" })} />
      <Key label="TOTAL" tone="total" wide onPress={() => dispatch({ type: "total" })} />
    </div>
  );
}
