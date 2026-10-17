import { useMemo, useState } from "react";
import { filterProducts } from "@/features/catalog";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/features/catalog/seed";

export function useCatalog() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const products = useMemo(
    () => filterProducts(DEMO_PRODUCTS, { query, categoryId }),
    [query, categoryId],
  );

  return {
    query,
    setQuery,
    categoryId,
    setCategoryId,
    categories: DEMO_CATEGORIES,
    products,
  };
}
