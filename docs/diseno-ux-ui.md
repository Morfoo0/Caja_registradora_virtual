# Barbie Cashier — Diseño UX/UI

> Documento de diseño. Define la identidad visual y las pantallas antes de implementar. Se apoya en `Reglas.md` (fase 1) y en `docs/investigacion-juguete.md` (modelo Trendy). Acompañado de la página de referencia visual en la ruta **`/diseno`**.

## Principios
1. **Nostalgia lúdica:** caja rosa de juguete (esquinas redondeadas, sombras "gorditas", cajón animado).
2. **Claridad de POS:** cifras legibles, estados claros, jerarquía de acciones.
3. **Usable y accesible:** contraste AA, objetivos táctiles amplios, navegación por teclado.
4. **Original:** sin logos ni frases de Barbie; arte y sonidos propios.

---

## 1. Fundamentos visuales

### 1.1 Paleta de colores
| Token | Hex | Uso |
|---|---|---|
| `--pink-50` | `#fff5fa` | fondo suave |
| `--pink-100` | `#ffd1e6` | superficies claras, chips |
| `--pink-300` | `#ff8fc4` | acentos, hover |
| `--pink-500` | `#ff5fa2` | **primario** (marca, botones) |
| `--pink-700` | `#d81b74` | primario oscuro (hover/press) |
| `--pink-900` | `#7a0d43` | texto sobre rosa claro |
| `--magenta` | `#e6007e` | acento (total, cobro) |
| `--plum-900` | `#2a1330` | texto principal |
| `--plum-600` | `#7a4a68` | texto secundario |
| `--yellow` | `#ffd84d` | botón apertura (cajón) |
| `--gold` | `#ffc93c` | "cha-ching", éxito dinero |
| `--grey` | `#b8b8c4` | pieza gris superior, bordes |
| `--green` | `#2fb46b` | éxito / cobro confirmado |
| `--red` | `#e0485a` | cancelar / error |
| `--white` | `#ffffff` | superficie |

Regla: el texto de lectura usa siempre `--plum-900` (contraste ~15:1 sobre blanco/rosa-50); el rosa se reserva para fondos, marca y controles con texto blanco (rosa-700 + blanco ≥ 4.5:1).

### 1.2 Tipografía
- Familia: pila de sistema (`Segoe UI`, system-ui) — sin fuentes externas (offline).
- Números del visor: `font-variant-numeric: tabular-nums` + `letter-spacing: 0.02em` para alineación de cifras.
- Escala:
  - `--text-xs` 12px (leyendas)
  - `--text-sm` 14px (secundario)
  - `--text-base` 16px (cuerpo)
  - `--text-lg` 18px (títulos de panel)
  - `--text-2xl` 24px (total)
  - `--text-visor` `clamp(2rem, 6vw, 3.5rem)` (visor de importe)

### 1.3 Radios y bordes
- `--radius-sm` 8px · `--radius-md` 14px · `--radius-lg` 20px · `--radius-xl` 28px · `--radius-pill` 999px.
- Bordes: 2px sólidos (definición de "juguete"); contornos suaves, no esquinas rectas.

### 1.4 Sombras
- `--shadow-soft` `0 2px 8px rgba(42,19,48,.08)` (tarjetas).
- `--shadow-card` `0 6px 20px rgba(216,27,116,.12)` (paneles).
- `--shadow-key` `0 4px 0 var(--pink-700)` (botones 3D de tecla).
- `--shadow-key-pressed` `0 1px 0 var(--pink-700)` (estado presionado).

### 1.5 Estados de interacción
- **Hover:** fondo se oscurece/clarifica un paso (ej. `pink-500 → pink-700`).
- **Active/presionado:** `translateY(2px)` + sombra reducida (efecto tecla).
- **Focus-visible:** contorno de 3px `--magenta` con offset 2px (siempre visible, no solo hover).
- **Disabled:** `opacity .45`, `cursor: not-allowed`, sin efecto de press.
- **Seleccionado:** fondo `--pink-100` + borde `--pink-700`.
- **En curso (loading):** animación de puntos/ruleta en el panel; botones bloqueados.

---

## 2. Distribución de la pantalla principal

Tres zonas + barra superior:

```
┌─────────────────────────────────────────────┐
│ HEADER: ♥ Barbie Cashier   [Historial] [Ajustes] │
├───────────────────────────┬─────────────────┤
│ CATÁLOGO                  │ CARRITO         │
│ [búsqueda][categorías]    │  ─ líneas ─     │
│ [grid de productos]       │  Subtotal       │
│                           │  Total          │
├───────────────────────────┴─────────────────┤
│ REGISTER: [VISOR] [teclado] [Borrar/Total/Cobrar/Cancelar] │
│                 [cajón de dinero animado]   │
└─────────────────────────────────────────────┘
```

- **Header** (alto ~56px): nombre de tienda a la izquierda; a la derecha accesos a historial y configuración.
- **Main** (flexible, ocupa el espacio): catálogo a la izquierda, carrito a la derecha (~360px fijo en desktop).
- **Register** (barra inferior, fija o al final del flujo): visor + teclado + acciones; el cajón se desliza bajo ella al abrirse.

---

## 3. Visor del importe y teclado numérico

