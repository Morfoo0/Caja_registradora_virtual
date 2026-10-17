import { browserStorage, loadSales } from "@/features/persistence";
import type { Sale } from "@/types";

let sales: Sale[] | null = null;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getSales(): Sale[] {
  if (sales === null) {
    sales = loadSales(browserStorage);
  }
  return sales;
}

export function getServerSales(): Sale[] {
  return [];
}

export function refreshSales(): void {
  sales = loadSales(browserStorage);
  emit();
}

export function subscribeSales(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
