/**
 * Versión del esquema de datos persistido.
 * Al cambiar la estructura de lo guardado, incrementa este número y añade la
 * migración correspondiente en `json.ts`.
 */
export const SCHEMA_VERSION = 1;

/** Claves de almacenamiento (con prefijo de versión). */
export const KEYS = {
  catalog: "barbie-cashier:catalog:v1",
  sales: "barbie-cashier:sales:v1",
  settings: "barbie-cashier:settings:v1",
  movements: "barbie-cashier:movements:v1",
} as const;
