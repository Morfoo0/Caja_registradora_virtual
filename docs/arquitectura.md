# Barbie Cashier — Arquitectura y estructura

> Decisiones de arquitectura. Define responsabilidades, separación lógica/React, estado, dinero, persistencia, client/server, nombres e imports. Se apoya en `Reglas.md`, `docs/requisitos.md` y `docs/diseno-ux-ui.md`.

## Principios
- Separación interfaz ↔ lógica de negocio.
- Una única fuente de verdad del estado de una venta.
- Cálculo monetario en centavos enteros (sin punto flotante).
- Persistencia local aislada tras una interfaz.
- Dependencias en un solo sentido: `app → components → features → lib/types`.

## Árbol del proyecto
```
app/            páginas, layouts, estilos globales (Server Components y shells)
components/     UI reutilizable + "glue" React (hooks co-localizados)
features/       lógica pura por dominio (sin React)
lib/            utilidades compartidas (money, ids, validate)
types/          tipos de dominio compartidos
public/         iconos, manifest, service worker, assets autorizados
tests/          pruebas de integración (unitarias co-localizadas)
docs/           documentación del proyecto
```

## 1. Modelos de dominio
- **`types/` (compartidos):** `Cents`, `Currency`, `Category`, `Product`, `CartItem`, `Payment`, `PaymentMethod`, `SaleItem`, `Sale`, `Settings`.
- **Co-localizados (internos de un feature):** p. ej. `CalculatorState` en `features/calculator/`, claves de storage en `features/persistence/`.
- Regla: si un tipo lo consumen 2+ dominios o la UI → `types/`; si es interno → co-localizado.

## 2. Separación lógica ↔ React
- `features/` = TypeScript puro (sin React/JSX/hooks): `calculator`, `cart`, `checkout`, `sale`, `catalog`, `tickets`, `persistence`, `audio`.
- `components/` = React (vista y orquestación) con hooks `useX.ts` co-localizados.
- `lib/` = utilidades sin dominio.
- La lógica se prueba con Vitest sin montar React.

## 3. Estado de la venta actual
- Reducer puro `features/sale/saleReducer.ts` (acciones `ADD_ITEM`, `SET_QUANTITY`, `REMOVE_ITEM`, `INPUT_DIGIT`, `TOTAL`, `START_CHECKOUT`, `COMPLETE`, `CANCEL`), compuesto con helpers de `cart`/`checkout`.
- `components/sale/SaleProvider.tsx` (`'use client'`, Context + `useReducer`) es el único dueño del estado; los hijos lo leen por contexto.

## 4. Dinero en centavos enteros
- Canonical: `Cents` (branded) en `types/`. Campos `*Cents` en `Product`, `CartItem`, `Sale`, `Payment`.
- `lib/money.ts`: `toCents`, `fromCents`, `formatCents` (Intl `es-MX`/`MXN`), `parseToCents`, `lineTotalCents`, `subtotalCents`, `changeCents`.
- Flotantes solo en el borde (parseo de entrada y display); toda la aritmética es entera.

## 5. Aislamiento de persistencia
- `features/persistence/`: interfaz `Storage` (`getItem/setItem/removeItem`) + `LocalStorageStorage` + repositorios tipados (`salesRepo`, `settingsRepo`, `catalogRepo`) y claves con namespace/versión.
- Los componentes nunca acceden a `localStorage` directamente.

## 6. Client vs Server Components
- **Server:** `app/layout.tsx`, `app/page.tsx` (shell + metadata), `app/diseno/*`.
- **Client (`'use client'`):** `CashRegister` y todo lo interactivo (`Display`, `Keypad`, `ProductGrid`, `CartPanel`, modales Cobro/Ticket/Historial/Config), `SaleProvider`, `components/ui/*`.
- `app/page.tsx` renderiza un único `<CashRegister />` cliente (app local: LocalStorage + Web Audio, sin datos de servidor).

## 7. Convenciones de nombres e importaciones
- Componentes `PascalCase.tsx` + `PascalCase.module.css` co-localizados; hooks `usePascalCase.ts`; módulos puros `camelCase.ts`; API pública de cada feature vía `index.ts` (export nombrado).
- Import con alias `@/` entre dominios top-level; `./` solo dentro de la misma carpeta.
- Dependencias: `lib`/`types` son hojas (no importan código propio); `features` importa `lib`/`types`; `components` importa `features`/`lib`/`types`; `app` importa `components`.

## Pruebas
- Unitarias co-localizadas junto al código (`*.test.ts`) con Vitest.
- Integración en `tests/`.
- (Vitest se configura al arrancar la primera fase con lógica que probar.)

## Decisiones adoptadas
- Tipo monetario: `Cents` branded (`number & { readonly [brand]: "cents" }`).
- Refactor de `lib/money.ts` y `types/index.ts` a centavos aplicado en esta fase.
- Test unitario co-localizado; integración en `tests/`.
