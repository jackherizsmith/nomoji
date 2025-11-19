import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSeededGameEmojis } from '@/lib/emoji-generator';

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyGame = await prisma.dailyGame.findUnique({
    where: { date: today },
  });

  if (!dailyGame) {
    // Generate today's game if it doesn't exist
    const seed = today.toISOString().split('T')[0];
    const { allThreeEmojis, missingEmoji } = generateSeededGameEmojis(seed);

    dailyGame = await prisma.dailyGame.create({
      data: {
        date: today,
        emojis: allThreeEmojis,
        missingEmoji,
      },
    });
  }

  // Generate display emojis (don't send from DB for security)
  const seed = today.toISOString().split('T')[0];
  const { displayEmojis } = generateSeededGameEmojis(seed);

  return NextResponse.json({
    gameId: dailyGame.id,
    emojis: dailyGame.emojis,
    displayEmojis,
  });
}
