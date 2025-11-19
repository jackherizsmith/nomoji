'use client';

import { useState } from 'react';

interface ShareButtonProps {
  time: string;
  isSuccess: boolean;
}

export function ShareButton({ time, isSuccess }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Nomoji - Who's missing? 🎯\nTime: ${time}\n${isSuccess ? '✅ Success!' : '❌ Failed'}\n\nPlay at ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nomoji Results',
          text: shareText,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-8 py-4 bg-white text-black rounded-lg text-xl font-bold hover:bg-yellow-400 transition-colors"
    >
      {copied ? 'Copied! ✓' : 'Share Results 📤'}
    </button>
  );
}
