import { useEffect, useReducer } from "react";
import {
  calculatorReducer,
  initialState,
  type Digit,
} from "@/features/calculator";

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        dispatch({ type: "digit", digit: event.key as Digit });
      } else if (event.key === "." || event.key === ",") {
        dispatch({ type: "decimal" });
      } else if (event.key === "Backspace") {
        dispatch({ type: "backspace" });
      } else if (event.key === "Escape" || event.key === "Delete") {
        dispatch({ type: "clear" });
      } else if (event.key === "+") {
        dispatch({ type: "add" });
      } else if (event.key === "Enter") {
        dispatch({ type: "total" });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { state, dispatch };
}
