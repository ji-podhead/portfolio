import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ji-Podhead - Portfolio",
  description: "MLOps & Full-Stack Development Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}