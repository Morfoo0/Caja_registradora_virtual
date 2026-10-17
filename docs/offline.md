# Barbie Cashier — Funcionamiento sin conexión

## Por qué funciona offline
La app es **100 % local**: toda la lógica de negocio corre en el cliente y los datos
(catálogo, ventas, movimientos de inventario y configuración) se guardan en
`localStorage` del navegador. No hay peticiones de datos al servidor ni API remota.

El **service worker** (`public/sw.js`) precachea el *shell* (`/`) y los iconos, y en
tiempo de ejecución cachea los *chunks* estáticos (JS/CSS con hash). Tras la primera
visita, una recarga sin conexión sirve el shell y los *chunks* desde caché.

## Funciones disponibles sin conexión
| Función | ¿Offline? | Notas |
|---|---|---|
| Abrir la aplicación | Sí | Requiere haberla cargado al menos una vez (recursos ya cacheados). |
| Catálogo local | Sí | Catálogo en `localStorage`. |
| Crear/calcular compras | Sí | Lógica en cliente. |
| Cobro ficticio (efectivo/tarjeta) | Sí | Simulado, sin red. |
| Registro local de ventas | Sí | `localStorage`. |
| Historial de ventas | Sí | `localStorage`. |
| Tickets | Sí | Se generan desde la venta en memoria/local. |
| Sonidos y animaciones | Sí | Web Audio / CSS, sin red. |

**Ninguna función de la app requiere conexión.** Si el navegador está sin conexión,
se muestra un aviso ("Sin conexión — los cambios se guardan en este dispositivo") para
evitar confusión; los datos no se pierden ni dejan de guardarse.

## Aislamiento de datos
- `localStorage` es **por origen y por dispositivo**: no sincroniza entre equipos ni
  navegadores. Un respaldo solo existe si el usuario exporta y guarda el archivo
  (ver `docs/` de respaldo).
- El service worker cachea **solo recursos estáticos** (HTML/JS/CSS/iconos), nunca
  datos de usuario (ventas/catálogo), por lo que no expone datos entre sesiones.

## Actualizaciones y vuelta a la conexión
- Al volver a estar online, una recarga o navegación revalida la página (el SW usa
  **red primero** para navegaciones y *stale-while-revalidate* para estáticos), de modo
  que se obtiene la versión más reciente sin borrar el caché antiguo manualmente.
- El SW **no** se auto-actualiza: cuando hay una versión nueva espera en estado
  "waiting" y la app muestra "Nueva versión disponible" con un botón "Recargar". Esto
  evita interrumpir una venta en curso.
- La versión de caché (`VERSION` en `sw.js`) debe incrementarse cuando cambie la
  estrategia de caché; las cachés antiguas se limpian en `activate`.
- Los *chunks* con hash garantizan que el shell cacheado y sus scripts sean siempre
  de la misma versión (no se mezclan versiones incompatibles).

## Cómo probar (entorno realista)
1. `npm run build && npm start` (build de producción; el SW se registra solo en producción).
2. Abre `http://localhost:3000`, navega y realiza una venta (los recursos se cachean).
3. DevTools → **Network → Offline** (o desconecta la red).
4. Recarga la página: la app abre desde caché, el catálogo y las ventas siguen disponibles.
5. Crea una venta sin conexión: se guarda en `localStorage`.
6. Vuelve a **Online** y recarga: la app revalida y los datos locales persisten.

## Limitaciones
- El primer acceso **requiere conexión** para descargar los recursos (el precacheado
  inicial no incluye todos los *chunks* con hash; se cachean al visitar la app).
- El SW no respalda datos (los datos viven en `localStorage`); la copia de seguridad
  real depende de la exportación manual (fase de respaldo).
- El modo de desarrollo (`next dev`) no registra el SW; usa build + start para probar.
