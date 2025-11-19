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
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    loadGame();
  }, []);

  // Save elapsed time to localStorage every second
  useEffect(() => {
    if (!gameData || showResults) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      localStorage.setItem('nomoji_daily_timer', JSON.stringify({
        gameId: gameData.gameId,
        elapsedMs: elapsed,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameData, startTime, showResults]);

  const loadGame = async () => {
    const response = await fetch('/api/daily-game');
    const data = await response.json();
    setGameData(data);

    // Check if user has already completed this game
    const completedKey = `nomoji_completed_${data.gameId}`;
    const completedData = localStorage.getItem(completedKey);

    if (completedData) {
      try {
        const { isSuccess, timeMs, correctAnswer, guesses } = JSON.parse(completedData);
        setHasCompleted(true);
        setIsSuccess(isSuccess);
        setTimeMs(timeMs);
        setCorrectAnswer(correctAnswer);
        setGuesses(guesses);
        setShowResults(true);
        return;
      } catch (e) {
        // Invalid saved data, ignore
      }
    }

    // Check if there's a saved timer for this game
    const savedTimer = localStorage.getItem('nomoji_daily_timer');
    if (savedTimer) {
      try {
        const { gameId, elapsedMs } = JSON.parse(savedTimer);
        // If it's the same game, restore the timer
        if (gameId === data.gameId) {
          setStartTime(Date.now() - elapsedMs);
          return;
        }
      } catch (e) {
        // Invalid saved data, ignore
      }
    }

    // New game or no saved timer
    setStartTime(Date.now());
    localStorage.removeItem('nomoji_daily_timer');
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
      const finalTimeMs = result.isSuccess ? elapsed : null;
      setTimeMs(finalTimeMs);
      setShowResults(true);
      setHasCompleted(true);

      // Save completion data to localStorage
      const completedKey = `nomoji_completed_${gameData.gameId}`;
      localStorage.setItem(completedKey, JSON.stringify({
        isSuccess: result.isSuccess,
        timeMs: finalTimeMs,
        correctAnswer: result.correctAnswer,
        guesses: newGuesses,
      }));

      // Clear the saved timer when game is completed
      localStorage.removeItem('nomoji_daily_timer');
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
    <main className="min-h-screen bg-black relative overflow-hidden grid grid-rows-[auto_1fr_auto]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black via-black/95 to-transparent p-8 z-10">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-2">Nomoji</h1>
          <p className="text-2xl text-white/60">Who&apos;s missing?</p>
        </div>
      </div>

      {/* Timer */}
      <Timer startTime={startTime} isRunning={!hasCompleted} />

      {/* Animated Emojis Arena */}
      <div className="relative" style={{ marginTop: '180px' }}>
        <div className="absolute inset-0">
          {gameData.displayEmojis.map((emoji, index) => (
            <AnimatedEmoji key={index} emoji={emoji} index={index} />
          ))}
        </div>
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
          onClose={hasCompleted ? () => setShowResults(false) : undefined}
        />
      )}

      {/* Mode Switch */}
      <a
        href="/infinite"
        className="fixed top-8 right-8 text-white/60 hover:text-white underline z-20"
      >
        Infinite Mode →
      </a>

      {/* See Results Button - shown when user has completed but results are closed */}
      {hasCompleted && !showResults && (
        <button
          onClick={() => setShowResults(true)}
          className="fixed bottom-8 right-8 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl border-2 border-white/40 hover:border-white transition-all z-20 backdrop-blur-sm"
        >
          See Results
        </button>
      )}
    </main>
  );
}
