import { buildBackup } from "@/features/backup";
import type { BackupFile } from "@/features/backup";
import { loadCatalog, saveCatalog } from "./catalogRepo";
import { loadMovements, saveMovements } from "./inventoryRepo";
import { loadSales, saveSales } from "./salesRepo";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "./settingsRepo";
import { browserStorage, type StorageLike } from "./storage";

/** Reúne todos los datos persistidos en un respaldo versionado. */
export function gatherBackup(storage: StorageLike = browserStorage): BackupFile {
  return buildBackup({
    catalog: loadCatalog(storage) ?? [],
    settings: loadSettings(storage) ?? DEFAULT_SETTINGS,
    sales: loadSales(storage),
    movements: loadMovements(storage),
  });
}

/** Sobrescribe los datos locales con los de un respaldo ya validado. */
export function applyBackup(
  storage: StorageLike = browserStorage,
  backup: BackupFile,
): void {
  saveCatalog(storage, backup.data.catalog);
  saveSettings(storage, backup.data.settings);
  saveSales(storage, backup.data.sales);
  saveMovements(storage, backup.data.movements);
}
