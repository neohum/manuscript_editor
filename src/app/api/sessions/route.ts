import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { learningSessions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/../auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { problemId, mode, score, durationSec, finalText } = await req.json();

    const newSession = await db.insert(learningSessions).values({
      userId: session.user.id,
      problemId: problemId,
      mode: mode,
      score: score,
      durationSec: durationSec,
      finalText: finalText,
    }).returning();

    // 1. Fetch user to add XP
    const userRows = await db.select().from(users).where(eq(users.id, session.user.id));
    if (userRows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const user = userRows[0];

    // 2. Calculate newly added XP
    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;
    const addedXp = Math.max(0, score || 0); // score is max 100 per quiz
    
    const newXp = currentXp + addedXp;
    
    // Level formula: Level 1 + Floor(XP / 500)
    // Means at 500 XP, level 2. At 1000 XP, level 3.
    const calculatedLevel = 1 + Math.floor(newXp / 500);
    const hasLeveledUp = calculatedLevel > currentLevel;
    const newLevel = Math.max(currentLevel, calculatedLevel);

    // 3. Update DB
    await db.update(users)
      .set({ xp: newXp, level: newLevel })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ 
      session: newSession[0],
      xp: newXp,
      level: newLevel,
      levelUp: hasLeveledUp
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
