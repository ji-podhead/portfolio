import "./globals.css";
import "leaflet/dist/leaflet.css";
import ScrollspyNav from "@/components/ScrollspyNav";



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