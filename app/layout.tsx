import type { Metadata, Viewport } from "next";

// เพิ่ม Viewport สำหรับ Theme Color (แนะนำสำหรับ Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Sign Language App",
  description: "แอปพลิเคชันภาษามือ",
  manifest: "/manifest.json", // <-- เพิ่มบรรทัดนี้เข้าไป
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}