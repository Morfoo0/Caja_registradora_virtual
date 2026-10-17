# Barbie Cashier — Investigación del juguete original

> Guía visual y funcional basada únicamente en fuentes consultadas. Las afirmaciones sin respaldo se marcan como **incertidumbre**. No se copiarán logotipos, frases, sonidos ni imágenes del juguete.

## Modelo de referencia confirmado

**Barbie Trendy Cash Register** (Just Play, 2020, código 886144636219) — modelo que inspira el proyecto.

Otros modelos consultados para contexto: Cool Shoppin' Barbie (Mattel, 1997), Barbie Shop with Me Cash Register (Mattel/Kid Designs, 1999–2008), Barbie Cash Register 49335 (2001), Barbie Large Cash Register (2018).

## 1. Elementos físicos reconocibles (modelo Trendy)

- **Teclado/calculadora:** teclas numéricas para "dar el total". *(marketing oficial)*
  - ⚠️ Una reseña de Walmart indica que "el teclado no hace nada" en un modelo; otra reseña y el marketing hablan de calculadora funcional → **incertidumbre** sobre si es calculadora real o decorativa.
- **Visor:** "pantalla grande con pegatinas" (no LCD funcional en este modelo). *(reseña Walmart)*
- **Cajón de dinero:** sale al pulsar un botón; hace "cha-ching". *(Meijer, Walmart)*
- **Lector de tarjetas:** pieza **separada**; al pasar la tarjeta **expulsa un recibo** de plástico. *(reseña Walmart)*
- **Botón de apertura amarillo "Barbie":** reproduce frases ("Hi, this is Barbie", "It was great shopping with you"). *(reseña Walmart)*
- **Pieza gris superior:** produce el sonido "cha-ching". *(reseña Walmart)*
- **Accesorios:** dinero de juguete (billetes y monedas), tarjeta de crédito de juguete. *(Walmart/Amazon)*

## 2. Colores, proporciones y disposición

- **Colores:** rosa (dominante) + blanco; detalles amarillo y gris. *(Amazon "Color: Pink", Poshmark "Pink & White")*
- **Dimensiones:** 30 × 17 × 16 cm (aprox.), 0,73 kg. *(Tates Toys)*
- **Disposición (inferida):** visor arriba, teclado en el centro/frente, cajón en la base, lector de tarjetas como accesorio lateral. *(detalle exacto = incertidumbre, sin medición fotográfica)*

## 3. Interacciones recreables digitalmente

| Juguete | Recreación digital |
|---|---|
| Teclas numéricas (beep) | Teclado + sonido de tecla sintetizado |
| "Cha-ching" al abrir cajón | Animación de cajón + sonido propio |
| Pasar tarjeta → expulsa recibo | Animación de lector + generación de ticket |
| Frases de Barbie | **Frases propias** (no reproducir la voz original) |
| Dinero/tarjeta de juguete | Efectivo simulado + tarjeta ficticia |

## 4. Diferencias juguete vs. punto de venta real

- **Trendy:** sin cálculo de cambio, sin subtotales reales, sin historial; visor decorativo; puro juego de rol.
- **Nuestro POS:** suma cambio, ticket real imprimible, historial y validación anti-duplicados (añadido sobre la referencia).

## 5. Recursos a crear desde cero

- Nombre/marca propios (no el logo "Barbie" ni la silueta).
- Frases y voz propias.
- Sonidos sintetizados (tecla, cha-ching, apertura de cajón).
- Arte propio de la caja en CSS/SVG (rosa + blanco, detalles amarillo/gris).
- Tarjeta ficticia genérica (sin MasterCard).

## 6. Imprescindibles vs. opcionales

- **Imprescindibles:** rosa/blanco con esquinas redondeadas, visor arriba, teclado grande, cajón animado con "cha-ching", lector de tarjeta con animación, sonidos de tecla/cobro.
- **Opcionales:** escáner de mano (no está en el Trendy, es de otros modelos), micrófono, monedas/billetes detallados.

---

## Fuentes consultadas
- Smithsonian Institution, "Cool Shoppin' Barbie" — americanhistory.si.edu (nmah_1459520)
- Los Angeles Times (1998), "Parents Give Credit Card Barbie a Low Rating"
- Zócalo Public Square (2023), "Come on Barbie, Let's Sell Barbies"
- BarbiePedia: Barbie Cash Register 49335 (2001) y 62557 (2020)
- Amazon: Barbie 1999 Shop with Me (B00000IT7I); Shop with Me 2008 (B001H8CTTY); Large (B07C3CF7RX); Small (B07BRCCLGW); Trendy (B08S45YVR6)
- Meijer / Tates Toys / Walmart: Barbie Trendy Cash Register (cód. 886144636219)
- Poshmark: Cool Shoppin' Barbie y Barbie Pink & White Register
- Fixya: hilos de manuales "Shop with Me" (BE-190N)

## Incertidumbres señaladas
- Funcionalidad real del teclado del Trendy (calculadora vs. decorativo).
- Detalle exacto de colores y disposición (solo descripciones textuales + dimensiones).
- No localicé manual oficial en digital.
