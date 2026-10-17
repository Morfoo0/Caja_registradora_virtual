# Proyecto: Barbie Cashier — Caja Registradora Virtual

## 1. Contexto y propósito

Desarrollar una aplicación web instalable que recree digitalmente la experiencia de jugar con una caja registradora de Barbie y, al mismo tiempo, funcione como un sistema de punto de venta inspirado en los programas de cobro utilizados en papelerías reales.

El proyecto nace como un regalo personal para alguien que disfrutaba jugar a la cajera cuando era niña y que conserva el interés por las cajas registradoras y los sistemas digitales de cobro. La aplicación debe recuperar esa experiencia nostálgica, permitiéndole jugar nuevamente, pero con funciones más completas y realistas.

La referencia visual principal es una caja registradora de juguete Barbie de color rosa, con teclado numérico, pantalla, cajón de dinero, lector de tarjetas y sonidos de cobro.

El objetivo no es construir un sistema empresarial complejo desde el principio, sino desarrollar progresivamente una aplicación funcional, agradable, nostálgica y fácil de utilizar.

## 2. Objetivo general

Crear una Progressive Web App (PWA) instalable que combine una caja registradora inspirada en Barbie con un sistema de punto de venta para una papelería virtual.

La aplicación deberá funcionar inicialmente en una computadora con Windows, desde el navegador y posteriormente como aplicación instalable. Se buscará ofrecer compatibilidad con dispositivos móviles cuando sea viable.

## 3. Tecnologías

- Next.js con App Router.
- TypeScript.
- React.
- CSS para el diseño visual y las animaciones.
- LocalStorage o IndexedDB para persistencia local, según las necesidades de cada módulo.
- Web Audio API para sonidos generados por la aplicación.
- Manifest y Service Worker para las capacidades de instalación y funcionamiento offline.
- npm para la gestión de dependencias.
- Visual Studio Code como entorno de desarrollo.
- Git para el control de versiones.

No incorporar una base de datos remota, autenticación, pagos reales ni servicios de terceros durante la primera versión, salvo que posteriormente exista una necesidad justificada.

## 4. Plan de desarrollo por fases

### Fase 0. Preparación del entorno

Objetivo: establecer una base de desarrollo estable.

Actividades:

1. Comprobar la instalación de Node.js y npm.
2. Crear el proyecto con Next.js, TypeScript y App Router.
3. Configurar ESLint y los scripts de desarrollo.
4. Inicializar Git.
5. Ejecutar la aplicación en localhost.
6. Revisar la estructura de carpetas y establecer convenciones de código.

Criterio de finalización: el proyecto arranca correctamente, no presenta errores iniciales y está listo para comenzar el desarrollo.

### Fase 1. Diseño y experiencia visual

Objetivo: establecer la identidad visual de Barbie Cashier.

Actividades:

1. Definir una paleta de rosas, blancos y tonos complementarios.
2. Diseñar una interfaz inspirada en la caja registradora de referencia.
3. Crear una pantalla principal con visor de importe y teclado numérico.
4. Diseñar botones para sumar, borrar, calcular el total y finalizar operaciones.
5. Crear un panel secundario para los productos y el carrito.
6. Adaptar la interfaz a distintas resoluciones.
7. Incorporar iconografía y recursos gráficos originales o debidamente autorizados.

Criterio de finalización: existe una interfaz consistente, legible, adaptable y navegable, aunque todavía no todas las funciones estén implementadas.

### Fase 2. Calculadora y caja registradora

Objetivo: implementar el comportamiento básico del juguete.

Actividades:

1. Programar la entrada de números.
2. Implementar el punto decimal.
3. Implementar operaciones aritméticas y acumulación de importes.
4. Crear las funciones de borrar y reiniciar.
5. Mostrar los importes en un visor.
6. Implementar el botón TOTAL.
7. Añadir estados visuales para una compra en curso y una compra finalizada.
8. Incorporar sonidos y animaciones cuando las funciones principales sean estables.

