"use client";

import { useEffect, useState } from "react";

// สร้าง Type สำหรับ Event การติดตั้ง
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // ฟังก์ชันนี้จะทำงานเมื่อเบราว์เซอร์พร้อมให้ติดตั้ง PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true); // แสดงปุ่มเมื่อพร้อมติดตั้ง
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // เรียกเด้งหน้าต่างถามติดตั้ง
    await deferredPrompt.prompt();
    
    // รอผู้ใช้กดตกลงหรือยกเลิก
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false); // ซ่อนปุ่มถ้าติดตั้งเสร็จแล้ว
    }
    
    setDeferredPrompt(null);
  };

  // ถ้ายังไม่พร้อมติดตั้ง หรือติดตั้งไปแล้ว จะไม่แสดงปุ่มนี้
  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition flex items-center gap-2"
    >
      📱 ติดตั้งแอป (Install)
    </button>
  );
}