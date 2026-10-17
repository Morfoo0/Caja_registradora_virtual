export {
  LOW_STOCK_THRESHOLD,
  buildRestock,
  buildSaleDeduction,
  canFulfill,
  currentStockFromMovements,
  isLowStock,
  isStockQuantity,
} from "./inventory";
export type { FulfillableItem, StockChangeResult } from "./inventory";
