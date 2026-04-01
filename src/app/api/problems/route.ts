import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { problems } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/../auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized (Teacher only)' }, { status: 403 });
  }

  try {
    const { title, content, mode, level, wrongText } = await req.json();
    
    if (!title || !content || !mode) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const payload: any = {
      title,
      content,
      mode,
      level: parseInt(level) || 1,
      errorHints: {}
    };

    if (mode === 'correction' && wrongText) {
      payload.errorHints = { wrongText };
    }

    const newProblem = await db.insert(problems).values(payload).returning();

    return NextResponse.json({ message: '문제 생성 완료', problem: newProblem[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const levelStr = searchParams.get('level');

    let conditions = [];
    if (mode) conditions.push(eq(problems.mode, mode));
    if (levelStr) conditions.push(eq(problems.level, parseInt(levelStr)));

    const results = await db
      .select()
      .from(problems)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
