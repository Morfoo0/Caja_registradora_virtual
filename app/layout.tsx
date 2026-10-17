import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barbie Cashier",
  description: "Caja registradora virtual para una papelería.",
  applicationName: "Barbie Cashier",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Barbie Cashier",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff5fa2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <OfflineBanner />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
