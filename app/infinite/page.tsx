'use client';

import { useEffect, useState } from 'react';
import { AnimatedEmoji } from '@/components/AnimatedEmoji';
import { GuessButtons } from '@/components/GuessButtons';
import { Timer } from '@/components/Timer';
import { ResultsScreen } from '@/components/ResultsScreen';
import { getUserId, getSessionId } from '@/lib/user-id';
import { generateGameEmojis } from '@/lib/emoji-generator';

export default function InfiniteMode() {
  const [gameData, setGameData] = useState<any>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const game = generateGameEmojis();
    setGameData(game);
    setStartTime(Date.now());
    setGuesses([]);
    setShowResults(false);
    setIsSuccess(false);
    setTimeMs(null);
  };

  const handleGuess = async (emoji: string) => {
    if (!gameData) return;

    const newGuesses = [...guesses, emoji];
    setGuesses(newGuesses);

    const elapsed = Date.now() - startTime;
    const success = emoji === gameData.missingEmoji;

    setIsSuccess(success);

    if (success || newGuesses.length >= 2) {
      setTimeMs(success ? elapsed : null);
      setShowResults(true);

      // Submit to database (no gameId for infinite mode)
      await fetch('/api/submit-guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: getUserId(),
          sessionId: getSessionId(),
          gameId: null,
          gameType: 'INFINITE',
          guesses: newGuesses,
          timeMs: success ? elapsed : null,
          selectedEmoji: emoji,
          isSuccess: success,
          correctAnswer: gameData.missingEmoji,
        }),
      });
    }
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="text-6xl">♾️</div>
          <p className="text-2xl">Preparing game...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden grid grid-rows-[auto_1fr_auto]">
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black via-black/95 to-transparent p-8 z-10">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-2">Nomoji</h1>
          <p className="text-2xl text-white/60">Infinite Mode ♾️</p>
        </div>
      </div>

      <Timer startTime={startTime} isRunning={!showResults} />

      {/* Animated Emojis Arena */}
      <div className="relative" style={{ marginTop: '180px' }}>
        <div className="absolute inset-0">
          {gameData.displayEmojis.map((emoji: string, index: number) => (
            <AnimatedEmoji key={index} emoji={emoji} index={index} />
          ))}
        </div>
      </div>

      <GuessButtons
        emojis={gameData.allThreeEmojis}
        onGuess={handleGuess}
        disabled={showResults}
        guessedEmojis={guesses}
      />

      {showResults && (
        <ResultsScreen
          isSuccess={isSuccess}
          timeMs={timeMs}
          correctAnswer={gameData.missingEmoji}
          gameType="INFINITE"
          onPlayAgain={startNewGame}
        />
      )}

      <a
        href="/"
        className="fixed top-8 right-8 text-white/60 hover:text-white underline z-20"
      >
        ← Daily Mode
      </a>
    </main>
  );
}
