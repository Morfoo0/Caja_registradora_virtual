import type { Cents, PaymentMethod, Sale } from "@/types";

export { DEFAULT_STORE_NAME } from "@/lib/constants";

export function paymentMethodLabel(method: PaymentMethod): string {
  return method === "cash" ? "Efectivo" : "Tarjeta";
}

const dateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Formatea la fecha/hora local de la venta. */
export function formatTicketDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return dateTimeFormatter.format(date);
}

export interface TicketLineView {
  name: string;
  quantity: number;
  unitPriceCents: Cents;
  lineTotalCents: Cents;
}

export interface TicketView {
  storeName: string;
  saleId: string;
  ticketNumber: number;
  dateTime: string;
  lines: TicketLineView[];
  subtotalCents: Cents;
  totalCents: Cents;
  paymentMethodLabel: string;
  amountPaidCents: Cents;
  changeCents: Cents;
}

/**
 * Construye la vista del ticket a partir de la venta (foto tomada al cobrar).
 * No consulta el catálogo, por lo que cambios posteriores de precios no lo afectan.
 */
export function buildTicketView(sale: Sale, storeName: string): TicketView {
  return {
    storeName,
    saleId: sale.id,
    ticketNumber: sale.ticketNumber,
    dateTime: formatTicketDate(sale.createdAt),
    lines: sale.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      lineTotalCents: item.lineTotalCents,
    })),
    subtotalCents: sale.subtotalCents,
    totalCents: sale.totalCents,
    paymentMethodLabel: paymentMethodLabel(sale.payment.method),
    amountPaidCents: sale.payment.amountPaidCents,
    changeCents: sale.payment.changeCents,
  };
}
