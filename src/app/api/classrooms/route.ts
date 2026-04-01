import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { classrooms, classroomMembers, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/../auth';

// 6자리 영문대문자+숫자 무작위 생성
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized (Teacher only)' }, { status: 403 });
  }

  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Invalid classroom name' }, { status: 400 });
    }

    let code = generateInviteCode();
    // In a real app, you would check if code already exists and retry. 
    // For simplicity, collision probability is very low for typical sizes.
    
    const newRoom = await db.insert(classrooms).values({
      teacherId: session.user.id,
      name,
      inviteCode: code,
    }).returning();

    return NextResponse.json({ classroom: newRoom[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role;

  try {
    if (role === 'teacher') {
      // 교사는 본인이 개설한 반 목록
      const myRooms = await db.select()
        .from(classrooms)
        .where(eq(classrooms.teacherId, userId))
        .orderBy(desc(classrooms.createdAt));
      
      return NextResponse.json({ classrooms: myRooms }, { status: 200 });
    } else {
      // 학생은 가입한 반 목록 조인
      const myJoinedRooms = await db.select({
        id: classrooms.id,
        name: classrooms.name,
        teacherId: classrooms.teacherId,
        joinedAt: classroomMembers.joinedAt,
      })
      .from(classroomMembers)
      .innerJoin(classrooms, eq(classroomMembers.classroomId, classrooms.id))
      .where(eq(classroomMembers.studentId, userId))
      .orderBy(desc(classroomMembers.joinedAt));

      // Fetch teacher names optionally, but skipped for simplicity unless requested
      return NextResponse.json({ classrooms: myJoinedRooms }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
