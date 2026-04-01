import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorLogs } from '@/lib/db/schema';
import { auth } from '@/../auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, errors } = await req.json();

    if (!errors || errors.length === 0) {
      return NextResponse.json({ message: 'No errors to log' });
    }

    const payload = errors.map((e: any) => ({
      sessionId,
      cellIndex: e.cellIndex,
      errorType: e.errorType,
      wrongText: e.wrongText,
      correctText: e.correctText
    }));

    await db.insert(errorLogs).values(payload);

    return NextResponse.json({ message: 'Logged' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
