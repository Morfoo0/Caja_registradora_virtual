import { formatCents } from "@/lib/money";
import { cartLineTotal } from "@/features/cart";
import type { CartItem } from "@/types";
import type { CartState } from "./useCart";
import styles from "./CartPanel.module.css";

function CartLine({
  item,
  onInc,
  onDec,
  onRemove,
}: {
  item: CartItem;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  return (
    <li className={styles.line}>
      <div className={styles.lineMain}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.unitPrice}>
          {formatCents(item.unitPriceCents)} / pieza
        </span>
      </div>
      <div className={styles.controls}>
        <span className={styles.stepper}>
          <button
            type="button"
            className={styles.stepBtn}
            aria-label={`Disminuir cantidad de ${item.name}`}
            onClick={onDec}
          >
            −
          </button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            type="button"
            className={styles.stepBtn}
            aria-label={`Aumentar cantidad de ${item.name}`}
            onClick={onInc}
          >
            +
          </button>
        </span>
        <span className={styles.lineTotal}>
          {formatCents(cartLineTotal(item))}
        </span>
        <button
          type="button"
          className={styles.removeBtn}
          aria-label={`Eliminar ${item.name}`}
          onClick={onRemove}
        >
          ✕
        </button>
      </div>
    </li>
  );
}

export function CartPanel({
  cart,
  onCheckout,
}: {
  cart: CartState;
  onCheckout?: () => void;
}) {
  const { items, subtotalCents, totalCents, count, inc, dec, remove, clear } =
    cart;

  return (
    <section className={styles.panel} aria-label="Carrito de compra">
      <header className={styles.header}>
        <h2 className={styles.title}>Carrito</h2>
        {count > 0 ? (
          <span className={styles.inProgress}>Compra en curso · {count}</span>
        ) : (
          <span className={styles.inProgress}>Sin artículos</span>
        )}
      </header>

      {items.length === 0 ? (
        <p className={styles.empty}>El carrito está vacío.</p>
      ) : (
        <>
          <ul className={styles.list}>
            {items.map((item) => (
              <CartLine
                key={item.productId}
                item={item}
                onInc={() => inc(item.productId)}
                onDec={() => dec(item.productId)}
                onRemove={() => remove(item.productId)}
              />
            ))}
          </ul>

          <footer className={styles.summary}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>{formatCents(subtotalCents)}</span>
            </div>
            <div className={styles.rowStrong}>
              <span>Total</span>
              <span>{formatCents(totalCents)}</span>
            </div>
            <button type="button" className={styles.payBtn} onClick={onCheckout}>
              Cobrar
            </button>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clear}
            >
              Vaciar carrito
            </button>
          </footer>
        </>
      )}
    </section>
  );
}
