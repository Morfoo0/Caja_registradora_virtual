export type Currency = "MXN";

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  categoryId: string;
  stock: number;
  barcode?: string;
  emoji?: string;
  active: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export type PaymentMethod = "cash" | "card";

export interface Payment {
  method: PaymentMethod;
  amountPaid: number;
  change: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Sale {
  id: string;
  ticketNumber: number;
  items: SaleItem[];
  subtotal: number;
  total: number;
  payment: Payment;
  createdAt: string;
}

export interface Settings {
  storeName: string;
  currency: Currency;
  taxRate: number;
  cashierName?: string;
}
