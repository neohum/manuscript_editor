import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { problems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode');
  const level = searchParams.get('level');

  let query = db.select({
    id: problems.id,
    level: problems.level,
    mode: problems.mode,
    title: problems.title,
    // Provide a summary without exposing the full content for the list
  }).from(problems);

  try {
    let conditions = [];
    if (mode) conditions.push(eq(problems.mode, mode));
    if (level) conditions.push(eq(problems.level, parseInt(level)));
    
    let results;
    if (conditions.length > 0) {
      // @ts-ignore - drizzle typed varargs
      results = await query.where(and(...conditions));
    } else {
      results = await query;
    }
    
    return NextResponse.json(results);
  } catch (err) {
    console.error('Failed to fetch problems', err);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}
