import { toCents } from "@/lib/money";
import type { Category, Product } from "@/types";

/**
 * Catálogo de demostración (ficticio).
 * Los artículos son genéricos y no corresponden a una tienda real.
 */

export const DEMO_CATEGORIES: Category[] = [
  { id: "lapices", name: "Lápices" },
  { id: "boligrafos", name: "Bolígrafos" },
  { id: "cuadernos", name: "Cuadernos" },
  { id: "borradores", name: "Borradores" },
  { id: "reglas", name: "Reglas" },
  { id: "colores", name: "Colores" },
  { id: "hojas", name: "Hojas" },
];

export const DEMO_PRODUCTS: Product[] = [
  { id: "p-lapiz-hb", sku: "LAP-001", name: "Lápiz HB", priceCents: toCents(8), categoryId: "lapices", unit: "pieza", stock: 50, active: true },
  { id: "p-lapiz-2b", sku: "LAP-002", name: "Lápiz 2B", priceCents: toCents(9), categoryId: "lapices", unit: "pieza", stock: 45, active: true },
  { id: "p-boli-azul", sku: "BOL-001", name: "Bolígrafo azul", priceCents: toCents(15), categoryId: "boligrafos", unit: "pieza", stock: 60, active: true },
  { id: "p-boli-negro", sku: "BOL-002", name: "Bolígrafo negro", priceCents: toCents(15), categoryId: "boligrafos", unit: "pieza", stock: 0, active: true },
  { id: "p-cuad-100", sku: "CUA-001", name: "Cuaderno profesional 100 hojas", priceCents: toCents(42.5), categoryId: "cuadernos", unit: "pieza", stock: 25, active: true },
  { id: "p-cuad-chico", sku: "CUA-002", name: "Cuaderno chico 50 hojas", priceCents: toCents(22), categoryId: "cuadernos", unit: "pieza", stock: 30, active: true },
  { id: "p-borra-blanco", sku: "BOR-001", name: "Borrador blanco", priceCents: toCents(6), categoryId: "borradores", unit: "pieza", stock: 80, active: true },
  { id: "p-borra-miga", sku: "BOR-002", name: "Borrador de migajón", priceCents: toCents(10), categoryId: "borradores", unit: "pieza", stock: 15, active: false },
  { id: "p-regla-30", sku: "REG-001", name: "Regla 30 cm", priceCents: toCents(18), categoryId: "reglas", unit: "pieza", stock: 20, active: true },
  { id: "p-escuadra", sku: "REG-002", name: "Escuadra", priceCents: toCents(16), categoryId: "reglas", unit: "pieza", stock: 18, active: true },
  { id: "p-colores-12", sku: "COL-001", name: "Caja de colores 12", priceCents: toCents(65), categoryId: "colores", unit: "caja", stock: 12, active: true },
  { id: "p-hojas-carta", sku: "HOJ-001", name: "Hojas blancas tamaño carta", priceCents: toCents(1), categoryId: "hojas", unit: "hoja", stock: 500, active: true },
];
