import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fleur & Co. | Artisan Florist",
  description: "E-Commerce Toko Bunga Segar & Buket Estetik",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}