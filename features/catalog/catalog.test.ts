import { describe, expect, it } from "vitest";
import { toCents } from "@/lib/money";
import {
  filterProducts,
  isProductAvailable,
  normalizeSearch,
  validateProduct,
} from "./catalog";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "./seed";

describe("filtrado del catálogo", () => {
  it("devuelve todos los productos sin filtro", () => {
    expect(filterProducts(DEMO_PRODUCTS)).toHaveLength(DEMO_PRODUCTS.length);
  });

  it("busca por nombre sin distinguir mayúsculas ni acentos", () => {
    const results = filterProducts(DEMO_PRODUCTS, { query: "lapiz" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => normalizeSearch(p.name).includes("lapiz"))).toBe(
      true,
    );
  });

  it("filtra por categoría", () => {
    const results = filterProducts(DEMO_PRODUCTS, { categoryId: "cuadernos" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.categoryId === "cuadernos")).toBe(true);
  });

  it("combina búsqueda y categoría", () => {
    const results = filterProducts(DEMO_PRODUCTS, {
      query: "chico",
      categoryId: "cuadernos",
    });
    expect(results.map((p) => p.id)).toEqual(["p-cuad-chico"]);
  });

  it("normaliza la búsqueda (acentos)", () => {
    expect(normalizeSearch("Lápiz")).toBe("lapiz");
  });
});

describe("disponibilidad", () => {
  it("está disponible solo si está activo y tiene stock", () => {
    const disponible = DEMO_PRODUCTS.find((p) => p.id === "p-lapiz-hb")!;
    const agotado = DEMO_PRODUCTS.find((p) => p.id === "p-boli-negro")!;
    const inactivo = DEMO_PRODUCTS.find((p) => p.id === "p-borra-miga")!;

    expect(isProductAvailable(disponible)).toBe(true);
    expect(isProductAvailable(agotado)).toBe(false);
    expect(isProductAvailable(inactivo)).toBe(false);
  });
});

describe("validación de datos", () => {
  it("acepta un producto válido", () => {
    const result = validateProduct({
      name: "Lápiz",
      priceCents: 800,
      categoryId: "lapices",
      stock: 10,
      unit: "pieza",
    });
    expect(result.valid).toBe(true);
  });

  it("rechaza nombre vacío, precio inválido y categoría vacía", () => {
    const result = validateProduct({
      name: " ",
      priceCents: -1,
      categoryId: "",
      stock: 1,
      unit: "pieza",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("rechaza precio con decimales (no entero en centavos)", () => {
    const result = validateProduct({
      name: "Lápiz",
      priceCents: 12.5,
      categoryId: "lapices",
      stock: 1,
      unit: "pieza",
    });
    expect(result.valid).toBe(false);
  });

  it("rechaza existencias negativas o no enteras", () => {
    const result = validateProduct({
      name: "Lápiz",
      priceCents: 800,
      categoryId: "lapices",
      stock: -2,
      unit: "pieza",
    });
    expect(result.valid).toBe(false);
  });

  it("rechaza unidad de venta vacía", () => {
    const result = validateProduct({
      name: "Lápiz",
      priceCents: 800,
      categoryId: "lapices",
      stock: 1,
      unit: "",
    });
    expect(result.valid).toBe(false);
  });
});

describe("datos de demostración", () => {
  it("tiene identificadores estables y únicos", () => {
    const ids = DEMO_PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);

    const skus = DEMO_PRODUCTS.map((p) => p.sku);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("todos los productos son válidos y usan centavos enteros", () => {
    for (const product of DEMO_PRODUCTS) {
      const result = validateProduct(product);
      expect(result.errors).toEqual([]);
      expect(Number.isInteger(product.priceCents)).toBe(true);
      expect(product.priceCents).toBeGreaterThanOrEqual(0);
    }
  });

  it("todas las categorías referenciadas existen", () => {
    const categoryIds = new Set(DEMO_CATEGORIES.map((c) => c.id));
    for (const product of DEMO_PRODUCTS) {
      expect(categoryIds.has(product.categoryId)).toBe(true);
    }
  });

  it("tiene precios en centavos esperados", () => {
    const lapiz = DEMO_PRODUCTS.find((p) => p.id === "p-lapiz-hb")!;
    expect(lapiz.priceCents).toBe(toCents(8));
  });
});
