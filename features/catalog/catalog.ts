import type { Product } from "@/types";

/** Un producto está disponible si está activo y tiene existencias. */
export function isProductAvailable(product: Product): boolean {
  return product.active && product.stock > 0;
}

/** Normaliza texto para búsqueda: sin acentos, en minúsculas y sin espacios. */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export interface CatalogFilter {
  query?: string;
  categoryId?: string | null;
}

/** Filtra el catálogo por nombre (búsqueda) y por categoría. */
export function filterProducts(
  products: readonly Product[],
  filter: CatalogFilter = {},
): Product[] {
  const query = normalizeSearch(filter.query ?? "");
  const categoryId = filter.categoryId ?? null;

  return products.filter((product) => {
    if (categoryId && product.categoryId !== categoryId) {
      return false;
    }
    if (query && !normalizeSearch(product.name).includes(query)) {
      return false;
    }
    return true;
  });
}

export interface ProductInput {
  name: string;
  priceCents: number;
  categoryId: string;
  stock: number;
  unit: string;
}

export interface ProductValidation {
  valid: boolean;
  errors: string[];
}

/** Valida los datos de un producto antes de usarlos. */
export function validateProduct(input: ProductInput): ProductValidation {
  const errors: string[] = [];

  if (!input.name.trim()) {
    errors.push("El nombre es obligatorio.");
  }
  if (!Number.isInteger(input.priceCents) || input.priceCents < 0) {
    errors.push("El precio debe ser un entero no negativo en centavos.");
  }
  if (!input.categoryId.trim()) {
    errors.push("La categoría es obligatoria.");
  }
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    errors.push("Las existencias deben ser un entero no negativo.");
  }
  if (!input.unit.trim()) {
    errors.push("La unidad de venta es obligatoria.");
  }

  return { valid: errors.length === 0, errors };
}
