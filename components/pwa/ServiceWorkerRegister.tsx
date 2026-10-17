"use client";

import { useEffect, useState } from "react";
import styles from "./ServiceWorkerRegister.module.css";

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // Distingue la primera toma de control de una actualización real.
    let hadController = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController) {
        hadController = true;
        return;
      }
      window.location.reload();
    });

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (
            worker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setUpdateAvailable(true);
          }
        });
      });
    });
  }, []);

  if (!updateAvailable) {
    return null;
  }

  const reload = () => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.waiting?.postMessage("SKIP_WAITING");
    });
  };

  return (
    <div className={styles.banner} role="status">
      <span>Nueva versión disponible.</span>
      <button type="button" className={styles.reload} onClick={reload}>
        Recargar
      </button>
    </div>
  );
}