Criterio de finalización: la caja registra importes y calcula totales correctamente, sin errores de redondeo monetario.

### Fase 3. Catálogo de papelería

Objetivo: convertir la calculadora en un punto de venta funcional.

Actividades:

1. Definir el modelo de producto con identificador, nombre, precio, categoría y disponibilidad.
2. Crear un catálogo inicial con lápices, bolígrafos, cuadernos, borradores, colores y otros artículos.
3. Mostrar productos mediante tarjetas o una cuadrícula.
4. Incorporar búsqueda y filtrado por categoría.
5. Permitir añadir productos al carrito.
6. Permitir modificar cantidades y retirar productos.
7. Calcular subtotales y total general.
8. Validar cantidades y precios.

Criterio de finalización: es posible construir una compra seleccionando productos del catálogo y obtener un importe correcto.

### Fase 4. Flujo de cobro

Objetivo: simular el trabajo cotidiano de una cajera.

Actividades:

1. Crear el proceso de finalizar una compra.
2. Implementar pago en efectivo.
3. Calcular el cambio a partir del importe recibido.
4. Implementar un pago con tarjeta simulado.
5. Mostrar estados de procesamiento, aprobación y cancelación.
6. Evitar registrar dos veces una misma venta.
7. Vaciar el carrito únicamente cuando la venta se haya confirmado.
8. Permitir cancelar una operación antes de finalizarla.

Criterio de finalización: una venta puede completarse de principio a fin con validaciones y resultados coherentes. Los pagos con tarjeta serán exclusivamente ficticios, sin conexión bancaria.

### Fase 5. Tickets e historial de ventas

Objetivo: proporcionar una experiencia similar a la de una papelería.

Actividades:

1. Diseñar un ticket con nombre de la tienda, fecha, productos, cantidades, precios y total.
2. Registrar cada venta finalizada.
3. Permitir consultar el historial.
4. Mostrar el detalle de una venta.
5. Preparar una vista imprimible mediante el navegador.
6. Evitar modificar accidentalmente ventas ya finalizadas.

Criterio de finalización: cada compra completada genera un registro consultable y un ticket imprimible.

### Fase 6. Persistencia e inventario

Objetivo: conservar la información entre sesiones.

Actividades:

1. Guardar el catálogo y sus modificaciones.
2. Persistir el historial de ventas.
3. Guardar la configuración de la aplicación.
4. Implementar un inventario básico.
5. Descontar existencias cuando corresponda, sin duplicar movimientos.
6. Añadir mecanismos de validación y recuperación de datos.
7. Definir un método de exportación o respaldo local.

Criterio de finalización: los datos permanecen disponibles después de cerrar y volver a abrir la aplicación, dentro del navegador y dispositivo correspondientes.

### Fase 7. Experiencia nostálgica y detalles especiales

Objetivo: reforzar la conexión con el juguete original.

Actividades:

1. Incorporar sonidos de teclas y de finalización de cobro.
2. Crear una animación del cajón de dinero.
3. Simular la lectura de una tarjeta.
4. Diseñar billetes y monedas virtuales.
5. Añadir transiciones y pequeñas animaciones.
6. Incluir opciones para silenciar sonidos.
7. Mantener una estética consistente sin perjudicar la usabilidad.

Criterio de finalización: las interacciones principales cuentan con retroalimentación visual o sonora y la aplicación conserva su identidad lúdica.

### Fase 8. Conversión a PWA instalable

Objetivo: permitir la instalación desde un navegador compatible.

Actividades:

1. Configurar el Web App Manifest.
2. Crear los iconos necesarios.
3. Definir el nombre, colores y modo de visualización.
4. Configurar un Service Worker.
5. Seleccionar los recursos que pueden almacenarse para uso offline.
6. Implementar estados adecuados cuando no exista conexión.
7. Probar instalación, actualización y apertura independiente.
8. Comprobar el funcionamiento en producción mediante HTTPS.

Criterio de finalización: la aplicación puede instalarse en un dispositivo compatible, abrirse como aplicación independiente y utilizar sus funciones offline compatibles.

