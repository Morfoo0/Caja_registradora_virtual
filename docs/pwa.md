# Barbie Cashier — PWA instalable

## Qué se incluye
- **Manifest** (`app/manifest.ts`): nombre, nombre corto, descripción, colores, `display: standalone` e iconos (192, 512 y 512 maskable).
- **Iconos** (`public/icons/`): PNG generados desde `app/icon.svg` con `npm run icons`. `app/icon.svg` también actúa como favicon.
- **Service Worker** (`public/sw.js`): manual, sin dependencias. Estrategia:
  - Navegación → red primero, con respaldo al shell cacheado.
  - Recursos estáticos → *stale-while-revalidate*.
  - Al instalar precachea `/` y los iconos.
- **Registro y actualizaciones** (`components/pwa/ServiceWorkerRegister.tsx`): registra el SW en producción y muestra un aviso "Nueva versión disponible" para recargar de forma controlada.

## Requisitos de instalación (navegador)
Para que un navegador permita instalar la PWA debe cumplirse, al menos:
1. **HTTPS** (o `localhost` en desarrollo).
2. Un **manifest válido** con nombre, iconos (al menos 192x192 y 512x512) y `start_url`.
3. (Chrome/Edge) un **service worker** activo con un `fetch` handler que permita funcionamiento offline básico.

> Tener el manifest **no** garantiza la instalación por sí solo. El navegador valida los requisitos anteriores.

## Desarrollo vs producción
- **Desarrollo:** el SW **no se registra** (`NODE_ENV !== "production"`). El manifest y los iconos sí se sirven, pero la instalación y el offline reales se verifican en producción.
- **Producción:** `npm run build && npm start` (servido sobre HTTPS).

## Cómo instalar
- **Chrome / Edge (escritorio):** menú ⋮ → "Instalar Barbie Cashier", o icono de instalación en la barra de direcciones.
- **Android (Chrome):** menú ⋮ → "Añadir a pantalla de inicio".
- **iOS (Safari):** botón Compartir → "Añadir a pantalla de inicio".

## Verificación local con HTTPS
```bash
npm run dev -- --experimental-https   # desarrollo con certificado local
# o, más fiable:
npm run build && npm start            # servido por un proxy/reverse HTTPS
```

## Actualizaciones
El SW espera en estado "waiting" cuando hay una versión nueva. La app muestra un aviso; al pulsar "Recargar" se activa `skipWaiting()` y la página recarga. Esto evita interrumpir una venta en curso.

## Limitaciones
- El precacheado inicial es mínimo; el offline completo se alcanza tras la **primera visita** (los *chunks* JS/CSS con hash se cachean en tiempo de ejecución).
- No se precachean *chunks* con nombre dinámico (haría falta integrar el SW con el build).
- El SW no se registra en desarrollo; las pruebas offline deben hacerse con `build` + `start`.
- Los datos (ventas, catálogo) se guardan en `localStorage` del dispositivo; el SW no los respalda.