### Visor
- Panel estilo LCD: fondo `--pink-100` o blanco, texto `--plum-900` en `--text-visor`, cifras tabulares.
- Muestra el importe tecleado o, en modo venta, el subtotal/total.
- Leyenda superior pequeña ("Total" / "Importe") y un indicador de modo (Compra en curso / Finalizada).
- Estado de error: cifra en `--red` con mensaje breve debajo.

### Teclado
- Distribución 3×4 + columna de funciones:
  ```
  7 8 9        [Borrar C]
  4 5 6        [Total]
  1 2 3        [Cobrar]
  0 · (00)     [Cancelar]
  ```
- Teclas numéricas: grandes (mín. 56×56px), fondo blanco con `--shadow-key`, borde rosa.
- `·` (punto decimal) y tecla opcional `00` para agilizar.
- Columna de funciones con colores semánticos: **Total** (magenta), **Cobrar** (verde), **Cancelar** (rojo), **Borrar C** (gris/amarillo).

---

## 4. Catálogo, búsqueda y categorías

- **Búsqueda:** campo con placeholder "Buscar producto…", borde rosa, icono de lupa (SVG propio).
- **Categorías:** chips horizontales (Todos, Lápices, Plumas, Cuadernos, Escolares, etc.); el chip activo usa `--pink-100` + borde `--pink-700`.
- **Cuadrícula de productos:** tarjetas con emoji/icono propio, nombre, precio y botón "Añadir". Mínimo 2 columnas en móvil; de 3 a 5 en desktop.
- Tarjeta presionada muestra un "flash" de añadido al carrito.

## 5. Carrito de compra y resumen de importes

- Lista de líneas: nombre, precio unitario, control de cantidad `− n +`, subtotal de línea y botón de quitar (✕).
- Estados: línea en edición resaltada; línea recién añadida con animación de entrada.
- Resumen inferior: **Subtotal** y **Total** (destacado, `--text-2xl`), seguido del botón principal **Cobrar**.
- Carrito vacío: ilustración/emoji propio + "El carrito está vacío".

## 6. Acciones principales
- **Borrar (C):** limpia la última entrada / el importe tecleado. Segunda pulsación (o mantener) reinicia.
- **Total:** pasa de teclado libre a modo venta, congela el importe y muestra el total.
- **Cobrar:** abre el panel de cobro (efectivo/tarjeta).
- **Cancelar:** aborta la operación en curso con confirmación ("¿Cancelar la venta?").

## 7. Paneles secundarios (modales/hojas)
- **Cobro:** selección de método (Efectivo / Tarjeta), entrada del importe recibido, cálculo de cambio, botones "Confirmar" y "Cancelar".
- **Ticket:** recibo enmarcado (tienda, fecha, nº de ticket, líneas, total) con botón "Imprimir" y "Nueva venta".
- **Historial:** lista de ventas (fecha, total, nº ticket) → detalle al tocar.
- **Configuración:** nombre de tienda, moneda (fija MXN), sonido on/off, borrar datos (con confirmación).
- Todos como hojas centradas en móvil / modales centrados en desktop, con cierre por ✕, tecla `Esc` y fondo oscurecido.

## 8. Estados vacíos, error, confirmación y en curso
- **Vacío:** carrito vacío, historial sin ventas, catálogo sin resultados → texto claro + ilustración propia.
- **Error:** importe insuficiente para el cambio, cantidad inválida → mensaje breve en `--red` junto al campo.
- **Confirmación:** diálogo "¿Cancelar la venta?" / "¿Borrar datos?" con acciones destructivas en rojo.
- **En curso:** cobro "procesando…" con animación; botones deshabilitados hasta resolver.

## 9. Responsive (breakpoints)
- **Móvil (<768px):** pestañas **Catálogo / Carrito** en el main; register fija abajo (visor + teclado compacto + acciones). El cajón ocupa ancho completo.
- **Tablet (768–1023px):** main en 2 columnas más estrechas; register inferior completa.
- **Escritorio (≥1024px):** todo visible sin pestañas; carrito ~360px a la derecha.
- Regla general: sin desbordes horizontales; objetivos táctiles ≥ 44px en pantallas táctiles.

## 10. Accesibilidad visual
- **Contraste:** AA (texto ≥ 4.5:1, elementos grandes ≥ 3:1). Texto siempre `--plum-900`; rosa solo como fondo/acento.
- **Tamaño de botones:** mínimo 44×44px; teclas del teclado ≥ 56px.
- **Foco:** anillo visible `--magenta` en todo elemento interactivo; orden de tabulación lógico (catálogo → carrito → teclado → acciones).
- **Teclado:** todas las acciones accesibles por teclado; `Esc` cierra paneles; `aria-label` en iconos; estados no dependen solo del color (se acompañan de icono/texto).
- **Reducción de movimiento:** respetar `prefers-reduced-motion` (desactivar animaciones decorativas).

---

## Pendiente de confirmación
- **P1.** ¿El teclado incluye tecla `00` además de `·`?
- **P2.** ¿El visor muestra importe tecleado y subtotal simultáneamente, o alterna?
- **P3.** Nombre de tienda por defecto en header/ticket (hoy: "Barbie Cashier").
