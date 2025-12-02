"use client";

import { useState } from "react";

interface RoundResult {
  isSuccess: boolean;
  timeMs: number | null;
  correctAnswer: string;
  guesses: string[];
}

interface ShareButtonProps {
  roundResults: RoundResult[];
}

declare global {
  interface Window {
    SHARE_URL?: string;
  }
}

export function ShareButton({ roundResults }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const formatTime = (ms: number | null) => {
    if (ms === null) return null;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}s`;
  };

  const getShareUrl = () => {
    if (typeof window !== "undefined" && window.SHARE_URL) {
      return window.SHARE_URL;
    }
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  };

  const generateShareText = () => {
    const totalTime = roundResults.reduce((sum, r) => sum + (r.timeMs || 0), 0);
    const successCount = roundResults.filter((r) => r.isSuccess).length;
    const totalRounds = roundResults.length;

    // Generate result line with emojis showing success/fail
    const resultLine = roundResults
      .map((r) => (r.isSuccess ? "✅" : "❌"))
      .join(" ");

    // Get today's date formatted nicely
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const gameUrl = getShareUrl();

    let shareText = `🎯 Nomoji - ${dateStr}\n`;
    shareText += `${resultLine}\n`;

    const time = formatTime(totalTime);
    if (successCount === totalRounds && time) {
      shareText += `🏆 Perfect! All ${totalRounds} rounds in ${time}\n`;
    } else if (successCount > 0 && time) {
      shareText += `${successCount}/${totalRounds} rounds · ${time}\n`;
    } else {
      shareText += `${successCount}/${totalRounds} rounds\n`;
    }

    shareText += gameUrl;

    return shareText;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
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
      {copied ? "Copied! ✓" : "Share Results"}
    </button>
  );
}
