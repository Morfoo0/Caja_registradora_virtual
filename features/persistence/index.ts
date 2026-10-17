export { browserStorage, createBrowserStorage, MemoryStorage } from "./storage";
export type { StorageLike } from "./storage";
export { KEYS, SCHEMA_VERSION } from "./schema";
export { loadJson, migrateData, saveJson } from "./json";
export {
  isProductArray,
  isSaleArray,
  isSettings,
  isStockMovementArray,
} from "./guards";
export { loadCatalog, saveCatalog } from "./catalogRepo";
export { addSale, loadSales, saveSales } from "./salesRepo";
export { DEFAULT_SETTINGS, loadSettings, saveSettings } from "./settingsRepo";
export {
  deductForSale,
  loadMovements,
  restockProduct,
  saveMovements,
} from "./inventoryRepo";
export type { DeductReason, DeductResult } from "./inventoryRepo";
export { applyBackup, gatherBackup } from "./backupRepo";
