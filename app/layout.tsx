import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bollocks Detector - LinkedIn AI Content Detector",
  description: "Sprawdź czy post na LinkedIn został napisany przez AI czy człowieka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
