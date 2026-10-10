import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Barbie Cashier</h1>
      <p className={styles.subtitle}>Caja registradora virtual</p>
      <p className={styles.note}>Interfaz en construcción (Fase 1).</p>
    </main>
  );
}
