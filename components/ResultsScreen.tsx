"use client";

import { motion } from "framer-motion";
import { ShareButton } from "./ShareButton";

interface RoundResult {
  isSuccess: boolean;
  timeMs: number | null;
  correctAnswer: string;
  guesses: string[];
}

interface ResultsScreenProps {
  isSuccess: boolean;
  timeMs: number | null;
  correctAnswer: string;
  gameType: "DAILY" | "INFINITE";
  currentRound?: number;
  totalRounds?: number;
  roundResults?: RoundResult[];
  allRoundsComplete?: boolean;
  onPlayAgain?: () => void;
  onNextRound?: () => void;
  onClose?: () => void;
}

export function ResultsScreen({
  isSuccess,
  timeMs,
  correctAnswer,
  gameType,
  currentRound = 1,
  totalRounds = 1,
  roundResults = [],
  allRoundsComplete = false,
  onPlayAgain,
  onNextRound,
  onClose,
}: ResultsScreenProps) {
  const formatTime = (ms: number | null) => {
    if (ms === null) return null;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}s`;
  };

  const getTotalTime = () => {
    const total = roundResults.reduce((sum, r) => sum + (r.timeMs || 0), 0);
    const successCount = roundResults.filter((r) => r.isSuccess).length;
    return { total, successCount };
  };

  // Show summary when all rounds complete, otherwise show single round result
  if (gameType === "DAILY" && allRoundsComplete) {
    const { total, successCount } = getTotalTime();

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="fixed top-8 right-8 text-white/60 hover:text-white text-4xl transition-colors z-50"
            aria-label="Close results"
          >
            ×
          </button>
        )}

        <div className="text-center text-white space-y-6 p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-7xl mb-4"
          >
            {successCount === totalRounds ? "🏆" : successCount > 0 ? "🎯" : "😢"}
          </motion.div>

          <h2 className="text-4xl font-bold">Daily Complete!</h2>

          <div className="space-y-3">
            {roundResults.map((result, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-4 text-2xl"
              >
                <span className="text-white/60">R{i + 1}</span>
                <span className="text-4xl">{result.correctAnswer}</span>
                <span className={result.isSuccess ? "text-green-400" : "text-red-400"}>
                  {result.isSuccess ? formatTime(result.timeMs) : "✗"}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/20">
            {formatTime(total) && (
              <>
                <p className="text-white/60 text-lg">Total Time</p>
                <div className="text-5xl font-mono">{formatTime(total)}</div>
              </>
            )}
            <p className="text-white/60 mt-2">
              {successCount}/{totalRounds} correct
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <ShareButton roundResults={roundResults} />

            <a
              href="/infinite"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xl font-bold border-2 border-white/40 hover:border-white transition-all"
            >
              Infinite Mode →
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
    >
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
        {gameType === "DAILY" && (
          <p className="text-xl text-white/60">
            Round {currentRound} of {totalRounds}
          </p>
        )}

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

        {formatTime(timeMs) && (
          <div className="text-6xl font-mono">{formatTime(timeMs)}</div>
        )}

        <div className="flex gap-4 justify-center">
          {gameType === "DAILY" && onNextRound && (
            <button
              onClick={onNextRound}
              className="px-8 py-4 bg-white text-black rounded-lg text-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Next Round →
            </button>
          )}

          {gameType === "INFINITE" && onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="px-8 py-4 bg-white text-black rounded-lg text-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Play Again
            </button>
          )}

          {gameType === "INFINITE" && (
            <a
              href="/"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xl font-bold border-2 border-white/40 hover:border-white transition-all"
            >
              ← Daily Mode
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