### Fase 9. Pruebas y corrección de errores

Objetivo: verificar que el sistema sea estable antes de entregarlo.

Actividades:

1. Probar operaciones aritméticas y redondeo monetario.
2. Probar cantidades, precios y cambios.
3. Probar compras canceladas y finalizadas.
4. Verificar que no existan ventas duplicadas.
5. Probar persistencia y recuperación de datos.
6. Comprobar diseño adaptable.
7. Verificar accesibilidad básica y navegación por teclado.
8. Corregir errores de TypeScript, lint y ejecución.
9. Realizar pruebas manuales de los flujos completos.

Criterio de finalización: los flujos principales funcionan sin errores conocidos que impidan utilizar la aplicación.

## 5. Organización sugerida del código

Mantener una estructura modular que permita ampliar el proyecto sin mezclar la interfaz con la lógica comercial.

- app/: páginas, layouts, estilos globales y configuración PWA.
- components/: teclado, visor, catálogo, carrito, cobro y tickets.
- features/: funcionalidades agrupadas por dominio.
- lib/: utilidades compartidas, formato monetario y persistencia.
- types/: tipos e interfaces de TypeScript.
- public/: iconos, imágenes y recursos de sonido autorizados.
- tests/: pruebas unitarias y de integración, según las herramientas incorporadas.

La estructura definitiva podrá ajustarse a las convenciones de Next.js y a la complejidad real de cada fase.

## 6. Reglas de desarrollo

1. Desarrollar una fase a la vez.
2. No implementar todas las funcionalidades en un único archivo.
3. Utilizar TypeScript y evitar el uso innecesario de `any`.
4. Mantener separadas las reglas de negocio y los componentes visuales.
5. Utilizar una única fuente de verdad para el estado de una venta.
6. Centralizar el cálculo monetario y evitar errores por operaciones de punto flotante.
7. Validar datos antes de registrar una compra.
8. No eliminar funciones existentes al implementar nuevas características.
9. Ejecutar las comprobaciones pertinentes después de cada cambio.
10. No avanzar a una nueva fase si existen errores críticos en la fase actual.
11. Documentar las decisiones técnicas importantes.
12. No instalar dependencias sin justificar su necesidad.
13. Priorizar soluciones simples que puedan mantenerse y ampliarse.
14. No copiar recursos protegidos de Barbie sin autorización; utilizar recursos originales o elementos que el usuario tenga derecho a emplear.
15. No implementar pagos reales ni recopilar información financiera.

## 7. Método de trabajo

&#x20;deberás trabajar como asistente de desarrollo, siguiendo este procedimiento:

1. Analizar la fase y sus criterios de aceptación.
2. Revisar los archivos existentes antes de modificarlos.
3. Proponer un plan breve de implementación.
4. Implementar los cambios de esa fase.
5. Ejecutar las comprobaciones disponibles.
6. Corregir los errores introducidos.
7. Informar de los archivos modificados, las pruebas realizadas y los problemas pendientes.
8. Esperar la validación del usuario antes de comenzar la siguiente fase.

No asumir que una función está terminada únicamente porque el código fue generado.

## 8. Primera entrega funcional (MVP)

La primera versión deberá incluir:

- Interfaz inspirada en la caja registradora Barbie.
- Teclado numérico funcional.
- Visor de importes.
- Catálogo básico de papelería.
- Carrito con cantidades y precios.
- Cálculo del total.
- Cobro simulado en efectivo.
- Cálculo del cambio.
- Ticket imprimible.

El historial persistente, el inventario, los sonidos avanzados y la instalación PWA se incorporarán progresivamente, después de validar la funcionalidad principal.

## 9. Visión final

Barbie Cashier será una aplicación personal que combine nostalgia, juego y una experiencia de cobro realista. Deberá ser suficientemente sencilla para disfrutarla sin conocimientos técnicos, pero contar con una base de software bien estructurada que permita ampliar sus capacidades en el futuro.

La prioridad es crear una experiencia significativa y funcional, no acumular características innecesarias.
