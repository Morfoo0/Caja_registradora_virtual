import styles from "./diseno.module.css";

function Swatch({
  name,
  hex,
  dark,
}: {
  name: string;
  hex: string;
  dark?: boolean;
}) {
  return (
    <div className={styles.swatch}>
      <div
        className={styles.swatchColor}
        style={{ background: hex }}
        data-dark={dark || undefined}
      />
      <div className={styles.swatchMeta}>
        <span className={styles.swatchName}>{name}</span>
        <span className={styles.swatchHex}>{hex}</span>
      </div>
    </div>
  );
}

function Key({ label, tone }: { label: string; tone?: string }) {
  return (
    <button className={styles.key} data-tone={tone || undefined} type="button">
      {label}
    </button>
  );
}

export default function Diseno() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Referencia visual</h1>
        <p className={styles.subtitle}>Barbie Cashier — modelo Trendy</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Paleta de colores</h2>
        <div className={styles.swatchGrid}>
          <Swatch name="pink-50" hex="#fff5fa" />
          <Swatch name="pink-100" hex="#ffd1e6" />
          <Swatch name="pink-300" hex="#ff8fc4" />
          <Swatch name="pink-500" hex="#ff5fa2" dark />
          <Swatch name="pink-700" hex="#d81b74" dark />
          <Swatch name="pink-900" hex="#7a0d43" dark />
          <Swatch name="magenta" hex="#e6007e" dark />
          <Swatch name="plum-900" hex="#2a1330" dark />
          <Swatch name="plum-600" hex="#7a4a68" dark />
          <Swatch name="yellow" hex="#ffd84d" />
          <Swatch name="gold" hex="#ffc93c" />
          <Swatch name="green" hex="#2fb46b" dark />
          <Swatch name="red" hex="#e0485a" dark />
          <Swatch name="grey" hex="#b8b8c4" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Tipografía</h2>
        <div className={styles.typeRow}>
          <span className={styles.typeSample} style={{ fontSize: "var(--text-visor)" }}>
            Visor
          </span>
          <span className={styles.typeSample} style={{ fontSize: "var(--text-2xl)" }}>
            Total
          </span>
          <span className={styles.typeSample} style={{ fontSize: "var(--text-lg)" }}>
            Panel
          </span>
          <span className={styles.typeSample} style={{ fontSize: "var(--text-base)" }}>
            Cuerpo
          </span>
          <span className={styles.typeSample} style={{ fontSize: "var(--text-sm)" }}>
            Secundario
          </span>
          <span className={styles.typeSample} style={{ fontSize: "var(--text-xs)" }}>
            Leyenda
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Botones y estados</h2>
        <div className={styles.btnRow}>
          <button className={styles.btnPrimary} type="button">
            Primario
          </button>
          <button className={styles.btnPrimaryPressed} type="button">
            Presionado
          </button>
          <button className={styles.btnPrimary} type="button" disabled>
            Deshabilitado
          </button>
          <button className={styles.btnSuccess} type="button">
            Cobrar
          </button>
          <button className={styles.btnDanger} type="button">
            Cancelar
          </button>
          <button className={styles.btnGhost} type="button">
            Secundario
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Visor del importe</h2>
        <div className={styles.visor}>
          <span className={styles.visorLabel}>Total</span>
          <span className={styles.visorValue}>$0.00</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Teclado numérico</h2>
        <div className={styles.keypad}>
          <div className={styles.keyGrid}>
            <Key label="7" />
            <Key label="8" />
            <Key label="9" />
            <Key label="4" />
            <Key label="5" />
            <Key label="6" />
            <Key label="1" />
            <Key label="2" />
            <Key label="3" />
            <Key label="0" />
            <Key label="·" />
            <Key label="00" />
          </div>
          <div className={styles.keyActions}>
            <Key label="C" tone="clear" />
            <Key label="Total" tone="total" />
            <Key label="Cobrar" tone="pay" />
            <Key label="Cancelar" tone="cancel" />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Catálogo, carrito y resumen</h2>
        <div className={styles.catalogCart}>
          <div className={styles.catalog}>
            <div className={styles.productCard}>
              <div className={styles.productThumb} />
              <div className={styles.productInfo}>
                <span className={styles.productName}>Lápiz HB</span>
                <span className={styles.productPrice}>$8.00</span>
              </div>
              <button className={styles.btnAdd} type="button">
                Añadir
              </button>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productThumb} />
              <div className={styles.productInfo}>
                <span className={styles.productName}>Cuaderno 100 hojas</span>
                <span className={styles.productPrice}>$42.50</span>
              </div>
              <button className={styles.btnAdd} type="button">
                Añadir
              </button>
            </div>
          </div>
          <div className={styles.cart}>
            <div className={styles.cartLine}>
              <span className={styles.cartName}>Lápiz HB</span>
              <span className={styles.qtyStepper}>
                <button type="button" aria-label="Restar">
                  −
                </button>
                2
                <button type="button" aria-label="Sumar">
                  +
                </button>
              </span>
              <span className={styles.cartLineTotal}>$16.00</span>
            </div>
            <div className={styles.cartSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>$16.00</span>
              </div>
              <div className={styles.summaryRowStrong}>
                <span>Total</span>
                <span>$16.00</span>
              </div>
              <button className={styles.btnSuccess} type="button">
                Cobrar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Estados</h2>
        <div className={styles.states}>
          <div className={styles.stateCard}>
            <span className={styles.stateLabel}>Vacío</span>
            <p className={styles.stateText}>El carrito está vacío</p>
          </div>
          <div className={styles.stateCard}>
            <span className={styles.stateLabel}>Error</span>
            <p className={styles.stateTextError}>Importe insuficiente</p>
          </div>
          <div className={styles.stateCard}>
            <span className={styles.stateLabel}>En curso</span>
            <p className={styles.stateText}>Procesando…</p>
          </div>
        </div>
      </section>
    </main>
  );
}
