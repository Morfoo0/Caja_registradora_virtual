"use client";

import { formatCents } from "@/lib/money";
import { isProductAvailable } from "@/features/catalog";
import { isLowStock } from "@/features/inventory";
import type { Product } from "@/types";
import { useCatalog } from "./useCatalog";
import styles from "./Catalog.module.css";

function stockLabel(product: Product): string {
  if (!product.active) {
    return "No disponible";
  }
  if (product.stock === 0) {
    return "Agotado";
  }
  if (isLowStock(product)) {
    return "Pocas piezas";
  }
  return "Disponible";
}

function ProductCard({
  product,
  onAdd,
  onRestock,
}: {
  product: Product;
  onAdd?: (product: Product) => void;
  onRestock?: (productId: string) => void;
}) {
  const available = isProductAvailable(product);
  const low = isLowStock(product);

  return (
    <li className={styles.card} data-unavailable={!available || undefined}>
      <div className={styles.thumb} aria-hidden="true" />
      <div className={styles.info}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>{formatCents(product.priceCents)}</span>
      </div>
      <span
        className={styles.badge}
        data-available={available || undefined}
        data-low={low || undefined}
      >
        {stockLabel(product)}
      </span>
      <span className={styles.stock}>Stock: {product.stock}</span>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.addBtn}
          disabled={!available || !onAdd}
          aria-label={`Añadir ${product.name} al carrito`}
          onClick={() => onAdd?.(product)}
        >
          Añadir
        </button>
        <button
          type="button"
          className={styles.restockBtn}
          aria-label={`Reponer stock de ${product.name} (acción administrativa)`}
          onClick={() => onRestock?.(product.id)}
        >
          Reponer +10
        </button>
      </div>
    </li>
  );
}

export function Catalog({
  onAdd,
}: {
  onAdd?: (product: Product) => void;
}) {
  const {
    query,
    setQuery,
    categoryId,
    setCategoryId,
    categories,
    products,
    restock,
  } = useCatalog();

  return (
    <section className={styles.catalog} aria-label="Catálogo de productos">
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder="Buscar producto…"
          aria-label="Buscar productos por nombre"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className={styles.chips} role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className={styles.chip}
            data-active={categoryId === null || undefined}
            aria-pressed={categoryId === null}
            onClick={() => setCategoryId(null)}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={styles.chip}
              data-active={categoryId === category.id || undefined}
              aria-pressed={categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.demoNote}>
        Catálogo de demostración — artículos ficticios.
      </p>

      {products.length === 0 ? (
        <p className={styles.empty}>No se encontraron productos.</p>
      ) : (
        <ul className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAdd}
              onRestock={restock}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
