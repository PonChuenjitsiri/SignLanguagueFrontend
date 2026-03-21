import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// ตั้งค่า PWA
const withPWA = withPWAInit({
  dest: "public", // ให้สร้างไฟล์ Service Worker ไว้ที่โฟลเดอร์ public
  disable: process.env.NODE_ENV === "development", // ปิดการทำงานในโหมด Dev เพื่อไม่ให้แคชกวนใจตอนเขียนโค้ด
});

// ตั้งค่า Next.js เดิมของคุณ (ถ้ามีอะไรอยู่ก่อนหน้านี้ ให้ใส่ไว้ในนี้)
const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
};

// Export โดยเอา PWA มาครอบ
export default withPWA(nextConfig);