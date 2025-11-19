"use client";

import { useState } from "react";

interface ShareButtonProps {
  time: string;
  isSuccess: boolean;
}

export function ShareButton({ time, isSuccess }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const gameUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shareText = `Nomoji
${time}
${gameUrl}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-8 py-4 bg-white text-black rounded-lg text-xl font-bold hover:bg-yellow-400 transition-colors"
    >
      {copied ? "Copied! ✓" : "Share Results 📤"}
    </button>
  );
}
