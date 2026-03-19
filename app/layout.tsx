import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Glove Admin",
  description: "Smart Glove Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
