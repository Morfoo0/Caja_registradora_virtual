declare const centsBrand: unique symbol;

/** Importes monetarios en centavos enteros (MXN). Evita aritmética de punto flotante. */
export type Cents = number & { readonly [centsBrand]: "cents" };

export type Currency = "MXN";

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  /** Identificador estable del producto. */
  id: string;
  /** Código legible (no es el identificador). */
  sku: string;
  name: string;
  priceCents: Cents;
  categoryId: string;
  /** Unidad de venta ("pieza", "caja", "hoja", ...). */
  unit: string;
  /** Existencias básicas (el inventario avanzado llega en fases posteriores). */
  stock: number;
  /** Disponibilidad: si está `false`, el producto no se vende aunque tenga stock. */
  active: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  unitPriceCents: Cents;
  quantity: number;
}

export type PaymentMethod = "cash" | "card";

export interface Payment {
  method: PaymentMethod;
  amountPaidCents: Cents;
  changeCents: Cents;
}

export interface SaleItem {
  productId: string;
  name: string;
  unitPriceCents: Cents;
  quantity: number;
  lineTotalCents: Cents;
}

export interface Sale {
  id: string;
  ticketNumber: number;
  items: SaleItem[];
  subtotalCents: Cents;
  totalCents: Cents;
  payment: Payment;
  createdAt: string;
}

export interface Settings {
  storeName: string;
  currency: Currency;
  taxRate: number;
  cashierName?: string;
}
