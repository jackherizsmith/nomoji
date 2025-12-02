import { NextRequest, NextResponse } from 'next/server';
import { generateSeededGameEmojis } from '@/lib/emoji-generator';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { gameId, gameType, selectedEmoji } = body;

  // Verify the guess
  let isSuccess = false;
  let correctAnswer = '';

  if (gameType === 'DAILY' && gameId) {
    // gameId format is "YYYY-MM-DD-round" e.g. "2025-12-02-1"
    const parts = gameId.split('-');
    const round = parseInt(parts[3], 10);
    const date = parts.slice(0, 3).join('-');

    // Regenerate the game from the seed
    const { missingEmoji } = generateSeededGameEmojis(date, round);
    correctAnswer = missingEmoji;
    isSuccess = selectedEmoji === correctAnswer;
  } else {
    // Infinite mode - answer sent from client (we trust it for practice mode)
    isSuccess = body.isSuccess;
    correctAnswer = body.correctAnswer;
  }

  return NextResponse.json({
    isSuccess,
    correctAnswer,
  });
}
