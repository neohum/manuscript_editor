import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { problems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const problem = await db.select().from(problems).where(eq(problems.id, id)).limit(1);
    
    if (problem.length === 0) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }
    
    return NextResponse.json(problem[0]);
  } catch (err) {
    console.error('Failed to fetch problem detail', err);
    return NextResponse.json({ error: 'Server details' }, { status: 500 });
  }
}
