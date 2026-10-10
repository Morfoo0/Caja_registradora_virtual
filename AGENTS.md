<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Barbie Cashier — Reglas del proyecto

Caja registradora virtual (PWA) con estética Barbie para una papelería virtual.

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript.
- CSS puro (sin frameworks de CSS).
- Persistencia local (LocalStorage tras una capa de abstracción en `features/persistence`).
- Web Audio API para sonidos. Arte propio en CSS/SVG (sin recursos de terceros).
- Moneda MXN, idioma español. Formato vía `Intl` centralizado en `lib/money.ts`.

## Estructura
- `app/` páginas y layout (App Router).
- `components/` UI reutilizable.
- `features/` lógica por dominio (calculator, catalog, checkout, tickets, persistence, audio).
- `lib/` utilidades (money, format, validaciones).
- `types/` tipos compartidos.
- `public/` assets, manifest y service worker.
- `tests/` pruebas.

## Método de trabajo (fase a fase)
Para cada fase:
1. Analizar objetivos y criterios de aceptación.
2. Revisar los archivos existentes antes de modificarlos.
3. Proponer un plan breve.
4. Implementar los cambios de esa fase.
5. Ejecutar las comprobaciones disponibles.
6. Corregir los errores introducidos.
7. Informar archivos modificados, pruebas realizadas y pendientes.
8. Esperar la validación del usuario antes de avanzar a la siguiente fase.

No se considera terminada una función solo porque se generó su código.

## Reglas de desarrollo
- Implementar una fase a la vez.
- Separar interfaz y lógica de negocio.
- Centralizar los cálculos monetarios en `lib/money.ts` (nunca calcular dinero en componentes).
- Validar datos y evitar ventas duplicadas.
- Ejecutar pruebas y corregir errores antes de avanzar.
- Evitar dependencias innecesarias y preservar las funciones existentes.
- Usar recursos gráficos originales o autorizados.
- No implementar pagos reales ni recopilar datos financieros.

## Comandos
- `npm run dev` — desarrollo.
- `npm run build` — build de producción.
- `npm run lint` — ESLint.
- (Pruebas con Vitest se añaden en la Fase 2.)
