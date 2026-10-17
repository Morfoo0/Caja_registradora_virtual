"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { formatCents } from "@/lib/money";
import {
  filterSales,
  sortSalesByDate,
  summarizeByDay,
  summarizeSales,
} from "@/features/history";
import { formatTicketDate, paymentMethodLabel } from "@/features/tickets";
import type { Sale } from "@/types";
import {
  getSales,
  getServerSales,
  subscribeSales,
} from "./salesStore";
import styles from "./HistoryModal.module.css";

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function HistoryModal({ open, onClose }: HistoryModalProps) {
  const sales = useSyncExternalStore(subscribeSales, getSales, getServerSales);

  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(() => sortSalesByDate(sales), [sales]);
  const filtered = useMemo(
    () => filterSales(sorted, { query, dateFrom, dateTo }),
    [sorted, query, dateFrom, dateTo],
  );
  const summary = useMemo(() => summarizeSales(filtered), [filtered]);
  const daily = useMemo(() => summarizeByDay(filtered), [filtered]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Historial de ventas"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Historial de ventas</h2>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Cerrar historial"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className={styles.summary}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Operaciones</span>
            <span className={styles.statValue}>{summary.count}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total cobrado</span>
            <span className={styles.statValue}>
              {formatCents(summary.totalCents)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Efectivo</span>
            <span className={styles.statValue}>
              {formatCents(summary.byMethod.cash.totalCents)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Tarjeta</span>
            <span className={styles.statValue}>
              {formatCents(summary.byMethod.card.totalCents)}
            </span>
          </div>
        </div>
        <p className={styles.note}>
          El total refleja lo cobrado, no la ganancia neta (no se registran
          costos). Incluye solo ventas completadas.
        </p>

        <div className={styles.filters}>
          <input
            type="search"
            className={styles.input}
            placeholder="Buscar por id o nº de ticket"
            aria-label="Buscar venta por identificador"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <label className={styles.field}>
            Desde
            <input
              type="date"
              className={styles.input}
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
          <label className={styles.field}>
            Hasta
            <input
              type="date"
              className={styles.input}
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </label>
        </div>

        {daily.length > 0 && (
          <section className={styles.daily} aria-label="Resumen por día">
            <h3 className={styles.subtitle}>Resumen por día</h3>
            <ul className={styles.dailyList}>
              {daily.map((day) => (
                <li key={day.date} className={styles.dailyRow}>
                  <span>{day.date}</span>
                  <span>{day.count} venta(s)</span>
                  <span>{formatCents(day.totalCents)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {filtered.length === 0 ? (
          <p className={styles.empty}>
            No hay ventas para el filtro seleccionado.
          </p>
        ) : (
          <ul className={styles.list}>
            {filtered.map((sale) => (
              <li key={sale.id}>
                <button
                  type="button"
                  className={styles.row}
                  data-selected={sale.id === selectedId || undefined}
                  onClick={() =>
                    setSelectedId((prev) =>
                      prev === sale.id ? null : sale.id,
                    )
                  }
                >
                  <span className={styles.rowId}>Nº {sale.ticketNumber}</span>
                  <span className={styles.rowDate}>
                    {formatTicketDate(sale.createdAt)}
                  </span>
                  <span className={styles.rowMethod}>
                    {paymentMethodLabel(sale.payment.method)}
                  </span>
                  <span className={styles.rowTotal}>
                    {formatCents(sale.totalCents)}
                  </span>
                </button>
                {selectedId === sale.id && (
                  <SaleDetail sale={sale} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SaleDetail({ sale }: { sale: Sale }) {
  return (
    <div className={styles.detail}>
      <div className={styles.detailId}>ID {sale.id}</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cant.</th>
            <th>Producto</th>
            <th className={styles.num}>P. unit.</th>
            <th className={styles.num}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, index) => (
            <tr key={index}>
              <td>{item.quantity}</td>
              <td>{item.name}</td>
              <td className={styles.num}>{formatCents(item.unitPriceCents)}</td>
              <td className={styles.num}>{formatCents(item.lineTotalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.detailTotals}>
        <span>Total</span>
        <strong>{formatCents(sale.totalCents)}</strong>
      </div>
      {sale.payment.method === "cash" && (
        <div className={styles.detailPayment}>
          <span>Recibido {formatCents(sale.payment.amountPaidCents)}</span>
          <span>Cambio {formatCents(sale.payment.changeCents)}</span>
        </div>
      )}
    </div>
  );
}
