import { NextRequest, NextResponse } from 'next/server';
import { generateSeededGameEmojis } from '@/lib/emoji-generator';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const round = parseInt(searchParams.get('round') || '1', 10);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Use date as seed for consistent daily games
  const seed = today.toISOString().split('T')[0];
  const { allThreeEmojis, displayEmojis } = generateSeededGameEmojis(seed, round);

  return NextResponse.json({
    gameId: `${seed}-${round}`, // Include round in game ID
    date: seed,
    round,
    totalRounds: 3,
    emojis: allThreeEmojis,
    displayEmojis,
  });
}
