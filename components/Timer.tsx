'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  startTime: number;
  isRunning: boolean;
}

export function Timer({ startTime, isRunning }: TimerProps) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 10);

    return () => clearInterval(interval);
  }, [startTime, isRunning]);

  const seconds = Math.floor(elapsedMs / 1000);
  const ms = Math.floor((elapsedMs % 1000) / 10);

  return (
    <div className="fixed top-32 left-1/2 -translate-x-1/2 text-white text-4xl font-mono z-20">
      {seconds}.{ms.toString().padStart(2, '0')}s
    </div>
  );
}
