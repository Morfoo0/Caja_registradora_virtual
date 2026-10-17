"use client";

import { formatCents } from "@/lib/money";
import { isProductAvailable } from "@/features/catalog";
import type { Product } from "@/types";
import { useCatalog } from "./useCatalog";
import styles from "./Catalog.module.css";

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd?: (product: Product) => void;
}) {
  const available = isProductAvailable(product);

  return (
    <li className={styles.card} data-unavailable={!available || undefined}>
      <div className={styles.thumb} aria-hidden="true" />
      <div className={styles.info}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>{formatCents(product.priceCents)}</span>
      </div>
      <span className={styles.badge} data-available={available || undefined}>
        {available ? "Disponible" : "No disponible"}
      </span>
      <button
        type="button"
        className={styles.addBtn}
        disabled={!available || !onAdd}
        onClick={() => onAdd?.(product)}
      >
        Añadir
      </button>
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
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </ul>
      )}
    </section>
  );
}
