import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, sessionId, gameId, gameType, guesses, timeMs, selectedEmoji } = body;

  // Verify the guess
  let isSuccess = false;
  let correctAnswer = '';

  if (gameType === 'DAILY' && gameId) {
    const dailyGame = await prisma.dailyGame.findUnique({
      where: { id: gameId },
    });

    if (!dailyGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    correctAnswer = dailyGame.missingEmoji;
    isSuccess = selectedEmoji === correctAnswer;
  } else {
    // Infinite mode - answer sent from client (we trust it for practice mode)
    isSuccess = body.isSuccess;
    correctAnswer = body.correctAnswer;
  }

  const attempt = await prisma.gameAttempt.create({
    data: {
      userId,
      sessionId,
      gameId: gameType === 'DAILY' ? gameId : null,
      gameType,
      timeMs: isSuccess || guesses.length < 2 ? timeMs : null,
      guesses,
      isSuccess,
    },
  });

  return NextResponse.json({
    isSuccess,
    correctAnswer,
    attemptId: attempt.id,
  });
}
