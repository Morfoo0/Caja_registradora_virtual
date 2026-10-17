import { formatCents } from "@/lib/money";
import { buildTicketView } from "@/features/tickets";
import type { Sale } from "@/types";
import styles from "./Ticket.module.css";

export function Ticket({
  sale,
  storeName,
}: {
  sale: Sale | null;
  storeName: string;
}) {
  if (!sale) {
    return <p className={styles.empty}>No hay una venta que imprimir.</p>;
  }

  const view = buildTicketView(sale, storeName);
  const isCash = sale.payment.method === "cash";

  return (
    <div className={`${styles.ticket} ticket-print`}>
      <header className={styles.header}>
        <span className={styles.store}>{view.storeName}</span>
        <span className={styles.tagline}>Ticket de venta</span>
      </header>

      <div className={styles.meta}>
        <span>Nº {view.ticketNumber}</span>
        <span>{view.dateTime}</span>
      </div>
      <div className={styles.saleId}>ID {view.saleId}</div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.colQty}>Cant.</th>
            <th scope="col">Producto</th>
            <th scope="col" className={styles.colNum}>P. unit.</th>
            <th scope="col" className={styles.colNum}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {view.lines.map((line, index) => (
            <tr key={index}>
              <td className={styles.colQty}>{line.quantity}</td>
              <td>{line.name}</td>
              <td className={styles.colNum}>
                {formatCents(line.unitPriceCents)}
              </td>
              <td className={styles.colNum}>
                {formatCents(line.lineTotalCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.totals}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>{formatCents(view.subtotalCents)}</span>
        </div>
        <div className={styles.rowStrong}>
          <span>Total</span>
          <span>{formatCents(view.totalCents)}</span>
        </div>
      </div>

      <div className={styles.payment}>
        <div className={styles.row}>
          <span>Pago</span>
          <span>{view.paymentMethodLabel}</span>
        </div>
        {isCash && (
          <>
            <div className={styles.row}>
              <span>Recibido</span>
              <span>{formatCents(view.amountPaidCents)}</span>
            </div>
            <div className={styles.row}>
              <span>Cambio</span>
              <span>{formatCents(view.changeCents)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
