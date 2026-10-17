import { useMemo, useState, useSyncExternalStore } from "react";
import { filterProducts } from "@/features/catalog";
import { DEMO_CATEGORIES } from "@/features/catalog/seed";
import {
  getProducts,
  getServerProducts,
  restock,
  subscribeProducts,
} from "./catalogStore";

export function useCatalog() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const products = useSyncExternalStore(
    subscribeProducts,
    getProducts,
    getServerProducts,
  );

  const filtered = useMemo(
    () => filterProducts(products, { query, categoryId }),
    [products, query, categoryId],
  );

  return {
    query,
    setQuery,
    categoryId,
    setCategoryId,
    categories: DEMO_CATEGORIES,
    products: filtered,
    restock,
  };
}
