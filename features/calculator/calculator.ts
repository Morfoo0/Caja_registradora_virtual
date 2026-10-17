import { parseToCents } from "@/lib/money";
import type { Cents } from "@/types";

/** Máximo de dígitos enteros permitidos en una entrada (≈ $9,999,999.99). */
export const MAX_INTEGER_DIGITS = 7;
/** Máximo de decimales para importes monetarios. */
export const MAX_DECIMAL_DIGITS = 2;
/** Límite superior razonable del importe acumulado, en centavos. */
export const MAX_CENTS = 999_999_999 as Cents;

export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type CalculatorPhase = "entering" | "totaled";

export interface CalculatorState {
  /** Fase actual de la operación. */
  phase: CalculatorPhase;
  /** Entrada numérica en curso, como texto (p. ej. "12.34"). */
  entry: string;
  /** Importe acumulado por las operaciones de suma, en centavos. */
  accumulatedCents: Cents;
  /** Resultado del botón TOTAL, en centavos (null si aún no se ha totalizado). */
  totaledCents: Cents | null;
}

export type CalculatorAction =
  | { type: "digit"; digit: Digit }
  | { type: "decimal" }
  | { type: "backspace" }
  | { type: "clear" }
  | { type: "add" }
  | { type: "total" };

export const initialState: CalculatorState = {
  phase: "entering",
  entry: "",
  accumulatedCents: 0 as Cents,
  totaledCents: null,
};

function splitEntry(entry: string): [integer: string, fraction: string] {
  const idx = entry.indexOf(".");
  if (idx === -1) {
    return [entry, ""];
  }
  return [entry.slice(0, idx), entry.slice(idx + 1)];
}

function appendDigit(entry: string, digit: Digit): string {
  if (entry === "0") {
    return digit;
  }
  const [integer, fraction] = splitEntry(entry);
  const hasDecimal = entry.includes(".");
  if (hasDecimal) {
    if (fraction.length >= MAX_DECIMAL_DIGITS) {
      return entry;
    }
  } else if (integer.length >= MAX_INTEGER_DIGITS) {
    return entry;
  }
  return entry + digit;
}

function appendDecimal(entry: string): string {
  if (entry.includes(".")) {
    return entry;
  }
  return entry === "" ? "0." : entry + ".";
}

function clampCents(cents: Cents): Cents {
  return Math.max(0 as Cents, Math.min(MAX_CENTS, cents) as Cents) as Cents;
}

/** Convierte la entrada de texto a centavos enteros (entrada vacía → 0). */
export function entryToCents(entry: string): Cents {
  if (entry === "") {
    return 0 as Cents;
  }
  return parseToCents(entry);
}

/** Texto que muestra el visor mientras se teclea (sin formato de moneda). */
export function entryDisplayText(entry: string): string {
  return entry === "" ? "0" : entry;
}

/** Importe que debe mostrar el visor según el estado, en centavos. */
export function displayAmount(state: CalculatorState): Cents {
  if (state.phase === "totaled" && state.totaledCents !== null) {
    return state.totaledCents;
  }
  return entryToCents(state.entry);
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case "digit": {
      if (state.phase === "totaled") {
        return state;
      }
      return { ...state, entry: appendDigit(state.entry, action.digit) };
    }

    case "decimal": {
      if (state.phase === "totaled") {
        return state;
      }
      return { ...state, entry: appendDecimal(state.entry) };
    }

    case "backspace": {
      if (state.phase === "totaled") {
        return state;
      }
      return { ...state, entry: state.entry.slice(0, -1) };
    }

    case "clear": {
      return { ...initialState };
    }

    case "add": {
      if (state.phase === "totaled") {
        return state;
      }
      const cents = entryToCents(state.entry);
      if (cents === 0) {
        return state;
      }
      return {
        phase: "entering",
        entry: "",
        accumulatedCents: clampCents((state.accumulatedCents + cents) as Cents),
        totaledCents: null,
      };
    }

    case "total": {
      if (state.phase === "totaled") {
        return state;
      }
      const total = clampCents(
        (state.accumulatedCents + entryToCents(state.entry)) as Cents,
      );
      return {
        phase: "totaled",
        entry: "",
        accumulatedCents: state.accumulatedCents,
        totaledCents: total,
      };
    }

    default:
      return state;
  }
}
