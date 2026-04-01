import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { learningSessions, errorLogs, problems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/../auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await auth();
  if (!sessionUser || !sessionUser.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const sessionRes = await db.select().from(learningSessions).where(eq(learningSessions.id, id));
    if (sessionRes.length === 0) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    const sessionData = sessionRes[0];

    // Only allow owner or teacher to view
    if (sessionData.userId !== sessionUser.user.id && sessionUser.user.role !== 'teacher') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const errors = await db.select().from(errorLogs).where(eq(errorLogs.sessionId, id));
    
    if (sessionData.problemId) {
      const probRes = await db.select().from(problems).where(eq(problems.id, sessionData.problemId));
      if (probRes.length > 0) {
        (sessionData as any).problem = probRes[0];
      }
    }

    return NextResponse.json({ session: sessionData, errors }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
