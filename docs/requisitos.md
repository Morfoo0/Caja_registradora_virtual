# Barbie Cashier — Análisis de Requisitos

> Documento de requisitos. Responde: **qué** se va a construir, **qué queda fuera** y **cómo** se determina que una función está terminada. Fuente de verdad: `Reglas.md`.

## 1. Requisitos funcionales y no funcionales

### Funcionales (MVP)
- **F1.** Teclado numérico: introducir números (0–9) y punto decimal para teclear importes.
- **F2.** Visor: mostrar el importe tecleado, subtotales y total.
- **F3.** Calculadora: sumar importes, acumular artículos y calcular el total sin errores de redondeo monetario.
- **F4.** Catálogo de papelería: listar productos (lápices, bolígrafos, cuadernos, borradores, colores, etc.) en tarjetas/cuadrícula.
- **F5.** Búsqueda y filtrado por categoría sobre el catálogo.
- **F6.** Carrito: añadir productos, modificar cantidades y retirarlos.
- **F7.** Totalización: subtotales por línea y total general a partir del carrito.
- **F8.** Cobro en efectivo simulado: introducir el importe recibido y calcular el cambio.
- **F9.** Ticket imprimible: nombre de la tienda, fecha, líneas, cantidades, precios y total.
- **F10.** Borrar/Reiniciar la operación en curso y cancelar una compra antes de finalizarla.

### No funcionales
- **N1.** Idioma español; moneda MXN con formato `Intl` centralizado en `lib/money.ts`.
- **N2.** Cálculos monetarios con 2 decimales y redondeo explícito (nunca flotantes crudos).
- **N3.** Interfaz responsive (teléfono y escritorio), accesibilidad básica (botones reales, `aria-label`, navegación por teclado).
- **N4.** Sin dependencias de pago, red o autenticación; sin servicios de terceros.
- **N5.** Persistencia local (LocalStorage tras una capa de abstracción) para datos entre sesiones.
- **N6.** Recursos gráficos/sonoros originales (CSS/SVG y Web Audio API), sin material protegido de Barbie.
- **N7.** Separación interfaz ↔ lógica de negocio; una única fuente de verdad del estado de una venta.
- **N8.** Desempeño fluido y peso reducido (PWA instalable).

## 2. Tipos de usuario previstos
- **Uso personal (regalo):** jugar a ser cajera; priman la nostalgia, los sonidos y lo visual.
- **Modo de juego:** operar libremente la caja sin consecuencias; equivocarse no rompe nada.
- **Operación de papelería ficticia:** uso tipo punto de venta simulado (construir compras, cobrar, imprimir ticket). No hay roles ni autenticación; es un solo perfil local.

## 3. Flujos principales
1. **Iniciar compra:** pantalla limpia, carrito vacío, visor en cero.
2. **Añadir productos:** elegir del catálogo (o buscar/filtrar) y agregar al carrito.
3. **Modificar cantidades:** aumentar/disminuir/retirar ítems; los totales se recalculan.
4. **Cobrar:** elegir efectivo (o tarjeta simulada), introducir importe, validar, calcular cambio.
5. **Emitir ticket:** al confirmar la venta, generar recibo e imprimirlo.
6. **Consultar ventas:** ver historial y detalle de ventas finalizadas (fase posterior al MVP).

## 4. Restricciones
- Funcionamiento **local** en el navegador (Windows primero; móvil si es viable).
- **Sin pagos reales** ni recopilación de datos financieros; el cobro es ficticio.
- **Sin base de datos remota**, autenticación ni servicios de terceros en la primera versión.

## 5. Decisiones pendientes de confirmación
- **D1.** Formato visual exacto del ticket (encabezado, pie, nº de ticket).
- **D2.** Moneda/cambio: ¿se simulan billetes/monedas específicas al dar el cambio? (visual vs. solo importe).
- **D3.** Inventario: ¿el stock descuenta existencias en el MVP o se deja para Fase 6?
- **D4.** Pago con tarjeta: confirmar si entra en el MVP (el documento original lo pospone) o solo efectivo.
- **D5.** Precios/catálogo inicial concreto (nombres y precios de los artículos).
- **D6.** Nombre comercial de la tienda en el ticket.
- **D7.** Dónde ubicar esta documentación (propongo `docs/requisitos.md`).

## 6. Dependencias entre fases
- **F2 (calculadora)** depende de F1 (interfaz: visor + teclado).
- **F3 (catálogo/carrito)** depende de F2 (totales) y de los tipos base (`types/`).
- **F4 (cobro)** depende de F3 (carrito/total) y de `lib/money.ts` (cambio).
- **F5 (tickets/historial)** depende de F4 (venta confirmada).
- **F6 (persistencia)** depende de F4/F5 (qué datos guardar) y de la capa de storage.
- **F7 (nostalgia: sonidos/animaciones)** independiente, se activa al final.
- **F8 (PWA)** depende de que la app sea estable (F0–F7).
- **F9 (pruebas)** es transversal; se ejecuta durante todo el desarrollo.

## 7. Criterios de aceptación (funcionalidades principales)
- **Calculadora:** importes y totales correctos, sin errores de redondeo (verificado con tests).
- **Catálogo/Carrito:** se puede construir una compra y obtener el importe correcto; cantidades y precios validados.
- **Cobro:** una venta se completa de principio a fin; el cambio es correcto; no se registra dos veces la misma venta; el carrito se vacía solo al confirmar.
- **Ticket/Historial:** cada compra completada genera un registro consultable y un recibo imprimible; no se puede modificar una venta ya cerrada.
- **Persistencia:** los datos sobreviven a cerrar/abrir la app en el mismo navegador/dispositivo.
- **PWA:** instalable, abre independiente y funciona offline en lo soportado.
- **Accesibilidad/responsive:** navegable por teclado y legible en teléfono y escritorio.

## 8. Límites de la primera versión y qué puede esperar
**Dentro del MVP:** interfaz, teclado, visor, catálogo, carrito, cálculo de total, cobro en efectivo, cálculo de cambio y ticket imprimible.

**Puede esperar (versiones posteriores):** historial persistente, inventario con descuento de existencias, sonidos avanzados, cajón de dinero, tarjeta virtual, exportación/respaldo, instalación PWA completa.

**Fuera del alcance (en esta versión):** pagos reales, autenticación/multi-usuario, base de datos remota, sincronización en la nube y servicios de terceros.
