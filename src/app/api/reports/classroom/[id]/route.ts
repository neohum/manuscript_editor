import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { classrooms, classroomMembers, users, learningSessions } from '@/lib/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import { auth } from '@/../auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized (Teacher only)' }, { status: 403 });
  }

  try {
    const { id: classroomId } = await params;

    // Check ownership
    const room = await db.select().from(classrooms).where(eq(classrooms.id, classroomId));
    if (room.length === 0 || room[0].teacherId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden or not found' }, { status: 403 });
    }

    // Get members
    const members = await db.select({
      id: users.id,
      name: users.name,
      level: users.level,
      xp: users.xp,
      joinedAt: classroomMembers.joinedAt,
    })
    .from(classroomMembers)
    .innerJoin(users, eq(classroomMembers.studentId, users.id))
    .where(eq(classroomMembers.classroomId, classroomId));

    if (members.length === 0) {
      return NextResponse.json({ classroom: room[0], members: [] }, { status: 200 });
    }

    const memberIds = members.map(m => m.id);

    // Get learning sessions of members
    const sessions = await db.select()
      .from(learningSessions)
      .where(inArray(learningSessions.userId, memberIds))
      .orderBy(desc(learningSessions.createdAt));

    // Aggregate stats per student
    const studentStats = members.map(student => {
      const studentSessions = sessions.filter(s => s.userId === student.id);
      const totalSessions = studentSessions.length;
      const avgScore = totalSessions > 0 
        ? Math.round(studentSessions.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalSessions) 
        : 0;
      const recentSession = studentSessions.length > 0 ? studentSessions[0] : null;

      return {
        ...student,
        totalSessions,
        avgScore,
        recentScore: recentSession?.score || 0,
        recentActivity: recentSession?.createdAt || null,
      };
    });

    return NextResponse.json({ 
      classroom: room[0], 
      members: studentStats 
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
