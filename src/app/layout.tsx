import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import ScrollspyNav from "@/components/ScrollspyNav";

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
      <body>
        {children}
        <ScrollspyNav />
      </body>
    </html>
  );
}