"use client";

import { useOnlineStatus } from "@/components/hooks/useOnlineStatus";
import styles from "./OfflineBanner.module.css";

export function OfflineBanner() {
  const online = useOnlineStatus();

  if (online) {
    return null;
  }

  return (
    <div className={styles.banner} role="status">
      Sin conexión — los cambios se guardan en este dispositivo.
    </div>
  );
}
