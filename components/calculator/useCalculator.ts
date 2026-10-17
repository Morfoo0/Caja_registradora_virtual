import { useEffect, useReducer } from "react";
import { playKeyClick } from "@/features/audio";
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
        playKeyClick();
        dispatch({ type: "digit", digit: event.key as Digit });
      } else if (event.key === "." || event.key === ",") {
        playKeyClick();
        dispatch({ type: "decimal" });
      } else if (event.key === "Backspace") {
        playKeyClick();
        dispatch({ type: "backspace" });
      } else if (event.key === "Escape" || event.key === "Delete") {
        playKeyClick();
        dispatch({ type: "clear" });
      } else if (event.key === "+") {
        playKeyClick();
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
