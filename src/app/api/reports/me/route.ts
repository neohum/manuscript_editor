import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { learningSessions, errorLogs } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { auth } from '@/../auth';

export async function GET(req: Request) {
  const sessionUser = await auth();
  if (!sessionUser || !sessionUser.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = sessionUser.user.id;

    // Fetch the last 20 learning sessions to plot trend
    const sessions = await db.select()
      .from(learningSessions)
      .where(eq(learningSessions.userId, userId))
      .orderBy(desc(learningSessions.createdAt))
      .limit(20);

    let errorDistribution: { type: string, count: number }[] = [];
    
    if (sessions.length > 0) {
      const distributions = await db.select({
        type: errorLogs.errorType,
        count: sql<number>`cast(count(${errorLogs.id}) as integer)`
      })
      .from(errorLogs)
      .innerJoin(learningSessions, eq(errorLogs.sessionId, learningSessions.id))
      .where(eq(learningSessions.userId, userId))
      .groupBy(errorLogs.errorType);

      errorDistribution = distributions;
    }

    // reverse so it is chronological for charts
    const trends = sessions.reverse().map(s => ({
      date: new Date(s.createdAt).toLocaleDateString(),
      score: s.score,
      mode: s.mode
    }));

    return NextResponse.json({ 
      trends, 
      distribution: errorDistribution 
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
