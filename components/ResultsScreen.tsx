"use client";

import { motion } from "framer-motion";
import { ShareButton } from "./ShareButton";

interface ResultsScreenProps {
  isSuccess: boolean;
  timeMs: number | null;
  correctAnswer: string;
  gameType: "DAILY" | "INFINITE";
  onPlayAgain?: () => void;
  onClose?: () => void;
}

export function ResultsScreen({
  isSuccess,
  timeMs,
  correctAnswer,
  gameType,
  onPlayAgain,
  onClose,
}: ResultsScreenProps) {
  const formatTime = (ms: number | null) => {
    if (ms === null) return "DNF";
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-8 right-8 text-white/60 hover:text-white text-4xl transition-colors z-50"
          aria-label="Close results"
        >
          ×
        </button>
      )}

      <div className="text-center text-white space-y-8 p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-8xl mb-8"
        >
          {isSuccess ? "🎉" : "😢"}
        </motion.div>

        <h2 className="text-5xl font-bold">
          {isSuccess ? "Well done!" : "Not quite!"}
        </h2>

        <div className="space-y-4">
          <p className="text-2xl text-white/80">The missing emoji was:</p>
          <div className="text-9xl">{correctAnswer}</div>
        </div>

        <div className="text-6xl font-mono">{formatTime(timeMs)}</div>

        {gameType === "DAILY" && (
          <ShareButton time={formatTime(timeMs)} isSuccess={isSuccess} />
        )}

        <div className="flex gap-4 justify-center">
          {gameType === "INFINITE" && onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="px-8 py-4 bg-white text-black rounded-lg text-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Play Again
            </button>
          )}

          {gameType === "DAILY" && (
            <a
              href="/infinite"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xl font-bold border-2 border-white/40 hover:border-white transition-all"
            >
              Infinite Mode →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
