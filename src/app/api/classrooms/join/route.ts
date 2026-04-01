import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { classrooms, classroomMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/../auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== 'student') {
    return NextResponse.json({ message: 'Unauthorized (Student only)' }, { status: 403 });
  }

  try {
    const { inviteCode } = await req.json();
    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json({ message: 'Invalid invite code' }, { status: 400 });
    }

    // Find the classroom by code
    const foundRoom = await db.select()
      .from(classrooms)
      .where(eq(classrooms.inviteCode, inviteCode.trim().toUpperCase()));

    if (foundRoom.length === 0) {
      return NextResponse.json({ message: '학급을 찾을 수 없습니다. 초대 코드를 다시 확인해주세요.' }, { status: 404 });
    }

    const roomId = foundRoom[0].id;
    const studentId = session.user.id;

    // Check if already joined
    const existing = await db.select()
      .from(classroomMembers)
      .where(and(eq(classroomMembers.classroomId, roomId), eq(classroomMembers.studentId, studentId)));

    if (existing.length > 0) {
      return NextResponse.json({ message: '이미 가입된 학급입니다.' }, { status: 409 });
    }

    // Insert to classroomMembers
    await db.insert(classroomMembers).values({
      classroomId: roomId,
      studentId: studentId,
    });

    return NextResponse.json({ message: '가입 성공', classroom: foundRoom[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
