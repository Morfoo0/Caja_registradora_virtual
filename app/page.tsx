import { Calculator } from "@/components/calculator/Calculator";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Barbie Cashier</h1>
        <p className={styles.subtitle}>Caja registradora</p>
      </header>
      <Calculator />
    </main>
  );
}
