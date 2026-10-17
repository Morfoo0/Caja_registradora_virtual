import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import {
  calculatorReducer,
  displayAmount,
  entryToCents,
  initialState,
  type CalculatorAction,
  type CalculatorState,
  type Digit,
} from "./calculator";

function run(actions: CalculatorAction[], from: CalculatorState = initialState) {
  return actions.reduce(calculatorReducer, from);
}

describe("entrada de dígitos", () => {
  it("acumula dígitos en la entrada", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "digit", digit: "2" },
      { type: "digit", digit: "3" },
    ]);
    expect(state.entry).toBe("123");
  });

  it("reemplaza el cero inicial por el nuevo dígito", () => {
    const state = run([
      { type: "digit", digit: "0" },
      { type: "digit", digit: "5" },
    ]);
    expect(state.entry).toBe("5");
  });

  it("no permite más de 7 dígitos enteros", () => {
    const digits: CalculatorAction[] = Array.from("12345678").map((d) => ({
      type: "digit",
      digit: d as Digit,
    }));
    const state = run(digits);
    expect(state.entry).toBe("1234567");
  });
});

describe("punto decimal", () => {
  it("añade el punto decimal y hasta dos decimales", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "digit", digit: "2" },
      { type: "decimal" },
      { type: "digit", digit: "3" },
      { type: "digit", digit: "4" },
    ]);
    expect(state.entry).toBe("12.34");
    expect(entryToCents(state.entry)).toBe(toCents(12.34));
  });

  it("antepone '0.' cuando el punto se teclea primero", () => {
    const state = run([
      { type: "decimal" },
      { type: "digit", digit: "5" },
    ]);
    expect(state.entry).toBe("0.5");
    expect(entryToCents(state.entry)).toBe(toCents(0.5));
  });

  it("ignora un segundo punto decimal", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "decimal" },
      { type: "digit", digit: "2" },
      { type: "decimal" },
    ]);
    expect(state.entry).toBe("1.2");
  });

  it("rechaza más de dos decimales", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "decimal" },
      { type: "digit", digit: "2" },
      { type: "digit", digit: "3" },
      { type: "digit", digit: "4" },
    ]);
    expect(state.entry).toBe("1.23");
    expect(entryToCents(state.entry)).toBe(toCents(1.23));
  });
});

describe("borrado y reinicio", () => {
  it("borra el último dígito", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "digit", digit: "2" },
      { type: "digit", digit: "3" },
      { type: "backspace" },
    ]);
    expect(state.entry).toBe("12");
  });

  it("borrar sobre entrada vacía no produce error", () => {
    const state = run([{ type: "backspace" }]);
    expect(state.entry).toBe("");
  });

  it("reinicia todo el estado con clear", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "add" },
      { type: "digit", digit: "2" },
      { type: "clear" },
    ]);
    expect(state).toEqual(initialState);
  });
});

describe("acumulación (sumar)", () => {
  it("suma la entrada al acumulado y vacía la entrada", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "digit", digit: "0" },
      { type: "decimal" },
      { type: "digit", digit: "5" },
      { type: "add" },
    ]);
    expect(state.accumulatedCents).toBe(toCents(10.5));
    expect(state.entry).toBe("");
  });

  it("acumula varias sumas", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "add" },
      { type: "digit", digit: "2" },
      { type: "add" },
    ]);
    expect(state.accumulatedCents).toBe(toCents(3));
  });

  it("ignora sumar con entrada vacía o cero", () => {
    const empty = run([{ type: "add" }]);
    expect(empty.accumulatedCents).toBe(toCents(0));

    const zero = run([
      { type: "digit", digit: "0" },
      { type: "add" },
    ]);
    expect(zero.accumulatedCents).toBe(toCents(0));
  });
});

describe("botón TOTAL", () => {
  it("totaliza el acumulado más la entrada actual", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "digit", digit: "0" },
      { type: "add" },
      { type: "digit", digit: "2" },
      { type: "digit", digit: "0" },
      { type: "total" },
    ]);
    expect(state.phase).toBe("totaled");
    expect(state.totaledCents).toBe(toCents(30));
  });

  it("totaliza solo la entrada cuando no hay acumulado", () => {
    const state = run([
      { type: "digit", digit: "5" },
      { type: "total" },
    ]);
    expect(state.totaledCents).toBe(toCents(5));
  });

  it("es idempotente: un segundo total no cambia el resultado", () => {
    const state = run([
      { type: "digit", digit: "7" },
      { type: "total" },
      { type: "total" },
    ]);
    expect(state.totaledCents).toBe(toCents(7));
  });

  it("muestra el total correctamente en el visor", () => {
    const state = run([
      { type: "digit", digit: "1" },
      { type: "add" },
      { type: "digit", digit: "1" },
      { type: "total" },
    ]);
    expect(displayAmount(state)).toBe(toCents(2));
  });
});

describe("casos límite", () => {
  it("no modifica el estado tras totalizar hasta reiniciar", () => {
    const state = run([
      { type: "digit", digit: "9" },
      { type: "total" },
      { type: "digit", digit: "5" },
    ]);
    expect(state.entry).toBe("");
    expect(state.totaledCents).toBe(toCents(9));
  });

  it("bloquea el acumulado en el límite máximo", () => {
    const state = run([
      { type: "digit", digit: "9" },
      { type: "digit", digit: "9" },
      { type: "digit", digit: "9" },
      { type: "digit", digit: "9" },
      { type: "digit", digit: "9" },
      { type: "digit", digit: "9" },
      { type: "digit", digit: "9" },
      { type: "add" },
      { type: "digit", digit: "9" },
      { type: "add" },
    ]);
    expect(state.accumulatedCents).toBe(999_999_999);
  });

  it("convierte la entrada con coma decimal vía parseToCents", () => {
    expect(entryToCents("12,50")).toBe(toCents(12.5));
  });
});
