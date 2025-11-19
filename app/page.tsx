'use client';

import { useEffect, useState } from 'react';
import { AnimatedEmoji } from '@/components/AnimatedEmoji';
import { GuessButtons } from '@/components/GuessButtons';
import { Timer } from '@/components/Timer';
import { ResultsScreen } from '@/components/ResultsScreen';
import { getUserId, getSessionId } from '@/lib/user-id';

interface GameData {
  gameId: string;
  emojis: string[];
  displayEmojis: string[];
}

export default function Home() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    const response = await fetch('/api/daily-game');
    const data = await response.json();
    setGameData(data);
    setStartTime(Date.now());
  };

  const handleGuess = async (emoji: string) => {
    if (!gameData) return;

    const newGuesses = [...guesses, emoji];
    setGuesses(newGuesses);

    const elapsed = Date.now() - startTime;

    const response = await fetch('/api/submit-guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getUserId(),
        sessionId: getSessionId(),
        gameId: gameData.gameId,
        gameType: 'DAILY',
        guesses: newGuesses,
        timeMs: elapsed,
        selectedEmoji: emoji,
      }),
    });

    const result = await response.json();

    setCorrectAnswer(result.correctAnswer);
    setIsSuccess(result.isSuccess);

    if (result.isSuccess || newGuesses.length >= 2) {
      setTimeMs(result.isSuccess ? elapsed : null);
      setShowResults(true);
    }
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎯</div>
          <p className="text-2xl">Loading today&apos;s challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black via-black/95 to-transparent p-8 z-10">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-2">Nomoji</h1>
          <p className="text-2xl text-white/60">Who&apos;s missing?</p>
        </div>
      </div>

      {/* Timer */}
      <Timer startTime={startTime} isRunning={!showResults} />

      {/* Animated Emojis */}
      <div className="absolute inset-0 pt-32 pb-48">
        {gameData.displayEmojis.map((emoji, index) => (
          <AnimatedEmoji key={index} emoji={emoji} index={index} />
        ))}
      </div>

      {/* Guess Buttons */}
      <GuessButtons
        emojis={gameData.emojis}
        onGuess={handleGuess}
        disabled={showResults}
        guessedEmojis={guesses}
      />

      {/* Results */}
      {showResults && (
        <ResultsScreen
          isSuccess={isSuccess}
          timeMs={timeMs}
          correctAnswer={correctAnswer}
          gameType="DAILY"
        />
      )}

      {/* Mode Switch */}
      <a
        href="/infinite"
        className="fixed top-8 right-8 text-white/60 hover:text-white underline z-20"
      >
        Infinite Mode →
      </a>
    </main>
  );
}
