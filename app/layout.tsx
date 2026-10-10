import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barbie Cashier",
  description: "Caja registradora virtual para una papelería.",
  applicationName: "Barbie Cashier",
};

export const viewport: Viewport = {
  themeColor: "#ff5fa2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
