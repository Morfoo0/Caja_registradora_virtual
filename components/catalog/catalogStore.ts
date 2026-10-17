import { DEMO_PRODUCTS } from "@/features/catalog/seed";
import {
  browserStorage,
  deductForSale,
  loadCatalog,
  restockProduct,
} from "@/features/persistence";
import type { Product, Sale } from "@/types";

let products: Product[] = DEMO_PRODUCTS;
let hydrated = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function hydrateIfNeeded() {
  if (!hydrated) {
    const stored = loadCatalog(browserStorage);
    if (stored) {
      products = stored;
    }
    hydrated = true;
  }
}

export function getProducts(): Product[] {
  hydrateIfNeeded();
  return products;
}

export function getServerProducts(): Product[] {
  return DEMO_PRODUCTS;
}

export function subscribeProducts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setProducts(next: Product[]) {
  products = next;
  emit();
}

/** Recarga el catálogo desde el almacenamiento (p. ej. tras restaurar). */
export function refreshCatalog() {
  const stored = loadCatalog(browserStorage);
  products = stored ?? DEMO_PRODUCTS;
  hydrated = true;
  emit();
}

/** Acción administrativa de reposición (+10 por defecto). */
export function restock(productId: string, quantity = 10) {
  const next = restockProduct(browserStorage, productId, quantity);
  if (next) {
    setProducts(next);
  }
}

/** Descuenta existencias al confirmar una venta (idempotente). */
export function applySaleDeduction(sale: Sale, inventoryControl = true) {
  const result = deductForSale(browserStorage, sale, inventoryControl);
  if (result.applied && result.products) {
    setProducts(result.products);
  }
}
