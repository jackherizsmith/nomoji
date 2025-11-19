"use client";

import { motion } from "framer-motion";

interface GuessButtonsProps {
  emojis: string[];
  onGuess: (emoji: string) => void;
  disabled: boolean;
  guessedEmojis: string[];
}

export function GuessButtons({
  emojis,
  onGuess,
  disabled,
  guessedEmojis,
}: GuessButtonsProps) {
  return (
    <div className="bg-gradient-to-t from-black via-black/95 to-transparent p-4">
      <div className="flex justify-center items-center gap-4 max-w-xl mx-auto">
        {emojis.map((emoji) => {
          const isGuessed = guessedEmojis.includes(emoji);

          return (
            <motion.button
              key={emoji}
              onClick={() => !disabled && onGuess(emoji)}
              disabled={disabled || isGuessed}
              className={`
                text-3xl p-4 rounded-xl border-2 transition-all
                ${
                  isGuessed
                    ? "border-red-500 opacity-50 cursor-not-allowed bg-red-500/20"
                    : "border-white hover:border-yellow-400 hover:scale-110 bg-white/10 hover:bg-white/20"
                }
                ${disabled && !isGuessed ? "opacity-50 cursor-not-allowed" : ""}
              `}
              whileHover={!disabled && !isGuessed ? { scale: 1.1 } : {}}
              whileTap={!disabled && !isGuessed ? { scale: 0.95 } : {}}
            >
              {emoji}
            </motion.button>
          );
        })}
      </div>

      <div className="text-center mt-2 text-white/60 text-xs">
        Guesses remaining: {2 - guessedEmojis.length}
      </div>
    </div>
  );
}
