import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Picka — pick your favorite shots",
  description: "Photographers share. Clients pick. You edit only what matters."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
