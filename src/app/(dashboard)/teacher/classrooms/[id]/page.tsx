"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentErrorTable } from '@/components/reports/StudentErrorTable';
import Link from 'next/link';
import { use } from 'react';

export default function ClassroomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await fetch(`/api/reports/classroom/${unwrappedParams.id}`);
        if (!res.ok) {
          router.replace('/teacher');
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClassroom();
  }, [unwrappedParams.id, router]);

  if (loading) return <div>불러오는 중...</div>;
  if (!data || !data.classroom) return <div>학급 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold font-serif text-indigo-900 flex items-center gap-3">
            <i className="fi fi-rr-book-open-reader text-indigo-500"></i>
            {data.classroom.name}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">학급 고유 초대 코드: <strong className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono tracking-widest">{data.classroom.inviteCode}</strong></p>
        </div>
        <Link href="/teacher" className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
          목록으로 돌아가기
        </Link>
      </div>

      <StudentErrorTable students={data.members} classroomName={data.classroom.name} />
    </div>
  );
}
