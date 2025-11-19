import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSeededGameEmojis } from '@/lib/emoji-generator';

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const existing = await prisma.dailyGame.findUnique({
    where: { date: tomorrow },
  });

  if (existing) {
    return NextResponse.json({ message: 'Daily game already exists' });
  }

  const seed = tomorrow.toISOString().split('T')[0];
  const { allThreeEmojis, missingEmoji } = generateSeededGameEmojis(seed);

  const dailyGame = await prisma.dailyGame.create({
    data: {
      date: tomorrow,
      emojis: allThreeEmojis,
      missingEmoji,
    },
  });

  return NextResponse.json({ message: 'Daily game created', gameId: dailyGame.id });
}
